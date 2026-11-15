# Figure Suite

在弹出面板里用简短的文本画《算法导论》风格的示意图，实时预览，导出成 PNG / SVG 文件、复制到剪贴板，或直接插入当前笔记。图片里保存了源码，之后可以随时重新打开编辑。

## 用法

- **新建**：命令「Figure Suite: New figure」、左侧栏的形状图标，或编辑器右键「Insert figure…」。
- 新建时面板是空的（占位文字提示从模板开始）；上次没插入就关掉的内容会作为草稿恢复，标题显示「(draft restored)」。
- 面板左边写源码，右边实时预览；问题在下方列出（红色 = 错误，橙色 = 警告：拼错的选项/指令、越界的下标等，图照常画），点一下跳到该行。
- 工具栏：模板（模糊搜索，30 个，覆盖下面所有类型；回车替换当前源码，可 Cmd/Ctrl+Z 撤销，Shift+回车追加为新块）、清空、语法速查、缩放（Ctrl/Cmd+滚轮也可以）、适应窗口。
- **拖动图（graph）的结点**：坐标自动写回源码（吸附 0.1，按住 Alt 不吸附），整次拖动只算一步撤销。
- 底部：文件名、格式（PNG/SVG）、PNG 倍率；`Copy PNG`、`Copy SVG`、`Save file`（只存附件并复制嵌入链接）、`Insert`（存到附件目录，在光标处单独一行插入 `![[x.png|宽度]]`）。没有打开的笔记编辑器时（例如阅读视图），主按钮变成 `Save & copy link`。`Cmd/Ctrl+Enter` = 主按钮。
- 有未保存内容时按 Esc / 点关闭，会先弹出确认条：继续编辑 / 关闭（内容留作草稿）/ 直接保存。
- **再编辑**：鼠标移到笔记里的图上，右上角出现「Edit」；或者光标放在图片链接那一行运行「Edit figure at cursor」/ 右键「Edit figure」；文件列表里右键 png/svg 也有「Edit with Figure Suite」。保存时原地覆盖文件；所有引用这张图、且宽度还是旧的 1× 宽度的链接会改成新宽度（手动改过的宽度不动）。

编辑器：Tab / Shift+Tab 缩进，回车保持缩进（在块头行回车自动缩进两格）。

## 覆盖范围

按《算法导论》各章的图归成 6 类通用图元（统计见 [PLAN.md](PLAN.md)）：

| 图元 | 用来画 |
|---|---|
| `array` | 数组、栈/队列、插入排序/快排分区、计数排序、串匹配对齐 |
| `table` | DP 表（LCS 箭头）、矩阵、邻接矩阵、二进制计数器、基数排序列 |
| `tree` | BST、堆、红黑树（NIL 哨兵）、B 树、旋转（子树三角）、递归树、Huffman 树、不相交集森林、顺序统计树 |
| `graph` | 有向/无向/带权图、BFS/DFS 状态、最短路、MST、流网络、SCC、DAG/拓扑排序、二分图、有限自动机、计算几何点集 |
| `list` / `chains` | 单/双向链表；散列表拉链、邻接表、桶 |
| `panel` / `arrow` / `text` | (a)(b)(c) 多面板、面板间带标签箭头、文字 |

没做的（极少用）：FFT 蝶形、排序网络、电路、矩阵链斜三角表、vEB、斐波那契堆。

## 语法

```
figure cols=2 size=15 fill=light   ← 可选全局：每行面板数、字号、默认填充、gap、align=top|center|bottom、background
panel (a)                          ← 新面板 + 标题（"(a)" 自动加粗）；panel 可带 dir=row
array A start=1                    ← 块头顶格：类型 名字 key=value 标志
  5 2 4 6 1 3                      ← 块体缩进
  shade: 2..3 gray                 ← 指令行：关键字加冒号
arrow "RL"                         ← 面板之间的箭头
```

`//` 或 `%` 开头的行是注释。不写 `panel` 时，块按竖直方向堆在同一个面板里；`arrow` 总是把左右分成两个面板。

### 标签（迷你 TeX）

- 默认是数学：字母斜体、数字正体，`x_1`、`n^2`、`x'`、`\alpha`…`\Omega`、`\infty \le \ge \ne \gets \to \in \cup \cdots`、`\uparrow \nwarrow \leftarrow`（LCS）、`\lceil \rfloor`、`\frac{a}{b}`、`\sqrt{n}`、`\overline{x}`、`\log \lg \min`（正体）。
- `v1` 自动排成 v₁；`NIL` 排成小型大写；两个以上大写字母（`RL`）正体。
- 含空格的标签用引号把整个标签括起来：`"c(n/2) + 1"`、`"n \log n"`（引号只是分组，内容仍是数学，空格保留）；标签中间出现的 `"..."` 是正体文字；也可以用 `\text{...}`，小型大写 `\textsc{...}`，粗体 `\textbf{...}`。`\\` 换行。
- `text`、`arrow` 和面板标题默认是文字模式，`$...$` 里是数学。
- 字形全部取自插件自带的 Computer Modern 字体并转成路径，预览、SVG、PNG 完全一致，与系统字体无关。

颜色：`white light shade gray dark black red pink blue lightblue green lightgreen yellow orange tan purple` 或 `#hex`；单个值可以写 `值@颜色`。

### array

```
array A start=1 index=above|below|none w=30 h=26 vertical fill=…
  5 2 _ 6                  _ = 空格子
  shade: 2..4 7 gray       区间可以多个，最后一个词是颜色（默认 shade）
  ptr: i=2 j=5 [below]     指针标签 + 箭头（同一格多个会合并；可以指到两端外一格，如 i=0）
  ptr: top 4
  span: 1..3 {\le x} [above|below] [square]   花括号/方括号区间
  bar: 3                   第 3 格后的粗竖线
  arc: 2 -> 1 [label] [below]                  格间弧形箭头
  index: a b c             自定义下标
```

### table

```
table c start=0 index grid=all|none|outer|rows|cols brackets w= h=
  0 0 0                    每行一行
  0 1 1
  cols: x A B              列表头（比列数多一个时，第一个放在角上）
  rows: 0 1                行表头（index 标志自动生成数字表头）
  shade: (1,2) (0..1,2) row=1 col=2 [color]
  arrow: (2,2) -> (1,1) -> (0,0)               格间箭头链；path: 同上不带箭头
```

`brackets`（或 `matrix`）画成矩阵：无网格 + 方括号。

### tree

```
tree r=14 levelgap= sibgap= shape=circle|box|ellipse|none arrows=up|down fill= trifill=
  26 black right=-2        缩进 = 孩子
    17 red edge=0 thick    edge= 父边标签；thick dashed noedge ecolor=red
      _                    空位：让唯一的孩子靠左/右
      nil                  NIL 哨兵（黑框）
    "α" tri h=1.5 w=1      子树三角（h、w 是倍数）
    [G M P]                B 树结点：边从关键字间隙引出
  level: 0 cn^2            右侧每层标注（递归树）
```

结点选项：`left= right= above= below=` 四周注释，形状 `circle box ellipse none point tri`，`double`，`loop`（自环，不相交集的根），颜色。根的缩进更浅的行开始新的一棵树（森林）。标签太长的圆结点自动变椭圆。

### graph

```
graph layout=auto|manual|layered|force|circle|line|grid dir=right unit=60 r= shape= spread=1 directed|undirected
  s (0,0) "0" gray above=s       结点：id 坐标（y 向上）标签 颜色/形状 注释
  s -> t 10                      有向；-- 无向；<-> 双向；<- 反向；可连写 a -- b -- c
  t -> x 1 thick bend=20         bend=角度（正 = 向左弯），swap 标签换边，inline 标签压在线上
  x -> x 3 loop=above            自环：above|below|left|right
  group: a b c [color]           SCC 等分组底色
  rank: a b                      layered 布局里放同一层
```

- `auto`：全部结点有坐标时手动；否则有向图用分层（Sugiyama），无向图用应力布局。
- `line`：结点排成一行，跨越的边自动成上方弧线（拓扑排序）。
- 直线边如果穿过其它结点会自动弯开；同一对结点的多条边自动错开。
- 结点形状：`circle box ellipse point none double`；`start` 画初始箭头（自动机）。

### list / chains

```
list L.head double fields=prev,key,next w= gap=
  9 16 4 1
  names: 2                 在第 2 个结点上方标出字段名
chains T double start=0
  0:                       空槽 = NIL 斜线
  1: k1 k4
  3: k5 k2 k7
```

### 其它

```
text "任意文字 $x^2$" size=13 bold align=left|center|right
arrow "label" len=60 dir=right|down|left|up both
space 20 10
```

## 设置

默认格式、PNG 倍率（插入时自动写 1× 宽度）、背景（白/透明）、字号、链表填充色、文件名前缀、是否在图片里嵌入源码、是否在链接里写宽度。

## 源码结构

```
figure-suite/
├── main.js / styles.css   ← 构建产物
├── manifest.json
├── build.py               ← 拼接 src/ → main.js
├── fonts/                 ← Computer Modern（regular / italic / bold）
├── src/
│   ├── font.js            ← TrueType 解析：cmap、hmtx、glyf → 字宽、字形路径
│   ├── mathtext.js        ← 迷你 TeX 排版 + 笔画符号（≤ ∞ ← ↖ …）
│   ├── svg.js             ← SVG 输出、箭头、颜色
│   ├── parse.js           ← 源码解析
│   ├── blocks.js          ← array / table / list / chains / text / arrow
│   ├── tree.js            ← 树（轮廓法整齐布局）
│   ├── graph.js           ← 图（分层 / 应力 / 圆 / 行 / 网格布局，弯边、自环、分组）
│   ├── compose.js         ← 面板组合
│   ├── edit.js            ← 拖动结点后改写源码
│   ├── templates.js
│   ├── export.js          ← PNG 光栅化、PNG iTXt / SVG metadata 存源码、剪贴板
│   ├── panel.js           ← 弹出面板
│   └── main.js            ← 命令、菜单、悬停 Edit 按钮、设置
└── tests/
    ├── harness.js
    └── test-engine.js
```

```bash
python3 build.py          # 构建
node tests/test-engine.js # 解析、标签、所有模板、拖动写回、PNG/SVG 源码往返
```

## 已知限制

- 只支持桌面端（剪贴板、画布导出）。
- 图的自动布局是起点：复杂的图拖一下结点最快。
- 字体里没有的字符（如中文）用系统衬线字体，SVG 在别的机器上可能换字体；PNG 不受影响。
