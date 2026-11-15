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
