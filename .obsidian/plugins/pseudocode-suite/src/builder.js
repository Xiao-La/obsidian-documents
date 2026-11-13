/* Builder modal. */
((PS) => {
  const CONTAINERS = new Set(['if', 'while', 'for', 'repeat', 'function']);
  const bodyOf = (node) => PS.bodyOf(node);

  function cloneNode(node) {
    const copy = JSON.parse(JSON.stringify(node, (key, value) => (key === 'id' ? undefined : value)));
    const assign = (current) => {
      current.id = PS.nextId();
      if (Array.isArray(current.branches)) current.branches.forEach((branch) => branch.body.forEach(assign));
      if (Array.isArray(current.elseBody)) current.elseBody.forEach(assign);
      if (Array.isArray(current.body)) current.body.forEach(assign);
    };
    assign(copy);
    return copy;
  }

  function newNode(type) {
    switch (type) {
      case 'if': return PS.node('if', { branches: [{ cond: '', body: [] }], elseBody: null });
      case 'while': return PS.node('while', { cond: '', body: [] });
      case 'for': return PS.node('for', { init: '', bound: '', downto: false, body: [] });
      case 'forall': return PS.node('for', { all: true, init: '', bound: '', downto: false, body: [] });
      case 'repeat': return PS.node('repeat', { body: [], until: '' });
      case 'function': return PS.node('function', { kind: 'Function', name: '', args: '', body: [] });
      case 'call': return PS.node('call', { name: '', args: '' });
      default: return PS.node(type, { text: '' });
    }
  }

class BuilderModal extends Modal {
  constructor(app, options) {
    super(app);
    this.model = options.model;
    this.settings = options.settings || {};
    this.sourcePath = options.sourcePath || '';
    this.onSave = options.onSave;
    this.index = new Map();
    this.selectedId = null;
    this.focusId = null;
    this.dragId = null;
    this.dropTarget = null;
    this.previewTimer = null;
    this.previewComponent = new Component();
  }

  onOpen() {
    this.history = [];
    this.modalEl.addClass('pb-modal');
    this.titleEl.setText('Pseudocode Builder');
    this.buildLayout();
    this.renderTree();
    this.renderPreview();
    this.onUndoKey = (event) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        this.save();
        return;
      }
      if (event.key.toLowerCase() !== 'z') return;
      event.preventDefault();
      this.undo();
    };
    this.modalEl.addEventListener('keydown', this.onUndoKey);
  }

  onClose() {
    this.modalEl.removeEventListener('keydown', this.onUndoKey);
    clearTimeout(this.previewTimer);
    this.previewComponent.unload();
    this.contentEl.empty();
  }

  buildLayout() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass('pb-content');

    const wrap = contentEl.createDiv('pb-wrap');
    const left = wrap.createDiv('pb-left');
    const right = wrap.createDiv('pb-right');

    const captionRow = left.createDiv('pb-row pb-caption');
    captionRow.createSpan({ cls: 'pb-chip', text: 'Title' });
    const captionInput = captionRow.createEl('input', {
      cls: 'pb-input',
      attr: { type: 'text', placeholder: 'Algorithm title (optional)' },
    });
    captionInput.value = this.model.caption || '';
    captionInput.addEventListener('input', () => {
      this.model.caption = captionInput.value;
      this.schedulePreview();
    });

    const toolbar = left.createDiv('pb-toolbar');
    const addButton = (label, factory) => {
      toolbar.createEl('button', { text: label }, (button) => {
        button.addEventListener('click', () => this.insertNode(factory()));
      });
    };
    addButton('+ Statement', () => newNode('state'));
    addButton('+ If', () => newNode('if'));
    addButton('+ While', () => newNode('while'));
    addButton('+ For', () => newNode('for'));
    addButton('+ For all', () => newNode('forall'));
    addButton('+ Repeat', () => newNode('repeat'));
    addButton('+ Procedure', () => newNode('function'));
    addButton('+ Require', () => newNode('require'));
    addButton('+ Ensure', () => newNode('ensure'));
    addButton('+ Return', () => newNode('return'));
    addButton('+ Call', () => newNode('call'));
    addButton('+ Break', () => newNode('break'));
    addButton('+ Continue', () => newNode('continue'));
    addButton('+ Print', () => newNode('print'));
    addButton('+ Comment', () => newNode('comment'));

    this.listEl = left.createDiv('pb-list');

    this.previewEl = right.createDiv('pb-preview');
    const details = right.createEl('details', { cls: 'pb-latex' });
    details.createEl('summary', { text: 'Show generated LaTeX' });
    this.latexEl = details.createEl('pre');

    const footer = contentEl.createDiv('pb-footer');
    footer.createEl('button', { text: 'Cancel' }, (button) => {
      button.addEventListener('click', () => this.close());
    });
    footer.createEl('button', { cls: 'mod-cta', text: 'Save' }, (button) => {
      button.addEventListener('click', () => this.save());
    });
  }

  /* ---- tree rendering ---- */

  pushHistory() {
    try {
      this.history.push(JSON.stringify(this.model));
      if (this.history.length > 50) this.history.shift();
    } catch (error) { /* ignore */ }
  }

  undo() {
    if (!this.history.length) return;
    this.model = JSON.parse(this.history.pop());
    this.selectedId = null;
    this.renderTree();
    this.schedulePreview();
  }

  buildIndex() {
    this.index.clear();
    const walk = (array, owner, ownerArray) => {
      array.forEach((node, position) => {
        this.index.set(node.id, { node, array, position, owner, ownerArray });
        if (node.type === 'if') {
          node.branches.forEach((branch) => walk(branch.body, node, array));
          if (node.elseBody) walk(node.elseBody, node, array);
        } else if (Array.isArray(node.body)) {
          walk(node.body, node, array);
        }
      });
    };
    walk(this.model.nodes, null, null);
  }

  renderTree() {
    this.buildIndex();
    this.listEl.empty();
    this.renderNodes(this.model.nodes, 0);
    if (this.focusId) {
      const id = this.focusId;
      this.focusId = null;
      const input = this.listEl.querySelector('input[data-id="' + id + '"]');
      if (input) {
        input.focus();
        input.select();
      }
    }
    if (this.focusCommentId) {
      const id = this.focusCommentId;
      this.focusCommentId = null;
      const input = this.listEl.querySelector('input.pb-comment-input[data-id="' + id + '"]');
      if (input) input.focus();
    }
  }

  renderNodes(nodes, depth) {
    for (const node of nodes) this.renderNode(node, depth);
  }

  row(node, depth, chip) {
    const labels = {
      state: 'statement', statement: 'statement', function: 'function', procedure: 'procedure',
      require: 'require', ensure: 'ensure', return: 'return', call: 'call', break: 'break',
      continue: 'continue', print: 'print', comment: 'comment', raw: 'raw', if: 'if',
      'else if': 'else if', else: 'else', while: 'while', for: 'for', 'for all': 'for all',
      repeat: 'repeat', until: 'until',
    };
    const element = this.listEl.createDiv('pb-row');
    element.dataset.id = node.id;
    element.style.paddingLeft = depth * 16 + 4 + 'px';
    if (this.selectedId === node.id) element.addClass('pb-selected');

    const handle = element.createEl('button', {
      cls: 'pb-drag',
      text: '⠿',
      attr: { type: 'button', draggable: 'true', 'aria-label': 'Drag to reorder', title: 'Drag to reorder' },
    });
    handle.addEventListener('dragstart', (event) => {
      this.dragId = node.id;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'move';
        try { event.dataTransfer.setData('text/plain', node.id); } catch (error) { /* ignore */ }
      }
      element.addClass('pb-dragging');
    });
    handle.addEventListener('dragend', () => {
      this.dragId = null;
      element.removeClass('pb-dragging');
      this.clearDropStyles();
    });

    if (CONTAINERS.has(node.type)) {
      const toggle = element.createEl('button', {
        cls: 'pb-toggle',
        text: node.__collapsed ? '▸' : '▾',
        attr: { type: 'button', 'aria-label': node.__collapsed ? 'Expand' : 'Collapse', title: node.__collapsed ? 'Expand' : 'Collapse' },
      });
      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        node.__collapsed = !node.__collapsed;
        this.renderTree();
      });
    }

    element.createSpan({ cls: 'pb-chip', text: labels[chip] || chip });
    element.addEventListener('click', () => {
      this.selectedId = node.id;
      this.refreshSelection();
    });
    element.addEventListener('dragover', (event) => this.handleDragOver(event, node, element));
    element.addEventListener('dragleave', (event) => {
      if (!element.contains(event.relatedTarget)) {
        element.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
      }
    });
    element.addEventListener('drop', (event) => this.handleDrop(event, node));
    return element;
  }

  clearDropStyles() {
    this.dropTarget = null;
    this.listEl.querySelectorAll('.pb-row').forEach((row) => {
      row.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
    });
  }

  handleDragOver(event, node, element) {
    if (!this.dragId || this.dragId === node.id) return;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    const rect = element.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / Math.max(1, rect.height);
    let mode = ratio < 0.5 ? 'before' : 'after';
    if (CONTAINERS.has(node.type) && ratio > 0.3 && ratio < 0.7) mode = 'inside';
    this.dropTarget = { id: node.id, mode };
    this.listEl.querySelectorAll('.pb-row').forEach((row) => {
      row.removeClass('pb-drop-before', 'pb-drop-after', 'pb-drop-inside');
    });
    element.addClass('pb-drop-' + mode);
  }

  handleDrop(event, node) {
    event.preventDefault();
    const target = this.dropTarget;
    this.clearDropStyles();
    if (!this.dragId || !target) return;
    this.pushHistory();
    const movedId = this.dragId;
    if (!PS.reorder(this.model.nodes, movedId, node.id, target.mode)) return;
    this.selectedId = movedId;
    this.dragId = null;
    this.renderTree();
    this.schedulePreview();
  }

  refreshSelection() {
    this.listEl.querySelectorAll('.pb-row').forEach((element) => {
      element.toggleClass('pb-selected', element.dataset.id === this.selectedId);
    });
  }

  field(parent, node, value, apply, placeholder) {
    const input = parent.createEl('input', {
      cls: 'pb-input',
      attr: { type: 'text', placeholder: placeholder || '' },
    });
    input.value = value || '';
    input.dataset.id = node.id;
    input.addEventListener('input', () => {
      apply(input.value);
      this.schedulePreview();
    });
    input.addEventListener('keydown', (event) => this.onKeyDown(event, node));
    return input;
  }

  actions(parent, node, extraButtons = []) {
    const box = parent.createDiv('pb-actions');
    const button = (label, title, handler) => {
      const element = box.createEl('button', { text: label, attr: { title, 'aria-label': title } });
      element.addEventListener('click', (event) => {
        event.stopPropagation();
        handler();
      });
    };
    button('↑', 'Move up', () => this.move(node, -1));
    button('↓', 'Move down', () => this.move(node, 1));
    button('⇤', 'Outdent', () => this.outdent(node));
    button('⇥', 'Indent', () => this.indent(node));
    if (CONTAINERS.has(node.type)) {
      button('+', 'Add statement inside', () => {
        this.pushHistory();
        const child = newNode('state');
        bodyOf(node).push(child);
        this.focusId = child.id;
        this.renderTree();
        this.schedulePreview();
      });
      button('+after', 'Add statement after', () => {
        this.pushHistory();
        const info = this.index.get(node.id);
        if (!info) return;
        const child = newNode('state');
        info.array.splice(info.position + 1, 0, child);
        this.selectedId = child.id;
        this.focusId = child.id;
        this.renderTree();
        this.schedulePreview();
      });
    }
    button('//', 'Trailing comment', () => {
      this.pushHistory();
      node.__showComment = !node.__showComment;
      this.focusCommentId = node.id;
      this.renderTree();
    });
    button('⧉', 'Duplicate', () => this.duplicate(node));
    extraButtons.forEach(([label, title, handler]) => button(label, title, handler));
    button('✕', 'Delete', () => this.remove(node));
  }

  maybeComment(parent, node) {
    if (node.comment == null && !node.__showComment) return;
    const anchor = parent.querySelector(':scope > .pb-actions');
    const mount = (element) => {
      if (anchor) parent.insertBefore(element, anchor);
      else parent.appendChild(element);
      return element;
    };
    mount(parent.createSpan({ cls: 'pb-word', text: '//' }));
    const input = mount(parent.createEl('input', {
      cls: 'pb-input pb-comment-input',
      attr: { type: 'text', placeholder: 'trailing comment' },
    }));
    input.dataset.id = node.id;
    input.value = node.comment || '';
    input.addEventListener('input', () => {
      node.comment = input.value;
      this.schedulePreview();
    });
  }

  duplicate(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const copy = cloneNode(node);
    info.array.splice(info.position + 1, 0, copy);
    this.selectedId = copy.id;
    this.renderTree();
    this.schedulePreview();
  }

  renderNode(node, depth) {
    switch (node.type) {
      case 'if': {
        node.branches.forEach((branch, branchIndex) => {
          if (node.__collapsed && branchIndex > 0) return;
          const element = this.row(node, depth, branchIndex === 0 ? 'if' : 'else if');
          this.field(element, node, branch.cond, (value) => { branch.cond = value; }, 'condition, e.g. i == 0');
          this.actions(element, node, node.elseBody ? [] : [
            ['+else if', 'Add else-if branch', () => {
              this.pushHistory();
              node.branches.push({ cond: '', body: [] });
              this.renderTree();
              this.schedulePreview();
            }],
            ['+else', 'Add else branch', () => {
              this.pushHistory();
              node.elseBody = [];
              this.renderTree();
              this.schedulePreview();
            }],
            ...(branchIndex > 0 ? [['-branch', 'Remove this branch', () => {
              this.pushHistory();
              node.branches.splice(branchIndex, 1);
              this.renderTree();
              this.schedulePreview();
            }]] : []),
          ]);
          if (!node.__collapsed) this.renderNodes(branch.body, depth + 1);
        });
        if (node.elseBody && !node.__collapsed) {
          const element = this.row(node, depth, 'else');
          this.actions(element, node, [['-else', 'Remove else branch', () => {
            this.pushHistory();
            node.elseBody = null;
            this.renderTree();
            this.schedulePreview();
          }]]);
        this.maybeComment(element, node);
          this.renderNodes(node.elseBody, depth + 1);
        }
        return;
      }
      case 'while': {
        const element = this.row(node, depth, 'while');
        this.field(element, node, node.cond, (value) => { node.cond = value; }, 'condition, e.g. k > 0');
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'for': {
        const element = this.row(node, depth, 'for');
        this.field(element, node, node.init, (value) => { node.init = value; }, 'start, e.g. j = 2');
        const direction = element.createEl('select', { cls: 'pb-select' });
        [['to', 'to'], ['downto', 'downto']].forEach(([value, label]) => {
          const option = direction.createEl('option', { text: label, value });
          if ((node.downto ? 'downto' : 'to') === value) option.selected = true;
        });
        direction.addEventListener('change', () => {
          node.downto = direction.value === 'downto';
          this.schedulePreview();
        });
        this.field(element, node, node.bound, (value) => { node.bound = value; }, 'end, e.g. n');
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'repeat': {
        const head = this.row(node, depth, 'repeat');
        this.actions(head, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        const tail = this.row(node, depth, 'until');
        this.field(tail, node, node.until, (value) => { node.until = value; }, 'condition, e.g. m == 9');
        return;
      }
      case 'function': {
        const element = this.row(node, depth, 'function');
        const kind = element.createEl('select', { cls: 'pb-select' });
        ['Function', 'Procedure'].forEach((option) => {
          const item = kind.createEl('option', { text: option, value: option });
          if (node.kind === option) item.selected = true;
        });
        kind.addEventListener('change', () => {
          node.kind = kind.value;
          this.schedulePreview();
        });
        this.field(element, node, node.name, (value) => { node.name = value; }, 'name, e.g. PushS1');
        element.createSpan({ cls: 'pb-word', text: '(' });
        this.field(element, node, node.args, (value) => { node.args = value; }, 'args, e.g. A, x');
        element.createSpan({ cls: 'pb-word', text: ')' });
        this.actions(element, node);
        this.maybeComment(element, node);
        if (!node.__collapsed) this.renderNodes(node.body, depth + 1);
        return;
      }
      case 'call': {
        const element = this.row(node, depth, 'call');
        this.field(element, node, node.name, (value) => { node.name = value; }, 'procedure name');
        element.createSpan({ cls: 'pb-word', text: '(' });
        this.field(element, node, node.args, (value) => { node.args = value; }, 'args, e.g. A, i');
        element.createSpan({ cls: 'pb-word', text: ')' });
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'comment': {
        const element = this.row(node, depth, '//');
        this.field(element, node, node.text, (value) => { node.text = value; }, 'comment text');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'require':
      case 'ensure': {
        const element = this.row(node, depth, node.type);
        this.field(element, node, node.text, (value) => { node.text = value; }, node.type === 'require' ? 'input, e.g. A, n' : 'output, e.g. A is sorted');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'return':
      case 'print': {
        const element = this.row(node, depth, node.type);
        this.field(element, node, node.text, (value) => { node.text = value; }, 'value (optional)');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'break':
      case 'continue': {
        const element = this.row(node, depth, node.type);
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      case 'raw': {
        const element = this.row(node, depth, 'raw');
        this.field(element, node, node.text, (value) => { node.text = value; }, 'unrecognized raw line');
        this.actions(element, node);
        this.maybeComment(element, node);
        return;
      }
      default: {
        const element = this.row(node, depth, 'statement');
        this.field(element, node, node.text, (value) => { node.text = value; }, 'e.g. S1.top = 0');
        this.actions(element, node);
        this.maybeComment(element, node);
      }
    }
  }

  /* ---- structural operations ---- */

  insertNode(node) {
    this.pushHistory();
    const selected = this.selectedId ? this.index.get(this.selectedId) : null;
    if (selected && CONTAINERS.has(selected.node.type)) {
      bodyOf(selected.node).push(node);
    } else if (selected) {
      selected.array.splice(selected.position + 1, 0, node);
    } else {
      this.model.nodes.push(node);
    }
    this.selectedId = node.id;
    this.focusId = node.id;
    this.renderTree();
    this.schedulePreview();
  }

  insertSiblingAfter(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const sibling = newNode('state');
    info.array.splice(info.position + 1, 0, sibling);
    this.selectedId = sibling.id;
    this.focusId = sibling.id;
    this.renderTree();
    this.schedulePreview();
  }

  move(node, direction) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    const target = info.position + direction;
    if (target < 0 || target >= info.array.length) return;
    const [moved] = info.array.splice(info.position, 1);
    info.array.splice(target, 0, moved);
    this.renderTree();
    this.schedulePreview();
  }

  indent(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info || info.position === 0) return;
    const previous = info.array[info.position - 1];
    if (!CONTAINERS.has(previous.type)) return;
    info.array.splice(info.position, 1);
    bodyOf(previous).push(node);
    this.renderTree();
    this.schedulePreview();
  }

  outdent(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info || !info.owner) return;
    const ownerInfo = this.index.get(info.owner.id);
    if (!ownerInfo) return;
    info.array.splice(info.position, 1);
    ownerInfo.array.splice(ownerInfo.position + 1, 0, node);
    this.renderTree();
    this.schedulePreview();
  }

  remove(node) {
    this.pushHistory();
    const info = this.index.get(node.id);
    if (!info) return;
    info.array.splice(info.position, 1);
    if (this.selectedId === node.id) this.selectedId = null;
    this.renderTree();
    this.schedulePreview();
  }

  onKeyDown(event, node) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (CONTAINERS.has(node.type)) {
      const child = newNode('state');
      if (node.type === 'if') node.branches[0].body.push(child);
      else node.body.push(child);
      this.selectedId = child.id;
      this.focusId = child.id;
      this.renderTree();
      this.schedulePreview();
      return;
    }
    this.insertSiblingAfter(node);
  }

  /* ---- preview and saving ---- */

  schedulePreview() {
    clearTimeout(this.previewTimer);
    this.previewTimer = setTimeout(() => this.renderPreview(), 220);
  }

  async renderPreview() {
    const latex = PS.serializeLatex(this.model);
    if (this.latexEl) this.latexEl.setText(latex);
    if (!this.previewEl) return;
    this.previewEl.empty();
    try {
      const ast = PS.parseLatex(PS.serializeLatex(this.model));
      const block = await PS.renderBlock(this.app, ast, this.settings, this.sourcePath, this.previewComponent);
      block.style.visibility = 'hidden';
      this.previewEl.appendChild(block);
      try {
        await PS.typesetMath(this.app, block, this.sourcePath, this.previewComponent);
      } finally {
        block.style.visibility = '';
      }
    } catch (error) {
      this.previewEl.createDiv({ cls: 'pb-error', text: 'Render failed: ' + error.message });
    }
  }

  save() {
    const missing = [];
    const scan = (nodes) => {
      nodes.forEach((node) => {
        if (node.type === 'function' && !String(node.name || '').trim()) missing.push(node);
        if (Array.isArray(node.branches)) node.branches.forEach((branch) => scan(branch.body));
        if (Array.isArray(node.elseBody)) scan(node.elseBody);
        if (Array.isArray(node.body)) scan(node.body);
      });
    };
    scan(this.model.nodes);
    if (missing.length) {
      new Notice('Function name is required');
      this.selectedId = missing[0].id;
      this.focusId = missing[0].id;
      this.renderTree();
      return;
    }
    const latex = PS.serializeLatex(this.model);
    try {
      this.onSave(latex);
    } catch (error) {
      new Notice('Save failed: ' + error.message);
      return;
    }
    this.close();
  }
}

/* ------------------------------------------------------------------------- *
 * Plugin
 * ------------------------------------------------------------------------- */

const FENCE_OPEN = /^```\s*pseudo\s*$/;
const FENCE_CLOSE = /^```\s*$/;

PS.BuilderModal = BuilderModal;
})(PS);
