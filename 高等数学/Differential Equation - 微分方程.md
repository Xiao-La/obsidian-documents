常微分方程（Ordinary Differential Equation）指含 $\frac{d^ny}{dx^n}$ 的关于函数 $y=f(x)$ 的方程。

### 解析解

对一阶常微分方程（First-Order ODEs），一个特定的解法是分离变量后积分：
$$
A(y) \frac{dy}{dx}=B(x)\implies \int A(y)dy=\int B(x)dx
$$
### 数值解

**欧拉方法（Euler's Method）：**
用已知的 $y=f(x)$ 上的一个点，带入一阶常微分方程来估计附近的其他点： $\Delta y=\frac{dy}{dx}\Delta x$，其中 $\Delta x$ 叫做估计的步长 (Step Size)。
