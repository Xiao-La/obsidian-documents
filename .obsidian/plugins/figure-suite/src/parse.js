/*
 * Figure Suite — figure source parser.
 *
 *   figure cols=2            optional global options
 *   panel (a)                optional: starts a captioned panel
 *   array A start=1          block header at column 0: kind, name, key=value
 *     5 2 4 6 1 3            indented body
 *     shade: 2..3            directive lines: `word: ...`
 *
 * Lines whose first non-blank characters are `//` or `%` are comments.
 */

const BLOCK_KINDS = ['array', 'table', 'tree', 'graph', 'list', 'chains', 'text', 'arrow', 'space'];
/** Bare words in a block header that act as boolean options. */
const HEADER_FLAGS = {
  array: ['vertical'],
  table: ['index', 'brackets', 'matrix'],
  tree: [],
  graph: ['directed', 'undirected', 'digraph'],
  list: ['double', 'doubly', 'single', 'singly'],
  chains: ['double', 'doubly', 'single', 'singly'],
  text: ['bold', 'math'],
  arrow: ['both'],
  space: [],
};
/** Options each header accepts (anything else is reported as a likely typo). */
const KNOWN_OPTS = {
  figure: ['cols', 'gap', 'rowgap', 'size', 'fill', 'lw', 'align', 'padding', 'background'],
  panel: ['dir', 'gap'],
  array: ['start', 'index', 'w', 'h', 'fill', 'label', 'vertical'],
  table: ['start', 'index', 'brackets', 'matrix', 'grid', 'w', 'h', 'fill', 'uniform'],
  tree: ['r', 'levelgap', 'sibgap', 'shape', 'fill', 'arrows', 'trifill'],
  graph: ['layout', 'dir', 'unit', 'r', 'shape', 'fill', 'spread', 'cols', 'directed', 'undirected'],
  list: ['double', 'single', 'singly', 'fields', 'w', 'h', 'gap', 'fill'],
  chains: ['double', 'single', 'singly', 'start', 'w', 'slot', 'h', 'fill', 'slotfill'],
  text: ['size', 'mode', 'math', 'bold', 'align', 'color'],
  arrow: ['len', 'dir', 'width', 'both'],
  space: [],
};
const OPT_VALUES = {
  'array.index': ['above', 'below', 'none', 'left', 'right'],
  'table.grid': ['all', 'none', 'outer', 'rows', 'cols'],
  'tree.shape': ['circle', 'box', 'ellipse', 'none', 'point', 'tri', 'triangle'],
  'tree.arrows': ['up', 'down', 'none'],
  'graph.layout': ['auto', 'manual', 'layered', 'tree', 'dag', 'force', 'spring', 'circle', 'line', 'row', 'grid'],
  'graph.dir': ['down', 'right'],
  'graph.shape': ['circle', 'box', 'ellipse', 'none', 'point', 'double'],
  'arrow.dir': ['right', 'left', 'up', 'down'],
  'panel.dir': ['row', 'col'],
  'figure.align': ['top', 'center', 'bottom'],
  'text.align': ['left', 'center', 'right'],
};

function checkOpts(kind, opts, line, errors) {
  const known = KNOWN_OPTS[kind] || [];
  for (const [k, v] of Object.entries(opts)) {
    if (!known.includes(k)) {
      errors.push({ line, msg: `Unknown option "${k}=" for ${kind}${known.length ? ` (options: ${known.join(', ')})` : ''}`, warn: true });
      continue;
    }
    const allowed = OPT_VALUES[`${kind}.${k}`];
    if (allowed && !allowed.includes(String(v).toLowerCase())) errors.push({ line, msg: `${kind} ${k}=${v}: expected ${allowed.join(' | ')}`, warn: true });
  }
}

const DIRECTIVES = {
  array: ['shade', 'ptr', 'span', 'bar', 'arc', 'index', 'values', 'color'],
  table: ['shade', 'cols', 'rows', 'arrow', 'path', 'color'],
  tree: ['level'],
  graph: ['group', 'rank', 'shade'],
  list: ['shade', 'names', 'color'],
  chains: ['shade', 'color'],
  text: [],
  arrow: [],
  space: [],
};

/**
 * Split a line into tokens: whitespace separated, but quotes, (...), [...]
 * and {...} are kept whole. Returns [{ text, quoted }].
 */
function tokenize(line) {
  const out = [];
  let i = 0;
  const s = line;
  while (i < s.length) {
    while (i < s.length && /\s/.test(s[i])) i++;
    if (i >= s.length) break;
    const start = i;
    let text = '';
    let quoted = false;
    let depth = 0;
    while (i < s.length && (depth > 0 || !/\s/.test(s[i]))) {
      const ch = s[i];
      if (ch === '"' && depth === 0) {
        const end = s.indexOf('"', i + 1);
        const stop = end < 0 ? s.length : end;
        // whole token quoted → strip quotes; key="v" → strip too
        // A quote opening the token (or a key="..." value) only groups words:
        // it is dropped. Quotes inside a label stay and mean upright text.
        if (i === start) { quoted = true; text += s.slice(i + 1, stop); } else if (/^[A-Za-z][\w-]*=$/.test(text)) text += s.slice(i + 1, stop);
        else text += s.slice(i, Math.min(s.length, stop + 1));
        i = stop + 1;
        continue;
      }
      if (ch === '\\' && i + 1 < s.length) { text += ch + s[i + 1]; i += 2; continue; }
      if (ch === '(' || ch === '[' || ch === '{') depth++;
      else if ((ch === ')' || ch === ']' || ch === '}') && depth > 0) depth--;
      text += ch;
      i++;
    }
    out.push({ text, quoted, start });
  }
  return out;
}

const unquote = (t) => String(t).replace(/^"(.*)"$/s, '$1');

const KEYVAL = /^([A-Za-z][\w-]*)=(.*)$/s;

/** tokens → { pos: [string], opts: { key: value }, quoted: Set(indices of pos) } */
function splitArgs(tokens) {
  const pos = [];
  const opts = {};
  const quoted = new Set();
  for (const tok of tokens) {
    const m = tok.quoted ? null : tok.text.match(KEYVAL);
    if (m) opts[m[1].toLowerCase()] = m[2];
    else {
      if (tok.quoted) quoted.add(pos.length);
      pos.push(tok.text);
    }
  }
  return { pos, opts, quoted };
}

function parseFigure(source) {
  const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
  const fig = { opts: {}, panels: [], errors: [], blocks: [] };
  let panel = null;
  let block = null;
  let implicit = false;

  const newPanel = (caption, opts, line, isImplicit) => {
    panel = { caption, opts: opts || {}, blocks: [], line };
    implicit = isImplicit;
    fig.panels.push(panel);
    return panel;
  };

  lines.forEach((raw, idx) => {
    const lineNo = idx + 1;
    const text = raw.replace(/\s+$/, '');
    const trimmed = text.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('%')) return;
    const indent = text.length - text.replace(/^[\t ]+/, '').length;
    if (indent > 0) {
      if (!block) { fig.errors.push({ line: lineNo, msg: 'Indented line outside a block' }); return; }
      block.body.push({ line: lineNo, indent: text.slice(0, indent).replace(/\t/g, '    ').length, text: trimmed });
      return;
    }
    const tokens = tokenize(trimmed);
    const head = tokens[0].text.toLowerCase();
    block = null;
    if (head === 'figure') {
      const args = splitArgs(tokens.slice(1));
      checkOpts('figure', args.opts, lineNo, fig.errors);
      fig.line = lineNo;
      Object.assign(fig.opts, args.opts);
      return;
    }
    if (head === 'panel') {
      const args = splitArgs(tokens.slice(1));
      checkOpts('panel', args.opts, lineNo, fig.errors);
      newPanel(args.pos.join(' '), args.opts, lineNo, false);
      return;
    }
    if (!BLOCK_KINDS.includes(head)) {
      fig.errors.push({ line: lineNo, msg: `Unknown block "${tokens[0].text}" (expected ${BLOCK_KINDS.join(', ')}, panel or figure)` });
      return;
    }
    const args = splitArgs(tokens.slice(1));
    const flagWords = HEADER_FLAGS[head] || [];
    args.pos = args.pos.filter((p, k) => {
      if (args.quoted.has(k) || !flagWords.includes(p)) return true;
      args.opts[p === 'doubly' ? 'double' : p === 'digraph' ? 'directed' : p] = 'true';
      return false;
    });
    checkOpts(head, args.opts, lineNo, fig.errors);
    block = { kind: head, line: lineNo, pos: args.pos, opts: args.opts, body: [], index: fig.blocks.length };
    fig.blocks.push(block);
    if (head === 'arrow') {
      // an arrow always sits between panels
      newPanel('', {}, lineNo, true).arrow = true;
      panel.blocks.push(block);
      panel = null;
      return;
    }
    if (!panel || (panel.arrow)) newPanel('', {}, lineNo, true);
    panel.blocks.push(block);
  });

  // split bodies into directives / data lines
  for (const b of fig.blocks) {
    const allowed = DIRECTIVES[b.kind] || [];
    b.directives = [];
    b.data = [];
    for (const entry of b.body) {
      const m = entry.text.match(/^([a-z]+):(?:\s+(.*))?$/);
      if (m && allowed.includes(m[1])) b.directives.push({ name: m[1], rest: m[2] || '', line: entry.line });
      else {
        // `word:` in a block without labels of that shape is almost surely a mistyped directive
        if (m && ['array', 'table', 'list'].includes(b.kind)) {
          fig.errors.push({ line: entry.line, msg: `Unknown directive "${m[1]}:" in ${b.kind} (directives: ${allowed.join(', ')})` });
          continue;
        }
        b.data.push(entry);
      }
    }
  }
  void implicit;
  return fig;
}

/* ---------------- shared value helpers ---------------- */

/** "3" | "2..5" | "2-5" → [from, to] ints, or null */
function parseRange(text) {
  const m = String(text).match(/^(-?\d+)(?:\s*(?:\.\.|–|:)\s*(-?\d+))?$/);
  if (!m) return null;
  const a = parseInt(m[1], 10);
  const b = m[2] != null ? parseInt(m[2], 10) : a;
  return [Math.min(a, b), Math.max(a, b)];
}

/** "(r,c)" | "(r1..r2, c1..c2)" → { rows: [a,b], cols: [a,b] } */
function parseCellRef(text) {
  const m = String(text).match(/^\(\s*([^,]+?)\s*,\s*([^)]+?)\s*\)$/);
  if (!m) return null;
  const rows = parseRange(m[1]);
  const cols = parseRange(m[2]);
  return rows && cols ? { rows, cols } : null;
}

/** "(x,y)" → [x, y] */
function parsePoint(text) {
  const m = String(text).match(/^\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)$/);
  return m ? [parseFloat(m[1]), parseFloat(m[2])] : null;
}

const isColor = (word) => !!word && (word in COLORS || /^#[0-9a-f]{3,8}$/i.test(word));

/** "label@color" → { label, color } */
function splitColor(token) {
  const m = String(token).match(/^(.*)@([#\w]+)$/s);
  if (m && isColor(m[2])) return { label: m[1], color: m[2] };
  return { label: token, color: null };
}

const num = (v, fallback) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
};
const truthy = (v) => v !== undefined && v !== 'false' && v !== 'no' && v !== '0' && v !== 'off';
