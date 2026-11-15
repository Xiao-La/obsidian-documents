/*
 * Figure Suite — source rewriting for direct manipulation in the preview.
 */

const fmtCoord = (v) => {
  const r = Math.round(v * 100) / 100;
  return String(Object.is(r, -0) ? 0 : r);
};

/**
 * Write `at=(x,y)` for every node in `positions` (Map id → [x, y]) into the
 * graph block `blockIndex`. Existing coordinates are replaced; nodes only
 * mentioned in edges get a declaration line at the top of the block body.
 */
function setGraphPositions(source, blockIndex, positions) {
  const fig = parseFigure(source);
  const block = fig.blocks[blockIndex];
  if (!block || block.kind !== 'graph') return source;
  const lines = String(source).replace(/\r\n?/g, '\n').split('\n');
  const g = parseGraph(block, []);
  const indentOf = (lineNo) => (lines[lineNo - 1].match(/^[ \t]*/) || [''])[0];
  const bodyIndent = block.body.length ? indentOf(block.body[0].line) : '  ';
  const coord = ([x, y]) => `(${fmtCoord(x)},${fmtCoord(y)})`;
  const missing = [];
  for (const [id, pos] of positions) {
    const node = g.nodes.get(id);
    if (!node) continue;
    if (!node.line) { missing.push(`${bodyIndent}${id} at=${coord(pos)}`); continue; }
    const k = node.line - 1;
    let text = lines[k];
    const atRe = /(\sat=)\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)/;
    const bareRe = /(\s)\(\s*-?[\d.]+\s*,\s*-?[\d.]+\s*\)(?=\s|$)/;
    if (atRe.test(text)) text = text.replace(atRe, `$1${coord(pos)}`);
    else if (bareRe.test(text)) text = text.replace(bareRe, `$1${coord(pos)}`);
    else {
      // insert right after the id (keeps the line readable)
      const m = text.match(/^([ \t]*)(\S+)/);
      text = m ? `${m[1]}${m[2]} ${coord(pos)}${text.slice(m[0].length)}` : text;
    }
    lines[k] = text;
  }
  if (missing.length) lines.splice(block.line, 0, ...missing.map((l) => l.replace(/ at=/, ' ')));
  return lines.join('\n');
}
