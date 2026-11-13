const { loadPS, collectBlocks, suite } = require('./harness');

const PS = loadPS();
const { ok, eq, done } = suite();

// ---- toMath ----
eq(PS.toMath('S1.top = 0'), '$S_1.\\mathrm{top} = 0$', 'subscript + roman');
eq(PS.toMath('i == 0'), '$i == 0$', 'equality');
eq(PS.toMath('l <= A.heap-size and A[l] > A[largest]'), '$l \\le A.\\mathrm{heap}\\text{-}\\mathrm{size} \\land A[l] > A[\\mathrm{largest}]$', 'operators + hyphen');
eq(PS.toMath('OVERFLOW'), '$\\text{OVERFLOW}$', 'constant');
eq(PS.toMath('true'), '$\\textbf{true}$', 'boolean');
eq(PS.toMath(''), '', 'empty');

// ---- parse/serialize round trip on every pseudo block in the vaults ----
// The model must survive exactly, *Math flags included: a flag flip turns
// prose into math (or back) and changes the rendering.
const strip = (model) => JSON.parse(JSON.stringify(model, (key, value) => (key === 'id' ? undefined : value)));
const blocks = collectBlocks();
for (const block of blocks) {
  const name = `${block.file.split('/').pop()}#${blocks.indexOf(block)}`;
  let model;
  try { model = PS.parseLatex(block.source); } catch (error) { ok(false, `parse threw ${name}`, error.message); continue; }
  const latex = PS.serializeLatex(model);
  const model2 = PS.parseLatex(latex);
  eq(strip(model2), strip(model), `roundtrip ${name}`);
  eq(PS.buildRows(model2), PS.buildRows(model), `rows unchanged after save ${name}`);
  ok(PS.serializeLatex(model2) === latex, `serializer is idempotent ${name}`);
}
console.log(`checked ${blocks.length} blocks`);

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



// ---- trailing comments survive on every statement kind ----
const commentCases = {
  state: '\\State $x$ \\Comment{c}',
  call: '\\State \\Call{F}{$x$} \\Comment{c}',
  bareCall: '\\Call{F}{$x$} \\Comment{c}',
  return: '\\Return $x$ \\Comment{c}',
  print: '\\Print $x$ \\Comment{c}',
  break: '\\Break \\Comment{c}',
  continue: '\\Continue \\Comment{c}',
  stateBreak: '\\State \\Break \\Comment{c}',
  require: '\\Require $A$ \\Comment{c}',
  raw: '\\Frobnicate{abc} \\Comment{c}',
};
for (const [name, source] of Object.entries(commentCases)) {
  const model = PS.parseLatex(source);
  eq(model.nodes[0].comment, 'c', `comment parsed: ${name}`);
  ok(PS.serializeLatex(model).includes('\\Comment{c}'), `comment serialized: ${name}`);
  eq(PS.buildRows(model)[0].comment, 'c', `comment rendered: ${name}`);
}
const builderMade = { caption: '', nodes: ['break', 'continue', 'raw'].map((type) => PS.node(type, { text: type === 'raw' ? '\\Foo' : undefined, comment: 'k' })) };
eq((PS.serializeLatex(builderMade).match(/\\Comment\{k\}/g) || []).length, 3, 'builder comments on break/continue/raw saved');

const repeat = PS.parseLatex('\\Repeat \\Comment{head}\n\\State x\n\\Until{$x > 0$} \\Comment{tail}');
eq([repeat.nodes[0].comment, repeat.nodes[0].untilComment], ['head', 'tail'], 'repeat and until comments kept apart');
const repeatLatex = PS.serializeLatex(repeat);
eq((repeatLatex.match(/\\Comment\{head\}/g) || []).length, 1, 'repeat comment written once');
ok(repeatLatex.includes('\\Until{$x > 0$} \\Comment{tail}'), 'until comment written');
const repeatRows = PS.buildRows(repeat);
eq([repeatRows[0].comment, repeatRows[2].comment], ['head', 'tail'], 'repeat/until rows carry their comments');

const twoComments = PS.parseLatex('\\State x \\Comment{a}\n\\Comment{b}');
eq(PS.buildRows(twoComments).map((row) => row.comment), ['a', 'b'], 'second standalone comment gets its own row');

// ---- prose stays prose ----
eq(PS.serializeLatex(PS.parseLatex('\\State Initialize the array')).split('\n')[2], '  \\State Initialize the array', 'prose state saved verbatim');
eq(PS.serializeLatex(PS.parseLatex('\\State error “heap underflow”')).split('\n')[2], '  \\State error “heap underflow”', 'quoted prose saved verbatim');
eq(PS.mathOrRaw('x <= y', true), '$x \\le y$', 'math field becomes math');

// ---- word spacing inside math ----
eq(PS.toMath('exchange A[i] with A[j]'), '$\\mathrm{exchange}\\ A[i]\\ \\mathrm{with}\\ A[j]$', 'spaces kept around words');
eq(PS.toMath('Initialize the array'), '$\\mathrm{Initialize}\\ \\mathrm{the}\\ \\mathrm{array}$', 'prose typed in builder keeps spaces');
eq(PS.toMath('x = largest'), '$x = \\mathrm{largest}$', 'no extra space around operators');
eq(PS.toMath('a and b'), '$a \\land b$', 'logic words stay operators');
eq(PS.toMath('x = NIL'), '$x = \\text{NIL}$', 'constant inside expression');

// ---- operators ----
eq(PS.normalizeOperators('a \\leq b \\land c \\gets d'), 'a <= b and c = d', 'aliases normalized');
eq(PS.texOperators('a <= b and not c'), 'a \\le  b \\land  \\lnot  c', 'ascii to tex');
eq(PS.fromMath('$\\mathrm{\\text{x}}$'), 'x', 'nested font groups unwrapped');

// ---- tree helpers ----
const tree = PS.parseLatex('\\If{a}\n\\State b\n\\Elif{c}\n\\State d\n\\Else\n\\State e\n\\EndIf');
const ifNode = tree.nodes[0];
eq(PS.childLists(ifNode).length, 3, 'if child lists: branches + else');
ok(PS.slotBody(ifNode, 'else') === ifNode.elseBody, 'else slot');
ok(PS.slotBody(ifNode, 1) === ifNode.branches[1].body, 'branch slot');
ok(PS.bodyOf(ifNode) === ifNode.elseBody, 'tail of an if is its else');
const moved = PS.parseLatex('\\State z\n\\If{a}\n\\State b\n\\Else\n\\State e\n\\EndIf');
ok(PS.reorder(moved.nodes, moved.nodes[0].id, moved.nodes[1].id, 'inside', 0), 'reorder into branch slot');
eq(moved.nodes[0].branches[0].body.map((n) => n.text), ['b', 'z'], 'dropped into the if branch, not else');
let visited = 0;
PS.walk(tree.nodes, () => { visited++; });
eq(visited, 4, 'walk visits every node');

done();
