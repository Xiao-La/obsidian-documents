
算法：解决问题或用于计算的，有限序列的精确指令。

>  Algorithm出自“Algoritmi”，这是花拉子米（al-Khwārizmī）的拉丁文译名。

我们关心随着 input size（记作 $n$）变大，运行时间的渐进表现（Asymptotic behavior）。使用大 $O$ 记号表示上界：$f(n)=O(g(n))$ 若
$$
\exists c>0,n_0,\ \forall n>n_0 , \lvert f(n) \rvert\leq c \lvert g(n) \rvert  
$$
结论：$f(x)=\sum_{i=0}^{n} a_{i}x^{i}=O(x^{n})$。（多项式的主项决定增长速度）
![[Algorithm - 算法.png|332]]
- $n^{n}$ 并不是 $O(n!)$ 的。
- 但是，$n\log n=O(\log n!)$。
- 这是因为，$n^{n}\leq(n!)^{2}$。

定理：若 $f_{1}(x)=O(g_{1}(x)),f_{2}(x)=O(g_{2}(x))$，则
-  $(f_{1}+f_{2})(x)=O(\max(\lvert g_{1}(x)\rvert ,\lvert g_{2}(x)\rvert ))$
- $(f_{1}f_{2})(x)=O(g_{1}(x)g_{2}(x))$

类似于大 $O$ 记号，还有表示下界的 $\Omega$ 记号，还有表示渐进同阶的 $\Theta$ 记号。

计算问题（Computational Problem）：定义了输入和输出。
实例（Instance）：一个问题的实例是一组问题所需的所有输入。
正确的算法（Correct Algorithm）： 对所有的输入实例都能给出正确的解答。

时间复杂度（Time complexity）：基础的机器运算（Machine Operations） 的数量。
空间复杂度（Space complexity）：需要的内存量（Amount of memory）。
复杂度实际上是 input size 的函数。
**定义 input size：** 能够编码输入数据所需要的最少的比特数。
- 例如，输入数据是一个整数 $n$，则 input size 就是 $\log_{2}n$。也就是说，朴素的判断合数的算法（试除法）的复杂度实际上是 $O(2^{\text{size}(n)})$。
- 例如，输入数据是一个数组 $a_{1},a_{2},\dots,a_{n}$，则 input size 约为 $n\cdot\log_{2}a$，其中 $a=\max a_i$。元素位宽固定时，表示复杂度只需考虑元素个数 $n$。
- 例如要计算 $a\times b$，可以定义 $t=\log_{2}\max(a,b)$。

**定义** 正函数 $f(n)$ 和 $g(n)$ 是同类的（of the **same type**），若
$$
c_{1}g(n^{a_{1}})^{b_{1}}\leq f(n)\leq c_{2}g(n^{a_{2}})^{b_{2}}
$$
对所有足够大的 $n$。其中 $a_{1},a_{2},b_{1},b_{2},c_{1},c_{2}$ 为正常数。


## P, NP, NPC

对于 **判定性问题（Decision Problems）**，我们对于一个输入数据，最终输出 yes / no 两种结果。若问题为 $L$，输入为 $x$，我们可以记 $x\in L$ 表示结果为 yes，记 $x\notin L$ 表示结果为 no。
- 另外还有 **优化问题（Optimization problem）**，要找到一种最优的答案。一般来说，优化问题会有其对应的判定性问题。   

例如：背包问题及其判定性版本（Knapsack vs. DKnapsack）。 
- 这里的优化问题：找到最大的 $\sum _{i \in T}v_{i}$ 使得 $\sum _{i \in T}w_{i}\leq{}W$。
- 这里的判定性问题：给定 $k$ ，是否存在一个背包中元素的子集 $T$，使得总重量不超过容量 $W$，且总价值至少是 $k$？
- 我们只要解决了优化问题，就可以解决这里的判定性问题（比较 $k$ 与优化的答案即可）。

一般来说，对于互相对应的问题，难度： **Decision Problem $\leq{}$ Optimization Problem**。也就是说，只要能解决优化问题，对应的判定性问题就显然可以解决。**如果我们知道判定性问题是难的，那我们就会知道对应的优化问题也难。** 因此，对判定性问题分类很有意义。

**定义** 一个算法是 **polynomial-time**，若其运行时间是 $O(n^{k})$ 的。这里 $k$ 是与 $n$ 无关的常数，而 $n$ 是问题的 **input size**。
**定义** 一个算法是 **nonpolynomial-time**，若其运行时间不是 $O(n^{k})$ 的，对任意 $k\geq{}0$。

### Class P

**Class P** 包含了所有能在 polynomial time 解决的判定性问题。（也就是说，存在一个 polynomial-time 的算法能判定问题的 yes / no）

证明一个判定性问题在 Class P 里面，只需要找到一个 问题的 polynomial-time 算法。而证明不在这个 Class P 里面，就难得多。

### Class NP

**定义** **证书（Certificate）**：一个对应 yes-input 的特定对象，可以用来证明这个 input 确实是 yes-input。

**Class NP** 包含了所有这样的判定性问题：对于每个 yes-input，都存在一个证书，使得我们可以在 polynomial time 里验证这个输入确实是一个 yes-input。

NP 是 nondeterministic polynomial-time。（另一种定义：能在 nondeterministic Turing machine 上多项式时间解决）。

我们有：
$$
\text{P}\subseteq \text{NP}
$$
而 P 与 NP 是否相等还是悬而未决的。

例：判定合数。这个问题属于 NP。
- 这里的 yes-input 就是合数。
- 证书：一个整数 $a(1<a<n)$，使得 $a\mid n$。
- 给定一个 yes-input，我们用这个证书（整数 $a$）可以在 $O((\log _{2}n)^{2})$ 内检查它确实是 yes-input。因此它是属于 NP 的。
DKnapsack 也属于 NP。验证一个子集，只需要求和即可。

### 归约（Reduction）

 归约（reduction）是问题之间的关系。问题 Q 可以被归约为问题 Q'，若任意问题 Q 的实例都可以被重写为 Q' 的实例。

**例如，** Q：乘两个正数，Q'：加两个数，那么 Q 可以被归约为 Q'，通过一个对数变换：
$$
xy=\exp(\log x+\log y)
$$

**多项式时间归约（Polynomial-Time Reduction）**： 设有问题 $L_{1},L_{2}$，那么 $L_{1}$ 到 $L_{2}$ 的一个多项式时间归约，是一个可在多项式时间内计算的变换 $f$，使得 $f$ 把 $L_{1}$ 的任一 yes-input 映射到 $L_{2}$ 的一个 yes-input，把 $L_{1}$ 的任一 no-input 映射到 $L_{2}$ 的一个 no-input，
![[Algorithm - 算法-1.png|497]]
记作：
$$
L_{1}\leq_{{P}}L_{2}
$$
直观来说这代表 $L_{1}$ 不难于 $L_{2}$。这是因为，有了 $L_{2}$ 的算法，就能得到 $L_{1}$ 的算法：
![[Algorithm - 算法-2.png|585]]
如果 $A_{2}$ 是多项式时间的，那么 $A_{1}$ 也是多项式时间的。这就推出了下面的定理：

**如果 $L_{1}\leq _{P}L_{2}$，且 $L_{2}\in \mathrm{P}$，那么 $L_{1}\in \mathrm{P}$**。

归约有传递性：若$L_{1}\leq _{P} L_{2}$ 且 $L_{2}\leq_P L_{3}$，那么 $L_{1} \leq_P L_{3}$。（把两个归约的函数复合一下）

### Class NP-Complete(NPC)

**Class NPC** 包含了所有符合下列条件的问题 $L$：
- $L\in \mathrm{NP}$
- $\forall L' \in \mathrm{NP}, L'\leq _{P}L$
直观来说这代表 NPC 中包含了 NP 中最难的问题。

定理：对某个 $L\in\text{NPC}$：
- 若 $L \in \mathrm{P}$，则 $\mathrm{NP}=\mathrm{P}$。
- 若 $L \notin \mathrm{P}$，则 $\mathrm{NP}\neq{}\mathrm{P}$。且所有 NPC 里的问题也都不属于 P。
那么，要么所有 NPC 问题都在多项式时间内可解，要么所有 NPC 问题都在多项式时间内不可解。

假如 $\mathrm{P}\neq{}\mathrm{NP}$，那么可以画这样一个集合关系图：
![[Algorithm - 算法-3.png|418]]