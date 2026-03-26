
## 概念与定义

函数连续（Continuous）的定义： $\lim_{ x \to c }f(x)=f(c)$

导数（Derivative）的定义：$\lim_{ h \to 0 } \frac{f(x+h)-f(x)}{h}$

关键点（Critical Points）：导数为 $0$ 或导数未定义的点。

函数增（Increase）和减（Decrease）：$f'(x)>0$ 或 $f'(x)<0$。

Concave Up 和 Concave Down：$f''(x)>0$ 或 $f''(x)<0$。

拐点（Inflection Point）：左右两边 $f''(x)$ 符号不同（注意不要求 $f''(x)$ 存在）。

一对一函数（One-to-one Function）：$f(x_{1})=f(x_{2})\implies x_{1}=x_{2}$（一个充分条件是 $f$ 严格单调） 

反函数（Inverse Function）：对一对一函数（One-to-one Function）来说，存在反函数 $y=f^{-1}(x)$，使得 $f(y)=x$。 

小 o 记号（little-oh Notation）：$f=o(g)$（“$f$ is little-oh of $g$”），当  $f$ 的阶比 $g$ 的阶更小，即 $\lim\limits_{x\to\infty}\frac{f(x)}{g(x)}=0$

大 O 记号（big-oh Notation）： $f=O(g)$（“$f$ is big-oh of $g$”），当的阶小于或等于 $g$  的阶，即 $\lim\limits_{x\to\infty}\frac{f(x)}{g(x)}\le M$

## 定理

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
  - 常用来证明等式。

- **拉格朗日中值定理（The Mean Value Theorem, Lagrange MVT）：**
  - 适用条件：$f$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导。
  - 结论：存在 $c\in(a,b)$ 使
    $$
    f'(c)=\frac{f(b)-f(a)}{b-a}.
    $$
  - 常用来证明不等式。

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
- **洛必达法则（L’Hôpital’s rule）：**
  - 适用条件：设 $f,g$ 在点 $a$ 的某去心邻域内可导，且
    $$
    \lim_{x\to a} f(x)=\lim_{x\to a} g(x)=0 \quad\text{或}\quad \lim_{x\to a} f(x)=\pm\infty,\ \lim_{x\to a} g(x)=\pm\infty,
    $$
    并且 $g'(x)\ne 0$（在该邻域内），极限
    $$
    \lim_{x\to a}\frac{f'(x)}{g'(x)}
    $$
    存在（有限或为 $\pm\infty$）。
  - 结论：
    $$
    \lim_{x\to a}\frac{f(x)}{g(x)} \;=\; \lim_{x\to a}\frac{f'(x)}{g'(x)}.
    $$
## 经典反例

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

## 泰勒公式

若函数 $f$ 在包含 $a$ 的开区间 $I$ 上存在各阶导数，则对任意正整数 $n$ 及任意 $x\in I$，有泰勒展开

$$f(x)=\left(\sum^{n}_{i=0}\frac{f^{(i)}(a)(x-a)^i}{i!}\right)+R_n(x)$$

余项 $R_n(x)=\dfrac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$，其中 $c$ 位于 $a$ 与 $x$ 之间。
**余项估计定理（Remainder Estimation Theorem）：** 若存在正常数 $M$ 使得
$$|f^{(n)}(x)|\leq M$$
对每个 $n\geq 0$ 成立，则该级数收敛到 $f(x)$。

若此时 $R_{n}\to 0$ 当 $n\to \infty$ 对 $x \in I$ 恒成立，则 $f$ 在 $x=a$ 处的泰勒展开收敛到 $f$，记作
$$
f(x)=\sum^{\infty}_{i=0} \frac{f^{(i)}(a)(x-a)}{i!}
$$
麦克劳林级数（Maclaurin series）是在 $0$ 处的泰勒公式。 
一些常见函数的麦克劳林展开：
$$
\sin x=x- \frac{x^3}{3!}+ \frac{x^5}{5!} - \frac{x^7}{7!}+\cdots (x\to 0)
$$
$$
\cos x=1-\frac{x^2}{2!}+\frac{x^4}{4!}- \frac{x^6}{6!} + \cdots(x\to 0)
$$
$$
e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots(x\to 0)
$$
这三个容易直观理解。
$$
\tan x=x+\frac{1}{3}x^3+\frac{2}{15}x^5+\cdots(x\to 0)
$$
这个需要死记硬背。
注意，上面这些公式在其定义域内都收敛。
$$
\frac{1}{1-x}=1+x+x^2+x^3+\cdots(x\to 0)
$$
$$
\frac{1}{1+x}=1-x+x^2-x^3+\cdots(x \to 0)
$$
$$
\ln(1+x)=x- \frac{x^2}{2}+ \frac{x^3}{3}-\frac{x^4}{4} + \cdots (x \to 0)
$$
这几个都可以互推。
注意，前两个公式收敛需要 $|x|<1$，最后一个公式收敛需要 $-1<x\leq 1$。
特别的，
$$
\ln(\cos x)=\ln\left( 1-\frac{x^2}{2}+o(x^2) \right)=-\frac{x^2}{2}+o(x^2)
$$
