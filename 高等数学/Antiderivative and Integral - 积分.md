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

## 积分应用

求体积
- 对截面进行积分 $V=\int \text{截面面积}(x)dx$
- 旋转体可看成圆柱面的累加：$\int 2\pi \times\text{半径}(x)\times高度(x)dx$
  - 其中半径是 $x$ 到旋转轴的距离，高度为 $x$ 处的被旋转面的截线长

求弧长
$$
\text{arc length} = \int^{b}_{a} \sqrt{ 1+ \left( \frac{dy}{dx} \right)^2 }dx
$$