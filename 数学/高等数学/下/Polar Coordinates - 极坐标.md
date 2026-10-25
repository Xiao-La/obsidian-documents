## 参数方程（Parametrized Coordinates）

$x=f(t), y=g(t)$

三维坐标系中直线的向量方程：$\mathbf{r}(t)=\mathbf{r}_{0}+t\mathbf{v}$，对应的参数方程：$x=x_{0}+tv_{1},y=y_{0}+tv_{2},z=z_{0}+tv_{3}$。
三维坐标系中平面的方程：设法向量为 $\mathbf{n}=(A,B,C)$，且 $P_{0}(x_{0},y_{0},z_{0})$ 在平面内，则它们确定的平面为 $\mathbf{n}\cdot \overrightarrow{P_0P}=0$，也就是 $A(x-x_{0})+B(y-y_{0})+C(z-z_{0})=0$。
一般来说平面的方程可以写成 $Ax+By+Cz=D$，它的一个法向量就是 $(A,B,C)$，它过的一个点满足 $D=Ax_{0}+By_{0}+Cz_{0}$。

【不考】
平面光滑曲线的曲率（Curvature）定义为
$$
\kappa=\lvert \frac{\mathrm{d}\mathbf{T}}{\mathrm{d}s}\rvert
$$
其中 $s$ 是弧长，$\mathbf{T}$ 是曲线的单位切向量。
计算公式：若 $\mathbf{r}(t)$ 是一个光滑曲线，则：
$$
\kappa=\frac{1}{\lvert \mathbf{v}\rvert } \lvert \frac{\mathrm{d}\mathbf{T}}{\mathrm{d}t}\rvert
$$
其中 $\mathbf{v}=\mathbf{r}'(t), \mathbf{T}= \frac{\mathbf{v}}{\lvert \mathbf{v}\rvert }$ 是曲线的单位切向量。
在 $\kappa>0$ 的点，定义光滑曲线的 **主单位法向量（Principal Unit Normal Vector）**：
$$
\mathbf{N}=\frac{1}{\kappa} \frac{\mathrm{d}\mathbf{T}}{\mathrm{d}s}
$$
这里 $\frac{\mathrm{d}\mathbf{T}}{\mathrm{d}s}$ 指向了 $\mathbf{T}$ 转向的方向，因此垂直于切向量。再用 $\kappa$ 归一化。
对于参数方程 $\mathbf{r}(t)$，这个量可以这样计算：
$$
\mathbf{N}=\frac{\mathrm{d}\mathbf{T} / \mathrm{d}t}{\lvert \mathrm{d}\mathbf{T} / \mathrm{d}t \rvert }
$$

其中 $\mathbf{v}=\mathbf{r}'(t), \mathbf{T}= \mathbf{v} / \lvert \mathbf{v} \rvert$。
定义曲率半径（The radius of curvature）：
$$
\rho=\frac{1}{\kappa}
$$
对于 $y=f(x)$ ：
- 令 $\mathbf{r}(t)=t \mathbf{i}+f(t)\mathbf{j}$。
- 那么 $\mathbf{v}=\mathbf{i}+f'(t)\mathbf{j}$。
- 那么 $\lvert \mathbf{v} \rvert=\sqrt{ 1+[f'(t)]^{2} }$，且有 $\mathbf{T}=\mathbf{v} / \lvert \mathbf{v} \rvert$。
- 最终可以推出  $$\kappa=\frac{1}{\lvert \mathbf{v} \rvert} \lvert \frac{\mathrm{d}\mathbf{T}}{\mathrm{d}t}\rvert = \frac{\lvert y'' \rvert}{(1+(y')^{2})^{3/2}}$$
### 求闭合曲线面积（简单闭曲线，沿逆时针方向）

$$
A=\frac{1}{2}\oint(x\,\mathrm{d}y-y\,\mathrm{d}x)
=\frac{1}{2}\oint\left( x \frac{\mathrm{d}y}{\mathrm{d}t} -y \frac{\mathrm{d}x}{\mathrm{d}t}\right)\,\mathrm{d}t
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
上面的正切关系要求 $x\neq0$，且不能单独确定极角所在象限。完整的坐标转换关系为
$$
y=r\sin\theta
$$
$$
x=r\cos\theta
$$

### 求切线斜率

$$
\frac{\mathrm{d}y}{\mathrm{d}x}= \frac{\frac{\mathrm{d}y}{\mathrm{d}\theta}}{\frac{\mathrm{d}x}{\mathrm{d}\theta}}=\frac{r'(\theta)\sin\theta+r(\theta)\cos\theta}{r'(\theta)\cos\theta-r(\theta)\sin\theta}
$$
### 求面积

$$
A=\frac{1}{2}\int_{\theta_{1}}^{\theta_{2}} r^2\,\mathrm{d}\theta
$$
### 求弧长

$$
L= \int_{\theta_{1}}^{\theta_{2}} \sqrt{ r^{2}+\left( \frac{\mathrm{d}r}{\mathrm{d}\theta} \right)^{2} }\,\mathrm{d}\theta
$$

