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