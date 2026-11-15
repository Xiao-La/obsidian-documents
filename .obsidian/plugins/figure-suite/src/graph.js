/*
 * Figure Suite — graphs: directed / undirected, weighted, flow networks,
 * automata, bipartite graphs, DAGs, point sets.
 *
 * Coordinates are in units (1 unit = `unit` px, default 4 × font size) with
 * y pointing UP like TikZ. Nodes without coordinates are placed by the
 * selected layout; dragging a node in the preview writes `at=(x,y)` back.
 */

const EDGE_OPS = ['<->', '->', '<-', '--'];
const NODE_SHAPES = ['circle', 'box', 'point', 'none', 'ellipse', 'double'];

function parseGraph(block, errors) {
  const nodes = new Map();
  const order = [];
  const edges = [];
  const getNode = (id, line) => {
    if (!nodes.has(id)) {
      const autoLabel = id.replace(/^([A-Za-z]+)(\d+)$/, '$1_{$2}');
      nodes.set(id, { id, label: autoLabel, opts: {}, flags: new Set(), line: null, refLine: line, pos: null });
      order.push(id);
    }
    return nodes.get(id);
  };
  for (const entry of block.data) {
    const raw = tokenize(entry.text);
    const toks = [];
    for (const t of raw) {
      if (t.quoted) { toks.push(t); continue; }
      t.text.split(/(<->|->|<-|--)/).filter((p) => p !== '').forEach((p) => toks.push({ text: p, quoted: false }));
    }
    const isEdge = toks.length >= 3 && !toks[1].quoted && EDGE_OPS.includes(toks[1].text);
    if (isEdge) {
      const chain = [toks[0].text];
      const ops = [];
      let i = 1;
      while (i + 1 < toks.length && !toks[i].quoted && EDGE_OPS.includes(toks[i].text)) {
        ops.push(toks[i].text);
        chain.push(toks[i + 1].text);
        i += 2;
      }
      const args = splitArgs(toks.slice(i));
      const flags = new Set();
      const words = [];
      args.pos.forEach((p, k) => {
        if (args.quoted.has(k)) words.push(p);
        else if (['thick', 'bold', 'dashed', 'dotted', 'swap', 'inline', 'bend', 'straight', 'noarrow', 'arrow'].includes(p) || isColor(p)) flags.add(p);
        else words.push(p);
      });
      for (const k of Object.keys(args.opts)) {
        if (!['bend', 'label', 'color', 'width', 'loop'].includes(k)) errors.push({ line: entry.line, msg: `Unknown edge option "${k}=" (options: bend, label, color, width, loop)`, warn: true });
      }
      const label = args.opts.label ?? words.join(' ');
      for (let k = 0; k < ops.length; k++) {
        let a = chain[k];
        let b = chain[k + 1];
        const op = ops[k];
        if (op === '<-') [a, b] = [b, a];
        getNode(a, entry.line);
        getNode(b, entry.line);
        edges.push({ from: a, to: b, op, label: k === ops.length - 1 || ops.length === 1 ? label : '', opts: args.opts, flags, line: entry.line });
      }
      continue;
    }
    const args = splitArgs(toks.slice(1));
    const node = getNode(toks[0].text, entry.line);
    if (node.line) errors.push({ line: entry.line, msg: `Node "${node.id}" declared twice (line ${node.line})` });
    node.line = entry.line;
    for (const k of Object.keys(args.opts)) {
      if (!['at', 'label', 'left', 'right', 'above', 'below', 'fill', 'r'].includes(k)) errors.push({ line: entry.line, msg: `Unknown node option "${k}=" (options: at, label, left, right, above, below, fill, r)`, warn: true });
    }
    Object.assign(node.opts, args.opts);
    args.pos.forEach((p, k) => {
      const pt = parsePoint(p);
      if (pt && !args.quoted.has(k)) node.pos = pt;
      else if (!args.quoted.has(k) && (NODE_SHAPES.includes(p) || isColor(p) || ['start', 'thick'].includes(p))) node.flags.add(p);
      else node.label = p;
    });
    if (args.opts.at) {
      const pt = parsePoint(args.opts.at);
      if (pt) node.pos = pt; else errors.push({ line: entry.line, msg: `Bad position "${args.opts.at}" (use at=(x,y))` });
    }
    if (args.opts.label != null) node.label = args.opts.label;
  }
  return { nodes, order, edges };
}

/* ---------------- automatic layouts (unit coords, y up) ---------------- */

function circleLayout(ids) {
  const n = ids.length;
  const r = n <= 1 ? 0 : Math.max(1.1, 1.3 / (2 * Math.sin(Math.PI / n)));
  const out = new Map();
  ids.forEach((id, k) => {
    const a = Math.PI / 2 - (2 * Math.PI * k) / n;
    out.set(id, [r * Math.cos(a), r * Math.sin(a)]);
  });
  return out;
}

function gridLayout(ids, cols) {
  const c = cols || Math.ceil(Math.sqrt(ids.length));
  const out = new Map();
  ids.forEach((id, k) => out.set(id, [(k % c) * 1.3, -Math.floor(k / c) * 1.3]));
  return out;
}

function lineLayout(ids) {
  const out = new Map();
  ids.forEach((id, k) => out.set(id, [k * 1.2, 0]));
  return out;
}

/**
 * Stress majorization (SMACOF) on graph-theoretic distances: deterministic
 * and much tidier than spring embedders for the small graphs in textbooks.
 */
function forceLayout(ids, edges) {
  const n = ids.length;
  if (n <= 1) return new Map(ids.map((id) => [id, [0, 0]]));
  const index = new Map(ids.map((id, k) => [id, k]));
  const adj = ids.map(() => []);
  for (const e of edges) {
    if (e.from === e.to) continue;
    const a = index.get(e.from);
    const b = index.get(e.to);
    adj[a].push(b); adj[b].push(a);
  }
  // all-pairs BFS distances
  const D = ids.map((_, s) => {
    const d = new Array(n).fill(Infinity);
    d[s] = 0;
    const q = [s];
    while (q.length) { const u = q.shift(); for (const v of adj[u]) if (d[v] === Infinity) { d[v] = d[u] + 1; q.push(v); } }
    return d;
  });
  let maxD = 1;
  D.forEach((row) => row.forEach((v) => { if (v !== Infinity) maxD = Math.max(maxD, v); }));
  D.forEach((row) => row.forEach((v, j) => { if (v === Infinity) row[j] = maxD + 1; }));
  // initial positions: circle in declaration order (stable, readable)
  const init = circleLayout(ids);
  let X = ids.map((id) => init.get(id).slice());
  for (let it = 0; it < 300; it++) {
    const next = X.map(() => [0, 0]);
    for (let i = 0; i < n; i++) {
      let wsum = 0;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dij = D[i][j];
        const w = 1 / (dij * dij);
        const dx = X[i][0] - X[j][0];
        const dy = X[i][1] - X[j][1];
        const dist = Math.hypot(dx, dy) || 1e-6;
        next[i][0] += w * (X[j][0] + (dij * dx) / dist);
        next[i][1] += w * (X[j][1] + (dij * dy) / dist);
        wsum += w;
      }
      next[i][0] /= wsum; next[i][1] /= wsum;
    }
    X = next;
  }
  // orient: principal axis horizontal (textbook graphs are wider than tall)
  let cx = 0; let cy = 0;
  X.forEach(([x, y]) => { cx += x; cy += y; });
  cx /= n; cy /= n;
  let sxx = 0; let sxy = 0; let syy = 0;
  X.forEach(([x, y]) => { sxx += (x - cx) ** 2; sxy += (x - cx) * (y - cy); syy += (y - cy) ** 2; });
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const c = Math.cos(-theta); const s = Math.sin(-theta);
  const out = new Map();
  const unitLen = 1.35;
  ids.forEach((id, i) => {
    const x = X[i][0] - cx; const y = X[i][1] - cy;
    out.set(id, [(x * c - y * s) * unitLen, (x * s + y * c) * unitLen]);
  });
  return out;
}

function layeredLayout(ids, edges, rankGroups, dir) {
  const index = new Map(ids.map((id, k) => [id, k]));
  const n = ids.length;
  const succ = ids.map(() => []);
  const E = [];
  for (const e of edges) {
    if (e.from === e.to) continue;
    const a = index.get(e.from);
    const b = index.get(e.to);
    E.push([a, b]);
  }
  // break cycles: DFS in declaration order, reverse back edges
  const state = new Array(n).fill(0);
  const dag = [];
  const adj = ids.map(() => []);
  E.forEach(([a, b], k) => adj[a].push([b, k]));
  const reversed = new Set();
  const dfs = (u) => {
    state[u] = 1;
    for (const [v, k] of adj[u]) {
      if (state[v] === 1) reversed.add(k);
      else if (state[v] === 0) dfs(v);
    }
    state[u] = 2;
  };
  for (let u = 0; u < n; u++) if (!state[u]) dfs(u);
  E.forEach(([a, b], k) => dag.push(reversed.has(k) ? [b, a] : [a, b]));
  dag.forEach(([a, b]) => succ[a].push(b));
  // longest-path ranks
  const rank = new Array(n).fill(0);
  const indeg = new Array(n).fill(0);
  dag.forEach(([, b]) => indeg[b]++);
  const queue = [];
  for (let u = 0; u < n; u++) if (!indeg[u]) queue.push(u);
  while (queue.length) {
    const u = queue.shift();
    for (const v of succ[u]) {
      rank[v] = Math.max(rank[v], rank[u] + 1);
      if (--indeg[v] === 0) queue.push(v);
    }
  }
  for (const group of rankGroups) {
    const ks = group.map((id) => index.get(id)).filter((k) => k !== undefined);
    const r = Math.max(...ks.map((k) => rank[k]));
    ks.forEach((k) => { rank[k] = r; });
  }
  const layers = [];
  for (let u = 0; u < n; u++) (layers[rank[u]] = layers[rank[u]] || []).push(u);
  for (let r = 0; r < layers.length; r++) if (!layers[r]) layers[r] = [];
  const nb = ids.map(() => []);
  dag.forEach(([a, b]) => { nb[a].push(b); nb[b].push(a); });
  const posIn = new Array(n).fill(0);
  const refresh = () => layers.forEach((L) => L.forEach((u, k) => { posIn[u] = k; }));
  refresh();
  for (let sweep = 0; sweep < 12; sweep++) {
    const down = sweep % 2 === 0;
    const seq = down ? layers.map((_, r) => r) : layers.map((_, r) => layers.length - 1 - r);
    for (const r of seq) {
      const ref = down ? r - 1 : r + 1;
      if (ref < 0 || ref >= layers.length) continue;
      const bc = new Map();
      layers[r].forEach((u) => {
        const ns = nb[u].filter((v) => rank[v] === ref);
        bc.set(u, ns.length ? ns.reduce((s, v) => s + posIn[v], 0) / ns.length : posIn[u]);
      });
      layers[r].sort((a, b) => bc.get(a) - bc.get(b) || posIn[a] - posIn[b]);
      refresh();
    }
  }
  // x coordinates: start packed, then pull toward neighbour barycentres
  const X = new Array(n).fill(0);
  layers.forEach((L) => L.forEach((u, k) => { X[u] = k - (L.length - 1) / 2; }));
  for (let it = 0; it < 20; it++) {
    for (const L of layers) {
      const want = L.map((u) => {
        const ns = nb[u];
        return ns.length ? ns.reduce((s, v) => s + X[v], 0) / ns.length : X[u];
      });
      // keep order with min gap 1: forward then backward pass around desired
      const x = want.slice();
      for (let k = 1; k < L.length; k++) x[k] = Math.max(x[k], x[k - 1] + 1);
      for (let k = L.length - 2; k >= 0; k--) x[k] = Math.min(x[k], x[k + 1] - 1);
      for (let k = 1; k < L.length; k++) x[k] = Math.max(x[k], x[k - 1] + 1);
      L.forEach((u, k) => { X[u] = X[u] * 0.5 + x[k] * 0.5; });
      // final separation guarantee
      for (let k = 1; k < L.length; k++) if (X[L[k]] < X[L[k - 1]] + 1) X[L[k]] = X[L[k - 1]] + 1;
    }
  }
  const out = new Map();
  const gapX = 1.25;
  const gapY = 1.3;
  ids.forEach((id, u) => {
    out.set(id, dir === 'right' ? [rank[u] * gapY * 1.15, -X[u] * gapX] : [X[u] * gapX, -rank[u] * gapY]);
  });
  return out;
}

/* ---------------- geometry helpers ---------------- */

function boundary(node, tx, ty) {
  const dx = tx - node.px;
  const dy = ty - node.py;
  const len = Math.hypot(dx, dy) || 1;
  switch (node.shape) {
    case 'point': return [node.px + (dx / len) * 3, node.py + (dy / len) * 3];
    case 'box': case 'none': {
      const sx = Math.abs(dx) > 1e-6 ? node.hw / Math.abs(dx) : Infinity;
      const sy = Math.abs(dy) > 1e-6 ? node.hh / Math.abs(dy) : Infinity;
      const s = Math.min(sx, sy);
      return [node.px + dx * s, node.py + dy * s];
    }
    case 'ellipse': {
      const a = Math.atan2(dy, dx);
      return [node.px + node.hw * Math.cos(a), node.py + node.hh * Math.sin(a)];
    }
    default: return [node.px + (dx / len) * node.hw, node.py + (dy / len) * node.hw];
  }
}

function convexHull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (p.length < 3) return p;
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  for (const q of p) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop(); lower.push(q); }
  const upper = [];
  for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop(); upper.push(q); }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/* ---------------- layout + draw ---------------- */

function layoutGraph(block, ctx, errors) {
  const size = ctx.size;
  const o = block.opts;
  const g = parseGraph(block, errors);
  const directed = truthy(o.directed) || (!truthy(o.undirected) && g.edges.some((e) => e.op !== '--'));
  const unit = num(o.unit, 0) || size * 4;
  const rec = new Rec();
  const ids = g.order;
  if (!ids.length) { rec.ext(0, 0, 10, 10); return rec.done(); }
  const rankGroups = block.directives.filter((d) => d.name === 'rank').map((d) => tokenize(d.rest).map((t) => t.text));
  let layout = (o.layout || 'auto').toLowerCase();
  const allPlaced = ids.every((id) => g.nodes.get(id).pos);
  if (layout === 'auto') layout = allPlaced ? 'manual' : directed ? 'layered' : 'force';
  let auto;
  if (layout === 'manual' && !allPlaced) auto = forceLayout(ids, g.edges);
  else if (layout === 'circle') auto = circleLayout(ids);
  else if (layout === 'grid') auto = gridLayout(ids, num(o.cols, 0));
  else if (layout === 'line' || layout === 'row') auto = lineLayout(ids);
  else if (layout === 'layered' || layout === 'tree' || layout === 'dag') auto = layeredLayout(ids, g.edges, rankGroups, o.dir === 'right' ? 'right' : 'down');
  else if (layout === 'force' || layout === 'spring') auto = forceLayout(ids, g.edges);
  else if (layout !== 'manual') { errors.push({ line: block.line, msg: `Unknown layout "${layout}" (auto, manual, layered, force, circle, line, grid)` }); auto = forceLayout(ids, g.edges); }
  const scale = num(o.spread, 1);

  // node geometry
  const labels = ids.map((id) => labelSize(g.nodes.get(id).label, size));
  // one radius for all circles, sized by the short labels; long labels get ellipses
  const fitR = (k, dbl) => Math.hypot(labels[k].w / 2, labels[k].h / 2) + size * 0.22 + (dbl ? 3 : 0);
  const R = num(o.r, 0) || Math.max(size * 0.95, ...ids.map((id, k) => {
    const nd = g.nodes.get(id);
    const shape = NODE_SHAPES.find((s) => nd.flags.has(s)) || o.shape || 'circle';
    if (labels[k].w > size * 2.2) return 0;
    return shape === 'circle' || shape === 'double' ? fitR(k, shape === 'double' || nd.flags.has('double')) : 0;
  }));
  const N = new Map();
  ids.forEach((id, k) => {
    const nd = g.nodes.get(id);
    let shape = NODE_SHAPES.find((s) => nd.flags.has(s)) || o.shape || 'circle';
    const double = shape === 'double' || nd.flags.has('double');
    if (shape === 'double') shape = 'circle';
    if (shape === 'circle' && !num(o.r, 0) && !nd.opts.r && fitR(k, double) > R * 1.12) shape = 'ellipse';
    const u = nd.pos || (auto ? auto.get(id).map((v) => v * scale) : [0, 0]);
    const m = labels[k];
    let hw = R;
    let hh = R;
    if (shape === 'box') { hw = Math.max(R, m.w / 2 + size * 0.45); hh = Math.max(R * 0.85, m.h / 2 + size * 0.35); }
    if (shape === 'ellipse') { hw = Math.max(R, m.w / 2 + size * 0.6); hh = Math.max(R * 0.8, m.h / 2 + size * 0.35); }
    if (shape === 'none') { hw = m.w / 2 + 3; hh = m.h / 2 + 3; }
    if (shape === 'point') { hw = 3; hh = 3; }
    if (nd.opts.r) { hw = hh = num(nd.opts.r, R); }
    N.set(id, { ...nd, shape, double, ux: u[0], uy: u[1], px: u[0] * unit, py: -u[1] * unit, hw, hh, m });
  });

  // auto-placed nodes: make room for wide nodes
  const free = ids.filter((id) => !g.nodes.get(id).pos);
  if (free.length && (layout === 'line' || layout === 'row')) {
    let x = 0;
    free.forEach((id, k) => {
      const nd = N.get(id);
      if (k) x += N.get(free[k - 1]).hw + Math.max(size * 1.6, unit * 0.45) + nd.hw;
      nd.px = x; nd.py = 0; nd.ux = x / unit; nd.uy = 0;
    });
  } else if (free.length > 1) {
    let need = 1;
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = N.get(free[i]);
        const b = N.get(free[j]);
        const dx = Math.abs(a.px - b.px);
        const dy = Math.abs(a.py - b.py);
        // required gap along the dominant axis
        const reqX = a.hw + b.hw + size * 1.2;
        const reqY = a.hh + b.hh + size * 1.2;
        const fx = dx > 1e-6 ? reqX / dx : Infinity;
        const fy = dy > 1e-6 ? reqY / dy : Infinity;
        need = Math.max(need, Math.min(fx, fy));
      }
    }
    need = Math.min(need, 4);
    if (need > 1.001) for (const id of free) {
      const nd = N.get(id);
      nd.px *= need; nd.py *= need; nd.ux = nd.px / unit; nd.uy = -nd.py / unit;
    }
  }

  const lw = ctx.lw;
  // groups (drawn first)
  for (const d of block.directives.filter((q) => q.name === 'group' || q.name === 'shade')) {
    const toks = tokenize(d.rest).map((t) => t.text);
    const color = isColor(toks[toks.length - 1]) ? toks.pop() : 'light';
    const members = toks.map((id) => N.get(id)).filter(Boolean);
    if (members.length !== toks.length) errors.push({ line: d.line, msg: `group: unknown node in "${d.rest}"` });
    if (!members.length) continue;
    const pad = size * 0.55;
    const pts = [];
    for (const nd of members) for (let k = 0; k < 16; k++) {
      const a = (k / 16) * 2 * Math.PI;
      pts.push([nd.px + Math.cos(a) * (nd.hw + pad), nd.py + Math.sin(a) * (nd.hh + pad)]);
    }
    const hull = convexHull(pts);
    const fill = colorOf(color).fill;
    let x1 = Infinity; let y1 = Infinity; let x2 = -Infinity; let y2 = -Infinity;
    hull.forEach(([x, y]) => { x1 = Math.min(x1, x); y1 = Math.min(y1, y); x2 = Math.max(x2, x); y2 = Math.max(y2, y); });
    rec.raw((svg, dx, dy) => svg.push(`<polygon points="${hull.map(([x, y]) => `${n2(x + dx)},${n2(y + dy)}`).join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="6" stroke-linejoin="round"/>`), x1 - 3, y1 - 3, x2 + 3, y2 + 3);
  }

  // parallel edge bookkeeping
  const pairKey = (a, b) => (a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`);
  const pairs = new Map();
  g.edges.forEach((e) => { if (e.from !== e.to) { const k = pairKey(e.from, e.to); pairs.set(k, (pairs.get(k) || 0) + 1); } });
  const seen = new Map();
  const isLine = layout === 'line' || layout === 'row';
  const index = new Map(ids.map((id, k) => [id, k]));
  let cx = 0; let cy = 0;
  N.forEach((nd) => { cx += nd.px; cy += nd.py; });
  cx /= N.size; cy /= N.size;

  for (const e of g.edges) {
    const a = N.get(e.from);
    const b = N.get(e.to);
    const thick = e.flags.has('thick') || e.flags.has('bold');
    const colorWord = [...e.flags].find((f) => isColor(f));
    const opts = {
      width: num(e.opts.width, 0) * lw || (thick ? lw * 2.6 : lw),
      color: strokeOf(e.opts.color || colorWord),
      dash: e.flags.has('dashed') ? '5 3' : e.flags.has('dotted') ? '1.5 2.5' : null,
      end: e.flags.has('noarrow') ? false : e.op === '->' || e.op === '<-' || e.op === '<->' || (e.flags.has('arrow')),
      start: e.op === '<->',
    };
    const lsize = size * 0.9;
    if (e.from === e.to) {
      // self loop
      const dirName = e.opts.loop || 'above';
      const base = { above: -90, top: -90, below: 90, bottom: 90, left: 180, right: 0 }[dirName] ?? -num(dirName, 90);
      const ang = (base * Math.PI) / 180;
      const spread = 0.45;
      const p1 = boundary(a, a.px + Math.cos(ang - spread) * 100, a.py + Math.sin(ang - spread) * 100);
      const p2 = boundary(a, a.px + Math.cos(ang + spread) * 100, a.py + Math.sin(ang + spread) * 100);
      const far = a.hw + R * 1.8;
      const c1 = [a.px + Math.cos(ang - 0.7) * far, a.py + Math.sin(ang - 0.7) * far];
      const c2 = [a.px + Math.cos(ang + 0.7) * far, a.py + Math.sin(ang + 0.7) * far];
      const headA = Math.atan2(p2[1] - c2[1], p2[0] - c2[0]);
      const cut = headLen();
      const end = opts.end ? [p2[0] - Math.cos(headA) * cut, p2[1] - Math.sin(headA) * cut] : p2;
      rec.raw((svg, dx, dy) => {
        svg.push(`<path d="M${n2(p1[0] + dx)} ${n2(p1[1] + dy)}C${n2(c1[0] + dx)} ${n2(c1[1] + dy)} ${n2(c2[0] + dx)} ${n2(c2[1] + dy)} ${n2(end[0] + dx)} ${n2(end[1] + dy)}" fill="none" stroke="${opts.color}" stroke-width="${n2(opts.width)}"${opts.dash ? ` stroke-dasharray="${opts.dash}"` : ''}/>`);
        if (opts.end) svg.push(arrowHead(p2[0] + dx, p2[1] + dy, headA, 1, opts.color));
      }, Math.min(c1[0], c2[0], p1[0]), Math.min(c1[1], c2[1], p1[1]), Math.max(c1[0], c2[0], p2[0]), Math.max(c1[1], c2[1], p2[1]));
      if (e.label) {
        const m = labelSize(e.label, lsize);
        const apex = a.hw + R * 1.35;
        const off = Math.abs(Math.cos(ang)) * (m.w / 2) + Math.abs(Math.sin(ang)) * (m.h / 2) + 3;
        rec.label(e.label, a.px + Math.cos(ang) * (apex + off), a.py + Math.sin(ang) * (apex + off), lsize);
      }
      continue;
    }
    // bend
    const key = pairKey(e.from, e.to);
    const count = pairs.get(key);
    const nth = seen.get(key) || 0;
    seen.set(key, nth + 1);
    const len = Math.hypot(b.px - a.px, b.py - a.py) || 1;
    let angle = 0;
    if (e.opts.bend != null) angle = num(e.opts.bend, 0);
    else if (e.flags.has('bend')) angle = 25;
    else if (count > 1 && !e.flags.has('straight')) {
      // spread parallel edges symmetrically; opposite directions bend apart
      const slot = nth - (count - 1) / 2;
      angle = slot * 30;
      if (e.from > e.to) angle = -angle;
      if (count === 2) angle = 15;
    } else if (isLine && Math.abs(index.get(e.from) - index.get(e.to)) > 1 && !e.flags.has('straight')) {
      angle = (index.get(e.from) < index.get(e.to) ? 1 : -1) * Math.min(55, 20 + 8 * Math.abs(index.get(e.from) - index.get(e.to)));
    }
    if (!angle && e.opts.bend == null && !e.flags.has('straight')) {
      // a straight edge through another node gets bent around it
      const hitsNode = (sign) => {
        let worst = 0;
        N.forEach((other) => {
          if (other.id === e.from || other.id === e.to) return;
          const t = ((other.px - a.px) * (b.px - a.px) + (other.py - a.py) * (b.py - a.py)) / (len * len);
          if (t <= 0.05 || t >= 0.95) return;
          const qx = a.px + t * (b.px - a.px);
          const qy = a.py + t * (b.py - a.py);
          const dist = Math.hypot(other.px - qx, other.py - qy);
          const clear = Math.max(other.hw, other.hh) + size * 0.4;
          if (dist < clear) {
            const side = (b.px - a.px) * (other.py - a.py) - (b.py - a.py) * (other.px - a.px);
            worst = Math.max(worst, 1);
            if (sign && Math.sign(side) === sign) worst = 2;
          }
        });
        return worst;
      };
      if (hitsNode(0)) {
        // bend away from the obstacle: TikZ-left is the side with negative cross product
        let blockedLeft = 0;
        N.forEach((other) => {
          if (other.id === e.from || other.id === e.to) return;
          const side = (b.px - a.px) * (other.py - a.py) - (b.py - a.py) * (other.px - a.px);
          const t = ((other.px - a.px) * (b.px - a.px) + (other.py - a.py) * (b.py - a.py)) / (len * len);
          if (t > 0.05 && t < 0.95 && Math.abs(side) / len < Math.max(other.hw, other.hh) + size * 0.4) blockedLeft += side < 0 ? 1 : -1;
        });
        angle = blockedLeft > 0 ? -28 : 28;
      }
    }
    // control point in px; positive angle = bend left of travel (TikZ "bend left")
    const ux = (b.px - a.px) / len;
    const uy = (b.py - a.py) / len;
    const nx = uy; // left of travel in screen coords (y down)
    const ny = -ux;
    const h = Math.tan((angle * Math.PI) / 180) * (len / 2);
    const C = [(a.px + b.px) / 2 + nx * h, (a.py + b.py) / 2 + ny * h];
    const s = angle ? boundary(a, C[0], C[1]) : boundary(a, b.px, b.py);
    const t = angle ? boundary(b, C[0], C[1]) : boundary(b, a.px, a.py);
    let bendParam = 0;
    if (angle) {
      const mx = (s[0] + t[0]) / 2;
      const my = (s[1] + t[1]) / 2;
      const l2 = Math.hypot(t[0] - s[0], t[1] - s[1]) || 1;
      const cnx = -(t[1] - s[1]) / l2;
      const cny = (t[0] - s[0]) / l2;
      bendParam = ((C[0] - mx) * cnx + (C[1] - my) * cny) / 2;
    }
    const res = connectorRec(rec, s, t, { ...opts, bend: bendParam });
    if (bendParam) {
      const mx = (s[0] + t[0]) / 2;
      const my = (s[1] + t[1]) / 2;
      res.mid = [(s[0] + 2 * C[0] + t[0]) / 4, (s[1] + 2 * C[1] + t[1]) / 4];
      void mx; void my;
    }
    if (e.label) {
      const m = labelSize(e.label, lsize);
      if (e.flags.has('inline')) {
        rec.rect(res.mid[0] - m.w / 2 - 2, res.mid[1] - m.h / 2 - 2, m.w + 4, m.h + 4, '#ffffff', { stroke: null });
        rec.label(e.label, res.mid[0], res.mid[1], lsize);
      } else {
        let [qx, qy] = [nx, ny];
        if (angle) {
          if (angle < 0) { qx = -qx; qy = -qy; }
        } else {
          // default side: away from the graph's centre
          const vx = res.mid[0] - cx;
          const vy = res.mid[1] - cy;
          if (qx * vx + qy * vy < -1e-6 || (Math.abs(qx * vx + qy * vy) <= 1e-6 && qy > 0)) { qx = -qx; qy = -qy; }
        }
        if (e.flags.has('swap')) { qx = -qx; qy = -qy; }
        const off = Math.abs(qx) * (m.w / 2) + Math.abs(qy) * (m.h / 2) + 3;
        rec.label(e.label, res.mid[0] + qx * off, res.mid[1] + qy * off, lsize);
      }
    }
  }

  // nodes
  for (const id of ids) {
    const nd = N.get(id);
    const fillWord = nd.opts.fill || [...nd.flags].find((f) => isColor(f)) || o.fill;
    const col = fillFor(fillWord, ctx, 'graph');
    const x = nd.px;
    const y = nd.py;
    const sw = nd.flags.has('thick') ? lw * 2.2 : lw;
    if (nd.shape === 'circle') {
      rec.raw((svg, dx, dy) => {
        svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="${n2(nd.hw)}" fill="${col.fill}" stroke="#000" stroke-width="${n2(sw)}"/>`);
        if (nd.double) svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="${n2(nd.hw - 3)}" fill="none" stroke="#000" stroke-width="${n2(lw)}"/>`);
      }, x - nd.hw, y - nd.hh, x + nd.hw, y + nd.hh);
      rec.label(nd.label, x, y, size, col.text);
    } else if (nd.shape === 'ellipse') {
      rec.raw((svg, dx, dy) => svg.push(`<ellipse cx="${n2(x + dx)}" cy="${n2(y + dy)}" rx="${n2(nd.hw)}" ry="${n2(nd.hh)}" fill="${col.fill}" stroke="#000" stroke-width="${n2(sw)}"/>`), x - nd.hw, y - nd.hh, x + nd.hw, y + nd.hh);
      rec.label(nd.label, x, y, size, col.text);
    } else if (nd.shape === 'box') {
      rec.rect(x - nd.hw, y - nd.hh, nd.hw * 2, nd.hh * 2, col.fill, { width: sw });
      rec.label(nd.label, x, y, size, col.text);
    } else if (nd.shape === 'none') {
      rec.label(nd.label, x, y, size, '#000');
    } else if (nd.shape === 'point') {
      rec.raw((svg, dx, dy) => svg.push(`<circle cx="${n2(x + dx)}" cy="${n2(y + dy)}" r="3" fill="${fillWord ? col.fill : '#000'}"/>`), x - 3, y - 3, x + 3, y + 3);
      const hasAnn = nd.opts.above || nd.opts.below || nd.opts.left || nd.opts.right;
      if (!hasAnn && nd.label) rec.labelAt(nd.label, x + 6, y - size * 0.55, size, 'l');
    }
    if (nd.flags.has('start')) rec.connector(x - nd.hw - size * 2.2, y, x - nd.hw, y, { end: true, width: lw });
    const ann = nd.opts;
    const gapA = size * 0.3;
    if (ann.right) rec.labelAt(ann.right, x + nd.hw + gapA, y, size, 'l');
    if (ann.left) rec.labelAt(ann.left, x - nd.hw - gapA, y, size, 'r');
    if (ann.above) { const m = labelSize(ann.above, size); rec.label(ann.above, x, y - nd.hh - gapA - m.h / 2, size); }
    if (ann.below) { const m = labelSize(ann.below, size); rec.label(ann.below, x, y + nd.hh + gapA + m.h / 2, size); }
    rec.hits.push({ kind: 'gnode', block: block.index, id, x, y, r: Math.max(nd.hw, nd.hh, 6), unit, ux: nd.ux, uy: nd.uy, line: nd.line });
  }
  const res = rec.done(2);
  res.graph = { unit, ids, nodes: N };
  return res;
}
