# Pseudocode Suite

Homeworks 自用的单文件伪代码插件：**自带 flat 渲染器 + 可视化构建器**，不再依赖 `pseudocode-in-obs` / `pseudocode-flat`，也不再内嵌 pseudocode.js。

## 功能

- 渲染 ` ```pseudo ` 代码块（兼容原有 LaTeX 语法）。
- 直接输出 CLRS 扁平风格：`if` 不带 then、`while` 不带 do、过程标题无编号、每个过程重新编号、单句 else 合并、行尾注释对齐。
- 阅读视图和 Live Preview 里，鼠标移到块上，右上角出现「Edit」（Live Preview 下在原生 `</>` 按钮左边），打开可视化构建器；编辑器里光标在块内时，右键菜单或命令「Edit pseudocode block under cursor」也可以打开。
- 构建器把 LaTeX 解析成语句树，可增删/缩进/移动、复制节点，右侧实时预览，保存回标准 ` ```pseudo ` 块。块在 callout / 引用里也能编辑（保存时保留 `> ` 前缀）。
- 工具栏：`+ Statement`、`+ If`、`+ For`、`+ While`、`+ Return`、`+ Call`、`+ Procedure`，其余（For all、Repeat、Require、Ensure、Break、Continue、Print、Comment line）在 `More…` 里。新语句插在选中行之后；选中的是容器行时插到它（对应分支）里面。
- 每行右侧：`+` 加语句（容器行加到里面）、`⋯` 更多操作、`✕` 删除（else-if / else 行是删除该分支）。`⋯` 或右键菜单里有：加 else-if / else、移动、缩进、行尾注释、复制、删除。
- 拖拽行首 `⠿` 可排序（拖到行中间放入容器，拖到 else-if / else 行放入该分支）；容器行可折叠。
- 字段里含原始 LaTeX（`$`、`\`）时左侧有橙色标记，表示按原样保留。
- 有未保存修改时，按 Esc、点外面或关闭按钮会询问 Keep editing / Discard / Save；没改动时保存不会写文件。
- 过程名、调用名不能为空（保存时会提示并定位）。

### 构建器快捷键

| 键 | 作用 |
|---|---|
| Enter | 容器行：在（该分支）内部加一条语句；普通行：在后面加一条 |
| Shift+Enter | 在后面加一条（容器行也一样） |
| ↑ / ↓ | 跳到上 / 下一行的输入框 |
| ⌥/Alt+↑↓ | 上下移动当前行 |
| Cmd/Ctrl+] / [ | 缩进 / 取消缩进 |
| Cmd/Ctrl+/ | 添加（或移除空的）行尾注释 |
| Cmd/Ctrl+Shift+D | 复制当前行 |
| Cmd/Ctrl+Shift+K | 删除当前行 |
| Cmd/Ctrl+Z / Shift+Z（或 Y） | 撤销 / 重做（文字输入和结构操作都算，同一字段连续输入算一步） |
| Cmd/Ctrl+Enter | 保存并关闭 |
| Esc | 关闭（有修改时先确认） |

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

构建器字段会自动按数学模式排版，不需要自己加 `$...$`；多字母标识符自动正体、字母后数字自动下标，单词之间的空格会保留（`exchange A[i] with A[j]`）。原来就是纯文字的行（如 `\State Initialize the array`）编辑后仍保持纯文字。

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

- 伪代码正文固定使用 Computer Modern 衬线字体（字体文件随插件放在 `fonts/`，不依赖主题；GitHub Theme 等无衬线主题下也保持 LaTeX 观感）。`@font-face` 由 `main.js` 用插件目录的真实资源 URL 注入（`styles.css` 里的相对 `url()` 在 Obsidian 中解析不到插件目录），弹出窗口里也会注入。

- 过程名用小型大写（`PushS1` → PᴜsʜS1），行内 `\Call` 同样。
- 全大写常量（OVERFLOW / TRUE / FALSE）按文本直立排版，不进数学斜体。
- `else` 合并单句时保留该语句的数学上下文。
- 注释内容支持 `$...$` 数学，注释列自动对齐。
- 只有注释的行（`\State \Comment{...}`）不留空代码格：注释从代码栏开始、按该行缩进对齐，一直延伸到最右边（同 CLRS）。
- 过程标题放大一档，块里第二个及之后的过程前留出段间距；`\caption` 标题加大并用小型大写的「Algorithm」标签，下面一条较粗的分隔线。
- 长行自动换行，不再被裁切。

## 设置

设置 → 第三方插件 → Pseudocode Suite：

- 显示行号
- 缩进宽度（默认 `1.2em`；只接受 `em` / `rem` / `px` / `ch` / `pt` 长度，非法值标红不生效）
- 注释前缀（默认 `//`）

修改后已渲染的块（阅读视图和 Live Preview）会就地重绘，不用重开笔记。

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
    ├── harness.js   ← 在 Obsidian 外加载 src/、找库里的块、计数断言
    ├── test-core.js
    ├── test-render.js
    └── test-main.js
```

构建：

```bash
cd .obsidian/plugins/pseudocode-suite
python3 build.py
```

测试：

```bash
node tests/test-core.js    # 解析/序列化：所有库的伪代码块往返（含数学/文字标记）、注释保留、空格等
node tests/test-render.js  # 行号、else 合并、缩进、ForAll、注释等
node tests/test-main.js    # 代码块定位（重复块、callout、长围栏）、设置校验
```

`test-core.js` 会扫描本库、Obsidian 记录的所有库（`obsidian.json`），以及环境变量 `PS_VAULTS`（用路径分隔符分隔）里的额外目录。

## 实现要点

- **渲染器直接产出 flat DOM**，不再靠 MutationObserver 事后改 DOM；导出 PDF 时天然一致。
- 数学片段用 Obsidian 的 `MarkdownRenderer` 排版（`PS.typesetMath`），避免隐藏导出窗口里 MathJax 不工作；每个块只调用一次（每个公式一段，按位置对回），对不上的再逐个渲染。
- 操作符别名（`\gets`、`:=`、`&&`…）和 ASCII→TeX 的转换只在 `core.js` 里各有一张表，构建器、序列化和渲染共用。
- 编辑按钮点击时才用 `getSectionInfo` 取当前行号，再按块内容核对；同内容的块取离该行最近的一个。
- 解析器把数学上下文记录在 AST（`textMath` / `condMath` / `argsMath`…），渲染时还原 `$...$`，所以 `S_1` 这类下标不会以源码形式漏出。
- 构建器预览走 `serialize → parse → render`，与保存后的结果完全一致。

## 已知限制

- 极复杂的 LaTeX 命令（未列在上面的）会以 raw 行原样保留，不参与排版。
- 行内数学里的 `\Call` 需写在数学模式外（`\State \Call{Name}{$args$}`），与旧插件一致。
