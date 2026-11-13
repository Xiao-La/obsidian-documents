
## 计数原理

- 乘法法则（the Product Rule）：分解成**相互依赖的**一系列计数，乘起来
- 加法法则（the Sum Rule）：分解成**独立的**一系列计数，加起来

穷举
- 树状图（Tree Diagrams）：用分支表示不同选择，数叶子节点的个数。

鸽巢原理（Pigeonhole Principle）
- 物品的个数大于箱子的个数，把物品放到箱子里，那么至少有一个箱子有至少两个物品。（反证法）
- 扩展版本：$N$ 个物品，$k$ 个箱子，至少有一个箱子有至少 $\lceil N / k \rceil$ 个物品。（反证法）

### 双射原理

一个集合到自己的双射（bijection）叫做置换（permutation）。
对有限集合来说，存在双射的两个集合，元素个数一定相等。这也是一种计数原理：双射原理（the Bijection Principle）。
- 例如求和 $\sum _{i=1}^{n}\sum _{j=i+1}^{n}\sum _{k=j+1}^{n} 1$ ，相当于数三元组 $(i,j,k)$ 的个数，其中 $1\leq i<j<k\leq n$（increasing triples）。
- 这相当于数 集合 $\{ 1,2, \dots,n \}$ 的 3 元素的子集的个数，也就是 $\binom{n}{3}$.
- 证明：令递增三元组构成的集合为 $X$，令三元素子集构成的集合为 $Y$，令
$$
f:X\to Y,\quad (i,j,k)\mapsto \{ i,j,k \}
$$
- $f$ 是单射：$(i,j,k)\neq(i',j',k')\to f((i,j,k))\neq f((i',j',k'))$。
- $f$ 是满射：任何 $Y$ 中的元素 $\gamma$，都可以把元素按顺序排列，得到它的原像。
- 因此 $f$ 是双射。

### 容斥原理

**容斥原理（Inclusion-Exclusion Principle）：** 修正重复的计数。两个集合的版本：
$$
\lvert A\cup B \rvert = \lvert A \rvert+ \lvert B \rvert-\lvert A\cap B \rvert
$$
三个集合的版本：
$$
\lvert A\cup B\cup C \rvert= \lvert A \rvert+\lvert B \rvert+\lvert C \rvert -\lvert A\cap B \rvert-\lvert A\cap C \rvert-\lvert B\cap C \rvert+ \lvert A\cap B\cap C \rvert
$$
$n$ 个集合的版本：
$$
\left\lvert  \bigcup _{i=1}^{n}E_{i}  \right\rvert = \sum _{k=1}^{n} (-1)^{k+1}  \sum _{1\leq i_{1}<i_{2}< \dots <i_{k}\leq n} \left\lvert  \bigcap _{m=1}^{k} E_{i_{m}}  \right\rvert
$$

可以据此计数所有 **满射** 函数 $f:A\to B$ 的个数。这里 $\lvert A \rvert=m,\lvert B \rvert=n$。
- 令 (a) 表示满射函数的个数，(b) 表示不是满射的函数个数。那么
$$
\#(a)+\#(b)=n^{m}
$$
- 设 $E_{i}$ 为所有使得 $i \in B$ 没有原像的函数的集合。于是
$$
\#(b)= \left\lvert   \bigcup _{i=1}^{n} E_{i} \right\rvert = \sum _{k=1}^{n} (-1)^{k+1} \binom{n}{k} (n-k)^{m}
$$
这里是因为，容斥原理中，$\lvert E_{i_{1}} \cap E_{i_{2}}\cap \dots \cap E_{i_k}\rvert$ 交集的个数，相当于这个函数只能映射到除了 $i_{1},i_{2}, \dots , i_{k}$ 以外的那 $n-k$ 个元素，所以有 $(n-k)^{m}$ 个；而选出这 $k$ 个下标的方式有 $\binom{n}{k}$ 种。
**证明（对 $n$ 归纳）**
**Base case（$n=2$）：** $|E\cup F|=|E|+|F|-|E\cap F|$。
**Inductive hypothesis：** 公式对任意 $n-1$ 个集合成立。
**Inductive step：** 取 $E=E_1\cup\cdots\cup E_{n-1}$，$F=E_n$，由两集合情形得
$$
\left|\bigcup_{i=1}^{n}E_i\right|
=\left|\bigcup_{i=1}^{n-1}E_i\right|+|E_n|-\left|\left(\bigcup_{i=1}^{n-1}E_i\right)\cap E_n\right|.
$$
第一项由归纳假设展开。对第三项用分配律：
$$
\left(\bigcup_{i=1}^{n-1}E_i\right)\cap E_n=\bigcup_{i=1}^{n-1}G_i,\qquad G_i=E_i\cap E_n.
$$
于是
$$
\left|\bigcup_{i=1}^{n}E_i\right|
=\left|\bigcup_{i=1}^{n-1}E_i\right|+|E_n|-\left|\bigcup_{i=1}^{n-1}G_i\right|.
$$
对 $G_1,\dots,G_{n-1}$ 也用归纳假设。因为 $G_{i_1}\cap\cdots\cap G_{i_k}=E_{i_1}\cap\cdots\cap E_{i_k}\cap E_n$，所以
$$
-(-1)^{k+1}|G_{i_1}\cap\cdots\cap G_{i_k}|
=(-1)^{k+2}|E_{i_1}\cap\cdots\cap E_{i_k}\cap E_n|.
$$
这正是 $k+1$ 个集合相交、且下标含 $n$ 的项，符号也正确。
最后合并：
- 第一项的展开式：对所有**不含 $n$** 的下标列 $i_1<\cdots<i_k$ 求和 $(-1)^{k+1}|E_{i_1}\cap\cdots\cap E_{i_k}|$。
- $|E_n|$ 与第三项的展开式：对所有**含 $n$** 的下标列求和同样的式子。
两部分恰好覆盖所有下标列，即得 $n$ 个集合的公式。

## 排列数和组合数

**$k$-element permutations(排列) with $n$ distinct elements.**  从一个 $n$ 元集合中，选 $k$ 个不同的元素排成一列的个数：
$$
P(n,k)=n(n-1)(n-2) \dots (n-k+1) = \frac{n!}{(n-k)!}
$$
**$k$-combinations of a set with $n$ elements.** 从一个 $n$ 元集合中，选 $k$ 元子集的个数：
$$
\binom{n}{k}=C(n,k)=  \frac{P(n,k)}{k!}= \frac{n!}{k!(n-k)!}
$$
这个组合数也是 **二项式系数（Binomial Coefficient）**：
$$
(x+y)^{n}= \sum _{i=0}^{n} \binom{n}{i} x^{n-i}y^{i}
$$
这个可以通过数学归纳法证明。
性质：
- $\binom{n}{0}=\binom{n}{n}=1$。
- $\binom{n}{k}=\binom{n}{n-k}$。从代数角度很好理解（algebraic proof）。另一方面，从组合的角度看（combinatorial proof），利用双射原理，左边是 $k$-subsets 的个数，右边是$(n-k)$-subsets 的个数。那么把左边的 subset，映射到它的补集（这就是右边的 subset），这是个双射，因此个数相等。
- $\sum _{i=0}^{n}\binom{n}{i}=2^{n}$。组合角度，左边是大小为 $i$ 的子集求和，也就是大小为 $n$ 的集合的所有子集个数。这和长度为 $n$ 的比特串一一对应，比特串的个数就是 $2^{n}$。（也可以在二项式展开式令 $x=y=1$ 证明）
**帕斯卡三角（Pascal's Triangle）/杨辉三角。**
![[Counting - 计数.png|397]]
**帕斯卡恒等式（Pascal's Identity）：**
$$
\binom{n}{k}= \binom{n-1}{k-1}+\binom{n-1}{k}
$$
- 组合角度证明：$n$ 个元素集合，选 $k$-subsets，相当于考虑两种情况：某个特定元素选/不选。选的情况数就是 $\binom{n-1}{k-1}$，不选的情况数就是 $\binom{n-1}{k}$。
三项式系数（Trinomial Coefficients）：有 $n$ 个物品，3 种颜色，每种分别染色  $k_{1},k_{2},k_{3}$ 个物品，这里 $k_{1}+k_{2}+k_{3}=n$。那么，总共的方法数就是
$$
\binom{n}{k_{1}}\binom{n-k_{1}}{k_{2}}\binom{n-k_{1}-k_{2}}{k_{3}} = \frac{n!}{k_{1}!k_{2}!k_{3}!}
$$
这就是三项式系数。可以记作
$$
\binom{n}{k_{1}\,k_{2}\,k_{3}}
$$
那么 $(x+y+z)^{n}$ 中， $x^{k_{1}}y^{k_{2}}z^{k_{3}}$ 的系数就是对应的三项式系数。

## 生日悖论（Birthday Paradox）

设 $A_{n}$ 表示，一间教室里面 $n$ 个学生，至少两个学生的生日相同。
设 $B_{n}$ 表示，一间教室里面 $n$ 个学生，没有学生的生日相同。
样本空间：$\lvert S \rvert=365^{n}$。
这里 $B_{n}$ 相当于计数所有 one-to-one function $f:S\to D$，其中 $S$ 为学生的集合，$D$ 为日期的集合。因此 $\#B_{n}=365\times364\times\dots \times(365-n+1)$。另外 $\#A_{n}+\#B_{n}=\lvert S \rvert$，就可以算出 $A_{n}$ 的概率。计算得到，若至少有 $23$ 个学生，那 至少两个学生生日相同的概率就超过 $1 / 2$。

"Birthday" Attack：对于 $H$ 个值，分配给 $n$ 个人（哈希），那么至少两个人有相同的值的概率
$$
p(n;H):= 1- \prod _{i=1}^{n-1} \left( 1- \frac{i}{H} \right)
$$
考虑近似 $e^{x} \approx 1+x$，那么 
$$
p(n;H)\approx 1- e^{-n(n-1) / 2H}\approx 1-e^{-n^{2} / 2H}
$$
求解反函数：
$$
n(p;H)\approx \sqrt{2H\ln \frac{1}{1-p}} \sim \sqrt{H}
$$
那么，要让找到碰撞（Collision, 也就是两个人有相同的值）的概率至少为 $p$ ，所需要的人数只有 $\sqrt{H}$。从这个也可以看出生日悖论。
