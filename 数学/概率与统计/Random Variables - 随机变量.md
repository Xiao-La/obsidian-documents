随机变量的定义：定义在样本空间上的一个实值函数。$X:\Omega\to \mathbb{R}$。

随机变量分为离散的（Discrete）和连续的（Continuous）。

概率质量函数（Probability Mass Function, pmf）：对在集合 $S$ （称为支撑集 Support）上离散随机变量 $X$，定义它的概率质量函数：
$$
p(x)=
P(X=x) (x\in S）
$$

概率密度函数（Probability Density Function, pdf）：对在集合 $S$ 上连续随机变量 $X$，它落在区间 $\left[ a,b \right]$ 中的概率由概率密度函数 $f(x)$ 在 $\left[ a,b \right]$ 上对 $x$ 积分给出：
$$
P(a\leq x\leq b)=\int_{a}^b f(x)dx
$$（这也是连续随机变量的定义）
这里，$f(x)$ 需要满足 $\forall x \in S, f(x)\geq 0$ 且 $\int_{S}f(x)dx=1$。
注意，对连续随机变量，$P(x=a)=P(a\leq x\leq a)=\int_{a}^af(x)dx=0$。另外，不同于 pmf， pdf 的值可以大于 $1$。


随机变量 $X$ 的累计分布函数（Cumulative distribution function, cdf)：

$$
F(x)=P(X\leq x)
$$
对于连续随机变量 $X$ ，若其概率密度函数（pdf）为 $f(x)$，则 cdf 为
$$
F(x)=P(X\leq x)=\int_{-\infty}^x f(t)dt
$$
那么用 cdf 可以计算概率：
$$
P(a\leq X\leq b)=F(b)-F(a)
$$
且有
$$
f(x)=F'(x)
$$
CDF 是不降的而且是右连续的。



两个离散随机变量 $X,Y$ 相互独立定义为，对任意取值 $X=x, Y=y$，有
$$
P(X=x,Y=y)=P(X=x)\cdot P(Y=y)
$$
## 期望（Expectation）

集合 $S$ 上，概率密度函数为 $f(x)$ 的离散随机变量 $X$ 的期望（Expectation/Expected Value/Mean）定义为
$$
\mathrm{E}(X)=\sum_{x\in{S}} xf(x)
$$
性质：
- 常量的期望就是它本身： $\mathrm{E}(a)=a$
- $\mathrm{E}(aX)=a\mathrm{E}(X)$
- $\mathrm{E}(aX+b)=a\mathrm{E}(X)+b$
- $\mathrm{E}(X+Y)=\mathrm{E}(X)+\mathrm{E}(Y)$
- $\mathrm{E}(g_{1}(X)+g_{2}(X))=\mathrm{E}(g_{1}(X))+\mathrm{E}(g_{2}(X))$
随机变量的 $k$ 阶原点矩（$k$ -th Raw Moment）：$\mathrm{E}(X^k)$
如果是连续随机变量，就定义为积分：
$$
\mathrm{E}(X)=\int_{-\infty}^{\infty}xf(x)
$$

## 方差（Variance）

随机变量 $X$ 方差定义为
$$
\mathrm{Var}(X)=\mathrm{E}(X-\mathrm{E}(X))^{2}
$$
可以推导出计算公式：
$$
\mathrm{Var}(X)=\mathrm{E}(X^{2})-\mathrm{E}(X)^{2}
$$
对于离散随机变量就是 $\sum(x_{i}-\mathrm{E}(X))^{2}p_{i}$，对于连续随机变量就是类似的积分。
另外可以定义标准差（Standard Deviation）：
$$
\mathrm{SD}(X)=\sqrt{ \mathrm{Var}(X) }
$$
性质：
$$
\mathrm{Var}(aX+b)=a^{2}\mathrm{Var}(X), \mathrm{SD}(aX+b)=a\mathrm{SD}(X)
$$


