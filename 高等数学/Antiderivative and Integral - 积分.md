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
## 积分技巧

### 杂类

定积分：注意是否区间关于 0 对称而且被积函数是奇函数。

### 换元（Substitution）

### 分部积分（Integration by Parts）