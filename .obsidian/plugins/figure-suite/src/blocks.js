/*
 * Figure Suite — recorder + array / table / list / chains / text / arrow blocks.
 *
 * Each layout function returns { w, h, draw(svg, ox, oy), hits } where the
 * block occupies [ox, ox + w] × [oy, oy + h].
 */

/** Records draw operations with their bounding box, then replays them shifted. */
class Rec {
  constructor() {
    this.ops = [];
    this.box = [Infinity, Infinity, -Infinity, -Infinity];
    this.hits = [];
  }

  ext(x1, y1, x2, y2) {
    const b = this.box;
    b[0] = Math.min(b[0], x1, x2); b[1] = Math.min(b[1], y1, y2);
    b[2] = Math.max(b[2], x1, x2); b[3] = Math.max(b[3], y1, y2);
  }

  op(fn) { this.ops.push(fn); }

  /** Centered label; returns its extents. */
  label(text, cx, cy, size, color = '#000000', mode = 'math') {
    const m = labelSize(text, size, mode);
    if (m.empty) return m;
    this.ext(cx - m.w / 2, cy - m.h / 2, cx + m.w / 2, cy + m.h / 2);
    this.op((svg, dx, dy) => svg.label(text, cx + dx, cy + dy, size, color, mode));
    return m;
  }

  /** Label anchored by side: align 'l' (left edge at x), 'r', 'c'; vertical centre at cy. */
  labelAt(text, x, cy, size, align, color = '#000000', mode = 'math') {
    const m = labelSize(text, size, mode);
    if (m.empty) return m;
    const cx = align === 'l' ? x + m.w / 2 : align === 'r' ? x - m.w / 2 : x;
    return this.label(text, cx, cy, size, color, mode);
  }

  rect(x, y, w, h, fill, opts = {}) {
    this.ext(x, y, x + w, y + h);
    this.op((svg, dx, dy) => rect(svg, x + dx, y + dy, w, h, fill, opts));
  }

  line(x1, y1, x2, y2, opts = {}) {
    this.ext(x1, y1, x2, y2);
    this.op((svg, dx, dy) => line(svg, x1 + dx, y1 + dy, x2 + dx, y2 + dy, opts));
  }

  connector(x1, y1, x2, y2, opts = {}) {
    this.ext(x1, y1, x2, y2);
    if (opts.bend) {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const cx = (x1 + x2) / 2 + (-(y2 - y1) / len) * opts.bend;
      const cy = (y1 + y2) / 2 + ((x2 - x1) / len) * opts.bend;
      this.ext(cx, cy, cx, cy);
    }
    this.op((svg, dx, dy) => connector(svg, x1 + dx, y1 + dy, x2 + dx, y2 + dy, opts));
  }

  poly(pts, opts = {}) {
    pts.forEach((p) => this.ext(p[0], p[1], p[0], p[1]));
    this.op((svg, dx, dy) => polyArrow(svg, pts.map((p) => [p[0] + dx, p[1] + dy]), opts));
  }

  raw(fn, x1, y1, x2, y2) {
    this.ext(x1, y1, x2, y2);
    this.op(fn);
  }

  /** Freeze into a block result. */
  done(pad = 0) {
    let [x1, y1, x2, y2] = this.box;
    if (!Number.isFinite(x1)) { x1 = 0; y1 = 0; x2 = 0; y2 = 0; }
    x1 -= pad; y1 -= pad; x2 += pad; y2 += pad;
    const ops = this.ops;
    const hits = this.hits;
    return {
      w: x2 - x1,
      h: y2 - y1,
      draw(svg, ox, oy, sink) {
        const dx = ox - x1;
        const dy = oy - y1;
        for (const fn of ops) fn(svg, dx, dy);
        if (sink) for (const h of hits) sink.push({ ...h, x: h.x + dx, y: h.y + dy, ox: dx, oy: dy });
      },
    };
  }
}

/** Fill colour + text colour for a block, honouring figure defaults. */
function fillFor(name, ctx, kind) {
  return colorOf(name || ctx.fills[kind] || 'white');
}

/* ---------------- array ---------------- */

function layoutArray(block, ctx, errors) {
  const size = ctx.size;
  const small = size * 0.8;
  const o = block.opts;
  const cells = [];
  const pushToken = (tok) => {
    const { label, color } = splitColor(tok);
    cells.push({ label: label === '_' ? '' : label, color });
  };
  for (const entry of block.data) tokenize(entry.text).forEach((t) => pushToken(t.text));
  const shade = new Map();
  const ptrs = [];
  const spans = [];
  const bars = [];
  const arcs = [];
  let indexLabels = null;
  const refs = []; // [index, line, slack] for range checks
  const barLines = [];
  for (const d of block.directives) {
    const toks = tokenize(d.rest).map((t) => t.text);
    if (d.name === 'values') toks.forEach(pushToken);
    else if (d.name === 'shade' || d.name === 'color') {
      const color = isColor(toks[toks.length - 1]) ? toks.pop() : 'shade';
      for (const t of toks) {
        const r = parseRange(t);
        if (!r) { errors.push({ line: d.line, msg: `Bad index range "${t}"` }); continue; }
        for (let k = r[0]; k <= r[1]; k++) shade.set(k, color);
        refs.push([r[0], d.line], [r[1], d.line]);
      }
    } else if (d.name === 'ptr') {
      const args = splitArgs(tokenize(d.rest));
      const side = args.pos.includes('below') ? 'below' : 'above';
      const rest = args.pos.filter((p) => p !== 'above' && p !== 'below');
      for (const [k, v] of Object.entries(args.opts)) ptrs.push({ name: k, at: num(v, NaN), side, line: d.line });
      for (let k = 0; k + 1 < rest.length; k += 2) ptrs.push({ name: rest[k], at: num(rest[k + 1], NaN), side, line: d.line });
    } else if (d.name === 'span') {
      const args = splitArgs(tokenize(d.rest));
      const r = parseRange(args.pos[0] || '');
      if (!r) { errors.push({ line: d.line, msg: 'span: expected a range like 2..5' }); continue; }
      const flags = new Set(args.pos.slice(1));
      const label = args.opts.label ?? args.pos.slice(1).filter((p) => !['above', 'below', 'square', 'brace'].includes(p)).join(' ');
      refs.push([r[0], d.line], [r[1], d.line]);
      spans.push({ r, label, side: flags.has('above') ? 'above' : 'below', square: flags.has('square') });
    } else if (d.name === 'bar') toks.forEach((t) => { const v = num(t, NaN); if (Number.isFinite(v)) { bars.push(v); barLines.push(d.line); } });
    else if (d.name === 'arc') {
      const args = splitArgs(tokenize(d.rest.replace(/->/g, ' -> ')));
      const p = args.pos;
      const at = p.indexOf('->');
      if (at !== 1) { errors.push({ line: d.line, msg: 'arc: expected "i -> j [label]"' }); continue; }
      const flags = p.slice(3);
      refs.push([num(p[0], NaN), d.line], [num(p[2], NaN), d.line]);
      arcs.push({
        from: num(p[0], NaN), to: num(p[2], NaN), side: flags.includes('below') ? 'below' : 'above',
        label: args.opts.label ?? flags.filter((f) => f !== 'above' && f !== 'below').join(' '),
      });
    } else if (d.name === 'index') indexLabels = toks;
  }
  const start = Math.round(num(o.start, 1));
  const n = cells.length;
  // pointers may sit one cell past either end (PARTITION's i = p - 1); bars go between cells
  const inside = (k, slack = 0) => !n || (k >= start - slack && k <= start + n - 1 + slack);
  const barOk = (b) => !n || (b >= start - 1 && b <= start + n - 1);
  for (const p of ptrs) refs.push([p.at, p.line, 1]);
  const reported = new Set();
  bars.forEach((b, i) => { if (!barOk(b) && !reported.has(barLines[i])) { reported.add(barLines[i]); errors.push({ line: barLines[i], msg: `bar: ${b} is outside ${start - 1}..${start + n - 1}, skipped`, warn: true }); } });
  for (const [k, line, slack] of refs) {
    if (Number.isFinite(k) && !inside(k, slack || 0) && !reported.has(line)) {
      reported.add(line);
      errors.push({ line, msg: `Index ${k} is outside ${start}..${start + n - 1}, skipped`, warn: true });
    }
  }
  // drop what would be drawn far outside the array
  const keep = (list, test) => { const ok = list.filter(test); list.length = 0; list.push(...ok); };
  keep(ptrs, (p) => !Number.isFinite(p.at) || inside(p.at, 1));
  keep(arcs, (a) => inside(a.from) && inside(a.to));
  keep(spans, (sp) => inside(sp.r[0]) && inside(sp.r[1]));
  keep(bars, barOk);
  const cw = num(o.w, 0) || Math.max(size * 1.75, ...cells.map((c) => labelSize(c.label, size).w + size * 0.7));
  const ch = num(o.h, 0) || Math.max(size * 1.75, ...cells.map((c) => labelSize(c.label, size).h + size * 0.6));
  const rec = new Rec();
  const vertical = truthy(o.vertical);
  const cellX = (k) => (vertical ? 0 : (k - start) * cw); // k is a user index
  const cellY = (k) => (vertical ? (k - start) * ch : 0);
  const fillName = o.fill;
  // cells
  cells.forEach((c, k) => {
    const idx = k + start;
    const col = fillFor(c.color || shade.get(idx) || fillName, ctx, 'array');
    rec.rect(cellX(idx), cellY(idx), cw, ch, col.fill, { width: ctx.lw });
    rec.label(c.label, cellX(idx) + cw / 2, cellY(idx) + ch / 2, size, col.text);
  });
  if (!n) rec.ext(0, 0, cw, ch);
  // name
  if (block.pos[0] && o.label !== 'none') {
    if (vertical) rec.label(block.pos[0], cw / 2, -size * 0.9, size);
    else rec.labelAt(block.pos[0], -size * 0.6, ch / 2, size, 'r');
  }
  const showIndex = (o.index || 'above') !== 'none' && n > 0;
  const idxSide = o.index === 'below' ? 'below' : (o.index === 'left' || o.index === 'right' ? o.index : 'above');
  let top = 0;
  let bottom = vertical ? n * ch : ch;
  if (showIndex) {
    const ih = labelSize('0', small).h;
    cells.forEach((c, k) => {
      const idx = k + start;
      const text = indexLabels ? (indexLabels[k] ?? '') : String(idx);
      if (vertical) {
        if (idxSide === 'right') rec.labelAt(text, cw + size * 0.4, cellY(idx) + ch / 2, small, 'l');
        else rec.labelAt(text, -size * 0.4, cellY(idx) + ch / 2, small, 'r');
      } else if (idxSide === 'above') rec.label(text, cellX(idx) + cw / 2, -size * 0.35 - ih / 2, small);
      else rec.label(text, cellX(idx) + cw / 2, ch + size * 0.35 + ih / 2, small);
    });
    if (!vertical) {
      if (idxSide === 'above') top = -(size * 0.35 + ih);
      else bottom = ch + size * 0.35 + ih;
    }
  }
  // bars
  for (const b of bars) {
    if (vertical) rec.line(-4, cellY(b) + ch, cw + 4, cellY(b) + ch, { width: ctx.lw * 2.6 });
    else rec.line(cellX(b) + cw, -4, cellX(b) + cw, ch + 4, { width: ctx.lw * 2.6 });
  }
  if (vertical) return rec.done();
  // spans
  for (const side of ['above', 'below']) {
    const list = spans.filter((s) => s.side === side);
    if (!list.length) continue;
    const dir = side === 'above' ? -1 : 1;
    const y0 = (side === 'above' ? top : bottom) + dir * 4;
    let edge = y0;
    for (const s of list) {
      const x1 = cellX(s.r[0]) + 2;
      const x2 = cellX(s.r[1]) + cw - 2;
      const yEnd = y0 + dir * (s.square ? 6 : 12);
      rec.raw((svg, dx, dy) => brace(svg, x1 + dx, x2 + dx, y0 + dy, dir, { square: s.square, width: ctx.lw }), x1, y0, x2, yEnd);
      const m = labelSize(s.label, size);
      const cy = yEnd + dir * (3 + m.h / 2);
      rec.label(s.label, (x1 + x2) / 2, cy, size);
      edge = dir < 0 ? Math.min(edge, cy - m.h / 2) : Math.max(edge, cy + m.h / 2);
    }
    if (side === 'above') top = edge; else bottom = edge;
  }
  // arcs
  for (const side of ['above', 'below']) {
    const list = arcs.filter((a) => a.side === side);
    if (!list.length) continue;
    const dir = side === 'above' ? -1 : 1;
    const base = side === 'above' ? Math.min(top, 0) - 3 : Math.max(bottom, ch) + 3;
    let edge = base;
    for (const a of list) {
      const x1 = cellX(a.from) + cw / 2;
      const x2 = cellX(a.to) + cw / 2;
      const h = Math.min(60, 10 + Math.abs(x2 - x1) * 0.25);
      const bend = (x2 > x1 ? 1 : -1) * dir * h; // apex offset (see connector)
      rec.connector(x1, base, x2, base, { end: true, bend, width: ctx.lw });
      const apex = base + dir * h;
      if (a.label) {
        const m = labelSize(a.label, size);
        rec.label(a.label, (x1 + x2) / 2, apex + dir * (m.h / 2 + 3), size);
        edge = dir < 0 ? Math.min(edge, apex - m.h - 3) : Math.max(edge, apex + m.h + 3);
      } else edge = dir < 0 ? Math.min(edge, apex) : Math.max(edge, apex);
    }
    if (side === 'above') top = edge; else bottom = edge;
  }
  // pointers (grouped by cell)
  for (const side of ['above', 'below']) {
    const groups = new Map();
    for (const p of ptrs.filter((q) => q.side === side)) {
      if (!Number.isFinite(p.at)) { errors.push({ line: p.line, msg: `ptr ${p.name}: bad index` }); continue; }
      if (!groups.has(p.at)) groups.set(p.at, []);
      groups.get(p.at).push(p.name);
    }
    const dir = side === 'above' ? -1 : 1;
    const y0 = (side === 'above' ? top : bottom) + dir * 2;
    const len = size * 1.1;
    for (const [at, names] of groups) {
      const x = cellX(at) + cw / 2;
      const text = names.join(',\\,');
      const m = labelSize(text, size);
      rec.connector(x, y0 + dir * len, x, y0, { end: true, width: ctx.lw });
      rec.label(text, x, y0 + dir * (len + 2 + m.h / 2), size);
    }
  }
  return rec.done();
}

/* ---------------- table ---------------- */

function layoutTable(block, ctx, errors) {
  const size = ctx.size;
  const o = block.opts;
  const rows = block.data.map((entry) => tokenize(entry.text).map((t) => {
    const { label, color } = splitColor(t.text);
    return { label: label === '_' ? '' : label, color };
  }));
  const R = rows.length;
  const C = Math.max(0, ...rows.map((r) => r.length));
  const start = Math.round(num(o.start, 1));
  const shade = new Map();
  let colHead = null;
  let rowHead = null;
  const arrows = [];
  for (const d of block.directives) {
    const toks = tokenize(d.rest.replace(/->/g, ' -> ')).map((t) => t.text);
    if (d.name === 'cols') colHead = toks.map((t) => (t === '_' ? '' : t));
    else if (d.name === 'rows') rowHead = toks.map((t) => (t === '_' ? '' : t));
    else if (d.name === 'shade' || d.name === 'color') {
      const color = isColor(toks[toks.length - 1]) ? toks.pop() : 'shade';
      for (const t of toks) {
        let ref = parseCellRef(t);
        const rm = t.match(/^(row|col)=(.+)$/);
        if (rm) {
          const r = parseRange(rm[2]);
          if (r) ref = rm[1] === 'row' ? { rows: r, cols: [start, start + C - 1] } : { rows: [start, start + R - 1], cols: r };
        }
        if (!ref) { errors.push({ line: d.line, msg: `Bad cell "${t}" (use (r,c), (r1..r2,c), row=2 or col=3)` }); continue; }
        if (ref.rows[0] < start || ref.rows[1] > start + R - 1 || ref.cols[0] < start || ref.cols[1] > start + C - 1) errors.push({ line: d.line, msg: `Cell ${t} is outside rows ${start}..${start + R - 1}, cols ${start}..${start + C - 1}`, warn: true });
        for (let r = ref.rows[0]; r <= ref.rows[1]; r++) for (let c = ref.cols[0]; c <= ref.cols[1]; c++) shade.set(`${r},${c}`, color);
      }
    } else if (d.name === 'arrow' || d.name === 'path') {
      const args = splitArgs(tokenize(d.rest.replace(/->/g, ' -> ')));
      const refs = args.pos.filter((t) => t !== '->').map(parseCellRef);
      if (refs.some((r) => !r) || refs.length < 2) { errors.push({ line: d.line, msg: `${d.name}: expected (r,c) -> (r,c) ...` }); continue; }
      if (refs.some((r) => r.rows[0] < start || r.rows[0] > start + R - 1 || r.cols[0] < start || r.cols[0] > start + C - 1)) errors.push({ line: d.line, msg: `${d.name}: a cell is outside rows ${start}..${start + R - 1}, cols ${start}..${start + C - 1}`, warn: true });
      arrows.push({ refs: refs.map((r) => [r.rows[0], r.cols[0]]), heads: d.name === 'arrow', color: strokeOf(args.opts.color, '#000000') });
    }
  }
  if (truthy(o.index)) {
    if (!colHead) colHead = Array.from({ length: C }, (_, k) => String(k + start));
    if (!rowHead) rowHead = Array.from({ length: R }, (_, k) => String(k + start));
  }
  const grid = o.grid || (truthy(o.brackets) || truthy(o.matrix) ? 'none' : 'all');
  const minW = num(o.w, 0);
  const pad = size * 0.7;
  const colW = Array.from({ length: C }, (_, c) => minW || Math.max(size * 1.75, ...rows.map((r) => (r[c] ? labelSize(r[c].label, size).w + pad : 0)), colHead && colHead[c + ((colHead.length === C + 1) ? 1 : 0)] ? labelSize(colHead[c + ((colHead.length === C + 1) ? 1 : 0)], size).w + pad : 0));
  if (o.uniform !== 'false' && !minW && grid !== 'none') {
    const m = Math.max(...colW, 0);
    colW.fill(m);
  }
  const rowH = num(o.h, 0) || Math.max(size * 1.75, ...rows.flat().map((c) => labelSize(c.label, size).h + size * 0.6));
  const xs = [0];
  colW.forEach((w) => xs.push(xs[xs.length - 1] + w));
  const W = xs[C] || 0;
  const H = R * rowH;
  const rec = new Rec();
  const cell = (r, c) => ({ x: xs[c - start], y: (r - start) * rowH, w: colW[c - start], h: rowH });
  // fills
  rows.forEach((row, r) => row.forEach((c, k) => {
    const col = fillFor(c.color || shade.get(`${r + start},${k + start}`) || o.fill, ctx, 'table');
    if (col.fill !== '#ffffff' || grid === 'all') {
      rec.rect(xs[k], r * rowH, colW[k], rowH, col.fill, { stroke: grid === 'all' ? '#000000' : null, width: ctx.lw });
    }
  }));
  // labels
  rows.forEach((row, r) => row.forEach((c, k) => {
    const col = fillFor(c.color || shade.get(`${r + start},${k + start}`) || o.fill, ctx, 'table');
    rec.label(c.label, xs[k] + colW[k] / 2, r * rowH + rowH / 2, size, col.text);
  }));
  rec.ext(0, 0, W, H);
  // grid styles
  if (grid === 'outer' || grid === 'rows' || grid === 'cols') rec.rect(0, 0, W, H, 'none', { width: ctx.lw });
  if (grid === 'rows') for (let r = 1; r < R; r++) rec.line(0, r * rowH, W, r * rowH, { width: ctx.lw });
  if (grid === 'cols') for (let c = 1; c < C; c++) rec.line(xs[c], 0, xs[c], H, { width: ctx.lw });
  if (truthy(o.brackets) || truthy(o.matrix)) {
    const t = 5;
    const b = 3;
    rec.raw((svg, dx, dy) => {
      svg.push(`<path d="M${n2(-b + t + dx)} ${n2(-2 + dy)}H${n2(-b + dx)}V${n2(H + 2 + dy)}H${n2(-b + t + dx)}M${n2(W + b - t + dx)} ${n2(-2 + dy)}H${n2(W + b + dx)}V${n2(H + 2 + dy)}H${n2(W + b - t + dx)}" fill="none" stroke="#000" stroke-width="${n2(ctx.lw)}"/>`);
    }, -b, -2, W + b, H + 2);
  }
  // headers
  const small = size * (truthy(o.index) ? 0.8 : 1);
  let leftEdge = 0;
  if (colHead) {
    const offset = colHead.length === C + 1 ? 1 : 0;
    for (let c = 0; c < C; c++) {
      const text = colHead[c + offset];
      if (text) rec.label(text, xs[c] + colW[c] / 2, -rowH / 2, small);
    }
    if (offset && colHead[0]) rec.labelAt(colHead[0], -size * 0.5, -rowH / 2, small, 'r');
  }
  if (rowHead) {
    rowHead.forEach((text, r) => {
      if (r >= R) return;
      const m = rec.labelAt(text, -size * 0.5, r * rowH + rowH / 2, small, 'r');
      leftEdge = Math.min(leftEdge, -size * 0.5 - m.w);
    });
  }
  if (block.pos[0]) rec.labelAt(block.pos.join(' '), leftEdge - size * 0.7, H / 2, size, 'r');
  // arrows
  for (const a of arrows) {
    for (let k = 0; k + 1 < a.refs.length; k++) {
      const p = cell(...a.refs[k]);
      const q = cell(...a.refs[k + 1]);
      if (!p.w || !q.w) continue;
      const x1 = p.x + p.w / 2;
      const y1 = p.y + p.h / 2;
      const x2 = q.x + q.w / 2;
      const y2 = q.y + q.h / 2;
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const cut = Math.min(rowH, p.w) * 0.32;
      const ux = (x2 - x1) / len;
      const uy = (y2 - y1) / len;
      rec.connector(x1 + ux * cut, y1 + uy * cut, x2 - ux * cut, y2 - uy * cut, { end: a.heads, width: ctx.lw * 1.2, color: a.color });
    }
  }
  return rec.done();
}

/* ---------------- linked records ---------------- */

/** Draw one record (fields left→right) at (x, y). Returns { w, h }. */
function drawRecord(rec, x, y, fields, fw, h, fillName, ctx) {
  const col = fillFor(fillName, ctx, 'list');
  fields.forEach((f, k) => {
    rec.rect(x + k * fw, y, fw, h, col.fill, { width: ctx.lw });
    if (f.slash) rec.line(x + k * fw + fw * 0.25, y + h * 0.75, x + k * fw + fw * 0.75, y + h * 0.25, { width: ctx.lw });
    else if (f.label) rec.label(f.label, x + (k + 0.5) * fw, y + h / 2, ctx.size, col.text);
  });
  return { w: fields.length * fw, h };
}

function layoutList(block, ctx, errors) {
  const size = ctx.size;
  const o = block.opts;
  const doubly = truthy(o.double);
  const name = block.pos.length ? block.pos.join(' ') : '';
  const nodes = [];
  for (const entry of block.data) tokenize(entry.text).forEach((t) => {
    const { label, color } = splitColor(t.text);
    nodes.push({ label, color });
  });
  const shade = new Map();
  let namesAt = 0;
  for (const d of block.directives) {
    const toks = tokenize(d.rest).map((t) => t.text);
    if (d.name === 'shade' || d.name === 'color') {
      const color = isColor(toks[toks.length - 1]) ? toks.pop() : 'shade';
      toks.forEach((t) => { const r = parseRange(t); if (r) for (let k = r[0]; k <= r[1]; k++) shade.set(k, color); else errors.push({ line: d.line, msg: `Bad index "${t}"` }); });
    } else if (d.name === 'names') {
      namesAt = Math.round(num(toks[0], 1));
      if (!(namesAt >= 1 && namesAt <= nodes.length)) errors.push({ line: d.line, msg: `names: node ${toks[0]} is outside 1..${nodes.length}`, warn: true });
    }
  }
  const fieldNames = (o.fields || (doubly ? 'prev,key,next' : 'key,next')).split(',').map((s) => s.trim());
  const fw = num(o.w, 0) || Math.max(size * 1.75, ...nodes.map((nd) => labelSize(nd.label, size).w + size * 0.7));
  const h = num(o.h, 0) || size * 1.75;
  const gap = num(o.gap, 0) || fw * 1.6;
  const rec = new Rec();
  const nf = doubly ? 3 : 2;
  const nodeW = nf * fw;
  let x = 0;
  const mid = h / 2;
  if (name) {
    const m = rec.labelAt(name, 0, mid, size, 'l');
    x = m.w + size * 0.6;
    const ax2 = x + size * 2.6;
    if (nodes.length) rec.connector(x, mid, ax2, mid, { end: true, width: ctx.lw });
    else rec.label('\\textsc{nil}', ax2 + size, mid, size);
    x = ax2;
  }
  const starts = nodes.map((_, k) => x + k * (nodeW + gap));
  nodes.forEach((nd, k) => {
    const last = k === nodes.length - 1;
    const fields = doubly
      ? [{ slash: k === 0 }, { label: nd.label }, { slash: last }]
      : [{ label: nd.label }, { slash: last }];
    drawRecord(rec, starts[k], 0, fields, fw, h, nd.color || shade.get(k + 1) || o.fill, ctx);
  });
  const off = doubly ? h * 0.16 : 0;
  for (let k = 0; k + 1 < nodes.length; k++) {
    const nx = starts[k] + nodeW - fw / 2;
    rec.connector(nx, mid - off, starts[k + 1], mid - off, { end: true, width: ctx.lw });
    if (doubly) rec.connector(starts[k + 1] + fw / 2, mid + off, starts[k] + nodeW, mid + off, { end: true, width: ctx.lw });
  }
  if (namesAt >= 1 && namesAt <= nodes.length) {
    const sx = starts[namesAt - 1];
    fieldNames.slice(0, nf).forEach((fname, k) => {
      const cx = sx + (k + 0.5) * fw;
      const slant = k === 0 ? -1 : k === nf - 1 ? 1 : 0;
      const spread = fw * 0.35 * slant;
      rec.line(cx + spread * 0.3, -3, cx + spread, -size * 0.9, { width: ctx.lw });
      rec.label(`\\textit{${fname}}`, cx + spread * 1.5, -size * 1.6, size);
    });
  }
  return rec.done();
}

function layoutChains(block, ctx, errors) {
  const size = ctx.size;
  const o = block.opts;
  const doubly = truthy(o.double);
  const name = block.pos.length ? block.pos.join(' ') : '';
  const start = Math.round(num(o.start, 0));
  const slots = block.data.map((entry, k) => {
    const m = entry.text.match(/^(\S+?):(?:\s+(.*))?$/) || entry.text.match(/^(\S+?):(.*)$/);
    const key = m ? m[1] : String(k + start);
    const rest = m ? (m[2] || '') : entry.text;
    const items = tokenize(rest).map((t) => splitColor(t.text)).filter((it) => it.label !== '/' && it.label !== '_' && it.label !== '');
    return { key, items };
  });
  const shade = new Map();
  for (const d of block.directives) {
    const toks = tokenize(d.rest).map((t) => t.text);
    const color = isColor(toks[toks.length - 1]) ? toks.pop() : 'shade';
    toks.forEach((t) => shade.set(t, color));
  }
  const all = slots.flatMap((s) => s.items);
  const fw = num(o.w, 0) || Math.max(size * 1.75, ...all.map((it) => labelSize(it.label, size).w + size * 0.7));
  const sw = num(o.slot, 0) || size * 1.75;
  const rowH = num(o.h, 0) || size * 2.0;
  const rh = rowH - size * 0.5;
  const gap = fw * 1.3;
  const nf = doubly ? 3 : 2;
  const rec = new Rec();
  const slotFill = fillFor(o.slotfill, ctx, 'array');
  slots.forEach((slot, r) => {
    const y = r * rowH;
    rec.rect(0, y, sw, rowH, slotFill.fill, { width: ctx.lw });
    rec.labelAt(slot.key, -size * 0.45, y + rowH / 2, size * 0.8, 'r');
    if (!slot.items.length) {
      rec.line(sw * 0.25, y + rowH * 0.75, sw * 0.75, y + rowH * 0.25, { width: ctx.lw });
      return;
    }
    const cy = y + rowH / 2;
    let x = sw + gap * 0.9;
    rec.raw((svg, dx, dy) => svg.push(`<circle cx="${n2(sw / 2 + dx)}" cy="${n2(cy + dy)}" r="${n2(1.8 * ctx.lw)}" fill="#000"/>`), sw / 2, cy, sw / 2, cy);
    rec.connector(sw / 2, cy, x, cy, { end: true, width: ctx.lw });
    slot.items.forEach((it, k) => {
      const last = k === slot.items.length - 1;
      const fields = doubly ? [{ slash: k === 0 }, { label: it.label }, { slash: last }] : [{ label: it.label }, { slash: last }];
      drawRecord(rec, x, cy - rh / 2, fields, fw, rh, it.color || shade.get(it.label) || o.fill, ctx);
      if (!last) {
        const nx = x + nf * fw + gap;
        const off = doubly ? rh * 0.16 : 0;
        rec.connector(x + (nf - 0.5) * fw, cy - off, nx, cy - off, { end: true, width: ctx.lw });
        if (doubly) rec.connector(nx + fw / 2, cy + off, x + nf * fw, cy + off, { end: true, width: ctx.lw });
        x = nx;
      }
    });
  });
  if (name) rec.label(name, sw / 2, -size * 0.9, size);
  return rec.done();
}

/* ---------------- text / arrow / space ---------------- */

function layoutText(block, ctx) {
  const o = block.opts;
  const size = num(o.size, ctx.size);
  const lines = [block.pos.join(' '), ...block.data.map((d) => d.text)].filter((l) => l.trim());
  const mode = o.mode === 'math' || truthy(o.math) ? 'math' : 'text';
  const rec = new Rec();
  let y = 0;
  const align = o.align || 'center';
  const widths = lines.map((l) => labelSize(truthy(o.bold) ? `\\textbf{${l}}` : l, size, mode));
  const W = Math.max(0, ...widths.map((m) => m.w));
  lines.forEach((l, k) => {
    const m = widths[k];
    const text = truthy(o.bold) ? `\\textbf{${l}}` : l;
    const x = align === 'left' ? m.w / 2 : align === 'right' ? W - m.w / 2 : W / 2;
    rec.label(text, x, y + m.h / 2, size, strokeOf(o.color), mode);
    y += Math.max(m.h, size) + size * 0.35;
  });
  return rec.done();
}

function layoutArrow(block, ctx) {
  const o = block.opts;
  const size = ctx.size;
  const label = block.pos.join(' ');
  const m = labelSize(label, size, 'text');
  const len = num(o.len, 0) || Math.max(size * 3, m.w + size * 1.2);
  const rec = new Rec();
  const dir = o.dir || 'right';
  const width = ctx.lw * num(o.width, 1.6);
  if (dir === 'down' || dir === 'up') {
    const [y1, y2] = dir === 'down' ? [0, len] : [len, 0];
    rec.connector(0, y1, 0, y2, { end: true, width, headSize: 1.3, start: truthy(o.both) });
    if (label) rec.labelAt(label, size * 0.6, len / 2, size, 'l', '#000', 'text');
  } else {
    const [x1, x2] = dir === 'left' ? [len, 0] : [0, len];
    rec.connector(x1, 0, x2, 0, { end: true, width, headSize: 1.3, start: truthy(o.both) });
    if (label) rec.label(label, len / 2, -size * 0.45 - m.h / 2, size, '#000', 'text');
    rec.ext(0, -4, len, 4);
  }
  return rec.done(2);
}

function layoutSpace(block) {
  const rec = new Rec();
  rec.ext(0, 0, num(block.pos[0], 20), num(block.pos[1], 20));
  return rec.done();
}
