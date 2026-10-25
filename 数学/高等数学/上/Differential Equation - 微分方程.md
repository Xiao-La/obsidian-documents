前置：[[Antiderivative and Integral - 积分]]
常微分方程（Ordinary Differential Equation）指含 $\frac{d^ny}{\mathrm{d}x^n}$ 的关于函数 $y=f(x)$ 的方程。

### 解析解

对一阶常微分方程（First-Order ODEs），有一些特定的技巧。
#### 分离变量后积分
$$
A(y) \frac{\mathrm{d}y}{\mathrm{d}x}=B(x)\implies \int A(y)\,\mathrm{d}y=\int B(x)\,\mathrm{d}x
$$
#### 构造乘积
对形如
$$
\frac{\mathrm{d}y}{\mathrm{d}x}+P(x)y=Q(x)
$$
的一阶常微分方程，可以构造一个 $v(x)$ ，使得等式两边同乘 $v(x)$ 后，左边为乘积的微分公式：
$$
v(x) \left( \frac{\mathrm{d}y}{\mathrm{d}x}+P(x)y \right)=\frac{\mathrm{d}}{\mathrm{d}x}(v(x)y)
$$
那么可以解得
$$
v(x)y=\int v(x)Q(x)\,\mathrm{d}x
$$
这里选取的 $v(x)$ 只需满足 $v'(x)=v(x)P(x)$，即
$$v(x)=e^{\int P(x)\,\mathrm{d}x}$$
### 数值解

**欧拉方法（Euler's Method）：**
用已知的 $y=f(x)$ 上的一个点，带入一阶常微分方程来估计附近的其他点： $\Delta y=\frac{\mathrm{d}y}{\mathrm{d}x}\Delta x$，其中 $\Delta x$ 叫做估计的步长 (Step Size)。

### 杂类

自治微分方程 （Autonomous Differential Equation），指  $\frac{\mathrm{d}y}{\mathrm{d}x}=f(y)$。
使得这里的 $f(y)=0$ 的根叫做平衡点（Equilibrium Points）。
若平衡点 $y_{0}$ 满足 在 $y_0$ 的左侧邻域内 $f(y)>0$、右侧邻域内 $f(y)<0$，则 $y_{0}$ 被称为稳定（Stable）平衡点，因为稍微偏离 $y_{0}$ 的 $y$ 都会回到 $y_{0}$ 。
若左侧 $f(y)<0$、右侧 $f(y)>0$，则有不稳定（Unstable）平衡点，稍微偏离 $y_{0}$ 的 $y$ 都会越跑越远。