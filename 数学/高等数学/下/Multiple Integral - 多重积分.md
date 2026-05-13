
二重积分（Double Integral）用黎曼和定义：
$$
\lim_{ n \to \infty } \sum_{i=1}^n f(x_{i},y_{i})\Delta A_{i}:=\iint _{R}f(x,y)dxdy
$$
有时 $dxdy$ 写成 $dA$。**它的几何意义是曲面 $z=f(x,y)$ 下方的体积。**
要计算二重积分，我们把它转化为累次积分（Iterated integral/Repeated integral），也就是切成横条或竖条计算面积，再把面积积分成体积。这种方法就是富比尼定理（Fubini's Theorem）：
- 若 $f(x,y)$ 在区域 $R$ 内连续，若区域 $R$ 用 $a\leq x\leq b, g_{1}(x)\leq y\leq g_{2}(x)$ 定义，且 $g_{1},g_{2}$ 在 $\left[ a,b \right]$ 上连续，则有
$$
\iint_{R}f(x,y)dA=\int _{a}^b\int_{g_{1}(x)}^{g_{2}(x)}f(x,y)dydx
$$
- 上面这种方法相当于竖切，横切也类似，就是先对 $x$ 积分再对 $y$ 积分。
二重积分对数乘/加减是可交换顺序的；若一个函数在区域内恒大于另一个函数，则对它们做二重积分仍然更大；若把区域拆成两个不相交的区域，则积分可以拆成两个区域的积分相加。

在极坐标中：
$$
dA=dxdy=r d\theta dr, y=r\sin\theta, x=r\cos\theta
$$
在极坐标中往往是先积 $r$ 再积 $\theta$ 的。每个 $dA$ 看成小弧长 $r d\theta$ 和长度 $r$ 变化量的乘积。
若积分区域与圆有关，或被积函数中有 $x^{2}+y^{2} ,\arctan\left( \frac{y}{x} \right)$ 之类的东西，考虑用极坐标来做。有时，也可以将极坐标转回直角坐标。

由于是定积分，有如下技巧：
- 若积分区域关于 $x$ 轴对称，又有 $f(x,y)=-f(x,-y)$（关于 $y$ 是奇函数），则积分值为 $0$。关于 $y$ 轴对称也类似。
- 若积分区域关于 $x,y$ 轮换对称，那么可以尝试将积分中的变量 $x,y$ 互换，积分值不变。再与原来的积分进行加减或许可以化简积分。

三重积分（Triple Integral）：
$$
\iiint_{D} f(x,y,z)dxdydz
$$
有时 $dxdydz$ 写作 $dV$。几何意义可以解释为，密度函数为 $f(x,y,z)$ 在某个区域内的质量。
计算方式还是写成累次积分。这里累次积分的上下限，例如先积 $z$，找到它的上下顶，观察积分区域在 $xOy$ 平面的投影，这个二维的区域就转化成了二重积分做过的情况，可以找到 $x,y$ 的积分上下限。

计算三重积分，可以先观察一下 $dV$ 和 $f$ 是否可以只用一个变量表示，这样转化为一个一元变量定积分：区域如果能在三维坐标系中精确画出来，就很可能可以切成一个个薄片来算。

柱坐标（Cylindrical Coordinates）$(r,\theta,z)$：和极坐标相同，对于固定的 $z$，可以替换 $x=r\cos\theta,y=r\sin\theta,dxdydz=r d r d \theta dz$。

球坐标(Spherical Coordinates) $(\rho,\theta,\phi)$：
$$
\begin{cases}
x=\rho\sin \phi \cos\theta \\
y=\rho\sin \phi \sin\theta \\
z=\rho\cos \phi
\end{cases}
$$
积分区域与球面有关时，考虑用球坐标。
$$
dxdydz=\rho^{2}\sin \phi d \rho d\theta d\phi
$$
往往是先积 $\rho$ ，再积 $\phi$ ，最后积 $\theta$。

对于一般的换元
$$
x=g(u,v),y=h(u,v)
$$
定义雅各比行列式（Jacobian determinant）为
$$
J(u,v)=\left| \begin{matrix} \frac{ \partial x }{ \partial u }  & \frac{ \partial x  }{ \partial v } \\
\frac{ \partial y }{ \partial u }  & \frac{ \partial y }{ \partial v }   \end{matrix} \right| =\frac{ \partial x }{ \partial u } \frac{ \partial y }{ \partial v } -\frac{ \partial x }{ \partial v } \frac{ \partial y }{ \partial u } 
$$
记作
$$
J(u,v)= \frac{\partial(x,y)}{\partial(u,v)}
$$
那么有
$$
dxdy=|J(u,v)|dudv
$$
（理解：对于新坐标系下的某一点 $(u_{0},v_{0})$，它由 $(x_{0},y_{0})$ 在经过变换 $x=g(u,v),y=h(u,v)$ 得到，它附近的一个极小的平行四边形可以看作由原坐标系下的一个单位正方形做 **线性变换** 得到，而这个变换导致的面积变化也就是乘上 $J(u,v)$。考虑 $x,y$ 是 $u,v$ 的线性组合的情况，就容易理解了。）
更高维的情况也类似。

应用：三维空间中的质量和一阶矩（First moment）
$$
M=\iiint_{D}\delta dV
$$
以及关于 $yz$ 平面的一阶矩
$$
M_{yz}=\iiint_{D}x\delta dV
$$
那么质心的 $x$ 坐标为
$$
\bar{x}= \frac{M_{yz}}{M}
$$

三维空间中的转动惯量/质量惯性矩/二阶矩（Moments of inertia/Second Moment）（关于某个直线 $L$）
$$
I=\iiint_{D}r^{2}dm=\iiint _{D}r^{2}\delta dV
$$
其中 $r$ 为点 $(x,y,z)$ 到 $L$ 的距离。用 $I_{x},I_{y},I_{z}$ 表示关于 $x,y,z$ 轴的转动惯量。


