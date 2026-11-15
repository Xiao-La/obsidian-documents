/*
 * Pseudocode Suite — generated bundle. Edit files in src/ and run build.py.
 */

const {
  Plugin,
  Modal,
  Menu,
  Notice,
  MarkdownRenderer,
  MarkdownRenderChild,
  Component,
  MarkdownView,
  TFile,
  PluginSettingTab,
  Setting,
  setIcon,
  renderMath,
  finishRenderMath,
  loadMathJax,
} = require('obsidian');

/*
 * Pseudocode Suite — core model.
 * Parses the pseudocode LaTeX dialect used by the old pseudocode-in-obs blocks
 * into a small AST, and serializes that AST back to the same dialect.
 */

const PS = {};

/* ------------------------------------------------------------------ */
/* AST helpers                                                         */
/* ------------------------------------------------------------------ */

let uid = 0;
PS.nextId = () => `n${++uid}`;

PS.node = function node(type, fields) {
  return Object.assign({ id: PS.nextId(), type }, fields || {});
};

PS.CONTAINERS = new Set(['if', 'while', 'for', 'repeat', 'function']);
PS.isContainer = (node) => PS.CONTAINERS.has(node.type);

/** Every statement list directly owned by `node` (if: branches, then else). */
PS.childLists = function childLists(node) {
  if (node.type === 'if') {
    const lists = node.branches.map((branch) => branch.body);
    if (Array.isArray(node.elseBody)) lists.push(node.elseBody);
    return lists;
  }
  return Array.isArray(node.body) ? [node.body] : [];
};

/** Depth-first walk; visit(node, array, index, parent). */
PS.walk = function walk(nodes, visit, parent = null) {
  nodes.forEach((node, index) => {
    visit(node, nodes, index, parent);
    PS.childLists(node).forEach((list) => walk(list, visit, node));
  });
};

/**
 * The statement list of a container that new children go into. For an if,
 * `slot` is a branch index or 'else'; without a slot it is the last segment
 * (else when present), which is what sits visually right above the next row.
 */
PS.slotBody = function slotBody(node, slot) {
  if (node.type === 'if') {
    if (slot === 'else' && node.elseBody) return node.elseBody;
    if (Number.isInteger(slot) && node.branches[slot]) return node.branches[slot].body;
    return node.elseBody || node.branches[node.branches.length - 1].body;
  }
  return node.body || [];
};
PS.bodyOf = (node) => PS.slotBody(node);

/**
 * Move a node within the tree. `mode` is 'before' | 'after' | 'inside'
 * (`slot` picks the if segment for 'inside'). Refuses to move a node into
 * its own subtree.
 */
PS.reorder = function reorder(nodes, dragId, targetId, mode, slot) {
  if (!dragId || !targetId || dragId === targetId) return false;
  const locate = (id) => {
    let found = null;
    PS.walk(nodes, (node, array, index) => {
      if (node.id === id) found = { node, array, index };
    });
    return found;
  };
  const drag = locate(dragId);
  const target = locate(targetId);
  if (!drag || !target) return false;
  if (mode === 'inside' && !PS.isContainer(target.node)) return false;
  let inside = false;
  PS.walk([drag.node], (node) => { if (node.id === targetId) inside = true; });
  if (inside) return false;

  drag.array.splice(drag.index, 1);
  if (mode === 'inside') {
    PS.slotBody(target.node, slot).push(drag.node);
  } else {
    const next = locate(targetId);
    next.array.splice(next.index + (mode === 'after' ? 1 : 0), 0, drag.node);
  }
  return true;
};

/* ------------------------------------------------------------------ */
/* Operators                                                           */
/* ------------------------------------------------------------------ */

/** LaTeX / alternative spellings → the canonical ASCII form the builder shows. */
const OPERATOR_ALIASES = [
  [/\\neq\b/g, '!='],
  [/\\ne\b/g, '!='],
  [/\\leq?\b/g, '<='],
  [/\\geq?\b/g, '>='],
  [/\\gets\b/g, '='],
  [/:=/g, '='],
  [/<-|←/g, '='],
  [/<>/g, '!='],
  [/&&/g, 'and'],
  [/\|\|/g, 'or'],
  [/\\(?:And|AND)\b/g, 'and'],
  [/\\(?:Or|OR)\b/g, 'or'],
  [/\\(?:Not|NOT)\b/g, 'not'],
  // CLRS subarray ranges A[1 . . n] (clrscode \twodots) are typed as `..`.
  [/\s*\\twodots\b\s*/g, '..'],
];

/** Canonical ASCII operators → TeX. */
const SYMBOL_TEX = [
  [/<=/g, '\\le '],
  [/>=/g, '\\ge '],
  [/!=/g, '\\ne '],
  [/->/g, '\\to '],
  [/\s*(?<![.\\])\.\.(?!\.)\s*/g, ' \\twodots '],
];
const WORD_TEX = [
  // Inside math (a field written with backslashes): roman words, as in CLRS.
  [/(?<![\\{])\b(and|or|not)\b/g, '\\text{ $1 }'],
];

const applyAll = (text, table) => table.reduce((value, [pattern, replacement]) => value.replace(pattern, replacement), text);

/** Normalize operators typed in the builder (or read from LaTeX) to ASCII. */
PS.normalizeOperators = function normalizeOperators(text) {
  return applyAll(String(text == null ? '' : text), OPERATOR_ALIASES);
};

/** ASCII operators and logic words → TeX (inside math). */
PS.texOperators = function texOperators(text, words = true) {
  const value = applyAll(String(text), SYMBOL_TEX);
  return words ? applyAll(value, WORD_TEX) : value;
};

// Font commands keep their argument as written; mask them while rewriting.
const FONT_GROUP = /\\(?:text|textbf|textit|texttt|textrm|textsf|textup|textsc|mathrm|mathit|mathbf|mathsf|mathtt|operatorname|Call)\{[^{}]*\}/g;

PS.maskFontGroups = function maskFontGroups(tex, transform) {
  const kept = [];
  const masked = String(tex).replace(FONT_GROUP, (group) => `\u0000${kept.push(group) - 1}\u0001`);
  return transform(masked).replace(/\u0000(\d+)\u0001/g, (all, index) => kept[Number(index)]);
};

/* ------------------------------------------------------------------ */
/* LaTeX helpers                                                       */
/* ------------------------------------------------------------------ */

/** Read a balanced `{...}` group starting at text[start] (which must be "{"). */
function readGroup(text, start) {
  if (text[start] !== '{') return null;
  let depth = 0;
  let value = '';
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      depth += 1;
      if (depth === 1) continue;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { value, end: i + 1 };
    }
    value += ch;
  }
  return { value, end: text.length }; // unbalanced: consume the rest
}

function firstGroup(text) {
  const start = text.indexOf('{');
  if (start < 0) return null;
  return readGroup(text, start);
}

/** Split a trailing `\Comment{...}` off a line. */
function splitComment(text) {
  const match = String(text).match(/^(.*?)\s*\\Comment\{([\s\S]*)\}\s*$/);
  if (!match) return { body: String(text), comment: null };
  return { body: match[1], comment: match[2] };
}

const countDollars = (value) => (value.match(/\$/g) || []).length;

function isSingleMath(text) {
  const value = String(text == null ? '' : text).trim();
  return value.startsWith('$') && value.endsWith('$') && countDollars(value) === 2;
}

const subscript = (all, letter, digits) => (digits.length === 1 ? `${letter}_${digits}` : `${letter}_{${digits}}`);
// Not before "(": an explicit \mathrm{Parent}(i) is a function name the
// author chose to set upright, not a procedure call (see PS.splitCalls).
const UNWRAP_FONT = /\\(?:text(?:bf|it|rm|sf|up)?|mathrm|mathit|mathbf)\{([^{}]*)\}(?!\()/g;

/**
 * Normalize a LaTeX fragment into something better for the visual editor:
 * drop `$` delimiters, turn \gets into "=", unwrap \mathrm/\text/\textbf, etc.
 * (\texttt marks code identifiers and is kept.)
 */
function fromMath(text) {
  let value = String(text == null ? '' : text).trim();
  const single = isSingleMath(value);
  if (single) value = value.slice(1, -1).trim();
  value = PS.normalizeOperators(value)
    .replace(/\\To\b/g, 'to')
    .replace(/\\DownTo\b/g, 'downto');
  // Innermost first; repeat so nested \mathrm{..\text{..}..} unwraps. In mixed text
  // (`\textbf{not} $S.\mathrm{empty}()$`) only inside the math runs: outside them the
  // font is the author's (bold keywords) and must survive a save.
  const unwrap = (text) => {
    // An explicit italic all-caps name (\mathit{KB}) is a variable, not the constant KB.
    const kept = [];
    let chunk = text.replace(/\\mathit\{[A-Z][A-Z0-9]+\}/g, (group) => `\u0002${kept.push(group) - 1}\u0003`);
    for (let previous = null; previous !== chunk;) {
      previous = chunk;
      chunk = chunk.replace(UNWRAP_FONT, '$1');
    }
    return chunk
      .replace(/\\textsc\{([a-z]+)\}/g, (all, word) => word.toUpperCase())
      .replace(/\u0002(\d+)\u0003/g, (all, index) => kept[Number(index)]);
  };
  value = value.includes('$')
    ? value.split(/(\$[^$]*\$)/).map((chunk, index) => (index % 2 ? unwrap(chunk) : chunk)).join('')
    // Prose without any math (`\Return \textbf{true}`) keeps its fonts as written.
    : single ? unwrap(value) : value;
  value = value
    .replace(/([A-Za-z])_\{(\d+)\}/g, subscript)
    .replace(/\\textbackslash\b/g, '\\')
    .replace(/\\_/g, '_')
    .replace(/\\[,;: ]/g, ' ');
  // `\State \text{}` is the empty placeholder of a comment-only line.
  return value.replace(/\\text\{\}/g, '').replace(/[ \t]+/g, ' ').trim();
}

PS.readGroup = readGroup;
PS.firstGroup = firstGroup;
PS.splitComment = splitComment;
PS.fromMath = fromMath;
PS.isSingleMath = isSingleMath;

/* ------------------------------------------------------------------ */
/* Procedure calls inside expressions                                  */
/* ------------------------------------------------------------------ */

/*
 * In builder fields a capitalized name directly followed by "(" is a
 * procedure call, typeset like \Call (small caps): `return Merge-Sort(A, p, r)`,
 * `x = Extract-Min(Q)`. Single letters stay math (T(n), O(n)); so does any
 * field containing a backslash, which is the escape hatch (\mathrm{Pr}(A)).
 *
 * The words and / or / not are written as words, never as ∧ ∨ ¬. CLRS sets them in
 * roman between the math (clrscode: `\While $i > 0$ and $A[i] > \id{key}$`), so
 * they are saved as plain text between math runs; only `error` is bold.
 */
const CALL_AT = /(?<![A-Za-z0-9_.'])([A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*)\(/g;
const isCallName = (name) => /^[A-Z][A-Za-z0-9]*(?:-[A-Za-z0-9]+)*$/.test(name) && (name.match(/[A-Za-z]/g) || []).length >= 2;
const LOGIC_WORD = /(?<![A-Za-z0-9_.])(and|or|not)(?![A-Za-z0-9_])/g;
// `\textbf{and}` is how older notes wrote them; read, and saved back as plain words.
const LOGIC_TEX = /^\\textbf\{(and|or|not|error)\}/;
const LOGIC_PLAIN = /^(and|or|not)(?![A-Za-z0-9_])/;
// Quoted strings stay text, with typographic quotes: error “heap underflow”.
const STRING = /(“[^”]*”|"[^"]*")/;

/** Split text into text and keyword parts. */
function splitLogic(value) {
  const parts = [];
  let last = 0;
  LOGIC_WORD.lastIndex = 0;
  for (let match; (match = LOGIC_WORD.exec(value));) {
    if (match.index > last) parts.push({ type: 'text', value: value.slice(last, match.index) });
    parts.push({ type: 'keyword', value: match[1] });
    last = match.index + match[0].length;
  }
  if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
  return parts;
}

/** Split plain text into text, call and keyword parts, or null if it has none of the latter. */
function splitCalls(text) {
  const value = String(text == null ? '' : text);
  if (value.includes('\\') || value.includes('$')) return null;
  const parts = [];
  let last = 0;
  const pushText = (chunk) => {
    chunk.split(STRING).forEach((piece, index) => {
      if (!piece) return;
      if (index % 2) parts.push({ type: 'string', value: piece.slice(1, -1) });
      else parts.push(...splitLogic(piece));
    });
  };
  const lead = value.match(/^\s*error(?=\s|$)/);
  if (lead) {
    parts.push({ type: 'keyword', value: 'error' });
    last = lead[0].length;
  }
  CALL_AT.lastIndex = last;
  for (let match; (match = CALL_AT.exec(value));) {
    if (!isCallName(match[1])) continue;
    const open = match.index + match[0].length - 1;
    let depth = 0;
    let close = -1;
    for (let i = open; i < value.length && close < 0; i++) {
      if (value[i] === '(') depth += 1;
      else if (value[i] === ')' && --depth === 0) close = i;
    }
    if (close < 0) continue;
    pushText(value.slice(last, match.index));
    parts.push({ type: 'call', name: match[1], args: value.slice(open + 1, close) });
    last = close + 1;
    CALL_AT.lastIndex = last;
  }
  pushText(value.slice(last));
  return parts.some((part) => part.type !== 'text') ? parts : null;
}

/**
 * Plain text with calls or logic words → inline LaTeX: math runs as `$...$`
 * (through `mathFn`), calls as \Call{Name}{args}, and / or / not as plain words,
 * error as \textbf{error}.
 * Null when there is neither.
 */
function inlineWithCalls(text, mathFn) {
  const parts = splitCalls(text);
  if (!parts) return null;
  const math = (segment) => {
    const [, before, body, after] = segment.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!body) return segment ? ' ' : '';
    return `${before ? ' ' : ''}$${mathFn(body)}$${after ? ' ' : ''}`;
  };
  return parts.map((part) => {
    if (part.type === 'call') return `\\Call{${part.name}}{${inlineWithCalls(part.args, mathFn) || math(part.args).trim()}}`;
    if (part.type === 'keyword') return part.value === 'error' ? '\\textbf{error}' : part.value;
    if (part.type === 'string') return `“${part.value}”`;
    return math(part.value);
  }).join('').trim();
}

/**
 * The reverse, for the builder: `$x =$ \Call{Left}{$i$}` → `x = Left(i)`,
 * `$i > 0$ and $A[i] > \mathit{key}$` → `i > 0 and A[i] > key`.
 * Only for text made of nothing but math runs, calls and keywords; null otherwise.
 */
function callsToPlain(raw) {
  const text = String(raw == null ? '' : raw).trim();
  let out = '';
  let found = 0;
  let constants = 0;
  let i = 0;
  while (i < text.length) {
    if (text[i] === '“') {
      const end = text.indexOf('”', i + 1);
      if (end < 0) return null;
      out += text.slice(i, end + 1);
      i = end + 1;
      continue;
    }
    const constant = text.slice(i).match(/^\\textsc\{([a-z]+)\}/);
    if (constant) {
      out += constant[1].toUpperCase();
      constants += 1;
      i += constant[0].length;
      continue;
    }
    if (/\s/.test(text[i])) {
      while (i < text.length && /\s/.test(text[i])) i++;
      out += ' ';
      continue;
    }
    if (text[i] === '$') {
      const end = text.indexOf('$', i + 1);
      if (end < 0) return null;
      out += fromMath(text.slice(i, end + 1));
      i = end + 1;
      continue;
    }
    // Bare punctuation between calls (`\Call{A}{$i$}, \Call{B}{$j$}`); words would change font.
    if (/[,;:()[\]+\-*/=<>]/.test(text[i])) {
      out += text[i++];
      continue;
    }
    const keyword = text.slice(i).match(LOGIC_TEX) || text.slice(i).match(LOGIC_PLAIN);
    if (keyword) {
      out += ` ${keyword[1]} `;
      found += 1;
      i += keyword[0].length;
      continue;
    }
    const call = text.slice(i).match(/^\\Call\{([^{}]*)\}/);
    if (!call || !isCallName(call[1])) return null;
    const args = readGroup(text, i + call[0].length);
    if (!args) return null;
    const inner = !args.value.trim() ? ''
      : callsToPlain(args.value) ?? (isSingleMath(args.value) ? fromMath(args.value) : null);
    if (inner == null) return null;
    out += `${call[1]}(${inner})`;
    found += 1;
    i = args.end;
  }
  const plain = out.replace(/\s+/g, ' ').replace(/\(\s+/g, '(').replace(/\s+\)/g, ')').trim();
  // Anything still carrying LaTeX would not survive the trip back.
  if (/[\\$]/.test(plain)) return null;
  if (found) return inlineWithCalls(plain, (s) => s) ? plain : null;
  return constants ? plain : null;
}

PS.splitCalls = splitCalls;
PS.inlineWithCalls = inlineWithCalls;
PS.callsToPlain = callsToPlain;

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */

// Lines whose own `{...}` groups must not swallow a trailing \Comment.
const COMMENTABLE = new Set([
  'Function', 'Procedure', 'If', 'Elif', 'ElsIf', 'ElseIf', 'Else', 'While', 'For', 'ForAll', 'Repeat', 'Until',
  'Call', 'Break', 'Continue',
]);

// Fields that may be calls, constants or math joined by logic words.
const LOGIC_SOURCE = /\\Call\b|\\textbf\{(?:and|or|not|error)\}|\\textsc\{|(?:^|\$)\s*(?:and|or|not)\s+\$/;

/** `{ field: value, fieldMath: wasSingleMath }` for a math-carrying field. */
function mathField(name, raw) {
  // Older notes set the logic words bold; CLRS has them roman, as plain words.
  const source = (raw == null ? '' : raw).replace(/\\textbf\{(and|or|not)\}/g, '$1');
  const plain = LOGIC_SOURCE.test(source) ? callsToPlain(source) : null;
  if (plain != null) return { [name]: plain, [`${name}Math`]: true };
  return { [name]: fromMath(source), [`${name}Math`]: isSingleMath(source) };
}

/** A condition field: a single `=` there is a test, read (and saved) as `==`. */
function conditionField(name, raw) {
  const out = mathField(name, raw);
  const value = out[name];
  out[name] = out[`${name}Math`]
    ? PS.asComparison(value)
    : value.replace(/\$([^$]*)\$/g, (all, inner) => `$${PS.asComparison(inner)}$`);
  return out;
}

/** Join physical lines: an odd number of `$` continues on the next line. */
function logicalLines(source) {
  const lines = [];
  let pending = '';
  for (const piece of String(source == null ? '' : source).split(/\r?\n/)) {
    pending = pending ? `${pending} ${piece.trim()}` : piece;
    if (countDollars(pending) % 2 === 0) {
      lines.push(pending);
      pending = '';
    }
  }
  if (pending) lines.push(pending);
  return lines;
}

PS.parseLatex = function parseLatex(source) {
  const model = { caption: '', nodes: [] };
  const stack = [{ target: model.nodes, node: null }];
  const top = () => stack[stack.length - 1];
  const push = (node) => top().target.push(node);
  const open = (node, target) => {
    push(node);
    stack.push({ target, node });
  };
  const pop = () => {
    if (stack.length > 1) stack.pop();
  };

  for (const rawLine of logicalLines(source)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^\\(?:[Bb]egin|[Ee]nd)\{algorithm(?:ic)?\}/.test(line)) continue;
    if (/^\\label\{/.test(line)) continue;

    const match = line.match(/^\\([A-Za-z]+)([\s\S]*)$/);
    if (!match) {
      const { body, comment } = splitComment(line);
      push(withComment(PS.node('raw', { text: body.trim() }), comment));
      continue;
    }
    const name = match[1];
    let rest = (match[2] || '').trim();
    let lineComment = null;
    if (COMMENTABLE.has(name)) {
      const split = splitComment(rest);
      rest = split.body.trim();
      lineComment = split.comment;
    }
    const group = firstGroup(rest);

    switch (name) {
      case 'caption':
        model.caption = group ? group.value : rest;
        break;

      case 'Function':
      case 'Procedure': {
        const args = group ? readGroup(rest, group.end) : null;
        const node = PS.node('function', Object.assign(
          { kind: name, name: group ? group.value : '' },
          mathField('args', args ? args.value : ''),
          { body: [] },
        ));
        open(withComment(node, lineComment), node.body);
        break;
      }

      case 'If': {
        const branch = Object.assign(conditionField('cond', group ? group.value : ''), { body: [] });
        const node = PS.node('if', { branches: [branch], elseBody: null });
        open(withComment(node, lineComment), branch.body);
        break;
      }
      case 'Elif':
      case 'ElsIf':
      case 'ElseIf': {
        const { node } = top();
        if (!node || node.type !== 'if') break;
        const branch = withComment(Object.assign(conditionField('cond', group ? group.value : ''), { body: [] }), lineComment);
        node.branches.push(branch);
        stack[stack.length - 1] = { target: branch.body, node };
        break;
      }
      case 'Else': {
        const { node } = top();
        if (!node || node.type !== 'if') break;
        node.elseBody = [];
        if (lineComment !== null) node.elseComment = lineComment;
        stack[stack.length - 1] = { target: node.elseBody, node };
        break;
      }

      case 'While': {
        const node = PS.node('while', Object.assign(conditionField('cond', group ? group.value : ''), { body: [] }));
        open(withComment(node, lineComment), node.body);
        break;
      }

      case 'ForAll': {
        const clean = fromMath(group ? group.value : '').replace(/\$/g, '').trim();
        const node = PS.node('for', { all: true, init: clean, initMath: false, bound: '', body: [] });
        open(withComment(node, lineComment), node.body);
        break;
      }
      case 'For': {
        const content = group ? group.value : '';
        const parts = content.split(/\s*(?:\\textbf\{(?:to|downto)\}|\\To\b|\\DownTo\b|\bto\b|\bdownto\b)\s*/i);
        const bound = parts.length > 1 ? parts.slice(1).join('') : '';
        const node = PS.node('for', Object.assign(
          mathField('init', parts[0] || ''),
          parts.length > 1 ? mathField('bound', bound) : { bound: '', boundMath: false },
          { downto: /\bDownTo\b/i.test(content), body: [] },
        ));
        open(withComment(node, lineComment), node.body);
        break;
      }

      case 'Repeat': {
        const node = PS.node('repeat', { body: [], until: '' });
        open(withComment(node, lineComment), node.body);
        break;
      }
      case 'Until': {
        const { node } = top();
        if (!node || node.type !== 'repeat') break;
        Object.assign(node, conditionField('until', group ? group.value : ''));
        if (lineComment !== null) node.untilComment = lineComment;
        pop();
        break;
      }

      case 'EndFunction':
      case 'EndProcedure':
      case 'EndIf':
      case 'EndWhile':
      case 'EndFor':
        pop();
        break;

      case 'State': {
        const { body, comment } = splitComment(rest);
        // \State \Return / \Break / \Continue / \Print are common shorthand.
        const keyword = body.match(/^\\(Return|Break|Continue|Print)\b\s*([\s\S]*)$/);
        const call = body.match(/^\\Call\{([^{}]*)\}\{([\s\S]*)\}$/);
        let node;
        if (keyword) {
          const kind = keyword[1].toLowerCase();
          node = kind === 'break' || kind === 'continue'
            ? PS.node(kind)
            : PS.node(kind, mathField('text', keyword[2]));
        } else if (call) {
          node = PS.node('call', Object.assign({ name: call[1] }, mathField('args', call[2])));
        } else {
          node = PS.node('state', mathField('text', body));
        }
        push(withComment(node, comment));
        break;
      }

      case 'Call': {
        const args = group ? readGroup(rest, group.end) : null;
        push(withComment(PS.node('call', Object.assign(
          { name: group ? group.value : '' },
          mathField('args', args ? args.value : ''),
        )), lineComment));
        break;
      }

      case 'Require':
      case 'Ensure':
      case 'Input':
      case 'Output':
      case 'Return':
      case 'Print': {
        const { body, comment } = splitComment(rest);
        const inner = body.startsWith('{') ? firstGroup(body) : null;
        const type = name === 'Input' ? 'require'
          : name === 'Output' ? 'ensure'
            : name.toLowerCase();
        push(withComment(PS.node(type, mathField('text', inner ? inner.value : body)), comment));
        break;
      }

      case 'Break':
      case 'Continue':
        push(withComment(PS.node(name.toLowerCase()), lineComment));
        break;

      case 'Comment': {
        // A standalone \Comment line belongs to the previous statement (LaTeX
        // joins the lines); only a comment that opens a body stands alone.
        const text = group ? group.value : rest;
        const array = top().target;
        const previous = array[array.length - 1];
        if (previous && !previous.comment) previous.comment = text;
        else array.push(PS.node('comment', { text }));
        break;
      }

      case 'Statex':
        // \Statex is a blank spacing line in algorithmicx; render nothing.
        break;

      default: {
        const { body, comment } = splitComment(line);
        push(withComment(PS.node('raw', { text: body.trim() }), comment));
      }
    }
  }
  return model;
};

function withComment(target, comment) {
  if (comment != null) target.comment = comment;
  return target;
}

/* ------------------------------------------------------------------ */
/* Serializer                                                          */
/* ------------------------------------------------------------------ */

const KEYWORD_WORDS = new Set(['and', 'or', 'not']);

// A word rendered upright in math; spaces next to one are real word gaps.
const WORDISH = String.raw`\\(?:mathrm|text|textbf|textsc)\{[^{}]*\}`;
const SPACE_AFTER_WORD = new RegExp(`(${WORDISH})\\s+(?=[A-Za-z0-9(\\[“‘"']|${WORDISH})`, 'g');
const SPACE_BEFORE_WORD = new RegExp(`((?<!\\\\[A-Za-z]*)[A-Za-z0-9\\])”’"'])\\s+(?=${WORDISH})`, 'g');

// Upright math operators, as in CLRS: max(a, b), lg n, x mod y. Only when used as one
// (`max = A[1]` is the variable *max*).
const MATH_FUNCTIONS = new Set(['max', 'min', 'gcd', 'lcm', 'exp', 'sin', 'cos', 'lg', 'log', 'ln']);
const PREFIX_OPERATORS = new Set(['lg', 'log', 'ln']);

/** CLRS constants (NIL, TRUE, FALSE, OVERFLOW) are small caps: `\textsc{nil}`. */
const constantTex = (word) => `\\textsc{${word.toLowerCase()}}`;

/**
 * Builder typesetting rules for a math fragment, following CLRS: multi-letter
 * identifiers italic (*key*, *heap-size*), words of a phrase upright
 * ("exchange A[i] with A[j]"), constants and booleans in small caps, digits
 * after a letter as subscripts, ASCII operators as TeX. Font groups already
 * present are kept.
 */
function normalizeExpr(expr) {
  const out = PS.maskFontGroups(expr, (masked) => {
    const words = masked
      .replace(/([A-Za-z])_\{(\d+)\}/g, subscript)
      .replace(/([A-Za-z])_?(\d+)/g, subscript)
      .replace(/([A-Za-z])-([A-Za-z])/g, '$1\\text{-}$2')
      .replace(/(?<!\\)\b[A-Za-z]{2,}\b/g, (word, offset, text) => {
        const before = text.slice(0, offset);
        const after = text.slice(offset + word.length);
        if (/^[A-Z]{2,}$/.test(word) || /^(true|false)$/i.test(word)) return constantTex(word);
        if (KEYWORD_WORDS.has(word)) return word;
        if (word === 'mod') return '\\bmod';
        if (MATH_FUNCTIONS.has(word)
          && (/^\s*\(/.test(after) || (PREFIX_OPERATORS.has(word) && /^\s+[A-Za-z0-9\\]/.test(after)))) {
          return `\\${word}`;
        }
        // A word spaced off from a neighbouring word or variable is part of a phrase.
        const phrase = /^\s+(?:[A-Za-z0-9(“"']|\u0000)/.test(after)
          || /(?:(?<!\\[A-Za-z]*)[A-Za-z0-9]|[)\]”"']|\u0001)\s+$/.test(before);
        return phrase ? `\\mathrm{${word}}` : `\\mathit{${word}}`;
      });
    return PS.texOperators(words);
  });
  // Math mode drops spaces: "exchange A[i] with A[j]" needs explicit gaps.
  return out
    .replace(SPACE_AFTER_WORD, '$1\\ ')
    .replace(SPACE_BEFORE_WORD, '$1\\ ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Turn a plain builder expression into a LaTeX math fragment (with $...$). */
function toMath(raw) {
  let expr = String(raw == null ? '' : raw).trim();
  if (isSingleMath(expr)) expr = expr.slice(1, -1).trim();
  if (!expr) return '';
  // CJK prose must stay outside math mode.
  if (/[一-鿿]/.test(expr)) return expr;
  if (expr.includes('\\')) return `$${normalizeExpr(expr)}$`;
  return inlineWithCalls(expr, normalizeExpr) || `$${normalizeExpr(expr)}$`;
}

/**
 * Serialize one field. `isMath === false` marks text that was prose in the
 * source (`\State Initialize the array`): it stays prose instead of being
 * turned into math. Text already carrying `$...$` keeps its structure.
 */
function mathOrRaw(text, isMath) {
  const value = String(text == null ? '' : text);
  if (!value) return '';
  if (!value.includes('$')) {
    if (isMath !== false) return toMath(value);
    return value.includes('\\') ? PS.texOperators(value, false).replace(/[ \t]{2,}/g, ' ') : value;
  }
  return value
    .replace(/\$([^$]+)\$/g, (all, inner) =>
      `$${normalizeExpr(inner)}$`)
    .replace(/[ \t]{2,}/g, ' ');
}

PS.toMath = toMath;
PS.normalizeExpr = normalizeExpr;
PS.mathOrRaw = mathOrRaw;

const commentSuffix = (comment) => (comment ? ` \\Comment{${comment}}` : '');
const field = (node, key) => mathOrRaw(node[key], node[`${key}Math`]);

// CLRS: `=` assigns, `==` tests. A single `=` in a condition is written as `==`.
const asComparison = (tex) => tex.replace(/(?<![<>=!:\\])=(?!=)/g, '==');
PS.asComparison = asComparison;
const condition = (node, key) => field(node, key).replace(/\$([^$]*)\$/g, (all, inner) => `$${asComparison(inner)}$`);

/** `v in S` → `$v \\in S$`; a head written with text commands stays as written. */
function forAllHead(init) {
  if (!init || /\\text(?:tt|rm|sf|up)?\{|\$/.test(init)) return init;
  const parts = init.split(/\s+(?:in|\\in)\s+/);
  if (parts.length === 2) return `$${normalizeExpr(parts[0])} \\in ${normalizeExpr(parts[1])}$`;
  return toMath(init);
}

function emitNodes(nodes, depth, out) {
  const pad = '  '.repeat(depth);
  const line = (text, comment) => out.push(`${pad}${text}${commentSuffix(comment)}`);
  const body = (list) => emitNodes(list, depth + 1, out);

  for (const node of nodes) {
    switch (node.type) {
      case 'state':
      {
        // A comment-only line is `\State \Comment{...}`; `\text{}` only keeps an empty one alive.
        const text = field(node, 'text');
        line(text ? `\\State ${text}` : node.comment ? '\\State' : '\\State \\text{}', node.comment);
      }
        break;
      case 'call':
        line(`\\State \\Call{${node.name || ''}}{${field(node, 'args')}}`, node.comment);
        break;
      case 'require':
      case 'ensure':
        line(`\\${node.type === 'require' ? 'Require' : 'Ensure'} ${field(node, 'text')}`, node.comment);
        break;
      case 'return':
        line(`\\Return${node.text ? ` ${field(node, 'text')}` : ''}`, node.comment);
        break;
      case 'print':
        line(`\\Print ${field(node, 'text')}`, node.comment);
        break;
      case 'break':
        line('\\Break', node.comment);
        break;
      case 'continue':
        line('\\Continue', node.comment);
        break;
      case 'comment':
        line(`\\Comment{${node.text || ''}}`);
        break;
      case 'if':
        node.branches.forEach((branch, index) => {
          line(`${index === 0 ? '\\If' : '\\Elif'}{${condition(branch, 'cond')}}`, index === 0 ? node.comment : branch.comment);
          body(branch.body);
        });
        if (node.elseBody) {
          line('\\Else', node.elseComment);
          body(node.elseBody);
        }
        line('\\EndIf');
        break;
      case 'while':
        line(`\\While{${condition(node, 'cond')}}`, node.comment);
        body(node.body);
        line('\\EndWhile');
        break;
      case 'for': {
        const head = node.all
          ? forAllHead(node.init || '')
          : node.bound
            ? `${field(node, 'init')} ${node.downto ? '\\DownTo' : '\\To'} ${field(node, 'bound')}`
            : field(node, 'init');
        line(`\\${node.all ? 'ForAll' : 'For'}{${head}}`, node.comment);
        body(node.body);
        line('\\EndFor');
        break;
      }
      case 'repeat':
        line('\\Repeat', node.comment);
        body(node.body);
        line(`\\Until{${condition(node, 'until')}}`, node.untilComment);
        break;
      case 'function': {
        const kind = node.kind === 'Procedure' ? 'Procedure' : 'Function';
        line(`\\${kind}{${node.name || ''}}{${field(node, 'args')}}`, node.comment);
        body(node.body);
        line(`\\End${kind}`);
        break;
      }
      default:
        line(node.text || '', node.comment);
    }
  }
}

PS.serializeLatex = function serializeLatex(model) {
  const out = ['\\begin{algorithm}'];
  if (model.caption) out.push(`\\caption{${model.caption}}`);
  out.push('\\begin{algorithmic}');
  emitNodes(model.nodes, 1, out);
  out.push('\\end{algorithmic}');
  out.push('\\end{algorithm}');
  return out.join('\n');
};

/*
 * Pseudocode Suite — flat renderer.
 * Turns the AST into the CLRS-looking DOM directly; no post-processing pass.
 */

((PS) => {

  const FONT_COMMANDS = {
    textbf: 'strong',
    textit: 'em',
    texttt: 'code',
    textrm: 'span',
    textsf: 'span',
    textup: 'span',
    textsc: 'span',
    textnormal: 'span',
    mathrm: 'span',
    mathit: 'em',
    mathbf: 'strong',
  };

  const SYMBOLS = {
    gets: '=',
    le: '≤',
    ge: '≥',
    ne: '≠',
    ldots: '…',
    cdots: '⋯',
    times: '×',
    pm: '±',
    infty: '∞',
    to: '→',
    DownTo: '↓',
    And: '∧',
    Or: '∨',
    Not: '¬',
    lfloor: '⌊',
    rfloor: '⌋',
    lceil: '⌈',
    rceil: '⌉',
    quad: ' ',
    qquad: ' ',
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // In a condition a single `=` is a comparison and shows as `==`.
  const asComparison = (tex) => PS.asComparison(tex);

  /** A field value → inline source for parseInline (math wrapped in $...$). */
  const expr = (value, isMath, comparison) => {
    const text = String(value == null ? '' : value);
    if (!text) return '';
    if (isMath && !text.includes('$')) {
      // Constants and booleans are text, not a product of variables.
      if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(text) || /^(true|false)$/i.test(text)) return `\\textsc{${text.toLowerCase()}}`;
      const math = (segment) => {
        const tex = PS.normalizeExpr(segment);
        return comparison ? asComparison(tex) : tex;
      };
      const plain = PS.normalizeOperators(text);
      // Merge-Sort(A, p, r) inside an expression renders like \Call.
      return PS.inlineWithCalls(plain, math) || `$${math(plain)}$`;
    }
    // Conditions mixing text and math ($a = b$ and $c$): `=` still means `==`.
    if (comparison) return text.replace(/\$([^$]*)\$/g, (all, inner) => `$${asComparison(inner)}$`);
    return text;
  };

  /*
   * CLRS sets constants (NIL, TRUE, FALSE) in small caps. MathJax has no \textsc,
   * so they leave the formula and render like procedure names. An operator left
   * at the cut gets an empty group so TeX still spaces it as an operator.
   */
  const CONSTANT_TEX = /\\textsc\{([A-Za-z]+)\}|\\(?:text|textrm|textup|textsf|mathrm|mathsf)\{([A-Z][A-Z0-9]+)\}/g;
  const EDGE_OP = String.raw`(?:[=<>+\-*,;:]|\\(?:ne|neq|le|leq|ge|geq|to|in|notin|gets|subset|subseteq|supset|supseteq|approx|equiv|sim|mapsto|pm|mp|cdot|times|div|land|lor|wedge|vee|cup|cap|setminus|circ|oplus|otimes)(?![A-Za-z]))`;
  const ENDS_WITH_OP = new RegExp(`${EDGE_OP}\\s*$`);
  // CLRS's narrow test-for-equality sign (clrscode3e \isequal); styled by .ps-eq.
  const IS_EQUAL = String.raw`\mathrel{\class{ps-eq}{=}\mkern1.8mu\class{ps-eq}{=}}`;
  // CLRS assignment (clrscode \gets): `=` with 1pt more room on each side. Code only;
  // in comments `=` is equality.
  const GETS = String.raw`\mathrel{\mkern1.8mu{=}\mkern1.8mu}`;
  const STARTS_WITH_OP = new RegExp(`^\\s*${EDGE_OP}`);

  function splitConstants(tex, prose) {
    const tokens = [];
    let last = 0;
    let previousConstant = false;
    const pushMath = (piece, nextConstant) => {
      let value = piece.trim();
      if (!value) return;
      if (previousConstant && STARTS_WITH_OP.test(value)) value = `{}${value}`;
      if (nextConstant && ENDS_WITH_OP.test(value)) value = `${value}{}`;
      if (!prose) value = value.replace(/(?<![=<>!:{])=(?![=}])/g, GETS);
      tokens.push({ type: 'math', value: value.replace(/(?<![=<>!])==(?!=)/g, IS_EQUAL) });
    };
    CONSTANT_TEX.lastIndex = 0;
    for (let match; (match = CONSTANT_TEX.exec(tex));) {
      pushMath(tex.slice(last, match.index), true);
      // \textsc{...} as written (\textsc{Evaluate} keeps its capital); legacy \text{NIL} → nil.
      tokens.push({ type: 'constant', value: match[1] || match[2].toLowerCase() });
      previousConstant = true;
      last = match.index + match[0].length;
    }
    pushMath(tex.slice(last), false);
    return tokens;
  }

  function skipSpace(text, index) {
    let i = index;
    while (i < text.length && /\s/.test(text[i])) i++;
    return i;
  }

  /** `$...$` from the source → TeX for MathJax. */
  function normalizeMath(source, prose) {
    const tex = PS.maskFontGroups(source, (masked) => PS.texOperators(PS.normalizeOperators(masked))
      .replace(/\\To\b/g, '\\to')
      .replace(/\\DownTo\b/g, '\\downarrow'))
      .replace(/\\textbf\{([^{}]*)\}/g, '\\mathbf{$1}')
      .replace(/\\textit\{([^{}]*)\}/g, '\\mathit{$1}');
    // Comments are prose: `$ab$` there is a product, not an identifier.
    // MathJax spaces a bare `.` as punctuation (`x. key`); in TeX and CLRS the attribute
    // dot is ordinary, so it goes in a group: `x{.}\mathit{key}`. Decimals are left alone.
    return (prose ? tex : PS.normalizeExpr(tex))
      .replace(/(?<=[A-Za-z0-9}\])])\.(?=\s*(?:[A-Za-z]|\\(?:math|text)))/g, '{.}')
      // clrscode's \twodots: the range dots of A[1 . . n].
      .replace(/\\twodots\b\s*/g, '\\mathinner{\\ldotp\\ldotp}')
      .trim();
  }

  /**
   * Split a line into tokens that can be rendered: plain text, math, styled
   * text, calls and keyword/function markers.
   */
  function parseInline(source, prose) {
    const text = String(source == null ? '' : source);
    const tokens = [];
    let buffer = '';
    const flush = () => {
      if (!buffer) return;
      tokens.push({ type: 'text', value: buffer });
      buffer = '';
    };
    const group = (at) => PS.readGroup(text, skipSpace(text, at));

    let i = 0;
    while (i < text.length) {
      const ch = text[i];

      if (ch === '$') {
        let j = i + 1;
        while (j < text.length && text[j] !== '$') j += text[j] === '\\' ? 2 : 1;
        if (j < text.length) {
          flush();
          tokens.push(...splitConstants(normalizeMath(text.slice(i + 1, j), prose), prose));
          i = j + 1;
          continue;
        }
      }

      if (ch === '\\') {
        const command = text.slice(i).match(/^\\([A-Za-z]+)/);
        if (!command) {
          // Escaped character (\{, \_, \$, ...): show it literally.
          if (i + 1 < text.length) {
            buffer += text[i + 1];
            i += 2;
            continue;
          }
        } else {
          const name = command[1];
          const after = i + command[0].length;

          // Custom markers produced by the row builder.
          if (name === 'kw' || name === 'fn') {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: name === 'kw' ? 'keyword' : 'function', value: value.value });
              i = value.end;
              continue;
            }
          }

          if (name === 'Call') {
            const nameGroup = group(after);
            const argsGroup = nameGroup ? group(nameGroup.end) : null;
            if (nameGroup && argsGroup) {
              flush();
              tokens.push({ type: 'call', name: nameGroup.value, args: argsGroup.value });
              i = argsGroup.end;
              continue;
            }
          }

          if (name === 'textsc') {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: 'constant', value: value.value });
              i = value.end;
              continue;
            }
          }

          if (FONT_COMMANDS[name]) {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: 'styled', tag: FONT_COMMANDS[name], value: value.value });
              i = value.end;
              continue;
            }
          }

          // Known symbols render as Unicode; unknown commands stay visible
          // minus the backslash.
          buffer += SYMBOLS[name] != null ? SYMBOLS[name] : name;
          i = after;
          continue;
        }
      }

      buffer += ch;
      i++;
    }

    flush();
    return tokens;
  }

  /*
   * A math run cut off by a call (`\Call{Max}{$i$} $+ T(n)$`) starts or ends with a binary
   * operator, which TeX would demote to unary and set tight. An empty group on that side keeps
   * it binary; the space typed between call and math is then dropped so the gap is TeX's own.
   */
  const BIN_OP = String.raw`(?:[+\-*]|\\(?:pm|mp|cdot|times|div|land|lor|wedge|vee|cup|cap|setminus|circ|oplus|otimes)(?![A-Za-z]))`;
  const LEADING_BIN = new RegExp(`^\\s*${BIN_OP}`);
  const TRAILING_BIN = new RegExp(`${BIN_OP}\\s*$`);
  const isCallToken = (token) => token && (token.type === 'call' || token.type === 'function' || token.type === 'constant');
  const isBlank = (token) => token && token.type === 'text' && !token.value.trim();

  function bridgeOperators(tokens) {
    const out = tokens.slice();
    for (let i = 0; i < out.length; i++) {
      const token = out[i];
      if (token.type !== 'math') continue;
      let value = token.value;
      const before = isBlank(out[i - 1]) ? i - 2 : i - 1;
      if (isCallToken(out[before]) && LEADING_BIN.test(value)) {
        value = `{}${value}`;
        if (before === i - 2) { out.splice(i - 1, 1); i -= 1; }
      }
      const after = isBlank(out[i + 1]) ? i + 2 : i + 1;
      if (isCallToken(out[after]) && TRAILING_BIN.test(value)) {
        value = `${value}{}`;
        if (after === i + 2) out.splice(i + 1, 1);
      }
      if (value !== token.value) out[i] = { ...token, value };
    }
    return out;
  }

  function renderInline(container, source, prose) {
    for (const token of bridgeOperators(parseInline(source, prose))) {
      switch (token.type) {
        case 'text':
          container.appendChild(document.createTextNode(token.value));
          break;
        case 'keyword':
          container.appendChild(el('span', 'ps-kw', token.value));
          break;
        case 'function':
          container.appendChild(el('span', 'ps-fn', token.value));
          break;
        case 'styled': {
          const wrapper = el(token.tag, token.tag === 'span' ? 'ps-styled' : null);
          renderInline(wrapper, token.value, prose);
          container.appendChild(wrapper);
          break;
        }
        case 'call':
          container.appendChild(el('span', 'ps-fn', token.name));
          container.appendChild(document.createTextNode('('));
          renderInline(container, token.args, prose);
          container.appendChild(document.createTextNode(')'));
          break;
        case 'constant':
          container.appendChild(el('span', 'ps-const', token.value));
          break;
        case 'math': {
          const wrapper = el('span', 'ps-math', token.value);
          wrapper.dataset.tex = token.value;
          container.appendChild(wrapper);
          break;
        }
        default:
          break;
      }
    }
  }

  /* ---------------- row building ---------------- */

  /** Inline source of a simple (non-container) statement, or null. */
  function simpleText(node) {
    switch (node.type) {
      case 'state': return expr(node.text, node.textMath);
      case 'call': return `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`;
      case 'return': return `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`;
      case 'print': return `\\kw{print} ${expr(node.text, node.textMath)}`;
      case 'break':
      case 'continue': return `\\kw{${node.type}}`;
      case 'raw': return expr(node.text, node.textMath);
      default: return null;
    }
  }

  const MERGEABLE = new Set(['state', 'call', 'return', 'print', 'break', 'continue']);

  function buildRows(nodes, depth, counter, rows) {
    const row = (text, comment, numbered = true, extra = {}) => rows.push(Object.assign({
      number: numbered ? ++counter.value : null,
      depth,
      text,
      comment: comment || null,
    }, extra));
    const body = (list) => buildRows(list || [], depth + 1, counter, rows);

    for (const node of nodes) {
      switch (node.type) {
        case 'function': {
          row(`\\fn{${node.name || ''}}(${expr(node.args, node.argsMath)})`, node.comment, false, { kind: 'function' });
          // Each procedure numbers its own lines from 1.
          const saved = counter.value;
          counter.value = 0;
          body(node.body);
          counter.value = saved;
          break;
        }

        case 'if': {
          node.branches.forEach((branch, index) => {
            const comment = index === 0 ? node.comment || branch.comment : branch.comment;
            row(`\\kw{${index === 0 ? 'if' : 'elseif'}} ${expr(branch.cond, branch.condMath, true)}`, comment);
            body(branch.body);
          });
          if (node.elseBody) {
            // CLRS: a plain first statement goes on the else line ("else x = x.right"),
            // the rest of the branch below it.
            const [first, ...rest] = node.elseBody;
            if (first && MERGEABLE.has(first.type) && !(first.comment && node.elseComment)) {
              row(`\\kw{else} ${simpleText(first)}`, node.elseComment || first.comment);
              body(rest);
            } else {
              row('\\kw{else}', node.elseComment);
              body(node.elseBody);
            }
          }
          break;
        }

        case 'while':
          row(`\\kw{while} ${expr(node.cond, node.condMath, true)}`, node.comment);
          body(node.body);
          break;

        case 'for': {
          let head;
          if (node.all) {
            // CLRS: "**for** each v ∈ G.V" (only "for" is bold). A head already written with text commands
            // (\texttt{child} of \texttt{u}) is prose; math mode would swallow its spaces.
            const parts = String(node.init || '').split(/\s+(?:in|\\in)\s+/);
            if (parts.length === 2) {
              const left = expr(parts[0], true);
              const right = expr(parts[1], true);
              const single = (value) => /^\$[^$]*\$$/.test(value);
              head = single(left) && single(right)
                ? `\\kw{for} each $${left.slice(1, -1)} \\in ${right.slice(1, -1)}$`
                : `\\kw{for} each ${left} $\\in$ ${right}`;
            } else {
              head = `\\kw{for} each ${expr(node.init, !/\\text(?:tt|rm|sf|up)?\{/.test(node.init || ''))}`;
            }
          } else {
            head = node.bound
              ? `\\kw{for} ${expr(node.init, node.initMath)} \\kw{${node.downto ? 'downto' : 'to'}} ${expr(node.bound, node.boundMath)}`
              : `\\kw{for} ${expr(node.init, node.initMath)}`;
          }
          row(head, node.comment);
          body(node.body);
          break;
        }

        case 'repeat':
          row('\\kw{repeat}', node.comment);
          body(node.body);
          row(`\\kw{until} ${expr(node.until, node.untilMath, true)}`, node.untilComment);
          break;

        case 'state':
          // CLRS numbers comment lines too.
          if (!node.text && node.comment) row('', node.comment, true, { note: true });
          else row(simpleText(node), node.comment);
          break;

        case 'require':
        case 'ensure':
          row(`\\kw{${node.type === 'require' ? 'Require' : 'Ensure'}:} ${expr(node.text, node.textMath)}`, node.comment, false);
          break;

        case 'comment': {
          const last = rows[rows.length - 1];
          if (last && !last.comment) last.comment = node.text || '';
          else row('', node.text || '', true, { note: true });
          break;
        }

        default:
          row(simpleText(node) || '', node.comment);
      }
    }
  }

  /* ---------------- public renderer ---------------- */

  /*
   * Math typesetting. Obsidian's renderMath() is synchronous; the slow part is
   * finishRenderMath() (~100 ms while MathJax refreshes its stylesheet), and a
   * block stays hidden until it is done. Rendered formulas are cached by TeX,
   * so re-renders (editing, mode switches, settings, the builder preview)
   * clone them instead and never wait.
   */
  const MATH_CACHE_LIMIT = 4000;
  const mathCache = new Map();
  let mathJaxReady = null;

  function cachedMath(tex) {
    const hit = mathCache.get(tex);
    if (!hit) return null;
    mathCache.delete(tex); // keep recently used entries last
    mathCache.set(tex, hit);
    return hit.cloneNode(true);
  }

  function rememberMath(tex, node) {
    mathCache.set(tex, node.cloneNode(true));
    if (mathCache.size > MATH_CACHE_LIMIT) mathCache.delete(mathCache.keys().next().value);
  }

  /** Same markup Obsidian puts around inline math in a note. */
  function mathElement(tex) {
    const wrapper = document.createElement('span');
    wrapper.className = 'math math-inline is-loaded';
    wrapper.appendChild(renderMath(tex, false));
    return wrapper;
  }

  /** Fallback: let a Markdown render do it. */
  async function typesetViaMarkdown(app, span, tex, sourcePath, component) {
    const holder = document.createElement('div');
    try {
      await MarkdownRenderer.render(app, `$${tex}$`, holder, sourcePath, component);
      const math = holder.querySelector('.math');
      if (!math) throw new Error('no math output');
      span.replaceChildren(math);
      rememberMath(tex, math);
    } catch (error) {
      span.classList.add('ps-math-error');
      span.textContent = `$${tex}$`;
    }
  }

  /** Typeset every `.ps-math` span under root. */
  PS.typesetMath = async function typesetMath(app, root, sourcePath, component) {
    const missing = [];
    root.querySelectorAll('.ps-math[data-tex]').forEach((span) => {
      const tex = span.dataset.tex;
      delete span.dataset.tex;
      const hit = cachedMath(tex);
      if (hit) span.replaceChildren(hit);
      else missing.push({ span, tex });
    });
    if (!missing.length) return;

    let failed = missing;
    if (typeof renderMath === 'function') {
      try {
        if (!mathJaxReady) mathJaxReady = typeof loadMathJax === 'function' ? loadMathJax() : Promise.resolve();
        await mathJaxReady;
        failed = missing.filter(({ span, tex }) => {
          try {
            span.replaceChildren(mathElement(tex));
            return false;
          } catch (error) {
            return true;
          }
        });
        await finishRenderMath();
        missing.forEach((item) => {
          if (!failed.includes(item)) rememberMath(item.tex, item.span.firstChild);
        });
      } catch (error) {
        mathJaxReady = null;
        failed = missing.filter(({ span }) => !span.querySelector('mjx-container'));
      }
    }
    await Promise.all(failed.map(({ span, tex }) => typesetViaMarkdown(app, span, tex, sourcePath, component)));
  };

  PS.buildRows = function buildRowsForModel(model) {
    const rows = [];
    buildRows(model.nodes || [], 0, { value: 0 }, rows);
    return rows;
  };

  /** AST → DOM. Math is left as `.ps-math` placeholders for PS.typesetMath. */
  PS.renderBlock = function renderBlock(model, options) {
    const settings = Object.assign({ lineNumbers: true, indentSize: '1.2em', commentDelimiter: '//' }, options || {});
    const block = el('div', 'ps-block');
    block.style.setProperty('--ps-indent', settings.indentSize || '1.2em');

    if (model.caption) {
      const title = el('div', 'ps-title');
      title.appendChild(el('span', 'ps-title-label', 'Algorithm'));
      const text = el('span', 'ps-title-text');
      renderInline(text, model.caption);
      title.appendChild(text);
      block.appendChild(title);
    }

    const grid = el('div', 'ps-grid');
    for (const row of PS.buildRows(model)) {
      const rowEl = el('div', 'ps-row');
      if (row.kind) rowEl.classList.add(`ps-row-${row.kind}`);
      rowEl.style.setProperty('--ps-depth', String(row.depth));
      rowEl.appendChild(el('span', 'ps-num', settings.lineNumbers && row.number != null ? String(row.number) : ''));
      // A comment-only line has no code cell: its comment starts at the code
      // column, at the line's indent, and runs to the right edge (CLRS).
      // A procedure header without a comment spans the comment column too, so a long
      // parameter list does not squeeze the comments of the lines below it.
      const span = row.kind === 'function' && !row.comment;
      if (!row.note) {
        const codeEl = el('span', span ? 'ps-code ps-span' : 'ps-code');
        renderInline(codeEl, row.text);
        rowEl.appendChild(codeEl);
      }
      if (span) {
        grid.appendChild(rowEl);
        continue;
      }
      const commentEl = el('span', row.note ? 'ps-comment ps-note' : 'ps-comment');
      if (row.comment) {
        // clrscode \CommentSymbol: bold, tightly kerned slashes.
        commentEl.appendChild(el('span', 'ps-comment-mark', settings.commentDelimiter || '//'));
        commentEl.appendChild(document.createTextNode(' '));
        renderInline(commentEl, row.comment, true);
      }
      rowEl.appendChild(commentEl);
      grid.appendChild(rowEl);
    }

    block.appendChild(grid);
    return block;
  };

  /** Render and typeset into `container`, revealing it once math is done. */
  PS.paint = async function paint(app, container, model, options, sourcePath, component) {
    const block = PS.renderBlock(model, options);
    block.style.visibility = 'hidden';
    container.appendChild(block);
    try {
      await PS.typesetMath(app, block, sourcePath, component);
    } finally {
      block.style.visibility = '';
    }
    return block;
  };

  PS.renderInline = renderInline;
  PS.parseInline = parseInline;
  PS.bridgeOperators = bridgeOperators;
})(PS);

/* Builder modal. */
((PS) => {
  const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || '');
  const MOD = IS_MAC ? '⌘' : 'Ctrl+';
  const ALT = IS_MAC ? '⌥' : 'Alt+';
  const SHIFT = IS_MAC ? '⇧' : 'Shift+';
  const HISTORY_LIMIT = 100;

  const hasCjk = (value) => /[一-鿿]/.test(String(value));
  const hasTex = (value) => /[\\$]/.test(String(value || ''));

  function cloneNode(node) {
    const copy = JSON.parse(JSON.stringify(node));
    PS.walk([copy], (child) => { child.id = PS.nextId(); });
    return copy;
  }

  function newNode(type) {
    switch (type) {
      case 'if': return PS.node('if', { branches: [{ cond: '', body: [] }], elseBody: null });
      case 'while': return PS.node('while', { cond: '', body: [] });
      case 'for': return PS.node('for', { init: '', bound: '', downto: false, body: [] });
      case 'forall': return PS.node('for', { all: true, init: '', bound: '', downto: false, body: [] });
      case 'repeat': return PS.node('repeat', { body: [], until: '' });
      case 'function': return PS.node('function', { kind: 'Procedure', name: '', args: '', body: [] });
      case 'call': return PS.node('call', { name: '', args: '' });
      case 'break':
      case 'continue': return PS.node(type);
      default: return PS.node(type, { text: '' });
    }
  }

  /* Row layouts. A part is a literal word, an input ({ key }) or a select. */
  const field = (key, placeholder, math = true) => ({ key, placeholder, math });
  const ROWS = {
    state: { chip: 'statement', parts: [field('text', 'e.g. x = Extract-Min(Q)')] },
    require: { chip: 'require', parts: [field('text', 'input, e.g. A, n')] },
    ensure: { chip: 'ensure', parts: [field('text', 'output, e.g. A is sorted')] },
    return: { chip: 'return', parts: [field('text', 'value, e.g. Merge-Sort(A, p, r)')] },
    print: { chip: 'print', parts: [field('text', 'value')] },
    break: { chip: 'break', parts: [] },
    continue: { chip: 'continue', parts: [] },
    call: { chip: 'call', parts: [field('name', 'procedure name', false), '(', field('args', 'args, e.g. A, i'), ')'] },
    raw: { chip: 'raw', parts: [field('text', 'unrecognized raw line', false)] },
    comment: { chip: '//', parts: [field('text', 'comment text', false)], noComment: true },
    while: { chip: 'while', parts: [field('cond', 'condition, e.g. i > 0 and A[i] > key')] },
    forall: { chip: 'for each', parts: [field('init', 'element in set, e.g. v in G.V')] },
    for: {
      chip: 'for',
      parts: [
        field('init', 'start, e.g. j = 2'),
        { select: 'downto', options: [['to', false], ['downto', true]] },
        field('bound', 'end, e.g. n'),
      ],
    },
    function: {
      chip: 'procedure',
      parts: [
        { select: 'kind', options: [['Procedure', 'Procedure'], ['Function', 'Function']] },
        field('name', 'name, e.g. Max-Heapify', false),
        '(', field('args', 'args, e.g. A, x'), ')',
      ],
    },
  };

  const PRIMARY_INSERTS = [
    ['Statement', 'state'], ['If', 'if'], ['For', 'for'], ['While', 'while'],
    ['Return', 'return'], ['Call', 'call'], ['Procedure', 'function'],
  ];
  const MORE_INSERTS = [
    ['For each', 'forall'], ['Repeat … until', 'repeat'], ['Require', 'require'], ['Ensure', 'ensure'],
    ['Break', 'break'], ['Continue', 'continue'], ['Print', 'print'], ['Comment line', 'comment'],
  ];

  class ConfirmModal extends Modal {
    constructor(app, { title, message, choices }) {
      super(app);
      this.titleText = title;
      this.message = message;
      this.choices = choices;
    }

    onOpen() {
      this.modalEl.addClass('pb-confirm');
      this.titleEl.setText(this.titleText);
      this.contentEl.createEl('p', { text: this.message });
      const buttons = this.contentEl.createDiv('modal-button-container');
      this.choices.forEach(({ label, cls, run }) => {
        const button = buttons.createEl('button', { text: label, cls });
        button.addEventListener('click', () => {
          this.close();
          run();
        });
      });
    }

    onClose() {
      this.contentEl.empty();
    }
  }

  /*
   * A field that was plain text in the source (`\State Initialize the array`) stays plain text
   * while edited. Marked as `<key>Prose` so it survives undo snapshots (JSON) and duplication;
   * the serializer ignores it.
   */
  function markSourceProse(value) {
    if (Array.isArray(value)) { value.forEach(markSourceProse); return; }
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (key.endsWith('Math') && child === false) value[`${key.slice(0, -4)}Prose`] = true;
      else if (child && typeof child === 'object') markSourceProse(child);
    }
  }

  class BuilderModal extends Modal {
    constructor(app, options) {
      super(app);
      this.model = options.model;
      this.settings = options.settings || {};
      this.sourcePath = options.sourcePath || '';
      this.onSave = options.onSave;
      markSourceProse(this.model.nodes);
      this.initialLatex = PS.serializeLatex(this.model);
      this.index = new Map();
      this.undoStack = [];
      this.redoStack = [];
      this.typingKey = null;
      this.selected = null; // { id, slot }
      this.pendingFocus = null; // focus key to restore after the next render
      this.collapsed = new Set();
      this.openComments = new Set();
      this.dragId = null;
      this.dropTarget = null;
      this.previewTimer = null;
      this.previewToken = 0;
      this.previewComponent = null;
      this.forceClose = false;
    }

    onOpen() {
      this.modalEl.addClass('pb-modal');
      this.titleEl.setText('Pseudocode Builder');
      this.buildLayout();
      this.renderTree();
      this.renderPreview();
      this.onKey = (event) => this.handleKey(event);
      this.modalEl.addEventListener('keydown', this.onKey);
      // Start typing right away: first field, or the title for a new block.
      // (Deferred: Modal.open() moves focus after onOpen.)
      window.setTimeout(() => {
        const first = this.listEl.querySelector('input.pb-input');
        (first || this.captionInput).focus();
      }, 0);
    }

    onClose() {
      this.modalEl.removeEventListener('keydown', this.onKey);
      clearTimeout(this.previewTimer);
      this.previewToken += 1;
      if (this.previewComponent) this.previewComponent.unload();
      this.contentEl.empty();
    }

    isDirty() {
      return PS.serializeLatex(this.model) !== this.initialLatex;
    }

    /** Esc, the close button and clicking outside all land here. */
    close() {
      if (this.forceClose || !this.isDirty()) {
        super.close();
        return;
      }
      new ConfirmModal(this.app, {
        title: 'Discard changes?',
        message: 'This pseudocode block has unsaved changes.',
        choices: [
          { label: 'Keep editing', run: () => {} },
          { label: 'Discard', cls: 'mod-warning', run: () => this.closeNow() },
          { label: 'Save', cls: 'mod-cta', run: () => this.save() },
        ],
      }).open();
    }

    closeNow() {
      this.forceClose = true;
      this.close();
    }

    buildLayout() {
      const { contentEl } = this;
      contentEl.empty();
      contentEl.addClass('pb-content');

      const wrap = contentEl.createDiv('pb-wrap');
      const left = wrap.createDiv('pb-left');
      const right = wrap.createDiv('pb-right');

      const captionRow = left.createDiv('pb-caption');
      captionRow.createSpan({ cls: 'pb-chip', text: 'title' });
      this.captionInput = captionRow.createEl('input', {
        cls: 'pb-input',
        attr: { type: 'text', placeholder: 'Algorithm title (optional)' },
      });
      this.captionInput.value = this.model.caption || '';
      this.captionInput.addEventListener('input', () => {
        this.beginTyping('caption');
        this.model.caption = this.captionInput.value;
        this.schedulePreview();
      });

      const toolbar = left.createDiv('pb-toolbar');
      PRIMARY_INSERTS.forEach(([label, type]) => {
        const button = toolbar.createEl('button', { text: `+ ${label}` });
        button.addEventListener('click', () => this.insertNode(newNode(type)));
      });
      const more = toolbar.createEl('button', { text: 'More…', attr: { 'aria-label': 'More statement types' } });
      more.addEventListener('click', (event) => {
        const menu = new Menu();
        MORE_INSERTS.forEach(([label, type]) => menu.addItem((item) => item.setTitle(label).onClick(() => this.insertNode(newNode(type)))));
        this.showMenu(menu, event, more);
      });

      this.listEl = left.createDiv('pb-list');
      this.listEl.addEventListener('focusin', (event) => {
        const row = event.target.closest('.pb-row');
        if (row) this.select(row.dataset.id, row.dataset.slot);
      });

      this.previewEl = right.createDiv('pb-preview');
      const details = right.createEl('details', { cls: 'pb-latex' });
      details.createEl('summary', { text: 'Generated LaTeX' });
      this.latexEl = details.createEl('pre');

      const footer = contentEl.createDiv('pb-footer');
      footer.createDiv({
        cls: 'pb-hints',
        text: `Enter new line · ${ALT}↑↓ move · ${MOD}[ ${MOD}] indent · ${MOD}/ comment · ${MOD}Z undo · ${MOD}↵ save`,
      });
      footer.createEl('button', { text: 'Cancel' }).addEventListener('click', () => this.close());
      footer.createEl('button', { cls: 'mod-cta', text: 'Save' }).addEventListener('click', () => this.save());
    }

    showMenu(menu, event, anchor) {
      if (event && event.type === 'contextmenu') {
        menu.showAtMouseEvent(event);
        return;
      }
      const rect = anchor.getBoundingClientRect();
      menu.showAtPosition({ x: rect.left, y: rect.bottom + 2 });
    }

    /* ---- history ---- */

    snapshot() {
      return JSON.stringify(this.model);
    }

    record(before) {
      this.undoStack.push(before);
      if (this.undoStack.length > HISTORY_LIMIT) this.undoStack.shift();
      this.redoStack = [];
    }

    /** First keystroke of a typing run (per field) becomes one undo step. */
    beginTyping(key) {
      if (this.typingKey === key) return;
      this.record(this.snapshot());
      this.typingKey = key;
    }

    /**
     * Run a structural change. `change` returns false when nothing happened,
     * so no-op moves don't leave empty undo steps.
     */
    mutate(change) {
      const before = this.snapshot();
      if (change() === false) return false;
      this.record(before);
      this.typingKey = null;
      this.renderTree();
      this.schedulePreview();
      return true;
    }

    restore(from, to) {
      if (!from.length) return;
      to.push(this.snapshot());
      this.model = JSON.parse(from.pop());
      this.typingKey = null;
      const active = document.activeElement;
      if (active && active.dataset && active.dataset.focus) this.pendingFocus = active.dataset.focus;
      this.captionInput.value = this.model.caption || '';
      this.renderTree();
      this.schedulePreview();
    }

    undo() {
      this.restore(this.undoStack, this.redoStack);
    }

    redo() {
      this.restore(this.redoStack, this.undoStack);
    }

    /* ---- keyboard ---- */

    handleKey(event) {
      const mod = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      const run = (fn) => {
        event.preventDefault();
        event.stopPropagation();
        fn();
      };

      if (mod && event.key === 'Enter') return run(() => this.save());
      if (mod && key === 'z') return run(() => (event.shiftKey ? this.redo() : this.undo()));
      if (mod && key === 'y') return run(() => this.redo());

      const rowEl = event.target.closest && event.target.closest('.pb-row');
      const info = rowEl ? this.index.get(rowEl.dataset.id) : null;
      if (!info) return undefined;
      const row = { node: info.node, slot: parseSlot(rowEl.dataset.slot), kind: rowEl.dataset.kind };

      if (event.altKey && !mod && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        return run(() => this.move(row.node, event.key === 'ArrowUp' ? -1 : 1));
      }
      if (mod && (event.key === ']' || event.key === '[')) {
        return run(() => (event.key === ']' ? this.indent(row.node) : this.outdent(row.node)));
      }
      if (mod && event.key === '/') return run(() => this.toggleComment(row));
      if (mod && event.shiftKey && key === 'd') return run(() => this.duplicate(row.node));
      if (mod && event.shiftKey && key === 'k') return run(() => this.removeRow(row));

      if (event.target.tagName !== 'INPUT') return undefined;
      if (!mod && !event.altKey && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        return run(() => this.focusNeighbour(event.target, event.key === 'ArrowUp' ? -1 : 1));
      }
      if (event.key === 'Enter' && !event.isComposing) {
        return run(() => {
          if (PS.isContainer(row.node) && row.kind !== 'until' && !event.shiftKey) this.addInside(row.node, row.slot);
          else this.addAfter(row.node);
        });
      }
      return undefined;
    }

    focusNeighbour(input, step) {
      const inputs = Array.from(this.listEl.querySelectorAll('input.pb-input:not(.pb-comment-input)'));
      const current = input.classList.contains('pb-comment-input')
        ? inputs.indexOf(input.closest('.pb-row').querySelector('input.pb-input'))
        : inputs.indexOf(input);
      const next = inputs[current + step];
      if (next) {
        next.focus();
        next.setSelectionRange(next.value.length, next.value.length);
      }
    }

    /* ---- tree rendering ---- */

    buildIndex() {
      this.index.clear();
      PS.walk(this.model.nodes, (node, array, index, parent) => {
        this.index.set(node.id, { node, array, index, parent });
      });
    }

    select(id, slot) {
      this.selected = id ? { id, slot: parseSlot(slot) } : null;
      this.listEl.querySelectorAll('.pb-row').forEach((element) => {
        element.toggleClass('pb-selected', !!this.selected
          && element.dataset.id === this.selected.id
          && parseSlot(element.dataset.slot) === this.selected.slot);
      });
    }

    renderTree() {
      this.buildIndex();
      if (this.selected && !this.index.has(this.selected.id)) this.selected = null;
      const scroll = this.listEl.scrollTop;
      this.listEl.empty();
      if (!this.model.nodes.length) {
        this.listEl.createDiv({ cls: 'pb-empty', text: 'Empty. Add a statement or procedure from the toolbar above.' });
      }
      this.renderNodes(this.model.nodes, 0);
      this.listEl.scrollTop = scroll;
      if (this.selected) this.select(this.selected.id, this.selected.slot);
      if (this.pendingFocus) {
        const key = this.pendingFocus;
        this.pendingFocus = null;
        const input = this.listEl.querySelector(`[data-focus="${CSS.escape(key)}"]`);
        if (input) {
          input.focus();
          if (input.select) input.select();
          input.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    renderNodes(nodes, depth) {
      for (const node of nodes) this.renderNode(node, depth);
    }

    renderNode(node, depth) {
      const collapsed = this.collapsed.has(node.id);
      switch (node.type) {
        case 'if':
          node.branches.forEach((branch, index) => {
            if (collapsed && index > 0) return;
            this.renderRow({
              node, depth, slot: index, kind: index === 0 ? 'node' : 'branch',
              chip: index === 0 ? 'if' : 'else if',
              target: branch,
              parts: [field('cond', 'condition, e.g. x == NIL')],
              comment: index === 0 ? { target: node, key: 'comment' } : { target: branch, key: 'comment' },
            });
            if (!collapsed) this.renderNodes(branch.body, depth + 1);
          });
          if (node.elseBody && !collapsed) {
            this.renderRow({
              node, depth, slot: 'else', kind: 'else', chip: 'else', parts: [],
              comment: { target: node, key: 'elseComment' },
            });
            this.renderNodes(node.elseBody, depth + 1);
          }
          return;

        case 'repeat':
          this.renderRow({ node, depth, chip: 'repeat', parts: [], comment: { target: node, key: 'comment' } });
          if (!collapsed) {
            this.renderNodes(node.body, depth + 1);
            this.renderRow({
              node, depth, kind: 'until', slot: 'until', chip: 'until',
              parts: [field('until', 'condition, e.g. m == 9')],
              comment: { target: node, key: 'untilComment' },
            });
          }
          return;

        default: {
          const spec = ROWS[node.type === 'for' && node.all ? 'forall' : node.type] || ROWS.raw;
          this.renderRow({
            node, depth, chip: spec.chip, parts: spec.parts,
            comment: spec.noComment ? null : { target: node, key: 'comment' },
          });
          if (PS.isContainer(node) && !collapsed) this.renderNodes(node.body, depth + 1);
        }
      }
    }

    /**
     * One editor row. `target` holds the edited fields (the node, or an if
     * branch); `slot` says which if segment the row heads.
     */
    renderRow({ node, depth, chip, parts, slot, kind = 'node', target = node, comment }) {
      const element = this.listEl.createDiv('pb-row');
      element.dataset.id = node.id;
      element.dataset.kind = kind;
      if (slot != null) element.dataset.slot = String(slot);
      element.style.setProperty('--pb-depth', String(depth));
      const row = { node, slot, kind, comment, element };

      const handle = element.createEl('span', {
        cls: 'pb-drag',
        text: '⠿',
        attr: { draggable: 'true', 'aria-label': 'Drag to reorder' },
      });
      this.bindDrag(handle, element, row);

      const container = PS.isContainer(node) && kind === 'node';
      if (container) {
        const collapsed = this.collapsed.has(node.id);
        const toggle = element.createEl('button', {
          cls: 'pb-toggle clickable-icon',
          attr: { type: 'button', 'aria-label': collapsed ? 'Expand' : 'Collapse' },
        });
        setIcon(toggle, collapsed ? 'chevron-right' : 'chevron-down');
        toggle.addEventListener('click', (event) => {
          event.stopPropagation();
          if (collapsed) this.collapsed.delete(node.id);
          else this.collapsed.add(node.id);
          this.renderTree();
        });
      } else {
        element.createSpan('pb-toggle-spacer');
      }

      element.createSpan({ cls: `pb-chip pb-chip-${kind === 'node' ? node.type : kind}`, text: chip });
      const fields = element.createDiv('pb-fields');
      parts.forEach((part) => this.renderPart(fields, row, target, part));
      if (comment) this.renderComment(fields, row);

      this.renderActions(element, row);
      element.addEventListener('click', () => this.select(node.id, slot));
      element.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        this.select(node.id, slot);
        this.showMenu(this.rowMenu(row), event);
      });
      return element;
    }

    renderPart(parent, row, target, part) {
      if (typeof part === 'string') {
        parent.createSpan({ cls: 'pb-word', text: part });
        return;
      }
      if (part.select) {
        const select = parent.createEl('select', { cls: 'dropdown pb-select' });
        part.options.forEach(([label, value], index) => {
          const option = select.createEl('option', { text: label, value: String(index) });
          if ((target[part.select] || false) === value) option.selected = true;
        });
        select.addEventListener('change', () => {
          this.mutate(() => {
            target[part.select] = part.options[Number(select.value)][1];
          });
        });
        return;
      }

      const focusKey = `${row.node.id}:${row.slot != null ? row.slot : ''}:${part.key}`;
      const input = parent.createEl('input', {
        cls: 'pb-input',
        attr: { type: 'text', placeholder: part.placeholder || '', spellcheck: 'false' },
      });
      input.value = target[part.key] || '';
      input.dataset.focus = focusKey;
      if (part.key === 'name') input.addClass('pb-name');
      const markTex = () => {
        const tex = hasTex(input.value);
        input.toggleClass('pb-tex', tex);
        input.title = tex ? 'Contains LaTeX; kept as written' : '';
      };
      markTex();
      input.addEventListener('input', () => {
        this.beginTyping(focusKey);
        const value = input.value;
        if (part.math) {
          target[part.key] = PS.normalizeOperators(value);
          // Decided from the current text each time, so clearing the field or a stray CJK
          // character does not lock it into plain text; only source prose stays prose.
          if (!target[`${part.key}Prose`]) target[`${part.key}Math`] = !hasCjk(value);
        } else {
          target[part.key] = value;
        }
        markTex();
        this.schedulePreview();
      });
    }

    commentKey(row) {
      return `${row.node.id}:${row.comment.key}:${row.slot != null ? row.slot : ''}`;
    }

    renderComment(parent, row) {
      const { target, key } = row.comment;
      const id = this.commentKey(row);
      if (target[key] == null && !this.openComments.has(id)) return;
      parent.createSpan({ cls: 'pb-word pb-comment-mark', text: '//' });
      const input = parent.createEl('input', {
        cls: 'pb-input pb-comment-input',
        attr: { type: 'text', placeholder: 'trailing comment', spellcheck: 'false' },
      });
      input.value = target[key] || '';
      input.dataset.focus = `comment:${id}`;
      input.addEventListener('input', () => {
        this.beginTyping(input.dataset.focus);
        target[key] = input.value;
        this.schedulePreview();
      });
    }

    toggleComment(row) {
      row.comment = row.comment || this.commentAccess(row);
      if (!row.comment) return; // comment lines have no trailing comment
      const { target, key } = row.comment;
      const id = this.commentKey(row);
      const showing = target[key] != null || this.openComments.has(id);
      if (showing && !String(target[key] || '').trim()) {
        this.openComments.delete(id);
        this.mutate(() => {
          delete target[key];
        });
        return;
      }
      this.openComments.add(id);
      this.pendingFocus = `comment:${id}`;
      this.renderTree();
    }

    /** Comment storage for a row described by node/slot/kind. */
    commentAccess({ node, slot, kind }) {
      if (node.type === 'if') {
        if (kind === 'else') return { target: node, key: 'elseComment' };
        if (Number.isInteger(slot) && slot > 0) return { target: node.branches[slot], key: 'comment' };
        return { target: node, key: 'comment' };
      }
      if (kind === 'until') return { target: node, key: 'untilComment' };
      const spec = ROWS[node.type];
      return spec && spec.noComment ? null : { target: node, key: 'comment' };
    }

    renderActions(element, row) {
      const box = element.createDiv('pb-actions');
      const button = (icon, label, handler) => {
        const control = box.createEl('button', { cls: 'clickable-icon', attr: { type: 'button', 'aria-label': label } });
        setIcon(control, icon);
        control.addEventListener('click', (event) => {
          event.stopPropagation();
          handler(event, control);
        });
      };
      if (row.kind !== 'until') {
        const inside = PS.isContainer(row.node);
        button('plus', inside ? 'Add statement inside (Enter)' : 'Add statement after (Enter)', () => (
          inside ? this.addInside(row.node, row.slot) : this.addAfter(row.node)
        ));
      }
      button('more-horizontal', 'More actions', (event, control) => {
        this.select(row.node.id, row.slot);
        this.showMenu(this.rowMenu(row), event, control);
      });
      if (row.kind !== 'until') {
        button('x', row.kind === 'branch' ? 'Remove branch' : row.kind === 'else' ? 'Remove else' : 'Delete', () => this.removeRow(row));
      }
    }

    rowMenu(row) {
      const { node, slot, kind } = row;
      const menu = new Menu();
      const item = (title, icon, run, hint) => menu.addItem((entry) => {
        entry.setTitle(hint ? `${title}  ${hint}` : title).setIcon(icon).onClick(run);
      });

      if (PS.isContainer(node) && kind !== 'until') item('Add statement inside', 'corner-down-right', () => this.addInside(node, slot), '↵');
      item('Add statement after', 'plus', () => this.addAfter(node), PS.isContainer(node) ? `${SHIFT}↵` : '↵');
      if (node.type === 'if') {
        menu.addSeparator();
        item('Add else-if branch', 'git-branch-plus', () => this.mutate(() => {
          const at = Number.isInteger(slot) ? slot + 1 : node.branches.length;
          node.branches.splice(at, 0, { cond: '', body: [] });
          this.pendingFocus = `${node.id}:${at}:cond`;
        }));
        if (!node.elseBody) item('Add else branch', 'git-branch', () => this.addElse(node));
        if (kind === 'branch') item('Remove this branch', 'minus', () => this.removeRow(row));
        if (kind === 'else') item('Remove else', 'minus', () => this.removeRow(row));
      }
      menu.addSeparator();
      item('Move up', 'arrow-up', () => this.move(node, -1), `${ALT}↑`);
      item('Move down', 'arrow-down', () => this.move(node, 1), `${ALT}↓`);
      item('Indent', 'indent', () => this.indent(node), `${MOD}]`);
      item('Outdent', 'outdent', () => this.outdent(node), `${MOD}[`);
      menu.addSeparator();
      if (this.commentAccess(row)) item('Trailing comment', 'message-square', () => this.toggleComment(row), `${MOD}/`);
      item('Duplicate', 'copy', () => this.duplicate(node), `${MOD}${SHIFT}D`);
      item(kind === 'branch' ? 'Remove this branch' : kind === 'else' ? 'Remove else' : 'Delete', 'trash-2', () => this.removeRow(row), `${MOD}${SHIFT}K`);
      return menu;
    }

    /* ---- drag and drop ---- */

    bindDrag(handle, element, row) {
      handle.addEventListener('dragstart', (event) => {
        this.dragId = row.node.id;
        if (event.dataTransfer) {
          event.dataTransfer.effectAllowed = 'move';
          try { event.dataTransfer.setData('text/plain', row.node.id); } catch (error) { /* ignore */ }
        }
        element.addClass('pb-dragging');
      });
      handle.addEventListener('dragend', () => {
        this.dragId = null;
        element.removeClass('pb-dragging');
        this.clearDropStyles();
      });
      element.addEventListener('dragover', (event) => this.handleDragOver(event, row, element));
      element.addEventListener('dragleave', (event) => {
        if (!element.contains(event.relatedTarget)) element.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
      });
      element.addEventListener('drop', (event) => this.handleDrop(event, row));
    }

    clearDropStyles(keepTarget = false) {
      if (!keepTarget) this.dropTarget = null;
      this.listEl.querySelectorAll('.pb-row').forEach((element) => {
        element.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
      });
    }

    handleDragOver(event, row, element) {
      if (!this.dragId || this.dragId === row.node.id) return;
      event.preventDefault();
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
      const rect = element.getBoundingClientRect();
      const ratio = (event.clientY - rect.top) / Math.max(1, rect.height);
      let mode = ratio < 0.5 ? 'before' : 'after';
      // Branch/else/until rows only accept drops into their own segment.
      if (row.kind !== 'node') mode = row.kind === 'until' ? 'after' : 'inside';
      else if (PS.isContainer(row.node) && ratio > 0.3 && ratio < 0.7) mode = 'inside';
      this.dropTarget = { id: row.node.id, mode, slot: row.slot };
      this.clearDropStyles(true);
      element.addClass(`pb-drop-${mode}`);
    }

    handleDrop(event, row) {
      event.preventDefault();
      const target = this.dropTarget;
      const movedId = this.dragId;
      this.clearDropStyles();
      this.dragId = null;
      if (!movedId || !target || target.id !== row.node.id) return;
      const slot = target.slot === 'until' ? undefined : target.slot;
      this.mutate(() => {
        if (!PS.reorder(this.model.nodes, movedId, row.node.id, target.mode, slot)) return false;
        this.selected = { id: movedId };
        return true;
      });
    }

    /* ---- structural operations ---- */

    /** Put a new node at the selection: inside a selected container, else after it. */
    insertNode(node) {
      const info = this.selected ? this.index.get(this.selected.id) : null;
      this.mutate(() => {
        if (info && PS.isContainer(info.node) && this.selected.slot !== 'until') {
          this.collapsed.delete(info.node.id);
          PS.slotBody(info.node, this.selected.slot).push(node);
        } else if (info) {
          info.array.splice(info.index + 1, 0, node);
        } else {
          this.model.nodes.push(node);
        }
        this.focusNew(node);
      });
    }

    focusNew(node) {
      this.selected = { id: node.id };
      const first = {
        if: '0:cond', while: ':cond', for: ':init', repeat: 'until:until', function: ':name', call: ':name',
      }[node.type] || ':text';
      this.pendingFocus = `${node.id}:${first}`;
    }

    addInside(node, slot) {
      const child = newNode('state');
      this.mutate(() => {
        this.collapsed.delete(node.id);
        PS.slotBody(node, slot).push(child);
        this.focusNew(child);
      });
    }

    addAfter(node) {
      const info = this.index.get(node.id);
      if (!info) return;
      const sibling = newNode('state');
      this.mutate(() => {
        info.array.splice(info.index + 1, 0, sibling);
        this.focusNew(sibling);
      });
    }

    addElse(node) {
      this.mutate(() => {
        node.elseBody = [newNode('state')];
        this.focusNew(node.elseBody[0]);
      });
    }

    duplicate(node) {
      const info = this.index.get(node.id);
      if (!info) return;
      this.mutate(() => {
        const copy = cloneNode(node);
        info.array.splice(info.index + 1, 0, copy);
        this.selected = { id: copy.id };
      });
    }

    move(node, direction) {
      const info = this.index.get(node.id);
      if (!info) return;
      const target = info.index + direction;
      if (target < 0 || target >= info.array.length) return;
      this.keepFocus();
      this.mutate(() => {
        const [moved] = info.array.splice(info.index, 1);
        info.array.splice(target, 0, moved);
      });
    }

    indent(node) {
      const info = this.index.get(node.id);
      const previous = info && info.index > 0 ? info.array[info.index - 1] : null;
      if (!previous || !PS.isContainer(previous)) return;
      this.keepFocus();
      this.mutate(() => {
        info.array.splice(info.index, 1);
        this.collapsed.delete(previous.id);
        PS.bodyOf(previous).push(node);
      });
    }

    outdent(node) {
      const info = this.index.get(node.id);
      const owner = info && info.parent ? this.index.get(info.parent.id) : null;
      if (!owner) return;
      this.keepFocus();
      this.mutate(() => {
        info.array.splice(info.index, 1);
        owner.array.splice(owner.index + 1, 0, node);
      });
    }

    /** Delete a node, or the if segment (else-if / else) a row heads. */
    removeRow(row) {
      const { node, slot, kind } = row;
      if (kind === 'branch') {
        this.mutate(() => { node.branches.splice(slot, 1); });
        return;
      }
      if (kind === 'else') {
        this.mutate(() => { node.elseBody = null; });
        return;
      }
      const info = this.index.get(node.id);
      if (!info) return;
      // Keep the keyboard flowing: focus the row that takes this one's place.
      const neighbour = info.array[info.index + 1] || info.array[info.index - 1] || info.parent;
      this.mutate(() => {
        info.array.splice(info.index, 1);
        if (this.selected && this.selected.id === node.id) this.selected = null;
        if (neighbour) {
          const input = this.listEl.querySelector(`.pb-row[data-id="${neighbour.id}"] input.pb-input`);
          if (input) this.pendingFocus = input.dataset.focus;
        }
      });
    }

    keepFocus() {
      const active = document.activeElement;
      if (active && active.dataset && active.dataset.focus) this.pendingFocus = active.dataset.focus;
    }

    /* ---- preview and saving ---- */

    schedulePreview() {
      clearTimeout(this.previewTimer);
      this.previewTimer = setTimeout(() => this.renderPreview(), 120);
    }

    async renderPreview() {
      const token = ++this.previewToken;
      const latex = PS.serializeLatex(this.model);
      this.latexEl.setText(latex);
      const component = new Component();
      component.load();
      const holder = document.createElement('div');
      try {
        // Same path as a saved block: LaTeX → AST → DOM.
        const block = PS.renderBlock(PS.parseLatex(latex), this.settings);
        holder.appendChild(block);
        await PS.typesetMath(this.app, block, this.sourcePath, component);
      } catch (error) {
        holder.replaceChildren();
        holder.createDiv({ cls: 'pb-error', text: `Render failed: ${error.message}` });
      }
      // A newer render started meanwhile: drop this one.
      if (token !== this.previewToken) {
        component.unload();
        return;
      }
      this.previewEl.replaceChildren(...holder.childNodes);
      if (this.previewComponent) this.previewComponent.unload();
      this.previewComponent = component;
    }

    validate() {
      let problem = null;
      PS.walk(this.model.nodes, (node) => {
        if (problem) return;
        if (node.type === 'function' && !String(node.name || '').trim()) problem = { node, message: 'Procedure name is required' };
        if (node.type === 'call' && !String(node.name || '').trim()) problem = { node, message: 'Call needs a procedure name' };
      });
      return problem;
    }

    async save() {
      const problem = this.validate();
      if (problem) {
        new Notice(problem.message);
        this.collapsed.clear();
        this.selected = { id: problem.node.id };
        this.pendingFocus = `${problem.node.id}::name`;
        this.renderTree();
        return;
      }
      if (!this.isDirty()) {
        this.closeNow();
        return;
      }
      try {
        await this.onSave(PS.serializeLatex(this.model));
      } catch (error) {
        new Notice(`Save failed: ${error.message}`);
        return;
      }
      this.closeNow();
    }
  }

  function parseSlot(value) {
    if (value == null || value === '') return undefined;
    return /^\d+$/.test(value) ? Number(value) : value;
  }

  PS.BuilderModal = BuilderModal;
  PS.ConfirmModal = ConfirmModal;
})(PS);

/*
 * Pseudocode Suite — plugin entry.
 */

const DEFAULT_SETTINGS = {
  lineNumbers: true,
  indentSize: '1.2em',
  commentDelimiter: '//',
};

const CSS_LENGTH = /^\d*\.?\d+(?:em|rem|px|ch|pt)$/;

// [file, family, style, weight, format]. The small caps are Latin Modern Roman Caps
// (cmcsc10's design, GUST Font License): real small-cap glyphs for NIL and procedure
// names instead of the browser's thin, shrunken imitation.
const FONT_FACES = [
  ['cm-regular.ttf', 'CM Pseudocode', 'normal', 'normal', 'truetype'],
  ['cm-italic.ttf', 'CM Pseudocode', 'italic', 'normal', 'truetype'],
  ['cm-bold.ttf', 'CM Pseudocode', 'normal', 'bold', 'truetype'],
  ['cm-bolditalic.ttf', 'CM Pseudocode', 'italic', 'bold', 'truetype'],
  ['cm-smallcaps.otf', 'CM Pseudocode SC', 'normal', 'normal', 'opentype'],
];

/* ---------------- fences ---------------- */

const FENCE_OPEN = /^((?:[ \t]*>)*[ \t]*)(`{3,}|~{3,})[ \t]*pseudo[ \t]*$/;

/**
 * Every ```pseudo fence in `lines`: { start, end, prefix, source }, with
 * start/end the fence lines. `prefix` is the blockquote/indent prefix the
 * content lines carry (fences inside callouts or lists).
 */
function scanFences(lines) {
  const fences = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(FENCE_OPEN);
    if (!open) continue;
    const prefix = open[1];
    const depth = (prefix.match(/>/g) || []).length;
    const marker = open[2];
    const close = new RegExp(`^(?:[ \\t]*>){${depth}}[ \\t]*${marker[0] === '`' ? '`' : '~'}{${marker.length},}[ \\t]*$`);
    const strip = depth
      ? new RegExp(`^(?:[ \\t]*>){${depth}} ?`)
      : new RegExp(`^[ \\t]{0,${prefix.length}}`);
    let end = i + 1;
    while (end < lines.length && !close.test(lines[end])) end++;
    if (end >= lines.length) break; // unterminated
    fences.push({
      start: i,
      end,
      prefix: depth ? prefix.replace(/[ \t]*$/, ' ') : prefix,
      source: lines.slice(i + 1, end).map((line) => line.replace(strip, '')).join('\n'),
    });
    i = end;
  }
  return fences;
}

const sameSource = (a, b) => String(a || '').replace(/\s+/g, ' ').trim() === String(b || '').replace(/\s+/g, ' ').trim();

/** The fence holding `source`, preferring the one at (or nearest) `hint`. */
function locateFence(lines, source, hint) {
  const matches = scanFences(lines).filter((fence) => sameSource(fence.source, source));
  if (!matches.length) return null;
  if (!Number.isInteger(hint)) return matches[0];
  return matches.reduce((best, fence) => (Math.abs(fence.start - hint) < Math.abs(best.start - hint) ? fence : best));
}

/** Replacement lines for a fence's content, re-applying its prefix. */
function prefixed(latex, prefix) {
  return latex.split('\n').map((line) => (line || !prefix.trim() ? prefix + line : prefix.replace(/[ \t]+$/, '')));
}

/* ---------------- settings ---------------- */

class SettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const { settings } = this.plugin;

    new Setting(containerEl)
      .setName('Show line numbers')
      .setDesc('Number each statement; procedure headers stay unnumbered and every procedure restarts at 1.')
      .addToggle((toggle) => toggle
        .setValue(settings.lineNumbers)
        .onChange((value) => this.plugin.updateSettings({ lineNumbers: value })));

    new Setting(containerEl)
      .setName('Indent width')
      .setDesc('Indent per nesting level, e.g. 1.2em or 16px.')
      .addText((text) => {
        text.setPlaceholder(DEFAULT_SETTINGS.indentSize).setValue(settings.indentSize);
        text.onChange((value) => {
          const clean = value.trim();
          const valid = !clean || CSS_LENGTH.test(clean);
          text.inputEl.toggleClass('ps-invalid', !valid);
          if (valid) this.plugin.updateSettings({ indentSize: clean || DEFAULT_SETTINGS.indentSize }, true);
        });
      });

    new Setting(containerEl)
      .setName('Comment prefix')
      .setDesc('Shown before trailing comments.')
      .addText((text) => text
        .setPlaceholder(DEFAULT_SETTINGS.commentDelimiter)
        .setValue(settings.commentDelimiter)
        .onChange((value) => this.plugin.updateSettings({ commentDelimiter: value || DEFAULT_SETTINGS.commentDelimiter }, true)));
  }
}

/* ---------------- plugin ---------------- */

class PseudocodeSuitePlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.blocks = new Set();
    this.installFonts();

    this.registerMarkdownCodeBlockProcessor('pseudo', (source, el, ctx) => this.renderCodeBlock(source, el, ctx));
    this.addSettingTab(new SettingsTab(this.app, this));

    this.addRibbonIcon('square-pen', 'Insert pseudocode block', () => this.openInsert(null));
    this.addCommand({
      id: 'insert-pseudocode-block',
      name: 'Insert pseudocode block',
      editorCallback: (editor) => this.openInsert(editor),
    });
    this.addCommand({
      id: 'edit-pseudocode-block',
      name: 'Edit pseudocode block under cursor',
      editorCheckCallback: (checking, editor, view) => {
        const fence = this.fenceAtCursor(editor);
        if (checking) return !!fence;
        if (fence) this.openEditorFence(editor, fence, view);
        return true;
      },
    });
    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor, view) => {
      const fence = this.fenceAtCursor(editor);
      if (!fence) return;
      menu.addItem((item) => item
        .setTitle('Edit pseudocode block')
        .setIcon('square-pen')
        .onClick(() => this.openEditorFence(editor, fence, view)));
    }));
  }

  /* ---------------- settings ---------------- */

  async loadSettings() {
    const data = (await this.loadData()) || {};
    const legacy = data.jsSettings || {};
    const defined = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value != null && value !== ''));
    this.settings = Object.assign({}, DEFAULT_SETTINGS, defined({
      lineNumbers: data.lineNumbers,
      indentSize: data.indentSize,
      commentDelimiter: data.commentDelimiter,
    }), defined({
      lineNumbers: legacy.lineNumber,
      indentSize: legacy.indentSize,
      commentDelimiter: legacy.commentDelimiter,
    }));
    if (!CSS_LENGTH.test(this.settings.indentSize)) this.settings.indentSize = DEFAULT_SETTINGS.indentSize;
    if (data.jsSettings) await this.saveData(this.settings);
  }

  /** Save, then repaint every rendered block (debounced while typing). */
  async updateSettings(patch, debounce = false) {
    Object.assign(this.settings, patch);
    await this.saveData(this.settings);
    clearTimeout(this.refreshTimer);
    if (debounce) this.refreshTimer = setTimeout(() => this.refreshAll(), 400);
    else this.refreshAll();
  }

  refreshAll() {
    this.blocks.forEach((entry) => this.paintEntry(entry));
  }

  /* ---------------- fonts ---------------- */

  /**
   * styles.css is injected as text, so a relative url() there does not
   * resolve to the plugin folder. Register the bundled fonts with their real
   * resource URLs instead (also in popout windows).
   */
  installFonts() {
    const css = FONT_FACES.map(([file, family, style, weight, format]) => {
      const url = this.app.vault.adapter.getResourcePath(`${this.manifest.dir}/fonts/${file}`);
      return `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; `
        + `font-display: swap; src: url("${url}") format('${format}'); }`;
    }).join('\n');
    const inject = (doc) => {
      if (!doc || doc.getElementById('pseudocode-suite-fonts')) return;
      const style = doc.createElement('style');
      style.id = 'pseudocode-suite-fonts';
      style.textContent = css;
      doc.head.appendChild(style);
      this.register(() => style.remove());
    };
    inject(document);
    this.registerEvent(this.app.workspace.on('window-open', (win) => inject(win.doc)));
  }

  /* ---------------- rendering ---------------- */

  async renderCodeBlock(source, el, ctx) {
    const entry = { source, el, ctx, child: new MarkdownRenderChild(el), component: null, token: 0 };
    ctx.addChild(entry.child);
    this.blocks.add(entry);
    entry.child.register(() => this.blocks.delete(entry));
    await this.paintEntry(entry);
  }

  async paintEntry(entry) {
    const token = ++entry.token;
    if (entry.component) entry.child.removeChild(entry.component);
    const component = new Component();
    entry.component = component;
    entry.child.addChild(component);

    const holder = document.createElement('div');
    try {
      const block = await PS.paint(this.app, holder, PS.parseLatex(entry.source), this.settings, entry.ctx.sourcePath, component);
      this.addEditButton(block, entry);
    } catch (error) {
      holder.replaceChildren();
      holder.createDiv({ cls: 'ps-error', text: `Pseudocode render failed: ${error && error.message ? error.message : error}` });
    }
    if (token !== entry.token) return; // a newer paint replaced this one
    entry.el.replaceChildren(...holder.childNodes);
  }

  addEditButton(block, entry) {
    const button = block.createEl('button', {
      cls: 'ps-edit-btn',
      attr: { type: 'button', 'aria-label': 'Edit in Pseudocode Builder' },
    });
    setIcon(button.createSpan('ps-edit-icon'), 'pencil');
    button.createSpan({ text: 'Edit' });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Ask at click time: the note may have changed since rendering.
      const section = entry.ctx.getSectionInfo ? entry.ctx.getSectionInfo(entry.el) : null;
      this.openFileFence(entry.ctx.sourcePath, entry.source, section ? section.lineStart : null);
    });
  }

  /* ---------------- opening the builder ---------------- */

  openBuilder(model, sourcePath, onSave) {
    new PS.BuilderModal(this.app, { model, settings: this.settings, sourcePath, onSave }).open();
  }

  /** Edit a block of a file on disk (reading view, live preview, embeds). */
  async openFileFence(path, source, hint) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      new Notice(`File not found: ${path}`);
      return;
    }
    const fence = locateFence((await this.app.vault.read(file)).split(/\r?\n/), source, hint);
    if (!fence) {
      new Notice('Could not find this pseudocode block in the note. Reopen the note and try again.');
      return;
    }
    this.openBuilder(PS.parseLatex(fence.source), path, async (latex) => {
      let found = true;
      await this.app.vault.process(file, (content) => {
        const eol = content.includes('\r\n') ? '\r\n' : '\n';
        const lines = content.split(/\r?\n/);
        const current = locateFence(lines, fence.source, fence.start);
        if (!current) {
          found = false;
          return content;
        }
        return lines.slice(0, current.start + 1)
          .concat(prefixed(latex, current.prefix), lines.slice(current.end))
          .join(eol);
      });
      if (!found) throw new Error('the block changed in the meantime');
      new Notice('Pseudocode updated');
    });
  }

  fenceAtCursor(editor) {
    if (!editor) return null;
    const { line } = editor.getCursor();
    const lines = editor.getValue().split(/\r?\n/);
    return scanFences(lines).find((fence) => fence.start <= line && line <= fence.end) || null;
  }

  openEditorFence(editor, fence, view) {
    const path = view && view.file ? view.file.path : this.app.workspace.getActiveFile()?.path || '';
    this.openBuilder(PS.parseLatex(fence.source), path, (latex) => {
      // The note may have been edited while the builder was open.
      const current = locateFence(editor.getValue().split(/\r?\n/), fence.source, fence.start);
      if (!current) throw new Error('the block changed in the meantime');
      editor.replaceRange(
        `${prefixed(latex, current.prefix).join('\n')}\n`,
        { line: current.start + 1, ch: 0 },
        { line: current.end, ch: 0 },
      );
      new Notice('Pseudocode updated');
    });
  }

  openInsert(editor) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const target = editor || (view && view.getMode() === 'source' ? view.editor : null);
    const file = view ? view.file : this.app.workspace.getActiveFile();
    this.openBuilder({ caption: '', nodes: [] }, file ? file.path : '', async (latex) => {
      const block = `\`\`\`pseudo\n${latex}\n\`\`\``;
      if (target) {
        // Fences must start and end on their own lines.
        const from = target.getCursor('from');
        const to = target.getCursor('to');
        const before = target.getLine(from.line).slice(0, from.ch).trim() ? '\n' : '';
        const after = target.getLine(to.line).slice(to.ch).trim() ? '\n' : '';
        target.replaceSelection(`${before}${block}\n${after}`);
        return;
      }
      if (!file) throw new Error('open a note before inserting');
      await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, '')}\n\n${block}\n`);
      new Notice('Pseudocode appended to the end of the note');
    });
  }
}

module.exports = PseudocodeSuitePlugin;

