前置： [[Limit and Derivative - 极限与导数]]
## 概念与定义

定积分的定义：对黎曼和 $\sum^{n}_{i=1}f\left( a+ \frac{b-a}{n} i \right) \times \frac{b-a}{n}$ 取极限。
**Lower / Upper Sum**：取区间的最小值/最大值为代表做黎曼和。
**Average Value** $\text{av}(f) = \frac{1}{b-a}\int^{b}_{a}f(x)\,\mathrm{d}x$ 。
**Centroid：** 几何中心，即质量均匀的物体的质心
**Improper Integral（反常积分）：**
1. Type 1： $\int_{b}^{\infty}y\,\mathrm{d}x=\lim_{ a \to \infty } \int _b^a  y\,\mathrm{d}x$
2. Type 2：定义在 $\left [ b,a \right)$ 上的函数 $y(x)$ ， $\int_{b}^a y\,\mathrm{d}x= \lim_{ c \to a^- } \int_{b}^c y\,\mathrm{d}x$

## 定理

- 积分中值定理（First Mean Value Theorem for Integrals）：若 $f$ 在 $[a,b]$ 上连续，则存在 $c\in(a,b)$，使
  $$\int_a^b f(x)\,\mathrm{d}x=f(c)(b-a).$$
- 微积分基本定理（The Fundamental Theorem of Calculus, Part 1）：若 $f$ 在 $[a,b]$ 上连续，$F(x)=\int_a^x f(t)\,\mathrm{d}t$，则
  $$F'(x)=f(x),\quad a<x<b.$$
- 微积分基本定理（Part 2）：若 $f$ 连续且 $F'=f$，则
  $$\int_a^b f(x)\,\mathrm{d}x=F(b)-F(a).$$
- 莱布尼兹法则（Leibniz's Rule）：
  - 适用条件：$f$ 在 $[a,b]$ 上连续；$u(x),v(x)$ 可导且取值落在 $[a,b]$。
  - 结论：
    $$
    \frac{\mathrm{d}}{\mathrm{d}x}\int_{u(x)}^{v(x)} f(t)\,\mathrm{d}t
    = f\!\big(v(x)\big)\,v'(x) \;-\; f\!\big(u(x)\big)\,u'(x).
    $$

## 判断反常积分敛散性

1. 对于可积函数，积出来之后根据反常积分的定义，判断极限是否存在即可。
2. 对非负被积函数，若被积函数不大于一个反常积分收敛的非负函数，则该积分也收敛。
3. 对非负被积函数，若被积函数不小于一个反常积分发散的非负函数，则该积分也发散。
4. 若在端点处 $f$ 和 $g$ 同阶，即其比值趋于有限的正数（非负函数），则 $f$ 和 $g$ 同敛散。
    具体而言，比如要判断 $0$ 处端点是否可积，则可以用泰勒近似找一个同阶的幂函数，然后用下面的特例来判断即可；比如要判断无穷远处是否可积，则可以用抓大头的想法找一个同阶的幂函数，然后用下面的特例来判断即可。
5. 特例：
   $\int_{0}^t \frac{1}{x^p}\,\mathrm{d}x$ 收敛当且仅当  $p<1$；$\int_{t}^{\infty} \frac{1}{x^p}\,\mathrm{d}x$ 收敛当且仅当 $p>1$。

## 积分应用

求体积
- Washer Method: 对截面进行积分 $V=\int \text{截面面积}(x)\,\mathrm{d}x$
- Shell Method: 旋转体可看成圆柱面的累加：$\int 2\pi \times\text{半径}(x)\times高度(x)\,\mathrm{d}x$
  - 其中半径是 $x$ 到旋转轴的距离，高度为 $x$ 处的被旋转面的截线长
- Pappus’s Theorem for Volumes: $V=2\pi \rho A$，即平面区域面积乘质心走的距离（旋转轴在该平面内且不穿过区域内部）

求弧长
$$
\text{arc length} = \int^{b}_{a} \sqrt{ 1+ \left( \frac{\mathrm{d}y}{\mathrm{d}x} \right)^2 }\,\mathrm{d}x
$$
$$
\text{arc length} = \int^{b}_{a} \sqrt{ 1+ \left( \frac{\mathrm{d}x}{\mathrm{d}y} \right)^2 }\,\mathrm{d}y
$$
求旋转体的表面积
$$
A=\int^{b}_{a}2\pi \lvert f(x)\rvert \sqrt{ 1+[f'(x)]^2 }\,\mathrm{d}x
$$
- Pappus’s Theorem for Surface Areas：$A=2\pi \rho L$，即弧长乘质心走的距离（旋转轴在曲线平面内且不穿过曲线）

求平面图形质心
$$
\bar{x}= \frac{\int \tilde{x}\,\mathrm{d}m}{\int\,\mathrm{d}m},\bar{y}= \frac{\int \tilde{y}\,\mathrm{d}m}{\int\,\mathrm{d}m}
$$
- 若密度分布不均匀，有密度分布函数 $\delta$，则 $\mathrm{d}m=\delta\,\mathrm{d}A$。
- 若密度仅依赖 $x$（均匀密度也适用），求两个函数包着的区域质心，其竖直截条高度为 $y=f(x)-g(x)$，则可以将 $\tilde{y}$ 写成 $\frac{1}{2}(f(x)+g(x))$：
  $$
\bar{x}= \frac{1}{M} \int \delta x (f(x)-g(x))\,\mathrm{d}x
$$
$$
\begin{aligned}
\bar{y}&= \frac{1}{M} \int \frac{f(x)+g(x)}{2} \delta  (f(x)-g(x))\,\mathrm{d}x\\
&= \frac{1}{M} \int \frac{\delta}{2}[f^2(x)-g^2(x)]\,\mathrm{d}x
\end{aligned}
$$

求几何中心（即 $\delta$ 是常数的情况）
$$
\bar{x}= \frac{\int \tilde{x}\,\mathrm{d}A}{A}, \bar y=\frac{\int \tilde{y}\,\mathrm{d}A}{A}
$$

求定积分的数值估计
**The Trapezoidal Rule：** 用梯形近似面积。

$$
T= \frac{\Delta x}{2}(y_{0}+2y_{1}+2y_{2}+\dots +2y_{n-1}+y_{n})
$$
误差：$$
\lvert E_{T}\rvert  \leq \frac{M(b-a)^3}{12n^2}
$$
其中 $M$ 是 $\lvert f''\rvert $ 的上界。

**Simpson’s Rule：** 用抛物线近似面积。

$$
S=\frac{\Delta x}{3}(y_{0}+4y_{1}+2y_{2}+\dots+2y_{n-2}+4y_{n-1}+y_{n})
$$
其中 $n$ 为偶数。
误差：
$$
\lvert E_{S}\rvert  \leq \frac{M(b-a)^5}{180n^4}
$$
其中 $M$ 是 $\lvert f^{(4)}\rvert $ 的上界。