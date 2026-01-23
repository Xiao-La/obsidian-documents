前置：[[Antiderivative and Integral - 积分]]
常微分方程（Ordinary Differential Equation）指含 $\frac{d^ny}{dx^n}$ 的关于函数 $y=f(x)$ 的方程。

### 解析解

对一阶常微分方程（First-Order ODEs），有一些特定的技巧。
#### 分离变量后积分 
$$
A(y) \frac{dy}{dx}=B(x)\implies \int A(y)dy=\int B(x)dx
$$
#### 构造乘积
对形如
$$
\frac{dy}{dx}+P(x)y=Q(x) , \ (Q(x)\neq 0)
$$
的一阶常微分方程，可以构造一个 $v(x)$ ，使得等式两边同乘 $v(x)$ 后，左边为乘积的微分公式：
$$
v(x) \left( \frac{dy}{dx}+P(x)y \right)=\frac{d}{dx}(v(x)y)
$$
那么可以解得
$$
v(x)y=\int v(x)Q(x)dx
$$
这里选取的 $v(x)$ 只需满足 $v'(x)=v(x)P(x)$，即
$$v(x)=e^{\int P(x)dx}$$
### 数值解

**欧拉方法（Euler's Method）：**
用已知的 $y=f(x)$ 上的一个点，带入一阶常微分方程来估计附近的其他点： $\Delta y=\frac{dy}{dx}\Delta x$，其中 $\Delta x$ 叫做估计的步长 (Step Size)。

### 杂类

自治微分方程 （Autonomous Function），指  $\frac{dy}{dx}=f(y)$。
使得这里的 $f(y)=0$ 的根叫做平衡点（Equilibrium Points）。
若平衡点 $y_{0}$ 满足 $f(y_{0}^-)>0, f(y_{0}^+)<0$，则 $y_{0}$ 被称为稳定（Stable）平衡点，因为稍微偏离 $y_{0}$ 的 $y$ 都会回到 $y_{0}$ 。
反之，则有不稳定（Unstable）平衡点，稍微偏离 $y_{0}$ 的 $y$ 都会越跑越远。