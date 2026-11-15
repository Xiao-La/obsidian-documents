/*
 * Pseudocode Suite — plugin entry.
 */

const DEFAULT_SETTINGS = {
  lineNumbers: true,
  indentSize: '1.2em',
  commentDelimiter: '//',
};

const CSS_LENGTH = /^\d*\.?\d+(?:em|rem|px|ch|pt)$/;

// [file, family, style, weight, format]. The small caps are Latin Modern Roman Caps
// (cmcsc10's design, GUST Font License): real small-cap glyphs for NIL and procedure
// names instead of the browser's thin, shrunken imitation.
const FONT_FACES = [
  ['cm-regular.ttf', 'CM Pseudocode', 'normal', 'normal', 'truetype'],
  ['cm-italic.ttf', 'CM Pseudocode', 'italic', 'normal', 'truetype'],
  ['cm-bold.ttf', 'CM Pseudocode', 'normal', 'bold', 'truetype'],
  ['cm-bolditalic.ttf', 'CM Pseudocode', 'italic', 'bold', 'truetype'],
  ['cm-smallcaps.otf', 'CM Pseudocode SC', 'normal', 'normal', 'opentype'],
];

/* ---------------- fences ---------------- */

const FENCE_OPEN = /^((?:[ \t]*>)*[ \t]*)(`{3,}|~{3,})[ \t]*pseudo[ \t]*$/;

/**
 * Every ```pseudo fence in `lines`: { start, end, prefix, source }, with
 * start/end the fence lines. `prefix` is the blockquote/indent prefix the
 * content lines carry (fences inside callouts or lists).
 */
function scanFences(lines) {
  const fences = [];
  for (let i = 0; i < lines.length; i++) {
    const open = lines[i].match(FENCE_OPEN);
    if (!open) continue;
    const prefix = open[1];
    const depth = (prefix.match(/>/g) || []).length;
    const marker = open[2];
    const close = new RegExp(`^(?:[ \\t]*>){${depth}}[ \\t]*${marker[0] === '`' ? '`' : '~'}{${marker.length},}[ \\t]*$`);
    const strip = depth
      ? new RegExp(`^(?:[ \\t]*>){${depth}} ?`)
      : new RegExp(`^[ \\t]{0,${prefix.length}}`);
    let end = i + 1;
    while (end < lines.length && !close.test(lines[end])) end++;
    if (end >= lines.length) break; // unterminated
    fences.push({
      start: i,
      end,
      prefix: depth ? prefix.replace(/[ \t]*$/, ' ') : prefix,
      source: lines.slice(i + 1, end).map((line) => line.replace(strip, '')).join('\n'),
    });
    i = end;
  }
  return fences;
}

const sameSource = (a, b) => String(a || '').replace(/\s+/g, ' ').trim() === String(b || '').replace(/\s+/g, ' ').trim();

/** The fence holding `source`, preferring the one at (or nearest) `hint`. */
function locateFence(lines, source, hint) {
  const matches = scanFences(lines).filter((fence) => sameSource(fence.source, source));
  if (!matches.length) return null;
  if (!Number.isInteger(hint)) return matches[0];
  return matches.reduce((best, fence) => (Math.abs(fence.start - hint) < Math.abs(best.start - hint) ? fence : best));
}

/** Replacement lines for a fence's content, re-applying its prefix. */
function prefixed(latex, prefix) {
  return latex.split('\n').map((line) => (line || !prefix.trim() ? prefix + line : prefix.replace(/[ \t]+$/, '')));
}

/* ---------------- settings ---------------- */

class SettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    const { settings } = this.plugin;

    new Setting(containerEl)
      .setName('Show line numbers')
      .setDesc('Number each statement; procedure headers stay unnumbered and every procedure restarts at 1.')
      .addToggle((toggle) => toggle
        .setValue(settings.lineNumbers)
        .onChange((value) => this.plugin.updateSettings({ lineNumbers: value })));

    new Setting(containerEl)
      .setName('Indent width')
      .setDesc('Indent per nesting level, e.g. 1.2em or 16px.')
      .addText((text) => {
        text.setPlaceholder(DEFAULT_SETTINGS.indentSize).setValue(settings.indentSize);
        text.onChange((value) => {
          const clean = value.trim();
          const valid = !clean || CSS_LENGTH.test(clean);
          text.inputEl.toggleClass('ps-invalid', !valid);
          if (valid) this.plugin.updateSettings({ indentSize: clean || DEFAULT_SETTINGS.indentSize }, true);
        });
      });

    new Setting(containerEl)
      .setName('Comment prefix')
      .setDesc('Shown before trailing comments.')
      .addText((text) => text
        .setPlaceholder(DEFAULT_SETTINGS.commentDelimiter)
        .setValue(settings.commentDelimiter)
        .onChange((value) => this.plugin.updateSettings({ commentDelimiter: value || DEFAULT_SETTINGS.commentDelimiter }, true)));
  }
}

/* ---------------- plugin ---------------- */

class PseudocodeSuitePlugin extends Plugin {
  async onload() {
    await this.loadSettings();
    this.blocks = new Set();
    this.installFonts();

    this.registerMarkdownCodeBlockProcessor('pseudo', (source, el, ctx) => this.renderCodeBlock(source, el, ctx));
    this.addSettingTab(new SettingsTab(this.app, this));

    this.addRibbonIcon('square-pen', 'Insert pseudocode block', () => this.openInsert(null));
    this.addCommand({
      id: 'insert-pseudocode-block',
      name: 'Insert pseudocode block',
      editorCallback: (editor) => this.openInsert(editor),
    });
    this.addCommand({
      id: 'edit-pseudocode-block',
      name: 'Edit pseudocode block under cursor',
      editorCheckCallback: (checking, editor, view) => {
        const fence = this.fenceAtCursor(editor);
        if (checking) return !!fence;
        if (fence) this.openEditorFence(editor, fence, view);
        return true;
      },
    });
    this.registerEvent(this.app.workspace.on('editor-menu', (menu, editor, view) => {
      const fence = this.fenceAtCursor(editor);
      if (!fence) return;
      menu.addItem((item) => item
        .setTitle('Edit pseudocode block')
        .setIcon('square-pen')
        .onClick(() => this.openEditorFence(editor, fence, view)));
    }));
  }

  /* ---------------- settings ---------------- */

  async loadSettings() {
    const data = (await this.loadData()) || {};
    const legacy = data.jsSettings || {};
    const defined = (object) => Object.fromEntries(Object.entries(object).filter(([, value]) => value != null && value !== ''));
    this.settings = Object.assign({}, DEFAULT_SETTINGS, defined({
      lineNumbers: data.lineNumbers,
      indentSize: data.indentSize,
      commentDelimiter: data.commentDelimiter,
    }), defined({
      lineNumbers: legacy.lineNumber,
      indentSize: legacy.indentSize,
      commentDelimiter: legacy.commentDelimiter,
    }));
    if (!CSS_LENGTH.test(this.settings.indentSize)) this.settings.indentSize = DEFAULT_SETTINGS.indentSize;
    if (data.jsSettings) await this.saveData(this.settings);
  }

  /** Save, then repaint every rendered block (debounced while typing). */
  async updateSettings(patch, debounce = false) {
    Object.assign(this.settings, patch);
    await this.saveData(this.settings);
    clearTimeout(this.refreshTimer);
    if (debounce) this.refreshTimer = setTimeout(() => this.refreshAll(), 400);
    else this.refreshAll();
  }

  refreshAll() {
    this.blocks.forEach((entry) => this.paintEntry(entry));
  }

  /* ---------------- fonts ---------------- */

  /**
   * styles.css is injected as text, so a relative url() there does not
   * resolve to the plugin folder. Register the bundled fonts with their real
   * resource URLs instead (also in popout windows).
   */
  installFonts() {
    const css = FONT_FACES.map(([file, family, style, weight, format]) => {
      const url = this.app.vault.adapter.getResourcePath(`${this.manifest.dir}/fonts/${file}`);
      return `@font-face { font-family: '${family}'; font-style: ${style}; font-weight: ${weight}; `
        + `font-display: swap; src: url("${url}") format('${format}'); }`;
    }).join('\n');
    const inject = (doc) => {
      if (!doc || doc.getElementById('pseudocode-suite-fonts')) return;
      const style = doc.createElement('style');
      style.id = 'pseudocode-suite-fonts';
      style.textContent = css;
      doc.head.appendChild(style);
      this.register(() => style.remove());
    };
    inject(document);
    this.registerEvent(this.app.workspace.on('window-open', (win) => inject(win.doc)));
  }

  /* ---------------- rendering ---------------- */

  async renderCodeBlock(source, el, ctx) {
    const entry = { source, el, ctx, child: new MarkdownRenderChild(el), component: null, token: 0 };
    ctx.addChild(entry.child);
    this.blocks.add(entry);
    entry.child.register(() => this.blocks.delete(entry));
    await this.paintEntry(entry);
  }

  async paintEntry(entry) {
    const token = ++entry.token;
    if (entry.component) entry.child.removeChild(entry.component);
    const component = new Component();
    entry.component = component;
    entry.child.addChild(component);

    const holder = document.createElement('div');
    try {
      const block = await PS.paint(this.app, holder, PS.parseLatex(entry.source), this.settings, entry.ctx.sourcePath, component);
      this.addEditButton(block, entry);
    } catch (error) {
      holder.replaceChildren();
      holder.createDiv({ cls: 'ps-error', text: `Pseudocode render failed: ${error && error.message ? error.message : error}` });
    }
    if (token !== entry.token) return; // a newer paint replaced this one
    entry.el.replaceChildren(...holder.childNodes);
  }

  addEditButton(block, entry) {
    const button = block.createEl('button', {
      cls: 'ps-edit-btn',
      attr: { type: 'button', 'aria-label': 'Edit in Pseudocode Builder' },
    });
    setIcon(button.createSpan('ps-edit-icon'), 'pencil');
    button.createSpan({ text: 'Edit' });
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      // Ask at click time: the note may have changed since rendering.
      const section = entry.ctx.getSectionInfo ? entry.ctx.getSectionInfo(entry.el) : null;
      this.openFileFence(entry.ctx.sourcePath, entry.source, section ? section.lineStart : null);
    });
  }

  /* ---------------- opening the builder ---------------- */

  openBuilder(model, sourcePath, onSave) {
    new PS.BuilderModal(this.app, { model, settings: this.settings, sourcePath, onSave }).open();
  }

  /** Edit a block of a file on disk (reading view, live preview, embeds). */
  async openFileFence(path, source, hint) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      new Notice(`File not found: ${path}`);
      return;
    }
    const fence = locateFence((await this.app.vault.read(file)).split(/\r?\n/), source, hint);
    if (!fence) {
      new Notice('Could not find this pseudocode block in the note. Reopen the note and try again.');
      return;
    }
    this.openBuilder(PS.parseLatex(fence.source), path, async (latex) => {
      let found = true;
      await this.app.vault.process(file, (content) => {
        const eol = content.includes('\r\n') ? '\r\n' : '\n';
        const lines = content.split(/\r?\n/);
        const current = locateFence(lines, fence.source, fence.start);
        if (!current) {
          found = false;
          return content;
        }
        return lines.slice(0, current.start + 1)
          .concat(prefixed(latex, current.prefix), lines.slice(current.end))
          .join(eol);
      });
      if (!found) throw new Error('the block changed in the meantime');
      new Notice('Pseudocode updated');
    });
  }

  fenceAtCursor(editor) {
    if (!editor) return null;
    const { line } = editor.getCursor();
    const lines = editor.getValue().split(/\r?\n/);
    return scanFences(lines).find((fence) => fence.start <= line && line <= fence.end) || null;
  }

  openEditorFence(editor, fence, view) {
    const path = view && view.file ? view.file.path : this.app.workspace.getActiveFile()?.path || '';
    this.openBuilder(PS.parseLatex(fence.source), path, (latex) => {
      // The note may have been edited while the builder was open.
      const current = locateFence(editor.getValue().split(/\r?\n/), fence.source, fence.start);
      if (!current) throw new Error('the block changed in the meantime');
      editor.replaceRange(
        `${prefixed(latex, current.prefix).join('\n')}\n`,
        { line: current.start + 1, ch: 0 },
        { line: current.end, ch: 0 },
      );
      new Notice('Pseudocode updated');
    });
  }

  openInsert(editor) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const target = editor || (view && view.getMode() === 'source' ? view.editor : null);
    const file = view ? view.file : this.app.workspace.getActiveFile();
    this.openBuilder({ caption: '', nodes: [] }, file ? file.path : '', async (latex) => {
      const block = `\`\`\`pseudo\n${latex}\n\`\`\``;
      if (target) {
        // Fences must start and end on their own lines.
        const from = target.getCursor('from');
        const to = target.getCursor('to');
        const before = target.getLine(from.line).slice(0, from.ch).trim() ? '\n' : '';
        const after = target.getLine(to.line).slice(to.ch).trim() ? '\n' : '';
        target.replaceSelection(`${before}${block}\n${after}`);
        return;
      }
      if (!file) throw new Error('open a note before inserting');
      await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, '')}\n\n${block}\n`);
      new Notice('Pseudocode appended to the end of the note');
    });
  }
}

module.exports = PseudocodeSuitePlugin;
