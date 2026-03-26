## 集合（Set）

集合的基数（Cardinality）为其元素（Element）的个数。
可以用集合的外延（Extension）和内涵（Intension）定义一个集合。
 - 外延：列出所有元素。
 - 内涵：用某种共性：$\{x|\varphi(x)\}$。
子集（Subset）和真子集（Proper Subset）的定义与以往相同。

幂集（Power Set）：
>  若 $A$ 是一个集合，则 $A$ 的幂集 $P(A):= \{X|X \subseteq A\}$。

集合运算（Set Operations）：
- 并集（Union）
- 交集（Intersection）
- 差集（Difference）
## 关系（Relation）

有序 n 元组（n-tuples）：
>  $n$ 个元素的有序列表，记作 $\langle a_{1},a_{2},a_{3},\dots ,a_{n} \rangle$
>  和集合的区别：元素可重复，有序，元素个数有限。

### 二元关系（Binary Relation）

笛卡尔积（Cartesian product）$A\times B$：
$$
A\times B=\{ \langle x,y \rangle | x \in A , y \in B \}
$$
集合 $A$ 和 $B$ 的一个二元关系 $R$ 是它们笛卡尔积的子集。
$$
R \subseteq A\times B
$$
$\langle x,y \rangle \in R$ 记作 $R(x,y)$ 或 $xRy$，读作 "x is R-related to y"。

若 $R \subseteq A^2$ ，则称 $R$ 是 $A$ 上的二元关系。
- $<$ 是 $\mathbb{N, Z,R}$ 上的二元关系。
### N 元关系（N-ary relation）

若 $R \subseteq A^n$，则称 $R$ 是 $A$ 上的 n 元关系。
- 一元关系（Unary Relation）
- 二元关系（Binary Relation）
- 三元关系（Ternary Relation）
- ...
### 等价关系（Equivalence Relation）

若 $A$ 上的二元关系 $R$ 满足条件：
- 自反（Reflexive）：$\forall x \in A, xRx$。
- 对称（Symmetric）： $\forall x,y \in A, xRy\implies yRx$。
- 传递（Transitive）：$\forall x,y,z \in A, xRy, yRz \implies xRz$。
则称 $R$ 是 $A$ 上的一个等价关系。

### 等价类（Equivalence Class）

若 $x \in A$ 且 $A$ 上有一个等价关系 $R$，则 $x$ 的等价类：
$$
[x]_{R}:= \{ y \in A|xRy \}
$$
等价类的性质：
- 每个元素只属于一个等价类。
- 不同的等价类是不相容的。
- 所有等价类的并集是原集合 $A$。

### 偏序关系（Partial Order Relation）

反对称（Antisymmetric）：$\forall x,y \in A, xRy, yRx\implies x=y$（不可能有两个不同的元素有双向关系）。
若 $A$ 上的二元关系 $R$ 满足自反，反对称，传递，则称其为一个偏序关系。
若不存在 $y\in A(y \neq x)$ 使得 $yRx$，则 $x$ 为该偏序的极小元（Minimal element）。
若不存在 $y \in A(y \neq x)$ 使得 $xRy$，则 $x$ 为该偏序的极大元（Maximal element）。
- $\leq$ 是 $\mathbb{N}$ 上的一个偏序。极小元是 $0$，无极大元。
- "$x$ 可被 $y$ 整除"是 $\mathbb{N}^+$ 上的一个偏序。无极小元，极大元为 $1$。

### 全序关系（Total Order/Linear Order Relation）

一个偏序关系如果满足：
	若 $x,y \in A$，则 $xRy$ 或 $yRx$ 总有一个成立。
则称其为一个全序关系。
对全序关系，把元素之间的指向关系画成图，则该图会是一条链。

## 函数（Functions）

一元函数可以定义为一个二元关系 $R$：
- $\forall x \in X, \exists y \in Y, s.t. xRy$。
- $y,z \in Y , xRy, xRz \implies y=z$
记号：
$$
f: A\to B
$$
- 定义域（Domain）为 $A$。
- 陪域/上域（Codomain）为 $B$ ，是所有可能的取值。
- 值域（Range）为实际取到的值，是 $B$ 的子集。
若 $\langle x,y \rangle \in f$，通常记 $f(x)=y$。
自然也有 $n$ 元函数（n-ary function）：
$$
f:A_{1}\times A_{2}\times\dots \times A_{n}\to B
$$
对于 $f:X\to Y$：
- 单射（Injective, one-to-one）：$\forall x_{1},x_{2} \in X, f(x_{1})=f(x_{2})\implies x_{1}=x_{2}$。
- 满射（Surjective, onto）：$\forall y \in Y, \exists x \in X s.t. f(x)=y$
- 双射（Bijective, one-to-one correspondence）：既满足单射也满足满射。


![[Prerequisite Knowledge - 预备知识.png]]

## 数学定义与证明（Mathematical Definitions and Proof）

- 归纳定义（Inductive Definiton）。例如定义 $\mathbb{N}$：$0\in \mathbb{N}$，且 $n \in \mathbb{N}\implies n+1 \in \mathbb{N}$，且只有前两个规则产生的元素才属于 $\mathbb{N}$。
- 归纳证明（Proof by Induction）。若要证明 $P(x) \forall x$：
  - 先证明 $P(n_{0})$ 成立（Base case）。
  - 归纳假设：假设 $P(k)$ 对 $k= n_{0}$ 成立。
  - 归纳：证明 $P(k+1)$ 成立。
- 递归定义（Recursive Definition）：
$$
\begin{cases}
f(0)=g(0) \\
f(n')=h(f(n))
\end{cases}
$$
