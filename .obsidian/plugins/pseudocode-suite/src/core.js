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
