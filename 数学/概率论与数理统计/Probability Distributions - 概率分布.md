## 离散概率分布

### 伯努利分布（Bernoulli Distribution）

伯努利试验（Bernoulli Trial）：只有成功和失败两种结果的试验。
若成功概率为 $p$，定义随机变量 $X$，满足 $P(X=1)=p, P(X=0)=1-p$，那么说 $X$ 服从伯努利分布： $X\sim\text{Bernoulli}(p)$。
### 二项分布（Binomial Distribution）

有 $n$ 次相互独立的伯努利试验，每次成功概率为 $p$，则成功的次数服从二项分布，记作 $X\sim B(n,p)$，其概率密度函数为：
$$
P(X=x)=\binom{n}{x}p^x(1-p)^{n-x}
$$
且有：
- $\mathrm{E}[X]=np$
- $\mathrm{Var}[X]=np(1-p)$
- $\mathrm{SD}[X]=\sqrt{ np(1-p) }$

## 连续概率分布

### 连续均匀分布（Continuous Uniform Distribution）

“选择一个 $a,b$ 之间的随机数” 可翻译为 “从 $[a,b]$ 上的连续均匀分布观察到一个值”。
概率密度函数：
$$
f(x)=\begin{cases}
\frac{1}{b-a}, & a \leq x \leq b, \\
0, & \text{otherwise}
\end{cases}
$$
随机变量 $X$ 在 $[a,b]$ 上均匀分布： $X\sim U[a,b]$ 。