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
    .replace(/\\le\b/g, '<=')
    .replace(/\\ge\b/g, '>=')
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
    .replace(/\\text(?:bf|it|tt|rm|sf|up)\{([^{}]*)\}/g, '$1')
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
    if (/^\\(?:begin|end)\{algorithm(?:ic)?\}/.test(line)) continue;
    if (/^\\label\{/.test(line)) continue;

    const match = line.match(/^\\([A-Za-z]+)([\s\S]*)$/);
    if (!match) {
      push({ id: PS.nextId(), type: 'raw', text: line });
      continue;
    }
    const name = match[1];
    const rest = (match[2] || '').trim();
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
        top.node.branches.push(branch);
        stack[stack.length - 1] = { target: branch.body, node: top.node };
        break;
      }
      case 'Else': {
        const top = stack[stack.length - 1];
        if (!top.node || top.node.type !== 'if') break;
        top.node.elseBody = [];
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
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'EndWhile':
        pop();
        break;

      case 'ForAll': {
        const content = group ? group.value : '';
        const node = {
          id: PS.nextId(),
          type: 'for',
          all: true,
          init: fromMath(content),
          initMath: isSingleMath(content),
          bound: '',
          body: [],
        };
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'For': {
        const content = group ? group.value : '';
        const parts = content.split(/\\(?:To|DownTo)\b/i);
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
        push(node);
        stack.push({ target: node.body, node });
        break;
      }
      case 'EndFor':
        pop();
        break;

      case 'Repeat': {
        const node = { id: PS.nextId(), type: 'repeat', body: [], until: '' };
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

  value = value.replace(/(?<!\\)\b[A-Za-z]{2,}\b/g, (word) =>
    KEYWORD_WORDS.has(word.toLowerCase()) ? word : `\\mathrm{${word}}`);

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
          const suffix = index === 0 ? commentSuffix(node) : '';
          out.push(`${pad}${index === 0 ? '\\If{' : '\\Elif{'}${mathOrRaw(branch.cond)}}${suffix}`);
          emitNodes(branch.body, depth + 1, out);
        });
        if (node.elseBody) {
          out.push(`${pad}\\Else`);
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
        const head = node.bound
          ? `${mathOrRaw(node.init)} ${node.downto ? '\\DownTo' : '\\To'} ${mathOrRaw(node.bound)}`
          : mathOrRaw(node.init);
        out.push(`${pad}\\${node.all ? 'ForAll' : 'For'}{${head}}${commentSuffix(node)}`);
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
