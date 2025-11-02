## 定理总结

- **介值定理（Intermediate Value Theorem, IVT）：**
  - 适用条件：$f$ 在闭区间 $[a,b]$ 上连续。
  - 结论：对任意 $y$ 介于 $f(a)$ 与 $f(b)$ 之间，存在 $c\in[a,b]$（当 $y$ 严格介于两者间时可取 $c\in(a,b)$）使得 $f(c)=y$。

- **极值定理（Extreme Value Theorem, EVT）：**
  - 适用条件：$f$ 在闭区间 $[a,b]$ 上连续。
  - 结论：存在 $x_{\min},x_{\max}\in[a,b]$，使得
    $$
    f(x_{\min})=\min_{x\in[a,b]} f(x),\quad
    f(x_{\max})=\max_{x\in[a,b]} f(x).
    $$

- **罗尔定理（Rolle's Theorem）：**
  - 适用条件：$f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，且 $f(a)=f(b)$。
  - 结论：存在 $c\in(a,b)$ 使 $f'(c)=0$。

- **拉格朗日中值定理（The Mean Value Theorem, Lagrange MVT）：**
  - 适用条件：$f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导。
  - 结论：存在 $c\in(a,b)$ 使
    $$
    f'(c)=\frac{f(b)-f(a)}{b-a}.
    $$

- **柯西中值定理（Cauchy Mean Value Theorem, CMVT）：**
  - 适用条件：$f,g$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，且 $g(b)\ne g(a)$。
  - 结论：存在 $c\in(a,b)$ 使
    $$
    [f(b)-f(a)]\,g'(c)=[g(b)-g(a)]\,f'(c).
    $$
    若另知 $g'(c)\ne 0$（例如 $g'(x)\ne 0$ 于 $(a,b)$），则
    $$
    \frac{f'(c)}{g'(c)}=\frac{f(b)-f(a)}{g(b)-g(a)}.
    $$
- **费马引理（Fermat's Lemma）：**
  - 适用条件：$f$ 在某开区间 $I$ 上定义，$c\in I$ 为内点；$f$ 在 $c$ 处可导；$c$ 是 $f$ 的局部极值点（极大或极小）。
  - 结论：$f'(c)=0$。
## 经典反例：

1. $f(x)=\begin{cases}x^2\sin \left( \frac{1}{x} \right) & x\neq 0 \\ 0 & x=0\end{cases}$
	$f(x)$ 连续且处处可导，但 $f'(x)$ 在 $0$ 处不连续，因为 $\lim_{ x \to 0 }f'(x)$ 不存在。
	这个函数在 $0$ 附近震荡非常强烈，例如可构造 $g(x)=2f(x)+x$ 让 $f'(x)$ 在 $0$ 附近符号频繁变化。
2.  $f(x)=\begin{cases}1 & x\neq 0 \\ 0 & x=0\end{cases}$
	和第 1 条类似但稍弱一些，说明 $f'(0)$ 和 $\lim_{ x \to 0 }f'(x)$ 不是一回事。
