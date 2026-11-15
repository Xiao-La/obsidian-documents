# Pseudocode Suite

Homeworks 自用的单文件伪代码插件：**自带 flat 渲染器 + 可视化构建器**，不再依赖 `pseudocode-in-obs` / `pseudocode-flat`，也不再内嵌 pseudocode.js。

## 功能

- 渲染 ` ```pseudo ` 代码块（兼容原有 LaTeX 语法）。
- 直接输出 CLRS 扁平风格：`if` 不带 then、`while` 不带 do、过程标题无编号、每个过程重新编号（注释行也编号）、else 后的第一句并到 else 行、行尾注释对齐。
- 阅读视图和 Live Preview 里，鼠标移到块上，右上角出现「Edit」（Live Preview 下在原生 `</>` 按钮左边），打开可视化构建器；编辑器里光标在块内时，右键菜单或命令「Edit pseudocode block under cursor」也可以打开。
- 构建器把 LaTeX 解析成语句树，可增删/缩进/移动、复制节点，右侧实时预览，保存回标准 ` ```pseudo ` 块。块在 callout / 引用里也能编辑（保存时保留 `> ` 前缀）。
- 工具栏：`+ Statement`、`+ If`、`+ For`、`+ While`、`+ Return`、`+ Call`、`+ Procedure`，其余（For each、Repeat、Require、Ensure、Break、Continue、Print、Comment line）在 `More…` 里。新语句插在选中行之后；选中的是容器行时插到它（对应分支）里面。
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
| 判等 | `=` 或 `==` | `x == 0`，窄的 `==`（同 CLRS 的 `\isequal`；条件里的单个 `=` 显示并保存为 `==`） |
| 常量 | `NIL`、`TRUE`、`FALSE`（任意全大写词） | 小型大写 ɴɪʟ / ᴛʀᴜᴇ，源码存为 `\textsc{nil}` |
| 报错 | `error "heap underflow"` | **error** “heap underflow”，源码存为 `\textbf{error} “heap underflow”` |
| 数学函数 | `max(a, b)`、`lg n`、`x mod y` | 直立的 max / lg / mod（单独的 `max = A[1]` 仍是变量 *max*） |
| 不等 | `!=`、`\neq`、`<>` | `x ≠ 0` |
| 比较 | `<=`、`>=`、`\le`、`\ge` | `≤`、`≥` |
| 逻辑 | `and`、`or`、`not`（或 `&&`、`||`） | 正体单词 and / or / not（同 CLRS，不加粗），源码存为数学之间的普通文字 `$i > 0$ and $A[i] > \mathit{key}$` |
| 逻辑符号 | 明确写 `\land`、`\lor`、`\lnot` | `∧`、`∨`、`¬`（不会被改成单词） |
| 循环 | 初值 + `to/downto` + 终值 | `for i = 0 to k`、`for j = n downto 1` |
| 全称循环 | `v in S` | **for** each v ∈ S（只有 for 是粗体，同 CLRS） |
| 调用 | 任意字段里直接写 `Merge-Sort(A, p, r)`、`x = Extract-Min(Q)`；Return 行里写 `Max-Heapify(A, i)`；或用 `+ Call` 节点 | `MERGE-SORT(A, p, r)`（小型大写） |
| 注释 | 行尾 `//` | **//** note（粗体打字机斜线，注释文字正常字号和颜色，同 CLRS） |
| 区间 | `A[1..n]` | A[1 . . n]（CLRS 的两点 `\twodots`），源码存为 `A[1 \twodots n]` |

构建器字段会自动按数学模式排版，不需要自己加 `$...$`；多字母标识符按 CLRS 排成斜体（*key*、*heap-size*，源码 `\mathit{key}`），和别的词用空格隔开的词按短语排成正体并保留空格（`exchange A[i] with A[j]`），字母后数字自动下标。原来就是纯文字的行（如 `\State Initialize the array`）编辑后仍保持纯文字。

调用的识别规则：大写字母开头、至少两个字母、可带连字符的名字紧跟 `(`（`Merge-Sort(`、`Parent(`、`PushS1(`），可嵌套（`Max(Left(i), Right(i))`）。单字母函数（`T(n)`、`O(n)`、`f(x)`）、小写名字和方法调用（`S.empty()`）仍是数学；字段里出现 `\` 时按原样保留，所以想要 `Pr(A)` 这种数学函数可写 `\mathrm{Pr}(A)`。保存为标准 `\Call{Name}{$args$}`，旧块里的 `\Call` 打开构建器时也会显示成 `Name(args)`。自然写法只在构建器字段里生效：源码里必须是 `\Call{...}`，手写的 `\Return Tree-Maximum(x.left)`（没有 `$`）按纯文字原样保留，不做猜测。

### 直接手写 LaTeX 块

- 数学要放在 `$...$` 里，例如 `\State $x \gets 0$`；不写 `$` 会被当成普通文本。
- `\For` 的 `to` / `downto` 可以写普通单词，也可以写 `\To` / `\DownTo`。
- `\ForAll{$v \in S$}`（构建器保存的形式），`\ForAll{v in S}` 也可以。
- 常量写 `\textsc{nil}` / `\textsc{true}`；旧的 `\text{NIL}`、`\mathrm{OVERFLOW}` 也按小型大写显示。
- 调用写成 `\Call{Name}{$args$}`；注释写成 `\Comment{...}`。
- 子数组区间写 `$A[1 \twodots n]$`（clrscode 的宏，显示为 CLRS 的 1 . . n）；`\ldots` 留给序列 `a_1, \ldots, a_n`。
- 逻辑连接词直接写在数学之间：`\If{$a < 0$ and $r > 0$}`，和 clrscode 一样按正体文字显示。旧笔记里的 `\textbf{and}` 仍能读，保存时改成普通的 and。

## 支持的 LaTeX 子集

- 结构：`\begin{algorithm}` / `\caption` / `\begin{algorithmic}`
- 过程：`\Function` / `\Procedure`（含 `\EndFunction` / `\EndProcedure`）
- 分支：`\If` / `\Elif` / `\ElsIf` / `\Else` / `\EndIf`
- 循环：`\While` / `\EndWhile`、`\For`（`\To` / `\DownTo`）/ `\EndFor`、`\ForAll` / `\EndFor`、`\Repeat` / `\Until`
- 语句：`\State`、`\Return`、`\Print`、`\Break`、`\Continue`
- 声明：`\Require`、`\Ensure`、`\Input`、`\Output`
- 注释：`\Comment`（行尾或独立行）
- 文本/数学命令：`\Call`、`\texttt`、`\mathit`、`\mathrm`、`\textbf`、`\gets`、`\le`、`\ge`、`\ne`、`\To`、`\ldots`、`\twodots` 等；其余命令按原样保留为 raw 行。

## 渲染细节

- 伪代码正文固定使用 Computer Modern 衬线字体（字体文件随插件放在 `fonts/`，不依赖主题；GitHub Theme 等无衬线主题下也保持 LaTeX 观感）。`@font-face` 由 `main.js` 用插件目录的真实资源 URL 注入（`styles.css` 里的相对 `url()` 在 Obsidian 中解析不到插件目录），弹出窗口里也会注入。

- 过程名用小型大写（`Push-S1` → Pᴜsʜ-S1），行内 `\Call` 同样。
- 排版以 CLRS（clrscode3e）为准：关键字粗体（if / elseif / while / for / to / downto / return / error），and / or / not 和 for each 的 each 是正体，多字母变量斜体，常量（NIL / TRUE / FALSE / OVERFLOW）和过程名小型大写，赋值 `=`、判等用窄的 `==`。
- 小型大写用插件自带的 Latin Modern Roman Caps 字体（`fonts/cm-smallcaps.otf`，即 TeX 的 cmcsc10，GUST Font License），不靠浏览器把大写字母缩小冒充。
- MathJax 没有 `\textsc`，常量从公式里拆出来用这套小型大写字体渲染（与过程名相同），两侧的运算符用空组保住 TeX 间距。
- 同 CLRS 第 3 版：else 分支的第一句是普通语句时并到 else 行（`else A[k] = R[j]`），其余语句照常缩进在下面；第一句是 if / while 等结构时 else 单独一行。合并时保留该语句的数学上下文和注释。
- 行号与正文同字号同颜色；赋值 `=` 两侧各多 1pt（clrscode `\gets`），注释里的 `=` 是普通等号。
- 过程标题（不带注释时）横跨注释列，长参数表不会挤窄下面各行的注释。
- 注释内容支持 `$...$` 数学，注释列自动对齐。
- 只有注释的行（`\State \Comment{...}`）有行号、不留空代码格：注释从代码栏开始、按该行缩进对齐，一直延伸到最右边（同 CLRS）。
- 过程标题和正文同字号（同 CLRS），块里第二个及之后的过程前留出段间距；`\caption` 标题加大并用小型大写的「Algorithm」标签，下面一条较粗的分隔线。
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
- 数学片段用 Obsidian 的 `renderMath` 同步排版（`PS.typesetMath`），输出与笔记里的行内公式相同（`span.math > mjx-container`），PDF 导出照常；出错时退回 `MarkdownRenderer`。慢的是 `finishRenderMath()`（MathJax 刷新样式表，约 100ms，块在此之前隐藏），所以排好的公式按 TeX 缓存（LRU，4000 条），重绘时直接克隆：全库 32 个块再次渲染从约 166ms 降到约 10ms，单块重绘从约 104ms 降到约 0ms。缓存不跨会话（CHTML 的字形依赖运行时生成的样式表）。
- 操作符别名（`\gets`、`:=`、`&&`…）和 ASCII→TeX 的转换只在 `core.js` 里各有一张表，构建器、序列化和渲染共用。
- 编辑按钮点击时才用 `getSectionInfo` 取当前行号，再按块内容核对；同内容的块取离该行最近的一个。
- 解析器把数学上下文记录在 AST（`textMath` / `condMath` / `argsMath`…），渲染时还原 `$...$`，所以 `S_1` 这类下标不会以源码形式漏出。
- 构建器预览走 `serialize → parse → render`，与保存后的结果完全一致。

## 已知限制

- 极复杂的 LaTeX 命令（未列在上面的）会以 raw 行原样保留，不参与排版。
- 手写 LaTeX 块时，`\Call` 需写在数学模式外（`\State $x \gets$ \Call{Name}{$args$}`），与旧插件一致；构建器会自动处理。
