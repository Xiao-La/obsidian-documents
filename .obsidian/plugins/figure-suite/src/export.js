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
