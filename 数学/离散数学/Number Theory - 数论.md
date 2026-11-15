
以下讨论整数；标准除法的除数、同余的模数取正整数。

**整除（Divisibility）。** 若 $a\neq 0$ 且 $b=ak$，则称 $a$ 整除 $b$，记作 $a\mid b$。

$1$ 到 $n$ 中能被 $d$ 整除的数一共有 $\lfloor n / d \rfloor$ 个。（$0<kd\leq{}n$）。

性质：
- $a\mid b,a\mid c\to{}a\mid (b+c)$
- $a\mid b\to a\mid bc$
- $a\mid b,b\mid c\to{}a\mid c$
结合这些性质，推出：
$$
a\mid b,a\mid c\to{}a\mid mb+nc
$$
（整除两个数，那么也整除它们的线性组合）

标准除法：对 $a,d$，存在唯一的 $q,r$ 其中 $0\leq{}r<d$，使得 $a=dq+r$。$d$ 是除数（divisor），$q$ 是商（quotient），$a$ 是被除数（dividend），$r$ 是余数（remainder）。
- 记 $q=a \,\mathrm{ div}\,d$，$r=a\bmod d$

同余（Congruent）：若 $m \mid a-b$，那么 $a$ 与 $b$ 模（modulo） $m$ 同余，记作
$$
a\equiv{}b\pmod{m}
$$
这里 $m$ 叫做模数（modulus）。
由定义：
$$
a\equiv{}b\pmod{m}\Leftrightarrow{} \exists k,a=b+km
$$
也可证：
$$
a\equiv{}b\pmod{m}\Leftrightarrow{} a\bmod m=b\bmod m
$$
若 $a\equiv{}b \pmod{m}$ 和 $c\equiv{}d \pmod{m}$，那么有
$$
a+c\equiv{}b+d \pmod{m}
$$
$$
ac\equiv{}bd\pmod{m}
$$

推论：若 $m$ 是一个正整数，则
$$
(a+b)\bmod m=((a\bmod m)+(b\bmod m))\bmod m
$$
$$
ab\bmod m = ((a\bmod m)(b\bmod m))\bmod m
$$
## 群（Group）

**群（Group）**：一个集合 $G$，有 **一个** 二元运算 $*$，符合以下四个条件：
- **封闭性（Closure）：** $a,b\in G\to a*b=c \in G$
- **结合律（Associativity）：** $(a*b)*c=a*(b*c)$
- **单位元（Identity Element）：** 存在唯一的元素 $1_{e}$，使得对任意 $a\in G$，有 $a*1_{e}=a$
- **逆元（Inverse）：** 对任意 $a\in G$，都存在一个元素 $a^{-1}$，使得 $a*a^{-1}=1_{e}$
记作 $(G,*)$。

例如，这些都是群：
- $(\mathbb{Z},+),(\mathbb{Q},+), (\mathbb{R},+),(\mathbb{M}_{n\times n},+),(\mathbb{Q}^{*},\times),(\mathbb{R}^{*},\times)$
- General Linear Group：所有可逆 $n$ 阶矩阵的集合，在矩阵乘法上是群。

**阿贝尔群（Abelian Group）：** 若 $*$ 运算满足可交换性。

### 置换群（Permutation Group）

令 $s_{n}= \langle 1,2, \dots,n \rangle$，记 $P_{n}$ 为 $s_{n}$ 的所有排列组成的集合。
对 $\pi,\rho \in P_{n}$，定义一种运算 $\pi \circ \rho$，就是用 $\pi$ 来重排 $\rho$。
那么，$(P_{n},\circ)$ 是一个群，我们称为置换群（Permutation Group）。
置换群不是阿贝尔群。

置换群与置换矩阵**一一对应**。所以这里的运算 $\circ$ 可以看成对应的置换矩阵的 **矩阵乘法**。

## 环（Ring）

若 $(R,+)$ 是一个阿贝尔群，那么我们再定义一个运算 $\times$，使得：
- **封闭性（Closure）：** $R$ 对 $\times$ 封闭。
- **结合律（Associativity）：** $(a\times b)\times c=a\times(b\times c)$
- **分配律（Distributivity）：** $a\times(b+c)=a\times b+a\times c$，且 $(a+b)\times c=a\times c+b\times c$
那么我们说 $(R,+,\times)$ 是一个环（Ring）。

**交换环（Commutative Ring）：** 若 $\times$ 运算满足可交换性。

**整环（Integral Domain）：** 若一个**交换环**符合两个性质：
- **乘法单位元（Identity Element）：** $a\times1=1\times a=a$
- **非零积（Nonzero Product）：** 若 $a\times b=0$，那么 $a$ 或 $b$ 必有一个是 $0$。

例如 $(\mathbb{Z},+,\times)$ 就是整环。$(\mathbb{Z}_{m},+,\times)$ 是交换环；$m$ 为素数时是整环，为合数时不是整环。

## 域（Field）

若一个**整环**的乘法还满足任意非零元素**存在逆元**，那么说它是一个 **域（Field）**。

$(\mathbb{Q},+,\times),(\mathbb{R},+,\times)$ 是域，而且叫 **无限域（Infinite field）**。
$(\mathbb{Z}_{p},+_{p},\times _{p})$ 叫做素数域（Prime field）。
**有限域（Finite Field）** 的元素个数是素数幂 $p^{m}$，通常记作 $\mathbb{F}_{p^{m}}$。

## 整数的表示

常用这些进制：Decimal (base 10), Binary (base 2), Octal (base 8), Hexadecimal (base 16)。
令 $b>1$ 是一个整数。那么 $n$ 的 base-$b$ 展开就是
$$
n=\sum _{i=0}^{k} a_{i}b^{i}
$$
这里整数 $0\leq a_{i}<b$，那么可以写成
$$
n=(a_{k}a_{k-1}\dots a_{0})_{b}
$$
- 从其他进制转 $10$ 进制，只需根据定义计算即可。
- 在 $2,8,16$ 进制内互转，只需要 grouping：
![[Number Theory - 数论-1.png]]
由于：
$$
\begin{aligned}
n&=a_{k}b^{k}+a_{k-1}b^{k-1}+\dots+a_{2}b^{2}+a_{1}b+a_{0} \\
&=b(a_{k}b^{k-1}+a_{k-1}b^{k-2}+\dots+a_{2}b+a_{1})+a_{0} \\
&=b(b(a_{k}b^{k-2}+a_{k-1}b^{k-3}+\dots+a_{2})+a_{1})+a_{0} \\
&=\dots
\end{aligned}
$$
那么要从 $n$ 构造它的 base-$b$ 展开，就相当于不停去除以 $b$，取余数，就得到了 $b$ 进制下的低位到高位。

二进制的加法，乘法运算：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Add}{$a, b$: positive integers}
    \State \Comment{the binary expansions of $a$ and $b$ are $(a_{n-1}, a_{n-2}, \ldots, a_0)_2$ and $(b_{n-1}, b_{n-2}, \ldots, b_0)_2$, respectively}
    \State $c = 0$
    \For{$j = 0$ \To $n - 1$}
      \State $d = \lfloor (a_j + b_j + c)/2 \rfloor$
      \State $s_j = a_j + b_j + c - 2d$
      \State $c = d$
    \EndFor
    \State $s_n = c$
    \Return $(s_0, s_1, \ldots, s_n)$ \Comment{the binary expansion of the sum is $(s_n, s_{n-1}, \ldots, s_0)_2$}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
$O(n)$ bit additions

```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Multiply}{$a, b$: positive integers}
    \State \Comment{the binary expansions of $a$ and $b$ are $(a_{n-1}, a_{n-2}, \ldots, a_0)_2$ and $(b_{n-1}, b_{n-2}, \ldots, b_0)_2$, respectively}
    \For{$j = 0$ \To $n - 1$}
      \If{$b_j == 1$}
        \State $c_j = a$ shifted $j$ places
      \Else
        \State $c_j = 0$
      \EndIf
    \EndFor
    \State \Comment{$c_0, c_1, \ldots, c_{n-1}$ are the partial products}
    \State $p = 0$
    \For{$j = 0$ \To $n - 1$}
      \State $p = p + c_j$
    \EndFor
    \Return $p$ \Comment{$p$ is the value of $ab$}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
$O(n^{2})$ shifts and $O(n^{2})$ bit additions

这是因为：
$$
ab=b_{0}(a\cdot2^{0})+b_{1}(a\cdot2^{1})+\dots+b_{n-1}(a\cdot2^{n-1})
$$
那么只需要把 $b_{j}=1$ 的那些 $a$ 的移位加起来。

一个朴素的除法：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Division-Algorithm}{$a$: integer, $d$: positive integer}
    \State $q = 0$
    \State $r = \vert a \vert$
    \While{$r \ge d$}
      \State $r = r - d$
      \State $q = q + 1$
    \EndWhile
    \If{$a < 0$ and $r > 0$}
      \State $r = d - r$
      \State $q = -(q + 1)$
    \EndIf
    \Return $(q, r)$ \Comment{$q = a$ \textbf{div} $d$ is the quotient, $r = a$ \textbf{mod} $d$ is the remainder}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
$O(q \log a)$ bit operations. But there exist more efficient algorithms with complexity $O(n^{2})$, where $n = \max(\log a, \log d)$

补充：若 $a<0$ 且恰好整除（$r=0$），上面的算法中还需令 $q=-q$。
可以通过分治来优化：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Division2}{$a, d \in \mathbb{N}, d \ge 1$}
    \If{$a < d$}
      \Return $(0, a)$
    \EndIf
    \State $(q, r) =$ \Call{Division2}{$\lfloor a/2 \rfloor, d$}
    \State $q = 2q$
    \State $r = 2r$
    \If{$a$ is odd}
      \State $r = r + 1$
    \EndIf
    \If{$r \ge d$}
      \State $r = r - d$
      \State $q = q + 1$
    \EndIf
    \Return $(q, r)$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

这相当于把 $a=dq+r$ 写成 $a / 2=d \cdot q / 2+r / 2$，然后去处理奇偶性细节。每次缩小一半，所以这个是 $O(\log q \log a)=O(n^{2})$ 的。

模指数算法：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Modular-Exponentiation}{$b$: integer, $n = (a_{k-1}a_{k-2} \ldots a_1 a_0)_2$, $m$: positive integers}
    \State $x = 1$
    \State $\mathit{power} = b \bmod m$
    \For{$i = 0$ \To $k - 1$}
      \If{$a_i == 1$}
        \State $x = (x \cdot \mathit{power}) \bmod m$
      \EndIf
      \State $\mathit{power} = (\mathit{power} \cdot \mathit{power}) \bmod m$
    \EndFor
    \Return $x$ \Comment{$x$ equals $b^{n} \bmod m$}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

复杂度是 $O((\log m) ^{2}\log n)=O(n^{3})$。
这是因为：
$$
b^{n}=b^{a_{k-1}2^{k-1}}\cdot b^{a_{k-2}2^{k-2}}\cdot\dots \cdot b^{a_{1} 2^{1}} b^{a_{0}}
$$
注意这里 $a_{i}\in \{ 0,1 \}$，然后 $b^{2^{k-1}}=(b^{2^{k-2}})^{2}$。那么我们不断把 $b$ 平方，然后在 $a_{i}=1$ 的时候就乘到答案里去。

## 素数与合数

唯一分解定理 / 算术基本定理：每个大于 $1$ 的整数都可以用唯一的方式写成：一个素数，或按不减的顺序排列的至少两个素数的乘积。

若 $n$ 是合数，则存在一个 $\leq \sqrt{n}$ 的素因子（prime divisor）。

$\gcd(a,b)$：最大公因数。
$\operatorname{lcm}(a,b)$：最小公倍数。
若把 $a,b$ 用算术基本定理分解了，那么
$$
\gcd(a,b)=p_{1}^{\min(a_{1},b_{1})}p_{2}^{\min(a_{2},b_{2})}\dots p_{n}^{\min(a_{n},b_{n})}
$$
$$
\operatorname{lcm}(a,b)=p_{1}^{\max(a_{1},b_{1})}p_{2}^{\max(a_{2},b_{2})}\dots p_{n}^{\max(a_{n},b_{n})}
$$
### 欧几里得算法（辗转相除法, Euclidean Algorithm）

```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Gcd}{$a, b$: positive integers}
    \State $x = a$
    \State $y = b$
    \While{$y \ne 0$}
      \State $r = x \bmod y$
      \State $x = y$
      \State $y = r$
    \EndWhile
    \Return $x$ \Comment{$\gcd(a, b)$ is $x$}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```


设 $a>b$，欧几里得算法中，while 循环执行的次数是 $O(\log b)$。若考虑除法操作的复杂度 $O(\log ^{2}a)$，总的复杂度可以写成 $O(\log ^{3}a)$。这是多项式时间的。
### 正确性

欧几里得算法的正确性依赖于这个引理：
$$
a=bq+r\to\gcd(a,b)=\gcd(b,r)
$$
证明：令 $D_{n}$ 表示 $n$ 的所有因子组成的集合，那么 $\gcd(a,b)=\max (D_{a}\cap D_{b})$ 。只需证明
$$
D_{a}\cap D_{b}=D_{b}\cap D_{r}
$$
这很容易说明：
- 若 $d$ 是 $a,b$ 的因数，那它也是 $r=a-bq$ 的因数，即 $\text{LHS}\subseteq\text{RHS}$。
- 若 $d$ 是 $b,r$ 的因数，那它也是 $a=bq+r$ 的因数，即 $\text{RHS}\subseteq\text{LHS}$。
- 那么 $\text{LHS}=\text{RHS}$。
### 时间复杂度证明

 while 循环的次数 $n=O(\log b)$ 的。一种证明方法：
- 每次除法：$r_{i+2}=r_{i}\bmod r_{i+1}$，这里 $r_{1}=b$。
- 我们声称 $r_{i+2}< \frac{1}{2}r_{i}$。分类证明：
- 若 $r_{i+1}\leq \frac{1}{2}r_{i}$，那么直接得到 $r_{i+2}<r_{i+1}\leq \frac{1}{2}r_{i}$。
- 若 $r_{i+1}> \frac{1}{2} r_{i}$，那么得到 $r_{i+2}=r_{i}\bmod r_{i+1}=r_{i}-r_{i+1}< \frac{1}{2}r_{i}$.
- 最后 $r_{n}\geq1$，于是：
$$
b=r_{1}>2r_{3}>2^{2}r_{5}> \dots> 2^{i}r_{2i+1} > \dots > 2^{(n-1)/2} r_{n}\geq 2^{(n-1) / 2}
$$
- 于是 $\frac{n-1}{2}\leq \log(b)$，有 $n=O(\log b)$。
另一种证明方法：注意到
$$
q_{1},q_{2}, \dots, q _{n-1}\geq1, \quad q _{n} \geq2
$$
那么
$$
\begin{aligned}
&r_{n}\geq 1 = f_{2} \\
\implies &r_{n-1}\geq 2r_{n} \geq 2f_{2}=f_{3} \\
\implies &r_{n-2}\geq r_{n-1}+r_{n}\geq f_{3} + f_{2} = f_{4} \\
&\dots \\
\implies & r_{2}\geq r_{3}+r_{4}\geq f_{n-1}+f_{n-2}=f_{n} \\
\implies & b=r_{1}\geq r_{2}+r_{3}\geq f_{n+1}=\Omega(c^{n}) 
\end{aligned}
$$
于是 $n=O(\log b)$。



### 裴蜀定理（Bezout's Theorem）

**裴蜀定理**：$a,b$ 的最大公因数可以写成 $a,b$ 的线性组合：
$$
d=\gcd(a,b)=sa+tb
$$

证明：考虑欧几里得算法的步骤：

$$
\begin{aligned}
r_0 &= r_1q_1+r_2 &\quad 0\le r_2<r_1,\\
r_1 &= r_2q_2+r_3 &\quad 0\le r_3<r_2,\\
&\ \ \vdots & \\
r_{n-2} &= r_{n-1}q_{n-1}+r_n &\quad 0\le r_n<r_{n-1},\\
r_{n-1} &= r_nq_n\,.
\end{aligned}
$$

那么从最后一步开始往前代入：
$$
\gcd(a,b)=r_{n}=r_{n-2}-r_{n-1}q_{n-1}=\dots=sa+tb
$$
这是一个构造性证明，我们找到了一组线性组合。然而，其实 $d=sa+tb$ 可以有不止一种线性组合，我们只要找 $s'a+t'b=0$ 的解，把它加到原来找到的 $sa+tb$ 上即可构造其他解。

可以用扩展欧几里得算法（Extended Euclidean algorithm）找到裴蜀恒等式。

**推论1：**
$$
a\mid bc \land \gcd(a,b)=1\to a\mid c
$$
用裴蜀定理证明：存在 $s,t$ 使得
$$
\gcd(a,b)=1=sa+tb
$$
那么
$$
c=sac+tbc
$$
由于 $a\mid bc$，那么 $a\mid (sac+tbc)=c$。

**推论 2：** 若素数 $p$ 满足 $p\mid a_{1}a_{2}a_{3}\dots a_{n}$，那么 存在 $i$ 使得 $p\mid a_{i}$.

用这个推论可以证明素数分解的唯一性。

**定理：** 若 $ac\equiv bc \pmod{m}$ 且 $\gcd(c,m)=1$，那么 $a\equiv b\pmod{m}$。

### 梅森素数（Mersenne Primes）

梅森素数：可以写成 $2^{p}-1$ 形式的素数，其中 $p$ 是素数。

目前最大的素数都是通过梅森素数的形式构造的。

### 素数相关的猜想

**哥德巴赫猜想（Goldbach's Conjecture，1+1）：** 每个大于 $2$ 的偶数都能写成两个素数的和。
- 陈景润（1973, 1+2）：充分大的偶数可以写成（1 个素数）+（1 个素数或 2 个素数的积）。用筛法（Sieve Method）做的最好的成果。

**孪生素数猜想（Twin-prime Conjecture）：** 有无穷多组孪生素数（在无穷远处也有孪生素数）。
- 张益唐：无穷远处素数之间的距离是有界的。

## 线性同余式

线性同余式（Linear Congruence）：
$$
ax\equiv b\pmod{m}
$$
其中 $x$ 是一个变量。一般我们考虑的是整数环 $\mathbb{Z}_{m}$ 中的解，这个解往上 $+km$ 也是解。

**定义模逆（Modular Inverse）：** 若
$$
\overline{a}a\equiv1\pmod{m}
$$
那么称 $\overline{a}$ 为 $a$ 模 $m$ 的一个逆。

**定理：** 若 $a,m$ 互素，那么 $a$ 模 $m$ 的逆存在。反过来也成立。
$$
\gcd(a,m)=1 \leftrightarrow \overline{a}\,\text{exists}
$$
进一步，若 $a,m$ 互素，那么这个存在的逆，模 $m$ 是**唯一的**。
**证明：**
- 由裴蜀定理：
$$\gcd(a,m)=1=sa+tm\implies sa=1-tm=1\pmod{m}\implies \overline{a}=s$$
- 唯一性：假设不唯一，也就是说存在 $a_{1}\not\equiv a_{2}\pmod{m}$ 使得 $a_{1}a\equiv a_{2}a\equiv 1\pmod{m}$。那么有 $m\mid(a_{1}-a_{2})a\implies m\mid a_{1}-a_{2}$。那么就有 $a_{1}\equiv a_{2}\pmod{m}$，矛盾。

当模逆存在时（$\gcd(a,m)=1$），求解线性同余式，只需要找到 $\overline{a}=s$，其中 $1=sa+tm$。

解的个数：

**Theorem**\* Let $d=\gcd(a,m)$ and $m'=m/d$. The congruence $ax\equiv b\pmod m$ has solutions if and only if $d\mid b$. If $d\mid b$, then there are exactly $d$ solutions. If $x_0$ is a solution, then the other solutions are given by $x_0+m',x_0+2m',\dots,x_0+(d-1)m'$.

**Proof.**

1) "only if": If $x_0$ is a solution, then $ax_0-b=km$. Thus, $ax_0-km=b$. Since $d$ divides $ax_0-km$, we must have $d\mid b$.
2) "if": Suppose that $d\mid b$. Let $b=kd$. There exist integers $s,t$ such that $d=as+mt$. Multiply both sides by $k$. Then $b=ask+mtk$. Let $x_0=sk$. Then $ax_0\equiv b\pmod m$.
3) "$\#=d$": $ax_0\equiv b\pmod m$ $ax_1\equiv b\pmod m$ imply that $m\mid a(x_1-x_0)$ and $m'\mid a'(x_1-x_0)$. This implies further that $x_1=x_0+km'$, where $k=0,1,\dots,d-1$.

### 中国剩余定理（The Chinese Remainder Theorem, CRT）

若 $m_{1},m_{2},\dots,m_{n}$ **两两互素**，那么线性同余方程组
$$
\begin{aligned}
x\equiv a_{1}\pmod{m_{1}} \\
x\equiv a_{2}\pmod{m_{2}} \\
\vdots \\
x\equiv a_{n}\pmod{m_{n}}
\end{aligned}
$$
有模 $m=m_{1}m_{2}\dots m_{n}$ 意义上的唯一解。
**证明。**
- 令 $M_{k}=m / m_{k}$，那么有 $\gcd(M_{k},m_{k})=1$。那么存在一个 $y_{k}$ 是 $M_{k}$ 模 $m_{k}$ 的逆，也就是
$$M_{k}y_{k}\equiv1\pmod{m_{k}}$$
- 构造
$$
x=\sum _{i=1}^{n}a_{i}M_{i}y_{i}
$$
- 那么 $x$ 满足线性方程组，因为：
$$
x\equiv a_{j}M_{j}y_{j}\equiv a_{j}\pmod{m_{j}}
$$
**唯一性。** 可以证明这个解是唯一的。


另一种求线性方程组的方式：Back Substitution / 回代。
- 例如，从 $x\equiv 2 \pmod{3}$ 得到 $x=3k+2$；从 $x\equiv3\pmod{5}$ ，代入得到 $3k+2\equiv3\pmod{5}$，进一步得到 $k\equiv2\pmod{5}$，则 $k=5l+2$，再代入得 $x=15l+8$。以此类推。

若模数不互素：拆。例如方程组 $x\equiv8\pmod{15}, x\equiv2\pmod{21}$，模数不互素，那么可以拆：
- 把 $x\equiv8 \pmod{15}$ 写成 $x=15k+8$，那么可以拆 $x\equiv2 \pmod{3}$，$x\equiv3\pmod{5}$ 两个方程。
- 另一个方程也类似，
## 费马小定理

**费马小定理（Fermat’s little theorem）**：若 $p\not\mid x$，有
$$
x^{p-1}\equiv1 \pmod{p}
$$
证明：只需证明：
$$
\{ 1,2, \dots, p-1 \}=\{ x,2x, \dots , (p-1)x\quad\pmod{p} \} 
$$
那么就有：
$$
1 \cdot2\cdot \dots \cdot (p-1)\equiv x \cdot 2x \cdot \dots \cdot (p-1)x \pmod{p}
$$
那么由于 $p$ 是素数， $2, 3, \dots, p-1$ 都与 $p$ 互素。于是可以除掉，就得到
$$
x^{p-1}\equiv1 \pmod{p}
$$
### 欧拉定理

欧拉函数（Euler's totient function）： $\phi(n)$ ，表示 $\mathbb{Z}_{n}$ 中与 $n$ 互素的数的个数：
$$
\phi(n):= \# \{ x\in \mathbb{Z}_{n}\mid \gcd(x,n)=1 \}
$$
- $\phi(p)=p-1$
- $\phi(pq)=(p-1)(q-1)$，其中 $p,q$ 为不同素数。（这是：$(pq-1) - (q-1)-(p-1)$）
- $\phi (p^{i})=p^{i}-p^{i-1}$

**欧拉定理（Euler's Theorem）：** 若 $\gcd(x,n)=1$，则
$$
x^{\phi(n)}\equiv1 \pmod{n}
$$

## 本原根 / 生成元（Primitive Root）

模素数 $p$ 的本原根是一个整数 $r\in \mathbb{Z}_{p}$ 使得所有 $\mathbb{Z}_{p}$ 中的非零元素都是 $r$ 的幂。
- 例如，$3$ 是 $\mathbb{Z}_{7}$ 的本原根。

## 总结


- Division, Primes

  $a=dq+r\qquad q=a\ \text{div}\ d\qquad r=a\ \text{mod}\ d$

- Congruence

  $a\equiv b\pmod m$ if $m$ divides $a-b$

- Greatest Common Divisor (GCD)

  (extended) Euclidean algorithm
  find the modular inverse
  solve linear congruence $ax\equiv b\pmod m$ ($\gcd(a,m)=1$)
  Chinese Remainder Theorem / back substitution

- Euler's Theorem / Fermat's Little Theorem

  $x^{\phi(n)}\equiv1\bmod n$ if $\gcd(x,n)=1$
  $x^{p-1}\equiv1\bmod p$ if $x\not\equiv0\bmod p$


## 应用

### 伪随机数生成器

**线性同余法（Linear Congruential Method）。** 四个参数：
- 模数 $m$
- 乘数 $a$
- 增量 $c$
- 种子 $x_{0}$
那么可以得到伪随机数序列 $x_{1},x_{2},\dots,x_{n},\dots$，这里 $0\leq x_{i}<m$：
$$
x_{n+1}=(ax_{n}+c)\pmod{m}
$$
这种方法很容易被攻击，不能用于安全性依赖于随机性的情景。

### 哈希函数

把任意长度的数据映射到固定长度。
例如简单地使用哈希函数 $h(x)=x\bmod n$，把 $x$ 存到位置 $h(x)$ 就是一种数据结构：哈希表。遇到哈希冲突，可以向后移一位存，或者在那个位置开一个链表。
**Bloom Filter：** 一种概率性的数据结构，查询在常数时间，且让“假阳性”的概率尽可能低。

## 数论在密码学中的应用

Cryptography（密码学）=kryptos（秘密）+graphos（写）
这个词来自 Edgar Allan Poe。

### 对称密码学

直到 1970s。
对称：加密和解密的钥匙是相同的。因此，要提前协商一个私钥（Private Key）$k$。
例如凯撒密码：
- 加密： $i\to(i+k)\bmod26$
- 解密：$j\to (j-k) \bmod26$
- 问题在于，密钥只有 $26$ 种。
- 更进一步，有更一般的置换密码（Substitution Cipher）：把原字母表对应到另一个顺序的字母表，这样就有 $26!$ 种密钥了。
- 但是，仍然可以通过统计字母（的组合）出现的频率来破解密钥。

Kerckhoffs's Principle：即使算法已知了，只要密钥未知，系统也应该安全。
### 非对称密码学

概念：1976 W.Diffie, M.Hellman, ***New directions in cryptography***: **"We stand today on the brink of a revolution in cryptography."**
实现：R.**R**ivest, A.**S**hamir, L.**A**dleman,  ***A method for obtaining digital signatures and public-key cryptosystems***
![[Number Theory - 数论-11.png]]
在公钥密码学中，不再需要提前协商密钥了。不过由于效率比较慢，通常可以通过 **公钥密码学** 来传递 **对称密码学** 的 **密钥**，然后后续使用对称加密。
另一方面，可以存在 **数字签名** 了。私钥可以用来证明身份，所有人都能用公钥来核验。

**RSA 算法。** （Plain RSA）选择两个不同的大质数 $p,q$，令 $n=pq$，那么 $\phi(n)=(p-1)(q-1)$。加密（Encryption）和解密（Decryption）的密钥 $e,d$ 需要满足：
$$
\gcd(e,\phi(n))=1
$$
$$
ed\equiv 1 \pmod{\phi(n)}
$$
那么加密：
$$
C=M^{e} \bmod n
$$
解密：
$$
M=C^{d} \bmod n
$$
这里公钥就是 $(e,n)$，私钥就是 $d$。

正确性证明：只需要证明
$$
\forall x\in \mathbb{Z}_{n},x^{ed}\equiv x\pmod{n}
$$
- Case 1: $\gcd(x,n)=1$。那么由欧拉定理，$x^{\phi(n)}\equiv1 \pmod{n}$。于是
$$
x^{ed}\equiv x^{k\phi(n)+1}\equiv(x^{\phi(n)})^{k}\cdot x\equiv x \pmod{n}
$$
- 这也可以通过费马小定理+中国剩余定理证明。
- Case 2: $\gcd(x,n)=p$。那么 $x=tp,\gcd(t,q)=1$。 只需证明
$$
x^{ed}-x=x(x^{ed-1}-1)\equiv0 \pmod{n}
$$
- 这里 $x$ 有因子 $p$，$x^{ed-1}-1=x^{k(p-1)(q-1)}-1$ 有因子 $q$（由费马小定理），于是成立。
- Case 3: $\gcd(x,n)=q$。这与 Case 2 相同。
- Case 4: $\gcd(x,n)=n$，那么 $x=0$，显然成立。

安全性：给定了 $e$ 和 $n$，算出 $\phi(n)$ 和分解 $n$ 一样都很难，进而算出 $d$ 也是很难的。实际使用上，RSA 的密钥大概是 1024 到 2048 位。

应用：SSL/TLS 协议；数字签名。
数字签名：最朴素的方法就是
$$
S=M^{d}\bmod n
$$
验证签名：
$$
M=S^{e} \bmod n
$$
但是这不安全，因为可以从已有的签名 $(M_{1},S_{1}),(M_{2},S_{2})$中构造新的签名 $(M_{1}M_{2},S_{1}S_{2})$。
实际上需要一整套安全的标准。

### 离散对数问题

整数 $y$ 以 $b$ 为底的 **离散对数（Discrete Logarithm）$x$**，为满足下式：
$$
b^{x}\equiv y\pmod n
$$
给定 $b,y,n$，计算 $x$ 就是离散对数问题，这是很困难的。

**El Gamal 加密。**
- 私钥：$x$。这里 $1<x<p-2$。
- 公钥：$p,g,y$。这里 $p$ 是一个素数，$g$ 是 $\mathbb{Z}_{p}$ 的一个生成元，且 $y=g ^{x}\bmod p$。
- 加密：要加密 $M$。选一个随机数 $k\in \mathbb{Z}_{p-1}$，令
$$
a=g ^{k} \bmod p, b=My ^{k} \bmod p
$$
- 那么密文就是 $(a,b)$。
- 解密： $M=b(a^{x})^{-1}\bmod p$。

用于数字签名：选取随机数 $k$，满足 $\gcd(k,p-1)=1$。
$$
a=g ^{k} \bmod p, b= k ^{-1} (M-xa)\bmod (p-1)
$$
验证：
$$
y ^{a} a^{b} \equiv g ^{M} \pmod{p}
$$

**Diffie-Hellman Key Exchange Protocol**
这里 $\alpha$ 是 $\mathbb{Z}_{p}$ 的一个生成元，$X_{A},X_{B}$ 保密作为私钥，于是就在只交换 $Y_{A},Y_{B}$ 的情况下得到了相同的密钥 $k$。

| User A | User B |
| --- | --- |
| Generate random $X_A<p$ | Generate random $X_B<p$ |
| Calculate $Y_A=\alpha^{X_A}\bmod p$ | Calculate $Y_B=\alpha^{X_B}\bmod p$ |
| $Y_A\rightarrow$ | $\leftarrow Y_B$ |
| Calculate $k=(Y_B)^{X_A}\bmod p$ | Calculate $k=(Y_A)^{X_B}\bmod p$ |

量子计算对于大整数分解问题与离散对数问题有较快的解决，因此挑战了公钥密码学。后量子时代的公钥密码学需要解决密钥封装（KEM），数字签名；需要找其他的困难问题。技术路线有：
- Lattice, Code, Isogeny, Multivariable, Hash
密码学除了加密解密之外：
- 数字签名
- 零知识证明
- 保护隐私的数据查询
- 网上（无需信任中心化服务器与彼此）的打牌
- 电子投票（E-Voting）
- 电子拍卖
- 全同态加密（加密 $E(m)$，且要可以用来算 $E(f(m))$）