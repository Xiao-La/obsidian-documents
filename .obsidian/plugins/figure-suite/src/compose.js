/*
 * Figure Suite — figure composition: blocks → panels → rows → SVG.
 */

const LAYOUTS = {
  array: layoutArray,
  table: layoutTable,
  tree: layoutTree,
  graph: layoutGraph,
  list: layoutList,
  chains: layoutChains,
  text: layoutText,
  arrow: layoutArrow,
  space: layoutSpace,
};

const DEFAULT_RENDER = {
  fontSize: 15,
  background: '#ffffff',
  fill: '',
  listFill: 'light',
};

/**
 * Render figure source. Returns { svg, width, height, errors, hits, empty }.
 * `hits` lists draggable graph nodes in SVG pixel coordinates.
 */
function renderFigure(source, settings = {}, { embedSource = false } = {}) {
  const conf = { ...DEFAULT_RENDER, ...settings };
  const fig = parseFigure(source);
  const errors = fig.errors.slice();
  const o = fig.opts;
  let size = num(o.size, conf.fontSize);
  if (!(size >= 4 && size <= 80)) {
    errors.push({ line: fig.line || 1, msg: `figure size=${o.size} is out of range (4–80)`, warn: true });
    size = Math.min(80, Math.max(4, size || conf.fontSize));
  }
  const globalFill = o.fill || conf.fill || '';
  const ctx = {
    size,
    lw: num(o.lw, 1),
    fills: {
      array: globalFill || 'white',
      table: globalFill || 'white',
      tree: globalFill || 'white',
      graph: globalFill || 'white',
      list: globalFill || conf.listFill || 'light',
    },
  };
  const svg = new SVG();
  const hits = [];

  // lay out every block
  const panels = fig.panels.map((p) => {
    const items = p.blocks.map((b) => {
      try {
        return { block: b, box: LAYOUTS[b.kind](b, ctx, errors) };
      } catch (err) {
        errors.push({ line: b.line, msg: `${b.kind}: ${err && err.message ? err.message : err}` });
        return null;
      }
    }).filter(Boolean);
    const dir = p.opts.dir === 'row' ? 'row' : 'col';
    const gap = num(p.opts.gap, size * 1.6);
    let w = 0;
    let h = 0;
    if (dir === 'col') {
      items.forEach((it, k) => { w = Math.max(w, it.box.w); h += it.box.h + (k ? gap : 0); });
    } else {
      items.forEach((it, k) => { h = Math.max(h, it.box.h); w += it.box.w + (k ? gap : 0); });
    }
    const capText = unquote(p.caption || '');
    const tag = capText.match(/^(\([A-Za-z0-9]{1,3}\))(\s+.*)?$/s);
    const caption = !capText ? '' : tag ? `\\textbf{${tag[1]}}${tag[2] || ''}` : capText;
    const cap = caption ? labelSize(caption, size, 'text') : null;
    return { p, items, dir, gap, w, h, caption, cap, arrow: !!p.arrow };
  });

  // rows of panels
  const cols = Math.max(1, Math.round(num(o.cols, panels.length || 1)));
  const rows = [];
  let current = [];
  let counted = 0;
  for (const panel of panels) {
    current.push(panel);
    if (!panel.arrow) counted++;
    if (counted >= cols) { rows.push(current); current = []; counted = 0; }
  }
  if (current.length) rows.push(current);
  const pgap = num(o.gap, size * 2.2);
  const rgap = num(o.rowgap, size * 2);
  const align = o.align || 'center';
  const capGap = size * 0.9;

  let y = 0;
  let width = 0;
  const placed = [];
  for (const row of rows) {
    const contentH = Math.max(0, ...row.filter((pn) => !pn.arrow).map((pn) => pn.h), ...row.map((pn) => (pn.arrow ? pn.h : 0)));
    const capH = Math.max(0, ...row.map((pn) => (pn.cap ? pn.cap.h : 0)));
    let x = 0;
    row.forEach((pn, k) => {
      const pw = Math.max(pn.w, pn.cap ? pn.cap.w : 0);
      const top = pn.arrow || align === 'center' ? y + (contentH - pn.h) / 2 : align === 'bottom' ? y + contentH - pn.h : y;
      placed.push({ pn, x, top, pw, capY: y + contentH + capGap + capH / 2 });
      x += pw + (k + 1 < row.length ? (pn.arrow || (row[k + 1] && row[k + 1].arrow) ? pgap * 0.6 : pgap) : 0);
    });
    width = Math.max(width, x);
    y += contentH + (capH ? capGap + capH : 0) + rgap;
  }
  const height = Math.max(0, y - rgap);

  for (const { pn, x, top, pw, capY } of placed) {
    if (pn.dir === 'col') {
      let yy = top;
      for (const it of pn.items) {
        it.box.draw(svg, x + (pw - it.box.w) / 2, yy, hits);
        yy += it.box.h + pn.gap;
      }
    } else {
      let xx = x + (pw - pn.w) / 2;
      for (const it of pn.items) {
        it.box.draw(svg, xx, top + (pn.h - it.box.h) / 2, hits);
        xx += it.box.w + pn.gap;
      }
    }
    if (pn.caption) svg.label(pn.caption, x + pw / 2, capY, size, '#000', 'text');
  }

  const pad = num(o.padding, Math.round(size * 0.6));
  const W = Math.ceil(width + pad * 2);
  const H = Math.ceil(height + pad * 2);
  const bg = o.background || conf.background;
  const out = svg.toString({ width: W, height: H, background: bg === 'transparent' ? null : bg, padding: pad, source: embedSource ? source : null });
  hits.forEach((h) => { h.x += pad; h.y += pad; h.ox += pad; h.oy += pad; });
  return { svg: out, width: W, height: H, errors: errors.sort((a, b) => a.line - b.line), hits, empty: !fig.blocks.length };
}
