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
  [/\\(?:land|And)\b/g, 'and'],
  [/\\(?:lor|Or)\b/g, 'or'],
  [/\\(?:lnot|Not)\b/g, 'not'],
];

/** Canonical ASCII operators → TeX. */
const SYMBOL_TEX = [
  [/<=/g, '\\le '],
  [/>=/g, '\\ge '],
  [/!=/g, '\\ne '],
  [/->/g, '\\to '],
];
const WORD_TEX = [
  [/(?<!\\)\band\b/g, '\\land '],
  [/(?<!\\)\bor\b/g, '\\lor '],
  [/(?<!\\)\bnot\b/g, '\\lnot '],
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
const FONT_GROUP = /\\(?:text|textbf|textit|texttt|textrm|textsf|textup|mathrm|mathit|mathbf|mathsf|mathtt|operatorname)\{[^{}]*\}/g;

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
const UNWRAP_FONT = /\\(?:text(?:bf|it|rm|sf|up)?|mathrm|mathit|mathbf)\{([^{}]*)\}/g;

/**
 * Normalize a LaTeX fragment into something better for the visual editor:
 * drop `$` delimiters, turn \gets into "=", unwrap \mathrm/\text/\textbf, etc.
 * (\texttt marks code identifiers and is kept.)
 */
function fromMath(text) {
  let value = String(text == null ? '' : text).trim();
  if (isSingleMath(value)) value = value.slice(1, -1).trim();
  value = PS.normalizeOperators(value)
    .replace(/\\To\b/g, 'to')
    .replace(/\\DownTo\b/g, 'downto');
  // Innermost first; repeat so nested \mathrm{..\text{..}..} unwraps.
  for (let previous = null; previous !== value;) {
    previous = value;
    value = value.replace(UNWRAP_FONT, '$1');
  }
  value = value
    .replace(/([A-Za-z])_\{(\d+)\}/g, subscript)
    .replace(/\\textbackslash\b/g, '\\')
    .replace(/\\_/g, '_')
    .replace(/\\[,;: ]/g, ' ');
  return value.replace(/[ \t]+/g, ' ').trim();
}

PS.readGroup = readGroup;
PS.firstGroup = firstGroup;
PS.splitComment = splitComment;
PS.fromMath = fromMath;
PS.isSingleMath = isSingleMath;

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */

// Lines whose own `{...}` groups must not swallow a trailing \Comment.
const COMMENTABLE = new Set([
  'Function', 'Procedure', 'If', 'Elif', 'ElsIf', 'ElseIf', 'Else', 'While', 'For', 'ForAll', 'Repeat', 'Until',
  'Call', 'Break', 'Continue',
]);

/** `{ field: value, fieldMath: wasSingleMath }` for a math-carrying field. */
function mathField(name, raw) {
  const source = raw == null ? '' : raw;
  return { [name]: fromMath(source), [`${name}Math`]: isSingleMath(source) };
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
        const branch = Object.assign(mathField('cond', group ? group.value : ''), { body: [] });
        const node = PS.node('if', { branches: [branch], elseBody: null });
        open(withComment(node, lineComment), branch.body);
        break;
      }
      case 'Elif':
      case 'ElsIf':
      case 'ElseIf': {
        const { node } = top();
        if (!node || node.type !== 'if') break;
        const branch = withComment(Object.assign(mathField('cond', group ? group.value : ''), { body: [] }), lineComment);
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
        const node = PS.node('while', Object.assign(mathField('cond', group ? group.value : ''), { body: [] }));
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
        const parts = content.split(/\s*(?:\\To|\\DownTo|\bto\b|\bdownto\b)\s*/i);
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
        Object.assign(node, mathField('until', group ? group.value : ''));
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
const WORDISH = String.raw`\\(?:mathrm|text|textbf)\{[^{}]*\}`;
const SPACE_AFTER_WORD = new RegExp(`(${WORDISH})\\s+(?=[A-Za-z0-9(\\[“‘"']|${WORDISH})`, 'g');
const SPACE_BEFORE_WORD = new RegExp(`([A-Za-z0-9\\])”’"'])\\s+(?=${WORDISH})`, 'g');

/**
 * Builder typesetting rules for a math fragment: multi-letter identifiers
 * upright, all-caps constants and booleans as text, digits after a letter as
 * subscripts, ASCII operators as TeX. Font groups already present are kept.
 */
function normalizeExpr(expr) {
  const out = PS.maskFontGroups(expr, (masked) => {
    const value = masked.replace(/([A-Za-z])_\{(\d+)\}/g, subscript);
    const whole = value.trim();
    if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(whole)) return `\\text{${whole}}`;
    if (/^(true|false)$/i.test(whole)) return `\\textbf{${whole.toLowerCase()}}`;

    const words = value
      .replace(/([A-Za-z])_?(\d+)/g, subscript)
      .replace(/([A-Za-z])-([A-Za-z])/g, '$1\\text{-}$2')
      .replace(/(?<!\\)\b[A-Za-z]{2,}\b/g, (word) => {
        if (/^[A-Z]{2,}$/.test(word)) return `\\text{${word}}`;
        if (/^(true|false)$/i.test(word)) return `\\textbf{${word.toLowerCase()}}`;
        return KEYWORD_WORDS.has(word) ? word : `\\mathrm{${word}}`;
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
  if (expr.includes('\\')) return `$${PS.texOperators(expr, false)}$`;
  return `$${normalizeExpr(expr)}$`;
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
      `$${inner.includes('\\') ? PS.texOperators(inner, false) : normalizeExpr(inner)}$`)
    .replace(/[ \t]{2,}/g, ' ');
}

PS.toMath = toMath;
PS.normalizeExpr = normalizeExpr;
PS.mathOrRaw = mathOrRaw;

const commentSuffix = (comment) => (comment ? ` \\Comment{${comment}}` : '');
const field = (node, key) => mathOrRaw(node[key], node[`${key}Math`]);

function emitNodes(nodes, depth, out) {
  const pad = '  '.repeat(depth);
  const line = (text, comment) => out.push(`${pad}${text}${commentSuffix(comment)}`);
  const body = (list) => emitNodes(list, depth + 1, out);

  for (const node of nodes) {
    switch (node.type) {
      case 'state':
        line(`\\State ${field(node, 'text') || '\\text{}'}`, node.comment);
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
          line(`${index === 0 ? '\\If' : '\\Elif'}{${field(branch, 'cond')}}`, index === 0 ? node.comment : branch.comment);
          body(branch.body);
        });
        if (node.elseBody) {
          line('\\Else', node.elseComment);
          body(node.elseBody);
        }
        line('\\EndIf');
        break;
      case 'while':
        line(`\\While{${field(node, 'cond')}}`, node.comment);
        body(node.body);
        line('\\EndWhile');
        break;
      case 'for': {
        const head = node.all
          ? node.init || ''
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
        line(`\\Until{${field(node, 'until')}}`, node.untilComment);
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
