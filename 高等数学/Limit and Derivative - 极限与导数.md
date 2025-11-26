
## 定义总结

函数连续（Continuous）的定义： $\lim_{ x \to c }f(x)=f(c)$
导数（Derivative）的定义：$\lim_{ h \to 0 } \frac{f(x+h)-f(x)}{h}$
关键点（Critical Points）：导数为 $0$ 或导数未定义的点。
函数增（Increase）和减（Decrease）：$f'(x)>0$ 或 $f'(x)<0$。
Concave Up 和 Concave Down：$f''(x)>0$ 或 $f''(x)<0$。
拐点（Inflection Point）：左右两边 $f''(x)$ 符号不同（注意不要求 $f''(x)$ 存在）。
反函数（Inverse Function）：对一对一函数（One-to-one Function）来说，存在反函数 $y=f^{-1}(x)$，使得 $f(y)=x$。 
## 定理总结
		
- **夹逼定理（The Sandwich Theorem）**：
  - 适用条件：存在 $a\in\mathbb{R}$，在 $a$ 的某去心邻域内有
    $$
    f(x)\le g(x)\le h(x),
    $$
    且
    $$
    \lim_{x\to a} f(x)=\lim_{x\to a} h(x)=L.
    $$
  - 结论：
    $$
    \lim_{x\to a} g(x)=L.
    $$
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
	另外，它在  $0$  处没有二阶导，$(0,0)$ 也不是它的拐点。
2.  $f(x)=\begin{cases}1 & x\neq 0 \\ 0 & x=0\end{cases}$
	和第 1 条类似但稍弱一些，说明 $f'(0)$ 和 $\lim_{ x \to 0 }f'(x)$ 不是一回事。

## 杂类

**"函数在 $x$ 处连续" 是 "函数在 $x$ 处可导" 的必要不充分条件。**

**牛顿迭代法（Newton's Method）：**$x_{n+1}=x_{n}-\frac{f(x_{n})}{f'(x_{n})}$

**渐近线（Asymptotes）：**
- 垂直（Vertical）渐近线：$\lim_{ x \to a^{\pm} }f(x)=\pm \infty \to x=a$
- 水平（Horizontal）渐近线：$y=\lim_{ x \to \pm \infty }f(x)$
- 斜（Oblique）渐近线：
  - $y=ax+b$ ，其中 $a = \lim_{ x \to \pm \infty } \frac{f(x)}{x}, b = \lim_{ x \to \pm \infty } (f(x)-ax)$。
  - 对多项式的商，如果分子比分母的最高次数多 $1$，可能产生斜渐近线。

**线性化（Linearization）**：切线。

**画函数图像**：注意单调性和极值 / 凸性和拐点 / 渐近线。

**三角函数和反三角函数导数公式表：** [[Derivative-1]]

对**向量值函数（Vector-Valued Functions）** 求导：只需对向量的各组成部分分别求导。