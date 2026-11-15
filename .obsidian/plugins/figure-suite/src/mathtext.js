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
