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
  const asComparison = (tex) => tex.replace(/(?<![<>=!:\\])=(?!=)/g, '==');

  /** A field value → inline source for parseInline (math wrapped in $...$). */
  const expr = (value, isMath, comparison) => {
    const text = String(value == null ? '' : value);
    if (!text) return '';
    if (isMath && !text.includes('$')) {
      // Constants and booleans are text, not a product of variables.
      if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(text)) return text;
      if (/^(true|false)$/i.test(text)) return `\\textbf{${text.toLowerCase()}}`;
      const tex = PS.normalizeExpr(PS.normalizeOperators(text));
      return `$${comparison ? asComparison(tex) : tex}$`;
    }
    // Conditions mixing text and math ($a = b$ and $c$): `=` still means `==`.
    if (comparison) return text.replace(/\$([^$]*)\$/g, (all, inner) => `$${asComparison(inner)}$`);
    return text;
  };

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
    return (prose ? tex : PS.normalizeExpr(tex)).trim();
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
          tokens.push({ type: 'math', value: normalizeMath(text.slice(i + 1, j), prose) });
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

  function renderInline(container, source, prose) {
    for (const token of parseInline(source, prose)) {
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
            row(`\\kw{${index === 0 ? 'if' : 'else if'}} ${expr(branch.cond, branch.condMath, true)}`, comment);
            body(branch.body);
          });
          if (node.elseBody) {
            // CLRS style: a single plain statement joins the else line.
            const only = node.elseBody.length === 1 ? node.elseBody[0] : null;
            if (only && MERGEABLE.has(only.type) && !only.comment && !node.elseComment) {
              row(`\\kw{else} ${simpleText(only)}`);
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
            const parts = String(node.init || '').split(/\s+in\s+/);
            // A head already written with text commands (\texttt{child} of
            // \texttt{u}) is prose; math mode would swallow its spaces.
            head = parts.length === 2
              ? `\\kw{for all} ${expr(parts[0], true)} \\kw{in} ${expr(parts[1], true)}`
              : `\\kw{for all} ${expr(node.init, !/\\text(?:tt|rm|sf|up)?\{/.test(node.init || ''))}`;
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
          if (!node.text && node.comment) row('', node.comment, false, { note: true });
          else row(simpleText(node), node.comment);
          break;

        case 'require':
        case 'ensure':
          row(`\\kw{${node.type === 'require' ? 'Require' : 'Ensure'}:} ${expr(node.text, node.textMath)}`, node.comment, false);
          break;

        case 'comment': {
          const last = rows[rows.length - 1];
          if (last && !last.comment) last.comment = node.text || '';
          else row('', node.text || '', false, { note: true });
          break;
        }

        default:
          row(simpleText(node) || '', node.comment);
      }
    }
  }

  /* ---------------- public renderer ---------------- */

  function adoptRendered(span, holder) {
    // MarkdownRenderer wraps inline content in a paragraph; keep its children.
    const source = holder.childElementCount === 1 && holder.firstElementChild.tagName === 'P'
      ? holder.firstElementChild
      : holder;
    span.replaceChildren(...source.childNodes);
  }

  async function typesetOne(app, span, tex, sourcePath, component) {
    const holder = document.createElement('div');
    try {
      await MarkdownRenderer.render(app, `$${tex}$`, holder, sourcePath, component);
      adoptRendered(span, holder);
    } catch (error) {
      span.classList.add('ps-math-error');
      span.textContent = `$${tex}$`;
    }
  }

  /**
   * Typeset every `.ps-math` span under root. Uses Obsidian's own Markdown
   * math (so exports behave like normal notes) but in one render call per
   * block: each formula becomes its own paragraph, mapped back by position.
   */
  PS.typesetMath = async function typesetMath(app, root, sourcePath, component) {
    const spans = Array.from(root.querySelectorAll('.ps-math[data-tex]'));
    if (!spans.length) return;
    const texts = spans.map((span) => {
      const tex = span.dataset.tex;
      delete span.dataset.tex;
      return tex;
    });

    let pending = spans.map((span, index) => index);
    try {
      const holder = document.createElement('div');
      await MarkdownRenderer.render(app, texts.map((tex) => `$${tex}$`).join('\n\n'), holder, sourcePath, component);
      const paragraphs = Array.from(holder.children);
      if (paragraphs.length === spans.length) {
        pending = pending.filter((index) => {
          const paragraph = paragraphs[index];
          const ok = paragraph.tagName === 'P' && paragraph.childElementCount === 1
            && paragraph.firstElementChild.classList.contains('math')
            && paragraph.textContent.trim() === paragraph.firstElementChild.textContent.trim();
          if (ok) spans[index].replaceChildren(paragraph.firstElementChild);
          return !ok;
        });
      }
    } catch (error) { /* fall back below */ }

    // Anything the batch could not map is rendered on its own.
    await Promise.all(pending.map((index) => typesetOne(app, spans[index], texts[index], sourcePath, component)));
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
      if (!row.note) {
        const codeEl = el('span', 'ps-code');
        renderInline(codeEl, row.text);
        rowEl.appendChild(codeEl);
      }
      const commentEl = el('span', row.note ? 'ps-comment ps-note' : 'ps-comment');
      if (row.comment) {
        commentEl.appendChild(document.createTextNode(`${settings.commentDelimiter || '//'} `));
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
})(PS);
