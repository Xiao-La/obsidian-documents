
实值函数（Real-valued Function）$f$ 将 $n$ 元组 $(x_{1},x_{2},\dots,x_{n})$ 映射到一个实数 $w$。称 $w$ 为因变量/输入变量（Dependent Variable/Output Variable），$x_{1},x_{2},\dots,x_{n}$ 为自变量/输出变量（Independent Variables/Input Variables）。

对于 $\mathbb{R}^{2}$ 上的区域/集合 $R$，定义它的内点（Interior Point）为使得以这个点为原心的小圆只包含 $R$ 中的点；定义它的边界点（Boundary Point）为使得以这个点为原心的小圆中同时包含 $R$ 中和 $R$ 外的点。$R$ 的内点构成的集合称为这个区域的内部（Interior）。边界点构成的集合称为这个区域的边界（Boundary）。包含了所有内点的区域定义为是开的（Open）。包含了所有边界点的区域定义为是闭的（Closed）。
（类似的，把小圆换成小球，就是 $\mathbb{R}^{3}$ 中的情况）

定义区域有界（Bounded）若它落在一个有限半径的圆内，反之称为无界（Unbounded）。

定义函数 $f(x,y)$ 的等值线（Level Curve）为满足 $f(x,y)=c$ 的点 $(x,y)$ 构成的集合。在 $\mathbb{R}^{3}$ 中的点 $(x,y,f(x,y))$ 构成的集合为这个二元函数的图象（Graph），也就是曲面 $z=f(x,y)$。

定义极限 
$$
\lim_{ (x,y) \to (x_{0},y_{0}) }f(x,y)=L 
$$
为 $\forall\varepsilon, \exists \delta$ 使得
$$
0<\sqrt{ (x-x_{0})^{2}+(y-y_{0})^{2} }<\delta \implies |f(x,y)-L|<\varepsilon
$$
这个极限运算的性质也非常好，可以和加/减/乘/除/数乘/幂/开方军算交换位置。
定义二元函数 $f(x,y)$ 在 $(x_{0},y_{0})$ 处连续：
$$ f(x_{0},y_{0})=\lim_{ (x,y) \to (x_{0},y_{0}) }f(x,y)$$
前提是左右两边都存在。

两条路径测试（Two-Path Test）：若对函数 $f(x,y)$，有两条不同的 $(x,y)$ 趋向于 $(x_{0},y_{0})$ 的路径 $g(x,y)=0$ 使得算出的极限不同，则极限 $\lim_{ (x,y) \to (x_{0},y_{0}) }f(x,y)$ 不存在。
- 从所有直线趋近某个点得到的极限相同，并不能说明极限存在。

复合函数的连续性：若 $f$ 在 $(x_{0},y_{0})$ 处连续，$g$ 在 $f(x_{0},y_{0})$ 处连续，则 $g\circ f$ 在 $(x_{0},y_{0})$ 处连续。
以上这些对于二元函数的定义对于多元函数也类似。

对于 $n$ 元函数 $f(x_{1},x_{2},\dots,x_{n})$ ，定义它在 $(t_{1},t_{2},\dots,t_{n})$ 处对 $x_{i}$ 的偏导数（Partial Derivatives w.r.t. $x_{i}$）为
$$
\left.\frac{ \partial f }{ \partial x_{i} }\right|_{(t_{1},t_{2},\dots,t_{n})} =\lim_{ h \to 0 }  \frac{f(t_{1},t_{2},\dots,t_{i}+h, \dots, t_{n})-f(t_{1},t_{2},\dots, t_{i}, \dots,t_{n})}{h}
$$

