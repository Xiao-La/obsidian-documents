- 来源：Monte Carlo Casino（Monaco）

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
最后令 $x_{i}=\mu+\sigma z_{i}$，就得到服从 $N(\mu,\sigma ^{2})$ 的序列。





