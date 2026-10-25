## 离散概率分布

### 伯努利分布（Bernoulli Distribution）

伯努利试验（Bernoulli Trial）：只有成功和失败两种结果的试验。
若成功概率为 $p$，定义随机变量 $X$，满足 $P(X=1)=p, P(X=0)=1-p$，那么说 $X$ 服从伯努利分布： $X\sim\mathrm{Bernoulli}(p)$。
- $\mathrm{E}(X)=p$
- $\operatorname{Var}(X)=p(1-p)$

### 二项分布（Binomial Distribution）

重复 $n$ 次相互独立的伯努利试验（n-fold bernoulli trial），每次成功概率为 $p$，则成功的次数服从二项分布，记作 $X\sim B(n,p)$（或 $X\sim\mathrm{Binomial}(n,p)$），其概率质量函数（PMF）为：
$$
P(X=x)=\binom{n}{x}p^x(1-p)^{n-x},\quad x=0,1,\dots,n
$$
且有：
- $\mathrm{E}(X)=np$
- $\operatorname{Var}(X)=np(1-p)$
- $\operatorname{SD}(X)=\sqrt{ np(1-p) }$
### 几何分布（Geometric Distribution）

重复相互独立的伯努利试验（成功概率 $0<p\leq1$），直到成功，把试验的次数记为随机变量 $X$，那么我们说 $X$ 服从几何分布，记作 $X\sim\mathrm{Geometric}(p)$，其概率质量函数（PMF）为：
$$
P(X=x)=p(1-p)^{x-1}, x=1,2,\dots
$$
且有：
- $\mathrm{E}(X)=\frac{1}{p}$
- $\operatorname{Var}(X)= \frac{1-p}{p^{2}}$
- 无记忆性（Memoryless property）： $P(X>m+n\mid X>m)=P(X>n)$，其中 $m,n$ 为非负整数。
### 泊松分布（Poisson Distribution）

定义 $X\sim\mathrm{Poisson}(\lambda)$ 若它的 PMF 是：
$$
P(X=x)= \frac{\lambda^{x}}{x!}e^{-\lambda}
$$
其中常数 $\lambda>0$，$x=0,1,2,\dots$。
泊松分布可以刻画这样的事件：
- 在一个特定的时空范围内。
- 事件的发生的频率是均匀的（发生的平均次数和时间区间长度成正比）。
- 事件发生之间是独立的。
例如，统计一百年内，每年在某个十字路口发生车祸的次数。
有：
- $\mathrm{E}(X)=\lambda$
- $\operatorname{Var}(X)=\lambda$

泊松分布可以看成二项分布的极限情况：把时间区间 $[0,1]$ 分成 $n$ 份，每份上发生的概率为 $\lambda / n$，那么事件发生的次数 $X$ 实际上服从二项分布 $\mathrm{Binomial}(n,\lambda / n)$。而当 $n\to \infty$ 时：
$$P(X=x)=\lim_{ n \to \infty } \binom{n}{x}\left( \frac{\lambda}{n} \right)^{x}\left( 1-\frac{\lambda}{n} \right)^{n-x}= \frac{\lambda^{x}}{x!}e^{-\lambda}$$
（这个极限被称为泊松定理，The Poisson Theorem）
经验表明，当 $n>100$，$p<0.05$ 时，可以用泊松分布来近似二项分布。
### 其他

**超几何分布（Hypergeometric）：** $X\sim h(n,N,M)$。从含 $M$ 个成功元素的 $N$ 个元素中，不放回抽取 $n$ 个，$X$ 为抽到的成功元素数；$\max(0,n-(N-M))\leq k\leq\min(n,M)$。
$$
P(X=k)= \frac{\binom{M}{k}\binom{N-M}{n-k}}{\binom{M}{n}}
$$
**负二项分布（Negative binomial）** $X\sim\text{Nb}(r,p)$。$X$ 表示直到第 $r$ 次成功所需的总试验次数，$k=r,r+1,\dots$。
$$
P(X=k)= \binom{k-1}{r-1} p^{r} \times (1-p)^{k-r}
$$
## 连续概率分布

### 连续均匀分布（Continuous Uniform Distribution）

“选择一个 $a,b$ 之间的随机数” 可翻译为 “从 $[a,b]$ 上的连续均匀分布观察到一个值”。
PDF：
$$
f(x)=\begin{cases}
\frac{1}{b-a}, & a \leq x \leq b, \\
0, & \text{otherwise}
\end{cases}
$$
随机变量 $X$ 在 $[a,b]$ 上均匀分布： $X\sim\mathrm{Uniform}(a,b)$ 。
CDF：
$$
F(x)=\begin{cases}
0, & x\leq a, \\
\frac{x-a}{b-a}, & a< x< b, \\
1, & x\geq b,
\end{cases}
$$
期望与方差：
$$
\mathrm{E}(X)= \frac{a+b}{2}
$$
$$
\operatorname{Var}(X)= \frac{(b-a)^{2}}{12}
$$

### 指数分布（Exponential Distribution）

设 $\lambda>0$。
PDF：
$$
f(x)=\begin{cases}
\lambda e^{-\lambda x}, & x\geq 0, \\
0, & \text{otherwise}
\end{cases}
$$
CDF：
$$
F(x)=\begin{cases}
1-e^{-\lambda x},  & x\geq 0, \\
0, & \text{otherwise}
\end{cases}
$$
![[Probability Distributions - 概率分布.png|197]]
通常，指数分布用于描述到某个事件发生为止经过的时间。
- 指数分布可以描述齐次泊松过程中相邻事件之间的等待时间。
- 泊松过程（Poisson Process）：事件以恒定的平均速率 $\lambda$ 随机发生，不相交时间区间的计数相互独立；长度为 $t$ 的区间内计数服从 $\text{Poisson}(\lambda t)$。
- 设 $X$ 是泊松过程中，到事件发生为止经过的时间，则
$$
P(X\leq t) =1-P(X>t)=1-P(\text{no event occurred in } [0,t])=1- \frac{(\lambda t)^{0}}{0!}e^{-\lambda t}=1-e^{-\lambda t}
$$
- 也就是说 $X\sim\mathrm{Exp}(\lambda)$。这个 $\lambda$ 是泊松过程的速率；长度为 $t$ 的区间对应的泊松分布参数为 $\lambda t$。
![[Probability Distributions - 概率分布-1.png]]
期望与方差：
$$
\mathrm{E}(X)= \frac{1}{\lambda}
$$
$$
\operatorname{Var}(X)= \frac{1}{\lambda^{2}}
$$
这个推导需要用到分部积分。可以从频率和周期的关系来理解（泊松分布的期望是 $\lambda$）。
指数分布具有无记忆性（Memoryless property）：
$$
P(X>s+t\mid X>s)=P(X>t)
$$
若 $X\sim \mathrm{Exp}(\lambda)$，那么 $T=\lceil X \rceil$ 服从参数 $p=1-e^{-\lambda}$ 的 **几何分布**（计数取值 $1,2,\dots$）。这是因为：
$$
P(T=k)=P(k-1<X\leq k)=F(k)-F(k-1)=e^{-\lambda (k-1)}-e^{-\lambda k}=(1-e^{-\lambda}) (e^{-\lambda})^{k-1}
$$

### 正态分布（Normal Distribution）

也称为高斯分布（Gaussian Distribution）。
$X\sim N(\mu,\sigma^{2})$，其中 $\sigma>0$。PDF：
$$
f(x)= \frac{1}{\sqrt{ 2\pi }\sigma}e^{- \frac{(x-\mu)^{2}}{2\sigma^{2}}}
$$
若 $\mu=0,\sigma=1$，为标准正态分布 $X\sim N(0,1)$，其 PDF：
$$
\phi(x)= \frac{1}{\sqrt{ 2\pi }} e^{- \frac{x^{2}}{2}}
$$
标准正态分布的 CDF 没有初等函数形式的表达式，但它很常用，所以我们记它的 CDF  为 $\Phi(x)$：
$$
\Phi(x)=P(X\leq x)=\int_{-\infty}^{x} \frac{1}{\sqrt{ 2\pi }} e^{-u^{2}/2}\,\mathrm{d}u
$$
其 PDF 是一个钟形曲线：
![[Probability Distributions - 概率分布-2.png|381]]
对 $X\sim N(\mu,\sigma^2)$，可以做标准化：令 $Z= \frac{X-\mu}{\sigma}$，则 $Z\sim N(0,1)$。
期望与方差：
$$
\mathrm{E}(X)=\mu
$$
$$
\operatorname{Var}(X)=\sigma^{2}
$$

### 卡方分布（Chi-squared Distribution）

卡方分布（$\chi ^{2}$ 分布）：若 $k$ 个随机变量 $Z_{1},\dots{},Z_{k}$ 是相互独立的，且都服从标准正态分布，则这些变量的平方和 
$$
X=\sum_{i=1}^{k} Z_{i}^{2}
$$
服从自由度为 $k$ 的卡方分布，记作 $X\sim \chi ^{2}(k)$。

自由度为 $1$ 的情况，其 PDF 的推导：若 $X\sim N(0,1)$ 且 $Y=X^{2}$，那么
$$
\begin{aligned}
F_{Y}(y)=P(Y\leq{}y)&=P(X^{2}\leq{}y) \\
&=P(-\sqrt{y}\leq{}X\leq{}\sqrt{y}) \\
&=\Phi (\sqrt{y})-\Phi (-\sqrt{y}) \\
\end{aligned}
$$
从而对于 $y>0$：
$$
\begin{aligned}
f_{Y}(y)=F'_{Y}(y)&=\phi (\sqrt{y})\cdot \frac{1}{2\sqrt{y}}-\phi (-\sqrt{y})\cdot \left( -\frac{1}{2\sqrt{y}} \right) \\
&=\frac{\phi (\sqrt{y})}{\sqrt{y}} \\
&= \frac{1}{\sqrt{2\pi y}}e^{-y/2} 
\end{aligned}
$$
