# Pseudocode Suite

Homeworks 自用的单文件伪代码插件：**自带 flat 渲染器 + 可视化构建器**，不再依赖 `pseudocode-in-obs` / `pseudocode-flat`，也不再内嵌 pseudocode.js。

## 功能

- 渲染 ` ```pseudo ` 代码块（兼容原有 LaTeX 语法）。
- 直接输出 CLRS 扁平风格：`if` 不带 then、`while` 不带 do、过程标题无编号、每个过程重新编号、单句 else 合并、行尾注释对齐。
- 阅读视图里每块右上角「✎ 编辑」，打开可视化构建器。
- 构建器把 LaTeX 解析成语句树，可增删/缩进/移动、复制节点，右侧实时预览，保存回标准 ` ```pseudo ` 块。
- 构建器界面为英文：`+ Statement`、`+ If`、`+ While`、`+ For`、`+ For all`、`+ Repeat`、`+ Procedure`、`+ Require`、`+ Ensure`、`+ Return`、`+ Call`、`+ Break`、`+ Print`、`+ Comment`。
- if 行支持 `+else if` / `+else` / `-branch` / `-else`；每条语句可点 `//` 添加/编辑行尾注释。
- 行操作：`↑↓` 移动、`⇤⇥` 缩进、`+` 在内部加语句、`+after` 在后面加语句、`⧉` 复制、`✕` 删除。
- 拖拽行首 `⠿` 可排序（拖到行中间放入容器，拖到上/下边缘插到前面/后面）；容器行 `▾/▸` 可折叠。
- for 行可切 `to` / `downto`；函数/过程名不能为空（保存时会提示并定位）。

### 构建器快捷键

| 键 | 作用 |
|---|---|
| Enter | 容器行：在内部加一条语句；普通行：在后面加一条 |
| Tab | 正常切换到下一个输入框 |
| Cmd/Ctrl+Z | 撤销最近一次结构操作 |
| Cmd/Ctrl+Enter | 保存并关闭 |
| Esc | 取消 |
| 拖拽 `⠿` | 排序 / 放入容器 |

## 书写约定（构建器里）

| 意图 | 可以这样敲 | 渲染 |
|---|---|---|
| 赋值 | `=`、`\gets`、`:=`、`<-`、`←` | `x = 1` |
| 判等 | `=` 或 `==` | `x == 0`（条件里的单个 `=` 也显示为 `==`） |
| 不等 | `!=`、`\neq`、`<>` | `x ≠ 0` |
| 比较 | `<=`、`>=`、`\le`、`\ge` | `≤`、`≥` |
| 逻辑 | `and`、`or`、`not`、`&&`、`||`（或 `\land`、`\lor`、`\lnot`） | `∧`、`∨`、`¬` |
| 循环 | 初值 + `to/downto` + 终值 | `for i = 0 to k`、`for j = n downto 1` |
| 全称循环 | `v in S` | `for all v in S` |
| 调用 | `+ Call` 节点；条件里可写 `\Call{Name}{$args$}` | `NAME(args)` |
| 注释 | 行尾 `//` | `// note` |

构建器字段会自动按数学模式排版，不需要自己加 `$...$`；多字母标识符自动正体、字母后数字自动下标。

### 直接手写 LaTeX 块

- 数学要放在 `$...$` 里，例如 `\State $x \gets 0$`；不写 `$` 会被当成普通文本。
- `\For` 的 `to` / `downto` 可以写普通单词，也可以写 `\To` / `\DownTo`。
- `\ForAll{$v$ in $S$}` 或 `\ForAll{v in S}` 都可以。
- 调用写成 `\Call{Name}{$args$}`；注释写成 `\Comment{...}`。

## 支持的 LaTeX 子集

- 结构：`\begin{algorithm}` / `\caption` / `\begin{algorithmic}`
- 过程：`\Function` / `\Procedure`（含 `\EndFunction` / `\EndProcedure`）
- 分支：`\If` / `\Elif` / `\ElsIf` / `\Else` / `\EndIf`
- 循环：`\While` / `\EndWhile`、`\For`（`\To` / `\DownTo`）/ `\EndFor`、`\ForAll` / `\EndFor`、`\Repeat` / `\Until`
- 语句：`\State`、`\Return`、`\Print`、`\Break`、`\Continue`
- 声明：`\Require`、`\Ensure`、`\Input`、`\Output`
- 注释：`\Comment`（行尾或独立行）
- 文本/数学命令：`\Call`、`\texttt`、`\mathit`、`\mathrm`、`\textbf`、`\gets`、`\le`、`\ge`、`\ne`、`\To`、`\ldots` 等；其余命令按原样保留为 raw 行。

## 渲染细节

- 伪代码正文固定使用 Computer Modern 衬线字体（字体文件随插件放在 `fonts/`，不依赖主题；GitHub Theme 等无衬线主题下也保持 LaTeX 观感）。

- 过程名用小型大写（`PushS1` → PᴜsʜS1），行内 `\Call` 同样。
- 全大写常量（OVERFLOW / TRUE / FALSE）按文本直立排版，不进数学斜体。
- `else` 合并单句时保留该语句的数学上下文。
- 注释内容支持 `$...$` 数学，注释列自动对齐。
- 长行自动换行，不再被裁切。

## 设置

设置 → 第三方插件 → Pseudocode Suite：

- 显示行号
- 缩进宽度（默认 `1.2em`）
- 注释前缀（默认 `//`）

旧版 `pseudocode-in-obs` 的 `jsSettings` 会自动迁移。

## 源码结构

```
pseudocode-suite/
├── main.js          ← 构建产物
├── styles.css       ← 构建产物
├── manifest.json
├── data.json
├── build.py         ← 构建脚本
├── src/
│   ├── core.js      ← AST、LaTeX 解析/生成
│   ├── render.js    ← flat 渲染器（AST → DOM）
│   ├── builder.js   ← 可视化构建器
│   ├── main.js      ← 插件入口（命令、代码块处理器、设置）
│   └── styles.css
└── tests/
    ├── test-core.js
    └── test-render.js
```

构建：

```bash
cd .obsidian/plugins/pseudocode-suite
python3 build.py
```

测试：

```bash
node tests/test-core.js    # 解析/序列化：两库全部伪代码块往返 + 边界用例
node tests/test-render.js  # 行号、else 合并、缩进、ForAll、注释等
```

## 实现要点

- **渲染器直接产出 flat DOM**，不再靠 MutationObserver 事后改 DOM；导出 PDF 时天然一致。
- 数学片段用 Obsidian 的 `MarkdownRenderer` 在元素挂载后排版（`PS.typesetMath`），避免隐藏导出窗口里 MathJax 不工作。
- 解析器把数学上下文记录在 AST（`textMath` / `condMath` / `argsMath`…），渲染时还原 `$...$`，所以 `S_1` 这类下标不会以源码形式漏出。
- 构建器预览走 `serialize → parse → render`，与保存后的结果完全一致。

## 已知限制

- 极复杂的 LaTeX 命令（未列在上面的）会以 raw 行原样保留，不参与排版。
- 行内数学里的 `\Call` 需写在数学模式外（`\State \Call{Name}{$args$}`），与旧插件一致。
