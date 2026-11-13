const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

function load(file) {
  const src = fs.readFileSync(path.join(root, 'src', file), 'utf8');
  const module_ = { exports: {} };
  new Function('module', 'exports', 'require', 'document', 'MarkdownRenderer', 'window', src)(
    module_, module_.exports, require,
    { createElement: () => ({ style: {}, classList: { add() {} }, appendChild() {} }) },
    { render: async () => {} },
    {}
  );
  return module_.exports;
}

// core.js does not export; inject an export line
const coreSrc = fs.readFileSync(path.join(root, 'src/core.js'), 'utf8');
const module_ = { exports: {} };
new Function('module', 'exports', coreSrc + '\nmodule.exports = PS;')(module_, module_.exports);
const PS = module_.exports;

let passed = 0, failed = 0;
function ok(cond, name, extra) {
  if (cond) { passed++; }
  else { failed++; console.log('FAIL:', name, extra === undefined ? '' : extra); }
}
function eq(a, b, name) { ok(JSON.stringify(a) === JSON.stringify(b), name, `${JSON.stringify(a)} != ${JSON.stringify(b)}`); }

// ---- toMath ----
eq(PS.toMath('S1.top = 0'), '$S_1.\\mathrm{top} = 0$', 'subscript + roman');
eq(PS.toMath('i == 0'), '$i == 0$', 'equality');
eq(PS.toMath('l <= A.heap-size and A[l] > A[largest]'), '$l \\le A.\\mathrm{heap}\\text{-}\\mathrm{size} \\land A[l] > A[\\mathrm{largest}]$', 'operators + hyphen');
eq(PS.toMath('OVERFLOW'), '$\\text{OVERFLOW}$', 'constant');
eq(PS.toMath('true'), '$\\textbf{true}$', 'boolean');
eq(PS.toMath(''), '', 'empty');

// ---- parse/serialize round trip on live blocks from both vaults ----
function collectBlocks(vault) {
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === '.obsidian' || entry.name === '.git') continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.md')) {
        const text = fs.readFileSync(full, 'utf8');
        const re = /^```pseudo\s*$\n([\s\S]*?)^```\s*$/gm;
        let m;
        while ((m = re.exec(text))) out.push({ file: full, source: m[1] });
      }
    }
  };
  walk(vault);
  return out;
}

const vaults = ['/Users/joy/Documents/Homeworks', '/Users/joy/Documents/Obsidian Vault'];
let blockCount = 0;
for (const vault of vaults) {
  for (const block of collectBlocks(vault)) {
    blockCount++;
    let model;
    try { model = PS.parseLatex(block.source); }
    catch (e) { ok(false, 'parse threw ' + block.file, e.message); continue; }
    const latex = PS.serializeLatex(model);
    const model2 = PS.parseLatex(latex);
    const strip = (o) => JSON.parse(JSON.stringify(o, (k, v) => (k === 'id' || k.endsWith('Math') ? undefined : v)));
    const same = JSON.stringify(strip(model)) === JSON.stringify(strip(model2));
    ok(same, 'roundtrip ' + path.basename(block.file) + '#' + blockCount, same ? '' : 'model changed');
  }
}
console.log(`checked ${blockCount} blocks from both vaults`);

// ---- edge cases ----
ok(PS.parseLatex('').nodes.length === 0, 'empty block');
eq(PS.parseLatex('\\caption{X}').caption, 'X', 'caption only');
const unknown = PS.parseLatex('\\Frobnicate{abc}');
ok(unknown.nodes[0].type === 'raw', 'unknown command kept as raw');
eq(unknown.nodes[0].text, '\\Frobnicate{abc}', 'raw text preserved');
const nested = PS.parseLatex('\\If{a}\n\\While{b}\n\\State c\n\\EndWhile\n\\EndIf');
ok(nested.nodes[0].type === 'if' && nested.nodes[0].branches[0].body[0].type === 'while', 'nested blocks');
const forall = PS.parseLatex('\\ForAll{\\texttt{x} in S}\\State y\\EndFor');
ok(forall.nodes[0].all === true, 'forall flag');
const commentOnly = PS.parseLatex('\\State \\Comment{hello}');
ok(commentOnly.nodes[0].type === 'state' && commentOnly.nodes[0].text === '' && commentOnly.nodes[0].comment === 'hello', 'comment-only state');
const callState = PS.parseLatex('\\State \\Call{Swap}{$A, i$}');
ok(callState.nodes[0].type === 'call' && callState.nodes[0].name === 'Swap', 'call statement');
const retState = PS.parseLatex('\\State \\Return $x$');
ok(retState.nodes[0].type === 'return' && retState.nodes[0].text === 'x', 'state-return shorthand');
const forDown = PS.parseLatex('\\For{$i = n$ \\DownTo $1$}\\State x\\EndFor');
ok(forDown.nodes[0].downto === true && forDown.nodes[0].bound === '1', 'downto for');

// multi-line \State (Exercise Sheet 3 style)
const multiline = PS.parseLatex('\\State $m \\gets \\left\\lfloor\n  (a+b)/2 \\right\\rfloor$');
ok(multiline.nodes.length === 1 && multiline.nodes[0].type === 'state', 'multi-line state joined');

// comments survive on control lines
const commented = PS.parseLatex('\\While{$x > 0$}\n\\State y\n\\EndWhile');
commented.nodes[0].comment = 'loop';
const regenerated = PS.serializeLatex(commented);
ok(regenerated.includes('\\While{$x > 0$} \\Comment{loop}'), 'control-line comment serialized');

// reorder (drag & drop)
const mk = (type, props) => PS.node(type, Object.assign({ text: '' }, props || {}));
const nodeA = mk('state', { text: 'a' });
const nodeB = mk('state', { text: 'b' });
const nodeC = mk('state', { text: 'c' });
const loop = PS.node('while', { cond: 'x', body: [nodeC] });
const roots = [nodeA, nodeB, loop];
ok(PS.reorder(roots, loop.id, nodeA.id, 'before') === true, 'reorder before');
ok(roots[0] === loop && roots[1] === nodeA && roots[2] === nodeB, 'reorder before order');
ok(PS.reorder(roots, nodeB.id, loop.id, 'inside') === true, 'reorder inside');
ok(PS.bodyOf(loop).some((node) => node.id === nodeB.id), 'reorder inside body');
ok(PS.reorder(roots, loop.id, nodeB.id, 'inside') === false, 'reorder refuses own descendant');
ok(PS.reorder(roots, nodeA.id, nodeA.id, 'after') === false, 'reorder refuses self');
ok(PS.reorder(roots, nodeA.id, nodeC.id, 'after') === true, 'reorder after nested node');
ok(PS.bodyOf(loop)[1].id === nodeA.id, 'reorder nested position');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
