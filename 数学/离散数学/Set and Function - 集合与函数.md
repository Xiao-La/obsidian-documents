
定义集合（set）：一些无序的对象放在一起。

表示方式：列举；省略的列举；描述（Set builder）。

重要的集合：
$$
\mathbb{N},\mathbb{Z},\mathbb{Z}^{+},\mathbb{Q},\mathbb{R},\mathbb{C}
$$

子集：$A\subseteq B$ 
真子集（Proper subset）：$A\subset B$

定义集合的势（Cardinality）$|S|$：
- 对于有限集，就是元素的个数。
- 对于任意集合：我们说 $A$ 和 $B$ 等势（have the same cardinality），若 $A$ 和 $B$ 之间存在满射（one-to-one correspondence）。
- 我们说 $A$ 的势小于 $B$ 的势或与 $B$ 的势相同，若 $A$ 到 $B$ 存在一个单射（one-to-one function），记作 $\lvert A \rvert\leq \lvert B \rvert$（注意，这里并不是说数值上的小于或等于）。
- 若 $\lvert A \rvert\leq \lvert B \rvert$ 且 $A,B$ 不等势，那么记 $\lvert A \rvert<\lvert B \rvert$。


定义可数集（Countable Set）：有限集，或与 $\mathbb{Z}^{+}$ 等势。否则是不可数（Uncountable）。
- 要证明可数，只需说明用一个序列可以把这个集合列尽。
- $\mathbb{Z}$ 可数。可以列一个序列 $0,1,-1,2,-2,\dots$
- $\mathbb{Q}^{+}$ 可数。可以按这个来列举（依次去列 $p+q=2$ ，$p+q=3$ ... 的 $p / q$，再加一个 filter 要求 $p,q$ 不可约）：
![[Set and Function - 集合与函数.png|190]]
- 若 $S$ 可数，则 $S$ 的任意子集都可数。（加一个 filter 去掉不在子集里的，形成新的序列）
- 有限字母表 $A$ 上的有限字符串集 $S$ 是可数无穷的。用字典序去形成序列即可。
- 从上面这条，可以推出，所有 Java 程序组成的集合是可数的。（加一个 filter: Java Compiler）。

不可数集
-  $\mathbb{R}$ 不可数。假设 $\mathbb{R}$ 可数，那么它的子集 $[0,1]$ 也是可数的。那么其中的所有数可以列为 
$$\begin{align}
r_{1}=0.d_{11}d_{12}d_{13}\dots \\
r_{2}=0.d_{21}d_{22}d_{23}\dots \\
r_{3}=0.d_{31}d_{32}d_{33}\dots \\
\dots\dots
\end{align}$$
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

定义 **Disjoint**：两个集合无交。
集合恒等式：
![[Set Theory - 集合论.png|298]]
![[Set Theory - 集合论-1.png|299]]
![[Set Theory - 集合论-2.png|302]]
要证明这些恒等式：
- 与真值表相对的，使用成员表（其中 0 表示不在集合中，1 表示在集合中）：
![[Set Theory - 集合论-3.png|383]]
- 也可以通过证明对应的逻辑表达式 $\forall x (x\in LHS\leftrightarrow x\in RHS)$
- 也可以结合 Set builder 和逻辑等价律。
计算机中若全集确定且有限，可以通过一个比特串表示集合。

罗素悖论（第三次数学危机）：
$$
S=\{ x|x\not\in x \}
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
- 再证明 $\lvert S \rvert\neq \lvert \mathcal{P}(S) \rvert$。只需要考虑 $S\neq \emptyset$ 的情况。反证法：假设 $\lvert S \rvert=\lvert \mathcal{P}(S) \rvert$  ，那么就存在一个从 $S$ 到 $\mathcal{P}(S)$ 的双射 $f$。考虑集合 $T:=\{ s\in S|s\not\in f(s) \}$。这里 $T$ 不是空集，因为若 $f(s')=\emptyset$，那么 $s'\in T$。同时，$T$ 必然是 $S$ 的子集，由双射，必然存在 $s_{0}\in S$ 使得 $f(s_{0})=T$。
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
- 双射（Bijective / one-to-one correspondence）：如果既是满射又是双射。

可以证明，对于**等势**的两个**有限**集合，单射和满射是等价的。（然而对于无限集合这是不对的）

可以定义反函数（Inverse Function） $f^{-1}(b)=a$ ，当且仅当 $f$ 是双射。
定义复合函数 $(f\circ g)(x)=f(g(x))$。
![[Set Theory - 集合论-5.png|609]]
若 $f:A\to B$ 是双射，那么可以记集合 $A$ 中的恒等函数（Identity Function）：$I_{A}=f^{-1}\circ f$。

定义一个函数是可计算的（Computable）：存在一个计算机程序可以找到函数的值。
- 不是所有函数都是可计算的。这是因为，计算机程序的集合是可数无穷的；而函数的集合是不可数无穷的。

### 一些重要函数

上/下取整函数 $\lceil x \rceil,\lfloor x \rfloor$
![[Set Theory - 集合论-4.png|353]]
证明取整函数相关的式子考虑拆 $x=\widetilde{x}+a$ 其中 $\widetilde{x}$ 为整数部分。

## 序列 (Sequence)

序列（Sequence）的定义：一个函数，把整数的子集（通常是  $\{ 0,1,2,\dots \}$ 或 $\{ 1,2,3,\dots \}$）映射到集合 $S$。用 $a_{n}$ 来表示整数 $n$ 的像。用 $\{ a_{n} \}$  表示有序列表 $a_{1},a_{2},\dots$。

算术级数（Arithmetic Progression）：形为 $a,a+d,a+2d, \dots,a+nd$ 的序列。首项为 $a$，公差（Common Difference）为 $d$。
几何级数（Geometric Progression）：形为 $a,ar,a r^{2}, \dots, ar^{n}$ 的序列。首项为 $a$，公比（Common Ratio）为 $r$。

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
（推导，以 $\sum k^{3}$ 为例，使用 Telescoping 方法/“邻差法”：考察这个式子
$$
\sum(k^{3}-(k-1)^{3})
$$
一方面抵消之后就只剩下 $n^{3}$，另一方面展开后它又等于 $3\sum k^{2}-3\sum k+n$，代入即可。）
（另外我们发现 $\sum k^{3}=\left( \sum k \right)^{2}$。它的证明：
$$
\begin{align}
\left( \sum_{i=1}^n k\right)^{2}&=\sum_{i=1}^{n}i\sum_{j=1}^{n}j \\
&= \sum_{i=1}^{n}i \left( \sum_{j=1}^{i}j+\sum_{j=i}^{n}j-i \right) \\
&=\sum_{1\leq j\leq i\leq n}ij+\sum_{1\leq i\leq j\leq n}ij-\sum_{i=1}^{n}i^{2} \\
&=2 \sum_{1\leq j\leq i\leq n}ij-\sum_{i=1}^{n}i^{2} \\
&=2\sum_{i=1}^{n}i\sum_{j=1}^{i}j-\sum_{i=1}^{n}i^{2} \\
&=2\sum_{i=1}^{n}i \cdot \frac{i(i+1)}{2} - \sum_{i=1}^{n}i^{2} \\
&=\sum_{i=1}^{n} i^{3}
\end{align}
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

