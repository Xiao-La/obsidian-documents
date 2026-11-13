const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const core = fs.readFileSync(path.join(root, 'src/core.js'), 'utf8');
const render = fs.readFileSync(path.join(root, 'src/render.js'), 'utf8');

const scope = {};
new Function('module', 'exports', core + '\n;module.exports = PS;')(scope, scope);
const PS = scope.exports;
new Function('PS', 'document', 'MarkdownRenderer', render)(PS, { createElement: () => ({ style: {}, classList: { add() {} }, appendChild() {} }) }, { render: async () => {} });

let pass = 0, fail = 0;
const ok = (cond, name, extra) => { if (cond) pass++; else { fail++; console.log('FAIL', name, extra || ''); } };

function rowsOf(src) { return PS.buildRows(PS.parseLatex(src)); }

// 1. basic numbering and procedure reset
const a = rowsOf(`\\Function{F}{$x$}
\\State a
\\State b
\\EndFunction
\\Function{G}{$y$}
\\State c
\\EndFunction`);
ok(a[0].number === null && a[0].kind === 'function', 'function header unnumbered');
ok(a[1].number === 1 && a[2].number === 2, 'numbering inside F');
ok(a[3].number === null, 'second function header unnumbered');
ok(a[4].number === 1, 'numbering resets per procedure');

// 2. else merge single statement
const b = rowsOf(`\\If{c}
\\State x
\\Else
\\State y
\\EndIf`);
const elseRow = b.find((r) => /else/.test(r.text));
ok(elseRow && /else/.test(elseRow.text) && /y/.test(elseRow.text), 'else merged with single statement', elseRow && elseRow.text);

// 3. else with two statements is not merged
const c = rowsOf(`\\If{c}
\\State x
\\Else
\\State y
\\State z
\\EndIf`);
ok(c.some((r) => r.text === '\\kw{else}'), 'multi-statement else keeps block');
ok(c.filter((r) => r.text === 'y' || r.text === 'z').length === 2, 'else body statements kept');

// 4. comments
const d = rowsOf(`\\State x \\Comment{note}`);
ok(d[0].comment === 'note', 'inline comment');

// 5. for all
const e = rowsOf(`\\ForAll{x in S}
\\State y
\\EndFor`);
ok(/for all/.test(e[0].text), 'for all keyword', e[0].text);

// 6. require/ensure unnumbered
const f = rowsOf(`\\Require{A}
\\Ensure{B}
\\State x`);
ok(f[0].number === null && f[1].number === null && f[2].number === 1, 'require/ensure unnumbered');

// 7. indentation depth
const g = rowsOf(`\\While{c}
\\If{d}
\\State x
\\EndIf
\\EndWhile`);
ok(g[0].depth === 0 && g[1].depth === 1 && g[2].depth === 2, 'depth increases');

// 8. comment-only state
const h = rowsOf(`\\State \\Comment{only}`);
ok(h[0].number === null && h[0].text === '' && h[0].comment === 'only', 'comment-only line unnumbered');

// 9. repeat
const i = rowsOf(`\\Repeat
\\State x
\\Until{done}`);
ok(/repeat/.test(i[0].text) && /until/.test(i[2].text), 'repeat/until');

// 10. unknown raw
const j = rowsOf(`\\Frobnicate{abc}`);
ok(j.length === 1, 'raw node renders a row');

// 15. full authoring: build a model like the builder does, round-trip it
const authored = {
  caption: 'Dijkstra',
  nodes: [
    PS.node('require', { text: 'G = (V, E), s' }),
    PS.node('ensure', { text: 'dist[v] 为最短距离', textMath: false }),
    PS.node('function', {
      kind: 'Function', name: 'Dijkstra', args: 'G, s', body: [
        PS.node('state', { text: 'dist[s] = 0' }),
        PS.node('state', { text: 'Q = V' }),
        PS.node('while', {
          cond: 'Q.length > 0', body: [
            PS.node('state', { text: 'u = Extract-Min(Q)' }),
            PS.node('if', {
              branches: [
                { cond: 'dist[u] + 1 < dist[v]', body: [
                  PS.node('state', { text: 'dist[v] = dist[u] + 1' }),
                  PS.node('call', { name: 'Relax', args: 'G, u' }),
                ] },
                { cond: 'dist[u] + 1 == dist[v]', body: [
                  PS.node('state', { text: 'done = true' }),
                ] },
              ],
              elseBody: [PS.node('state', { text: 'continue', textMath: false })],
            }),
          ],
        }),
        PS.node('for', { init: 'i = 1', bound: 'n', body: [PS.node('print', { text: 'i' })] }),
        PS.node('return', { text: 'dist', comment: 'final' }),
      ],
    }),
  ],
};
const authoredLatex = PS.serializeLatex(authored);
const authoredModel = PS.parseLatex(authoredLatex);
const authoredRows = PS.buildRows(authoredModel);
ok(authoredModel.caption === 'Dijkstra', 'authored caption survives');
ok(authoredModel.nodes.map((n) => n.type).join(',') === 'require,ensure,function', 'authored top-level nodes');
ok(authoredRows.some((r) => r.kind === 'function' && r.text.includes('Dijkstra')), 'authored function row');
ok(authoredRows.filter((r) => r.number !== null).length === 13, 'authored numbering count', authoredRows.map((r) => r.number));
ok(authoredModel.nodes[2].body[2].body[1].branches.length === 2 && authoredModel.nodes[2].body[2].body[1].elseBody.length === 1, 'authored branches');
ok(PS.serializeLatex(authoredModel).includes('\\Function{Dijkstra}'), 'authored function serialized');
ok(authoredLatex.includes('\\Comment{final}'), 'authored return comment serialized');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
