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
