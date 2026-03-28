## 参数方程（Parametrized Coordinates）

$x=f(t), y=g(t)$ 

### 求闭合曲线面积

$$
A=\frac{1}{2}\oint(xdy-ydx)
=\frac{1}{2}\oint\left( x \frac{dy}{dt} -y \frac{dx}{dt}\right)dt
$$

## 极坐标
笛卡尔坐标（Cartesian Coordinates）用笛卡尔平面的 $x,y$ 坐标记作 $(x,y)$。
极坐标（Polar Coordinates）用到原点的距离 $r$ 和极角 $\theta$ 记作 $(r,\theta)$。
有如下关系：
$$
r^2=x^2+y^2
$$
$$
\tan\theta=\frac{y}{x}
$$
或，等价的
$$
y=r\sin\theta
$$
$$
x=r\cos\theta
$$

### 求切线斜率

$$
\frac{dy}{dx}= \frac{\frac{dy}{d\theta}}{\frac{dx}{d\theta}}=\frac{r'(\theta)\sin\theta+r(\theta)\cos\theta}{r'(\theta)\cos\theta-r(\theta)\sin\theta}
$$
### 求面积

$$
A=\frac{1}{2}\int_{\theta_{1}}^{\theta_{2}} r^2d\theta
$$
### 求弧长

$$
L= \int_{\theta_{1}}^{\theta_{2}} \sqrt{ r^{2}+\left( \frac{dr}{d\theta} \right)^{2} } d\theta
$$

