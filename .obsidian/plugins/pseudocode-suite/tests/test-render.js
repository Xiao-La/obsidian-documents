const { loadPS, suite } = require('./harness');

const PS = loadPS();
const { ok, done } = suite();

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

// 3. else with two statements: the first joins the else line (CLRS 3e: "else A[k] = R[j]")
const c = rowsOf(`\\If{c}
\\State x
\\Else
\\State y
\\State z
\\EndIf`);
ok(c.some((r) => r.text === '\\kw{else} y') && c.find((r) => r.text === 'z').depth === 1, 'first else statement joins the else line', c.map((r) => r.text));
const cIf = rowsOf(`\\If{c}
\\State x
\\Else
\\If{d}
\\State y
\\EndIf
\\EndIf`);
ok(cIf.some((r) => r.text === '\\kw{else}'), 'else before a nested if stays alone', cIf.map((r) => r.text));

// 4. comments
const d = rowsOf(`\\State x \\Comment{note}`);
ok(d[0].comment === 'note', 'inline comment');

// 5. for all
const e = rowsOf(`\\ForAll{x in S}
\\State y
\\EndFor`);
ok(e[0].text === '\\kw{for} each $x \\in S$', 'for each ... in (CLRS: only for is bold)', e[0].text);

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
ok(h[0].number === 1 && h[0].text === '' && h[0].comment === 'only', 'comment-only line numbered (CLRS)');
ok(h[0].note === true, 'comment-only line is a full-width note');
const notes = rowsOf('\\For{$j = 2$ to $n$}\n\\State $k = 1$\n\\State \\Comment{why}\n\\EndFor');
ok(notes[2].note === true && notes[2].depth === 1 && notes[1].note !== true, 'note keeps its indent; code rows are not notes', notes);

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

// Comments on block lines, constants inside expressions, prose comments.
const commented = `\\If{$y \\neq z.right$} \\Comment{is $y$ farther down?}
\\State $x = y$
\\Else \\Comment{otherwise climb}
\\State $y = x.p$
\\EndIf`;
const cm = rowsOf(commented);
ok(cm[0].comment === 'is $y$ farther down?' && !cm[0].text.includes('Comment'), 'if-line comment kept on the if row', cm[0]);
const cmElse = cm.find((r) => /^\\kw\{else\}/.test(r.text));
ok(cmElse && cmElse.comment === 'otherwise climb' && cmElse.text === '\\kw{else} $y = x.p$', 'else comment kept on the joined else line', cm.map((r) => r.text));
ok(PS.serializeLatex(PS.parseLatex(commented)).includes('\\Else \\Comment{otherwise climb}'), 'else comment serialized');
const nilRow = rowsOf('\\While{$x \\neq \\text{NIL}$ and $k \\neq x.\\mathit{key}$}\n\\State $x = x.\\mathit{left}$\n\\EndWhile');
const nilMath = PS.parseInline(nilRow[0].text).filter((t) => t.type === 'math').map((t) => t.value);
const nilConst = PS.parseInline(nilRow[0].text).filter((t) => t.type === 'constant').map((t) => t.value);
ok(nilConst[0] === 'nil' && nilMath[0] === 'x \\ne{}' && nilMath[1].includes('\\mathit{key}'), 'NIL small caps, identifiers italic (CLRS)', [nilMath, nilConst]);
ok(PS.parseInline('$p$ is the value of $ab$', true).some((t) => t.type === 'math' && t.value === 'ab'), 'prose comment math untouched');
const mixed = rowsOf('\\If{$Q.tail = Q.size$ and $Q.head = 1$}\n\\State x\n\\EndIf')[0].text;
ok((mixed.match(/==/g) || []).length === 2, 'single = in mixed condition shown as ==', mixed);
ok(rowsOf('\\State \\texttt{alph} $\\gets 0$')[0].text.includes('\\texttt{alph}'), 'texttt kept');

// Prose read from the source renders as text; builder fields render as math.
const prose = rowsOf('\\State Initialize the array')[0].text;
ok(prose === 'Initialize the array', 'prose row is plain text', prose);
const spaced = PS.parseInline(rowsOf('\\State $\\mathit{exchange}\\ A[i]$')[0].text).find((t) => t.type === 'math');
ok(spaced && spaced.value.includes('\\ '), 'explicit math spaces survive normalization', spaced);
const trailing = PS.parseInline('$x and$').find((t) => t.type === 'math');
ok(trailing && !/\s$/.test(trailing.value), 'math tex trimmed (Obsidian rejects "$x $")', trailing);
const until = rowsOf('\\Repeat\n\\State x\n\\Until{$x = 1$} \\Comment{why}');
ok(until[2].comment === 'why' && until[2].text.includes('=='), 'until row: comment and comparison', until[2]);

// Binary operator next to a call stays binary.
const bridged = (src) => PS.bridgeOperators(PS.parseInline(src)).map((t) => (t.type === 'call' ? `CALL:${t.name}` : `${t.type}:${t.value}`));
ok(JSON.stringify(bridged('\\Call{Max}{$i$} $+ T(n)$')) === JSON.stringify(['CALL:Max', 'math:{}+ T(n)']), 'leading + after call keeps binary spacing', bridged('\\Call{Max}{$i$} $+ T(n)$'));
ok(JSON.stringify(bridged('$x +$ \\Call{F}{$i$}')) === JSON.stringify(['math:x +{}', 'CALL:F']), 'trailing + before call keeps binary spacing', bridged('$x +$ \\Call{F}{$i$}'));
ok(JSON.stringify(bridged('$x =$ \\Call{Extract-Min}{$Q$}')) === JSON.stringify(['math:x \\mathrel{\\mkern1.8mu{=}\\mkern1.8mu}', 'text: ', 'CALL:Extract-Min']), 'relations not bridged (assignment = gets CLRS spacing)', bridged('$x =$ \\Call{Extract-Min}{$Q$}'));
const callRows = rowsOf('\\Return \\Call{Max-Heapify}{$A, i$}');
ok(callRows[0].text.includes('\\Call{Max-Heapify}'), 'return of a call renders the call', callRows[0]);

// CLRS keywords and small-caps constants.
ok(rowsOf('\\If{$a$}\n\\State b\n\\ElsIf{$c$}\n\\State d\n\\EndIf')[2].text.startsWith('\\kw{elseif}'), 'elseif is one word (CLRS)');
const consts = PS.parseInline('$\\{\\textsc{true}, \\textsc{false}\\}$').map((t) => `${t.type}:${t.value}`);
ok(JSON.stringify(consts) === JSON.stringify(['math:\\{', 'constant:true', 'math:{},{}', 'constant:false', 'math:\\}']), 'constants split out of math, operators keep spacing', consts);
const boolRow = rowsOf('\\Return TRUE')[0].text;
ok(boolRow === '\\kw{return} TRUE', 'prose constant left as written', boolRow);
const boolMath = rowsOf('\\Return $\\textsc{true}$')[0].text;
ok(PS.parseInline(boolMath).some((t) => t.type === 'constant' && t.value === 'true'), 'return TRUE in small caps', boolMath);

// CLRS \isequal: a narrow ==, also right before a constant.
const eqTokens = PS.parseInline('$y == \\textsc{nil}$');
ok(/\\class\{ps-eq\}\{=\}.*\\class\{ps-eq\}\{=\}\}\{\}$/.test(eqTokens[0].value), 'narrow == keeps its relation spacing', eqTokens[0].value);
ok(!/ps-eq/.test(PS.parseInline('$a \\le b, x = y$')[0].value), 'only == is narrowed');
// CLRS ranges and assignment.
ok(PS.parseInline('$A[1 \\twodots n]$')[0].value === 'A[1 \\mathinner{\\ldotp\\ldotp}n]', 'twodots range', PS.parseInline('$A[1 \\twodots n]$')[0].value);
ok(!/mkern/.test(PS.parseInline('$q = a$', true)[0].value), 'equality in comments keeps plain =');
const andRow = rowsOf('\\While{$i > 0$ and $A[i] > \\mathit{key}$}\n\\EndWhile')[0].text;
ok(PS.parseInline(andRow).some((t) => t.type === 'text' && t.value.trim() === 'and'), 'and is roman text', andRow);

done();
