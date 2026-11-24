
定义集合（set）：一些无序的对象放在一起。

表示方式：列举；省略的列举；描述（Set builder）。

定义全集（Universal set）$U$：当前讨论的所有对象组成的集合。

重要的集合：
$$
\mathbb{N},\mathbb{Z},\mathbb{Z}^{+},\mathbb{Q},\mathbb{R},\mathbb{C}
$$

子集：$A\subseteq B$（允许相等）
真子集（Proper subset）：$A\subset B$（不相等）

定义集合的势（Cardinality）$\lvert S\rvert$：
- 对于有限集，就是元素的个数。
- 对于任意集合：我们说 $A$ 和 $B$ 等势（have the same cardinality），若 $A$ 和 $B$ 之间存在双射（one-to-one correspondence）。
- 我们说 $A$ 的势小于 $B$ 的势或与 $B$ 的势相同，若 $A$ 到 $B$ 存在一个单射（one-to-one function），记作 $\lvert A \rvert\leq \lvert B \rvert$（注意，这里并不是说数值上的小于或等于）。
- 若 $\lvert A \rvert\leq \lvert B \rvert$ 且 $A,B$ 不等势，那么记 $\lvert A \rvert<\lvert B \rvert$。


定义可数集（Countable Set）：有限集，或与 $\mathbb{Z}^{+}$ 等势。否则是不可数（Uncountable）。
- 要证明可数，只需说明用一个序列可以把这个集合列尽。
- $\mathbb{Z}$ 可数。可以列一个序列 $0,1,-1,2,-2,\dots$
- $\mathbb{Q}^{+}$ 可数。可以按这个来列举（依次去列 $p+q=2$ ，$p+q=3$ ... 的 $p / q$，再加一个 filter 要求 $p,q$ 不可约）：
![[Set and Function - 集合与函数.png|190]]
- 若 $S$ 可数，则 $S$ 的任意子集都可数。（加一个 filter 去掉不在子集里的，形成新的序列）
- 非空有限字母表 $A$ 上的有限字符串集 $S$ 是可数无穷的。先按长度、再在同一长度内按字典序枚举即可。
- 从上面这条，可以推出，所有 Java 程序组成的集合是可数的。（加一个 filter: Java Compiler）。

不可数集
-  $\mathbb{R}$ 不可数。假设 $\mathbb{R}$ 可数，那么它的子集 $[0,1]$ 也是可数的。那么其中的所有数可以列为
$$\begin{aligned}
r_{1}=0.d_{11}d_{12}d_{13}\dots \\
r_{2}=0.d_{21}d_{22}d_{23}\dots \\
r_{3}=0.d_{31}d_{32}d_{33}\dots \\
\dots\dots
\end{aligned}$$
- 那么可以构造这样一个小数 $r=0.d_{1}d_{2}d_{3}\dots$，令 $d_{i}=2$ 若 $d_{ii}\neq{2}$，令 $d_{i}=3$ 若 $d_{ii}=2$。那么 $r$ 与上面列的任何一个小数都至少有一位不同，所以它没有被列在这个表里。这就造成了矛盾。因此 $\mathbb{R}$ 不可数。这就是 Cantor Diagonalization Argument.
- $\mathcal{P}(\mathbb{N})$ 不可数。假设它可数，由于 $\mathbb{N}$ 的每个子集可以用一串唯一的比特串（bit string）表示（若 $j\in S$ 则 $b_{j}=1$）。那么可以用 Cantor Diagonalization Argument 构造出一个尚未列出的比特串（也就是尚未列出的子集）。

**Schroder-Bernstein Theorem**：
$$
(\lvert A \rvert \leq \lvert B \rvert\land\lvert B \rvert \leq \lvert A \rvert )\to \lvert A \rvert =\lvert B \rvert
$$
这可以让证明等势从找双射，变成找两个单射就好了。

**Disjoint Union（$\sqcup$）**：先标记两个集合，再做并集。例如，$A=\{ 1,2 \},B=\{ 2,3 \}$，那么 $A\sqcup B=A^*\cup B^*=\{ (1,1),(2,1) \}\cup \{ (2,2),(3,2) \}= \{ (1,1),(2,1),(2,2),(3,2) \}$。

定义幂集（Power set）$\mathcal{P}(S)$：所有 $S$ 的子集组成的集合。
- $\mathcal{P}(\varnothing)=\{ \varnothing \}$
- $\mathcal{P}(\{ 1,2 \})=\{ \varnothing, \{ 1 \},\{ 2 \},\{ 1,2 \} \}$
对于有限集 $S$，有 $\lvert \mathcal{P}(S) \rvert=2^{\lvert S \rvert}$。

定义元组（tuple）：一些有序的对象放在一起。
定义笛卡尔积（Cartesian Product）：
$$
A_{1}\times A_{2}\times\dots \times A_{n}=\{ (a_{1},a_{2},\dots,a_{n}):a_{i}\in A_{i} \}
$$
$A\times B\neq B\times A, \lvert A\times B \rvert=\lvert A \rvert\times \lvert B \rvert$
定义 $A$ 和 $B$ 之间的关系（Relation）：一个 $A\times B$ 的子集。

定义补集（Complement）$\bar{A}$：全集 $U$ 中不属于 $A$ 的元素组成的集合。
$$
\bar{A}=U-A=\{x\in U\mid x\notin A\}
$$

定义 **Disjoint**：两个集合无交。
集合恒等式：

| 名称 | 恒等式 |
| --- | --- |
| Identity laws | $A\cup\emptyset=A$<br>$A\cap U=A$ |
| Domination laws | $A\cup U=U$<br>$A\cap\emptyset=\emptyset$ |
| Idempotent laws | $A\cup A=A$<br>$A\cap A=A$ |
| Complementation laws | $\overline{\overline{A}}=A$ |
| Commutative laws | $A\cup B=B\cup A$<br>$A\cap B=B\cap A$ |
| Associative laws | $A\cup(B\cup C)=(A\cup B)\cup C$<br>$A\cap(B\cap C)=(A\cap B)\cap C$ |
| Distributive laws | $A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$<br>$A\cap(B\cup C)=(A\cap B)\cup(A\cap C)$ |
| De Morgan's laws | $\overline{A\cap B}=\overline{A}\cup\overline{B}$<br>$\overline{A\cup B}=\overline{A}\cap\overline{B}$ |
| Absorption laws | $A\cup(A\cap B)=A$<br>$A\cap(A\cup B)=A$ |
| Complement laws | $A\cup\overline{A}=U$<br>$A\cap\overline{A}=\emptyset$ |

要证明这些恒等式：
- 与真值表相对的，使用成员表（其中 0 表示不在集合中，1 表示在集合中）：

| $A$ | $B$ | $\overline{A}$ | $\overline{B}$ | $\overline{A \cap B}$ | $\overline{A} \cup \overline{B}$ |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | 0 | 0 | 0 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 | 1 |
| 0 | 0 | 1 | 1 | 1 | 1 |

- 也可以通过证明对应的逻辑表达式 $\forall x (x\in \text{LHS}\leftrightarrow x\in \text{RHS})$
- 也可以结合 Set builder 和逻辑等价律。
计算机中若全集确定且有限，可以通过一个比特串表示集合。

罗素悖论（第三次数学危机）：
$$
S=\{ x\mid x\not\in x \}
$$
- 若 $S\in S$，可以推出 $S\not\in S$。
- 若 $S\not\in S$，可以推出 $S\in S$。
需要一个公理化的集合论。

康托定理（Cantor Theorem）：
$$
\lvert S \rvert <\lvert \mathcal{P}(S) \rvert
$$

证明：
- 首先证明 $\lvert S \rvert \leq \lvert \mathcal{P}(S) \rvert$。只需要令 $f: S\to \mathcal{P}(S),$ 使得 $\forall s\in S, f(s)=\{ s \}\in\mathcal{P}(S)$。容易证明 $f$ 是 one-to-one 的，即这个 $\leq$ 成立。
- 再证明 $\lvert S \rvert\neq \lvert \mathcal{P}(S) \rvert$。只需要考虑 $S\neq \varnothing$ 的情况。反证法：假设 $\lvert S \rvert=\lvert \mathcal{P}(S) \rvert$  ，那么就存在一个从 $S$ 到 $\mathcal{P}(S)$ 的双射 $f$。考虑集合 $T:=\{ s\in S\mid s\not\in f(s) \}$。这里 $T$ 不是空集，因为若 $f(s')=\varnothing$，那么 $s'\in T$。同时，$T$ 必然是 $S$ 的子集，由双射，必然存在 $s_{0}\in S$ 使得 $f(s_{0})=T$。
- 那么，若 $s_{0}\in T$，则根据 $T$ 的定义，$s_{0}\not\in f(s_{0})=T$。若 $s_{0}\not\in T$，则 $s_{0}\not\in T=f(s_{0})$，那么根据 $T$ 的定义， $s_{0}\in T$。所以就产生了矛盾。（理发师悖论：$T$ 包含了所有不在自己的像里的元素。那么， $T$ 的原像在不在 $T$ 里？）


## 函数

定义函数（function）：两个集合 $A,B$ ，则 $f:A\to B$ 表示把 $A$ 中的每个元素对应到 $B$ 中的恰好一个元素。
- 设 $f: A\to B$ 是一个函数，则 $A$ 称为 $f$ 的定义域（Domain），$B$ 称为 $f$ 的陪域（Codomain），也称 $f$ 将 $A$ 映射到 $B$。
- 若 $f(a)=b$，则 $b$ 是 $a$ 的像（Image），$a$ 是 $b$ 的一个原像（Preimage）。
-  $A$ 中所有元素的像组成的集合称为 $f$ 的值域（Range），记为 $f(A)$。
- （子集的像）对于任意子集 $S\subseteq A$，$S$ 的像是由 $S$ 中各元素的像组成的 $B$ 的子集，记为 $f(S)=\{f(s)\mid s\in S\}$。

对 $f:A\to B$ 分类：
- 单射（Injective / one-to-one）：$f(x)=f(y)\to x=y$（等价地，$x\neq y\to f(x)\neq f(y)$）。
- 满射 （Surjective / onto）：$f(A)=B$ （值域就是陪域）。
- 双射（Bijective / one-to-one correspondence）：如果既是满射又是单射。

可以证明，对于**等势**的两个**有限**集合，单射和满射是等价的。（然而对于无限集合这是不对的）

可以定义反函数（Inverse Function） $f^{-1}(b)=a$ ，当且仅当 $f$ 是双射。
定义复合函数 $(f\circ g)(x)=f(g(x))$。
![[Set Theory - 集合论-5.png|609]]
若 $f:A\to B$ 是双射，那么可以记集合 $A$ 中的恒等函数（Identity Function）：$I_{A}=f^{-1}\circ f$。

定义一个函数是可计算的（Computable）：存在一个计算机程序可以找到函数的值。
- 不是所有函数都是可计算的。这是因为，计算机程序的集合是可数无穷的；而函数的集合是不可数无穷的。

### 一些重要函数

上/下取整函数 $\lceil x \rceil,\lfloor x \rfloor$

**TABLE 1** Useful Properties of the Floor and Ceiling Functions. ($n$ is an integer, $x$ is a real number)

| | Property |
| --- | --- |
| (1a) | $\lfloor x\rfloor=n \text{ if and only if } n\le x<n+1$ |
| (1b) | $\lceil x\rceil=n \text{ if and only if } n-1<x\le n$ |
| (1c) | $\lfloor x\rfloor=n \text{ if and only if } x-1<n\le x$ |
| (1d) | $\lceil x\rceil=n \text{ if and only if } x\le n<x+1$ |
| (2) | $x-1<\lfloor x\rfloor\le x\le\lceil x\rceil<x+1$ |
| (3a) | $\lfloor -x\rfloor=-\lceil x\rceil$ |
| (3b) | $\lceil -x\rceil=-\lfloor x\rfloor$ |
| (4a) | $\lfloor x+n\rfloor=\lfloor x\rfloor+n$ |
| (4b) | $\lceil x+n\rceil=\lceil x\rceil+n$ |

证明取整函数相关的式子考虑拆 $x=\widetilde{x}+a$ 其中 $\widetilde{x}$ 为整数部分。

## 序列 (Sequence)

序列（Sequence）的定义：一个函数，把整数的子集（通常是  $\{ 0,1,2,\dots \}$ 或 $\{ 1,2,3,\dots \}$）映射到集合 $S$。用 $a_{n}$ 来表示整数 $n$ 的像。用 $\{ a_{n} \}$  表示有序列表 $a_{1},a_{2},\dots$。

等差数列（Arithmetic Progression）：形为 $a,a+d,a+2d, \dots,a+nd$ 的序列。首项为 $a$，公差（Common Difference）为 $d$。
等比数列（Geometric Progression）：形为 $a,ar,a r^{2}, \dots, ar^{n}$ 的序列。首项为 $a$，公比（Common Ratio）为 $r$。

序列也可以用递归（Recursion）定义，例如 $f_{n}=f_{n-1}+f_{n-2}$ (Fibonacci Sequence)。

### 和式（Summations）

$\sum_{j=m}^n a_{j}=a_{m}+a_{m+1}+\dots+a_{n}$. 其中 $m$ 是 Lower Limit，$n$ 是 Upper Limit。
- 和式具有线性性（Linearity）：
$$
\sum_{j}(ax_{j}+by_{j})=a\sum_{j}x_{j}+b\sum_{j} y_{j}
$$
$$
\sum _{i} \sum_{j}a_{i}b_{j}=\sum_{i}a_{i}\sum_{j}b_{j}
$$
一些有用的和式：
- 等比级数的和
$$
\sum_{j=0}^{n}ar^{j}= a \frac{r^{n+1}-1}{r-1}
$$
对 $k^{1/2/3}$ 求和：
 $$
\sum_{k=1}^{n}k= \frac{n(n+1)}{2}
$$
$$
\sum_{k=1}^{n}k^{2}= \frac{n(n+1)(2n+1)}{6}
$$
$$
\sum_{k=1}^{n} k^{3}= \frac{n^{2}(n+1)^{2}}{4}
$$
（推导，以 $\sum k^{2}$ 为例，使用 Telescoping 方法/“邻差法”：考察这个式子
$$
\sum(k^{3}-(k-1)^{3})
$$
一方面抵消之后就只剩下 $n^{3}$，另一方面展开后它又等于 $3\sum k^{2}-3\sum k+n$，代入即可。）
（另外我们发现 $\sum k^{3}=\left( \sum k \right)^{2}$。它的证明：
$$
\begin{aligned}
\left(\sum_{i=1}^n i\right)^2&=\sum_{i=1}^{n}i\sum_{j=1}^{n}j \\
&= \sum_{i=1}^{n}i \left( \sum_{j=1}^{i}j+\sum_{j=i}^{n}j-i \right) \\
&=\sum_{1\leq j\leq i\leq n}ij+\sum_{1\leq i\leq j\leq n}ij-\sum_{i=1}^{n}i^{2} \\
&=2 \sum_{1\leq j\leq i\leq n}ij-\sum_{i=1}^{n}i^{2} \\
&=2\sum_{i=1}^{n}i\sum_{j=1}^{i}j-\sum_{i=1}^{n}i^{2} \\
&=2\sum_{i=1}^{n}i \cdot \frac{i(i+1)}{2} - \sum_{i=1}^{n}i^{2} \\
&=\sum_{i=1}^{n} i^{3}
\end{aligned}
$$
）
（无穷序列）
- 对 $\lvert x \rvert<1$，有
$$
\sum_{k=0}^{\infty}x^{k}=\lim_{ n \to \infty } \sum_{k=0}^{n} x^{k}= \frac{1}{1-x}
$$
$$
\sum_{k=0}^{\infty}kx^{k-1}= \frac{1}{(1-x)^{2}}
$$
（第二个式子可以用求导或**错位相减**的方法求得）

## 关系（Relation）

二元关系（Binary Relation）：从集合 $A$ 到 $B$ 的一个二元关系，是它们笛卡尔积 $A\times B$ 的一个子集 $R$。用记号 $aRb$ 表示 $(a,b)\in R$，用记号 $a\not R b$ 表示 $(a,b)\notin R$。

要表示一个关系：可以枚举出 $R$ 里面的所有有序对；也可以用图（箭头）来表示有序对，从而表示关系；也可以用表格/矩阵来表示（对应的分量为 1/0 表示这个有序对是否在关系中）。

关系可以是一对多的。因此，函数都是关系；而关系不总是函数。

定义集合 $A$ 上的关系（relation on a set $A$）为 $A$ 到 $A$ 的一个二元关系。若 $\lvert A \rvert=n$，那么集合 $A$ 上的关系有 $2^{n^{2}}$ 种。

对于一个集合 $A$ 上的关系 $R$，它可能具有一些特别的性质：
- **自反性（Reflexive）：** $(a,a)\in R \,\forall a\in A$。用矩阵表示，就是对角线上全 $1$。个数为 $2^{n^{2}-n}$ 种。
- **反自反性（Irreflexive）：** $(a,a)\notin R\, \forall a\in A$。用矩阵表示，就是对角线上全 $0$。个数为 $2^{n^{2}-n}$ 种。
- **对称性（Symmetric）：** $(a,b)\in R\to(b,a)\in R\, \forall a,b\in A$。用矩阵表示，就是对称矩阵。个数为 $2^{\frac{n^{2}+n}{2}}$。
- **反对称性（Antisymmetric）：** $(a,b)\in R \land(b,a)\in R\to a=b \, \forall a,b\in A$。用矩阵表示，就是对于 $i\neq j$，$m_{ij}=1\to m_{ji}=0$。计数，主对角线上自由，所以是 $2^{n}$；其他，每组对称的位置一共有三种选法：$(1,0),(0,1),(0,0)$，一共有 $\frac{n^{2}-n}{2}$ 组，因此总的个数为 $2^{n}\cdot3^{\frac{n^{2}-n}{2}}$。
- **传递性（Transitive）：** $(a,b)\in R\land(b,c)\in R\to(a,c)\in R \,\forall a,b,c\in A$。

自反性+对称性+传递性 得到 **等价关系（Equivalence Relation）；**
自反性+反对称性+传递性 得到 **偏序关系（Partial Ordering Relation）。**

关系之间的运算：既然关系实际上是一个集合，那么集合之间的运算（并，交，差）可以作用到关系上。

**复合关系（Composite of Relations）：** $R$ 从 $A$ 到 $B$；$S$ 从 $B$ 到 $C$，那么它们的复合 $S \circ R$ 定义为
$$
(a,b)\in R \land (b,c)\in S\to(a,c)\in S\circ R
$$
- 从 01 矩阵的表示方法看，这相当于矩阵乘法 $M_{R}M_{S}$（这里结果大于 $1$ 的设置为 $1$ 即可）

定义**关系的幂（power relation）**：
$$
R^{1}=R,\quad R^{n+1}=R^{n} \circ R
$$
关于传递性，有**定理**：$A$ 上的关系 $R$ 具有传递性，当且仅当 $R^{n}\subseteq R\, \forall n=1,2,3, \dots$。
证明：
- “当”：令 $n=2$，那么有 $R^{2}\subseteq R$，按照定义，$R$ 具有传递性。
- “仅当”：数学归纳法。
  - Base Case： $n=1$ 时， $R^{1}\subseteq R$ 显然成立。
  - I.H.：$\forall n\geq1, R^{n}\subseteq R$。
  - I.S.：$R^{n+1}=R^{n}\circ R$。由定义，对于任意 $(a,b)\in R^{n+1}$，存在 $x$ 使得 $(a,x)\in R$，以及 $(x,b)\in R^{n}\subseteq R$。那么由 $R$ 的传递性，$(a,b)\in R$。于是 $R^{n+1}\subseteq R$。

表示 $n$ 元关系的方式：
- 用显式的列表/表格存它的元组。这就是一个关系数据库（Relational Database）。
- 用一个从定义域到 $\{ T,F \}$ 上的函数表示。
表示二元关系的方式：
- 零一矩阵。
- 有向图。
![[Set and Function - 集合与函数-1.png|516]]
### 闭包（Closures of Relations）

**定义。** $S$ 是 $R$ 的**自反闭包**（Reflexive Closure of $R$），当：
- $S$ 包含 $R$。
- $S$ 是自反的。
- $S$ 是最小的（对所有包含 $R$ 的自反关系 $Q$，有 $S\subseteq Q$）。

对于其他性质，也可以类似地定义：
- **对称闭包**（Symmetric Closure）
- **传递闭包**（Transitive Closure）

反自反和反对称不可以定义闭包，因为不能通过添加元素让性质满足。
一般的，可以定义关系 $R$ 关于性质 $P$ 的闭包：最小的包含 $R$ 且满足性质 $P$ 的集合 $S$。

自反闭包和对称闭包是容易找的，添加主对角线/对称位置缺失的部分即可。
而传递闭包没那么直观，可以看有向图：找传递闭包，就相当于在有向图中，把所有连通的 pair 加进去。

定义有向图中的路径（Path）是一系列边 $(x_{0},x_{1}),(x_{1},x_{2}), \dots, (x_{n-1},x_{n})$，其中 $n\geq0$。若$x_{0}=x_{n}$，那么说这个路径是一个回路（Circuit / Cycle）。
**定理：** $R$ 是 $A$ 上的一个关系，那么存在一个从 $a$ 到 $b$ 的长度为 $n$ 的路径，当且仅当 $(a,b)\in R^{n}$。证明：
- 数学归纳法。Base Case： $n=1$，根据定义，$(a,b)\in R$，当且仅当有路径 $a\to b$。
- I.H.：$(a,b)\in R^{n}$ 当且仅当由路径 $\overbrace{a\to\dots\to b}^{n}$。
- I.S.：$(a,b)\in R^{n+1}=R^{n}\circ R$ 当且仅当存在 $x$ 使得 $(a,x)\in R,(x,b)\in R^{n}$，那么根据归纳假设，这等价于存在路径 $\underbrace{a\to \overbrace{x\to\dots\to b}^{n}}_{n+1}$。

定义 关系 $R$ 的 **连通关系（Connectivity Relation）：** 
$$
R^{*}= \bigcup _{k=1}^{\infty}R^{k}
$$
这也就是 $R$ 所有长度的所有路径的起终点组成的关系。

**引理：** 若 $\lvert A \rvert=n$，那么，若存在一个 $a$ 到 $b$ （$a\neq b$）的路径，就会有一个长度 $\leq n-1$ 的路径。
- 证明：把路径上的所有回路删掉，那么每个顶点最多被访问一次，只有 $n$ 个顶点，最长路径就只有 $n-1$。
于是连通关系可以写成：
$$
R^{*}= \bigcup _{k=1}^{n} R^{k}
$$
**定理：** $R$ 的传递闭包（Transitive Closure）就是它的连通关系（Connectivity Relation） $R^{*}$。
证明：需要分别考虑传递闭包的三条定义。
- $R^{*}$ 显然包含 $R$。
- $R^{*}$ 是传递的。
  - 证明：对任意 $(a,b),(b,c)\in R^{*}$，我们知道 $a$ 到 $b$ 有一个路径，$b$ 到 $c$ 有一个路径，把路径连起来，就得到有一个 $a$ 到 $c$ 的路径，于是 $(a,c)\in R^{*}$。
- $R^{*}\subseteq S$ 对任意包含 $R$ 的传递的关系 $S$。
  - 证明：假设 $S$ 是一个包含 $R$ 的传递的关系。那么 $S^{n}$ 也是传递的，且 $S^{n}\subseteq S$。
    - 证明：若 $(a,b),(b,c)\in S^{n}$，那么 $a$ 到 $b$ 和 $b$ 到 $c$ 各有一个长度为 $n$ 的路径。我们知道 $S^{n}\subseteq S$，那么容易构造一条 $a$ 到 $c$ 的长度为 $n$ 的路径，于是 $(a,c)\in S^{n}$.
 - 于是 $R^{*}\subseteq S^{*}\subseteq S$。

找传递闭包的算法：
- 考虑零一矩阵 $\boldsymbol{M}_{R}$。
- 那么传递闭包对应矩阵就是 $\boldsymbol{M}_{R}= \boldsymbol{M}_{R}\boldsymbol{M}_{R}^{[2]} \dots \boldsymbol{M}_{R}^{[n]}$。
- 硬算是 $\Theta(n^{4})$ 的，若矩阵乘法视为 $\Theta(n^{3})$。
- 改进的算法：Roy-Warshall（$\Theta(n^{3})$），类似于 Floyd，不断引入第 $k$ 个节点（$k=1,2, \dots n$），看能不能改善连通性（让更多的边连通），这样迭代到 $k$ 的时候就求出了只经过 $\leq k$ 的节点的连通性。
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Roy-Warshall}{$\boldsymbol{M}_R$}
    \State $W = \boldsymbol{M}_R$
    \For{$k=1$ \To $n$}
      \For{$i=1$ \To $n$}
        \For{$j=1$ \To $n$}
          \State $w_{\mathit{ij}}=w_{\mathit{ij}}\lor(w_{\mathit{ik}}\land w_{\mathit{kj}})$
        \EndFor
      \EndFor
    \EndFor
    \Return $W$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

### $n$ 元关系与数据库

$R:A_{1},A_{2}, \dots, A_{n}$，定义为 $R\subseteq A_{1}\times A_{2}\times\dots \times A_{n}$。
- $A_{i}$ 叫 $R$ 的定义域（Domains）
- $R$ 的度（degree）为 $n$。
- 若对于定义域 $A_{i}$ 中的任意元素 $a_{i}$，$R$ 包含至多一个 $n$ 元组 $(\dots,a_{i},\dots)$，那么称 $R$ 在定义域 $A_{i}$ 上是功能性的（Functional）。

**主键（Primary Key）：** 若 $R$ 在 定义域 $A_{i}$ 上是功能性的，就说 $A_{i}$ 是主键。
类似的，有**复合键（Composite Key）**： 把上面主键的定义，换成对一个定义域的集合 $\{ A_{i},A_{j}, \dots \}$，$R$ 包含至多一个 $n$ 元组 $(\dots, a_{i}, \dots, a_{j}, \dots)$。

可以用 E-R 图表示关系数据库（Entity-Relation）![[Set and Function - 集合与函数-2.png|550]]若 $A=A_{1}\times A_{2}\times \dots \times A_{n}$ 上有一个关系 $R$，那么有一些运算符：
- 选择（Selection Operator）：定义一个条件 $C:A\to \{ T,F \}$。那么选择就是选出关系中满足这个条件的一些行：
$$
s_{C}(R)=\{ a\in R \mid s_{C}(a)=T \}
$$
- 投影（Projection Operator）：令一系列 $1$ 到 $n$ 之间的下标 $\{ i_{k} \}=(i_{1},i_{2}, \dots, i_{m})$，那么投影就是保留这些下标对应的一些列：
$$
P_{\{ i_{k} \}}: A\to A_{i_{1}}\times A_{i_{2}}\times \dots A_{i_{m}}
$$
$$
P_{\{ i_{k} \}}(a_{1},a_{2}, \dots, a_{n}) = (a_{i_{1}},a_{i_{2}},\dots,a_{i_{m}})
$$
- 合并（Join Operator）：若 $R_{1}$ 中有 $(A,B)$，$R_{2}$ 中有 $(B,C)$，那么合并的关系 $J(R_{1},R_{2})$ 中就有 $(A,B,C)$。

