随机变量分为离散的（Discrete）和连续的（Continuous）。

概率质量函数（Probability Mass Function, pmf）：对在集合 $S$ 上离散随机变量 $X$，定义它的概率质量函数：
$$
f(x)=\begin{cases}
P(X=x) & x\in S  \\
0 & x\in \mathbb{R}\text{\\} S
\end{cases}
$$

概率密度函数（Probability Density Function, pdf）：对在集合 $S$ 上连续随机变量 $X$，它落在区间 $\left[ a,b \right]$ 中的概率由概率密度函数 $f(x)$ 在 $\left[ a,b \right]$ 上对 $x$ 积分给出：
$$
P(a\leq x\leq b)=\int_{a}^b f(x)dx
$$
这里，$f(x)$ 需要满足 $\forall x \in S, f(x)\geq 0$ 且 $\int_{S}f(x)dx=1$。
注意，对连续随机变量，$P(x=a)=P(a\leq x\leq a)=\int_{a}^af(x)dx=0$。另外，不同于 pmf， pdf 的值可以大于 $1$。

## 期望（Expectation）

集合 $S$ 上，概率密度函数为 $f(x)$ 的离散随机变量 $X$ 的期望（Expectation/Expected Value/Mean）定义为
$$
\mathrm{E}[X]=\sum_{x\in{S}} xf(x)
$$
性质：
- 常量的期望就是它本身： $\mathrm{E}[a]=a$
- $\mathrm{E}[aX]=a\mathrm{E}[X]$
- $\mathrm{E}[aX+b]=a\mathrm{E}[X]+b$
- $\mathrm{E}[X+Y]=\mathrm{E}[X]+\mathrm{E}[Y]$
随机变量的 $k$ 阶原点矩（$k$ -th Raw Moment）：$\mathrm{E}[X^k]$

## 方差（Variance）

离散随机变量 $X$ 方差定义为：
$$
\mathrm{Var}[X]=\sum_{x\in S} (X-\mathrm{E}[X])^{2} f(x)
$$
也就是
$$
\mathrm{Var}[X]=\mathrm{E}[(X-\mathrm{E}[X])^{2}]
$$
可以推导出计算公式：
$$
\mathrm{Var}[X]=\mathrm{E}[X^{2}]-\mathrm{E}[X]^{2}
$$
另外可以定义标准差（Standard Deviation）：
$$
\mathrm{SD}[X]=\sqrt{ \mathrm{Var}[X] }
$$

## 累计分布函数（CDF）

随机变量 $X$ 的 Cumulative distribution function (or CDF)：

$$
F(x)=P(X\leq x)
$$ 
对于连续随机变量 $X$ ，若其概率密度函数（pdf）为 $f(x)$，则 CDF 为
$$
F(x)=P(X\leq x)=\int_{-\infty}^x f(t)dt
$$
那么用 CDF 可以计算概率：
$$
P(a\leq X\leq b)=F(b)-F(a)
$$
