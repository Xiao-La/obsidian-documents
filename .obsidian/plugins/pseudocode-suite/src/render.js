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
    le: '\u2264',
    ge: '\u2265',
    ne: '\u2260',
    ldots: '\u2026',
    cdots: '\u22ef',
    times: '\u00d7',
    pm: '\u00b1',
    infty: '\u221e',
    to: '\u2192',
    DownTo: '\u2193',
    And: '\u2227',
    Or: '\u2228',
    Not: '\u00ac',
    lfloor: '\u230a',
    rfloor: '\u230b',
    lceil: '\u2308',
    rceil: '\u2309',
    quad: ' ',
    qquad: ' ',
  };

  const ESCAPED = {
    '{': '{', '}': '}', '_': '_', '&': '&', '%': '%', '$': '$', '#': '#', '\\': '\\',
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  // Font commands already present keep their argument as written.
  const FONT_GROUP = /\\(?:text|textbf|textit|texttt|textrm|textsf|textup|mathrm|mathit|mathbf|mathsf|mathtt|operatorname)\{[^{}]*\}/g;

  /**
   * Apply the builder's typesetting rules (PS.normalizeExpr) to a math
   * fragment: multi-letter identifiers upright, all-caps constants as text,
   * digits after a letter as subscripts. The parser strips \text/\mathit from
   * the source, so without this NIL would render as the product N·I·L.
   */
  function upright(tex) {
    const kept = [];
    const masked = String(tex).replace(FONT_GROUP, (group) => `\u0000${kept.push(group) - 1}\u0001`);
    return PS.normalizeExpr(masked).replace(/\u0000(\d+)\u0001/g, (all, index) => kept[Number(index)]);
  }

  const expr = (value, isMath, comparison) => {
    const text = String(value == null ? '' : value);
    if (!text) return '';
    if (isMath && !text.includes('$')) {
      // Constants and booleans are text, not a product of variables.
      if (/^[A-Z]{2,}[A-Z0-9_-]*$/.test(text)) return text;
      if (/^(true|false)$/i.test(text)) return `\\textbf{${text.toLowerCase()}}`;
      let tex = upright(text)
        .replace(/:=/g, '=')
        .replace(/<-|←/g, '=')
        .replace(/<>/g, '\\ne ')
        .replace(/&&/g, '\\land ')
        .replace(/\|\|/g, '\\lor ')
        .replace(/!=/g, '\\ne ')
        .replace(/<=/g, '\\le ')
        .replace(/>=/g, '\\ge ')
        .replace(/->/g, '\\to ')
        .replace(/(?<!\\)\b(and|or|not)\b/g, (all, word) => (
          word === 'and' ? '\\land ' : word === 'or' ? '\\lor ' : '\\lnot '
        ));
      if (comparison) tex = tex.replace(/(?<![<>=!:])=(?!=)/g, '==');
      return `$${tex}$`;
    }
    // Conditions mixing text and math ($a = b$ and $c$): `=` still means `==`.
    if (comparison) {
      return text.replace(/\$([^$]*)\$/g, (all, inner) => `$${inner.replace(/(?<![<>=!:])=(?!=)/g, '==')}$`);
    }
    return text;
  };

  function skipSpace(text, index) {
    let i = index;
    while (i < text.length && /\s/.test(text[i])) i++;
    return i;
  }

  function normalizeMath(source, prose) {
    const tex = (String(source)
      .replace(/\\gets\b/g, '=')
      .replace(/:=/g, '=')
      .replace(/<-|←/g, '=')
      .replace(/<>/g, '\\ne ')
      .replace(/&&/g, '\\land ')
      .replace(/\|\|/g, '\\lor ')
      .replace(/!=/g, '\\ne ')
      .replace(/<=/g, '\\le ')
      .replace(/>=/g, '\\ge ')
      .replace(/->/g, '\\to ')
      .replace(/(?<!\\)\b(and|or|not)\b/g, (all, word) => (
        word === 'and' ? '\\land ' : word === 'or' ? '\\lor ' : '\\lnot '
      ))
      .replace(/\\And\b/g, '\\land')
      .replace(/\\Or\b/g, '\\lor')
      .replace(/\\Not\b/g, '\\lnot')
      .replace(/\\To\b/g, '\\to')
      .replace(/\\DownTo\b/g, '\\downarrow')
      .replace(/\\textbf\{([^{}]*)\}/g, '\\mathbf{$1}')
      .replace(/\\textit\{([^{}]*)\}/g, '\\mathit{$1}')
      .replace(/\\text\{([^{}]*)\}/g, '\\text{$1}'));
    // Comments are prose: `$ab$` there is a product, not an identifier.
    return prose ? tex : upright(tex);
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

    let i = 0;
    while (i < text.length) {
      const ch = text[i];

      if (ch === '$') {
        let j = i + 1;
        let closed = false;
        while (j < text.length) {
          if (text[j] === '\\') { j += 2; continue; }
          if (text[j] === '$') { closed = true; break; }
          j++;
        }
        if (closed) {
          flush();
          tokens.push({ type: 'math', value: normalizeMath(text.slice(i + 1, j), prose) });
          i = j + 1;
          continue;
        }
        buffer += ch;
        i++;
        continue;
      }

      if (ch === '\\') {
        const command = text.slice(i).match(/^\\([A-Za-z]+)/);
        if (!command) {
          const next = text[i + 1];
          if (next != null) {
            buffer += ESCAPED[next] != null ? ESCAPED[next] : next;
            i += 2;
            continue;
          }
        }
        if (command) {
          const name = command[1];
          const after = i + command[0].length;

          // Custom markers produced by the row builder.
          if (name === 'kw' || name === 'fn') {
            const group = PS.readGroup(text, skipSpace(text, after));
            if (group) {
              flush();
              tokens.push({ type: name === 'kw' ? 'keyword' : 'function', value: group.value });
              i = group.end;
              continue;
            }
          }

          if (name === 'Call') {
            const nameGroup = PS.readGroup(text, skipSpace(text, after));
            const argsGroup = nameGroup ? PS.readGroup(text, skipSpace(text, nameGroup.end)) : null;
            if (nameGroup && argsGroup) {
              flush();
              tokens.push({ type: 'call', name: nameGroup.value, args: argsGroup.value });
              i = argsGroup.end;
              continue;
            }
          }

          if (FONT_COMMANDS[name]) {
            const group = PS.readGroup(text, skipSpace(text, after));
            if (group) {
              flush();
              tokens.push({ type: 'styled', tag: FONT_COMMANDS[name], value: group.value });
              i = group.end;
              continue;
            }
          }

          if (SYMBOLS[name] != null) {
            buffer += SYMBOLS[name];
            i = after;
            continue;
          }

          // Unknown command: keep it visible, minus the backslash.
          buffer += name;
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

  async function renderInline(app, container, source, sourcePath, component, prose) {
    const tokens = parseInline(source, prose);
    for (const token of tokens) {
      if (token.type === 'text') {
        container.appendChild(document.createTextNode(token.value));
      } else if (token.type === 'keyword') {
        container.appendChild(el('span', 'ps-kw', token.value));
      } else if (token.type === 'function') {
        container.appendChild(el('span', 'ps-fn', token.value));
      } else if (token.type === 'styled') {
        const wrapper = el(token.tag, token.tag === 'span' ? 'ps-styled' : null);
        await renderInline(app, wrapper, token.value, sourcePath, component, prose);
        container.appendChild(wrapper);
      } else if (token.type === 'call') {
        container.appendChild(el('span', 'ps-fn', token.name));
        container.appendChild(document.createTextNode('('));
        await renderInline(app, container, token.args, sourcePath, component, prose);
        container.appendChild(document.createTextNode(')'));
      } else if (token.type === 'math') {
        const wrapper = el('span', 'ps-math');
        wrapper.dataset.tex = token.value;
        wrapper.textContent = token.value;
        container.appendChild(wrapper);
      }
    }
  }

  function unwrapSingleParagraph(container) {
    if (container.childElementCount === 1 && container.firstElementChild.tagName === 'P') {
      const paragraph = container.firstElementChild;
      while (paragraph.firstChild) container.insertBefore(paragraph.firstChild, paragraph);
      paragraph.remove();
    }
  }

  /* ---------------- row building ---------------- */

  function simpleText(node) {
    switch (node.type) {
      case 'state': return expr(node.text, node.textMath);
      case 'call': return `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`;
      case 'return': return `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`;
      case 'print': return `\\kw{print} ${expr(node.text, node.textMath)}`;
      case 'break': return '\\kw{break}';
      case 'continue': return '\\kw{continue}';
      default: return node.text || '';
    }
  }

  const SIMPLE = new Set(['state', 'call', 'return', 'print', 'break', 'continue']);

  function buildRows(nodes, depth, counter, rows) {
    for (const node of nodes) {
      switch (node.type) {
        case 'function': {
          rows.push({
            number: null,
            depth,
            text: `\\fn{${node.name || ''}}(${expr(node.args, node.argsMath)})`,
            comment: node.comment || null,
            kind: 'function',
          });
          const saved = counter.value;
          counter.value = 0;
          buildRows(node.body || [], depth + 1, counter, rows);
          counter.value = saved;
          break;
        }

        case 'if': {
          node.branches.forEach((branch, index) => {
            rows.push({
              number: ++counter.value,
              depth,
              text: `\\kw{${index === 0 ? 'if' : 'else if'}} ${expr(branch.cond, branch.condMath, true)}`,
              comment: (index === 0 ? node.comment || branch.comment : branch.comment) || null,
            });
            buildRows(branch.body || [], depth + 1, counter, rows);
          });
          if (node.elseBody) {
            const only = node.elseBody.length === 1 ? node.elseBody[0] : null;
            if (only && SIMPLE.has(only.type) && !only.comment && !node.elseComment) {
              rows.push({
                number: ++counter.value,
                depth,
                text: `\\kw{else} ${simpleText(only)}`,
                comment: null,
              });
            } else {
              rows.push({ number: ++counter.value, depth, text: '\\kw{else}', comment: node.elseComment || null });
              buildRows(node.elseBody, depth + 1, counter, rows);
            }
          }
          break;
        }

        case 'while':
          rows.push({ number: ++counter.value, depth, text: `\\kw{while} ${expr(node.cond, node.condMath, true)}`, comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          break;

        case 'for': {
          if (node.all) {
            const parts = String(node.init || '').split(/\s+in\s+/);
            // A head already written with text commands (\texttt{child} of
            // \texttt{u}) is prose; math mode would swallow its spaces.
            const head = parts.length === 2
              ? `${expr(parts[0], true)} \\kw{in} ${expr(parts[1], true)}`
              : expr(node.init, !/\\text(?:tt|rm|sf|up)?\{/.test(node.init || ''));
            rows.push({ number: ++counter.value, depth, text: `\\kw{for all} ${head}`, comment: node.comment || null });
            buildRows(node.body || [], depth + 1, counter, rows);
            break;
          }
          const head = node.bound
            ? `${expr(node.init, node.initMath)} \\kw{${node.downto ? 'downto' : 'to'}} ${expr(node.bound, node.boundMath)}`
            : expr(node.init, node.initMath);
          rows.push({ number: ++counter.value, depth, text: `\\kw{for} ${head}`, comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          break;
        }

        case 'repeat':
          rows.push({ number: ++counter.value, depth, text: '\\kw{repeat}', comment: node.comment || null });
          buildRows(node.body || [], depth + 1, counter, rows);
          rows.push({ number: ++counter.value, depth, text: `\\kw{until} ${expr(node.until, node.untilMath, true)}`, comment: null });
          break;

        case 'state':
          if (!node.text && node.comment) {
            rows.push({ number: null, depth, text: '', comment: node.comment });
          } else {
            rows.push({ number: ++counter.value, depth, text: expr(node.text, node.textMath), comment: node.comment || null });
          }
          break;

        case 'call':
          rows.push({
            number: ++counter.value,
            depth,
            text: `\\Call{${node.name || ''}}{${expr(node.args, node.argsMath)}}`,
            comment: node.comment || null,
          });
          break;

        case 'return':
          rows.push({ number: ++counter.value, depth, text: `\\kw{return}${node.text ? ` ${expr(node.text, node.textMath)}` : ''}`, comment: node.comment || null });
          break;

        case 'print':
          rows.push({ number: ++counter.value, depth, text: `\\kw{print} ${expr(node.text, node.textMath)}`, comment: node.comment || null });
          break;

        case 'break':
        case 'continue':
          rows.push({ number: ++counter.value, depth, text: `\\kw{${node.type}}`, comment: node.comment || null });
          break;

        case 'require':
        case 'ensure':
          rows.push({ number: null, depth, text: `\\kw{${node.type === 'require' ? 'Require' : 'Ensure'}:} ${expr(node.text, node.textMath)}`, comment: null });
          break;

        case 'comment':
          if (rows.length) {
            rows[rows.length - 1].comment = node.text || '';
          } else {
            rows.push({ number: null, depth, text: '', comment: node.text || '' });
          }
          break;

        default:
          rows.push({ number: ++counter.value, depth, text: expr(node.text, node.textMath), comment: node.comment || null });
      }
    }
  }

  /* ---------------- public renderer ---------------- */

  PS.typesetMath = async function typesetMath(app, root, sourcePath, component) {
    const spans = Array.from(root.querySelectorAll('.ps-math[data-tex]'));
    await Promise.all(spans.map(async (span) => {
      const tex = span.dataset.tex;
      delete span.dataset.tex;
      const holder = document.createElement('span');
      holder.className = 'ps-math-render';
      try {
        await MarkdownRenderer.render(app, `$${tex}$`, holder, sourcePath, component);
        unwrapSingleParagraph(holder);
        span.textContent = '';
        while (holder.firstChild) span.appendChild(holder.firstChild);
      } catch (error) {
        span.classList.add('ps-math-error');
        span.textContent = `$${tex}$`;
      }
    }));
  };

  PS.buildRows = function buildRowsForModel(model) {
    const rows = [];
    buildRows(model.nodes || [], 0, { value: 0 }, rows);
    return rows;
  };

  PS.renderBlock = async function renderBlock(app, model, options, sourcePath, component) {
    const settings = Object.assign({ lineNumbers: true, indentSize: '1.2em' }, options || {});
    const block = el('div', 'ps-block');
    block.style.setProperty('--ps-indent', settings.indentSize || '1.2em');

    if (model.caption) {
      const title = el('div', 'ps-title');
      title.appendChild(document.createTextNode('Algorithm '));
      await renderInline(app, title, model.caption, sourcePath, component);
      block.appendChild(title);
    }

    const grid = el('div', 'ps-grid');
    const rows = PS.buildRows(model);

    for (const row of rows) {
      const rowEl = el('div', 'ps-row');
      rowEl.style.setProperty('--ps-depth', String(row.depth));
      const numberEl = el('span', 'ps-num', settings.lineNumbers && row.number != null ? String(row.number) : '');
      const codeEl = el('span', 'ps-code');
      codeEl.style.paddingLeft = `calc(var(--ps-indent) * ${row.depth})`;
      await renderInline(app, codeEl, row.text, sourcePath, component);
      const commentEl = el('span', 'ps-comment');
      if (row.comment) {
        commentEl.appendChild(document.createTextNode(`${settings.commentDelimiter || '//'} `));
        await renderInline(app, commentEl, row.comment, sourcePath, component, true);
      }
      rowEl.appendChild(numberEl);
      rowEl.appendChild(codeEl);
      rowEl.appendChild(commentEl);
      grid.appendChild(rowEl);
    }

    block.appendChild(grid);
    return block;
  };

  PS.renderInline = renderInline;
  PS.parseInline = parseInline;
})(PS);
