
## 定义与概念

### 多元函数及其极限

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

**两条路径测试（Two-Path Test）**：若对函数 $f(x,y)$，有两条不同的 $(x,y)$ 趋向于 $(x_{0},y_{0})$ 的路径 $g(x,y)=0$ 使得算出的极限不同，则极限 $\lim_{ (x,y) \to (x_{0},y_{0}) }f(x,y)$ 不存在。
- 从所有直线趋近某个点得到的极限相同，并不能说明极限存在。

极坐标代换：当出现 $x^{2}+y^{2}$，或分子次数大于分母次数时，或想要证明极限为 $0$ 时，考虑令 $x=r\cos\theta,y=r\sin\theta$，则 $\lim_{ (x,y) \to (0,0) }f(x,y)=\lim_{ r \to 0 }f(r,\theta)$。
- 注意，这里不能简单地把 $\theta$ 视为常数然后求 $r\to 0$ 处的极限，因为这样相当于只走直线路径 $y=\tan\theta$。可以先猜测极限为 $L$，然后再用 $\varepsilon-\delta$ 语言严格证明 $\forall\varepsilon>0, \exists \delta>0,s.t.$ $$
|r|<\delta \implies|f(r,\theta)-L|<\varepsilon
$$
### 求二元多项式之比的极限

面对 $\lim_{(x,y)\to(0,0)} \frac{P(x,y)}{Q(x,y)}$：

例： $\frac{x^{2}y^{2}}{x^{2}+y^4}$。
针对多项式**次数不平衡**（比如 $x^2+y^4$），我们不能简单地看绝对次数，而要**配平分母**：
1. **配平分配权重：** 分母为 $x^2 + y^4$，令 $x^2 \sim y^4$，即说明 $x$ 的地位相当于 $y^2$。我们给变量分配权重：$x$ 的阶数取 $2$，$y$ 的阶数取 $1$。
2. **计算分母总阶数：** 此时分母 $x^2 + y^4$ 的每一项阶数都是 $4$。
3. **计算分子总阶数：** 分子逼近为 $x^2y^2$，其阶数为 $2 \times 2 + 1 \times 2 = 6$。
4. **比较分子与分母的阶数判断结论：**
    *   **如果分子阶数 > 分母阶数（例如本题 $6 > 4$）：** 极限**通常存在且为 0**（接下来用夹逼定理放缩证明）。
    *   **如果分子阶数 $\le$ 分母阶数：** 极限**通常不存在**（接下来用两路径测试证明）。

> **分子阶数 $\leq$ 分母阶数的情况**
> 对于分子阶数 $\le$ 分母阶数的情况，利用上面配平的思路。
> 例如，如果是求 $\lim \frac{xy^2}{x^2+y^4}$，分子阶数是 $2+2=4$，等于分母阶数 $4$，预测极限不存在。取路径 $x = cy^2$，原式变为 $\frac{cy^4}{c^2y^4+y^4} = \frac{c}{c^2+1}$，结果与 $c$ 有关。

>  **分子阶数 > 分母阶数的情况**
1.  **拆分出有界项：** 凑出一个能在 $(0,0)$ 附近有界的项。
    *   技巧：局部 $\le$ 整体。因为 $A^2, B^2 \ge 0$，所以 $A^2 \le A^2 + B^2$ 。
    *   推出基础不等式：$\frac{x^2}{x^2+y^4} \le 1$ 以及 $\frac{y^4}{x^2+y^4} \le 1$。
2.  **均值不等式。

**特例：分母非正定**（分母为 0 不对应 $x=0,y=0$，而对一整个曲线成立），那么极限大概率不存在，因为只要贴近这个曲线再加上一个高阶无穷小，就能使极限不存在。例如 $\frac{x^{3}+y^{3}}{x^{2}+y}$，只要令 $y=-x^{2}+x^{3}$，则变成 $\frac{x^{3}+(-x^{2}+x^{3})^{3}}{x^{3}}\to 1$, 令 $y=-x^2+x^4$  就趋于无穷。

### 连续与可微

复合函数的连续性：若 $f$ 在 $(x_{0},y_{0})$ 处连续，$g$ 在 $f(x_{0},y_{0})$ 处连续，则 $g\circ f$ 在 $(x_{0},y_{0})$ 处连续。
以上这些对于二元函数的定义对于多元函数也类似。

对于 $n$ 元函数 $f(x_{1},x_{2},\dots,x_{n})$ ，定义它在 $(t_{1},t_{2},\dots,t_{n})$ 处对 $x_{i}$ 的偏导数（Partial Derivatives w.r.t. $x_{i}$）为
$$
\left.\frac{ \partial f }{ \partial x_{i} }\right|_{(t_{1},t_{2},\dots,t_{n})} =\lim_{ h \to 0 }  \frac{f(t_{1},t_{2},\dots,t_{i}+h, \dots, t_{n})-f(t_{1},t_{2},\dots, t_{i}, \dots,t_{n})}{h}
$$

混合偏导定理（Mixed Derivative Theorem）：若 $f(x,y)$ 及其偏导数 $f_x, f_y, f_{xy}, f_{yx}$ 在包含点 $(a,b)$ 的某个开区域内处处有定义，且它们在 $(a,b)$ 处都连续，则混合偏导相等：$f_{xy}(a,b)=f_{yx}(a,b).$ 
- 也就是说，若偏导数都连续，求偏导的顺序可以交换。

定义可微（Differentiable）：函数 $z=f(x,y)$ 在 $(x_0,y_0)$ 处可微，当且仅当 $f_x(x_0,y_0)$ 与 $f_y(x_0,y_0)$ 存在，且增量 $\Delta z$ 满足 $\Delta z=f_x(x_0,y_0)\Delta x+f_y(x_0,y_0)\Delta y+\varepsilon_1\Delta x+\varepsilon_2\Delta y$ 其中当 $\Delta x,\Delta y\to 0$ 时，$\varepsilon_1,\varepsilon_2\to 0$。（高阶无穷小量）
定义函数可微（Differentiable function）：若 $f$ 在其定义域内每一点都可微，则称 $f$ 可微，并称其图形为光滑曲面（smooth surface）。

二元函数增量定理（Increment Theorem for Functions of Two Variables）推论：
-  若 $f(x,y)$ 的偏导 $f_x,f_y$ 在开区域 $R$ 内处处连续，则 $f$ 在 $R$ 的每一点都可微。

多元函数在某个点可微，可以推出它在这一点连续。
要证明不可微，可以通过证明不连续。

### 链式法则

链式法则（Chain Rule）：
- 一元自变量 + 二个中间变量：若 $w=f(x,y)$ 可微，且 $x=x(t),\ y=y(t)$ 是关于 $t$ 的可微函数，则复合函数 $w=f(x(t),y(t))$ 关于 $t$ 可微，且有 $$\frac{dw}{dt}=\frac{\partial f}{\partial x}\frac{dx}{dt}+\frac{\partial f}{\partial y}\frac{dy}{dt}.$$
- 一元自变量 + 多个中间变量也类似： $w=f(x_{1},x_{2} ,\dots,x_{n}),x_{1}=x_{1}(t),x_{2}=x_{2}(t)\dots,x_{n}=x_{n}(t)$
$$\implies \frac{dw}{dt}=\sum \frac{ \partial f }{ \partial x_{i} } \frac{dx_{i}}{dt}$$
- 二个自变量 + 三个中间变量：设 $w=f(x,y,z)$，且 $x=g(r,s),\ y=h(r,s),\ z=k(r,s)$；若这四个函数均可微，则 $w$ 关于 $r,s$ 有偏导，并满足
$$\frac{\partial w}{\partial r}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial r}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial r}+\frac{\partial w}{\partial z}\frac{\partial z}{\partial r},$$ $$\frac{\partial w}{\partial s}=\frac{\partial w}{\partial x}\frac{\partial x}{\partial s}+\frac{\partial w}{\partial y}\frac{\partial y}{\partial s}+\frac{\partial w}{\partial z}\frac{\partial z}{\partial s}.$$
隐函数求导公式（Implicit Differentiation）：设 $F(x,y)$ 可微，且方程 $F(x,y)=0$ 将 $y$ 定义为 $x$ 的可微函数；则在任意满足 $F_y\neq 0$ 的点处，$$\frac{dy}{dx}=-\frac{F_x}{F_y}.$$
这个可以从链式法则直接推导出来。

### 方向导数与梯度

二元函数 $f(x,y)$ 在 $P_{0}(x_{0},y_{0})$ 处，在单位向量 $\mathbf{u}=u_{1}\mathbf{i}+u_{2}\mathbf{j}$ 的方向的导数定义为：
$$
\left( \frac{df}{ds} \right)_{\mathbf{u},P_{0}}= \lim_{ s \to 0 } \frac{f(x_{0}+su_{1}, y_{0}+su_{2})-f(x_{0},y_{0})}{s} 
$$
也记作 $(D_{\mathbf{u}}f)_{P_{0}}$。
通过链式法则，由于 $x=x_{0}+su_{1}, y=y_{0}+su_{2}$ 我们可以把它拆成：
$$
\begin{align}
(D_{\mathbf{u}}f)_{P_{0}}&= \left( \frac{df}{ds} \right)_{\mathbf{u},P_{0}} \\
&= \left(\frac{ \partial f }{ \partial x }\right)_{P_{0}} \frac{dx}{ds}+\left(\frac{ \partial f }{ \partial y }\right)_{P_{0}} \frac{dy}{ds} \\
&= \left(\frac{ \partial f }{ \partial x }\right)_{P_{0}} u_{1}+\left(\frac{ \partial f }{ \partial y }\right)_{P_{0}}u_{2} \\
&=\left( \frac{ \partial f }{ \partial x } \mathbf{i}+\frac{ \partial f }{ \partial y } \mathbf{j} \right) \left( u_{1}\mathbf{i}+u_{2}\mathbf{j} \right) 
\end{align}
$$
这里定义 $f(x,y)$ 的梯度（Gradient） 为向量
$$
\nabla f=\frac{ \partial f }{ \partial x } \mathbf{i}+\frac{ \partial f }{ \partial y } \mathbf{j}
$$
（更高维度也可以类似定义）
那么有
$$
D_{\mathbf{u}}f=\nabla f\cdot \mathbf{u}=\left| \nabla f \right| \cos\theta
$$
所以，$\theta=0$ 时 $f$ 增长最快，$\theta=\pi$ 时 $f$ 衰减最快，$\theta=\frac{\pi}{2}$ 时 $f$ 不改变。
向量 $\nabla f$ 与曲线 $z=f(x,y)$ 的等值线（Level Curve）成法向（Normal）（与方向向量垂直）。所以可以写出等值线的切线：
$$
f_{x}(x-x_{0})+f_{y}(y-y_{0})=0
$$
并且，$\nabla$ 算子的加/减/数乘/乘/除的规则都和求导算子 $\frac{d}{dx}$ 类似。

路径导数的链式法则：若 $\mathbf{r}(t)=x(t)\mathbf{i}+y(t)\mathbf{j}+z(t)\mathbf{j}$ 为一条平滑路径，$f(\mathbf{r}(t))$ 是路径上的一个函数，则有
$$
\frac{d}{dt}f(\mathbf{r}(t))=\nabla f(\mathbf{r}(t))\cdot \mathbf{r}'(t)
$$

切平面：从上面的链式法则，若左边为零，也就是说，$\mathbf{r}(t)$ 为等值面 $f(x,y,z)=c$ 上的一个路径，则 $f(\mathbf{r}(t))$ 为常数，那么右边的两个向量 $\nabla f(\mathbf{r}(t))$ 与 $\mathbf{r}'(t)$ 垂直。故而定义等值面 $f(x,y,z)=c$  在 $P_{0}(x_{0},y_{0},z_{0})$ 的切平面（Tangent Plane）为经过 $P_{0}$，以 $(\nabla f)_{P_{0}}$  为法向量的平面：
$$
f_{x}(x-x_{0})+f_{y}(y-y_{0})+f_{z}(z-z_{0})=0
$$
法线：经过 $P_{0}$ 且平行与 $(\nabla f)_{P_{0}}$ 的直线
$$
x=x_{0}+f_{x}t, y= y_{0}+f_{y}t, z=z_{0}+f_{z}t
$$
要求曲面 $z=f(x,y)$ 的切面和法线，可以转化为 $F(x,y,z)=f(x,y)-z=0$ 然后用上面的公式。

### 多元函数的线性化

可以估计多元函数在某个方向的增量：
$$
df=(D_{\mathbf{u}}f)_{P_{0}} ds=((\nabla f)_{{P_{0}}} \cdot \mathbf{u})s
$$
从而有线性化 (Linearization)：
$$
L(x,y)=f(x_{0},y_{0})+f_{x}(x-x_{0})+f_{y}(y-y_{0})
$$
用 $L(x,y)$ 来估计 $f(x,y)$ 称为标准线性估计（Standard Linear Approximation）
在一个矩形区域中，如果 $|f_{x x}|,|f_{y y}|, |f_{xy}|$ 有上界 $M$，则误差 $E(x,y)=f(x,y)-L(x,y)$ 满足
$$
|E(x,y)|\leq \frac{1}{2}M(|x-x_{0}|+|y-y_{0}|)^{2}
$$
在线性化中，称全微分（Total Differential）为
$$
df=f_{x}dx+f_{y}dy
$$
更多元的情况也类似。

### 极值

一阶导测试（First Derivative Test）：若二元函数 $f(x,y)$ 在某内点处存在极值，且该点偏导存在，则该点处 $f_{x}=0,f_{y}=0$。

定义二元函数的关键点（Critical Point）为 $f_{x},f_{y}$ 全为 $0$ 或至少有一个不存在的情况。

定义二元函数的鞍点（Saddle Point）为对任意以它为中心的圆盘中，都存在定义域内值更小的点和值更大的点。

二阶导测试（Second Derivative Test）： 定义 $f$ 的判别式（discriminant）或海森（Hessian）为海森矩阵的行列式：
$$
D=f_{x x}f_{yy}-f_{x y}^{2}= \left| \begin{matrix} f_{x x} & f_{x y} \\
f_{xy}  & f_{yy} \end{matrix} \right|
$$
那么，若已知某点处 $f_{x}=f_{y}=0$：
- 若 $D>0$：
  - 若 $f_{x x}>0$，则该点为极小值点。
  - 若 $f_{x x}<0$，则该点为极大值点。
- 若 $D<0$：该点为鞍点。
- 若 $D=0$：测试失效。

若要找全局的最值，则应列出所有关键点处的值以及边界上的极值，然后找出最小和最大的。

### 拉格朗日乘子

拉格朗日乘子法（The Method of Lagrange Multipliers）：在条件 $g(x,y,z)=0$ 的限制下求 $f(x,y,z)$ 的极值，则在极值点处，有方程
$$
\nabla f=\lambda \nabla g
$$
对 $\lambda \in \mathbb{R}$ 成立。这里 $\nabla g\neq 0$。 $\lambda$ 就是拉格朗日乘子。只要结合 $g(x,y,z)=0$ 解方程即可。

几何解释：考察任意 $g=0$ 上的曲线 $C:\mathbf{r}(t)$，若  $f$ 在它上面某点取得极值，则有 $\nabla f\cdot \mathbf{r}'(t)=0$，也就是，$\nabla f$ 垂直于这一点处曲线 $C$ 的切向量。另外，在这一点也有 $\nabla g$  垂直于 $g=0$。所以考察 $f$ 在 $g=0$ 上的最值，有 $\nabla f$ 与 $\nabla g$ 共线。这就说明了拉格朗日乘子法的有效性。

如果有两个限制条件 $g_{1}=0,g_{2}=0$，那么要满足：
$$
\nabla f=\lambda \nabla g_{1}+\mu \nabla g_{2}
$$
几何解释：在 $g_{1}=0$，$g_{2}=0$ 的交线 $C$ 上， $\nabla g_{1}$ 与 $C$ 垂直，$\nabla g_{2}$ 也与 $C$ 垂直。于是 $\nabla f$ 要处在它们构成的平面内，才能使 $\nabla f$ 垂直于曲线 $C$ 的切向量。


### 二元函数的泰勒公式

在 $(a,b)$ 处的 $n+1$ 阶泰勒公式：
![[Partial Derivatives -  偏导数.png]]
把这里的 $h,k$ 换成 $x,y$，可以写出在原点处的 $n+1$ 阶泰勒公式：
![[Partial Derivatives -  偏导数-1.png]]
也就是说
$$
f(x,y)=\left( \sum_{k=0}^{n} \frac{1}{n!}\left( x \frac{ \partial  }{ \partial x } +y \frac{ \partial  }{ \partial y }  \right)^{k}f   \right)+ \left( \frac{1}{(n+1)!}\left( x\frac{ \partial  }{ \partial x } +y\frac{ \partial  }{ \partial y }  \right)^{n+1} f\right)_{(cx, cy)} 
$$ 
