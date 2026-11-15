/*
 * Pseudocode Suite — flat renderer.
 * Turns the AST into the CLRS-looking DOM directly; no post-processing pass.
 */

((PS) => {

  const FONT_COMMANDS = {
    textbf: 'strong',
    textit: 'em',
    texttt: 'code',
    textrm: 'span',
    textsf: 'span',
    textup: 'span',
    textsc: 'span',
    textnormal: 'span',
    mathrm: 'span',
    mathit: 'em',
    mathbf: 'strong',
  };

  const SYMBOLS = {
    gets: '=',
    le: '≤',
    ge: '≥',
    ne: '≠',
    ldots: '…',
    cdots: '⋯',
    times: '×',
    pm: '±',
    infty: '∞',
    to: '→',
    DownTo: '↓',
    And: '∧',
    Or: '∨',
    Not: '¬',
    lfloor: '⌊',
    rfloor: '⌋',
    lceil: '⌈',
    rceil: '⌉',
    quad: ' ',
    qquad: ' ',
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // In a condition a single `=` is a comparison and shows as `==`.
  const asComparison = (tex) => PS.asComparison(tex);

  /** A field value → inline source for parseInline (math wrapped in $...$). */
  const expr = (value, isMath, comparison) => {
    const text = String(value == null ? '' : value);
    if (!text) return '';
    if (isMath && !text.includes('$')) {
      // Constants and booleans are text, not a product of variables.
      if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(text) || /^(true|false)$/i.test(text)) return `\\textsc{${text.toLowerCase()}}`;
      const math = (segment) => {
        const tex = PS.normalizeExpr(segment);
        return comparison ? asComparison(tex) : tex;
      };
      const plain = PS.normalizeOperators(text);
      // Merge-Sort(A, p, r) inside an expression renders like \Call.
      return PS.inlineWithCalls(plain, math) || `$${math(plain)}$`;
    }
    // Conditions mixing text and math ($a = b$ and $c$): `=` still means `==`.
    if (comparison) return text.replace(/\$([^$]*)\$/g, (all, inner) => `$${asComparison(inner)}$`);
    return text;
  };

  /*
   * CLRS sets constants (NIL, TRUE, FALSE) in small caps. MathJax has no \textsc,
   * so they leave the formula and render like procedure names. An operator left
   * at the cut gets an empty group so TeX still spaces it as an operator.
   */
  const CONSTANT_TEX = /\\textsc\{([A-Za-z]+)\}|\\(?:text|textrm|textup|textsf|mathrm|mathsf)\{([A-Z][A-Z0-9]+)\}/g;
  const EDGE_OP = String.raw`(?:[=<>+\-*,;:]|\\(?:ne|neq|le|leq|ge|geq|to|in|notin|gets|subset|subseteq|supset|supseteq|approx|equiv|sim|mapsto|pm|mp|cdot|times|div|land|lor|wedge|vee|cup|cap|setminus|circ|oplus|otimes)(?![A-Za-z]))`;
  const ENDS_WITH_OP = new RegExp(`${EDGE_OP}\\s*$`);
  // CLRS's narrow test-for-equality sign (clrscode3e \isequal); styled by .ps-eq.
  const IS_EQUAL = String.raw`\mathrel{\class{ps-eq}{=}\mkern1.8mu\class{ps-eq}{=}}`;
  // CLRS assignment (clrscode \gets): `=` with 1pt more room on each side. Code only;
  // in comments `=` is equality.
  const GETS = String.raw`\mathrel{\mkern1.8mu{=}\mkern1.8mu}`;
  const STARTS_WITH_OP = new RegExp(`^\\s*${EDGE_OP}`);

  function splitConstants(tex, prose) {
    const tokens = [];
    let last = 0;
    let previousConstant = false;
    const pushMath = (piece, nextConstant) => {
      let value = piece.trim();
      if (!value) return;
      if (previousConstant && STARTS_WITH_OP.test(value)) value = `{}${value}`;
      if (nextConstant && ENDS_WITH_OP.test(value)) value = `${value}{}`;
      if (!prose) value = value.replace(/(?<![=<>!:{])=(?![=}])/g, GETS);
      tokens.push({ type: 'math', value: value.replace(/(?<![=<>!])==(?!=)/g, IS_EQUAL) });
    };
    CONSTANT_TEX.lastIndex = 0;
    for (let match; (match = CONSTANT_TEX.exec(tex));) {
      pushMath(tex.slice(last, match.index), true);
      // \textsc{...} as written (\textsc{Evaluate} keeps its capital); legacy \text{NIL} → nil.
      tokens.push({ type: 'constant', value: match[1] || match[2].toLowerCase() });
      previousConstant = true;
      last = match.index + match[0].length;
    }
    pushMath(tex.slice(last), false);
    return tokens;
  }

  function skipSpace(text, index) {
    let i = index;
    while (i < text.length && /\s/.test(text[i])) i++;
    return i;
  }

  /** `$...$` from the source → TeX for MathJax. */
  function normalizeMath(source, prose) {
    const tex = PS.maskFontGroups(source, (masked) => PS.texOperators(PS.normalizeOperators(masked))
      .replace(/\\To\b/g, '\\to')
      .replace(/\\DownTo\b/g, '\\downarrow'))
      .replace(/\\textbf\{([^{}]*)\}/g, '\\mathbf{$1}')
      .replace(/\\textit\{([^{}]*)\}/g, '\\mathit{$1}');
    // Comments are prose: `$ab$` there is a product, not an identifier.
    // MathJax spaces a bare `.` as punctuation (`x. key`); in TeX and CLRS the attribute
    // dot is ordinary, so it goes in a group: `x{.}\mathit{key}`. Decimals are left alone.
    return (prose ? tex : PS.normalizeExpr(tex))
      .replace(/(?<=[A-Za-z0-9}\])])\.(?=\s*(?:[A-Za-z]|\\(?:math|text)))/g, '{.}')
      // clrscode's \twodots: the range dots of A[1 . . n].
      .replace(/\\twodots\b\s*/g, '\\mathinner{\\ldotp\\ldotp}')
      .trim();
  }

  /**
   * Split a line into tokens that can be rendered: plain text, math, styled
   * text, calls and keyword/function markers.
   */
  function parseInline(source, prose) {
    const text = String(source == null ? '' : source);
    const tokens = [];
    let buffer = '';
    const flush = () => {
      if (!buffer) return;
      tokens.push({ type: 'text', value: buffer });
      buffer = '';
    };
    const group = (at) => PS.readGroup(text, skipSpace(text, at));

    let i = 0;
    while (i < text.length) {
      const ch = text[i];

      if (ch === '$') {
        let j = i + 1;
        while (j < text.length && text[j] !== '$') j += text[j] === '\\' ? 2 : 1;
        if (j < text.length) {
          flush();
          tokens.push(...splitConstants(normalizeMath(text.slice(i + 1, j), prose), prose));
          i = j + 1;
          continue;
        }
      }

      if (ch === '\\') {
        const command = text.slice(i).match(/^\\([A-Za-z]+)/);
        if (!command) {
          // Escaped character (\{, \_, \$, ...): show it literally.
          if (i + 1 < text.length) {
            buffer += text[i + 1];
            i += 2;
            continue;
          }
        } else {
          const name = command[1];
          const after = i + command[0].length;

          // Custom markers produced by the row builder.
          if (name === 'kw' || name === 'fn') {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: name === 'kw' ? 'keyword' : 'function', value: value.value });
              i = value.end;
              continue;
            }
          }

          if (name === 'Call') {
            const nameGroup = group(after);
            const argsGroup = nameGroup ? group(nameGroup.end) : null;
            if (nameGroup && argsGroup) {
              flush();
              tokens.push({ type: 'call', name: nameGroup.value, args: argsGroup.value });
              i = argsGroup.end;
              continue;
            }
          }

          if (name === 'textsc') {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: 'constant', value: value.value });
              i = value.end;
              continue;
            }
          }

          if (FONT_COMMANDS[name]) {
            const value = group(after);
            if (value) {
              flush();
              tokens.push({ type: 'styled', tag: FONT_COMMANDS[name], value: value.value });
              i = value.end;
              continue;
            }
          }

          // Known symbols render as Unicode; unknown commands stay visible
          // minus the backslash.
          buffer += SYMBOLS[name] != null ? SYMBOLS[name] : name;
          i = after;
          continue;
        }
      }

      buffer += ch;
      i++;
    }

    flush();
    return tokens;
  }

  /*
   * A math run cut off by a call (`\Call{Max}{$i$} $+ T(n)$`) starts or ends with a binary
   * operator, which TeX would demote to unary and set tight. An empty group on that side keeps
   * it binary; the space typed between call and math is then dropped so the gap is TeX's own.
   */
  const BIN_OP = String.raw`(?:[+\-*]|\\(?:pm|mp|cdot|times|div|land|lor|wedge|vee|cup|cap|setminus|circ|oplus|otimes)(?![A-Za-z]))`;
  const LEADING_BIN = new RegExp(`^\\s*${BIN_OP}`);
  const TRAILING_BIN = new RegExp(`${BIN_OP}\\s*$`);
  const isCallToken = (token) => token && (token.type === 'call' || token.type === 'function' || token.type === 'constant');
  const isBlank = (token) => token && token.type === 'text' && !token.value.trim();

  function bridgeOperators(tokens) {
    const out = tokens.slice();
    for (let i = 0; i < out.length; i++) {
      const token = out[i];
      if (token.type !== 'math') continue;
      let value = token.value;
      const before = isBlank(out[i - 1]) ? i - 2 : i - 1;
      if (isCallToken(out[before]) && LEADING_BIN.test(value)) {
        value = `{}${value}`;
        if (before === i - 2) { out.splice(i - 1, 1); i -= 1; }
      }
      const after = isBlank(out[i + 1]) ? i + 2 : i + 1;
      if (isCallToken(out[after]) && TRAILING_BIN.test(value)) {
        value = `${value}{}`;
        if (after === i + 2) out.splice(i + 1, 1);
      }
      if (value !== token.value) out[i] = { ...token, value };
    }
    return out;
  }

  function renderInline(container, source, prose) {
    for (const token of bridgeOperators(parseInline(source, prose))) {
      switch (token.type) {
        case 'text':
          container.appendChild(document.createTextNode(token.value));
          break;
        case 'keyword':
          container.appendChild(el('span', 'ps-kw', token.value));
          break;
        case 'function':
          container.appendChild(el('span', 'ps-fn', token.value));
          break;
        case 'styled': {
          const wrapper = el(token.tag, token.tag === 'span' ? 'ps-styled' : null);
          renderInline(wrapper, token.value, prose);
          container.appendChild(wrapper);
          break;
        }
        case 'call':
          container.appendChild(el('span', 'ps-fn', token.name));
          container.appendChild(document.createTextNode('('));
          renderInline(container, token.args, prose);
          container.appendChild(document.createTextNode(')'));
          break;
        case 'constant':
          container.appendChild(el('span', 'ps-const', token.value));
          break;
        case 'math': {
          const wrapper = el('span', 'ps-math', token.value);
          wrapper.dataset.tex = token.value;
          container.appendChild(wrapper);
          break;
        }
        default:
          break;
      }
    }
  }

  /* ---------------- row building ---------------- */

  /** Inline source of a simple (non-container) statement, or null. */
  function simpleText(node) {
    switch (node.type) {
      case 'state': return expr(node.text, node.textMath);
      case 'call': return `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`;
      case 'return': return `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`;
      case 'print': return `\\kw{print} ${expr(node.text, node.textMath)}`;
      case 'break':
      case 'continue': return `\\kw{${node.type}}`;
      case 'raw': return expr(node.text, node.textMath);
      default: return null;
    }
  }

  const MERGEABLE = new Set(['state', 'call', 'return', 'print', 'break', 'continue']);

  function buildRows(nodes, depth, counter, rows) {
    const row = (text, comment, numbered = true, extra = {}) => rows.push(Object.assign({
      number: numbered ? ++counter.value : null,
      depth,
      text,
      comment: comment || null,
    }, extra));
    const body = (list) => buildRows(list || [], depth + 1, counter, rows);

    for (const node of nodes) {
      switch (node.type) {
        case 'function': {
          row(`\\fn{${node.name || ''}}(${expr(node.args, node.argsMath)})`, node.comment, false, { kind: 'function' });
          // Each procedure numbers its own lines from 1.
          const saved = counter.value;
          counter.value = 0;
          body(node.body);
          counter.value = saved;
          break;
        }

        case 'if': {
          node.branches.forEach((branch, index) => {
            const comment = index === 0 ? node.comment || branch.comment : branch.comment;
            row(`\\kw{${index === 0 ? 'if' : 'elseif'}} ${expr(branch.cond, branch.condMath, true)}`, comment);
            body(branch.body);
          });
          if (node.elseBody) {
            // CLRS: a plain first statement goes on the else line ("else x = x.right"),
            // the rest of the branch below it.
            const [first, ...rest] = node.elseBody;
            if (first && MERGEABLE.has(first.type) && !(first.comment && node.elseComment)) {
              row(`\\kw{else} ${simpleText(first)}`, node.elseComment || first.comment);
              body(rest);
            } else {
              row('\\kw{else}', node.elseComment);
              body(node.elseBody);
            }
          }
          break;
        }

        case 'while':
          row(`\\kw{while} ${expr(node.cond, node.condMath, true)}`, node.comment);
          body(node.body);
          break;

        case 'for': {
          let head;
          if (node.all) {
            // CLRS: "**for** each v ∈ G.V" (only "for" is bold). A head already written with text commands
            // (\texttt{child} of \texttt{u}) is prose; math mode would swallow its spaces.
            const parts = String(node.init || '').split(/\s+(?:in|\\in)\s+/);
            if (parts.length === 2) {
              const left = expr(parts[0], true);
              const right = expr(parts[1], true);
              const single = (value) => /^\$[^$]*\$$/.test(value);
              head = single(left) && single(right)
                ? `\\kw{for} each $${left.slice(1, -1)} \\in ${right.slice(1, -1)}$`
                : `\\kw{for} each ${left} $\\in$ ${right}`;
            } else {
              head = `\\kw{for} each ${expr(node.init, !/\\text(?:tt|rm|sf|up)?\{/.test(node.init || ''))}`;
            }
          } else {
            head = node.bound
              ? `\\kw{for} ${expr(node.init, node.initMath)} \\kw{${node.downto ? 'downto' : 'to'}} ${expr(node.bound, node.boundMath)}`
              : `\\kw{for} ${expr(node.init, node.initMath)}`;
          }
          row(head, node.comment);
          body(node.body);
          break;
        }

        case 'repeat':
          row('\\kw{repeat}', node.comment);
          body(node.body);
          row(`\\kw{until} ${expr(node.until, node.untilMath, true)}`, node.untilComment);
          break;

        case 'state':
          // CLRS numbers comment lines too.
          if (!node.text && node.comment) row('', node.comment, true, { note: true });
          else row(simpleText(node), node.comment);
          break;

        case 'require':
        case 'ensure':
          row(`\\kw{${node.type === 'require' ? 'Require' : 'Ensure'}:} ${expr(node.text, node.textMath)}`, node.comment, false);
          break;

        case 'comment': {
          const last = rows[rows.length - 1];
          if (last && !last.comment) last.comment = node.text || '';
          else row('', node.text || '', true, { note: true });
          break;
        }

        default:
          row(simpleText(node) || '', node.comment);
      }
    }
  }

  /* ---------------- public renderer ---------------- */

  /*
   * Math typesetting. Obsidian's renderMath() is synchronous; the slow part is
   * finishRenderMath() (~100 ms while MathJax refreshes its stylesheet), and a
   * block stays hidden until it is done. Rendered formulas are cached by TeX,
   * so re-renders (editing, mode switches, settings, the builder preview)
   * clone them instead and never wait.
   */
  const MATH_CACHE_LIMIT = 4000;
  const mathCache = new Map();
  let mathJaxReady = null;

  function cachedMath(tex) {
    const hit = mathCache.get(tex);
    if (!hit) return null;
    mathCache.delete(tex); // keep recently used entries last
    mathCache.set(tex, hit);
    return hit.cloneNode(true);
  }

  function rememberMath(tex, node) {
    mathCache.set(tex, node.cloneNode(true));
    if (mathCache.size > MATH_CACHE_LIMIT) mathCache.delete(mathCache.keys().next().value);
  }

  /** Same markup Obsidian puts around inline math in a note. */
  function mathElement(tex) {
    const wrapper = document.createElement('span');
    wrapper.className = 'math math-inline is-loaded';
    wrapper.appendChild(renderMath(tex, false));
    return wrapper;
  }

  /** Fallback: let a Markdown render do it. */
  async function typesetViaMarkdown(app, span, tex, sourcePath, component) {
    const holder = document.createElement('div');
    try {
      await MarkdownRenderer.render(app, `$${tex}$`, holder, sourcePath, component);
      const math = holder.querySelector('.math');
      if (!math) throw new Error('no math output');
      span.replaceChildren(math);
      rememberMath(tex, math);
    } catch (error) {
      span.classList.add('ps-math-error');
      span.textContent = `$${tex}$`;
    }
  }

  /** Typeset every `.ps-math` span under root. */
  PS.typesetMath = async function typesetMath(app, root, sourcePath, component) {
    const missing = [];
    root.querySelectorAll('.ps-math[data-tex]').forEach((span) => {
      const tex = span.dataset.tex;
      delete span.dataset.tex;
      const hit = cachedMath(tex);
      if (hit) span.replaceChildren(hit);
      else missing.push({ span, tex });
    });
    if (!missing.length) return;

    let failed = missing;
    if (typeof renderMath === 'function') {
      try {
        if (!mathJaxReady) mathJaxReady = typeof loadMathJax === 'function' ? loadMathJax() : Promise.resolve();
        await mathJaxReady;
        failed = missing.filter(({ span, tex }) => {
          try {
            span.replaceChildren(mathElement(tex));
            return false;
          } catch (error) {
            return true;
          }
        });
        await finishRenderMath();
        missing.forEach((item) => {
          if (!failed.includes(item)) rememberMath(item.tex, item.span.firstChild);
        });
      } catch (error) {
        mathJaxReady = null;
        failed = missing.filter(({ span }) => !span.querySelector('mjx-container'));
      }
    }
    await Promise.all(failed.map(({ span, tex }) => typesetViaMarkdown(app, span, tex, sourcePath, component)));
  };

  PS.buildRows = function buildRowsForModel(model) {
    const rows = [];
    buildRows(model.nodes || [], 0, { value: 0 }, rows);
    return rows;
  };

  /** AST → DOM. Math is left as `.ps-math` placeholders for PS.typesetMath. */
  PS.renderBlock = function renderBlock(model, options) {
    const settings = Object.assign({ lineNumbers: true, indentSize: '1.2em', commentDelimiter: '//' }, options || {});
    const block = el('div', 'ps-block');
    block.style.setProperty('--ps-indent', settings.indentSize || '1.2em');

    if (model.caption) {
      const title = el('div', 'ps-title');
      title.appendChild(el('span', 'ps-title-label', 'Algorithm'));
      const text = el('span', 'ps-title-text');
      renderInline(text, model.caption);
      title.appendChild(text);
      block.appendChild(title);
    }

    const grid = el('div', 'ps-grid');
    for (const row of PS.buildRows(model)) {
      const rowEl = el('div', 'ps-row');
      if (row.kind) rowEl.classList.add(`ps-row-${row.kind}`);
      rowEl.style.setProperty('--ps-depth', String(row.depth));
      rowEl.appendChild(el('span', 'ps-num', settings.lineNumbers && row.number != null ? String(row.number) : ''));
      // A comment-only line has no code cell: its comment starts at the code
      // column, at the line's indent, and runs to the right edge (CLRS).
      // A procedure header without a comment spans the comment column too, so a long
      // parameter list does not squeeze the comments of the lines below it.
      const span = row.kind === 'function' && !row.comment;
      if (!row.note) {
        const codeEl = el('span', span ? 'ps-code ps-span' : 'ps-code');
        renderInline(codeEl, row.text);
        rowEl.appendChild(codeEl);
      }
      if (span) {
        grid.appendChild(rowEl);
        continue;
      }
      const commentEl = el('span', row.note ? 'ps-comment ps-note' : 'ps-comment');
      if (row.comment) {
        // clrscode \CommentSymbol: bold, tightly kerned slashes.
        commentEl.appendChild(el('span', 'ps-comment-mark', settings.commentDelimiter || '//'));
        commentEl.appendChild(document.createTextNode(' '));
        renderInline(commentEl, row.comment, true);
      }
      rowEl.appendChild(commentEl);
      grid.appendChild(rowEl);
    }

    block.appendChild(grid);
    return block;
  };

  /** Render and typeset into `container`, revealing it once math is done. */
  PS.paint = async function paint(app, container, model, options, sourcePath, component) {
    const block = PS.renderBlock(model, options);
    block.style.visibility = 'hidden';
    container.appendChild(block);
    try {
      await PS.typesetMath(app, block, sourcePath, component);
    } finally {
      block.style.visibility = '';
    }
    return block;
  };

  PS.renderInline = renderInline;
  PS.parseInline = parseInline;
  PS.bridgeOperators = bridgeOperators;
})(PS);
