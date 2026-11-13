/*
 * Pseudocode Suite — plugin entry.
 */

const DEFAULT_SETTINGS = {
  lineNumbers: true,
  indentSize: '1.2em',
  commentDelimiter: '//',
};

const FENCE_OPEN = /^```\s*pseudo\s*$/;
const FENCE_CLOSE = /^```\s*$/;

class SettingsTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl('h2', { text: 'Pseudocode Suite' });

    new Setting(containerEl)
      .setName('Show line numbers')
      .setDesc('Show a number before each statement; procedure headers stay unnumbered.')
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.lineNumbers)
        .onChange(async (value) => {
          this.plugin.settings.lineNumbers = value;
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));

    new Setting(containerEl)
      .setName('Indent width')
      .setDesc('Indent per nesting level, e.g. 1.2em or 16px.')
      .addText((text) => text
        .setValue(this.plugin.settings.indentSize)
        .onChange(async (value) => {
          this.plugin.settings.indentSize = value || '1.2em';
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));

    new Setting(containerEl)
      .setName('Comment prefix')
      .setDesc('Prefix for trailing comments, default //.')
      .addText((text) => text
        .setValue(this.plugin.settings.commentDelimiter)
        .onChange(async (value) => {
          this.plugin.settings.commentDelimiter = value;
          await this.plugin.saveSettings();
          this.plugin.refreshAll();
        }));
  }
}

class PseudocodeSuitePlugin extends Plugin {
  async onload() {
    await this.loadSettings();

    this.registerMarkdownCodeBlockProcessor('pseudo', (source, el, ctx) => this.renderCodeBlock(source, el, ctx));
    this.registerMarkdownPostProcessor((el, ctx) => this.attachEditButtons(el, ctx));
    this.addSettingTab(new SettingsTab(this.app, this));

    this.addRibbonIcon('square-pen', 'Insert pseudocode block', () => this.openInsert(null));
    this.addCommand({
      id: 'insert-pseudocode-block',
      name: 'Insert pseudocode block',
      editorCallback: (editor) => this.openInsert(editor),
    });
    this.addCommand({
      id: 'edit-pseudocode-block',
      name: 'Edit pseudocode block',
      editorCallback: (editor) => this.openEdit(editor),
    });
  }

  async loadSettings() {
    const data = (await this.loadData()) || {};
    const legacy = data.jsSettings || {};
    this.settings = Object.assign({}, DEFAULT_SETTINGS, {
      lineNumbers: legacy.lineNumber != null ? legacy.lineNumber : data.lineNumbers,
      indentSize: legacy.indentSize || data.indentSize,
      commentDelimiter: legacy.commentDelimiter || data.commentDelimiter,
    });
    if (this.settings.lineNumbers == null) this.settings.lineNumbers = DEFAULT_SETTINGS.lineNumbers;
    if (!this.settings.indentSize) this.settings.indentSize = DEFAULT_SETTINGS.indentSize;
    if (!this.settings.commentDelimiter) this.settings.commentDelimiter = DEFAULT_SETTINGS.commentDelimiter;
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  /** Re-render every open markdown view after a setting change. */
  refreshAll() {
    this.app.workspace.getLeavesOfType('markdown').forEach((leaf) => {
      const view = leaf.view;
      if (view && typeof view.previewMode !== 'undefined' && view.previewMode) {
        try { view.previewMode.rerender(true); } catch (error) { /* ignore */ }
      }
    });
  }

  async renderCodeBlock(source, el, ctx) {
    try {
      const ast = PS.parseLatex(source);
      const component = new Component();
      ctx.addChild(component);
      const block = await PS.renderBlock(this.app, ast, this.settings, ctx.sourcePath, component);
      block.style.visibility = 'hidden';
      el.appendChild(block);
      try {
        await PS.typesetMath(this.app, block, ctx.sourcePath, component);
      } finally {
        block.style.visibility = '';
      }

      const section = ctx.getSectionInfo ? ctx.getSectionInfo(el) : null;
      if (section) {
        const fence = this.fenceFor(section, source);
        if (fence) this.addEditButton(block, ctx.sourcePath, fence);
      }
    } catch (error) {
      const box = el.createDiv({ cls: 'ps-error' });
      box.setText(`Pseudocode render failed: ${error && error.message ? error.message : error}`);
    }
  }

  /* ---------------- edit buttons ---------------- */

  fenceFor(section, source) {
    const lines = String(section.text || '').split('\n');
    const offsets = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        offsets.push({ start, end: i, content: lines.slice(start + 1, i).join('\n').trim() });
        start = -1;
      }
    }
    if (!offsets.length) return null;
    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const wanted = normalize(source);
    let index = offsets.findIndex((fence) => normalize(fence.content) === wanted);
    if (index < 0) index = 0;
    const base = section.lineStart - offsets[0].start;
    const chosen = offsets[index];
    return { start: base + chosen.start, end: base + chosen.end, source: source };
  }

  addEditButton(block, path, fence) {
    if (!fence || block.querySelector(':scope > .ps-edit-btn')) return;
    block.classList.add('ps-has-btn');
    const button = document.createElement('button');
    button.className = 'ps-edit-btn';
    button.textContent = '✎ Edit';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.openAtFence(path, fence);
    });
    block.appendChild(button);
  }

  attachEditButtons(el, ctx) {
    if (!el || el.nodeType !== 1) return;
    if (el.ownerDocument !== document) return;
    if (el.closest('.ps-builder-preview')) return;
    const blocks = el.querySelectorAll('.ps-block');
    if (!blocks.length) return;

    const section = ctx && ctx.getSectionInfo ? ctx.getSectionInfo(el) : null;
    const fences = section ? this.fencesIn(section.text, section.lineStart) : [];

    blocks.forEach((block, index) => {
      if (block.querySelector(':scope > .ps-edit-btn')) return;
      block.classList.add('ps-has-btn');
      const button = document.createElement('button');
      button.className = 'ps-edit-btn';
      button.textContent = '✎ Edit';
      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const fence = fences[index];
        if (!fence) {
          new Notice('Could not locate this pseudocode block. Use the "Edit pseudocode block" command in the editor.');
          return;
        }
        this.openAtFence(ctx.sourcePath, fence);
      });
      block.appendChild(button);
    });
  }

  fencesIn(text, lineStart) {
    const lines = String(text || '').split('\n');
    const offsets = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        offsets.push({ start, end: i, content: lines.slice(start + 1, i).join('\n') });
        start = -1;
      }
    }
    if (!offsets.length) return [];
    const base = lineStart - offsets[0].start;
    return offsets.map((fence) => ({
      start: base + fence.start,
      end: base + fence.end,
      source: fence.content,
    }));
  }

  locateFence(lines, source, approximate) {
    const normalize = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const wanted = normalize(source);
    const found = [];
    let start = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (start < 0) {
        if (FENCE_OPEN.test(line)) start = i;
      } else if (FENCE_CLOSE.test(line)) {
        found.push({ start, end: i, content: lines.slice(start + 1, i).join('\n') });
        start = -1;
      }
    }
    const matches = found.filter((item) => normalize(item.content) === wanted);
    if (!matches.length) return null;
    return matches.reduce((best, item) =>
      Math.abs(item.start - approximate) < Math.abs(best.start - approximate) ? item : best);
  }

  async openAtFence(path, fence) {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      new Notice(`File not found: ${path}`);
      return;
    }
    const data = await this.app.vault.read(file);
    const eol = data.includes('\r\n') ? '\r\n' : '\n';
    const lines = data.split(/\r?\n/);
    let located = fence.source ? this.locateFence(lines, fence.source, fence.start) : null;
    if (!located && Number.isInteger(fence.start) && Number.isInteger(fence.end)
      && FENCE_OPEN.test((lines[fence.start] || '').trim())
      && FENCE_CLOSE.test((lines[fence.end] || '').trim())) {
      located = { start: fence.start, end: fence.end };
    }
    if (!located) {
      new Notice('The block moved. Reopen the note and try again.');
      return;
    }
    const blockSource = lines.slice(located.start + 1, located.end).join(eol);
    const model = PS.parseLatex(blockSource);
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: path,
      onSave: async (latex) => {
        await this.app.vault.process(file, (content) => {
          const fileEol = content.includes('\r\n') ? '\r\n' : '\n';
          const current = content.split(/\r?\n/);
          const target = this.locateFence(current, blockSource, located.start);
          if (!target) return content;
          return current.slice(0, target.start + 1)
            .concat(latex.split('\n'), current.slice(target.end))
            .join(fileEol);
        });
        new Notice('Pseudocode updated');
      },
    }).open();
  }

  /* ---------------- commands ---------------- */

  activeEditor(editor) {
    if (editor) return editor;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    return view ? view.editor : null;
  }

  openInsert(editor) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    const mode = view && typeof view.getMode === 'function' ? view.getMode() : 'source';
    const target = editor || (view && mode === 'source' ? view.editor : null);
    const model = { caption: '', nodes: [] };
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: this.app.workspace.getActiveFile()?.path || '',
      onSave: async (latex) => {
        const block = `\`\`\`pseudo\n${latex}\n\`\`\`\n`;
        if (target) {
          target.replaceSelection(block);
          return;
        }
        const file = this.app.workspace.getActiveFile();
        if (file) {
          await this.app.vault.process(file, (content) => `${content.replace(/\s*$/, '')}\n\n${block}`);
          new Notice('Pseudocode appended to the end of the note');
          return;
        }
        new Notice('Open a note before inserting');
      },
    }).open();
  }

  openEdit(editor) {
    const fence = this.findFence(editor);
    if (!fence) {
      new Notice('Cursor is not inside a ```pseudo block');
      return;
    }
    const model = PS.parseLatex(fence.source);
    new PS.BuilderModal(this.app, {
      model,
      settings: this.settings,
      sourcePath: this.app.workspace.getActiveFile()?.path || '',
      onSave: (latex) => {
        editor.replaceRange(latex + '\n', { line: fence.start + 1, ch: 0 }, { line: fence.end, ch: 0 });
        new Notice('Pseudocode updated');
      },
    }).open();
  }

  findFence(editor) {
    if (!editor) return null;
    const cursor = editor.getCursor();
    let start = -1;
    for (let i = Math.min(cursor.line, editor.lineCount() - 1); i >= 0; i--) {
      if (FENCE_OPEN.test(editor.getLine(i).trim())) {
        start = i;
        break;
      }
    }
    if (start < 0) return null;
    let end = -1;
    for (let i = start + 1; i < editor.lineCount(); i++) {
      if (FENCE_CLOSE.test(editor.getLine(i).trim())) {
        end = i;
        break;
      }
    }
    if (end < 0) return null;
    const source = editor.getRange({ line: start + 1, ch: 0 }, { line: end, ch: 0 });
    return { start, end, source };
  }
}

module.exports = PseudocodeSuitePlugin;
