
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
![[Number Theory - 数论-2.png]]![[Number Theory - 数论-3.png]]这是因为：
$$
ab=b_{0}(a\cdot2^{0})+b_{1}(a\cdot2^{1})+\dots+b_{n-1}(a\cdot2^{n-1})
$$
那么只需要把 $b_{j}=1$ 的那些 $a$ 的移位加起来。

一个朴素的除法：
![[Number Theory - 数论-4.png|501]]
补充：若 $a<0$ 且恰好整除（$r=0$），图中还需令 $q=-q$。
可以通过分治来优化：
![[Number Theory - 数论-5.png|392]]
这相当于把 $a=dq+r$ 写成 $a / 2=d \cdot q / 2+r / 2$，然后去处理奇偶性细节。每次缩小一半，所以这个是 $O(\log q \log a)=O(n^{2})$ 的。

模指数算法：
![[Number Theory - 数论-6.png]]
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

![[Number Theory - 数论-7.png|366]]

设 $a>b$，欧几里得算法中，while 循环执行的次数是 $O(\log b)$。若考虑除法操作的复杂度 $O(\log ^{2}a)$，总的复杂度可以写成 $O(\log ^{3}a)$。这是多项式时间的。

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

### 裴蜀定理（Bezout's Theorem）

**裴蜀定理**：$a,b$ 的最大公因数可以写成 $a,b$ 的线性组合：
$$
d=\gcd(a,b)=sa+tb
$$

证明：考虑欧几里得算法的步骤：

![[Number Theory - 数论-8.png|349]]

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
![[Number Theory - 数论-9.png|443]]
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

## 汇总


![[Number Theory - 数论-10.png]]