前置： [[Limit and Derivative - 极限与导数]]
定积分的定义：对黎曼和 $\sum^{n}_{i=1}f\left( a+ \frac{b-a}{n} i \right) \times \frac{b-a}{n}$ 取极限。
## 定理总结

- 积分中值定理（First Mean Value Theorem for Integrals）：
  - 适用条件：$f$ 在 $[a,b]$ 上连续。
  - 结论：存在 $c\in(a,b)$ 使
    $$
    \int_a^b f(x)\,dx \;=\; f(c)\,(b-a).
    $$

- 微积分基本定理（The Fundamental Theorem of Calculus, Part 1）：
  - 适用条件：$f$ 在 $[a,b]$ 上可积；定义 $F(x)=\int_a^x f(t)\,dt$。
  - 结论：
    - $F$ 在 $[a,b]$ 上连续；
    - 若 $f$ 在 $c\in(a,b)$ 处连续，则 $F'(c)=f(c)$。特别地，若 $f$ 在 $[a,b]$ 上连续，则 $F$ 在 $(a,b)$ 上可导且 $F'(x)=f(x)$。

- 微积分基本定理（The Fundamental Theorem of Calculus, Part 2）：
  - 适用条件：$f$ 在 $[a,b]$ 上连续；$F$ 为 $f$ 的一个原函数（$F'=f$ 于 $[a,b]$）。
  - 结论：
    $$
    \int_a^b f(x)\,dx \;=\; F(b)-F(a).
    $$
- 莱布尼兹法则（Leibniz's Rule）：
  - 适用条件：$f$ 在 $[a,b]$ 上连续；$u(x),v(x)$ 可导且取值落在 $[a,b]$。
  - 结论：
    $$
    \frac{d}{dx}\int_{u(x)}^{v(x)} f(t)\,dt
    = f\!\big(v(x)\big)\,v'(x) \;-\; f\!\big(u(x)\big)\,u'(x).
    $$
## 概念和记号

**Lower / Upper Sum**：取区间的最小值/最大值为代表做黎曼和。
**Average Value** $\text{av}(f) = \frac{1}{b-a}\int^{b}_{a}f(x)dx$ 。
**Improper Integral：**$\int^{\infty}_{a}f(x)dx=\lim_{ t \to \infty}\int^{t}_{a}f(x)dx$
**Centroid：** 几何中心，即质量均匀的物体的质心
**Improper Integral（反常积分）：**
1. Type 1： $\int_{b}^{\infty}ydx=\lim_{ a \to \infty } \int _b^a  ydx$
2. Type 2：定义在 $\left [ b,a \right)$ 上的函数 $y(x)$ ， $\int_{b}^a ydx= \lim_{ c \to a^- } \int_{b}^c ydx$

## 判断反常积分敛散性

1. 对于可积函数，积出来之后根据反常积分的定义，判断极限是否存在即可。
2. 若其恒小于一个收敛的反常积分，则该积分也收敛。
3. 若其恒大于一个发散的反常积分，则该积分也发散。
4. 若在端点处 $f$ 和 $g$ 同阶，即其比值的极限存在，则 $f$ 和 $g$ 同敛散。
    具体而言，比如要判断 $0$ 处端点是否可积，则可以用泰勒近似找一个同阶的幂函数，然后用下面的特例来判断即可；比如要判断无穷远处是否可积，则可以用抓大头的想法找一个同阶的幂函数，然后用下面的特例来判断即可。
5. 特例：
   $\int_{0}^t \frac{1}{x^p}dx$ 收敛当且仅当  $p<1$；$\int_{t}^{\infty} \frac{1}{x^p}dx$ 收敛当且仅当 $p>1$。

## 积分应用

求体积
- Washer Method: 对截面进行积分 $V=\int \text{截面面积}(x)dx$
- Shell Method: 旋转体可看成圆柱面的累加：$\int 2\pi \times\text{半径}(x)\times高度(x)dx$
  - 其中半径是 $x$ 到旋转轴的距离，高度为 $x$ 处的被旋转面的截线长
- Pappus’s Theorem for Volumes: $V=2\pi \rho A$，即旋转面面积乘质心到转轴的距离

求弧长
$$
\text{arc length} = \int^{b}_{a} \sqrt{ 1+ \left( \frac{dy}{dx} \right)^2 }dx
$$
$$
\text{arc length} = \int^{b}_{a} \sqrt{ 1+ \left( \frac{dx}{dy} \right)^2 }dy
$$
求旋转体的表面积
$$
A=\int^{b}_{a}2\pi f(x)\sqrt{ 1+[f'(x)]^2 } dx
$$
- Pappus’s Theorem for Surface Areas：$A=2\pi \rho L$，即弧长乘质心到转轴的距离

求平面图形质心
$$
\bar{x}= \frac{\int \tilde{x}dm}{\int dm},\bar{y}= \frac{\int \tilde{y}dm}{\int dm}
$$
- 若密度分布不均匀，有密度分布函数 $\delta$，则 $dm=\delta dA$。
- 若求两个函数包着的区域质心，即 $y=f(x)-g(x)$，则可以将 $\tilde{y}$ 写成 $\frac{1}{2}(f(x)+g(x))$：
  $$
\bar{x}= \frac{1}{M} \int \delta x (f(x)-g(x))dx
$$
$$
\begin{align}
\bar{y}&= \frac{1}{M} \int \frac{f(x)+g(x)}{2} \delta  (f(x)-g(x))dx\\
&= \frac{1}{M} \int \frac{\delta}{2}[f^2(x)-g^2(x)]dx
\end{align}
$$

求几何中心（即 $\delta$ 是常数的情况）
$$
\bar{x}= \frac{\int \tilde{x}dA}{A}, y=\frac{\int \tilde{y}dA}{A}
$$

求定积分的数值估计
**The Trapezoidal Rule：** 用梯形近似面积。

$$
T= \frac{\Delta x}{2}(y_{0}+2y_{1}+2y_{2}+\dots +2y_{n-1}+y_{n})
$$
误差：$$
|E_{T}| \leq \frac{M(b-a)^3}{12n^2}
$$
其中 $M$ 是 $f''$ 的上界。

**Simpson’s Rule：** 用抛物线近似面积。

$$
S=\frac{\Delta x}{3}(y_{0}+4y_{1}+2y_{2}+\dots+2y_{n-2}+4y_{n-1}+y_{n})
$$
其中 $n$ 为偶数。
误差：
$$
|E_{S}| \leq \frac{M(b-a)^5}{180n^4}
$$
其中 $M$ 是 $f^{(4)}$ 的上界。