/*
 * Figure Suite — rooted trees (BST, heaps, red-black, B-trees, recursion
 * trees, Huffman trees, disjoint-set forests, subtree triangles).
 *
 * Children are given by indentation. `_` is an empty slot (keeps a lone
 * child on the left/right), `nil` a NIL sentinel, `[a b c]` a B-tree node.
 */

const TREE_SHAPES = ['circle', 'box', 'tri', 'none', 'point', 'nil', 'keys', 'ellipse'];
const TREE_FLAGS = ['circle', 'box', 'tri', 'triangle', 'none', 'point', 'ellipse', 'thick', 'bold', 'dashed', 'noedge', 'loop', 'double', 'gray-edge'];
const TREE_KEYS = ['left', 'right', 'above', 'below', 'edge', 'ecolor', 'fill', 'h', 'w'];

function parseTreeNodes(block, errors) {
  const roots = [];
  const stack = []; // { indent, node }
  for (const entry of block.data) {
    const toks = tokenize(entry.text);
    const first = toks.shift();
    const args = splitArgs(toks);
    const node = { label: first.text, opts: args.opts, flags: new Set(args.pos), children: [], line: entry.line };
    if (!first.quoted) {
      if (first.text === '_' || first.text === '.') node.ghost = true;
      else if (first.text.toLowerCase() === 'nil') node.shape = 'nil';
      else if (/^\[.*\]$/s.test(first.text)) {
        node.shape = 'keys';
        const inner = first.text.slice(1, -1).trim();
        node.keys = inner.includes('|') ? inner.split('|').map((k) => k.trim()) : tokenize(inner).map((t) => t.text);
      }
    }
    for (const f of node.flags) {
      if (!TREE_FLAGS.includes(f) && !isColor(f)) errors.push({ line: entry.line, msg: `Unknown word "${f}" on tree node (put labels with spaces in quotes; flags: ${TREE_FLAGS.join(' ')})`, warn: true });
    }
    for (const k of Object.keys(args.opts)) {
      if (!TREE_KEYS.includes(k)) errors.push({ line: entry.line, msg: `Unknown option "${k}=" on tree node (options: ${TREE_KEYS.join(', ')})`, warn: true });
    }
    if (!node.shape) node.shape = TREE_SHAPES.find((s) => node.flags.has(s)) || block.opts.shape || 'circle';
    if (node.shape === 'triangle' || node.flags.has('triangle')) node.shape = 'tri';
    node.fill = args.opts.fill || [...node.flags].find((f) => isColor(f)) || null;
    while (stack.length && stack[stack.length - 1].indent >= entry.indent) stack.pop();
    if (stack.length) stack[stack.length - 1].node.children.push(node);
    else {
      if (roots.length && block.data[0].indent !== entry.indent && !errors.reported) {
        errors.push({ line: entry.line, msg: 'Indentation is shallower than the root — starting a new tree (forest)' });
      }
      roots.push(node);
    }
    stack.push({ indent: entry.indent, node });
  }
  return roots;
}

function layoutTree(block, ctx, errors) {
  const size = ctx.size;
  const o = block.opts;
  const roots = parseTreeNodes(block, errors);
  const rec = new Rec();
  if (!roots.length) { rec.ext(0, 0, 10, 10); return rec.done(); }
  const all = [];
  const walk = (n, depth) => { n.depth = depth; all.push(n); n.children.forEach((c) => walk(c, depth + 1)); };
  roots.forEach((r) => walk(r, 0));

  // node sizes
  // long labels in circle nodes become ellipses so one wide label doesn't inflate every circle
  for (const n of all) if (!n.ghost && n.shape === 'circle' && !o.r && labelSize(n.label, size).w > size * 2.2) n.shape = 'ellipse';
  const circleLabels = all.filter((n) => !n.ghost && (n.shape === 'circle')).map((n) => labelSize(n.label, size));
  const R = num(o.r, 0) || Math.max(size * 0.95, ...circleLabels.map((m) => Math.hypot(m.w / 2, m.h / 2) + size * 0.22));
  const keyW = Math.max(size * 1.4, ...all.filter((n) => n.shape === 'keys').flatMap((n) => n.keys.map((k) => labelSize(k, size).w + size * 0.5)));
  for (const n of all) {
    const m = labelSize(n.label, size);
    n.m = m;
    if (n.ghost) { n.hw = R; n.top = R; n.bot = R; continue; }
    switch (n.shape) {
      case 'box': n.hw = Math.max(R, m.w / 2 + size * 0.45); n.top = n.bot = Math.max(R * 0.85, m.h / 2 + size * 0.35); break;
      case 'ellipse': n.hw = Math.max(R, m.w / 2 + size * 0.6); n.top = n.bot = Math.max(R * 0.8, m.h / 2 + size * 0.35); break;
      case 'none': n.hw = m.w / 2 + 2; n.top = n.bot = m.h / 2 + 2; break;
      case 'point': n.hw = 3; n.top = n.bot = 3; break;
      case 'nil': n.hw = size * 0.95; n.top = 0; n.bot = size * 0.85; break;
      case 'keys': n.hw = (n.keys.length * keyW) / 2; n.top = 0; n.bot = size * 1.6; break;
      case 'tri': {
        const th = R * 2.6 * num(n.opts.h, 1);
        n.hw = Math.max(R * 0.95 * num(n.opts.w, 1), m.w / 2 + size * 0.5);
        n.top = 0; n.bot = th;
        break;
      }
      default: n.hw = R; n.top = n.bot = R;
    }
    // annotations widen the footprint
    if (n.opts.right) n.rx = labelSize(n.opts.right, size).w + size * 0.35;
    if (n.opts.left) n.lx = labelSize(n.opts.left, size).w + size * 0.35;
  }
  const sib = num(o.sibgap, 0) || R * 0.9;
  const vgap = num(o.levelgap, 0) || R * 1.5;

  // vertical positions per depth. rowY is the circle-centre line; triangles,
  // B-tree nodes and NIL boxes hang from just above it.
  const maxDepth = Math.max(...all.map((n) => n.depth));
  const hanging = (n) => n.shape === 'tri' || n.shape === 'keys' || n.shape === 'nil';
  const rowTop = [];
  const rowBot = [];
  for (let d = 0; d <= maxDepth; d++) {
    const row = all.filter((n) => n.depth === d);
    rowTop[d] = Math.max(0, ...row.filter((n) => !hanging(n)).map((n) => n.top));
    for (const n of row) n.oy = hanging(n) ? -Math.min(rowTop[d], R * 0.9) : 0;
    rowBot[d] = Math.max(0, ...row.map((n) => n.oy + (n.shape === 'tri' && !n.children.length ? Math.min(n.bot, R) : n.bot)));
  }
  const rowY = [0];
  for (let d = 1; d <= maxDepth; d++) rowY[d] = rowY[d - 1] + rowBot[d - 1] + vgap + rowTop[d];
  for (const n of all) n.y = rowY[n.depth] + n.oy;

  // horizontal: contour-based tidy layout
  const leftExt = (n) => n.hw + (n.lx || 0);
  const rightExt = (n) => n.hw + (n.rx || 0);
  // rows a node's outline reaches into (tall triangles cover rows below)
  const reach = (n) => {
    let k = 0;
    while (n.depth + k + 1 <= maxDepth && rowY[n.depth + k + 1] - rowTop[n.depth + k + 1] - vgap * 0.5 < n.y + n.bot) k++;
    return k;
  };
  function place(n) {
    if (!n.children.length) {
      const k = reach(n);
      n.cl = new Array(k + 1).fill(-leftExt(n));
      n.cr = new Array(k + 1).fill(rightExt(n));
      return;
    }
    n.children.forEach(place);
    let cl = null;
    let cr = null;
    const offsets = [];
    n.children.forEach((c, k) => {
      if (k === 0) { offsets.push(0); cl = c.cl.slice(); cr = c.cr.slice(); return; }
      let shift = -Infinity;
      for (let d = 0; d < Math.min(cr.length, c.cl.length); d++) shift = Math.max(shift, cr[d] - c.cl[d] + (d === 0 ? sib : sib * 1.1));
      offsets.push(shift);
      for (let d = 0; d < c.cl.length; d++) {
        if (d < cl.length) { cl[d] = Math.min(cl[d], c.cl[d] + shift); cr[d] = Math.max(cr[d], c.cr[d] + shift); } else { cl.push(c.cl[d] + shift); cr.push(c.cr[d] + shift); }
      }
    });
    // centre parent over first/last child (B-tree: over the key gaps works the same)
    const mid = (offsets[0] + offsets[offsets.length - 1]) / 2;
    n.children.forEach((c, k) => { c.dx = offsets[k] - mid; });
    n.cl = [-leftExt(n), ...cl.map((v) => v - mid)];
    n.cr = [rightExt(n), ...cr.map((v) => v - mid)];
    // a wide parent (B-tree) may need its children spread — handled by contour at depth 0 only
  }
  roots.forEach(place);
  let cursor = 0;
  roots.forEach((r, k) => {
    if (k > 0) {
      const prev = roots[k - 1];
      let shift = -Infinity;
      for (let d = 0; d < Math.min(prev.cr.length, r.cl.length); d++) shift = Math.max(shift, prev.cr[d] + prev.x - r.cl[d] + sib * 2);
      r.x = shift;
    } else r.x = 0;
    cursor = r.x;
    const assign = (n) => n.children.forEach((c) => { c.x = n.x + c.dx; assign(c); });
    assign(r);
  });
  void cursor;

  const arrows = o.arrows || 'none';
  const lw = ctx.lw;
  // edges first (under nodes)
  for (const n of all) {
    n.children.forEach((c, k) => {
      if (c.ghost || n.ghost) return;
      if (c.flags.has('noedge') || c.opts.edge === 'none') return;
      const from = edgePoint(n, c, k, keyW, true);
      const to = edgePoint(c, n, 0, keyW, false);
      const thick = c.flags.has('thick') || c.flags.has('bold');
      const opts = {
        width: thick ? lw * 2.6 : lw,
        color: strokeOf(c.opts.ecolor || (c.flags.has('gray-edge') ? 'gray' : null)),
        dash: c.flags.has('dashed') ? '4 3' : null,
        end: arrows === 'down',
        start: arrows === 'up',
      };
      const res = connectorRec(rec, from, to, opts);
      const elabel = c.opts.edge;
      if (elabel && elabel !== 'none') {
        const m = labelSize(elabel, size * 0.9);
        const side = c.x < n.x - 0.5 ? -1 : c.x > n.x + 0.5 ? 1 : 1;
        // outward normal: left children → label on the left, right → right
        let [nx, ny] = res.normal;
        if (nx * side < 0) { nx = -nx; ny = -ny; }
        const off = Math.abs(nx) * (m.w / 2) + Math.abs(ny) * (m.h / 2) + 3;
        rec.label(elabel, res.mid[0] + nx * off, res.mid[1] + ny * off, size * 0.9);
      }
    });
  }
  // nodes
  for (const n of all) {
    if (n.ghost) continue;
    drawTreeNode(rec, n, ctx, keyW, R, o);
    if (n.flags.has('loop')) {
      const top = n.y - n.top;
      rec.raw((svg, dx, dy) => {
        const x = n.x + dx;
        const y = top + dy;
        const r = R * 0.55;
        svg.push(`<path d="M${n2(x - r * 0.9)} ${n2(y + 2)}C${n2(x - r * 1.6)} ${n2(y - r * 2.4)} ${n2(x + r * 1.6)} ${n2(y - r * 2.4)} ${n2(x + r * 0.9 + 3)} ${n2(y - 4)}" fill="none" stroke="#000" stroke-width="${n2(lw)}"/>`);
        svg.push(arrowHead(x + r * 0.9, y + 1, Math.atan2(r * 2.4, -r * 0.5), 1));
      }, n.x - R, top - R * 1.9, n.x + R, top);
    }
    // annotations
    const ann = n.opts;
    if (ann.right) rec.labelAt(ann.right, n.x + n.hw + size * 0.3, n.y + (n.shape === 'tri' ? n.bot * 0.6 : 0), size, 'l');
    if (ann.left) rec.labelAt(ann.left, n.x - n.hw - size * 0.3, n.y + (n.shape === 'tri' ? n.bot * 0.6 : 0), size, 'r');
    if (ann.above) { const m = labelSize(ann.above, size); rec.label(ann.above, n.x, n.y - n.top - size * 0.25 - m.h / 2, size); }
    if (ann.below) { const m = labelSize(ann.below, size); rec.label(ann.below, n.x, n.y + n.bot + size * 0.25 + m.h / 2, size); }
  }
  // level annotations (recursion trees)
  const levels = block.directives.filter((d) => d.name === 'level');
  if (levels.length) {
    let right = -Infinity;
    for (const n of all) if (!n.ghost) right = Math.max(right, n.x + n.hw + (n.rx || 0));
    const x = right + size * 2;
    for (const d of levels) {
      const m = d.rest.match(/^(\d+)\s+(.*)$/);
      if (!m) { errors.push({ line: d.line, msg: 'level: expected "<depth> <text>"' }); continue; }
      const depth = parseInt(m[1], 10);
      const y = depth <= maxDepth ? rowY[depth] : rowY[maxDepth] + (depth - maxDepth) * (vgap + 2 * R);
      rec.labelAt(m[2], x, y, size, 'l');
    }
  }
  return rec.done();
}

/** Point on node n's outline toward node other. For keys nodes the parent end leaves from key gap k. */
function edgePoint(n, other, k, keyW, parentEnd) {
  const dx = other.x - n.x;
  const dy = other.y - n.y;
  switch (n.shape) {
    case 'tri': case 'nil': case 'keys':
      if (!parentEnd) return [n.x, n.y];
      if (n.shape === 'keys') {
        const count = n.keys.length;
        const kids = n.children.length;
        const left = n.x - (count * keyW) / 2;
        const gx = kids === count + 1 ? left + k * keyW : n.x + (k - (kids - 1) / 2) * keyW;
        return [gx, n.y + n.bot];
      }
      return [n.x, n.y + n.bot];
    case 'box': case 'none': case 'ellipse': {
      if (n.shape === 'ellipse') {
        const a = Math.atan2(dy, dx);
        return [n.x + n.hw * Math.cos(a), n.y + n.top * Math.sin(a)];
      }
      const sx = Math.abs(dx) > 1e-6 ? n.hw / Math.abs(dx) : Infinity;
      const sy = Math.abs(dy) > 1e-6 ? n.top / Math.abs(dy) : Infinity;
      const s = Math.min(sx, sy);
      return [n.x + dx * s, n.y + dy * s];
    }
    case 'point': return [n.x, n.y];
    default: {
      const len = Math.hypot(dx, dy) || 1;
      return [n.x + (dx / len) * n.hw, n.y + (dy / len) * n.hw];
    }
  }
}

function connectorRec(rec, from, to, opts) {
  rec.connector(from[0], from[1], to[0], to[1], opts);
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy) || 1;
  return { mid: [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2], normal: [-dy / len, dx / len] };
}

function drawTreeNode(rec, n, ctx, keyW, R, o) {
  const size = ctx.size;
  const col = fillFor(n.fill || o.fill, ctx, 'tree');
  const lw = ctx.lw;
  const stroke = n.flags.has('thick') ? lw : lw;
  const x = n.x;
  const y = n.y;
  switch (n.shape) {
    case 'circle':
      rec.raw((svg, dx, dy) => svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="${n2(n.hw)}" fill="${col.fill}" stroke="#000" stroke-width="${n2(stroke)}"/>`), x - n.hw, y - n.hw, x + n.hw, y + n.hw);
      if (n.flags.has('double')) rec.raw((svg, dx, dy) => svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="${n2(n.hw - 3)}" fill="none" stroke="#000" stroke-width="${n2(lw)}"/>`), x, y, x, y);
      rec.label(n.label, x, y, size, col.text);
      break;
    case 'ellipse':
      rec.raw((svg, dx, dy) => svg.push(`<ellipse cx="${n2(x + dx)}" cy="${n2(y + dy)}" rx="${n2(n.hw)}" ry="${n2(n.top)}" fill="${col.fill}" stroke="#000" stroke-width="${n2(lw)}"/>`), x - n.hw, y - n.top, x + n.hw, y + n.top);
      rec.label(n.label, x, y, size, col.text);
      break;
    case 'box':
      rec.rect(x - n.hw, y - n.top, n.hw * 2, n.top * 2, col.fill, { width: lw });
      rec.label(n.label, x, y, size, col.text);
      break;
    case 'none':
      rec.label(n.label, x, y, size, n.fill ? col.fill : '#000');
      break;
    case 'point':
      rec.raw((svg, dx, dy) => svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="3" fill="#000"/>`), x - 3, y - 3, x + 3, y + 3);
      if (n.label && !n.opts.right && !n.opts.above) rec.labelAt(n.label, x + 6, y - size * 0.5, size, 'l');
      break;
    case 'nil': {
      const c = fillFor(n.fill || 'black', ctx, 'tree');
      rec.rect(x - n.hw, y, n.hw * 2, n.bot, c.fill, { width: lw });
      rec.label('\\textsc{nil}', x, y + n.bot / 2, size * 0.7, c.text);
      break;
    }
    case 'keys': {
      const left = x - (n.keys.length * keyW) / 2;
      n.keys.forEach((k, i) => {
        rec.rect(left + i * keyW, y, keyW, n.bot, col.fill, { width: lw });
        rec.label(k, left + (i + 0.5) * keyW, y + n.bot / 2, size, col.text);
      });
      if (!n.keys.length) rec.rect(left - keyW / 2, y, keyW, n.bot, col.fill, { width: lw });
      break;
    }
    case 'tri': {
      const h = n.bot;
      const pts = `${n2(x)},${n2(y)} ${n2(x - n.hw)},${n2(y + h)} ${n2(x + n.hw)},${n2(y + h)}`;
      const c = fillFor(n.fill || o.trifill || 'light', ctx, 'tree');
      rec.raw((svg, dx, dy) => {
        const p = pts.split(' ').map((pt) => pt.split(',').map(Number)).map(([px, py]) => `${n2(px + dx)},${n2(py + dy)}`).join(' ');
        svg.push(`<polygon points="${p}" fill="${c.fill}" stroke="#000" stroke-width="${n2(lw)}" stroke-linejoin="round"/>`);
      }, x - n.hw, y, x + n.hw, y + h);
      rec.label(n.label, x, y + h - size * 0.95, size, c.text);
      break;
    }
    default: break;
  }
}
