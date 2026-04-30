
## 概念与定义

**数列（Sequence）** 收敛（Converge）到 $L$ 记作：
$$
\lim_{ n \to \infty } a_{n}=L
$$
也称 $L$ 为数列 $a_{n}$ 的极限。严谨定义为：
 $$
\forall \varepsilon >0, \exists N(\varepsilon)>0,s.t. |a_{n}-L|<\varepsilon,\forall n>N(\varepsilon)
$$

数列**有界（Bound）** 的定义为数列同时有上界（Upper Bound）和下界（Lower Bound）。
- 上界的定义： $a_{n}\leq M, \forall n \in \mathbb{N}^+$，则 $M$ 为上界。最小的 $M$ 称为最小上界（Least Lower Bound）。


数列**单调（Monotonic）** 的定义为数列不降（Nondecreasing）或不升（Nonincreasing）。

为了使用求函数极限的方法求数列极限，有如下定理：若 $a_{n}=f(n),\forall n\in \mathbb{N}^+$ 且 $\lim_{ x \to \infty }f(x)=L$，那么有 $\lim_{ n \to \infty }a_{n}=\lim_{ x \to \infty }f(x)=L$ 。

常见数列极限：
- $\lim_{ n \to \infty } \frac {{\ln n}} {n}=0$。
- $\lim_{ n \to \infty} n^{1/n}=1$。
- $\lim_{ n \to \infty }x^{1/n}=1$。
- $\lim_{ n \to \infty }x^{n}=0(|x|<1)$。
- $\lim_{ n \to \infty }\left( 1+\frac{x}{n} \right)^n=e^x$。
- $\lim_{ n \to \infty } \frac{x^n}{n!}=0$。

**无穷级数（Infinite Series）** 的定义为：给定数列 $\{a_{n}\}$，那么 $a_{1}+a_{2}+ \dots +a_{n}+ \dots =\sum^{\infty}_{n=1}a_{n}$ 称为无穷级数。

**部分和（Partial sum）** 的定义为：给定数列 $\{a_{n}\}$，那么定义 $s_{n}=\sum^{n}_{k=1}a_{k}$ 为部分和数列（Sequence of partial sums）$\{s_{n}\}$。

**级数收敛**的定义：若部分和收敛（$s_{n}\to L$），则称级数 $\sum^{\infty}_{n=1}a_{n}$ 收敛。

余项（Remainder）：
$$
R_{n}:=S-s_{n}
$$
其中 $S=\sum a_{n}, a_{k}=f(k)>0$ 且 $f$ 连续且递减。

**级数绝对收敛（Absolutely convergent）：** $\sum |a_{n}|\text{收敛}$。**这是强于 $\sum a_{n}$ 收敛的。**

**级数条件收敛（Conditionally convergent）：** 级数收敛但不绝对收敛。

**幂级数（Power Series）**：$\sum^{\infty}_{n=0}c_{n}(x-a)^n$ 为以 $x=a$ 为中心的幂级数。

## 定理

### 数列极限

数列极限的性质与函数极限类似：四则运算与求极限可以交换位置。

同样也适用**夹逼定理（The Sandwich Theorem）**：若 $\lim_{ n \to \infty }a_{n}=\lim_{ n \to \infty }c_{n}=L, c_{n}\leq b_{n}\leq a_{n}$，则有 $\lim_{ n \to \infty }b_{n}=L$。

**数列连续函数定理（The Continuous Function Theorem for Sequences）**：若 $\lim_{ n \to \infty }a_{n}=L$ 且 $f(x)$ 在 $L$ 处连续，那么有 $\lim_{ n \to \infty }f(a_{n})=f(L)$。也就是说，复合一个连续函数和求极限可以交换位置。
- 推论：若数列 $\{a_{n}\}$ 存在极限 $L$ 且有递推式 $a_{n+1}=f(a_{n})$，则 $\lim_{ n \to \infty }a_{n+1}=\lim_{ n \to \infty }f(a_{n})\implies L=f(L)$，也就是用不动点法求数列极限。

### 判断敛散性

常见结果：
- 单调有界定理（The Monotonic Sequence Theorem）：单调且有界的数列一定收敛。
- 对公比为 $r$ 的等比级数（Geometric Series） $a+ar+ar^{2}+\dots+ar^{n-1}+\dots$：
  - 若 $|r|<1$ ，则级数收敛到 $\frac{a}{1-r}$。
  - 否则，级数发散。
- 若级数 $\sum^{\infty}_{n=1} a_{n}$ 收敛，则 $a_{n}\to 0$。反过来不一定成立（反例：$a_{n}=\frac{1}{n}$）。
- 发散判别法（The Test for Divergence）：若 $\lim_{ n \to \infty }a_{n}$ 不存在或不为 $0$，则级数 $\sum^{\infty}_{n=1} a_{n}$ 发散。

线性性质：
- 若级数 $\sum a_{n}$ 和 $\sum b_{n}$ 都收敛，则它们的线性运算可以和求和符号交换位置：
$$
\sum(a_{n}+kb_{n})=\sum a_{n}+k\sum b_{n}
$$
- 若级数 $\sum a_{n}$ 发散，则 $\sum ka_{n}$ 也发散。
- 若级数 $\sum a_{n}$ 发散，级数 $\sum b_{n}$ 收敛，则级数 $\sum (a_{n}+b_{n})$ 发散。

单调有界定理的推论（Corollary）：若 $a_{n}\geq 0$，则级数 $\sum a_{n}$ 收敛当且仅当 $s_{n}$ 有上界。

**积分判别法（The Integral Test）：** 若 $a_{n}=f(n)>0$，且 $f$ 在 $x\geq N$ 时连续且递减，则有：
$$
\sum a_{n} \text{ 收敛} \Longleftrightarrow \int _{N}^{\infty}f(x)dx \text{ 收敛}
$$
推论： $p-\text{series}$ $\sum_{n=1}^{\infty} \frac{1}{n^{p}}$ 当 $p>1$ 时收敛，当 $p\leq 1$ 时发散。这个和反常积分判断敛散性是一样的。
推论：$\sum\frac{1}{n\ln n}$ 是发散的。

在积分判别法中，余项的上下界：
$$
\int^{\infty}_{n+1} f(x)dx\leq R_{n}\leq \int^{\infty}_{n} f(x)dx
$$

**比较判别法（The Comparison Test）**：若级数 $\sum a_{n}, \sum b_{n}, \sum c_{n}$ 都的各项都非负，且有：
$$
\exists N, s.t. a_{n}\leq b_{n}\leq c_{n} \forall n>N
$$
则：
- 若 $\sum a_{n}$ 发散，则 $\sum b_{n}$ 发散。
- 若 $\sum c_{n}$ 收敛，则 $\sum b_{n}$ 收敛。

**极限比较判别法（Limit Comparison test）**：若 $a_{n}>0$ 且 $b_{n}>0$ 对所有 $n\geq N$：
- 若 $\lim_{ n \to \infty } \frac{a_{n}}{b_{n}}=c>0$，则 $\sum a_{n}$ 和 $\sum b_{n}$ 同敛散。
- 若 $\lim_{ n \to \infty } \frac{a_{n}}{b_{n}}=0$，则 $\sum b_{n} \text{收敛}\implies \sum a_{n}\text{收敛}$。
- 若 $\lim_{ n \to \infty } \frac{a_{n}}{b_{n}}=\infty$，则 $\sum b_{n}\text{发散}\implies \sum a_{n}\text{发散}$ 。

**绝对收敛判别法（The Absolute Convergent Test）：** 若 $\sum|a_{n}|$ 收敛，则 $\sum a_{n}$ 收敛。

**比值判别法（The Ratio Test）：** 若对 $\sum a_{n}$，有 $\lim_{ n \to \infty } \left|\frac{a_{n+1}}{a_{n}}\right|=\rho$：
- 若 $\rho >1$，则 $\sum a_{n}$ 发散。
- 若 $\rho <1$，则 $\sum a_{n}$ 绝对收敛。
（$\rho=1$ 情形不定）

**根值判别法（The Root Test）：** 若对 $\sum a_{n}$，有 $\lim_{ n \to \infty }\sqrt[n]{ |a_{n}| }=\rho$：
- 若 $\rho >1$，则 $\sum a_{n}$ 发散。
- 若 $\rho<1$，则 $\sum a_{n}$ 绝对收敛。
（$\rho=1$ 情形不定）

**交错级数判别法（The Alternating Series Test）：**  $\sum (-1)^{n+1}u_{n}$ 收敛当：
- $u_{n}>0$。
- $u_{n}\geq u_{n+1}$。
- $\lim_{ n \to \infty }u_{n}=0$

**交错级数估计定理（The Alternating Series Estimation Theorem）：** 若 $\sum a_{n}=\sum (-1)^{n+1}u_{n}=L$，则：
-  $|s_{n}-L| < u_{n+1}$。
- $\text{sgn}(L-s_{n})=\text{sgn}(a_{n+1})=(-1)^{n}$。

**绝对收敛数列重排定理（The Rearrangement Theorem for Absolutely Convergent Series）：** 若 $\sum a_{n}$ 绝对收敛，且 $b_{n}$ 是 $a_{n}$ 的任意重排，则 $\sum a_{n}=\sum b_{n}$。
>  若 $\sum a_{n}$ 条件收敛，则它重排之后极限与原来不一定相同。


### 幂级数

**幂级数收敛定理（The Convergence Theorem for Power Series）：** 对级数 $\sum c_{n}x^n$：
- 若它在 $x=c$ 处收敛，则它在 $|x|<|c|$ 绝对收敛。
- 若它在 $x=d$ 处发散，则它在 $|x|>|d|$ 发散。
>  推论：对幂级数 $\sum c_{n}x^n$，它必属于以下三种：
>  - $\exists R>0, s.t. \sum a_{n}$ 在 $|x-a|<R$ 绝对收敛，在 $|x-a|> R$ 发散。
>  - $R=0$。
>  - $R=\infty$。
>  其中 $R$ 称为幂级数的收敛半径（Radius of Convergence），收敛的区间称为收敛区间（Interval of Convergence）。


**幂级数乘法定理（The Series Multiplication Theorem for Power Series）:** 若 $\sum a_{n}x^{n}$ 和 $\sum b_{n}x^n$ 都对 $|x|<R$ 绝对收敛，则
$$
\left( \sum a_{n}x^{n} \right)\left( \sum b_{n}x^{n} \right)=\sum c_{n}x^{n}
$$
其中
$$
c_{n}=\sum^{n}_{k=0}a_{k}b_{n-k}
$$

**定理：** 若 $\sum a_{n}x^{n}$ 对 $|x|<R$ 绝对收敛，则 $\sum a_{n} (f(x))^n$ 对 $|f(x)|<R$ 绝对收敛。

**逐项微分定理（The Term-by-term Differentiation Theorem）：** 若 $f(x)=\sum c_{n}(x-a)^n$ 对 $|x-a|<R$ 收敛，则有
$$
f'(x)=\sum n c_{n}(x-a)^{n-1}
$$

**逐项积分定理（The Term-by-term Differentiation Theorem）：** 若 $f(x)=\sum c_{n}(x-a)^n$ 对 $|x-a|<R$ 收敛，则有
$$
\int f(x)\,dx= \sum c_{n} \frac{(x-a)^{n+1}}{n+1}+C
$$
#### 求幂级数

[[Limit and Derivative - 极限与导数]]

利用核心公式：
$$
\frac{1}{1-x}=\sum_{n=0}^{\infty} x^n
$$
$$
-\ln(1-x)=\sum_{n=1}^{\infty} \frac{x^n}{n}
$$
这两个式子是求导的关系。

例：
- 求 $\sum \frac{1}{(n+1)2^n}$。
   - 令 $f(x)= \sum \frac{1}{n+1} x^n$。故 $xf(x)=\sum \frac{x^{n+1}}{n+1}$，于是 $(xf(x))'=\sum x^n=\frac{1}{1-x}-1$，积分回去就有 $xf(x)=-\ln(1-x)-x$。代入 $x=\frac{1}{2}$ 得 $\sum \frac{1}{(n+1)2^n}=f\left( \frac{1}{2}\right)=2\ln(2)-1$。
   - 也可以直接配凑出 $-\ln(1-x)$ 的展开。

-  求 $\sum \frac{n}{2^n}$ 。
  - 令 $f(x)=\sum nx^n$。故 $\frac{f(x)}{x}= \sum nx^{n-1}$，于是 $\int \frac{f(x)}{x}dx=\sum x^n= \frac{1}{1-x}-1$。于是有 $\frac{f(x)}{x}=\frac{1}{(1-x)^{2}}$ 。代入  $x=\frac{1}{2}$ 得 $\sum \frac{n}{2^n}=2$。