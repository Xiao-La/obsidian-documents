/*
 * Figure Suite — generated bundle. Edit files in src/ and run build.py.
 */

const {
  Plugin,
  Modal,
  FuzzySuggestModal,
  Notice,
  MarkdownView,
  TFile,
  PluginSettingTab,
  Setting,
  setIcon,
  normalizePath,
  getLinkpath,
} = require('obsidian');

/*
 * Figure Suite — minimal TrueType reader.
 *
 * Reads cmap / hmtx / loca / glyf straight from the bundled Computer Modern
 * fonts so every label is measured and drawn from the real outlines: preview,
 * SVG and PNG come out identical and no font has to be installed or embedded.
 */

class TTFont {
  constructor(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    this.tables = {};
    const count = this.view.getUint16(4);
    for (let i = 0; i < count; i++) {
      const rec = 12 + i * 16;
      const tag = String.fromCharCode(...[0, 1, 2, 3].map((k) => this.view.getUint8(rec + k)));
      this.tables[tag] = { offset: this.view.getUint32(rec + 8), length: this.view.getUint32(rec + 12) };
    }
    const v = this.view;
    const head = this.tables.head.offset;
    this.unitsPerEm = v.getUint16(head + 18);
    this.locFormat = v.getInt16(head + 50);
    const hhea = this.tables.hhea.offset;
    this.ascender = v.getInt16(hhea + 4);
    this.descender = v.getInt16(hhea + 6);
    this.numHMetrics = v.getUint16(hhea + 34);
    this.numGlyphs = v.getUint16(this.tables.maxp.offset + 4);
    this.cmap = this.readCmap();
    this.pathCache = new Map();
  }

  readCmap() {
    const v = this.view;
    const base = this.tables.cmap.offset;
    const n = v.getUint16(base + 2);
    let best = null;
    for (let i = 0; i < n; i++) {
      const platform = v.getUint16(base + 4 + i * 8);
      const encoding = v.getUint16(base + 6 + i * 8);
      const offset = base + v.getUint32(base + 8 + i * 8);
      const format = v.getUint16(offset);
      const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
      if (!unicode) continue;
      if (format === 12 && (!best || best.format !== 12)) best = { format, offset };
      else if (format === 4 && !best) best = { format, offset };
    }
    const map = new Map();
    if (!best) return map;
    const o = best.offset;
    if (best.format === 4) {
      const segX2 = v.getUint16(o + 6);
      const ends = o + 14;
      const starts = ends + segX2 + 2;
      const deltas = starts + segX2;
      const ranges = deltas + segX2;
      for (let s = 0; s < segX2 / 2; s++) {
        const end = v.getUint16(ends + s * 2);
        const start = v.getUint16(starts + s * 2);
        const delta = v.getInt16(deltas + s * 2);
        const rangeOffset = v.getUint16(ranges + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let g;
          if (rangeOffset === 0) g = (c + delta) & 0xffff;
          else {
            const at = ranges + s * 2 + rangeOffset + (c - start) * 2;
            g = v.getUint16(at);
            if (g) g = (g + delta) & 0xffff;
          }
          if (g) map.set(c, g);
        }
      }
    } else {
      const groups = v.getUint32(o + 12);
      for (let i = 0; i < groups; i++) {
        const start = v.getUint32(o + 16 + i * 12);
        const end = v.getUint32(o + 20 + i * 12);
        const glyph = v.getUint32(o + 24 + i * 12);
        for (let c = start; c <= end; c++) map.set(c, glyph + c - start);
      }
    }
    return map;
  }

  glyphId(codePoint) {
    return this.cmap.get(codePoint) || 0;
  }

  has(codePoint) {
    return this.cmap.has(codePoint);
  }

  /** Advance width in em. */
  advance(glyph) {
    const hmtx = this.tables.hmtx.offset;
    const i = Math.min(glyph, this.numHMetrics - 1);
    return this.view.getUint16(hmtx + i * 4) / this.unitsPerEm;
  }

  glyphRange(glyph) {
    const loca = this.tables.loca.offset;
    const v = this.view;
    if (this.locFormat === 0) return [v.getUint16(loca + glyph * 2) * 2, v.getUint16(loca + glyph * 2 + 2) * 2];
    return [v.getUint32(loca + glyph * 4), v.getUint32(loca + glyph * 4 + 4)];
  }

  /** Ink box in em, y up: [xMin, yMin, xMax, yMax] (zeros for empty glyphs). */
  bbox(glyph) {
    const [start, end] = this.glyphRange(glyph);
    if (end <= start) return [0, 0, 0, 0];
    const o = this.tables.glyf.offset + start;
    const u = this.unitsPerEm;
    const v = this.view;
    return [v.getInt16(o + 2) / u, v.getInt16(o + 4) / u, v.getInt16(o + 6) / u, v.getInt16(o + 8) / u];
  }

  /** Contours as arrays of { x, y, on } in font units. */
  contours(glyph, depth = 0) {
    const [start, end] = this.glyphRange(glyph);
    if (end <= start || depth > 8) return [];
    const v = this.view;
    const o = this.tables.glyf.offset + start;
    const nContours = v.getInt16(o);
    if (nContours >= 0) return this.simpleContours(o, nContours);
    // composite
    const out = [];
    let p = o + 10;
    for (;;) {
      const flags = v.getUint16(p);
      const component = v.getUint16(p + 2);
      p += 4;
      let dx;
      let dy;
      if (flags & 1) { dx = v.getInt16(p); dy = v.getInt16(p + 2); p += 4; } else { dx = v.getInt8(p); dy = v.getInt8(p + 1); p += 2; }
      let a = 1; let b = 0; let c = 0; let d = 1;
      const f2 = (at) => v.getInt16(at) / 16384;
      if (flags & 8) { a = d = f2(p); p += 2; } else if (flags & 0x40) { a = f2(p); d = f2(p + 2); p += 4; } else if (flags & 0x80) {
        a = f2(p); b = f2(p + 2); c = f2(p + 4); d = f2(p + 6); p += 8;
      }
      if (!(flags & 2)) { dx = 0; dy = 0; } // point matching: not used by CM
      for (const contour of this.contours(component, depth + 1)) {
        out.push(contour.map((pt) => ({ x: a * pt.x + c * pt.y + dx, y: b * pt.x + d * pt.y + dy, on: pt.on })));
      }
      if (!(flags & 0x20)) break;
    }
    return out;
  }

  simpleContours(o, n) {
    const v = this.view;
    const ends = [];
    for (let i = 0; i < n; i++) ends.push(v.getUint16(o + 10 + i * 2));
    const total = n ? ends[n - 1] + 1 : 0;
    let p = o + 10 + n * 2;
    p += 2 + v.getUint16(p);
    const flags = [];
    while (flags.length < total) {
      const f = v.getUint8(p++);
      flags.push(f);
      if (f & 8) {
        let r = v.getUint8(p++);
        while (r-- > 0) flags.push(f);
      }
    }
    const xs = [];
    let x = 0;
    for (const f of flags) {
      if (f & 2) { const dx = v.getUint8(p++); x += f & 16 ? dx : -dx; } else if (!(f & 16)) { x += v.getInt16(p); p += 2; }
      xs.push(x);
    }
    const ys = [];
    let y = 0;
    for (const f of flags) {
      if (f & 4) { const dy = v.getUint8(p++); y += f & 32 ? dy : -dy; } else if (!(f & 32)) { y += v.getInt16(p); p += 2; }
      ys.push(y);
    }
    const out = [];
    let s = 0;
    for (const e of ends) {
      const contour = [];
      for (let i = s; i <= e; i++) contour.push({ x: xs[i], y: ys[i], on: !!(flags[i] & 1) });
      out.push(contour);
      s = e + 1;
    }
    return out;
  }

  /** SVG path for a glyph in em units, y pointing down, baseline at 0. */
  path(glyph) {
    if (this.pathCache.has(glyph)) return this.pathCache.get(glyph);
    const u = this.unitsPerEm;
    const r = (n) => Math.round(n / u * 10000) / 10000;
    const P = (pt) => `${r(pt.x)} ${r(-pt.y)}`;
    let d = '';
    for (const contour of this.contours(glyph)) {
      if (!contour.length) continue;
      // start on an on-curve point (synthesise one if none)
      let first = contour.findIndex((pt) => pt.on);
      let pts;
      if (first < 0) {
        const a = contour[0];
        const b = contour[contour.length - 1];
        pts = [{ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, on: true }, ...contour];
        first = 0;
      } else pts = contour.slice(first).concat(contour.slice(0, first));
      d += `M${P(pts[0])}`;
      let i = 1;
      const n = pts.length;
      while (i <= n) {
        const cur = pts[i % n];
        if (cur.on) { d += `L${P(cur)}`; i++; continue; }
        const next = pts[(i + 1) % n];
        const end = next.on ? next : { x: (cur.x + next.x) / 2, y: (cur.y + next.y) / 2 };
        d += `Q${P(cur)} ${P(end)}`;
        i += next.on ? 2 : 1;
      }
      d += 'Z';
    }
    this.pathCache.set(glyph, d);
    return d;
  }
}

/*
 * Figure Suite — label typesetting ("TeX lite").
 *
 * A label is math by default: letters italic, digits upright, `_` / `^`
 * scripts, Greek and common symbols via backslash commands, `\frac`, `\sqrt`.
 * `"..."` or `\text{...}` switch to upright text. `\\` breaks lines.
 *
 * Output is a box { w, asc, desc, items } in em units (baseline at y = 0,
 * y pointing down); items are glyph references into the bundled fonts or
 * stroked symbol paths, so rendering never depends on installed fonts.
 */

const FS = {
  fonts: null, // { r, i, b } TTFont instances
};

/* ---------------- stroked symbols (glyphs the CM text fonts lack) ---------------- */

const AXIS = -0.25;
const arrowPath = (x1, y1, x2, y2, head = 0.17) => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h1 = [x2 - head * Math.cos(a - 0.55), y2 - head * Math.sin(a - 0.55)];
  const h2 = [x2 - head * Math.cos(a + 0.55), y2 - head * Math.sin(a + 0.55)];
  const r = (n) => Math.round(n * 1000) / 1000;
  return `M${r(x1)} ${r(y1)}L${r(x2)} ${r(y2)}M${r(h1[0])} ${r(h1[1])}L${r(x2)} ${r(y2)}L${r(h2[0])} ${r(h2[1])}`;
};
const A = AXIS;
const SYMBOLS = {
  '−': { w: 0.778, d: `M0.083 ${A}H0.694`, ink: [A - 0.02, A + 0.02] },
  '×': { w: 0.778, d: `M0.22 ${A - 0.17}L0.56 ${A + 0.17}M0.22 ${A + 0.17}L0.56 ${A - 0.17}`, ink: [A - 0.18, A + 0.18] },
  '≤': { w: 0.778, d: `M0.67 -0.58L0.11 -0.35L0.67 -0.12M0.11 0.03H0.67`, ink: [-0.6, 0.05] },
  '≥': { w: 0.778, d: `M0.11 -0.58L0.67 -0.35L0.11 -0.12M0.11 0.03H0.67`, ink: [-0.6, 0.05] },
  '≠': { w: 0.778, d: `M0.083 ${A - 0.117}H0.694M0.083 ${A + 0.117}H0.694M0.27 0.04L0.51 -0.54`, ink: [-0.56, 0.06] },
  '≡': { w: 0.778, d: `M0.083 ${A - 0.19}H0.694M0.083 ${A}H0.694M0.083 ${A + 0.19}H0.694`, ink: [A - 0.21, A + 0.21] },
  '∼': { w: 0.778, d: `M0.083 ${A + 0.04}C0.2 ${A - 0.14} 0.32 ${A - 0.1} 0.39 ${A}S0.58 ${A + 0.14} 0.694 ${A - 0.04}`, ink: [A - 0.1, A + 0.1] },
  '≈': { w: 0.778, d: `M0.083 ${A - 0.06}C0.2 ${A - 0.24} 0.32 ${A - 0.2} 0.39 ${A - 0.1}S0.58 ${A + 0.04} 0.694 ${A - 0.14}M0.083 ${A + 0.14}C0.2 ${A - 0.04} 0.32 ${A} 0.39 ${A + 0.1}S0.58 ${A + 0.24} 0.694 ${A + 0.06}`, ink: [A - 0.2, A + 0.2] },
  '←': { w: 1.0, d: arrowPath(0.917, A, 0.083, A), ink: [A - 0.12, A + 0.12] },
  '→': { w: 1.0, d: arrowPath(0.083, A, 0.917, A), ink: [A - 0.12, A + 0.12] },
  '↔': { w: 1.0, d: `${arrowPath(0.5, A, 0.083, A)}${arrowPath(0.5, A, 0.917, A)}`, ink: [A - 0.12, A + 0.12] },
  '↑': { w: 0.5, d: arrowPath(0.25, 0.19, 0.25, -0.69), ink: [-0.7, 0.2] },
  '↓': { w: 0.5, d: arrowPath(0.25, -0.69, 0.25, 0.19), ink: [-0.7, 0.2] },
  '↖': { w: 1.0, d: arrowPath(0.85, 0.17, 0.15, -0.67), ink: [-0.69, 0.19] },
  '↗': { w: 1.0, d: arrowPath(0.15, 0.17, 0.85, -0.67), ink: [-0.69, 0.19] },
  '↘': { w: 1.0, d: arrowPath(0.15, -0.67, 0.85, 0.17), ink: [-0.69, 0.19] },
  '↙': { w: 1.0, d: arrowPath(0.85, -0.67, 0.15, 0.17), ink: [-0.69, 0.19] },
  '⇒': { w: 1.0, d: `M0.083 ${A - 0.09}H0.82M0.083 ${A + 0.09}H0.82M0.72 ${A - 0.23}L0.917 ${A}L0.72 ${A + 0.23}`, ink: [A - 0.24, A + 0.24] },
  '⇔': { w: 1.0, d: `M0.18 ${A - 0.09}H0.82M0.18 ${A + 0.09}H0.82M0.72 ${A - 0.23}L0.917 ${A}L0.72 ${A + 0.23}M0.28 ${A - 0.23}L0.083 ${A}L0.28 ${A + 0.23}`, ink: [A - 0.24, A + 0.24] },
  '↦': { w: 1.0, d: `${arrowPath(0.083, A, 0.917, A)}M0.083 ${A - 0.12}V${A + 0.12}`, ink: [A - 0.12, A + 0.12] },
  '∞': { w: 1.0, d: `M0.5 ${A}C0.42 ${A - 0.15} 0.12 ${A - 0.18} 0.12 ${A}C0.12 ${A + 0.18} 0.42 ${A + 0.15} 0.5 ${A}C0.58 ${A - 0.15} 0.88 ${A - 0.18} 0.88 ${A}C0.88 ${A + 0.18} 0.58 ${A + 0.15} 0.5 ${A}Z`, ink: [A - 0.15, A + 0.15] },
  '∅': { w: 0.5, d: `M0.25 -0.69A0.2 0.36 0 1 0 0.25 0.02A0.2 0.36 0 1 0 0.25 -0.69ZM0.07 0.1L0.43 -0.77`, ink: [-0.77, 0.1] },
  '∈': { w: 0.667, d: `M0.583 ${A - 0.25}H0.333A0.25 0.25 0 0 0 0.333 ${A + 0.25}H0.583M0.083 ${A}H0.583`, ink: [A - 0.26, A + 0.26] },
  '∉': { w: 0.667, d: `M0.583 ${A - 0.25}H0.333A0.25 0.25 0 0 0 0.333 ${A + 0.25}H0.583M0.083 ${A}H0.583M0.22 0.1L0.45 -0.6`, ink: [-0.6, 0.1] },
  '⊂': { w: 0.778, d: `M0.694 ${A - 0.25}H0.333A0.25 0.25 0 0 0 0.333 ${A + 0.25}H0.694`, ink: [A - 0.26, A + 0.26] },
  '⊆': { w: 0.778, d: `M0.694 ${A - 0.3}H0.333A0.22 0.22 0 0 0 0.333 ${A + 0.14}H0.694M0.11 ${A + 0.3}H0.694`, ink: [A - 0.31, A + 0.31] },
  '∪': { w: 0.667, d: 'M0.111 -0.65V-0.25A0.222 0.222 0 0 0 0.555 -0.25V-0.65', ink: [-0.65, 0] },
  '∩': { w: 0.667, d: 'M0.111 0V-0.4A0.222 0.222 0 0 1 0.555 -0.4V0', ink: [-0.65, 0] },
  '∧': { w: 0.667, d: 'M0.111 0L0.333 -0.6L0.555 0', ink: [-0.6, 0] },
  '∨': { w: 0.667, d: 'M0.111 -0.6L0.333 0L0.555 -0.6', ink: [-0.6, 0] },
  '∘': { w: 0.5, d: `M0.25 ${A - 0.11}A0.11 0.11 0 1 0 0.25 ${A + 0.11}A0.11 0.11 0 1 0 0.25 ${A - 0.11}Z`, ink: [A - 0.12, A + 0.12] },
  '⌈': { w: 0.444, d: 'M0.36 -0.75H0.14V0.25', ink: [-0.75, 0.25] },
  '⌉': { w: 0.444, d: 'M0.08 -0.75H0.3V0.25', ink: [-0.75, 0.25] },
  '⌊': { w: 0.444, d: 'M0.14 -0.75V0.25H0.36', ink: [-0.75, 0.25] },
  '⌋': { w: 0.444, d: 'M0.3 -0.75V0.25H0.08', ink: [-0.75, 0.25] },
  '⟨': { w: 0.389, d: 'M0.31 -0.75L0.1 -0.25L0.31 0.25', ink: [-0.75, 0.25] },
  '⟩': { w: 0.389, d: 'M0.08 -0.75L0.29 -0.25L0.08 0.25', ink: [-0.75, 0.25] },
  '′': { w: 0.28, d: 'M0.2 -0.72L0.1 -0.44', ink: [-0.72, -0.44] },
  '∀': { w: 0.556, d: 'M0.06 -0.69L0.28 0L0.5 -0.69M0.14 -0.36H0.42', ink: [-0.69, 0] },
  '∃': { w: 0.556, d: 'M0.08 -0.69H0.47V0H0.08M0.16 -0.345H0.47', ink: [-0.69, 0] },
  '∇': { w: 0.833, d: 'M0.08 -0.68H0.75L0.415 0Z', ink: [-0.68, 0] },
  '∑': { w: 1.0, d: 'M0.86 -0.62V-0.75H0.12L0.5 -0.25L0.12 0.25H0.86V0.12', ink: [-0.75, 0.25] },
  '∏': { w: 0.9, d: 'M0.08 -0.75H0.82M0.22 -0.75V0.25M0.68 -0.75V0.25', ink: [-0.75, 0.25] },
  '⊥': { w: 0.778, d: 'M0.389 -0.68V0M0.083 0H0.694', ink: [-0.68, 0] },
  '∣': { w: 0.278, d: 'M0.139 -0.75V0.25', ink: [-0.75, 0.25] },
  '∥': { w: 0.5, d: 'M0.17 -0.75V0.25M0.33 -0.75V0.25', ink: [-0.75, 0.25] },
  '⋯': { w: 1.17, d: `M0.2 ${A}h0.001M0.585 ${A}h0.001M0.97 ${A}h0.001`, ink: [A - 0.05, A + 0.05], dots: true },
  '⋮': { w: 0.3, d: 'M0.15 -0.72h0.001M0.15 -0.4h0.001M0.15 -0.08h0.001', ink: [-0.77, -0.03], dots: true },
  '⋱': { w: 1.0, d: 'M0.2 -0.68h0.001M0.5 -0.38h0.001M0.8 -0.08h0.001', ink: [-0.73, -0.03], dots: true },
  '□': { w: 0.778, d: 'M0.11 -0.65H0.67V0H0.11Z', ink: [-0.65, 0] },
};

const COMMANDS = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ϵ', varepsilon: 'ε', zeta: 'ζ', eta: 'η', theta: 'θ',
  vartheta: 'ϑ', iota: 'ι', kappa: 'κ', lambda: 'λ', mu: 'μ', nu: 'ν', xi: 'ξ', pi: 'π', varpi: 'ϖ', rho: 'ρ',
  sigma: 'σ', varsigma: 'ς', tau: 'τ', upsilon: 'υ', phi: 'ϕ', varphi: 'φ', chi: 'χ', psi: 'ψ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Xi: 'Ξ', Pi: 'Π', Sigma: 'Σ', Upsilon: 'Υ', Phi: 'Φ', Psi: 'Ψ', Omega: 'Ω',
  infty: '∞', le: '≤', leq: '≤', ge: '≥', geq: '≥', ne: '≠', neq: '≠', equiv: '≡', sim: '∼', approx: '≈',
  gets: '←', leftarrow: '←', to: '→', rightarrow: '→', leftrightarrow: '↔', uparrow: '↑', downarrow: '↓',
  nwarrow: '↖', nearrow: '↗', searrow: '↘', swarrow: '↙', Rightarrow: '⇒', implies: '⇒', Leftrightarrow: '⇔', iff: '⇔', mapsto: '↦',
  emptyset: '∅', varnothing: '∅', in: '∈', notin: '∉', subset: '⊂', subseteq: '⊆', cup: '∪', cap: '∩',
  land: '∧', wedge: '∧', lor: '∨', vee: '∨', lnot: '¬', neg: '¬', circ: '∘', cdot: '·', times: '×', pm: '±', div: '÷',
  lceil: '⌈', rceil: '⌉', lfloor: '⌊', rfloor: '⌋', langle: '⟨', rangle: '⟩', prime: '′', forall: '∀', exists: '∃',
  nabla: '∇', sum: '∑', prod: '∏', perp: '⊥', mid: '∣', parallel: '∥', cdots: '⋯', ldots: '…', dots: '…', vdots: '⋮', ddots: '⋱',
  lbrace: '{', rbrace: '}', backslash: '\\', '{': '{', '}': '}', '%': '%', '#': '#', '&': '&', $: '$', _: '_', square: '□', star: '∗', ast: '∗',
  colon: ':', vert: '|', lvert: '|', rvert: '|', S: '§', deg: '°',
};
const OPERATOR_NAMES = new Set(['log', 'lg', 'ln', 'min', 'max', 'exp', 'sin', 'cos', 'tan', 'mod', 'gcd', 'lim', 'det', 'deg', 'Pr', 'argmin', 'argmax', 'sup', 'inf', 'poly', 'polylog', 'rank', 'dim', 'ker']);
const SPACES = { ',': 0.167, ':': 0.222, '>': 0.222, ';': 0.278, ' ': 0.333, quad: 1, qquad: 2, '!': -0.167, enspace: 0.5 };
const BIN = new Set(['+', '−', '×', '·', '∪', '∩', '∧', '∨', '∘', '±', '÷', '∗']);
const REL = new Set(['=', '<', '>', '≤', '≥', '≠', '≡', '∼', '≈', '←', '→', '↔', '⇒', '⇔', '↦', '∈', '∉', '⊂', '⊆', '∣']);
const OPEN = new Set(['(', '[', '{', '⌈', '⌊', '⟨', '|']);

/* ---------------- parsing ---------------- */

/**
 * Atoms:
 *  { t: 'c', ch, st }               st: 'i' italic, 'r' roman, 'b' bold, 'sc' small caps
 *  { t: 'sp', w }                   explicit space (em)
 *  { t: 'g', a: [...] }             group
 *  { t: 's', base, sub, sup }       scripts
 *  { t: 'frac', num, den } / { t: 'sqrt', a }
 */
function parseLabel(src, mode = 'math') {
  const s = String(src);
  let i = 0;

  const readArg = (m, st) => {
    while (s[i] === ' ') i++;
    if (s[i] === '{') { i++; return list(m, '}', st); }
    if (s[i] === '\\') { const out = []; command(out, m, st); return out; }
    if (i < s.length) { const ch = s[i++]; return [charAtom(ch, m, st)]; }
    return [];
  };

  const charAtom = (ch, m, st) => {
    if (m === 'math' && !st) {
      if (/[A-Za-z]/.test(ch)) return { t: 'c', ch, st: 'i' };
      if (/[α-ωϵϑϖϕς]/.test(ch)) return { t: 'c', ch, st: 'i' };
      if (ch === '-') return { t: 'c', ch: '−', st: 'r' };
      if (ch === '*') return { t: 'c', ch: '∗', st: 'r' };
      if (ch === "'") return { t: 'c', ch: '′', st: 'r', prime: true };
      return { t: 'c', ch, st: 'r' };
    }
    return { t: 'c', ch, st: st || 'r' };
  };

  const textRun = (out, text, st) => {
    for (const ch of text) out.push(ch === ' ' ? { t: 'sp', w: 0.333 } : { t: 'c', ch, st });
  };

  function command(out, m, st) {
    i++; // backslash
    let name;
    if (/[A-Za-z]/.test(s[i] || '')) {
      const start = i;
      while (/[A-Za-z]/.test(s[i] || '')) i++;
      name = s.slice(start, i);
    } else name = s[i++] || '';
    if (name in SPACES) { out.push({ t: 'sp', w: SPACES[name] }); return; }
    if (/^(text|textrm|mathrm|textup|operatorname|mbox|textnormal)$/.test(name)) { out.push({ t: 'g', a: readArg(name === 'mathrm' ? 'math' : 'text', 'r') }); return; }
    if (/^(textit|mathit|emph)$/.test(name)) { out.push({ t: 'g', a: readArg(name === 'mathit' ? 'math' : 'text', 'i') }); return; }
    if (/^(textbf|mathbf|bm|boldsymbol)$/.test(name)) { out.push({ t: 'g', a: readArg(name === 'textbf' ? 'text' : 'math', 'b') }); return; }
    if (/^(textsc|mathsc)$/.test(name)) { out.push({ t: 'g', a: readArg('text', 'sc') }); return; }
    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') { const num = readArg(m, st); const den = readArg(m, st); out.push({ t: 'frac', num, den }); return; }
    if (name === 'sqrt') { out.push({ t: 'sqrt', a: readArg(m, st) }); return; }
    if (name === 'overline' || name === 'bar') { out.push({ t: 'over', a: readArg(m, st) }); return; }
    if (name === 'left' || name === 'right' || name === 'big' || name === 'Big' || name === 'bigl' || name === 'bigr') return;
    if (OPERATOR_NAMES.has(name)) { const g = []; textRun(g, name, 'r'); out.push({ t: 'g', a: g, op: true }); return; }
    if (name in COMMANDS) {
      const ch = COMMANDS[name];
      const italic = m === 'math' && !st && /[α-ωϵϑϖϕς]/.test(ch);
      out.push({ t: 'c', ch, st: italic ? 'i' : (st === 'b' ? 'b' : 'r') });
      return;
    }
    textRun(out, `\\${name}`, 'r');
  }

  function list(m, stop, st) {
    const out = [];
    while (i < s.length) {
      const ch = s[i];
      if (stop && ch === stop) { i++; return out; }
      if (ch === '\\') { command(out, m, st); continue; }
      if (ch === '{') { i++; out.push({ t: 'g', a: list(m, '}', st) }); continue; }
      if (ch === '$') { i++; if (m === 'text') out.push({ t: 'g', a: list('math', '$') }); else if (stop === '$') return out; continue; }
      if (m === 'math') {
        if (ch === ' ' || ch === '\t') {
          // a typed space separates words ("a long label", "n \log n") but
          // vanishes next to operators, where math spacing already applies
          while (s[i] === ' ' || s[i] === '\t') i++;
          if (out.length && !(out[out.length - 1].t === 'sp')) out.push({ t: 'sp', w: 0.28, soft: true });
          continue;
        }
        if (ch === '~') { i++; out.push({ t: 'sp', w: 0.333 }); continue; }
        if (ch === '"') {
          i++;
          const end = s.indexOf('"', i);
          const text = end < 0 ? s.slice(i) : s.slice(i, end);
          i = end < 0 ? s.length : end + 1;
          const sub = parseLabel(text, 'text');
          out.push({ t: 'g', a: st ? sub.map((a) => (a.t === 'c' ? { ...a, st } : a)) : sub });
          continue;
        }
        if ((ch === '_' || ch === '^') && !st) {
          i++;
          const arg = readArg(m, st);
          let base = out.pop();
          if (!base) base = { t: 'g', a: [] };
          if (base.t !== 's') base = { t: 's', base, sub: null, sup: null };
          if (ch === '_') base.sub = arg; else base.sup = base.sup ? base.sup.concat(arg) : arg;
          out.push(base);
          continue;
        }
        if (/[A-Za-z]/.test(ch) && !st) {
          const start = i;
          while (/[A-Za-z]/.test(s[i] || '')) i++;
          const word = s.slice(start, i);
          if (word === 'NIL') out.push({ t: 'g', a: [...word.toLowerCase()].map((c) => ({ t: 'c', ch: c, st: 'sc' })) });
          else if (word.length >= 2 && /^[A-Z]+$/.test(word)) textRun(out, word, 'r');
          else if (OPERATOR_NAMES.has(word)) { const g = []; textRun(g, word, 'r'); out.push({ t: 'g', a: g, op: true }); }
          else if (word.length === 1 && /\d/.test(s[i] || '') && !/[A-Za-z]/.test(s[start - 1] || '')) {
            // single letter + digits: v1 → v₁ (CLRS style)
            const d0 = i;
            while (/\d/.test(s[i] || '')) i++;
            out.push({ t: 's', base: { t: 'c', ch: word, st: 'i' }, sub: [...s.slice(d0, i)].map((c) => ({ t: 'c', ch: c, st: 'r' })), sup: null });
          } else for (const c of word) out.push({ t: 'c', ch: c, st: 'i' });
          continue;
        }
        if (ch === "'") {
          i++;
          let base = out.pop() || { t: 'g', a: [] };
          if (base.t !== 's') base = { t: 's', base, sub: null, sup: null };
          base.sup = (base.sup || []).concat([{ t: 'c', ch: '′', st: 'r' }]);
          out.push(base);
          continue;
        }
      }
      i++;
      if (m === 'text' && ch === '"') continue; // quotes only delimit text
      out.push(charAtom(ch, m, st));
    }
    return out;
  }

  return list(mode, null, null);
}

/* ---------------- layout ---------------- */

const SCRIPT_SCALE = 0.7;

/** Append b's items into a, shifted by (dx, dy) and scaled by k. */
function place(target, box, dx, dy, k = 1) {
  for (const it of box.items) {
    const copy = { ...it, x: dx + it.x * k, y: dy + it.y * k, s: (it.s || 1) * k };
    if (it.k === 'l') Object.assign(copy, { x2: dx + it.x2 * k, y2: dy + it.y2 * k, sw: it.sw * k });
    target.push(copy);
  }
}

function charBox(ch, st) {
  const fonts = FS.fonts;
  const cp = ch.codePointAt(0);
  if (st === 'sc') {
    const upper = ch.toUpperCase();
    const small = upper !== ch;
    const inner = charBox(upper, 'r');
    if (!small) return inner;
    const k = 0.78;
    return { w: inner.w * k, asc: inner.asc * k, desc: inner.desc * k, items: inner.items.map((it) => ({ ...it, x: it.x * k, y: it.y * k, s: (it.s || 1) * k })) };
  }
  const font = fonts && (st === 'i' ? fonts.i : st === 'b' ? fonts.b : fonts.r);
  // symbols drawn by stroke take priority for math operators (consistent weight)
  if (SYMBOLS[ch]) {
    const sym = SYMBOLS[ch];
    return { w: sym.w, asc: -sym.ink[0], desc: sym.ink[1], items: [{ k: 'p', d: sym.d, x: 0, y: 0, s: 1, sw: st === 'b' ? 0.07 : 0.045, dots: !!sym.dots }] };
  }
  if (font) {
    let f = font;
    let key = st === 'i' ? 'i' : st === 'b' ? 'b' : 'r';
    if (!f.has(cp) && fonts.r.has(cp)) { f = fonts.r; key = 'r'; }
    if (f.has(cp)) {
      const gid = f.glyphId(cp);
      const bb = f.bbox(gid);
      const adv = f.advance(gid);
      // italic correction: how far the slanted glyph overhangs its advance
      const ic = key === 'i' ? Math.min(0.15, Math.max(0, bb[2] - adv)) : 0;
      return { w: adv, ic, asc: Math.max(0, bb[3]), desc: Math.max(0, -bb[1]), items: [{ k: 'g', f: key, gid, x: 0, y: 0, s: 1 }] };
    }
  }
  // fallback: system font text
  const wide = /[⺀-￿]/.test(ch);
  const w = ch === ' ' ? 0.333 : wide ? 1 : /[il.,:;'|!]/.test(ch) ? 0.28 : /[mwMW]/.test(ch) ? 0.83 : 0.55;
  return { w, asc: 0.7, desc: wide ? 0.12 : 0.02, items: [{ k: 't', text: ch, x: 0, y: 0, s: 1, it: st === 'i', bold: st === 'b' }] };
}

function hbox(atoms, level = 0) {
  const items = [];
  let x = 0;
  let asc = 0;
  let desc = 0;
  let prevKind = 'start';
  const push = (box, kind, spaceBefore = 0) => {
    x += spaceBefore;
    place(items, box, x, 0);
    x += box.w;
    asc = Math.max(asc, box.asc);
    desc = Math.max(desc, box.desc);
    prevKind = kind;
  };
  const rawKind = (atom) => {
    if (!atom) return 'end';
    if (atom.t === 'sp') return 'sp';
    if (atom.t !== 'c' || atom.st === 'sc') return 'ord';
    if (BIN.has(atom.ch)) return 'bin';
    if (REL.has(atom.ch)) return 'rel';
    if (OPEN.has(atom.ch)) return 'open';
    if (atom.ch === ',' || atom.ch === ';') return 'punct';
    return 'ord';
  };
  const isItalicLetter = (a) => a && a.t === 'c' && a.st === 'i' && /\p{L}/u.test(a.ch);
  atoms.forEach((atom, idx) => {
    const next = atoms[idx + 1];
    if (atom.t === 'sp') {
      if (atom.soft) {
        // drop at the ends and next to operators
        const nk = rawKind(next);
        if (prevKind === 'start' || ['bin', 'rel', 'open', 'punct', 'op'].includes(prevKind) || ['bin', 'rel', 'end', 'sp'].includes(nk)) return;
        if (nk === 'ord' && next.t === 'c' && /[)\]}⌉⌋⟩.,;:!]/.test(next.ch)) return;
      }
      x += atom.w;
      prevKind = 'sp';
      return;
    }
    const box = atomBox(atom, level);
    let kind = rawKind(atom);
    if (level > 0) { push(box, kind); if (box.ic && !isItalicLetter(next)) x += box.ic; return; }
    if (kind === 'bin' && (prevKind === 'start' || prevKind === 'bin' || prevKind === 'rel' || prevKind === 'open' || prevKind === 'punct' || !next)) kind = 'ord';
    const gap = kind === 'bin' ? 0.222 : kind === 'rel' ? 0.278 : 0;
    const first = prevKind === 'start';
    push(box, kind, first ? 0 : gap);
    if (box.ic && !isItalicLetter(next)) x += box.ic;
    if (next && !(next.t === 'sp' && !next.soft)) x += gap;
    if (kind === 'punct') x += 0.167;
    if (atom.op) {
      // \log n: thin space before an ordinary operand (typed spaces collapse into it)
      let j = idx + 1;
      while (atoms[j] && atoms[j].t === 'sp' && atoms[j].soft) j++;
      const after = atoms[j];
      const nk = rawKind(after);
      if (nk === 'ord' && !(after.t === 'c' && OPEN.has(after.ch))) x += 0.167;
      prevKind = 'op';
    }
  });
  return { w: x, asc, desc, items };
}

function atomBox(atom, level) {
  switch (atom.t) {
    case 'c': return charBox(atom.ch, atom.st);
    case 'g': return hbox(atom.a, level);
    case 's': {
      const base = atomBox(atom.base, level);
      const k = level >= 1 ? 0.8 : SCRIPT_SCALE;
      const items = [];
      place(items, base, 0, 0);
      let w = base.w;
      let asc = base.asc;
      let desc = base.desc;
      const italicBase = atom.base.t === 'c' && atom.base.st === 'i';
      let sw = 0;
      if (atom.sup) {
        const sup = hbox(atom.sup, level + 1);
        const primeOnly = atom.sup.every((a) => a.ch === '′');
        const shift = primeOnly ? Math.max(0.05, base.asc - 0.65) + 0.15 : Math.max(0.36, base.asc - 0.3);
        const dx = base.w + (italicBase ? 0.03 : 0.02);
        place(items, sup, dx, -shift, k);
        sw = Math.max(sw, dx - base.w + sup.w * k);
        asc = Math.max(asc, shift + sup.asc * k);
      }
      if (atom.sub) {
        const sub = hbox(atom.sub, level + 1);
        const shift = Math.max(0.15, base.desc + 0.05) + (atom.sup ? 0.08 : 0);
        const dx = base.w - (italicBase && !atom.sup ? 0.03 : 0) + 0.01;
        place(items, sub, dx, shift, k);
        sw = Math.max(sw, dx - base.w + sub.w * k);
        desc = Math.max(desc, shift + sub.desc * k);
        asc = Math.max(asc, -shift + sub.asc * k);
      }
      w += sw + 0.03;
      return { w, asc, desc, items };
    }
    case 'frac': {
      const k = level >= 1 ? 0.8 : 0.8;
      const num = hbox(atom.num, level + 1);
      const den = hbox(atom.den, level + 1);
      const inner = Math.max(num.w, den.w) * k;
      const w = inner + 0.24;
      const items = [];
      const barY = AXIS;
      const numY = barY - 0.12 - num.desc * k;
      const denY = barY + 0.12 + den.asc * k;
      place(items, num, 0.12 + (inner - num.w * k) / 2, numY, k);
      place(items, den, 0.12 + (inner - den.w * k) / 2, denY, k);
      items.push({ k: 'l', x: 0.06, y: barY, x2: w - 0.06, y2: barY, sw: 0.04 });
      return { w, asc: -numY + num.asc * k, desc: denY + den.desc * k, items };
    }
    case 'sqrt': {
      const body = hbox(atom.a, level);
      const top = -(Math.max(body.asc, 0.6) + 0.12);
      const bottom = Math.max(body.desc, 0) + 0.06;
      const items = [{ k: 'p', d: `M0.02 ${-0.3}L0.11 ${-0.36}L0.27 ${bottom}L0.5 ${top}H${(0.56 + body.w + 0.06).toFixed(3)}`, x: 0, y: 0, s: 1, sw: 0.04 }];
      place(items, body, 0.56, 0);
      return { w: 0.56 + body.w + 0.1, asc: -top + 0.03, desc: bottom + 0.02, items };
    }
    case 'over': {
      const body = hbox(atom.a, level);
      const y = -(body.asc + 0.1);
      const items = [];
      place(items, body, 0, 0);
      items.push({ k: 'l', x: 0.02, y, x2: body.w, y2: y, sw: 0.04 });
      return { w: body.w, asc: -y + 0.03, desc: body.desc, items };
    }
    default: return { w: 0, asc: 0, desc: 0, items: [] };
  }
}

/** Split on top-level `\\` (outside braces). */
function splitLines(src) {
  const out = [];
  let depth = 0;
  let start = 0;
  const s = String(src);
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && s[i + 1] === '\\' && depth === 0) { out.push(s.slice(start, i)); start = i + 2; i++; continue; }
    if (s[i] === '\\') { i++; continue; }
    if (s[i] === '{') depth++;
    else if (s[i] === '}') depth = Math.max(0, depth - 1);
  }
  out.push(s.slice(start));
  return out;
}

const labelCache = new Map();

/**
 * Typeset a label into a box (em units). Multi-line labels stack centred.
 * Returns { w, asc, desc, items, empty }; asc measured from the first
 * baseline, desc below the last.
 */
function typeset(src, mode = 'math') {
  const key = `${mode}\u0000${src}`;
  if (labelCache.has(key)) return labelCache.get(key);
  const lines = splitLines(src).map((line) => hbox(parseLabel(line.trim(), mode)));
  const gap = 1.2;
  const w = Math.max(0, ...lines.map((l) => l.w));
  const items = [];
  let y = 0;
  lines.forEach((line, idx) => {
    if (idx > 0) y += Math.max(gap, lines[idx - 1].desc + line.asc + 0.25);
    place(items, line, (w - line.w) / 2, y);
  });
  const box = {
    w,
    asc: lines[0].asc,
    desc: y + lines[lines.length - 1].desc,
    items,
    empty: !String(src).trim(),
  };
  if (labelCache.size > 3000) labelCache.clear();
  labelCache.set(key, box);
  return box;
}

FS.typeset = typeset;
FS.parseLabel = parseLabel;
FS.SYMBOLS = SYMBOLS;

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

/*
 * Figure Suite — source rewriting for direct manipulation in the preview.
 */

const fmtCoord = (v) => {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

/**
 * Write `at=(x,y)` for every node in `positions` (Map id → [x, y]) into the
 * graph block `blockIndex`. Existing coordinates are replaced; nodes only
 * mentioned in edges get a declaration line at the top of the block body.
 */
function setGraphPositions(source, blockIndex, positions) {
  const fig = parseFigure(source);
  const block = fig.blocks[blockIndex];
  if (!block || block.kind !== 'graph') return source;
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
  const g = parseGraph(block, []);
  const indentOf = (lineNo) => (lines[lineNo - 1].match(/^[ \t]*/) || [''])[0];
  const bodyIndent = block.body.length ? indentOf(block.body[0].line) : '  ';
  const coord = ([x, y]) => `(${fmtCoord(x)},${fmtCoord(y)})`;
  const missing = [];
  for (const [id, pos] of positions) {
    const node = g.nodes.get(id);
    if (!node) continue;
    if (!node.line) { missing.push(`${bodyIndent}${id} at=${coord(pos)}`); continue; }
    const k = node.line - 1;
    let text = lines[k];
    const atRe = /(\sat=)\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)/;
    const bareRe = /(\s)\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)(?=\s|$)/;
    if (atRe.test(text)) text = text.replace(atRe, `$1${coord(pos)}`);
    else if (bareRe.test(text)) text = text.replace(bareRe, `$1${coord(pos)}`);
    else {
      // insert right after the id (keeps the line readable)
      const m = text.match(/^([ \t]*)(\S+)/);
      text = m ? `${m[1]}${m[2]} ${coord(pos)}${text.slice(m[0].length)}` : text;
    }
    lines[k] = text;
  }
  if (missing.length) lines.splice(block.line, 0, ...missing.map((l) => l.replace(/ at=/, ' ')));
  return lines.join('\n');
}

/*
 * Figure Suite — starter templates, one per family of CLRS figures.
 */

const TEMPLATES = [
  {
    group: 'Arrays & tables',
    name: 'Array with pointers (partition)',
    source: `array A
  2 8 7 1 3 5 6 4
  shade: 1..3 lightblue
  shade: 4..6 tan
  ptr: p=1 i=3 j=6 r=8
  span: 1..3 {\\le x} below`,
  },
  {
    group: 'Arrays & tables',
    name: 'Insertion sort step',
    source: `array A
  5 2 4 6 1 3
  shade: 2 black
  arc: 2 -> 1 below
  arc: 1 -> 2 above`,
  },
  {
    group: 'Arrays & tables',
    name: 'Counting sort (several arrays)',
    source: `array A
  2 5 3 0 2 3 0 3
array C start=0
  2 0 2 3 0 1
array B
  _ _ _ _ _ _ 3 _
  shade: 7`,
  },
  {
    group: 'Arrays & tables',
    name: 'Stack / queue',
    source: `array Q
  _ _ _ _ _ 15 6 9 8 4 _ _
  shade: 6..10
  ptr: head=6 tail=11 below`,
  },
  {
    group: 'Arrays & tables',
    name: 'DP table (LCS)',
    source: `table c start=0
  cols: _ j 0 1 2 3
  rows: i 0 1 2
  _ y_j B D C
  0 0 0 0 0
  0 {\\uparrow\\,0} {\\nwarrow\\,1} {\\leftarrow\\,1}
  shade: (2,4)`,
  },
  {
    group: 'Arrays & tables',
    name: 'Matrix',
    source: `table "$A =$" brackets
  1 2 3
  4 5 6
  7 8 9`,
  },
  {
    group: 'Arrays & tables',
    name: 'Binary counter',
    source: `table grid=rows
  cols: "\\text{Counter value}" A[3] A[2] A[1] A[0] "\\text{Total cost}"
  0 0 0 0 0 0
  1 0 0 0 1 1
  2 0 0 1 0 3
  3 0 0 1 1 4
  shade: (2,4..5) (3,5)`,
  },
  {
    group: 'Trees',
    name: 'Binary search tree',
    source: `tree
  15
    6
      3
        2
        4
      7
        _
        13
          9
          _
    18
      17
      20`,
  },
  {
    group: 'Trees',
    name: 'Heap: tree + array',
    source: `panel (a)
tree
  16 above=1
    14 above=2
      8 left=4
        2
        4
      7
        1
        _
    10 above=3
      9
      3
panel (b)
array A
  16 14 10 8 7 9 3 2 4 1
  shade: 2`,
  },
  {
    group: 'Trees',
    name: 'Red-black tree',
    source: `tree
  26 black
    17 red
      14 black
        nil
        nil
      21 black
        nil
        nil
    41 black
      30 red
        nil
        nil
      47 black
        nil
        nil`,
  },
  {
    group: 'Trees',
    name: 'Rotation (subtree triangles)',
    source: `tree
  x
    "α" tri
    y
      "β" tri
      "γ" tri
arrow "\\textsc{Left-Rotate}$(T, x)$"
tree
  y
    x
      "α" tri
      "β" tri
    "γ" tri`,
  },
  {
    group: 'Trees',
    name: 'B-tree',
    source: `tree
  [M]
    [D H]
      [B C]
      [F G]
      [J K L]
    [Q T X]
      [N P]
      [R S]
      [V W]
      [Y Z]`,
  },
  {
    group: 'Trees',
    name: 'Recursion tree',
    source: `tree shape=none
  "cn^2"
    "c(n/4)^2"
      "T(n/16)"
      "T(n/16)"
    "c(n/4)^2"
      "T(n/16)"
      "T(n/16)"
  level: 0 cn^2
  level: 1 \\frac{2}{16}cn^2
  level: 2 \\vdots`,
  },
  {
    group: 'Trees',
    name: 'Huffman tree',
    source: `tree
  100 box
    "a:45" box edge=0
    55 box edge=1
      25 box edge=0
        "c:12" box edge=0
        "b:13" box edge=1
      30 box edge=1
        14 box edge=0
          "f:5" box edge=0
          "e:9" box edge=1
        "d:16" box edge=1`,
  },
  {
    group: 'Trees',
    name: 'Disjoint-set forest',
    source: `tree arrows=up
  c loop
    h
    e
      b
  f loop
    d
    g`,
  },
  {
    group: 'Graphs',
    name: 'Undirected graph',
    source: `graph
  1 (0,1)
  2 (1,1)
  3 (2,1)
  4 (2,0)
  5 (1,0)
  1 -- 2
  1 -- 5
  2 -- 5
  2 -- 4
  2 -- 3
  3 -- 4
  4 -- 5`,
  },
  {
    group: 'Graphs',
    name: 'BFS / DFS state',
    source: `graph
  r (0,1) "\\infty" above=r
  s (1,1) "0" gray above=s
  t (2,1) "\\infty" above=t
  u (3,1) "\\infty" above=u
  v (0,0) "\\infty" below=v
  w (1,0) "1" gray below=w
  x (2,0) "\\infty" below=x
  y (3,0) "\\infty" below=y
  r -- s
  s -- w thick
  r -- v
  w -- t
  w -- x
  t -- x
  t -- u
  x -- u
  x -- y
  u -- y`,
  },
  {
    group: 'Graphs',
    name: 'Weighted digraph (shortest paths)',
    source: `graph
  s (0,0) "0" gray below=s
  t (1,1) "\\infty" above=t
  x (2.4,1) "\\infty" above=x
  y (1,-1) "\\infty" below=y
  z (2.4,-1) "\\infty" below=z
  s -> t 10
  s -> y 5
  t -> x 1
  t -> y 2 bend=15
  y -> t 3 bend=15
  y -> x 9
  y -> z 2
  x -> z 4 bend=15
  z -> x 6 bend=15
  z -> s 7 bend=-40`,
  },
  {
    group: 'Graphs',
    name: 'Flow network',
    source: `graph
  s (0,0)
  v1 (1,1)
  v2 (1,-1)
  v3 (2.3,1)
  v4 (2.3,-1)
  t (3.3,0)
  s -> v1 11/16
  s -> v2 8/13
  v2 -> v1 1/4
  v1 -> v3 12/12
  v3 -> v2 4/9
  v2 -> v4 11/14
  v4 -> v3 7/7
  v3 -> t 15/20
  v4 -> t 4/4`,
  },
  {
    group: 'Graphs',
    name: 'DAG (auto layered)',
    source: `graph layout=layered
  undershorts -> pants
  undershorts -> shoes
  pants -> belt
  pants -> shoes
  shirt -> belt
  shirt -> tie
  tie -> jacket
  belt -> jacket
  socks -> shoes`,
  },
  {
    group: 'Graphs',
    name: 'Topological order (line)',
    source: `graph layout=line shape=ellipse
  socks
  undershorts
  pants
  shoes
  shirt
  belt
  undershorts -> pants
  undershorts -> shoes
  pants -> shoes
  pants -> belt
  shirt -> belt
  socks -> shoes`,
  },
  {
    group: 'Graphs',
    name: 'Strongly connected components',
    source: `graph
  a (0,1)
  b (1,1)
  c (2,1)
  d (3,1)
  e (0,0)
  f (1,0)
  g (2,0)
  h (3,0)
  group: a b e
  group: c d
  group: f g
  group: h
  a -> b
  b -> e
  e -> a
  b -> f
  e -> f
  b -> c
  c -> d
  d -> c
  c -> g
  f -> g
  g -> f
  g -> h
  d -> h
  h -> h`,
  },
  {
    group: 'Graphs',
    name: 'Bipartite matching',
    source: `graph layout=layered dir=right
  rank: l1 l2 l3
  rank: r1 r2 r3
  l1 -- r1 thick
  l1 -- r2
  l2 -- r2 thick
  l3 -- r2
  l3 -- r3 thick`,
  },
  {
    group: 'Graphs',
    name: 'Finite automaton',
    source: `graph layout=circle
  0 start
  1
  2
  3 double
  0 -> 1 a
  1 -> 2 b
  2 -> 3 a
  1 -> 1 a
  3 -> 1 a bend=20
  2 -> 0 b bend=20
  0 -> 0 b`,
  },
  {
    group: 'Graphs',
    name: 'Points & segments (geometry)',
    source: `graph undirected
  p0 (0,0) point below=p_0
  p1 (2,0.3) point right=p_1
  p2 (2.6,1.6) point right=p_2
  p3 (1.2,2.2) point above=p_3
  p4 (-0.3,1.4) point left=p_4
  q (1.2,1) point right=q
  p0 -- p1 -- p2 -- p3 -- p4 -- p0`,
  },
  {
    group: 'Linked structures',
    name: 'Doubly linked list',
    source: `list L.head double
  9 16 4 1
  names: 2`,
  },
  {
    group: 'Linked structures',
    name: 'Singly linked list',
    source: `list L.head
  9 16 4 1`,
  },
  {
    group: 'Linked structures',
    name: 'Hash table with chaining',
    source: `chains T
  0:
  1: k1 k4
  2:
  3: k5 k2 k7
  4:
  5: k3
  6: k8 k6
  7:`,
  },
  {
    group: 'Linked structures',
    name: 'Adjacency list + matrix',
    source: `panel (a)
graph layout=circle
  1 -- 2
  1 -- 5
  2 -- 5
  2 -- 3
  2 -- 4
  3 -- 4
  4 -- 5
panel (b)
chains Adj start=1
  1: 2 5
  2: 1 5 3 4
  3: 2 4
  4: 2 5 3
  5: 4 1 2
panel (c)
table index
  0 1 0 0 1
  1 0 1 1 1
  0 1 0 1 0
  0 1 1 0 1
  1 1 0 1 0`,
  },
  {
    group: 'Layout',
    name: 'Before → after panels',
    source: `figure cols=3
panel (a)
array A
  5 2 4 6 1 3
  shade: 2
arrow "step"
panel (b)
array A
  2 5 4 6 1 3
  shade: 3`,
  },
];

/*
 * Figure Suite — export: SVG → PNG, figure source embedded in PNG / SVG so
 * images can be reopened for editing, clipboard helpers.
 */

const SOURCE_KEY = 'figure-suite';

/* ---------------- PNG chunks ---------------- */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  view.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

function pngChunks(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 8 || sig.some((v, i) => bytes[i] !== v)) return null;
  const chunks = [];
  let p = 8;
  while (p + 12 <= bytes.length) {
    const len = view.getUint32(p);
    const type = String.fromCharCode(bytes[p + 4], bytes[p + 5], bytes[p + 6], bytes[p + 7]);
    chunks.push({ type, start: p, end: p + 12 + len, data: bytes.subarray(p + 8, p + 8 + len) });
    p += 12 + len;
    if (type === 'IEND') break;
  }
  return chunks;
}

/** Add pHYs (dpi) and an iTXt chunk holding the source; drops older copies. */
function pngWithSource(bytes, source, scale = 1) {
  const chunks = pngChunks(bytes);
  if (!chunks) return bytes;
  const enc = new TextEncoder();
  const key = enc.encode(SOURCE_KEY);
  const text = enc.encode(source);
  const itxt = new Uint8Array(key.length + 5 + text.length);
  itxt.set(key, 0);
  // null, compression flag 0, method 0, empty language tag, empty translated keyword
  itxt.set(text, key.length + 5);
  const ppm = Math.round((96 * scale) / 0.0254);
  const phys = new Uint8Array(9);
  new DataView(phys.buffer).setUint32(0, ppm);
  new DataView(phys.buffer).setUint32(4, ppm);
  phys[8] = 1;
  const parts = [bytes.subarray(0, 8)];
  for (const c of chunks) {
    if (c.type === 'pHYs') continue;
    if (c.type === 'iTXt' && isSourceChunk(c.data)) continue;
    if (c.type === 'IEND') parts.push(makeChunk('iTXt', itxt));
    parts.push(bytes.subarray(c.start, c.end));
    if (c.type === 'IHDR') parts.push(makeChunk('pHYs', phys));
  }
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  return out;
}

function isSourceChunk(data) {
  const key = SOURCE_KEY;
  if (data.length <= key.length || data[key.length] !== 0) return false;
  for (let i = 0; i < key.length; i++) if (data[i] !== key.charCodeAt(i)) return false;
  return true;
}

/** Figure source stored in a PNG or SVG file, or null. */
function extractSource(bytes, ext) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (ext === 'svg') {
    const text = new TextDecoder().decode(u8);
    const m = text.match(/<metadata id="figure-suite-source">([\s\S]*?)<\/metadata>/);
    return m ? unescapeXml(m[1]) : null;
  }
  const chunks = pngChunks(u8);
  if (!chunks) return null;
  for (const c of chunks) {
    if (c.type !== 'iTXt' || !isSourceChunk(c.data)) continue;
    // keyword\0 flag method lang\0 translated\0 text
    let p = SOURCE_KEY.length + 3;
    while (p < c.data.length && c.data[p] !== 0) p++;
    p++;
    while (p < c.data.length && c.data[p] !== 0) p++;
    p++;
    return new TextDecoder().decode(c.data.subarray(p));
  }
  return null;
}

/** Display width (CSS px) of a PNG: pixel width divided by the pHYs density we wrote. */
function pngCssWidth(bytes) {
  const chunks = pngChunks(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  if (!chunks || !chunks.length || chunks[0].type !== 'IHDR') return null;
  const ihdr = chunks[0].data;
  const px = new DataView(ihdr.buffer, ihdr.byteOffset, ihdr.byteLength).getUint32(0);
  const phys = chunks.find((c) => c.type === 'pHYs');
  let scale = 1;
  if (phys && phys.data[8] === 1) {
    const ppm = new DataView(phys.data.buffer, phys.data.byteOffset, 9).getUint32(0);
    scale = Math.max(1, Math.round((ppm * 0.0254) / 96));
  }
  return Math.round(px / scale);
}

const unescapeXml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/* ---------------- rasterising ---------------- */

/** Render an SVG string to PNG bytes at `scale`. */
function svgToPng(svg, width, height, scale) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(width * scale));
        canvas.height = Math.max(1, Math.round(height * scale));
        const g = canvas.getContext('2d');
        g.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob(async (out) => {
          if (!out) { reject(new Error('PNG encoding failed')); return; }
          resolve(new Uint8Array(await out.arrayBuffer()));
        }, 'image/png');
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not rasterise the SVG')); };
    img.src = url;
  });
}

/** Bytes for a format: { bytes, width (CSS px), height, ext }. */
async function exportFigure(source, format, settings) {
  const res = renderFigure(source, settings, { embedSource: format === 'svg' && settings.embedSource !== false });
  if (format === 'svg') {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${res.svg}`;
    return { bytes: new TextEncoder().encode(xml), width: res.width, height: res.height, ext: 'svg', scale: 1, errors: res.errors, svg: res.svg };
  }
  const scale = Math.max(1, num(settings.pngScale, 2));
  let png = await svgToPng(res.svg, res.width, res.height, scale);
  if (settings.embedSource !== false) png = pngWithSource(png, source, scale);
  return { bytes: png, width: res.width, height: res.height, ext: 'png', scale, errors: res.errors, svg: res.svg };
}

async function copyPng(bytes) {
  try {
    const item = new ClipboardItem({ 'image/png': new Blob([bytes], { type: 'image/png' }) });
    await navigator.clipboard.write([item]);
    return;
  } catch (err) {
    // Electron fallback
    const electron = require('electron');
    const image = electron.nativeImage.createFromBuffer(Buffer.from(bytes));
    electron.clipboard.writeImage(image);
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    require('electron').clipboard.writeText(text);
  }
}

/*
 * Figure Suite — the drawing panel: source editor, live preview, exports.
 */

class TemplatePicker extends FuzzySuggestModal {
  constructor(app, onPick) {
    super(app);
    this.onPick = onPick;
    this.append = false;
    this.setPlaceholder('Pick a template…');
    this.setInstructions([
      { command: '↵', purpose: 'replace the source (undo with Mod+Z)' },
      { command: 'shift ↵', purpose: 'append as another block' },
    ]);
    this.scope.register(['Shift'], 'Enter', (evt) => {
      this.append = true;
      if (this.chooser && this.chooser.useSelectedItem) this.chooser.useSelectedItem(evt);
      return false;
    });
  }

  getItems() { return TEMPLATES; }

  getItemText(t) { return `${t.group} › ${t.name}`; }

  onChooseItem(t, evt) { this.onPick(t, this.append || !!(evt && evt.shiftKey)); }
}

const HELP_HTML = `
<h4>结构</h4>
<pre>figure cols=2            全局（可选）：每行面板数、size=字号、fill=默认填充
panel (a)                新面板，后面是标题
array A                  图元块：顶格写类型和名字，块体缩进
  5 2 4 6 1 3
  shade: 2..3            指令行：关键字加冒号
arrow "RL"               面板之间的箭头</pre>
<h4>标签（迷你 TeX）</h4>
<p>默认数学：字母斜体、<code>x_1</code> <code>n^2</code> <code>\\alpha</code> <code>\\infty</code> <code>\\le</code> <code>\\frac{n}{2}</code>；<code>v1</code> 自动成 v<sub>1</sub>；<code>NIL</code> 小型大写。含空格用引号把整个标签括起来 <code>"c(n/2) + 1"</code>（引号只分组，内容仍是数学，空格保留）；标签中间的 <code>"..."</code> 是正体文字，也可以用 <code>\\text{...}</code>。颜色：<code>值@gray</code>。</p>
<p>颜色名：white light shade gray dark black red pink blue lightblue green lightgreen yellow orange tan purple，或 #hex。</p>
<h4>array</h4>
<pre>array A start=1 index=above|below|none w=30 vertical
  5 2 _ 6        _ = 空格子
  shade: 2..4 7 gray
  ptr: i=2 j=5 [below]
  span: 1..3 {\\le x} [above|below] [square]
  bar: 3         第 3 格后的粗竖线
  arc: 2 -> 1 [label] [below]
  index: a b c   自定义下标</pre>
<h4>table</h4>
<pre>table c start=0 index grid=all|none|outer|rows|cols brackets
  0 0 0
  0 1 1          每行一行数据
  cols: x A B    列表头（多一个则第一个在角上）
  rows: 0 1      行表头
  shade: (1,2) (0..1,2) row=1 col=2 [color]
  arrow: (2,2) -> (1,1) -> (0,0)
  path: ...      同上但不带箭头</pre>
<h4>tree（缩进表示孩子）</h4>
<pre>tree r=14 levelgap= sibgap= shape= arrows=up|down fill=
  26 black right=-2
    17 red edge=0 thick
      _          空位（让唯一的孩子靠左/右）
      nil        NIL 哨兵
    "α" tri h=1.5   子树三角
    [G M P]      B 树多关键字结点
  level: 0 cn^2  右侧每层标注
形状：circle box ellipse none point tri
结点：left= right= above= below= edge= ecolor= thick dashed noedge loop double</pre>
<h4>graph</h4>
<pre>graph layout=auto|manual|layered|force|circle|line|grid dir=right unit=60 r=
  s (0,0) "0" gray above=s   结点：id 坐标(y 向上) 标签 颜色/形状
  s -> t 10                  有向；-- 无向；<-> 双向；可连写 a -- b -- c
  t -> x 1 thick bend=20 swap dashed red label="f/c" inline
  x -> x loop=above          自环
  group: a b c [color]       SCC 底色
  rank: a b                  layered 布局同层
结点形状：circle box ellipse point none double；start = 初始箭头</pre>
<p>预览里可以<b>拖动图的结点</b>，坐标自动写回源码（按住 Alt 不吸附）。</p>
<h4>list / chains</h4>
<pre>list L.head double fields=prev,key,next
  9 16 4 1
  names: 2       在第 2 个结点上标字段名
chains T double start=0
  0:
  1: k1 k4       / 或空 = NIL</pre>
<h4>其它</h4>
<pre>text "任意文字 $x^2$" size=13 bold
arrow "label" len=60 dir=right|down|left both
space 20 10</pre>`;

class FigureModal extends Modal {
  /**
   * opts: { source, target: { editor, file } | null, editing: { file } | null }
   */
  constructor(plugin, opts = {}) {
    super(plugin.app);
    this.plugin = plugin;
    this.target = opts.target || null;
    this.editing = opts.editing || null;
    this.initial = opts.source ?? '';
    this.restored = !!opts.restored;
    this.zoom = 1;
    this.result = null;
    this.dirty = false;
    this.finished = false;
  }

  get settings() { return this.plugin.settings; }

  onOpen() {
    const { modalEl, contentEl } = this;
    modalEl.addClass('fs-modal');
    contentEl.empty();
    this.titleEl.setText(this.editing ? `Edit figure — ${this.editing.file.name}` : this.restored ? 'New figure (draft restored)' : 'New figure');

    // toolbar
    const bar = contentEl.createDiv('fs-toolbar');
    this.button(bar, 'layout-template', 'Templates', () => new TemplatePicker(this.app, (t, append) => this.insertTemplate(t, append)).open());
    this.button(bar, 'file-plus', 'New (clear)', () => this.setSource('', true));
    this.helpBtn = this.button(bar, 'circle-help', 'Syntax help', () => this.toggleHelp());
    bar.createDiv('fs-spacer');
    this.button(bar, 'zoom-out', 'Zoom out', () => this.setZoom(this.zoom / 1.25));
    this.zoomLabel = bar.createEl('button', { cls: 'fs-zoom-label', text: '100%', attr: { 'aria-label': 'Reset zoom' } });
    this.zoomLabel.onclick = () => this.setZoom(1);
    this.button(bar, 'zoom-in', 'Zoom in', () => this.setZoom(this.zoom * 1.25));
    this.button(bar, 'maximize', 'Fit', () => this.fit());

    // main area
    const main = contentEl.createDiv('fs-main');
    const left = main.createDiv('fs-left');
    this.textarea = left.createEl('textarea', {
      cls: 'fs-source',
      attr: {
        spellcheck: 'false',
        autocapitalize: 'off',
        autocomplete: 'off',
        placeholder: 'Pick a template (first toolbar button), or type e.g.\n\ntree\n  15\n    6\n    18\n\narray A\n  5 2 4 6 1 3\n  shade: 2',
      },
    });
    this.errorsEl = left.createDiv('fs-errors');
    const right = main.createDiv('fs-right');
    this.previewEl = right.createDiv('fs-preview');
    if (this.settings.background === 'transparent') this.previewEl.addClass('fs-transparent');
    this.paper = this.previewEl.createDiv('fs-paper');
    this.statusEl = right.createDiv('fs-status');
    this.helpEl = main.createDiv('fs-help');
    this.helpEl.innerHTML = HELP_HTML;
    this.helpEl.hide();

    // footer
    const foot = contentEl.createDiv('fs-footer');
    const nameWrap = foot.createDiv('fs-name');
    this.nameInput = nameWrap.createEl('input', { type: 'text', cls: 'fs-name-input' });
    this.nameInput.value = this.editing ? this.editing.file.basename : this.defaultName();
    this.extLabel = nameWrap.createSpan({ cls: 'fs-ext' });
    if (this.editing) this.nameInput.disabled = true;
    this.formatSel = foot.createEl('select', { cls: 'dropdown' });
    [['png', 'PNG'], ['svg', 'SVG']].forEach(([v, t]) => this.formatSel.createEl('option', { value: v, text: t }));
    this.formatSel.value = this.editing ? this.editing.file.extension : this.settings.format;
    if (this.editing) this.formatSel.disabled = true;
    this.scaleSel = foot.createEl('select', { cls: 'dropdown' });
    [1, 2, 3, 4].forEach((v) => this.scaleSel.createEl('option', { value: String(v), text: `${v}×` }));
    this.scaleSel.value = String(this.settings.pngScale);
    const syncFormat = () => {
      this.extLabel.setText(`.${this.formatSel.value}`);
      this.scaleSel.toggle(this.formatSel.value === 'png');
    };
    this.formatSel.onchange = syncFormat;
    syncFormat();
    foot.createDiv('fs-spacer');
    this.textBtn(foot, 'Copy PNG', () => this.copy('png'));
    this.textBtn(foot, 'Copy SVG', () => this.copy('svg'));
    const canInsert = this.editing || (this.target && this.target.editor);
    // without an editor the primary button already saves (and copies the link)
    if (!this.editing && canInsert) this.textBtn(foot, 'Save file', () => this.save(false));
    this.primary = this.textBtn(foot, this.editing ? 'Update' : canInsert ? 'Insert' : 'Save & copy link', () => (this.editing ? this.update() : this.save(!!canInsert)), true);
    this.primary.setAttr('aria-label', 'Mod+Enter');

    this.wireEditor();
    this.wirePreviewDrag();
    this.textarea.value = this.initial;
    this.render();
    setTimeout(() => this.textarea.focus(), 30);
    // fit once the modal has its final size
    this.resizeObs = new ResizeObserver(() => {
      if (this.userZoomed || !this.previewEl.clientWidth) return;
      this.fit(true);
    });
    this.resizeObs.observe(this.previewEl);
  }

  /* ---------- small UI helpers ---------- */

  button(parent, icon, label, onClick) {
    const b = parent.createEl('button', { cls: 'clickable-icon fs-icon-btn', attr: { 'aria-label': label } });
    setIcon(b, icon);
    if (!b.querySelector('svg')) b.setText(label); // icon name unknown to this Obsidian build
    b.onclick = onClick;
    return b;
  }

  textBtn(parent, text, onClick, cta = false) {
    const b = parent.createEl('button', { text, cls: cta ? 'mod-cta' : '' });
    b.onclick = async () => {
      if (b.disabled) return;
      b.disabled = true;
      try { await onClick(); } catch (err) { console.error(err); new Notice(`Figure Suite: ${err.message || err}`); } finally { b.disabled = false; }
    };
    return b;
  }

  defaultName() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${this.settings.prefix || 'figure'}-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  }

  toggleHelp() {
    const show = !this.helpEl.isShown();
    this.helpEl.toggle(show);
    this.helpBtn.toggleClass('is-active', show);
  }

  /* ---------- source editing ---------- */

  setSource(text, undoable) {
    const ta = this.textarea;
    if (undoable) {
      ta.focus();
      ta.select();
      const ok = text ? document.execCommand('insertText', false, text) : document.execCommand('delete');
      if (!ok) ta.value = text;
    } else ta.value = text;
    this.onInput();
  }

  insertTemplate(t, append) {
    const cur = this.textarea.value;
    const next = append && cur.trim() ? `${cur.replace(/\s+$/, '')}\n\n${t.source}\n` : `${t.source}\n`;
    this.setSource(next, true);
    this.userZoomed = false;
    window.clearTimeout(this.timer);
    this.render();
    this.fit(true);
  }

  onInput() {
    this.dirty = true;
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.render();
      if (!this.editing) this.plugin.saveDraft(this.textarea.value);
    }, 90);
  }

  wireEditor() {
    const ta = this.textarea;
    ta.addEventListener('input', () => this.onInput());
    ta.addEventListener('keydown', (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'Enter') {
        e.preventDefault();
        this.primary.click();
        return;
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        this.indent(e.shiftKey ? -1 : 1);
        return;
      }
      if (e.key === 'Enter' && !mod && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        const before = ta.value.slice(0, ta.selectionStart);
        const line = before.slice(before.lastIndexOf('\n') + 1);
        let indent = (line.match(/^[ \t]*/) || [''])[0];
        const head = line.trim().split(/\s+/)[0];
        if (!indent && BLOCK_KINDS.includes(head) && head !== 'arrow') indent = '  ';
        document.execCommand('insertText', false, `\n${indent}`);
      }
    });
  }

  /** Indent / dedent the selected lines (or insert spaces at the caret). */
  indent(dir) {
    const ta = this.textarea;
    const v = ta.value;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const lineStart = v.lastIndexOf('\n', s - 1) + 1;
    if (dir > 0 && s === e) { document.execCommand('insertText', false, '  '); return; }
    const lineEnd = v.indexOf('\n', e - (e > s && v[e - 1] === '\n' ? 1 : 0));
    const end = lineEnd < 0 ? v.length : lineEnd;
    const block = v.slice(lineStart, end);
    const changed = block.split('\n').map((l) => (dir > 0 ? `  ${l}` : l.replace(/^( {1,2}|\t)/, ''))).join('\n');
    ta.setSelectionRange(lineStart, end);
    document.execCommand('insertText', false, changed);
    ta.setSelectionRange(lineStart, lineStart + changed.length);
  }

  gotoLine(n) {
    const ta = this.textarea;
    const lines = ta.value.split('\n');
    let pos = 0;
    for (let i = 0; i < n - 1 && i < lines.length; i++) pos += lines[i].length + 1;
    ta.focus();
    ta.setSelectionRange(pos, pos + (lines[n - 1] || '').length);
    const lh = parseFloat(getComputedStyle(ta).lineHeight) || 18;
    ta.scrollTop = Math.max(0, (n - 4) * lh);
  }

  /* ---------- preview ---------- */

  render() {
    let res;
    try {
      res = renderFigure(this.textarea.value, this.plugin.renderSettings());
    } catch (err) {
      console.error(err);
      this.errorsEl.empty();
      this.errorsEl.createDiv({ cls: 'fs-error', text: `Internal error: ${err.message}` });
      return;
    }
    this.result = res;
    const doc = new DOMParser().parseFromString(res.svg, 'image/svg+xml');
    const svg = document.importNode(doc.documentElement, true);
    this.paper.empty();
    if (res.empty) {
      this.paper.addClass('is-empty');
      this.paper.createDiv({ cls: 'fs-empty', text: 'Type a block (array, table, tree, graph, list, chains…) or pick a template.' });
    } else {
      this.paper.removeClass('is-empty');
      this.paper.appendChild(svg);
      this.svgEl = svg;
      if (!this.userZoomed && !this.drag) this.fit(true); else this.applyZoom();
    }
    this.errorsEl.empty();
    for (const err of res.errors) {
      const row = this.errorsEl.createDiv({ cls: err.warn ? 'fs-error is-warn' : 'fs-error' });
      row.createSpan({ cls: 'fs-error-line', text: `Line ${err.line}` });
      row.createSpan({ text: ` ${err.msg}` });
      row.onclick = () => this.gotoLine(err.line);
    }
    this.statusEl.setText(res.empty ? '' : `${res.width} × ${res.height} px${res.hits.length ? ' · drag graph nodes to move them' : ''}`);
  }

  applyZoom() {
    if (!this.svgEl || !this.result) return;
    this.svgEl.setAttribute('width', String(this.result.width * this.zoom));
    this.svgEl.setAttribute('height', String(this.result.height * this.zoom));
    this.zoomLabel.setText(`${Math.round(this.zoom * 100)}%`);
  }

  setZoom(z, user = true) {
    if (user) this.userZoomed = true;
    this.zoom = Math.min(6, Math.max(0.2, z));
    this.applyZoom();
  }

  /** Fit to the pane (only shrinking/enlarging up to 2× when `soft`). */
  fit(soft) {
    if (!this.result || this.result.empty) return;
    const box = this.previewEl.getBoundingClientRect();
    if (!box.width) return;
    const z = Math.min((box.width - 48) / this.result.width, (box.height - 48) / this.result.height);
    this.setZoom(soft ? Math.min(2, Math.max(0.3, z)) : z, !soft);
  }

  wirePreviewDrag() {
    const el = this.previewEl;
    const toSvg = (e) => {
      const rect = this.svgEl.getBoundingClientRect();
      const k = this.result.width / rect.width;
      return [(e.clientX - rect.left) * k, (e.clientY - rect.top) * k];
    };
    const hitAt = (e) => {
      if (!this.svgEl || !this.result) return null;
      const [x, y] = toSvg(e);
      let best = null;
      for (const h of this.result.hits) {
        const d = Math.hypot(h.x - x, h.y - y);
        if (d <= h.r + 3 && (!best || d < best.d)) best = { h, d };
      }
      return best && best.h;
    };
    el.addEventListener('pointermove', (e) => {
      if (this.drag) return;
      el.toggleClass('fs-can-drag', !!hitAt(e));
    });
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      const hit = hitAt(e);
      if (!hit) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      // measure the move from the pointer delta: the paper re-centres as the figure grows
      const k = this.result.width / this.svgEl.getBoundingClientRect().width;
      const base = new Map(this.result.hits.filter((h) => h.block === hit.block).map((h) => [h.id, [h.ux, h.uy]]));
      this.drag = { hit, cx: e.clientX, cy: e.clientY, k, base, source: this.textarea.value, moved: false, block: hit.block };
      el.addClass('fs-dragging');
    });
    el.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d) return;
      let ux = d.hit.ux + ((e.clientX - d.cx) * d.k) / d.hit.unit;
      let uy = d.hit.uy - ((e.clientY - d.cy) * d.k) / d.hit.unit;
      if (!e.altKey) { ux = Math.round(ux * 10) / 10; uy = Math.round(uy * 10) / 10; }
      const pos = new Map(d.base);
      pos.set(d.hit.id, [ux, uy]);
      d.next = setGraphPositions(d.source, d.block, pos);
      d.moved = true;
      this.textarea.value = d.next;
      this.render();
    });
    const end = () => {
      const d = this.drag;
      if (!d) return;
      this.drag = null;
      el.removeClass('fs-dragging');
      if (!d.moved || d.next === d.source) return;
      // one undo step for the whole drag
      this.textarea.value = d.source;
      this.setSource(d.next, true);
    };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('wheel', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      this.setZoom(this.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1));
    }, { passive: false });
  }

  /* ---------- output ---------- */

  exportSettings(format) {
    return { ...this.plugin.renderSettings(), pngScale: Number(this.scaleSel.value), embedSource: this.settings.embedSource, format };
  }

  async build(format) {
    const source = this.textarea.value;
    if (!source.trim() || (this.result && this.result.empty)) throw new Error('Nothing to export yet');
    return exportFigure(source, format, this.exportSettings(format));
  }

  async copy(format) {
    const out = await this.build(format);
    if (format === 'png') await copyPng(out.bytes);
    else await copyText(new TextDecoder().decode(out.bytes));
    new Notice(`Copied ${format.toUpperCase()} to clipboard`);
  }

  async save(insert) {
    const format = this.formatSel.value;
    const out = await this.build(format);
    const raw = (this.nameInput.value.trim() || this.defaultName()).replace(/\.(png|svg)$/i, '').replace(/[\\/:*?"<>|#^[\]]/g, '-');
    const notePath = this.target && this.target.file ? this.target.file.path : '';
    const path = await this.app.fileManager.getAvailablePathForAttachment(`${raw}.${out.ext}`, notePath);
    const file = await this.app.vault.createBinary(path, out.bytes.buffer.slice(out.bytes.byteOffset, out.bytes.byteOffset + out.bytes.byteLength));
    const link = this.plugin.embedLink(file, notePath, out);
    if (insert && this.target && this.target.editor) {
      this.plugin.insertOnOwnLine(this.target.editor, link);
      new Notice(`Inserted ${file.name}`);
    } else {
      await copyText(link).catch(() => {});
      new Notice(`Saved ${file.path} — embed link copied`);
    }
    this.finished = true;
    this.plugin.saveDraft('');
    this.close();
  }

  async update() {
    const file = this.editing.file;
    const out = await this.build(file.extension);
    const oldWidth = file.extension === 'png' ? pngCssWidth(new Uint8Array(await this.app.vault.readBinary(file))) : null;
    await this.app.vault.modifyBinary(file, out.bytes.buffer.slice(out.bytes.byteOffset, out.bytes.byteOffset + out.bytes.byteLength));
    await this.plugin.refreshLinkWidths(file, oldWidth, out);
    new Notice(`Updated ${file.name}`);
    this.finished = true;
    this.close();
  }

  close() {
    if (this.dirty && !this.finished && !this.confirming && this.textarea.value.trim()) {
      this.confirming = true;
      const bar = this.contentEl.createDiv('fs-confirm');
      bar.createSpan({ text: this.editing ? 'Unsaved changes to this figure.' : 'Close the panel? The figure stays as a draft.' });
      const keep = bar.createEl('button', { text: 'Keep editing' });
      const leave = bar.createEl('button', { text: this.editing ? 'Discard' : 'Close', cls: this.editing ? 'mod-warning' : '' });
      const save = bar.createEl('button', { text: this.primary.textContent, cls: 'mod-cta' });
      const done = () => { bar.remove(); this.confirming = false; };
      keep.onclick = () => { done(); this.textarea.focus(); };
      leave.onclick = () => { this.finished = !!this.editing; done(); this.dirty = false; super.close(); };
      save.onclick = () => { done(); this.primary.click(); };
      bar.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.preventDefault(); keep.click(); } });
      keep.focus();
      return;
    }
    if (this.confirming) return;
    super.close();
  }

  onClose() {
    window.clearTimeout(this.timer);
    if (this.resizeObs) this.resizeObs.disconnect();
    if (!this.editing && !this.finished) this.plugin.saveDraft(this.textarea.value);
    this.contentEl.empty();
  }
}

/*
 * Figure Suite — plugin entry: commands, menus, hover "Edit" buttons, settings.
 */

const DEFAULT_SETTINGS = {
  format: 'png',
  pngScale: 2,
  background: 'white',
  fontSize: 15,
  prefix: 'figure',
  embedSource: true,
  insertWidth: true,
  listFill: 'light',
  draft: '',
};

const EMBED_RE = /!\[\[([^\]|#]+)(#[^\]|]*)?(?:\|([^\]]*))?\]\]|!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

class FigureSuitePlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.sourceCache = new Map(); // path → { mtime, has }

    this.addRibbonIcon('shapes', 'New figure', () => this.openNew());
    this.addCommand({ id: 'new-figure', name: 'New figure', callback: () => this.openNew() });
    this.addCommand({
      id: 'edit-figure-at-cursor',
      name: 'Edit figure at cursor',
      editorCheckCallback: (checking, editor, view) => {
        const hit = this.embedAtCursor(editor, view.file);
        if (checking) return !!hit;
        if (hit) this.openEdit(hit.file);
        return true;
      },
    });

    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor, view) => {
      const hit = this.embedAtCursor(editor, view.file);
      if (hit) menu.addItem((item) => item.setTitle('Edit figure').setIcon('shapes').onClick(() => this.openEdit(hit.file)));
      else menu.addItem((item) => item.setTitle('Insert figure…').setIcon('shapes').onClick(() => this.openNew()));
    }));
    this.registerEvent(this.app.workspace.on('file-menu', (menu, file) => {
      if (!(file instanceof TFile) || !['png', 'svg'].includes(file.extension)) return;
      menu.addItem((item) => item.setTitle('Edit with Figure Suite').setIcon('shapes').onClick(() => this.openEdit(file)));
    }));

    // hover "Edit" button on embedded figures (reading view and live preview)
    this.registerDomEvent(document, 'mouseover', (e) => this.decorateEmbed(e.target));

    this.addSettingTab(new FigureSettingTab(this.app, this));
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  saveDraft(text) {
    this.settings.draft = text;
    window.clearTimeout(this.draftTimer);
    this.draftTimer = window.setTimeout(() => this.saveSettings(), 500);
  }

  onunload() {
    document.querySelectorAll('.fs-edit-btn').forEach((b) => b.remove());
  }

  /** Fonts are only needed for drawing, so they load on first use. */
  async loadFonts() {
    if (FS.fonts) return;
    const dir = this.manifest.dir;
    const read = async (name) => new TTFont(await this.app.vault.adapter.readBinary(normalizePath(`${dir}/fonts/cm-${name}.ttf`)));
    FS.fonts = { r: await read('regular'), i: await read('italic'), b: await read('bold') };
  }

  renderSettings() {
    return {
      fontSize: Number(this.settings.fontSize) || 15,
      background: this.settings.background === 'transparent' ? 'transparent' : '#ffffff',
      listFill: this.settings.listFill,
    };
  }

  /* ---------- opening the panel ---------- */

  activeTarget() {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !view.file) return null;
    return { editor: view.getMode() === 'source' ? view.editor : null, file: view.file };
  }

  async openNew() {
    const target = this.activeTarget();
    if (!(await this.ready())) return;
    const draft = this.settings.draft && this.settings.draft.trim() ? this.settings.draft : '';
    new FigureModal(this, { source: draft, restored: !!draft, target }).open();
  }

  async openEdit(file) {
    const target = this.activeTarget();
    const source = await this.readSource(file);
    if (source == null) {
      new Notice(`${file.name} was not made with Figure Suite (no embedded source).`);
      return;
    }
    if (!(await this.ready())) return;
    new FigureModal(this, { source, target, editing: { file } }).open();
  }

  async ready() {
    try {
      await this.loadFonts();
      return true;
    } catch (err) {
      console.error(err);
      new Notice(`Figure Suite: could not load fonts from ${this.manifest.dir}/fonts (${err.message || err})`);
      return false;
    }
  }

  /** Put an embed on a line of its own (figures are block content). */
  insertOnOwnLine(editor, link) {
    const cur = editor.getCursor('from');
    const line = editor.getLine(cur.line);
    const before = line.slice(0, cur.ch).trim() ? '\n' : '';
    const end = editor.getCursor('to');
    const after = editor.getLine(end.line).slice(end.ch).trim() ? '\n' : '';
    editor.replaceSelection(`${before}${link}${after}`);
  }

  async readSource(file) {
    if (!(file instanceof TFile) || !['png', 'svg'].includes(file.extension)) return null;
    const bytes = await this.app.vault.readBinary(file);
    const source = extractSource(new Uint8Array(bytes), file.extension);
    this.sourceCache.set(file.path, { mtime: file.stat.mtime, has: source != null });
    return source;
  }

  /* ---------- links ---------- */

  /** Embed link for a new figure file; PNGs get |width so they show at 1× size. */
  embedLink(file, notePath, out) {
    const width = this.settings.insertWidth && out.ext === 'png' && out.scale !== 1 ? String(Math.round(out.width)) : '';
    let link = this.app.fileManager.generateMarkdownLink(file, notePath);
    if (width) {
      if (link.startsWith('[[')) link = link.replace(/\]\]$/, `|${width}]]`);
      else link = link.replace(/^\[([^\]]*)\]/, (m, alt) => `[${alt || file.basename}|${width}]`);
    }
    return link.startsWith('!') ? link : `!${link}`;
  }

  /** The figure embed under the cursor (or the only one on the line). */
  embedAtCursor(editor, noteFile) {
    if (!editor || !noteFile) return null;
    const cur = editor.getCursor();
    const line = editor.getLine(cur.line);
    const found = [];
    for (const m of line.matchAll(EMBED_RE)) {
      const target = m[1] || decodeURIComponent(m[5] || '');
      const file = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(target), noteFile.path);
      if (file && ['png', 'svg'].includes(file.extension)) found.push({ file, from: m.index, to: m.index + m[0].length });
    }
    if (!found.length) return null;
    return found.find((f) => cur.ch >= f.from && cur.ch <= f.to) || found[0];
  }

  /**
   * After an update the figure's natural width may change. Embeds whose
   * |width equals the old natural width (i.e. the one we wrote) follow it, in
   * every note that links the file; widths the user picked stay as they are.
   */
  async refreshLinkWidths(file, oldWidth, out) {
    if (out.ext !== 'png' || !oldWidth) return;
    const width = Math.round(out.width);
    if (width === oldWidth) return;
    const rewrite = (text, notePath) => text
      .replace(/!\[\[([^\]|#]+)(#[^\]|]*)?\|(\d+)\]\]/g, (m, target, sub, w) => {
        const f = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(target), notePath);
        return f === file && Math.abs(Number(w) - oldWidth) <= 1 ? `![[${target}${sub || ''}|${width}]]` : m;
      })
      .replace(/!\[([^\]|]*)\|(\d+)\]\(([^)\s]+)\)/g, (m, alt, w, target) => {
        let path = target;
        try { path = decodeURIComponent(target); } catch (e) { /* keep raw */ }
        const f = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(path), notePath);
        return f === file && Math.abs(Number(w) - oldWidth) <= 1 ? `![${alt}|${width}](${target})` : m;
      });
    const linked = Object.entries(this.app.metadataCache.resolvedLinks || {}).filter(([, to]) => to && to[file.path]).map(([p]) => p);
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    for (const notePath of linked) {
      const note = this.app.vault.getAbstractFileByPath(notePath);
      if (!(note instanceof TFile)) continue;
      if (view && view.file === note && view.getMode() === 'source') {
        // edit through the editor so the change is undoable and the cursor stays put
        const editor = view.editor;
        for (let i = 0; i < editor.lineCount(); i++) {
          const text = editor.getLine(i);
          const next = rewrite(text, notePath);
          if (next !== text) editor.replaceRange(next, { line: i, ch: 0 }, { line: i, ch: text.length });
        }
      } else {
        await this.app.vault.process(note, (text) => rewrite(text, notePath));
      }
    }
  }

  /* ---------- hover edit button ---------- */

  decorateEmbed(target) {
    if (!(target instanceof HTMLElement)) return;
    const embed = target.closest('.internal-embed.image-embed');
    if (!embed || embed.querySelector(':scope > .fs-edit-btn') || embed.dataset.fsChecked === 'no') return;
    const src = embed.getAttribute('src');
    if (!src) return;
    const notePath = (this.app.workspace.getActiveFile() || {}).path || '';
    const file = this.app.metadataCache.getFirstLinkpathDest(getLinkpath(src.split('|')[0]), notePath);
    if (!file || !['png', 'svg'].includes(file.extension)) return;
    const add = () => {
      if (embed.querySelector(':scope > .fs-edit-btn')) return;
      const btn = embed.createEl('button', { cls: 'fs-edit-btn', text: 'Edit', attr: { 'aria-label': 'Edit figure' } });
      btn.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); });
      btn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); this.openEdit(file); });
    };
    const cached = this.sourceCache.get(file.path);
    if (cached && cached.mtime === file.stat.mtime) {
      if (cached.has) add(); else embed.dataset.fsChecked = 'no';
      return;
    }
    this.readSource(file).then((source) => { if (source != null) add(); else embed.dataset.fsChecked = 'no'; }).catch(() => {});
  }
}

/* ---------------- settings ---------------- */

class FigureSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    const s = this.plugin.settings;
    const save = () => this.plugin.saveSettings();
    containerEl.empty();
    new Setting(containerEl).setName('Default format').setDesc('Format for new figures. PNG works everywhere (PDF export, Pandoc); SVG stays sharp at any zoom.')
      .addDropdown((d) => d.addOptions({ png: 'PNG', svg: 'SVG' }).setValue(s.format).onChange((v) => { s.format = v; save(); }));
    new Setting(containerEl).setName('PNG resolution').setDesc('Pixel density of PNG exports. Inserted links get the 1× width so the figure keeps its size in the note.')
      .addDropdown((d) => d.addOptions({ 1: '1×', 2: '2×', 3: '3×', 4: '4×' }).setValue(String(s.pngScale)).onChange((v) => { s.pngScale = Number(v); save(); }));
    new Setting(containerEl).setName('Background').setDesc('White reads well in dark themes too; transparent blends into light notes.')
      .addDropdown((d) => d.addOptions({ white: 'White', transparent: 'Transparent' }).setValue(s.background).onChange((v) => { s.background = v; save(); }));
    new Setting(containerEl).setName('Font size').setDesc('Label size in px (a figure can override it with `figure size=…`).')
      .addText((t) => t.setValue(String(s.fontSize)).onChange((v) => {
        const n = Number(v);
        t.inputEl.toggleClass('fs-invalid', !(n >= 6 && n <= 60));
        if (n >= 6 && n <= 60) { s.fontSize = n; save(); }
      }));
    new Setting(containerEl).setName('Linked-list fill').setDesc('Default fill of list / chain records (CLRS uses light gray).')
      .addDropdown((d) => d.addOptions({ light: 'Light gray', white: 'White', shade: 'Gray' }).setValue(s.listFill).onChange((v) => { s.listFill = v; save(); }));
    new Setting(containerEl).setName('File name prefix').addText((t) => t.setValue(s.prefix).onChange((v) => { s.prefix = v.trim() || 'figure'; save(); }));
    new Setting(containerEl).setName('Embed source in images').setDesc('Store the figure source inside the PNG / SVG so it can be reopened with “Edit figure”.')
      .addToggle((t) => t.setValue(s.embedSource).onChange((v) => { s.embedSource = v; save(); }));
    new Setting(containerEl).setName('Insert width in links').setDesc('Add |width to inserted PNG links so high-resolution images display at their natural size.')
      .addToggle((t) => t.setValue(s.insertWidth).onChange((v) => { s.insertWidth = v; save(); }));
  }
}

module.exports = FigureSuitePlugin;

