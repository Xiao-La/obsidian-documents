随机变量的定义：定义在样本空间上的一个实值函数。$X:\Omega\to \mathbb{R}$。

随机变量常见的类型有离散型（Discrete）和连续型（Continuous）。

概率质量函数（Probability Mass Function, pmf）：对在集合 $S$ （称为支撑集 Support）上离散随机变量 $X$，定义它的概率质量函数：
$$
p(x)=
P(X=x) (x\in S)
$$

概率密度函数（Probability Density Function, pdf）：对在集合 $S$ 上的连续型随机变量 $X$，它落在区间 $\left[ a,b \right]$ 中的概率由概率密度函数 $f(x)$ 在 $\left[ a,b \right]$ 上对 $x$ 积分给出：
$$
P(a\leq X\leq b)=\int_{a}^b f(x)\,\mathrm{d}x
$$

这里，$f(x)$ 需要满足 $\forall x \in S, f(x)\geq 0$ 且 $\int_{S}f(x)\,\mathrm{d}x=1$。
注意，对连续随机变量，$P(X=a)=P(a\leq X\leq a)=\int_{a}^af(x)\,\mathrm{d}x=0$。另外，不同于 pmf， pdf 的值可以大于 $1$。


随机变量 $X$ 的累计分布函数（Cumulative distribution function, cdf)：

$$
F(x)=P(X\leq x)
$$
对于连续随机变量 $X$ ，若其概率密度函数（pdf）为 $f(x)$，则 cdf 为
$$
F(x)=P(X\leq x)=\int_{-\infty}^x f(t)\,\mathrm{d}t
$$
那么用 cdf 可以计算概率：
$$
P(a\leq X\leq b)=F(b)-F(a)
$$
在 $f$ 连续的点，有
$$
f(x)=F'(x)
$$
CDF 是不降的而且是右连续的。



两个离散随机变量 $X,Y$ 相互独立定义为，对任意取值 $X=x, Y=y$，有
$$
P(X=x,Y=y)=P(X=x)\cdot P(Y=y)
$$
## 期望（Expectation）

集合 $S$ 上，概率质量函数为 $p(x)$ 的离散随机变量 $X$ 的期望（Expectation/Expected Value/Mean）定义为
$$
\mathrm{E}(X)=\sum_{x\in S}xp(x)
$$
性质（以下期望存在）：
- 常量的期望就是它本身： $\mathrm{E}(a)=a$
- $\mathrm{E}(aX)=a\mathrm{E}(X)$
- $\mathrm{E}(aX+b)=a\mathrm{E}(X)+b$
- $\mathrm{E}(X+Y)=\mathrm{E}(X)+\mathrm{E}(Y)$
- $\mathrm{E}(g_{1}(X)+g_{2}(X))=\mathrm{E}(g_{1}(X))+\mathrm{E}(g_{2}(X))$
随机变量的 $k$ 阶原点矩（$k$ -th Raw Moment）：$\mathrm{E}(X^k)$
如果是连续随机变量，就定义为积分：
$$
\mathrm{E}(X)=\int_{-\infty}^{\infty}xf(x)\,\mathrm{d}x
$$

## 方差（Variance）

随机变量 $X$ 的方差定义为
$$
\operatorname{Var}(X)=\mathrm{E}\left[(X-\mathrm{E}(X))^2\right]
$$
可以推导出计算公式：
$$
\operatorname{Var}(X)=\mathrm{E}(X^{2})-\mathrm{E}(X)^{2}
$$
对于离散随机变量就是 $\sum(x_{i}-\mathrm{E}(X))^{2}p_{i}$，对于连续随机变量就是类似的积分。
另外可以定义标准差（Standard Deviation）：
$$
\operatorname{SD}(X)=\sqrt{ \operatorname{Var}(X) }
$$
性质：
$$
\operatorname{Var}(aX+b)=a^{2}\operatorname{Var}(X), \operatorname{SD}(aX+b)=\lvert a\rvert \operatorname{SD}(X)
$$

## 随机变量的变换


**离散到离散。** 对于离散随机变量 $X$，其 PMF 为 $p_{X}(x)$，那么离散随机变量 $Y=g(X)$ 的 PMF 就是：
$$
p_Y(y)=P(Y=y)=\sum _{x\colon g(x)=y}p_{X}(x)
$$
也就是把 $Y$ 的对应的 $X$ 的概率求和。

**连续到离散。** $X$ 连续且 PDF 为 $f_X(x)$，$Y=g(X)$ 离散，只需把求和换成积分：
$$
p_{Y}(y)=P(Y=y)=\int _{x\colon g(x)=y}f_X(x)\,\mathrm{d}x
$$

**连续到连续。** $X$ 连续， $Y=g(X)$ 连续，PDF 分别为 $f_X,f_Y$ ，那么：
- 若 $g(x)$ 满足：在 $X$ 的支撑集上严格单调，且有连续可导的反函数 $h(y)=g^{-1}(y)$，那么
$$
f_{Y}(y)=\begin{cases}
\lvert h'(y) \rvert \cdot f_{X}(h(y)) & \text{where } h(y) \text{ is defined}  \\
0 & \text{otherwise} 
\end{cases}
$$
- 证明：考虑 CDF。那么
$$
F_{Y}(y)=P(Y\leq{}y)=P(g(X)\leq{}y)
$$
- 若 $g(x)$ 严格单调增，那么有
$$
F_{Y}(y)=P(X\leq{}g^{-1}(y))=F_{X}(h(y))\implies{}f_{Y}(y)=F_{Y}'(y)=h'(y)f_{X}(h(y))
$$
- 若严格单调减，也类似，可以得到 $f_{Y}(y)=-h'(y)f_{X}(h(y))$。
- 统一起来就得到上面的结果。

结论（$X$ 套上自己的 CDF 后，服从均匀分布；均匀分布套上 CDF 的反函数，就服从这个 CDF）：
- 若 $X$ 的 CDF 是连续的，且存在反函数 $F^{-1}(x)$。定义 $Y=F(X)$，则 $Y\sim \mathrm{Uniform}(0,1)$。
- 反过来，若 $F(x)$ 是某个随机变量的 CDF，且存在反函数 $F^{-1}(x)$，令 $U\sim \mathrm{Uniform(0,1)}$，那么定义 $X=F^{-1}(U)$，有 $X\sim F(x)$，也就是说 $X$ 的 CDF 就是 $F(x)$。
证明：
- $Y=F(X)$，这里 $F$ 是连续且不减的。那么 $F_{Y}(y)=P(Y\leq{}y)=P(F(X)\leq{}y)=P(X\leq{}F^{-1}(y))=F(F^{-1}(y))=y$。那么 $f_Y(y)=F'_{Y}(y)=1$。
- 反过来，按照 $X$ 的定义，$F_X(x)=P(X\leq{}x)=P(F^{-1}(U)\leq{}x)=P(U\leq{} F(x))=F(x)$。
第二个结论用来做 **逆变换采样（Inverse Transform Sampling）**，用于从均匀分布上的随机数，来生成服从某个分布的随机数。

### 变换后的期望

离散：
$$
\mathrm{E}(Y)=\mathrm{E}(g(X))=\sum_{k=1}^{\infty} g(x_{k})p_{k}
$$
连续就是换成积分（$X$ 的 PDF 为 $f(x)$）：
$$
\mathrm{E}(Y)=\mathrm{E}(g(X))=\int_{-\infty}^{\infty} g(x)f(x)\,\mathrm{d}x
$$

关于 $\mathrm{E}(g(X))$ 和 $g(\mathrm{E}(X))$ 的关系，根据琴生不等式（Jensen's Inequality）：
- 若函数 $g$ 是凸的 / Convex，那么  $\mathrm{E}(g(X))\geq{}g(\mathrm{E}(X))$ 。
- 若函数 $g$ 是凹的 / Concave，那么  $\mathrm{E}(g(X))\leq{}g(\mathrm{E}(X))$ 。

*Extra:* 琴生不等式的应用，Kullback-Leibler divergence (KL divergence, KL散度)，衡量两个 PDF 之间的距离：
$$
D_{\mathrm{KL}}(p\Vert q) = \int_{-\infty}^{\infty} p(x) \log \left( \frac{p(x)}{q(x)} \right)\,\mathrm{d}x
$$
根据琴生不等式可以证明 $D_{\mathrm{KL}}\geq{}0$，且取等当且仅当两者表示同一分布。


