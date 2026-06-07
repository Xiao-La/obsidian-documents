

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
也被称为**旋度的 k 分量** the k-component of the curl，记作 $(\text{curl } \mathbf{F})\cdot \mathbf{k}$
定义散度（Divergence）：
$$
\frac{ \partial M }{ \partial x } +\frac{ \partial N }{ \partial y } =\nabla \cdot \mathbf{F}
$$


格林公式（Green's Theorem）：在满足以下条件时：
- $C$ 必须是一条 **分段光滑（Piecewise smooth）** 的 **简单闭曲线（Simple closed curve）**。
- $C$ 所包围的区域 $R$ 必须是一个有界的闭区域，且其内部不能包含任何向量场无定义的奇点。
- 向量场 $\mathbf{F} = \langle M, N \rangle$ 的分量函数 $M(x, y)$ 和 $N(x, y)$，以及它们的一阶偏导数 $\frac{\partial M}{\partial x}, \frac{\partial M}{\partial y}, \frac{\partial N}{\partial x}, \frac{\partial N}{\partial y}$，在包含 $R$ 的某个**开区域**上必须是处处连续（Continuous）的。
- 曲线 $C$ 的方向必须是**正向（逆时针方向）**。判别法：当你沿着曲线 $C$ 的前进方向行走时，被包围的区域 $R$ 必须始终位于你的左手边。如果题目给出的是顺时针方向，积分结果必须乘以 $-1$。
那么有环流量-旋度（Circulation-Curl）形式（右边是旋度的 $k$ 分量）：
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

注意：做这样的换算，都要把积分的区域也做投影！

这里若 $z=f(x,y)$，则有 $\mathbf{r}=\left< u,v,f(u,v) \right>$，$\mathbf{r}_{u}=\left< 1,0,f_{x} \right>,\mathbf{r}_{v}=\left< 0,1,f_{y} \right>$，故而 $\mathbf{r}_{u}\times r_{v}=\left< -f_{x},-f_{y},1 \right>$（这里指向上面），有结论：
$$
d\sigma=\sqrt{ f_{x}^{2}+f_{y}^{2}+1 }dudv
$$
所以 
$$
A=\iint_{R} d\sigma=\iint_{R'} \sqrt{ f_{x}^{2}+f_{y}^{2}+1 }dxdy
$$
其中 $R'$ 为 $R$ 向 $xOy$ 平面投影得到。
另外，若 $F(x,y,z)=c$，可以推导出：
$$A = \iint_R \frac{|\nabla F|}{|\nabla F \cdot \mathbf{p}|} \, dA$$
其中 $\mathbf{p}=\mathbf{i},\mathbf{j}\text{ or }\mathbf{k}$，区域 $R$ 是一个垂直于 $\mathbf{p}$ 的平面（原来区域对这个平面做投影得到）。
这相当于投影到某个平面去求，代数推导是，比如假设 $z=h(x,y)$，则 $h_{x}= - \frac{F_{x}}{F_{z}},h_{y}=- \frac{F_{y}}{F_{z}}$，再代入：
$$
d\sigma=\sqrt{ \left( - \frac{F_{x}}{F_{z}} \right)^{2}+ \left( -\frac{F_{y}}{F_{z}} \right)^{2}+1 }dxdy= \frac{\lvert \nabla F \rvert }{\lvert F_{z} \rvert }dA
$$

总结来说，对于标量曲面积分：
- **形式 A：参数化曲面 $\mathbf{r}(u,v)$ 下**（最通用）
    $$\iint_S f(x,y,z) \, d\sigma = \iint_R f(\mathbf{r}(u,v)) \, |\mathbf{r}_u \times \mathbf{r}_v| \, du \, dv$$
    
- **形式 B：显式曲面 $z = g(x,y)$ 下**（最常见）
    
    $$\iint_S f(x,y,z) \, d\sigma = \iint_R f(x,y,g(x,y)) \, \sqrt{\left(\frac{\partial g}{\partial x}\right)^2 + \left(\frac{\partial g}{\partial y}\right)^2 + 1} \, dx \, dy$$
    
- **形式 C：隐式曲面 $F(x,y,z) = c$ 下**（投影法）
    
    $$\iint_S f(x,y,z) \, d\sigma = \iint_R f(x,y,z) \, \frac{|\nabla F|}{|\nabla F \cdot \mathbf{p}|} \, dA$$
    
    _(其中 $\mathbf{p}$ 是垂直于投影平面的单位法向量，通常是 $\mathbf{k}$)_


如果我们在曲面 $S$ 上可以选定一个**处处连续变化**的单位法向量场 $\mathbf{n}$，使得当你沿着曲面上的任何闭合回路绕一圈回来时，法向量**不会突然反转**，那么这个曲面就叫做**可定向曲面 (Orientable Surface)**。
**非定向曲面 (Non-orientable Surface)** 的代表——莫比乌斯带。

另外：对曲面求通量，比如有一个场 $\mathbf{F}$，则 Surface Integral of F over S： 
$$
\iint _{S}\mathbf{F}\cdot \mathbf{n}d\sigma=\iint_{S}\mathbf{F}\cdot \frac{\mathbf{r}_{u}\times \mathbf{r}_{v}}{\lvert \mathbf{r}_{u}\times \mathbf{r}_{v} \rvert }\lvert \mathbf{r}_{u}\times \mathbf{r}_{v} \rvert dudv=\iint_{S}\mathbf{F}\cdot(\mathbf{r}_{u}\times \mathbf{r}_{v})dudv
$$
这里的 $\mathbf{n}$ 的方向需要确定：
- **封闭曲面 (Closed Surfaces)** 
    封闭曲面默认只有两种定向：
    1. **向外定向 (Outward Orientation)**：法向量 $\mathbf{n}$ 处处指向几何体的**外部**（微积分和物理学默认的**正方向**）。
    2. **向内定向 (Inward Orientation)**：法向量 $\mathbf{n}$ 处处指向几何体的**内部**。
- **开放曲面 (Open Surfaces)** —— 如一个雷达锅盖、一个平坦圆盘。
    开放曲面没有绝对的内外之分，课本通过分量来定义：
    1. **向上定向 (Upward Orientation)**：法向量 $\mathbf{n}$ 的 $z$ 轴分量（即 $\mathbf{k}$ 分量）必须是**正数**。
    2. **向下定向 (Downward Orientation)**：法向量 $\mathbf{n}$ 的 $z$ 轴分量必须是**负数**。

类似于之前的多重积分，还可以求曲面的质量（$\iint \delta d\sigma$）和质心/转动惯量等。

### 斯托克斯定理

**斯托克斯定理（Stokes Theorem）：** 流量 - 旋度。
- 定义在一个场 $\mathbf{F}$ 中某点的旋度（Curl）为
$$
\nabla \times \mathbf{F}
$$
- 其中 $\nabla=\left< \frac{ \partial  }{ \partial x },\frac{ \partial  }{ \partial y },\frac{ \partial  }{ \partial z } \right>$ 为倒三角算符（Del Operator）。
- 那么斯托克斯定理指出：
$$
\oint_{C}\mathbf{F}\cdot d\mathbf{r}=\iint_{S}(\nabla \times \mathbf{F})\cdot \mathbf{n}d\sigma
$$
- 其中 $C$ 是一个闭合边界，$S$ 是以 $C$ 为边界的一个**分段光滑曲面**。
- 也就是说，以 $C$ 为边界的曲面的旋度场的通量，等于这个边界上的环流量。
- 那么对于一个复杂的曲面积分，可以改成算一个线积分，也可以换成一个简单的（有相同边界的）曲面的积分；对于一个复杂的环流量线积分，也可以换成一个简单曲面的旋度通量积分。

这里要注意，作为一个通量积分，仍然有：
$$
d\mathbf{S}=\mathbf{n}d\sigma= \frac{r_{u}\times r_{v}}{\lvert r_{u}\times r_{v} \rvert }\lvert r_{u}\times r_{v} \rvert =r_{u}\times r_{v}
$$
那么对于 $z=f(x,y)$，仍然有 $r_{u}\times r_{v}=(-f_{x},-f_{y},1)$。

如果曲面有洞：公式里的边界 $C$ 会变成**一组曲线的集合**：

$$\iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} \, d\sigma = \oint_{C_{\text{outer}}} \mathbf{F} \cdot d\mathbf{r} + \oint_{C_{\text{inner}}} \mathbf{F} \cdot d\mathbf{r}$$

根据右手螺旋定则，当曲面的法向量 $\mathbf{n}$ 向上时：
- **外边界（Outer boundary）**：必须是**逆时针（Counterclockwise）**方向。
- **内边界（Hole boundary）**：必须是**顺时针（Clockwise）**方向。
（保持曲面在左手边）

定理：**任何标量场的梯度场，其旋度必为零向量。**
$$\text{curl}(\text{grad } f) = \mathbf{0} \quad \text{或} \quad \nabla \times \nabla f = \mathbf{0} \quad \text{}$$
在**连通且单连通（Connected & Simply Connected）的开放区域 $D$** 中，TFAE：
1. $\mathbf{F}$ 是保守场（$\mathbf{F} = \nabla f$ 存在势函数）。
2. 沿着区域内任何闭合回路的线积分永远为 0（$\oint_C \mathbf{F} \cdot d\mathbf{r} = 0$）。
3. 向量场线积分严格路径无关（Path Independence）。
4. **区域内处处无旋：$\nabla \times \mathbf{F} = \mathbf{0}$**。


### 散度定理

> 1. 曲面 $S$ 必须是一个**分段平滑 (Piecewise smooth)** 的**闭合曲面 (Closed Surface)**（比如完整的球面、立方体表面、圆柱体含上下底面）。它包围着一个三维立体区域 $D$。
> 2. 法向量 $\mathbf{n}$ 必须是**向外定向的单位法向量 (Outward unit normal vector)**。
> 3. 向量场 $\mathbf{F} = M\mathbf{i} + N\mathbf{j} + P\mathbf{k}$ 的三个分量在区域 $D$ 及其边界 $S$ 上必须有**连续的一阶偏导数**。

**【三维散度定义】**：在三维空间某一点上，流体向外膨胀的微观速率为：
$$\text{div } \mathbf{F} = \nabla \cdot \mathbf{F} = \frac{\partial M}{\partial x} + \frac{\partial N}{\partial y} + \frac{\partial P}{\partial z}$$
**散度定理**（Divergence Theorem）：

$$\iint_S \mathbf{F} \cdot \mathbf{n} \, d\sigma = \iiint_D \nabla \cdot \mathbf{F} \, dV$$
左边是一个面 $S$ 的通量，右边是内部体积 $D$ 中的散度。
推论：如果一个向量场 $\mathbf{G}$ 是另一个场的旋度（即 $\mathbf{G} = \text{curl } \mathbf{F}$），那么 $\mathbf{G}$ 穿过任何“**闭合曲面** $S$”的向外总通量必定为零。
$$\iint_S (\nabla \times \mathbf{F}) \cdot \mathbf{n} \, d\sigma = 0$$
如果向量场 $\mathbf{F}$ 具有连续的二阶偏导数，那么它的旋度的散度必定为零，即 $\text{div}(\text{curl } \mathbf{F}) = \nabla \cdot (\nabla \times \mathbf{F}) = 0$。

总结：
“保守场 $\nabla f$ 必定无旋（$\nabla \times \nabla f = 0$）”
“旋度场 $\nabla \times \mathbf{F}$ 必定无源（$\nabla \cdot (\nabla \times \mathbf{F}) = 0$）”

（考点：对于一个场 $\mathbf{G}$，是否存在某个向量场 $\mathbf{F}$，使得 $\mathbf{G} = \nabla \times\mathbf{F}$？只需要去算算 $\nabla \cdot \mathbf{G}$，只要它不为零，就不可能存在 $\mathbf{F}$）。
### 总结


| **定理名称**                                                  | **维度与几何体**                               | **内部积分 (区域上的“导数”累积)**                                                                                                      | **=**   | **边界积分 (边界上的“原函数”表现)**                                                                                         |
| --------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| **微积分基本定理** (Fundamental Theorem)                         | **1 维**<br><br>  <br><br>线段区间 $[a,b]$    | $\displaystyle\int_a^b \color{red}{f'(x)} \, dx$<br><br>  <br><br>_(内部导数的线积分)_                                             | **$=$** | $\displaystyle \color{blue}{f(b) - f(a)}$<br><br>  <br><br>_(两端点的值相减)_                                         |
| **格林定理 (环流-旋度)**<br><br>  <br><br>(Green's - Circulation) | **2 维**<br><br>  <br><br>平坦闭区域 $R$       | $\displaystyle\iint_R \color{red}{(\nabla \times \mathbf{F}) \cdot \mathbf{k}} \, dA$<br><br>  <br><br>_(内部微观旋度的面积分)_      | **$=$** | $\displaystyle\oint_C \color{blue}{\mathbf{F} \cdot d\mathbf{r}}$<br><br>  <br><br>_(边界曲线上的总环流做功)_             |
| **格林定理 (通量-散度)**<br><br>  <br><br>(Green's - Flux)        | **2 维**<br><br>  <br><br>平坦闭区域 $R$       | $\displaystyle\iint_R \color{red}{(\nabla \cdot \mathbf{F})} \, dA$<br><br>  <br><br>_(内部微观散度的面积分)_                        | **$=$** | $\displaystyle\oint_C \color{blue}{\mathbf{F} \cdot \mathbf{n}} \, ds$<br><br>  <br><br>_(穿过边界曲线的总外通量)_        |
| **斯托克斯定理**<br><br>  <br><br>(Stokes' Theorem)             | **3 维 (曲面)**<br><br>  <br><br>空间弯曲曲面 $S$ | $\displaystyle\iint_S \color{red}{(\nabla \times \mathbf{F}) \cdot \mathbf{n}} \, d\sigma$<br><br>  <br><br>_(曲面微观旋度的面积分)_ | **$=$** | $\displaystyle\oint_C \color{blue}{\mathbf{F} \cdot d\mathbf{r}}$<br><br>  <br><br>_(边界铁丝圈上的总环流做功)_            |
| **散度定理 (高斯公式)**<br><br>  <br><br>(Divergence Theorem)     | **3 维 (实体)**<br><br>  <br><br>实心立体空间 $D$ | $\displaystyle\iiint_D \color{red}{(\nabla \cdot \mathbf{F})} \, dV$<br><br>  <br><br>_(立体微观散度的体积分)_                       | **$=$** | $\displaystyle\iint_S \color{blue}{\mathbf{F} \cdot \mathbf{n}} \, d\sigma$<br><br>  <br><br>_(穿过边界闭合曲面的总外通量)_ |