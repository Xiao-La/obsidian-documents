

## 线积分与向量场

线积分（Line Integral）：沿着某条曲线 $C$ 做函数 $f$ 的积分：
$$
\int_{C}fds
$$
计算方法：
- 将 $f$ 参数化为 $\mathbf{r}(t)$。
- 则 $ds=|\mathbf{v}(t)|dt$，其中 $\mathbf{v}(t)=\mathbf{r}'(t)$。
- 最后变成计算一元积分 $\int f(\mathbf{r}(t))|\mathbf{v}(t)|dt$。
用线积分可以计算线质量，转动惯量等。

向量场（Vector Field）：一个函数，给空间一定区域内，每一点赋予一个矢量。
梯度场（Gradient Field）：$\nabla f$。
于是可以求类似于做功的积分，也叫流量积分（Flow Integral）：
$$
\int_{C} \mathbf{F}\cdot d\mathbf{r}
$$
这里为向量的点乘。计算方法同样是参数化，转化为：
$$
\int_{C} \mathbf{F}(\mathbf{r}(t))\cdot\mathbf{r}'(t)dt
$$
若 $\mathbf{F}=\left< M,N \right>$ 也可以进一步写成点乘 $\mathbf{F}\cdot \left< dx,dy \right>$ 的形式
$$
\int_{C}(Mdx+Ndy)
$$
若 $C$ 为闭合曲线，则也把这个流量积分叫做环流量（Circulation）。
另外若 $\mathbf{F}=\left< M,N \right>$ 则某一闭合曲线 $C$ 中的通量（Flux）：
$$
\oint_{C} \mathbf{F}\cdot \mathbf{n}ds=\oint_{C}(Mdy-Ndx)
$$
可以写成点乘 $\mathbf{F}\cdot \left< dy,-dx \right>$。 计算方式同样可以参数化。

保守场 （Conservative Field）：在保守场 $\mathbf{F}$ 中，沿着一条路径的积分之和起点和终点有关，也就是说，存在一个标量的势函数（Potential Function） $f$，使得
$$
\mathbf{F}=\nabla f
$$
**（保守场是梯度场）**
那么有线积分基本定理（Fundamental Theorem of Line Integrals）：任意路径 $C:A\to B$，有
$$
\int_{C}\mathbf{F}d\mathbf{r}=f(B)-f(A)
$$

定义连通区域（Connected Domain）：完整的一块，可以从任意一点沿着光滑曲线走到另一点。
定义单连通区域（Simply Connected Domain）：连通且没有洞，也就是说可以缩点：**在区域里随便画一个闭合的圈 (loop)，这个圈一定能像橡皮筋一样一直缩小到一个点，且在缩小的过程中**绝对不会碰到区域的外部。

判定保守场的一个必要条件：对于向量场 $\mathbf{F}=\left< P,Q \right>$，若它是保守场，则必有
$$
\frac{ \partial {P} }{ \partial y } =\frac{ \partial Q }{ \partial x } 
$$
进一步的，若区域是**单连通的**，则这个条件是充要的。
定义：一个式子 $Mdx+Ndy+Pdz$ 为恰当（Exact）微分形式，若存在 $f$ 使得：
$$
df=Mdx+Ndy+Pdz=\frac{ \partial f }{ \partial x } dx+\frac{ \partial f }{ \partial y } dy+\frac{ \partial f }{ \partial z } dz
$$
这里 $f$ 就是势函数。
对恰当微分形式进行线积分，由线积分基本定理，只需终点处的势函数值减去起点处的势函数值。
若单连通，同样有一个保守场充要条件：
$$
\frac{ \partial M }{ \partial y } =\frac{ \partial N }{ \partial x } ,\frac{ \partial M }{ \partial z } =\frac{ \partial P }{ \partial x } ,\frac{ \partial N }{ \partial z } =\frac{ \partial P }{ \partial y } 
$$
保守场的一个充要条件：对任意回路积分为 $0$。

定义场 $\mathbf{F}=\left< M,N \right>$ 的流量密度（circulation density）：
$$
\frac{ \partial N }{ \partial x } -\frac{ \partial M }{ \partial y } = (\nabla \times\mathbf{F}) \cdot \mathbf{k}
$$
也被称为旋度的 k 分量 the k-component of the curl，记作 $(\text{curl } \mathbf{F})\cdot \mathbf{k}$
定义散度（Divergence）：
$$
\frac{ \partial M }{ \partial x } +\frac{ \partial N }{ \partial y } =\nabla \cdot \mathbf{F}
$$


格林公式（Green's Theorem）：在满足以下条件时：
- $C$ 必须是一条 **分段光滑（Piecewise smooth）** 的 **简单闭曲线（Simple closed curve）**。
- $C$ 所包围的区域 $R$ 必须是一个有界的闭区域，且其内部不能包含任何向量场无定义的奇点。
- 向量场 $\mathbf{F} = \langle M, N \rangle$ 的分量函数 $M(x, y)$ 和 $N(x, y)$，以及它们的一阶偏导数 $\frac{\partial M}{\partial x}, \frac{\partial M}{\partial y}, \frac{\partial N}{\partial x}, \frac{\partial N}{\partial y}$，在包含 $R$ 的某个**开区域**上必须是处处连续（Continuous）的。
- 曲线 $C$ 的方向必须是**正向（逆时针方向）**。判别法：当你沿着曲线 $C$ 的前进方向行走时，被包围的区域 $R$ 必须始终位于你的左手边。如果题目给出的是顺时针方向，积分结果必须乘以 $-1$。
那么有环流量-旋度（Circulation-Curl）形式：
$$\oint_{C}\mathbf{F}\cdot \mathbf{T}ds=\oint_C M \, dx + N \, dy = \iint_R \left( \frac{\partial N}{\partial x} - \frac{\partial M}{\partial y} \right) dA$$
这个旋度可以写成
$$
 (\nabla \times \mathbf{F})\cdot \mathbf{k}=\left| \begin{matrix} \frac{ \partial  }{ \partial x }  & \frac{ \partial  }{ \partial y }  \\
M & N \end{matrix} \right|
$$
或通量-散度（Flux-Divergence）形式：
$$\oint_{C}\mathbf{F}\cdot \mathbf{n}ds=\oint_C M \, dy - N \, dx = \iint_R \left( \frac{\partial M}{\partial x} + \frac{\partial N}{\partial y} \right) dA$$
这个散度可以写成
$$
\nabla \cdot \mathbf{F}
$$

我们令 $M=\frac{1}{2}x,N=\frac{1}{2}y$，那么某个区域的面积有这样的计算公式
$$
A=\iint_{R} dA=\frac{1}{2}\oint_{C}xdy-ydx
$$

## 面积分

沿着某个曲面做积分，由于曲面有两个自由度，其参数化需要两个变元，曲面的参数方程可以写成：
$$
\mathbf{r}(u,v)=x(u,v)\mathbf{i}+y(u,v)\mathbf{j}+z(u,v)\mathbf{k}
$$
曲面平滑（Smooth）的定义：
1. 偏导向量 $\mathbf{r}_u = \frac{\partial \mathbf{r}}{\partial u}$ 和 $\mathbf{r}_v = \frac{\partial \mathbf{r}}{\partial v}$ 必须处处**连续 (Continuous)** 。 
2. 它们的叉乘（向量积）**$\mathbf{r}_u \times \mathbf{r}_v$ 在区域内部绝不能为零向量 $\mathbf{0}$** 。
在线积分中，弧长与参数的微小量的换算为 $ds=\lvert \mathbf{r}'(t) \rvert dt$。在面积分中，考虑在两个参量上走一小步，形成的微小平行四边形面积为两个切向量的叉乘，故而面积与参数的微小量的换算为：
$$
d\sigma=\lvert \mathbf{r}_{u}\times \mathbf{r}_{v} \rvert  du dv
$$
其中  $\mathbf{r}_{u},\mathbf{r}_{v}$ 为 $\mathbf{r}$ 对 $u,v$ 求偏导的结果。

这里若 $z=f(x,y)$，则有 $\mathbf{r}=\left< u,v,f(u,v) \right>$，$\mathbf{r}_{u}=\left< 1,0,f_{x} \right>,\mathbf{r}_{v}=\left< 0,1,f_{y} \right>$，故而 $\mathbf{r}_{u}\times r_{v}=\left< -f_{x},-f_{y},1 \right>$，有结论：
$$
d\sigma=\sqrt{ f_{x}^{2}+f_{y}^{2}+1 }dudv
$$
所以 
$$
A=\iint_{R} d\sigma=\iint_{R} \sqrt{ f_{x}^{2}+f_{y}^{2}+1 }dxdy
$$
另外，若 $F(x,y,z)=c$，可以推导出：
$$A = \iint_R \frac{|\nabla F|}{|\nabla F \cdot \mathbf{p}|} \, dA$$
其中 $\mathbf{p}=\mathbf{i},\mathbf{j}\text{ or }\mathbf{k}$。
这相当于投影到某个平面去求，代数推导是，比如假设 $z=h(x,y)$，则 $h_{x}= - \frac{F_{x}}{F_{z}},h_{y}=- \frac{F_{y}}{F_{z}}$，再代入：
$$
d\sigma=\sqrt{ \left( - \frac{F_{x}}{F_{z}} \right)^{2}+ \left( -\frac{F_{y}}{F_{z}} \right)^{2}+1 }dxdy= \frac{\lvert \nabla F \rvert }{\lvert F_{z} \rvert }dA
$$


另外：对曲面求通量，有
$$
\iint _{S}\mathbf{F}\cdot \mathbf{n}d\sigma=\iint_{S}\mathbf{F}\cdot \frac{\mathbf{r}_{u}\times \mathbf{r}_{v}}{\lvert \mathbf{r}_{u}\times \mathbf{r}_{v} \rvert }\lvert \mathbf{r}_{u}\times \mathbf{r}_{v} \rvert dudv=\iint_{S}\mathbf{F}\cdot(\mathbf{r}_{u}\times \mathbf{r}_{v})dudv
$$


斯托克斯定理（Stokes Theorem）：
- 定义在一个场 $\mathbf{F}$ 中某点的旋度（Curl）为
$$
\nabla \times \mathbf{F}
$$
- 其中 $\nabla=\left< \frac{ \partial  }{ \partial x },\frac{ \partial  }{ \partial y },\frac{ \partial  }{ \partial z } \right>$ 为倒三角算符（Del Operator）。
- 那么斯托克斯定理指出：
$$
\oint_{C}\mathbf{F}\cdot d\mathbf{r}=\iint_{S}(\nabla \times \mathbf{F})\cdot \mathbf{n}d\sigma
$$
- 其中 $C$ 是一个闭合边界，$S$ 是以 $C$ 为边界的一个曲面。
- 也就是说，以 $C$ 为边界的曲面的旋度场的通量，等于这个边界上的环流量。
- 那么对于一个复杂的曲面积分，可以改成算一个线积分，也可以换成一个简单的（有相同边界的）曲面的积分；对于一个复杂的环流量线积分，也可以换成一个简单曲面的旋度通量积分。