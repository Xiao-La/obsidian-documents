- 来源：Monte Carlo Casino（Monaco）

蒙特卡洛算法，是通过大量重复随机抽样来求解数值近似解的方法。

## 理论基础

**大数定律（the law of large numbers）：** 令 $X_{1},X_{2}, \dots$ 是 i.i.d. 的随机变量，而 $\mu=\mathrm{E}(X_{i})<\infty$，且 $\overline{X}_{n}= (X_{1} + X_{2} + \dots + X_{n}) / n$。那么当 $n\to \infty$， $\overline{X}_{n}$ 依概率收敛（converges in probability）到 $\mu$：
$$
\overline{X}_{n} \xrightarrow[]{P} \mu, \quad  n\to \infty
$$
这是较弱的版本，较强的版本是说“几乎处处收敛”。
不同的“收敛”：
- 几乎处处收敛（a.s.）：$$P\Big(\big\{\omega:\ \lim_{n\to\infty} X_n(\omega) = X(\omega)\big\}\Big) = 1,\qquad \text{记作 } X_n \xrightarrow{a.s.} X$$
- $L^{p}$ 收敛：
$$\lim_{n\to\infty} E\big[|X_n - X|^p\big] = 0,$$
- 依概率收敛：
$$\lim_{n\to\infty} P\big(|\bar X_n - \mu| > \varepsilon\big) = 0,\qquad \text{记作 } \bar X_n \xrightarrow{P} \mu$$
- 依分布收敛：$F_{X_n}(x)\to F_X(x)$，对 $F_X$ 的**所有连续点** $x$ 成立，记作 $X_n \xrightarrow{d} X$。
这里的强弱关系：
```
        a.s. ──┐
               ├──▶  依概率 P  ──▶  依分布 d
  L^q ─▶ L^p ──┘
 (q>p≥1)
```
可以通过 CLT 来理解一下大数定律，根据 CLT，可以得到，当 $n\to \infty$，有
$$
\overline{X}_{n} \overset{\text{approx.}}{\sim} N\left( \mu, \frac{\sigma ^{2}}{n} \right)
$$
当 $n\to \infty$，这个正态分布的方差就接近 $0$，于是 $\overline{X}_{n}$ 就会集中在 $\mu$。
## 随机数生成

在蒙特卡洛方法中，很重要的一个事就是从一个分布中去抽样。这就需要用伪随机数生成器（pseudo-random number generator）来实现。
通常一个伪随机数生成器会支持生成一个序列 $u_{1},u_{2}, \dots u_{n}$，每个数独立且服从 $U[0,1]$ 。
从 $U\sim U[0,1]$ 可以得到 序列 $u_{1}, u_{2}, \dots, u_{n}$，那么：
- $\mathrm{Bernoulli}(p)$：
$$
x_{i}=\begin{cases}
1 & 0<u_{i}<p \\
0 & p\leq u_{i}<1
\end{cases}
$$
- $\mathrm{Poisson}(\lambda)$：$p_{k}=P(X=k)= \frac{\lambda ^{k}}{k!}e^{-\lambda}$，那么我们划分不同的区间 $I_{0}=(0,p_{0}),I_{1}=[p_{0},p_{0}+p_{1}),I_{2}=[p_{0}+p_{1},p_{0}+p_{1}+p_{2}),\dots$，那么每个区间的长度就是对应的概率，只需要令 $x_{i}=k$，若 $u_{i}\in I_{k}$ 即可。
所以对于离散分布，通用的做法是去切分区间 $(0,1)$，使得一个取值对应的长度等于它的概率。

对于连续分布，就需要使用 **逆变换采样**：
- 若需要采样的分布 CDF 为 $F(x)$，且 $F(x)$ 有反函数 $F^{-1}(x)$，令 $U\sim U[0,1]$，那么 $X=F^{-1}(U)\sim F(x)$。
- 这是因为 $F_{X}(x)=P(X\leq x)=P(F^{-1}(U)\leq x)=P(U\leq F(x))=F(x)$。
例如从序列 $u_{1}, u_{2}, \dots, u_{n}$ 中得到：
- $\mathrm{Exp}(\lambda)$：$F(x)=1-e^{-\lambda x}\implies F^{-1}(u)=-\frac{\ln(1-u)}{\lambda}$，于是从序列 $u_{1},u_{2}, \dots, u_{n}$ 中得到 $x_{i}=F^{-1}(u_{i})$。
- $\mathrm{Gamma}(r,\lambda)$：没有闭式的 CDF。但当 $r$ 为正整数时，可以根据定义，拆成生成 $r$ 个 $\mathrm{Exp}(\lambda)$ 的序列，把对应位置相加即可得到服从伽马分布的序列。
- $N(\mu,\sigma ^{2})$：没有闭式的 CDF。有一种巧妙的方法：取两个相互独立的 $U_{1}\sim U[0,1]$ 和 $U_{2}\sim U[0,1]$，那么
$$
\begin{cases}
Z_{1} = \sqrt{-2\ln(U_{1})}\cos(2\pi U_{2}) \\
Z_{2} = \sqrt{-2\ln (U_{1})} \sin(2\pi U_{2})
\end{cases}
$$
- 可以证明，这里 $Z_{1},Z_{2}$ 就是一对独立的标准正态分布变量。于是只需生成两个 $U[0,1]$ 上的随机数序列 $u_{11},u_{12},u_{21},u_{22}, \dots ,u_{n 1}, u_{n 2}$，令
$$z_{2i-1}=\sqrt{-2\ln(u_{i 1})}\cos(2\pi u_{i 2}),\quad z_{2i}=\sqrt{-2\ln(u_{i 1})}\sin(2\pi u_{i 2})$$
- 最后令 $x_{i}=\mu+\sigma z_{i}$，就得到服从 $N(\mu,\sigma ^{2})$ 的序列。
- 怎么证明？一种方法：若 $(X,Y)$ 的 joint PDF 为 $f_{XY}(x,y)$，做变量替换 $U=g_{1}(X,Y),V=g_{2}(X,Y)$，那么有
$$
f_{UV}(u,v)=f_{XY}(x(u,v),y(u,v)) \times \lvert J \rvert
$$
- 这里
$$\lvert J \rvert= \left\lvert \frac{\partial (x,y)}{\partial (u,v)}\right\rvert=\begin{vmatrix} \frac{\partial x}{\partial u} & \frac{\partial y}{\partial u} \\  \frac{\partial x}{\partial v} & \frac{\partial y}{\partial v}\end{vmatrix}$$
- 利用这个公式去计算即可。
- 另一种方法：试通过二重积分证明 $P(Z_{1}\leq a,Z_{2}\leq b)=\Phi(a)\Phi (b)$。这里积分过程中，需要计算的雅可比行列式为
$$
\lvert J \rvert= \left\lvert  \frac{\partial (z_{1},z_{2})}{\partial (u_{1},u_{2})}  \right\rvert
$$

对于更复杂的一些概率分布，有 **拒绝采样（Rejection Sampling）：** 对于一个目标分布 $f(x)$，我们选取一个参考分布（Proposal Distribution）$g(x)$，使得：
- $g(x)$ 与 $f(x)$ 的支撑集相同。
- 存在常数 $c>1$，使得 $f(x)\leq c g(x)$ 对于任意的 $f(x)$ 的支撑集中的 $x$。
- $g(x)$ 比较容易采样。
那么，从 $g(x)$ 中生成 $x_{i}$，从 $U[0,1]$ 中生成 $u_{i}$，那么，
- 若 $u_{i} \cdot cg(x_{i})>f(x_{i})$，则拒绝 $x_{i}$。（这也相当于从 $U[0,cg(x_{i})]$ 上生成一个值，与 $f(x_{i})$ 比较）
- 否则，接受 $x_{i}$。接受的 $x_{i}$ 就视作从 $f(x)$ 中抽样的值。
理论依据：
- 接受的概率为
$$
P\left( U\leq \frac{f(X)}{cg(X)} \right)= \int_{-\infty}^{\infty} P\left( U\leq \frac{f(X)}{cg(X)}\mid X=x \right)g(x)\,\mathrm{d}x =\int_{-\infty}^{\infty}  \frac{f(x)}{cg(x)}g(x)\,\mathrm{d}x= \frac{1}{c}
$$
- 因此我们要在 $f(x)\leq cg(x)$ 的条件下，让 $c$ 尽量小，这样的话，接受的概率就会高一点，丢掉的采样就少一些，算法就更加高效。最好的情况就是 $c= \sup\frac{f(x)}{g(x)}$（上确界）。
- 接受的值服从目标分布 $f(x)$。这是因为，考虑接受的值的 CDF：
$$
\begin{aligned}
&P(X\leq t\mid X\text{ is accepted}) \\
&\, = \frac{P(X\leq t,X\text{ is accepted})}{P(X \text{ is accepted})} \\
&\, = cP(X\leq t,X\text{ is accepted}) \\
&\, = c \int_{-\infty}^{\infty}  P(X\leq t, X\text{ is accepted} \mid X=x)g(x)\,\mathrm{d}x \\
&\, = c \int_{-\infty}^{\infty} I(x\leq t) P\left( U\leq \frac{f(x)}{cg(x)} \right)g(x)\,\mathrm{d}x \\
&\, = c \int_{-\infty}^{\infty} I(x\leq t) \frac{f(x)}{cg(x)}g(x)\,\mathrm{d}x \\
&\, = \int_{-\infty}^{t} f(x)\,\mathrm{d}x=F(t)
\end{aligned}
$$
其中 $I(x\leq t)=\begin{cases}1, & x\leq t  \\0,  & x>t \end{cases}$ 为 indicator function。
另外，如果我们只知道 $f(x)$ 和 $g(x)$ 的某个常数倍数，比如如果有 $f(x)=c_{1}f^{*}(x),g(x)=c_{2}g ^{*}(x)$，那么我们对 $f^{*}(x)$ 与 $g ^{*}(x)$ 应用拒绝采样的流程，也是可以正确采样的！这里只需要满足 $f^{*}(x)\leq cg ^{*}(x)$，而不要求它们是 PDF。从 $g(x)$ 采样 $x_{i}$，从 $U[0,1]$ 采样 $u_{i}$，把拒绝的条件变成 $u_{i} \cdot cg ^{*}(x_{i})>f^{*}(x_{i})$。











