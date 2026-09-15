## 随机事件

 随机试验（Random Experiment / Experiment）：
 - 可重复
 - 所有结果确定可知
 - 一次只出现一个结果，且结果不可预测

样本点（Sample Point）：每个可能的基本结果（fundamental outcome）。记作 $\omega$。
样本空间（Sample Space）：包含一个实验的所有样本点的集合。记作 $\Omega$。
随机事件（Random Event / Event）：样本空间的一个子集。记作一个大写字母，如 $A,B,C$。

事件之间的关系和集合论中的一样：
- 包含（Inclusion）：$A\subset B$
- 和/并（Sum/Union）：$A\cup B(A+B)$
- 积/交（Product/Intersection）：$A\cap B(AB)$
- 差（Difference）：$A-B(A\backslash B)$
- 互斥（Mutually exclusive/disjoint）：$A\cap B=\varnothing$
- 对立/互补（Complement）：$A\cap B=\varnothing \&A\cup B=\Omega$

且事件之间的运算满足：
- 交换律（Communicative Laws）：$A \cap B=B\cap A$
- 结合律（Associative laws）：$A\cap (B\cap C)=(A\cap B)\cap C$
- 分配率（Distributive Law）：$A\cup(B\cap C)=(A\cup B)\cap(A\cup C)$
- 德摩根律（De Morgan's Laws）：$\overline{\bigcup_{i=1}^{\infty} A_i} = \bigcap_{i=1}^{\infty} \overline{A_i}, \qquad \overline{\bigcap_{i=1}^{\infty} A_i} = \bigcup_{i=1}^{\infty} \overline{A_i}$

## 概率

概率测度（Probability Measure），简称概率（Probability），是一个定义在样本空间 $\Omega$ 的子集上的实值函数，满足一下三个公理：
- 非负性（Non-negativity）：对任意 $A\subset \Omega$，$P(A)\geq 0$。
- 规范型（Normalization）：$P(\Omega)=1$。
- 可加性（Additivity）：对于任何互斥事件 $A_{1},A_{2},\dots$，有
$$
P\left( \bigcup_{i=1}^\infty A_{i}\right)=\sum_{i=1}^{\infty}P(A_{i})
$$
概率空间（Probability Space）：$(\Omega, A, P)$

由公理可以推出概率的一些性质：
- $P(\varnothing)=0$。
- 有限可加性（Finite Additivity）：
$$P\left( \bigcup_{i=1}^n A_{i}\right)=\sum_{i=1}^{n}P(A_{i})$$
- $P(\overline{A})=1-P(A)$。
- $0\leq P(A)\leq 1$
- 单调性（Monotonicity）：若 $A\subset B$，则 $P(A)\leq P(B)$ 且 $P(B-A)=P(B)-P(A)$。
- 加法定律（The addition law）：$P(A\cup B)=P(A)+P(B)-P(AB)$。
- 容斥原理（The inclusion-exclusion principle）：（$A_{1},A_{2},\dots,A_{n}$ 不必互斥）：
$$
P\left(\bigcup_{i=1}^{n} A_i\right)
=
\sum_{i=1}^{n}P(A_i)
-\sum_{1\le i<j\le n}P(A_i\cap A_j)
+\sum_{1\le i<j<k\le n}P(A_i\cap A_j\cap A_k)
-\cdots
+(-1)^{n+1}P(A_1\cap\cdots\cap A_n)
$$
结合加法定律，利用数学归纳法即可证明容斥原理。
## 计算概率

### 古典概型 （Classical Model of Probability）

一个随机试验满足：
- 样本空间 $\Omega$ 中只有有限个样本点： $\Omega=\{ w=\omega_{1},\omega_{2},\dots,\omega _{n} \}$。
- 每个样本点是等可能的：$P(\{ \omega_{1} \})=\dots=P(\{ \omega_{n} \})=\frac{1}{n}$
那么计算概率只需要数样本点：
$$
P(A)= \frac{k}{n}
$$
其中 $k$ 是事件 $A$ 包含的样本点个数。

>  Simpson's Paradox：即使第一行的两个盒子中，红球比例都比第二行的两个盒子高，合起来时反而是下面的盒子红球比例更高。
>  ![[Probability Basic - 概率基础.png|415]]

计算概率
- 加法原理（Addition principle）：分类
- 乘法原理（Multiplication principle）：分步
- 排列数（Permutation）：无重复随机抽取，有序 $A_{n}^k= \frac{n!}{(n-k)!}$ 
- 组合数（Combination）：无重复随机抽取，无序 $C_{n}^k=\binom{n}{k}= \frac{n!}{k!(n-k)!}$

例：$n$ 个人， $n$ 个纸条，纸条中有 $m(<n)$ 个中奖，每个人按顺序抽签得到纸条。则每个人中奖概率如何计算？
-  样本空间：等价于一个 $n$ 位的二进制数，其中有 $m$ 位为 $1$。故样本点个数为 $\binom{n}{m}$。
-  中奖这个事件的样本点个数为 $\binom{n-1}{m-1}$，相当于固定你的顺序那一位为 $1$ 的排列方法数。
- 那么中奖概率为 $\frac{\binom{n-1}{m-1}}{\binom{n}{m}}= \frac{m}{n}$。
例：$n(<365)$ 个人的生日存在重复的概率为？
- 样本空间：把所有人的生日排成一列，共有 $365^n$ 种。
- “$n$ 个人的生日不存在重复“的样本点个数：$A_{365}^n$ 种。
- 故原事件的概率为 $1- A_{365}^n/365^n$。
例：错位排列的概率。
- 考虑补事件 $A$：至少有一个人到了它应该在的位置。
- 设 $A_{i}$ 为：编号为 $i$ 的人到了它应该在的位置。
- 那么容斥原理： $P(A)=P(A_{1}\cup A_{2}\cup\dots\cup A_{n})=\sum P(A_{i})-\sum P(A_{i}A_{j})+\sum P(A_{i}A_{j}A_{k})\dots$ 
- 其中 $P(A_{i})= \frac{(n-1)!}{n!}, P(A_{i}A_{j})= \frac{(n-2)!}{n!}$，以此类推。
- 最终可以算出 $P(A)=1-\frac{1}{2!}+\frac{1}{3!}+\dots+(-1)^{n-1} \frac{1}{n!}$。
- 当 $n\to \infty$，$P(A)\to 1-\frac{1}{e}$。
- 错位排列的概率 $P(\overline{A})\to \frac{1}{e}$。
### 几何概型（Geometric Model of Probability）

几何概型适用于：随机事件可表示成在一个有界区域 $\Omega$ 上投点，每一个点是等可能的。
$$
P(A)= \frac{\text{The length / area / volume of }A}{\text{Total length / area / volume of }\Omega}
$$
贝特朗悖论：考虑一个半径为 $1$ 的圆，一个随机的弦的长度大于内接等边三角形的边长的概率为？
- 用不同的视角，会存在不同的答案，都是自洽的。
- 例如，在一条半径上考虑弦中点的位置；考虑固定一点，另一点的位置；在整个圆中考虑弦中点的位置。
- 关键在于如何定义“随机”，也就是如何定义样本空间。

## 条件概率（Conditional Probability）

在事件 $B$ 发生的情况下，事件 $A$ 的条件概率为：
$$
P(A|B)= \frac{P(AB)}{P(B)}
$$
也就是说，样本空间从 $\Omega$ 变成了 $B$。
- 乘法定律：$P(AB)=P(A|B)P(B)$
- 全概率公式：$P(A)=P(A \overline{B})+P(AB)=P(A|\overline{B})P(\overline{B})+P(A|B)P(B)$
