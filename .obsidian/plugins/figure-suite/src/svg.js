/*
 * Figure Suite — SVG writer and drawing primitives.
 *
 * Everything is emitted as a string so the same code runs in the preview,
 * the exporters and Node tests.
 */

const COLORS = {
  white: { fill: '#ffffff', text: '#000000' },
  none: { fill: 'none', text: '#000000' },
  light: { fill: '#e6e6e6', text: '#000000' },
  shade: { fill: '#d0d0d0', text: '#000000' },
  gray: { fill: '#a8a8a8', text: '#000000' },
  grey: { fill: '#a8a8a8', text: '#000000' },
  dark: { fill: '#555555', text: '#ffffff' },
  black: { fill: '#000000', text: '#ffffff' },
  red: { fill: '#c8202f', text: '#ffffff' },
  pink: { fill: '#f6c9cd', text: '#000000' },
  blue: { fill: '#2f6db5', text: '#ffffff' },
  lightblue: { fill: '#c9dcf2', text: '#000000' },
  green: { fill: '#2e8b57', text: '#ffffff' },
  lightgreen: { fill: '#cdebd6', text: '#000000' },
  yellow: { fill: '#f7e08a', text: '#000000' },
  orange: { fill: '#f0a04b', text: '#000000' },
  tan: { fill: '#e9dcc0', text: '#000000' },
  purple: { fill: '#7b55a8', text: '#ffffff' },
};
const STROKES = {
  black: '#000000', gray: '#8c8c8c', grey: '#8c8c8c', light: '#bdbdbd', red: '#c8202f', blue: '#2f6db5', green: '#2e8b57', orange: '#e07b1a', purple: '#7b55a8', white: '#ffffff',
};

/** Resolve a colour word or #hex into { fill, text }. */
function colorOf(name, fallback = 'white') {
  if (!name) return COLORS[fallback] || COLORS.white;
  if (COLORS[name]) return COLORS[name];
  if (/^#[0-9a-f]{3,8}$/i.test(name)) return { fill: name, text: luminance(name) < 0.45 ? '#ffffff' : '#000000' };
  return COLORS[fallback] || COLORS.white;
}

function strokeOf(name, fallback = '#000000') {
  if (!name) return fallback;
  if (STROKES[name]) return STROKES[name];
  if (COLORS[name]) return COLORS[name].fill;
  if (/^#[0-9a-f]{3,8}$/i.test(name)) return name;
  return fallback;
}

function luminance(hex) {
  let h = hex.slice(1);
  if (h.length <= 4) h = [...h].map((c) => c + c).join('');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const n2 = (v) => {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
};

class SVG {
  constructor() {
    this.parts = [];
    this.glyphs = new Map(); // id -> d
  }

  push(s) { this.parts.push(s); }

  /** Typeset label box drawn with its baseline-left at (x, y), em = size px. */
  box(box, x, y, size, color = '#000000') {
    if (!box || !box.items.length) return;
    const out = [`<g transform="translate(${n2(x)} ${n2(y)}) scale(${n2(size * 1000) / 1000})" fill="${color}">`];
    for (const it of box.items) {
      if (it.k === 'g') {
        const id = `fs${it.f}${it.gid}`;
        if (!this.glyphs.has(id)) this.glyphs.set(id, FS.fonts[it.f].path(it.gid));
        const t = it.s === 1 ? `x="${r4(it.x)}" y="${r4(it.y)}"` : `transform="translate(${r4(it.x)} ${r4(it.y)}) scale(${r4(it.s)})"`;
        out.push(`<use href="#${id}" ${t}/>`);
      } else if (it.k === 'p') {
        const tr = `translate(${r4(it.x)} ${r4(it.y)})${it.s !== 1 ? ` scale(${r4(it.s)})` : ''}`;
        const sw = it.dots ? 0.11 : it.sw;
        out.push(`<path d="${it.d}" transform="${tr}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`);
      } else if (it.k === 'l') {
        out.push(`<line x1="${r4(it.x)}" y1="${r4(it.y)}" x2="${r4(it.x2)}" y2="${r4(it.y2)}" stroke="${color}" stroke-width="${r4(it.sw)}"/>`);
      } else if (it.k === 't') {
        out.push(`<text x="${r4(it.x)}" y="${r4(it.y)}" font-size="${r4(it.s)}" font-family="'Times New Roman', 'Songti SC', serif"${it.it ? ' font-style="italic"' : ''}${it.bold ? ' font-weight="bold"' : ''}>${esc(it.text)}</text>`);
      }
    }
    out.push('</g>');
    this.parts.push(out.join(''));
  }

  /**
   * Draw a label centred on (cx, cy). The vertical centre is the ink centre,
   * so digits and letters sit visually centred in circles and cells.
   */
  label(text, cx, cy, size, color = '#000000', mode = 'math') {
    const b = typeset(text, mode);
    if (b.empty) return b;
    const x = cx - (b.w * size) / 2;
    const y = cy + ((b.asc - b.desc) / 2) * size;
    this.box(b, x, y, size, color);
    return b;
  }

  toString({ width, height, background, padding = 0, source }) {
    const defs = [...this.glyphs].map(([id, d]) => `<path id="${id}" d="${d}"/>`).join('');
    const bg = background && background !== 'transparent' ? `<rect x="0" y="0" width="${n2(width)}" height="${n2(height)}" fill="${background}"/>` : '';
    const meta = source != null ? `<metadata id="figure-suite-source">${esc(source)}</metadata>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${n2(width)}" height="${n2(height)}" viewBox="0 0 ${n2(width)} ${n2(height)}">${meta}<defs>${defs}</defs>${bg}<g transform="translate(${n2(padding)} ${n2(padding)})">${this.parts.join('')}</g></svg>`;
  }
}

const r4 = (v) => {
  const r = Math.round(v * 10000) / 10000;
  return Object.is(r, -0) ? '0' : String(r);
};

/* ---------------- primitives ---------------- */

/** Label size helpers (em → px) for a given box. */
const labelSize = (text, size, mode = 'math') => {
  const b = typeset(text, mode);
  return { w: b.w * size, h: (b.asc + b.desc) * size, asc: b.asc * size, desc: b.desc * size, empty: b.empty };
};

/** Arrow head polygon at (x, y) pointing along angle a. CLRS-style slim filled head. */
function arrowHead(x, y, a, size = 1, color = '#000000') {
  const len = 9 * size;
  const half = 3.2 * size;
  const bx = x - len * Math.cos(a);
  const by = y - len * Math.sin(a);
  const nx = -Math.sin(a);
  const ny = Math.cos(a);
  const back = 0.82; // slight notch
  const mx = x - len * back * Math.cos(a);
  const my = y - len * back * Math.sin(a);
  return `<path d="M${n2(x)} ${n2(y)}L${n2(bx + nx * half)} ${n2(by + ny * half)}L${n2(mx)} ${n2(my)}L${n2(bx - nx * half)} ${n2(by - ny * half)}Z" fill="${color}"/>`;
}

const headLen = (size = 1) => 9 * size * 0.8;

/**
 * Line / quadratic curve with optional arrow heads.
 * opts: { width, color, dash, start, end (bools for heads), bend (px, signed), headSize }
 * Returns { mid: [x,y], normal: [nx,ny], angle } for label placement.
 */
function connector(svg, x1, y1, x2, y2, opts = {}) {
  const color = opts.color || '#000000';
  const width = opts.width || 1;
  const hs = opts.headSize || 1;
  const bend = opts.bend || 0;
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  let d;
  let a1;
  let a2;
  let mid;
  const cut = headLen(hs);
  if (bend) {
    const cx = (x1 + x2) / 2 + nx * bend * 2;
    const cy = (y1 + y2) / 2 + ny * bend * 2;
    a1 = Math.atan2(y1 - cy, x1 - cx);
    a2 = Math.atan2(y2 - cy, x2 - cx);
    const sx = opts.start ? x1 - cut * Math.cos(a1) : x1;
    const sy = opts.start ? y1 - cut * Math.sin(a1) : y1;
    const ex = opts.end ? x2 - cut * Math.cos(a2) : x2;
    const ey = opts.end ? y2 - cut * Math.sin(a2) : y2;
    d = `M${n2(sx)} ${n2(sy)}Q${n2(cx)} ${n2(cy)} ${n2(ex)} ${n2(ey)}`;
    mid = [(x1 + 2 * cx + x2) / 4, (y1 + 2 * cy + y2) / 4];
  } else {
    a2 = Math.atan2(dy, dx);
    a1 = a2 + Math.PI;
    const sx = opts.start ? x1 + cut * Math.cos(a2) : x1;
    const sy = opts.start ? y1 + cut * Math.sin(a2) : y1;
    const ex = opts.end ? x2 - cut * Math.cos(a2) : x2;
    const ey = opts.end ? y2 - cut * Math.sin(a2) : y2;
    d = `M${n2(sx)} ${n2(sy)}L${n2(ex)} ${n2(ey)}`;
    mid = [(x1 + x2) / 2, (y1 + y2) / 2];
  }
  svg.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${n2(width)}"${dash} stroke-linecap="${opts.dash ? 'butt' : 'round'}"/>`);
  if (opts.end) svg.push(arrowHead(x2, y2, a2, hs, color));
  if (opts.start) svg.push(arrowHead(x1, y1, a1, hs, color));
  return { mid, normal: [nx, ny], angle: Math.atan2(dy, dx) };
}

/** Polyline path with optional end head (used for pointer arrows with elbows). */
function polyArrow(svg, pts, opts = {}) {
  const color = opts.color || '#000000';
  const width = opts.width || 1;
  const cut = headLen(opts.headSize || 1);
  const p = pts.map((q) => q.slice());
  const n = p.length;
  const a = Math.atan2(p[n - 1][1] - p[n - 2][1], p[n - 1][0] - p[n - 2][0]);
  const tip = p[n - 1].slice();
  if (opts.end !== false) { p[n - 1][0] -= cut * Math.cos(a); p[n - 1][1] -= cut * Math.sin(a); }
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  svg.push(`<path d="M${p.map((q) => `${n2(q[0])} ${n2(q[1])}`).join('L')}" fill="none" stroke="${color}" stroke-width="${n2(width)}"${dash} stroke-linejoin="round"/>`);
  if (opts.end !== false) svg.push(arrowHead(tip[0], tip[1], a, opts.headSize || 1, color));
}

function rect(svg, x, y, w, h, fill, opts = {}) {
  const stroke = opts.stroke === undefined ? '#000000' : opts.stroke;
  const sw = opts.width || 1;
  const rx = opts.rx ? ` rx="${n2(opts.rx)}"` : '';
  svg.push(`<rect x="${n2(x)}" y="${n2(y)}" width="${n2(w)}" height="${n2(h)}"${rx} fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${n2(sw)}"` : ''}/>`);
}

function line(svg, x1, y1, x2, y2, opts = {}) {
  const dash = opts.dash ? ` stroke-dasharray="${opts.dash}"` : '';
  svg.push(`<line x1="${n2(x1)}" y1="${n2(y1)}" x2="${n2(x2)}" y2="${n2(y2)}" stroke="${opts.color || '#000000'}" stroke-width="${n2(opts.width || 1)}"${dash}${opts.cap ? ` stroke-linecap="${opts.cap}"` : ''}/>`);
}

/** Curly/square brace spanning x1..x2 at y, opening toward dir (+1 down, -1 up). */
function brace(svg, x1, x2, y, dir = 1, opts = {}) {
  const h = 6 * dir;
  const m = (x1 + x2) / 2;
  const color = opts.color || '#000000';
  let d;
  if (opts.square) d = `M${n2(x1)} ${n2(y)}V${n2(y + h)}H${n2(x2)}V${n2(y)}`;
  else {
    const q = Math.min(8, (x2 - x1) / 4);
    d = `M${n2(x1)} ${n2(y)}Q${n2(x1)} ${n2(y + h)} ${n2(x1 + q)} ${n2(y + h)}H${n2(m - q)}Q${n2(m)} ${n2(y + h)} ${n2(m)} ${n2(y + 2 * h)}Q${n2(m)} ${n2(y + h)} ${n2(m + q)} ${n2(y + h)}H${n2(x2 - q)}Q${n2(x2)} ${n2(y + h)} ${n2(x2)} ${n2(y)}`;
  }
  svg.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="${n2(opts.width || 1)}"/>`);
  return y + (opts.square ? h : 2 * h);
}
