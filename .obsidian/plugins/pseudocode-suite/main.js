/*
 * Pseudocode Suite — generated bundle. Edit files in src/ and run build.py.
 */

const {
  Plugin,
  Modal,
  Notice,
  MarkdownRenderer,
  Component,
  MarkdownView,
  TFile,
  PluginSettingTab,
  Setting,
} = require('obsidian');

/*
 * Pseudocode Suite — core model.
 * Parses the pseudocode LaTeX dialect used by the old pseudocode-in-obs blocks
 * into a small AST, and serializes that AST back to the same dialect.
 */

const PS = {};

/* ------------------------------------------------------------------ */
/* AST constructors                                                    */
/* ------------------------------------------------------------------ */

let uid = 0;
PS.nextId = () => `n${++uid}`;

PS.node = function node(type, fields) {
  return Object.assign({ id: PS.nextId(), type }, fields || {});
};

PS.isContainer = (node) => ['if', 'while', 'for', 'repeat', 'function'].includes(node.type);

PS.bodyOf = function bodyOf(node) {
  if (node.type === 'if') {
    const branch = node.branches[node.branches.length - 1];
    return branch ? branch.body : [];
  }
  return node.body || [];
};

/**
 * Move a node within the tree. `mode` is 'before' | 'after' | 'inside'.
 * Refuses to move a node into its own subtree.
 */
PS.reorder = function reorder(nodes, dragId, targetId, mode) {
  if (!dragId || !targetId || dragId === targetId) return false;
  const build = () => {
    const map = new Map();
    const walk = (array, parent) => {
      array.forEach((node, position) => {
        map.set(node.id, { node, array, position, parent });
        if (Array.isArray(node.branches)) node.branches.forEach((branch) => walk(branch.body, node));
        if (Array.isArray(node.elseBody)) walk(node.elseBody, node);
        if (Array.isArray(node.body)) walk(node.body, node);
      });
    };
    walk(nodes, null);
    return map;
  };
  let map = build();
  const drag = map.get(dragId);
  const target = map.get(targetId);
  if (!drag || !target) return false;
  if (mode === 'inside' && !PS.isContainer(target.node)) return false;
  const contains = (node, id) => {
    if (node.id === id) return true;
    if (Array.isArray(node.branches)) return node.branches.some((branch) => branch.body.some((child) => contains(child, id)));
    if (Array.isArray(node.elseBody)) return node.elseBody.some((child) => contains(child, id));
    if (Array.isArray(node.body)) return node.body.some((child) => contains(child, id));
    return false;
  };
  if (contains(drag.node, targetId)) return false;

  drag.array.splice(drag.position, 1);
  map = build();
  const nextTarget = map.get(targetId);
  if (!nextTarget) return false;
  if (mode === 'inside') {
    PS.bodyOf(nextTarget.node).push(drag.node);
  } else {
    nextTarget.array.splice(nextTarget.position + (mode === 'after' ? 1 : 0), 0, drag.node);
  }
  return true;
};

/** Normalize LaTeX operators typed in the builder, without touching fonts. */
PS.normalizeOperators = function normalizeOperators(text) {
  return String(text == null ? '' : text)
    .replace(/\\neq\b/g, '!=')
    .replace(/\\ne\b/g, '!=')
    .replace(/\\le\b/g, '<=')
    .replace(/\\ge\b/g, '>=')
    .replace(/\\gets\b/g, '=')
    .replace(/:=/g, '=')
    .replace(/<-|←/g, '=')
    .replace(/<>/g, '!=')
    .replace(/&&/g, 'and')
    .replace(/\|\|/g, 'or')
    .replace(/\\to\b/g, 'to')
    .replace(/\\land\b/g, 'and')
    .replace(/\\lor\b/g, 'or')
    .replace(/\\lnot\b/g, 'not')
    .replace(/\\And\b/g, 'and')
    .replace(/\\Or\b/g, 'or')
    .replace(/\\Not\b/g, 'not');
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

function lastGroup(text) {
  const end = text.lastIndexOf('}');
  if (end < 0) return null;
  let depth = 0;
  for (let i = end; i >= 0; i--) {
    const ch = text[i];
    if (ch === '}') depth += 1;
    else if (ch === '{') {
      depth -= 1;
      if (depth === 0) return { value: text.slice(i + 1, end), start: i };
    }
  }
  return null;
}

/** Split a trailing `\Comment{...}` off a line. */
function splitComment(text) {
  const match = String(text).match(/^(.*?)\s*\\Comment\{([\s\S]*)\}\s*$/);
  if (!match) return { body: String(text), comment: null };
  return { body: match[1], comment: match[2] };
}

/**
 * Normalize a LaTeX fragment into something better for the visual editor:
 * drop `$` delimiters, turn \gets into "=", unwrap \mathrm/\text/\textbf, etc.
 */
function fromMath(text) {
  let value = String(text == null ? '' : text).trim();
  const dollars = (value.match(/\$/g) || []).length;
  if (dollars === 2 && value.startsWith('$') && value.endsWith('$')) {
    value = value.slice(1, -1).trim();
  }
  value = value
    .replace(/\\gets\b/g, '=')
    .replace(/:=/g, '=')
    .replace(/<-|←/g, '=')
    .replace(/<>/g, '!=')
    .replace(/&&/g, 'and')
    .replace(/\|\|/g, 'or')
    .replace(/\\le\b/g, '<=')
    .replace(/\\ge\b/g, '>=')
    .replace(/\\neq\b/g, '!=')
    .replace(/\\ne\b/g, '!=')
    .replace(/\\land\b/g, 'and')
    .replace(/\\lor\b/g, 'or')
    .replace(/\\lnot\b/g, 'not')
    .replace(/\\And\b/g, 'and')
    .replace(/\\Or\b/g, 'or')
    .replace(/\\Not\b/g, 'not')
    .replace(/\\To\b/g, 'to')
    .replace(/\\DownTo\b/g, 'downto')
    // innermost font commands first; repeat so nested \mathrm{..\text{..}..} unwraps
    // \texttt marks code identifiers (CS50 notes); keep it.
    .replace(/\\text(?:bf|it|rm|sf|up)\{([^{}]*)\}/g, '$1')
    .replace(/\\text\{([^{}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^{}]*)\}/g, '$1')
    .replace(/\\mathrm\{([^{}]*)\}/g, '$1')
    .replace(/\\mathit\{([^{}]*)\}/g, '$1')
    .replace(/\\mathbf\{([^{}]*)\}/g, '$1')
    // canonical subscript display: S_{1} -> S_1 (braces only for 2+ digits)
    .replace(/([A-Za-z])_\{(\d+)\}/g, (all, letter, digits) => digits.length === 1 ? `${letter}_${digits}` : `${letter}_{${digits}}`)
    .replace(/\\textbackslash\b/g, '\\')
    .replace(/\\_/g, '_')
    .replace(/\\[,;: ]/g, ' ');
  return value.replace(/[ \t]+/g, ' ').trim();
}

function isSingleMath(text) {
  const value = String(text == null ? '' : text).trim();
  return value.startsWith('$') && value.endsWith('$') && (value.match(/\$/g) || []).length === 2;
}

PS.readGroup = readGroup;
PS.firstGroup = firstGroup;
PS.lastGroup = lastGroup;
PS.splitComment = splitComment;
PS.fromMath = fromMath;

/* ------------------------------------------------------------------ */
/* Parser                                                              */
/* ------------------------------------------------------------------ */

const BLOCK_LINES = new Set(['Function', 'Procedure', 'If', 'Elif', 'ElsIf', 'ElseIf', 'Else', 'While', 'For', 'ForAll', 'Repeat']);

const OPENERS = {
  If: (node) => [node.branches[0].body],
  While: (node) => [node.body],
  For: (node) => [node.body],
  Repeat: (node) => [node.body],
  Function: (node) => [node.body],
  Procedure: (node) => [node.body],
};

PS.parseLatex = function parseLatex(source) {
  const model = { caption: '', nodes: [] };
  const stack = [{ target: model.nodes, node: null }];
  const target = () => stack[stack.length - 1].target;
  const push = (node) => target().push(node);
  const pop = () => {
    if (stack.length > 1) stack.pop();
  };

  const physical = String(source == null ? '' : source).split(/\r?\n/);
  // Join continuation lines: a line with an odd number of `$` continues on the
  // next line (multi-line math in \State, as in Exercise Sheet 3).
  const lines = [];
  let pending = '';
  for (const piece of physical) {
    pending = pending ? `${pending} ${piece.trim()}` : piece;
    const dollars = (pending.match(/\$/g) || []).length;
    if (dollars % 2 === 0) {
      lines.push(pending);
      pending = '';
    }
  }
  if (pending) lines.push(pending);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^\\(?:[Bb]egin|[Ee]nd)\{algorithm(?:ic)?\}/.test(line)) continue;
    if (/^\\label\{/.test(line)) continue;

    const match = line.match(/^\\([A-Za-z]+)([\s\S]*)$/);
    if (!match) {
      push({ id: PS.nextId(), type: 'raw', text: line });
      continue;
    }
    const name = match[1];
    let rest = (match[2] || '').trim();
    // A trailing \Comment on a block line (\If{...} \Comment{...}) belongs to
    // that line; split it off before reading the line's own groups.
    let lineComment = null;
    if (BLOCK_LINES.has(name)) {
      const split = splitComment(rest);
      if (split.comment !== null) {
        rest = split.body.trim();
        lineComment = split.comment;
      }
    }
    const group = firstGroup(rest);

    switch (name) {
      case 'caption':
        model.caption = group ? group.value : rest;
        break;

      case 'Function':
      case 'Procedure': {
        const args = group ? readGroup(rest, group.end) : null;
        const node = {
          id: PS.nextId(),
          type: 'function',
          kind: name,
          name: group ? group.value : '',
          args: args ? fromMath(args.value) : '',
          argsMath: args ? isSingleMath(args.value) : false,
          body: [],
        };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'EndFunction':
      case 'EndProcedure':
        pop();
        break;

      case 'If': {
        const node = {
          id: PS.nextId(),
          type: 'if',
          branches: [{ cond: group ? fromMath(group.value) : '', condMath: group ? isSingleMath(group.value) : false, body: [] }],
          elseBody: null,
        };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.branches[0].body, node });
        break;
      }
      case 'Elif':
      case 'ElsIf':
      case 'ElseIf': {
        const top = stack[stack.length - 1];
        if (!top.node || top.node.type !== 'if') break;
        const branch = { cond: group ? fromMath(group.value) : '', condMath: group ? isSingleMath(group.value) : false, body: [] };
        if (lineComment !== null) branch.comment = lineComment;
        top.node.branches.push(branch);
        stack[stack.length - 1] = { target: branch.body, node: top.node };
        break;
      }
      case 'Else': {
        const top = stack[stack.length - 1];
        if (!top.node || top.node.type !== 'if') break;
        top.node.elseBody = [];
        if (lineComment !== null) top.node.elseComment = lineComment;
        stack[stack.length - 1] = { target: top.node.elseBody, node: top.node };
        break;
      }
      case 'EndIf':
        pop();
        break;

      case 'While': {
        const node = {
          id: PS.nextId(), type: 'while',
          cond: group ? fromMath(group.value) : '',
          condMath: group ? isSingleMath(group.value) : false,
          body: [],
        };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'EndWhile':
        pop();
        break;

      case 'ForAll': {
        const content = group ? group.value : '';
        const clean = fromMath(content).replace(/\$/g, '').trim();
        const node = {
          id: PS.nextId(),
          type: 'for',
          all: true,
          init: clean,
          initMath: false,
          bound: '',
          body: [],
        };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'For': {
        const content = group ? group.value : '';
        const parts = content.split(/\s*(?:\\To|\\DownTo|\bto\b|\bdownto\b)\s*/i);
        const node = {
          id: PS.nextId(),
          type: 'for',
          init: fromMath(parts[0] || ''),
          initMath: isSingleMath(parts[0] || ''),
          bound: parts.length > 1 ? fromMath(parts.slice(1).join('')) : '',
          boundMath: parts.length > 1 ? isSingleMath(parts.slice(1).join('')) : false,
          downto: /\bDownTo\b/i.test(content),
          body: [],
        };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'EndFor':
        pop();
        break;

      case 'Repeat': {
        const node = { id: PS.nextId(), type: 'repeat', body: [], until: '' };
        if (lineComment !== null) node.comment = lineComment;
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'Until': {
        const top = stack[stack.length - 1];
        if (!top.node || top.node.type !== 'repeat') break;
        top.node.until = group ? fromMath(group.value) : '';
        top.node.untilMath = group ? isSingleMath(group.value) : false;
        pop();
        break;
      }

      case 'State': {
        const { body, comment } = splitComment(rest);
        // \State \Return / \Break / \Continue / \Print are common shorthand.
        const keyword = body.match(/^\\(Return|Break|Continue|Print)\b\s*([\s\S]*)$/);
        if (keyword) {
          const kind = keyword[1].toLowerCase();
          const node = kind === 'break' || kind === 'continue'
            ? { id: PS.nextId(), type: kind }
            : { id: PS.nextId(), type: kind, text: fromMath(keyword[2]), textMath: isSingleMath(keyword[2]) };
          if (comment !== null) node.comment = comment;
          push(node);
          break;
        }
        const call = body.match(/^\\Call\{([^{}]*)\}\{([\s\S]*)\}$/);
        const node = call
          ? { id: PS.nextId(), type: 'call', name: call[1], args: fromMath(call[2]), argsMath: isSingleMath(call[2]) }
          : { id: PS.nextId(), type: 'state', text: fromMath(body), textMath: isSingleMath(body) };
        if (comment !== null) node.comment = comment;
        push(node);
        break;
      }

      case 'Call': {
        const args = group ? readGroup(rest, group.end) : null;
        push({
          id: PS.nextId(),
          type: 'call',
          name: group ? group.value : '',
          args: args ? fromMath(args.value) : '',
          argsMath: args ? isSingleMath(args.value) : false,
        });
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
        const value = inner ? inner.value : body;
        const type = name === 'Input' ? 'require'
          : name === 'Output' ? 'ensure'
            : name.toLowerCase();
        const node = { id: PS.nextId(), type, text: fromMath(value), textMath: isSingleMath(value) };
        if (comment !== null) node.comment = comment;
        push(node);
        break;
      }

      case 'Break':
      case 'Continue':
        push({ id: PS.nextId(), type: name.toLowerCase() });
        break;

      case 'Comment': {
        const text = group ? group.value : rest;
        const array = target();
        const previous = array[array.length - 1];
        if (previous) previous.comment = text;
        else array.push({ id: PS.nextId(), type: 'comment', text });
        break;
      }

      case 'Statex':
        // \Statex is a blank spacing line in algorithmicx; render nothing.
        break;

      default:
        push({ id: PS.nextId(), type: 'raw', text: line });
    }
  }
  return model;
};

/* ------------------------------------------------------------------ */
/* Serializer                                                          */
/* ------------------------------------------------------------------ */

const KEYWORD_WORDS = new Set(['and', 'or', 'not', 'to', 'downto', 'true', 'false', 'nil', 'null']);

/** Turn a plain builder expression into a LaTeX math fragment (with $...$). */
function toMath(raw) {
  let expr = String(raw == null ? '' : raw).trim();
  if (!expr) return '';
  const dollars = (expr.match(/\$/g) || []).length;
  if (dollars === 2 && expr.startsWith('$') && expr.endsWith('$')) {
    expr = expr.slice(1, -1).trim();
  }
  if (!expr) return '';
  // CJK prose must stay outside math mode.
  if (/[\u4e00-\u9fff]/.test(expr)) return expr;
  if (expr.includes('\\')) return `$${expr}$`;
  return `$${normalizeExpr(expr)}$`;
}

function normalizeExpr(expr) {
  expr = expr.replace(/([A-Za-z])_\{(\d+)\}/g, (all, letter, digits) =>
    digits.length === 1 ? `${letter}_${digits}` : `${letter}_{${digits}}`);
  if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(expr)) return `\\text{${expr}}`;
  if (/^(true|false)$/i.test(expr)) return `\\textbf{${expr.toLowerCase()}}`;

  let value = expr
    .replace(/([A-Za-z])_?(\d+)/g, (all, letter, digits) => digits.length === 1 ? `${letter}_${digits}` : `${letter}_{${digits}}`)
    .replace(/([A-Za-z])-([A-Za-z])/g, '$1\\text{-}$2');

  value = value.replace(/(?<!\\)\b[A-Za-z]{2,}\b/g, (word) => {
    // Constants (NIL, OVERFLOW) and booleans read as text inside expressions too.
    if (/^[A-Z]{2,}$/.test(word)) return `\\text{${word}}`;
    if (/^(true|false)$/i.test(word)) return `\\textbf{${word.toLowerCase()}}`;
    return KEYWORD_WORDS.has(word.toLowerCase()) ? word : `\\mathrm{${word}}`;
  });

  value = value
    .replace(/\band\b/g, '\\land ')
    .replace(/\bor\b/g, '\\lor ')
    .replace(/\bnot\b/g, '\\lnot ')
    .replace(/<=/g, '\\le ')
    .replace(/>=/g, '\\ge ')
    .replace(/!=/g, '\\ne ')
    .replace(/->/g, '\\to ');
  return value.replace(/\s+/g, ' ').trim();
}

PS.toMath = toMath;
PS.normalizeExpr = normalizeExpr;

/** Text that already carries LaTeX (or inline math) is kept verbatim. */
function mathOrRaw(text) {
  const value = String(text == null ? '' : text);
  if (!value) return '';
  if (!/[\\$]/.test(value)) return toMath(value);

  const plainOps = (s) => s
    .replace(/<=/g, '\\le ')
    .replace(/>=/g, '\\ge ')
    .replace(/!=/g, '\\ne ');

  if (!value.includes('$')) return plainOps(value).replace(/[ \t]{2,}/g, ' ');

  return value
    .replace(/\$([^$]+)\$/g, (all, inner) =>
      `$${inner.includes('\\') ? plainOps(inner) : normalizeExpr(inner)}$`)
    .replace(/[ \t]{2,}/g, ' ');
}
PS.mathOrRaw = mathOrRaw;

function commentSuffix(node) {
  return node.comment ? ` \\Comment{${node.comment}}` : '';
}

function emitNodes(nodes, depth, out) {
  const pad = '  '.repeat(depth);
  for (const node of nodes) {
    switch (node.type) {
      case 'state':
        out.push(`${pad}\\State ${mathOrRaw(node.text) || '\\text{}'}${commentSuffix(node)}`);
        break;
      case 'call':
        out.push(`${pad}\\State \\Call{${node.name || ''}}{${mathOrRaw(node.args) || ''}}${commentSuffix(node)}`);
        break;
      case 'require':
      case 'ensure':
        out.push(`${pad}\\${node.type === 'require' ? 'Require' : 'Ensure'} ${mathOrRaw(node.text)}${commentSuffix(node)}`);
        break;
      case 'return':
        out.push(`${pad}\\Return${node.text ? ` ${mathOrRaw(node.text)}` : ''}${commentSuffix(node)}`);
        break;
      case 'print':
        out.push(`${pad}\\Print ${mathOrRaw(node.text)}${commentSuffix(node)}`);
        break;
      case 'break':
        out.push(`${pad}\\Break`);
        break;
      case 'continue':
        out.push(`${pad}\\Continue`);
        break;
      case 'comment':
        out.push(`${pad}\\Comment{${node.text || ''}}`);
        break;
      case 'if':
        node.branches.forEach((branch, index) => {
          const suffix = commentSuffix(index === 0 ? node : branch);
          out.push(`${pad}${index === 0 ? '\\If{' : '\\Elif{'}${mathOrRaw(branch.cond)}}${suffix}`);
          emitNodes(branch.body, depth + 1, out);
        });
        if (node.elseBody) {
          out.push(`${pad}\\Else${node.elseComment ? ` \\Comment{${node.elseComment}}` : ''}`);
          emitNodes(node.elseBody, depth + 1, out);
        }
        out.push(`${pad}\\EndIf`);
        break;
      case 'while':
        out.push(`${pad}\\While{${mathOrRaw(node.cond)}}${commentSuffix(node)}`);
        emitNodes(node.body, depth + 1, out);
        out.push(`${pad}\\EndWhile`);
        break;
      case 'for': {
        if (node.all) {
          out.push(`${pad}\\ForAll{${node.init || ''}}${commentSuffix(node)}`);
          emitNodes(node.body, depth + 1, out);
          out.push(`${pad}\\EndFor`);
          break;
        }
        const head = node.bound
          ? `${mathOrRaw(node.init)} ${node.downto ? '\\DownTo' : '\\To'} ${mathOrRaw(node.bound)}`
          : mathOrRaw(node.init);
        out.push(`${pad}\\For{${head}}${commentSuffix(node)}`);
        emitNodes(node.body, depth + 1, out);
        out.push(`${pad}\\EndFor`);
        break;
      }
      case 'repeat':
        out.push(`${pad}\\Repeat${commentSuffix(node)}`);
        emitNodes(node.body, depth + 1, out);
        out.push(`${pad}\\Until{${mathOrRaw(node.until)}}${commentSuffix(node)}`);
        break;
      case 'function': {
        const kind = node.kind === 'Procedure' ? 'Procedure' : 'Function';
        out.push(`${pad}\\${kind}{${node.name || ''}}{${mathOrRaw(node.args) || ''}}${commentSuffix(node)}`);
        emitNodes(node.body, depth + 1, out);
        out.push(`${pad}\\End${kind}`);
        break;
      }
      default:
        out.push(pad + (node.text || ''));
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
    le: '\u2264',
    ge: '\u2265',
    ne: '\u2260',
    ldots: '\u2026',
    cdots: '\u22ef',
    times: '\u00d7',
    pm: '\u00b1',
    infty: '\u221e',
    to: '\u2192',
    DownTo: '\u2193',
    And: '\u2227',
    Or: '\u2228',
    Not: '\u00ac',
    lfloor: '\u230a',
    rfloor: '\u230b',
    lceil: '\u2308',
    rceil: '\u2309',
    quad: ' ',
    qquad: ' ',
  };

  const ESCAPED = {
    '{': '{', '}': '}', '_': '_', '&': '&', '%': '%', '$': '$', '#': '#', '\\': '\\',
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // Font commands already present keep their argument as written.
  const FONT_GROUP = /\\(?:text|textbf|textit|texttt|textrm|textsf|textup|mathrm|mathit|mathbf|mathsf|mathtt|operatorname)\{[^{}]*\}/g;

  /**
   * Apply the builder's typesetting rules (PS.normalizeExpr) to a math
   * fragment: multi-letter identifiers upright, all-caps constants as text,
   * digits after a letter as subscripts. The parser strips \text/\mathit from
   * the source, so without this NIL would render as the product N·I·L.
   */
  function upright(tex) {
    const kept = [];
    const masked = String(tex).replace(FONT_GROUP, (group) => `\u0000${kept.push(group) - 1}\u0001`);
    return PS.normalizeExpr(masked).replace(/\u0000(\d+)\u0001/g, (all, index) => kept[Number(index)]);
  }

  const expr = (value, isMath, comparison) => {
    const text = String(value == null ? '' : value);
    if (!text) return '';
    if (isMath && !text.includes('$')) {
      // Constants and booleans are text, not a product of variables.
      if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(text)) return text;
      if (/^(true|false)$/i.test(text)) return `\\textbf{${text.toLowerCase()}}`;
      let tex = upright(text)
        .replace(/:=/g, '=')
        .replace(/<-|←/g, '=')
        .replace(/<>/g, '\\ne ')
        .replace(/&&/g, '\\land ')
        .replace(/\|\|/g, '\\lor ')
        .replace(/!=/g, '\\ne ')
        .replace(/<=/g, '\\le ')
        .replace(/>=/g, '\\ge ')
        .replace(/->/g, '\\to ')
        .replace(/(?<!\\)\b(and|or|not)\b/g, (all, word) => (
          word === 'and' ? '\\land ' : word === 'or' ? '\\lor ' : '\\lnot '
        ));
      if (comparison) tex = tex.replace(/(?<![<>=!:])=(?!=)/g, '==');
      return `$${tex}$`;
    }
    // Conditions mixing text and math ($a = b$ and $c$): `=` still means `==`.
    if (comparison) {
      return text.replace(/\$([^$]*)\$/g, (all, inner) => `$${inner.replace(/(?<![<>=!:])=(?!=)/g, '==')}$`);
    }
    return text;
  };

  function skipSpace(text, index) {
    let i = index;
    while (i < text.length && /\s/.test(text[i])) i++;
    return i;
  }

  function normalizeMath(source, prose) {
    const tex = (String(source)
      .replace(/\\gets\b/g, '=')
      .replace(/:=/g, '=')
      .replace(/<-|←/g, '=')
      .replace(/<>/g, '\\ne ')
      .replace(/&&/g, '\\land ')
      .replace(/\|\|/g, '\\lor ')
      .replace(/!=/g, '\\ne ')
      .replace(/<=/g, '\\le ')
      .replace(/>=/g, '\\ge ')
      .replace(/->/g, '\\to ')
      .replace(/(?<!\\)\b(and|or|not)\b/g, (all, word) => (
        word === 'and' ? '\\land ' : word === 'or' ? '\\lor ' : '\\lnot '
      ))
      .replace(/\\And\b/g, '\\land')
      .replace(/\\Or\b/g, '\\lor')
      .replace(/\\Not\b/g, '\\lnot')
      .replace(/\\To\b/g, '\\to')
      .replace(/\\DownTo\b/g, '\\downarrow')
      .replace(/\\textbf\{([^{}]*)\}/g, '\\mathbf{$1}')
      .replace(/\\textit\{([^{}]*)\}/g, '\\mathit{$1}')
      .replace(/\\text\{([^{}]*)\}/g, '\\text{$1}'));
    // Comments are prose: `$ab$` there is a product, not an identifier.
    return prose ? tex : upright(tex);
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

    let i = 0;
    while (i < text.length) {
      const ch = text[i];

      if (ch === '$') {
        let j = i + 1;
        let closed = false;
        while (j < text.length) {
          if (text[j] === '\\') { j += 2; continue; }
          if (text[j] === '$') { closed = true; break; }
          j++;
        }
        if (closed) {
          flush();
          tokens.push({ type: 'math', value: normalizeMath(text.slice(i + 1, j), prose) });
          i = j + 1;
          continue;
        }
        buffer += ch;
        i++;
        continue;
      }

      if (ch === '\\') {
        const command = text.slice(i).match(/^\\([A-Za-z]+)/);
        if (!command) {
          const next = text[i + 1];
          if (next != null) {
            buffer += ESCAPED[next] != null ? ESCAPED[next] : next;
            i += 2;
            continue;
          }
        }
        if (command) {
          const name = command[1];
          const after = i + command[0].length;

          // Custom markers produced by the row builder.
          if (name === 'kw' || name === 'fn') {
            const group = PS.readGroup(text, skipSpace(text, after));
            if (group) {
              flush();
              tokens.push({ type: name === 'kw' ? 'keyword' : 'function', value: group.value });
              i = group.end;
              continue;
            }
          }

          if (name === 'Call') {
            const nameGroup = PS.readGroup(text, skipSpace(text, after));
            const argsGroup = nameGroup ? PS.readGroup(text, skipSpace(text, nameGroup.end)) : null;
            if (nameGroup && argsGroup) {
              flush();
              tokens.push({ type: 'call', name: nameGroup.value, args: argsGroup.value });
              i = argsGroup.end;
              continue;
            }
          }

          if (FONT_COMMANDS[name]) {
            const group = PS.readGroup(text, skipSpace(text, after));
            if (group) {
              flush();
              tokens.push({ type: 'styled', tag: FONT_COMMANDS[name], value: group.value });
              i = group.end;
              continue;
            }
          }

          if (SYMBOLS[name] != null) {
            buffer += SYMBOLS[name];
            i = after;
            continue;
          }

          // Unknown command: keep it visible, minus the backslash.
          buffer += name;
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

  async function renderInline(app, container, source, sourcePath, component, prose) {
    const tokens = parseInline(source, prose);
    for (const token of tokens) {
      if (token.type === 'text') {
        container.appendChild(document.createTextNode(token.value));
      } else if (token.type === 'keyword') {
        container.appendChild(el('span', 'ps-kw', token.value));
      } else if (token.type === 'function') {
        container.appendChild(el('span', 'ps-fn', token.value));
      } else if (token.type === 'styled') {
        const wrapper = el(token.tag, token.tag === 'span' ? 'ps-styled' : null);
        await renderInline(app, wrapper, token.value, sourcePath, component, prose);
        container.appendChild(wrapper);
      } else if (token.type === 'call') {
        container.appendChild(el('span', 'ps-fn', token.name));
        container.appendChild(document.createTextNode('('));
        await renderInline(app, container, token.args, sourcePath, component, prose);
        container.appendChild(document.createTextNode(')'));
      } else if (token.type === 'math') {
        const wrapper = el('span', 'ps-math');
        wrapper.dataset.tex = token.value;
        wrapper.textContent = token.value;
        container.appendChild(wrapper);
      }
    }
  }

  function unwrapSingleParagraph(container) {
    if (container.childElementCount === 1 && container.firstElementChild.tagName === 'P') {
      const paragraph = container.firstElementChild;
      while (paragraph.firstChild) container.insertBefore(paragraph.firstChild, paragraph);
      paragraph.remove();
    }
  }

  /* ---------------- row building ---------------- */

  function simpleText(node) {
    switch (node.type) {
      case 'state': return expr(node.text, node.textMath);
      case 'call': return `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`;
      case 'return': return `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`;
      case 'print': return `\\kw{print} ${expr(node.text, node.textMath)}`;
      case 'break': return '\\kw{break}';
      case 'continue': return '\\kw{continue}';
      default: return node.text || '';
    }
  }

  const SIMPLE = new Set(['state', 'call', 'return', 'print', 'break', 'continue']);

  function buildRows(nodes, depth, counter, rows) {
    for (const node of nodes) {
      switch (node.type) {
        case 'function': {
          rows.push({
            number: null,
            depth,
            text: `\\fn{${node.name || ''}}(${expr(node.args, node.argsMath)})`,
            comment: node.comment || null,
            kind: 'function',
          });
          const saved = counter.value;
          counter.value = 0;
          buildRows(node.body || [], depth + 1, counter, rows);
          counter.value = saved;
          break;
        }

        case 'if': {
          node.branches.forEach((branch, index) => {
            rows.push({
              number: ++counter.value,
              depth,
              text: `\\kw{${index === 0 ? 'if' : 'else if'}} ${expr(branch.cond, branch.condMath, true)}`,
              comment: (index === 0 ? node.comment || branch.comment : branch.comment) || null,
            });
            buildRows(branch.body || [], depth + 1, counter, rows);
          });
          if (node.elseBody) {
            const only = node.elseBody.length === 1 ? node.elseBody[0] : null;
            if (only && SIMPLE.has(only.type) && !only.comment && !node.elseComment) {
              rows.push({
                number: ++counter.value,
                depth,
                text: `\\kw{else} ${simpleText(only)}`,
                comment: null,
              });
            } else {
              rows.push({ number: ++counter.value, depth, text: '\\kw{else}', comment: node.elseComment || null });
              buildRows(node.elseBody, depth + 1, counter, rows);
            }
          }
          break;
        }

        case 'while':
          rows.push({ number: ++counter.value, depth, text: `\\kw{while} ${expr(node.cond, node.condMath, true)}`, comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          break;

        case 'for': {
          if (node.all) {
            const parts = String(node.init || '').split(/\s+in\s+/);
            // A head already written with text commands (\texttt{child} of
            // \texttt{u}) is prose; math mode would swallow its spaces.
            const head = parts.length === 2
              ? `${expr(parts[0], true)} \\kw{in} ${expr(parts[1], true)}`
              : expr(node.init, !/\\text(?:tt|rm|sf|up)?\{/.test(node.init || ''));
            rows.push({ number: ++counter.value, depth, text: `\\kw{for all} ${head}`, comment: node.comment || null });
            buildRows(node.body || [], depth + 1, counter, rows);
            break;
          }
          const head = node.bound
            ? `${expr(node.init, node.initMath)} \\kw{${node.downto ? 'downto' : 'to'}} ${expr(node.bound, node.boundMath)}`
            : expr(node.init, node.initMath);
          rows.push({ number: ++counter.value, depth, text: `\\kw{for} ${head}`, comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          break;
        }

        case 'repeat':
          rows.push({ number: ++counter.value, depth, text: '\\kw{repeat}', comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          rows.push({ number: ++counter.value, depth, text: `\\kw{until} ${expr(node.until, node.untilMath, true)}`, comment: null });
          break;

        case 'state':
          if (!node.text && node.comment) {
            rows.push({ number: null, depth, text: '', comment: node.comment });
          } else {
            rows.push({ number: ++counter.value, depth, text: expr(node.text, node.textMath), comment: node.comment || null });
          }
          break;

        case 'call':
          rows.push({
            number: ++counter.value,
            depth,
            text: `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`,
            comment: node.comment || null,
          });
          break;

        case 'return':
          rows.push({ number: ++counter.value, depth, text: `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`, comment: node.comment || null });
          break;

        case 'print':
          rows.push({ number: ++counter.value, depth, text: `\\kw{print} ${expr(node.text, node.textMath)}`, comment: node.comment || null });
          break;

        case 'break':
        case 'continue':
          rows.push({ number: ++counter.value, depth, text: `\\kw{${node.type}}`, comment: node.comment || null });
          break;

        case 'require':
        case 'ensure':
          rows.push({ number: null, depth, text: `\\kw{${node.type === 'require' ? 'Require' : 'Ensure'}:} ${expr(node.text, node.textMath)}`, comment: null });
          break;

        case 'comment':
          if (rows.length) {
            rows[rows.length - 1].comment = node.text || '';
          } else {
            rows.push({ number: null, depth, text: '', comment: node.text || '' });
          }
          break;

        default:
          rows.push({ number: ++counter.value, depth, text: expr(node.text, node.textMath), comment: node.comment || null });
      }
    }
  }

  /* ---------------- public renderer ---------------- */

  PS.typesetMath = async function typesetMath(app, root, sourcePath, component) {
    const spans = Array.from(root.querySelectorAll('.ps-math[data-tex]'));
    await Promise.all(spans.map(async (span) => {
      const tex = span.dataset.tex;
      delete span.dataset.tex;
      const holder = document.createElement('span');
      holder.className = 'ps-math-render';
      try {
        await MarkdownRenderer.render(app, `$${tex}$`, holder, sourcePath, component);
        unwrapSingleParagraph(holder);
        span.textContent = '';
        while (holder.firstChild) span.appendChild(holder.firstChild);
      } catch (error) {
        span.classList.add('ps-math-error');
        span.textContent = `$${tex}$`;
      }
    }));
  };

  PS.buildRows = function buildRowsForModel(model) {
    const rows = [];
    buildRows(model.nodes || [], 0, { value: 0 }, rows);
    return rows;
  };

  PS.renderBlock = async function renderBlock(app, model, options, sourcePath, component) {
    const settings = Object.assign({ lineNumbers: true, indentSize: '1.2em' }, options || {});
    const block = el('div', 'ps-block');
    block.style.setProperty('--ps-indent', settings.indentSize || '1.2em');

    if (model.caption) {
      const title = el('div', 'ps-title');
      title.appendChild(document.createTextNode('Algorithm '));
      await renderInline(app, title, model.caption, sourcePath, component);
      block.appendChild(title);
    }

    const grid = el('div', 'ps-grid');
    const rows = PS.buildRows(model);

    for (const row of rows) {
      const rowEl = el('div', 'ps-row');
      rowEl.style.setProperty('--ps-depth', String(row.depth));
      const numberEl = el('span', 'ps-num', settings.lineNumbers && row.number != null ? String(row.number) : '');
      const codeEl = el('span', 'ps-code');
      codeEl.style.paddingLeft = `calc(var(--ps-indent) * ${row.depth})`;
      await renderInline(app, codeEl, row.text, sourcePath, component);
      const commentEl = el('span', 'ps-comment');
      if (row.comment) {
        commentEl.appendChild(document.createTextNode(`${settings.commentDelimiter || '//'} `));
        await renderInline(app, commentEl, row.comment, sourcePath, component, true);
      }
      rowEl.appendChild(numberEl);
      rowEl.appendChild(codeEl);
      rowEl.appendChild(commentEl);
      grid.appendChild(rowEl);
    }

    block.appendChild(grid);
    return block;
  };

  PS.renderInline = renderInline;
  PS.parseInline = parseInline;
})(PS);

/* Builder modal. */
((PS) => {
  const CONTAINERS = new Set(['if', 'while', 'for', 'repeat', 'function']);
  const bodyOf = (node) => PS.bodyOf(node);
  const isMathValue = (value) => String(value == null ? '' : value).trim() !== ''
    && !/[\u4e00-\u9fff]/.test(String(value));
  const mathText = (value) => PS.normalizeOperators(value);

  function cloneNode(node) {
    const copy = JSON.parse(JSON.stringify(node, (key, value) => (key === 'id' ? undefined : value)));
    const assign = (current) => {
      current.id = PS.nextId();
      if (Array.isArray(current.branches)) current.branches.forEach((branch) => branch.body.forEach(assign));
      if (Array.isArray(current.elseBody)) current.elseBody.forEach(assign);
      if (Array.isArray(current.body)) current.body.forEach(assign);
    };
    assign(copy);
    return copy;
  }

  function newNode(type) {
    switch (type) {
      case 'if': return PS.node('if', { branches: [{ cond: '', body: [] }], elseBody: null });
      case 'while': return PS.node('while', { cond: '', body: [] });
      case 'for': return PS.node('for', { init: '', bound: '', downto: false, body: [] });
      case 'forall': return PS.node('for', { all: true, init: '', bound: '', downto: false, body: [] });
      case 'repeat': return PS.node('repeat', { body: [], until: '' });
      case 'function': return PS.node('function', { kind: 'Function', name: '', args: '', body: [] });
      case 'call': return PS.node('call', { name: '', args: '' });
      default: return PS.node(type, { text: '' });
    }
  }

class BuilderModal extends Modal {
  constructor(app, options) {
    super(app);
    this.model = options.model;
    this.settings = options.settings || {};
    this.sourcePath = options.sourcePath || '';
    this.onSave = options.onSave;
    this.index = new Map();
    this.selectedId = null;
    this.focusId = null;
    this.dragId = null;
    this.dropTarget = null;
    this.previewTimer = null;
    this.previewComponent = new Component();
  }

  onOpen() {
    this.history = [];
    this.modalEl.addClass('pb-modal');
    this.titleEl.setText('Pseudocode Builder');
    this.buildLayout();
    this.renderTree();
    this.renderPreview();
    this.onUndoKey = (event) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        this.save();
        return;
      }
      if (event.key.toLowerCase() !== 'z') return;
      event.preventDefault();
      this.undo();
    };
    this.modalEl.addEventListener('keydown', this.onUndoKey);
  }

  onClose() {
    this.modalEl.removeEventListener('keydown', this.onUndoKey);
    clearTimeout(this.previewTimer);
    this.previewComponent.unload();
    this.contentEl.empty();
  }

  buildLayout() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('pb-content');

    const wrap = contentEl.createDiv('pb-wrap');
    const left = wrap.createDiv('pb-left');
    const right = wrap.createDiv('pb-right');

    const captionRow = left.createDiv('pb-row pb-caption');
    captionRow.createSpan({ cls: 'pb-chip', text: 'Title' });
    const captionInput = captionRow.createEl('input', {
      cls: 'pb-input',
      attr: { type: 'text', placeholder: 'Algorithm title (optional)' },
    });
    captionInput.value = this.model.caption || '';
    captionInput.addEventListener('input', () => {
      this.model.caption = captionInput.value;
      this.schedulePreview();
    });

    const toolbar = left.createDiv('pb-toolbar');
    const addButton = (label, factory) => {
      toolbar.createEl('button', { text: label }, (button) => {
        button.addEventListener('click', () => this.insertNode(factory()));
      });
    };
    addButton('+ Statement', () => newNode('state'));
    addButton('+ If', () => newNode('if'));
    addButton('+ While', () => newNode('while'));
    addButton('+ For', () => newNode('for'));
    addButton('+ For all', () => newNode('forall'));
    addButton('+ Repeat', () => newNode('repeat'));
    addButton('+ Procedure', () => newNode('function'));
    addButton('+ Require', () => newNode('require'));
    addButton('+ Ensure', () => newNode('ensure'));
    addButton('+ Return', () => newNode('return'));
    addButton('+ Call', () => newNode('call'));
    addButton('+ Break', () => newNode('break'));
    addButton('+ Continue', () => newNode('continue'));
    addButton('+ Print', () => newNode('print'));
    addButton('+ Comment', () => newNode('comment'));

    this.listEl = left.createDiv('pb-list');

    this.previewEl = right.createDiv('pb-preview');
    const details = right.createEl('details', { cls: 'pb-latex' });
    details.createEl('summary', { text: 'Show generated LaTeX' });
    this.latexEl = details.createEl('pre');

    const footer = contentEl.createDiv('pb-footer');
    footer.createEl('button', { text: 'Cancel' }, (button) => {
      button.addEventListener('click', () => this.close());
    });
    footer.createEl('button', { cls: 'mod-cta', text: 'Save' }, (button) => {
      button.addEventListener('click', () => this.save());
    });
  }

  /* ---- tree rendering ---- */

  pushHistory() {
    try {
      this.history.push(JSON.stringify(this.model));
      if (this.history.length > 50) this.history.shift();
    } catch (error) { /* ignore */ }
  }

  undo() {
    if (!this.history.length) return;
    this.model = JSON.parse(this.history.pop());
    this.selectedId = null;
    this.renderTree();
    this.schedulePreview();
  }

  buildIndex() {
    this.index.clear();
    const walk = (array, owner, ownerArray) => {
      array.forEach((node, position) => {
        this.index.set(node.id, { node, array, position, owner, ownerArray });
        if (node.type === 'if') {
          node.branches.forEach((branch) => walk(branch.body, node, array));
          if (node.elseBody) walk(node.elseBody, node, array);
        } else if (Array.isArray(node.body)) {
          walk(node.body, node, array);
        }
      });
    };
    walk(this.model.nodes, null, null);
  }

  renderTree() {
    this.buildIndex();
    this.listEl.empty();
    this.renderNodes(this.model.nodes, 0);
    if (this.focusId) {
      const id = this.focusId;
      this.focusId = null;
      const input = this.listEl.querySelector('input[data-id="' + id + '"]');
      if (input) {
        input.focus();
        input.select();
      }
    }
    if (this.focusCommentId) {
      const id = this.focusCommentId;
      this.focusCommentId = null;
      const input = this.listEl.querySelector('input.pb-comment-input[data-id="' + id + '"]');
      if (input) input.focus();
    }
  }

  renderNodes(nodes, depth) {
    for (const node of nodes) this.renderNode(node, depth);
  }

  row(node, depth, chip) {
    const labels = {
      state: 'statement', statement: 'statement', function: 'function', procedure: 'procedure',
      require: 'require', ensure: 'ensure', return: 'return', call: 'call', break: 'break',
      continue: 'continue', print: 'print', comment: 'comment', raw: 'raw', if: 'if',
      'else if': 'else if', else: 'else', while: 'while', for: 'for', 'for all': 'for all',
      repeat: 'repeat', until: 'until',
    };
    const element = this.listEl.createDiv('pb-row');
    element.dataset.id = node.id;
    element.style.paddingLeft = depth * 16 + 4 + 'px';
    if (this.selectedId === node.id) element.addClass('pb-selected');

    const handle = element.createEl('button', {
      cls: 'pb-drag',
      text: '⠿',
      attr: { type: 'button', draggable: 'true', 'aria-label': 'Drag to reorder', title: 'Drag to reorder' },
    });
    handle.addEventListener('dragstart', (event) => {
      this.dragId = node.id;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        try { event.dataTransfer.setData('text/plain', node.id); } catch (error) { /* ignore */ }
      }
      element.addClass('pb-dragging');
    });
    handle.addEventListener('dragend', () => {
      this.dragId = null;
      element.removeClass('pb-dragging');
      this.clearDropStyles();
    });

    if (CONTAINERS.has(node.type)) {
      const toggle = element.createEl('button', {
        cls: 'pb-toggle',
        text: node.__collapsed ? '▸' : '▾',
        attr: { type: 'button', 'aria-label': node.__collapsed ? 'Expand' : 'Collapse', title: node.__collapsed ? 'Expand' : 'Collapse' },
      });
      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        node.__collapsed = !node.__collapsed;
        this.renderTree();
      });
    }

    element.createSpan({ cls: 'pb-chip', text: labels[chip] || chip });
    element.addEventListener('click', () => {
      this.selectedId = node.id;
      this.refreshSelection();
    });
    element.addEventListener('dragover', (event) => this.handleDragOver(event, node, element));
    element.addEventListener('dragleave', (event) => {
      if (!element.contains(event.relatedTarget)) {
        element.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
      }
    });
    element.addEventListener('drop', (event) => this.handleDrop(event, node));
    return element;
  }

  clearDropStyles() {
    this.dropTarget = null;
    this.listEl.querySelectorAll('.pb-row').forEach((row) => {
      row.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
    });
  }

  handleDragOver(event, node, element) {
    if (!this.dragId || this.dragId === node.id) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    const rect = element.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / Math.max(1, rect.height);
    let mode = ratio < 0.5 ? 'before' : 'after';
    if (CONTAINERS.has(node.type) && ratio > 0.3 && ratio < 0.7) mode = 'inside';
    this.dropTarget = { id: node.id, mode };
    this.listEl.querySelectorAll('.pb-row').forEach((row) => {
      row.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
    });
    element.addClass('pb-drop-' + mode);
  }

  handleDrop(event, node) {
    event.preventDefault();
    const target = this.dropTarget;
    this.clearDropStyles();
    if (!this.dragId || !target) return;
    this.pushHistory();
    const movedId = this.dragId;
    if (!PS.reorder(this.model.nodes, movedId, node.id, target.mode)) return;
    this.selectedId = movedId;
    this.dragId = null;
    this.renderTree();
    this.schedulePreview();
  }

  refreshSelection() {
    this.listEl.querySelectorAll('.pb-row').forEach((element) => {
      element.toggleClass('pb-selected', element.dataset.id === this.selectedId);
    });
  }

  field(parent, node, value, apply, placeholder) {
    const input = parent.createEl('input', {
      cls: 'pb-input',
      attr: { type: 'text', placeholder: placeholder || '' },
    });
    input.value = value || '';
    input.dataset.id = node.id;
    input.addEventListener('input', () => {
      apply(input.value);
      this.schedulePreview();
    });
    input.addEventListener('keydown', (event) => this.onKeyDown(event, node));
    return input;
  }

  actions(parent, node, extraButtons = []) {
    const box = parent.createDiv('pb-actions');
    const button = (label, title, handler) => {
      const element = box.createEl('button', { text: label, attr: { title, 'aria-label': title } });
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        handler();
      });
    };
    button('↑', 'Move up', () => this.move(node, -1));
    button('↓', 'Move down', () => this.move(node, 1));
    button('⇤', 'Outdent', () => this.outdent(node));
    button('⇥', 'Indent', () => this.indent(node));
    if (CONTAINERS.has(node.type)) {
      button('+', 'Add statement inside', () => {
        this.pushHistory();
        const child = newNode('state');
        bodyOf(node).push(child);
        this.focusId = child.id;
        this.renderTree();
        this.schedulePreview();
      });
      button('+after', 'Add statement after', () => {
        this.pushHistory();
        const info = this.index.get(node.id);
        if (!info) return;
        const child = newNode('state');
        info.array.splice(info.position + 1, 0, child);
        this.selectedId = child.id;
        this.focusId = child.id;
        this.renderTree();
        this.schedulePreview();
      });
    }
    button('//', 'Trailing comment', () => {
      this.pushHistory();
      node.__showComment = !node.__showComment;
      this.focusCommentId = node.id;
      this.renderTree();
    });
    button('⧉', 'Duplicate', () => this.duplicate(node));
    extraButtons.forEach(([label, title, handler]) => button(label, title, handler));
    button('✕', 'Delete', () => this.remove(node));
  }

  // get/set pick which comment a row edits: if and else-if rows keep theirs
  // on the branch, the else row on node.elseComment.
  maybeComment(parent, node, get = () => node.comment, set = (value) => { node.comment = value; }) {
    if (get() == null && !node.__showComment) return;
    const anchor = parent.querySelector(':scope > .pb-actions');
    const mount = (element) => {
      if (anchor) parent.insertBefore(element, anchor);
      else parent.appendChild(element);
      return element;
    };
    mount(parent.createSpan({ cls: 'pb-word', text: '//' }));
    const input = mount(parent.createEl('input', {
      cls: 'pb-input pb-comment-input',
      attr: { type: 'text', placeholder: 'trailing comment' },
    }));
    input.dataset.id = node.id;
    input.value = get() || '';
    input.addEventListener('input', () => {
      set(input.value);
      this.schedulePreview();
    });
  }

  duplicate(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const copy = cloneNode(node);
    info.array.splice(info.position + 1, 0, copy);
    this.selectedId = copy.id;
    this.renderTree();
    this.schedulePreview();
  }

  renderNode(node, depth) {
    switch (node.type) {
      case 'if': {
        node.branches.forEach((branch, branchIndex) => {
          if (node.__collapsed && branchIndex > 0) return;
          const element = this.row(node, depth, branchIndex === 0 ? 'if' : 'else if');
          this.field(element, node, branch.cond, (value) => {
            branch.cond = mathText(value);
            branch.condMath = isMathValue(value);
          }, 'condition, e.g. i == 0');
          this.actions(element, node, node.elseBody ? [] : [
            ['+else if', 'Add else-if branch', () => {
              this.pushHistory();
              node.branches.push({ cond: '', body: [] });
              this.renderTree();
              this.schedulePreview();
            }],
            ['+else', 'Add else branch', () => {
              this.pushHistory();
              node.elseBody = [];
              this.renderTree();
              this.schedulePreview();
            }],
            ...(branchIndex > 0 ? [['-branch', 'Remove this branch', () => {
              this.pushHistory();
              node.branches.splice(branchIndex, 1);
              this.renderTree();
              this.schedulePreview();
            }]] : []),
          ]);
          if (branchIndex === 0) this.maybeComment(element, node);
          else this.maybeComment(element, node, () => branch.comment, (value) => { branch.comment = value; });
          if (!node.__collapsed) this.renderNodes(branch.body, depth + 1);
        });
        if (node.elseBody && !node.__collapsed) {
          const element = this.row(node, depth, 'else');
          this.actions(element, node, [['-else', 'Remove else branch', () => {
            this.pushHistory();
            node.elseBody = null;
            this.renderTree();
            this.schedulePreview();
          }]]);
          this.maybeComment(element, node, () => node.elseComment, (value) => { node.elseComment = value; });
          this.renderNodes(node.elseBody, depth + 1);
        }
        return;
      }
      case 'while': {
        const element = this.row(node, depth, 'while');
        this.field(element, node, node.cond, (value) => {
          node.cond = mathText(value);
          node.condMath = isMathValue(value);
        }, 'condition, e.g. k > 0');
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'for': {
        if (node.all) {
          const element = this.row(node, depth, 'for all');
          this.field(element, node, node.init, (value) => {
            node.init = mathText(value);
            node.initMath = isMathValue(value);
          }, 'variable in set, e.g. x in S');
          this.actions(element, node);
          this.maybeComment(element, node);
          if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
          return;
        }
        const element = this.row(node, depth, 'for');
        this.field(element, node, node.init, (value) => {
          node.init = mathText(value);
          node.initMath = isMathValue(value);
        }, 'start, e.g. j = 2');
        const direction = element.createEl('select', { cls: 'pb-select' });
        [['to', 'to'], ['downto', 'downto']].forEach(([value, label]) => {
          const option = direction.createEl('option', { text: label, value });
          if ((node.downto ? 'downto' : 'to') === value) option.selected = true;
        });
        direction.addEventListener('change', () => {
          node.downto = direction.value === 'downto';
          this.schedulePreview();
        });
        this.field(element, node, node.bound, (value) => {
          node.bound = mathText(value);
          node.boundMath = isMathValue(value);
        }, 'end, e.g. n');
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'repeat': {
        const head = this.row(node, depth, 'repeat');
        this.actions(head, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        const tail = this.row(node, depth, 'until');
        this.field(tail, node, node.until, (value) => {
          node.until = mathText(value);
          node.untilMath = isMathValue(value);
        }, 'condition, e.g. m == 9');
        return;
      }
      case 'function': {
        const element = this.row(node, depth, 'function');
        const kind = element.createEl('select', { cls: 'pb-select' });
        ['Function', 'Procedure'].forEach((option) => {
          const item = kind.createEl('option', { text: option, value: option });
          if (node.kind === option) item.selected = true;
        });
        kind.addEventListener('change', () => {
          node.kind = kind.value;
          this.schedulePreview();
        });
        this.field(element, node, node.name, (value) => { node.name = value; }, 'name, e.g. PushS1');
        element.createSpan({ cls: 'pb-word', text: '(' });
        this.field(element, node, node.args, (value) => {
          node.args = mathText(value);
          node.argsMath = isMathValue(value);
        }, 'args, e.g. A, x');
        element.createSpan({ cls: 'pb-word', text: ')' });
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'call': {
        const element = this.row(node, depth, 'call');
        this.field(element, node, node.name, (value) => { node.name = value; }, 'procedure name');
        element.createSpan({ cls: 'pb-word', text: '(' });
        this.field(element, node, node.args, (value) => {
          node.args = mathText(value);
          node.argsMath = isMathValue(value);
        }, 'args, e.g. A, i');
        element.createSpan({ cls: 'pb-word', text: ')' });
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'comment': {
        const element = this.row(node, depth, '//');
        this.field(element, node, node.text, (value) => { node.text = value; }, 'comment text');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'require':
      case 'ensure': {
        const element = this.row(node, depth, node.type);
        this.field(element, node, node.text, (value) => {
          node.text = mathText(value);
          node.textMath = isMathValue(value);
        }, node.type === 'require' ? 'input, e.g. A, n' : 'output, e.g. A is sorted');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'return':
      case 'print': {
        const element = this.row(node, depth, node.type);
        this.field(element, node, node.text, (value) => {
          node.text = mathText(value);
          node.textMath = isMathValue(value);
        }, 'value (optional)');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'break':
      case 'continue': {
        const element = this.row(node, depth, node.type);
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'raw': {
        const element = this.row(node, depth, 'raw');
        this.field(element, node, node.text, (value) => { node.text = value; }, 'unrecognized raw line');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      default: {
        const element = this.row(node, depth, 'statement');
        this.field(element, node, node.text, (value) => {
          node.text = mathText(value);
          node.textMath = isMathValue(value);
        }, 'e.g. S1.top = 0');
        this.actions(element, node);
        this.maybeComment(element, node);
      }
    }
  }

  /* ---- structural operations ---- */

  insertNode(node) {
    this.pushHistory();
    const selected = this.selectedId ? this.index.get(this.selectedId) : null;
    if (selected && CONTAINERS.has(selected.node.type)) {
      bodyOf(selected.node).push(node);
    } else if (selected) {
      selected.array.splice(selected.position + 1, 0, node);
    } else {
      this.model.nodes.push(node);
    }
    this.selectedId = node.id;
    this.focusId = node.id;
    this.renderTree();
    this.schedulePreview();
  }

  insertSiblingAfter(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const sibling = newNode('state');
    info.array.splice(info.position + 1, 0, sibling);
    this.selectedId = sibling.id;
    this.focusId = sibling.id;
    this.renderTree();
    this.schedulePreview();
  }

  move(node, direction) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const target = info.position + direction;
    if (target < 0 || target >= info.array.length) return;
    const [moved] = info.array.splice(info.position, 1);
    info.array.splice(target, 0, moved);
    this.renderTree();
    this.schedulePreview();
  }

  indent(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info || info.position === 0) return;
    const previous = info.array[info.position - 1];
    if (!CONTAINERS.has(previous.type)) return;
    info.array.splice(info.position, 1);
    bodyOf(previous).push(node);
    this.renderTree();
    this.schedulePreview();
  }

  outdent(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info || !info.owner) return;
    const ownerInfo = this.index.get(info.owner.id);
    if (!ownerInfo) return;
    info.array.splice(info.position, 1);
    ownerInfo.array.splice(ownerInfo.position + 1, 0, node);
    this.renderTree();
    this.schedulePreview();
  }

  remove(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    info.array.splice(info.position, 1);
    if (this.selectedId === node.id) this.selectedId = null;
    this.renderTree();
    this.schedulePreview();
  }

  onKeyDown(event, node) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (CONTAINERS.has(node.type)) {
      const child = newNode('state');
      if (node.type === 'if') node.branches[0].body.push(child);
      else node.body.push(child);
      this.selectedId = child.id;
      this.focusId = child.id;
      this.renderTree();
      this.schedulePreview();
      return;
    }
    this.insertSiblingAfter(node);
  }

  /* ---- preview and saving ---- */

  schedulePreview() {
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.renderPreview(), 220);
  }

  async renderPreview() {
    const latex = PS.serializeLatex(this.model);
    if (this.latexEl) this.latexEl.setText(latex);
    if (!this.previewEl) return;
    this.previewEl.empty();
    try {
      const ast = PS.parseLatex(PS.serializeLatex(this.model));
      const block = await PS.renderBlock(this.app, ast, this.settings, this.sourcePath, this.previewComponent);
      block.style.visibility = 'hidden';
      this.previewEl.appendChild(block);
      try {
        await PS.typesetMath(this.app, block, this.sourcePath, this.previewComponent);
      } finally {
        block.style.visibility = '';
      }
    } catch (error) {
      this.previewEl.createDiv({ cls: 'pb-error', text: 'Render failed: ' + error.message });
    }
  }

  save() {
    const missing = [];
    const scan = (nodes) => {
      nodes.forEach((node) => {
        if (node.type === 'function' && !String(node.name || '').trim()) missing.push(node);
        if (Array.isArray(node.branches)) node.branches.forEach((branch) => scan(branch.body));
        if (Array.isArray(node.elseBody)) scan(node.elseBody);
        if (Array.isArray(node.body)) scan(node.body);
      });
    };
    scan(this.model.nodes);
    if (missing.length) {
      new Notice('Function name is required');
      this.selectedId = missing[0].id;
      this.focusId = missing[0].id;
      this.renderTree();
      return;
    }
    const latex = PS.serializeLatex(this.model);
    try {
      this.onSave(latex);
    } catch (error) {
      new Notice('Save failed: ' + error.message);
      return;
    }
    this.close();
  }
}

/* ------------------------------------------------------------------------- *
 * Plugin
 * ------------------------------------------------------------------------- */

const FENCE_OPEN = /^```\s*pseudo\s*$/;
const FENCE_CLOSE = /^```\s*$/;

PS.BuilderModal = BuilderModal;
})(PS);

/*
 * Pseudocode Suite — plugin entry.
 */

const DEFAULT_SETTINGS = {
  lineNumbers: true,
  indentSize: '1.2em',
  commentDelimiter: '//',
};

const FENCE_OPEN = /^```\s*pseudo\s*$/;
const FENCE_CLOSE = /^```\s*$/;

class SettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Pseudocode Suite' });

    new Setting(containerEl)
      .setName('Show line numbers')
      .setDesc('Show a number before each statement; procedure headers stay unnumbered.')
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.lineNumbers)
        .onChange(async (value) => {
          this.plugin.settings.lineNumbers = value;
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));

    new Setting(containerEl)
      .setName('Indent width')
      .setDesc('Indent per nesting level, e.g. 1.2em or 16px.')
      .addText((text) => text
        .setValue(this.plugin.settings.indentSize)
        .onChange(async (value) => {
          this.plugin.settings.indentSize = value || '1.2em';
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));

    new Setting(containerEl)
      .setName('Comment prefix')
      .setDesc('Prefix for trailing comments, default //.')
      .addText((text) => text
        .setValue(this.plugin.settings.commentDelimiter)
        .onChange(async (value) => {
          this.plugin.settings.commentDelimiter = value;
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));
  }
}

class PseudocodeSuitePlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.registerMarkdownCodeBlockProcessor('pseudo', (source, el, ctx) => this.renderCodeBlock(source, el, ctx));
    this.registerMarkdownPostProcessor((el, ctx) => this.attachEditButtons(el, ctx));
    this.addSettingTab(new SettingsTab(this.app, this));

    this.addRibbonIcon('square-pen', 'Insert pseudocode block', () => this.openInsert(null));
    this.addCommand({
      id: 'insert-pseudocode-block',
      name: 'Insert pseudocode block',
      editorCallback: (editor) => this.openInsert(editor),
    });
    this.addCommand({
      id: 'edit-pseudocode-block',
      name: 'Edit pseudocode block',
      editorCallback: (editor) => this.openEdit(editor),
    });
  }

  async loadSettings() {
    const data = (await this.loadData()) || {};
    const legacy = data.jsSettings || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, {
      lineNumbers: legacy.lineNumber != null ? legacy.lineNumber : data.lineNumbers,
      indentSize: legacy.indentSize || data.indentSize,
      commentDelimiter: legacy.commentDelimiter || data.commentDelimiter,
    });
    if (this.settings.lineNumbers == null) this.settings.lineNumbers = DEFAULT_SETTINGS.lineNumbers;
    if (!this.settings.indentSize) this.settings.indentSize = DEFAULT_SETTINGS.indentSize;
    if (!this.settings.commentDelimiter) this.settings.commentDelimiter = DEFAULT_SETTINGS.commentDelimiter;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /** Re-render every open markdown view after a setting change. */
  refreshAll() {
    this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      const view = leaf.view;
      if (view && typeof view.previewMode !== 'undefined' && view.previewMode) {
        try { view.previewMode.rerender(true); } catch (error) { /* ignore */ }
      }
    });
  }

  async renderCodeBlock(source, el, ctx) {
    try {
      const ast = PS.parseLatex(source);
      const component = new Component();
      ctx.addChild(component);
      const block = await PS.renderBlock(this.app, ast, this.settings, ctx.sourcePath, component);
      block.style.visibility = 'hidden';
      el.appendChild(block);
      try {
        await PS.typesetMath(this.app, block, ctx.sourcePath, component);
      } finally {
        block.style.visibility = '';
      }

      const section = ctx.getSectionInfo ? ctx.getSectionInfo(el) : null;
      if (section) {
        const fence = this.fenceFor(section, source);
        if (fence) this.addEditButton(block, ctx.sourcePath, fence);
      }
    } catch (error) {
      const box = el.createDiv({ cls: 'ps-error' });
      box.setText(`Pseudocode render failed: ${error && error.message ? error.message : error}`);
    }
  }

  /* ---------------- edit buttons ---------------- */

  fenceFor(section, source) {
    const lines = String(section.text || '').split('\n');
    const offsets = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        offsets.push({ start, end: i, content: lines.slice(start + 1, i).join('\n').trim() });
        start = -1;
      }
    }
    if (!offsets.length) return null;
    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const wanted = normalize(source);
    let index = offsets.findIndex((fence) => normalize(fence.content) === wanted);
    if (index < 0) index = 0;
    const base = section.lineStart - offsets[0].start;
    const chosen = offsets[index];
    return { start: base + chosen.start, end: base + chosen.end, source: source };
  }

  addEditButton(block, path, fence) {
    if (!fence || block.querySelector(':scope > .ps-edit-btn')) return;
    block.classList.add('ps-has-btn');
    const button = document.createElement('button');
    button.className = 'ps-edit-btn';
    button.textContent = '✎ Edit';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.openAtFence(path, fence);
    });
    block.appendChild(button);
  }

  attachEditButtons(el, ctx) {
    if (!el || el.nodeType !== 1) return;
    if (el.ownerDocument !== document) return;
    if (el.closest('.ps-builder-preview')) return;
    const blocks = el.querySelectorAll('.ps-block');
    if (!blocks.length) return;

    const section = ctx && ctx.getSectionInfo ? ctx.getSectionInfo(el) : null;
    const fences = section ? this.fencesIn(section.text, section.lineStart) : [];

    blocks.forEach((block, index) => {
      if (block.querySelector(':scope > .ps-edit-btn')) return;
      block.classList.add('ps-has-btn');
      const button = document.createElement('button');
      button.className = 'ps-edit-btn';
      button.textContent = '✎ Edit';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const fence = fences[index];
        if (!fence) {
          new Notice('Could not locate this pseudocode block. Use the "Edit pseudocode block" command in the editor.');
          return;
        }
        this.openAtFence(ctx.sourcePath, fence);
      });
      block.appendChild(button);
    });
  }

  fencesIn(text, lineStart) {
    const lines = String(text || '').split('\n');
    const offsets = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        offsets.push({ start, end: i, content: lines.slice(start + 1, i).join('\n') });
        start = -1;
      }
    }
    if (!offsets.length) return [];
    const base = lineStart - offsets[0].start;
    return offsets.map((fence) => ({
      start: base + fence.start,
      end: base + fence.end,
      source: fence.content,
    }));
  }

  locateFence(lines, source, approximate) {
    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const wanted = normalize(source);
    const found = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        found.push({ start, end: i, content: lines.slice(start + 1, i).join('\n') });
        start = -1;
      }
    }
    const matches = found.filter((item) => normalize(item.content) === wanted);
    if (!matches.length) return null;
    return matches.reduce((best, item) =>
      Math.abs(item.start - approximate) < Math.abs(best.start - approximate) ? item : best);
  }

  async openAtFence(path, fence) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      new Notice(`File not found: ${path}`);
      return;
    }
    const data = await this.app.vault.read(file);
    const eol = data.includes('\r\n') ? '\r\n' : '\n';
    const lines = data.split(/\r?\n/);
    let located = fence.source ? this.locateFence(lines, fence.source, fence.start) : null;
    if (!located && Number.isInteger(fence.start) && Number.isInteger(fence.end)
      && FENCE_OPEN.test((lines[fence.start] || '').trim())
      && FENCE_CLOSE.test((lines[fence.end] || '').trim())) {
      located = { start: fence.start, end: fence.end };
    }
    if (!located) {
      new Notice('The block moved. Reopen the note and try again.');
      return;
    }
    const blockSource = lines.slice(located.start + 1, located.end).join(eol);
    const model = PS.parseLatex(blockSource);
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: path,
      onSave: async (latex) => {
        await this.app.vault.process(file, (content) => {
          const fileEol = content.includes('\r\n') ? '\r\n' : '\n';
          const current = content.split(/\r?\n/);
          const target = this.locateFence(current, blockSource, located.start);
          if (!target) return content;
          return current.slice(0, target.start + 1)
            .concat(latex.split('\n'), current.slice(target.end))
            .join(fileEol);
        });
        new Notice('Pseudocode updated');
      },
    }).open();
  }

  /* ---------------- commands ---------------- */

  activeEditor(editor) {
    if (editor) return editor;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    return view ? view.editor : null;
  }

  openInsert(editor) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const mode = view && typeof view.getMode === 'function' ? view.getMode() : 'source';
    const target = editor || (view && mode === 'source' ? view.editor : null);
    const model = { caption: '', nodes: [] };
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: this.app.workspace.getActiveFile()?.path || '',
      onSave: async (latex) => {
        const block = `\`\`\`pseudo\n${latex}\n\`\`\`\n`;
        if (target) {
          target.replaceSelection(block);
          return;
        }
        const file = this.app.workspace.getActiveFile();
        if (file) {
          await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, '')}\n\n${block}`);
          new Notice('Pseudocode appended to the end of the note');
          return;
        }
        new Notice('Open a note before inserting');
      },
    }).open();
  }

  openEdit(editor) {
    const fence = this.findFence(editor);
    if (!fence) {
      new Notice('Cursor is not inside a ```pseudo block');
      return;
    }
    const model = PS.parseLatex(fence.source);
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: this.app.workspace.getActiveFile()?.path || '',
      onSave: (latex) => {
        editor.replaceRange(latex + '\n', { line: fence.start + 1, ch: 0 }, { line: fence.end, ch: 0 });
        new Notice('Pseudocode updated');
      },
    }).open();
  }

  findFence(editor) {
    if (!editor) return null;
    const cursor = editor.getCursor();
    let start = -1;
    for (let i = Math.min(cursor.line, editor.lineCount() - 1); i >= 0; i--) {
      if (FENCE_OPEN.test(editor.getLine(i).trim())) {
        start = i;
        break;
      }
    }
    if (start < 0) return null;
    let end = -1;
    for (let i = start + 1; i < editor.lineCount(); i++) {
      if (FENCE_CLOSE.test(editor.getLine(i).trim())) {
        end = i;
        break;
      }
    }
    if (end < 0) return null;
    const source = editor.getRange({ line: start + 1, ch: 0 }, { line: end, ch: 0 });
    return { start, end, source };
  }
}

module.exports = PseudocodeSuitePlugin;

