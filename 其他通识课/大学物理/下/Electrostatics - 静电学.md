## 库仑定律（Coulomb's Law）

元电荷 $e=1.60 \times 10^{-19}\,\text{C}$，宏观的电荷 $q=ne$，其中 $n$ 为整数。

电子的移动能使物体带电，且通过感应可以充电（Charging by induction）。

材料可以分为导体（Conductors），绝缘体（Insulators），半导体（Semiconductors）。

**库仑定律**：
$$
F=k \frac{|q_{1}q_{2}|}{r^{2}}
$$
其中电荷的单位为库伦（Coulomb, $1\text{C}=1\text{A}\cdot\text{S}$）。
并有 $k=\frac{1}{4\pi \varepsilon_{0}}(=8.99\times 10^9\, \text{N}\times\text{m}^2\text{/C}^2)$，其中 $\varepsilon_{0}$ 为真空介电常数。
矢量形式：
$$
\vec{F}\text{(on 2)}=k \frac{q_{1}q_{2}}{|\vec{r_{2}}-\vec{r_{1}}|^3} (\vec{r_{2}}-\vec{r_{1}})
$$
## 电场 （Electric Field）

场（Field）是一种具有能量，质量和动量的客观存在的物质。
用场线（Field Lines）可以描述场的方向，也可用线的疏密，定性描述场的强度。
电荷之间的相互作用并非超距作用，而是**电场**的作用。
定义**电场强度**：
$$
\vec{E}=\frac{\vec{F}}{q_{0}}
$$
其中 $q_{0}$ 为一个正的试探电荷，$\vec{F}$ 为它受到的电场力的作用。

求解一般带电物体产生的电场，可以定义电荷的线密度 $\lambda$ /面密度 $\sigma$ /体密度 $\rho$，将 $dQ$ 写成与坐标有关的形式，然后写出各方向上电场的分量，就会变成一个积分问题。
复杂积分考试时通常会给公式。

常见公式：
$$
E= \frac{\sigma}{2\varepsilon_{0}}\left( 1- \frac{z}{\sqrt{ z^{2}+R^{2} }} \right)\text{(charged disk)}
$$
$$
E=\frac{qz}{4\pi \varepsilon_{0}(x^{2}+R^{2})^{3/2}}\text{(charged ring)}
$$


电场也满足球壳定理。

孤立导体的性质：
- 导体的内部电场为 $0$。
- 导体的电荷都分布在表面。
- 导体四周的电场与导体表面垂直。
### 电偶极子（Electric Dipole）

电偶极子指一对大小相等，方向相反，距离为 $d$ 的电荷体系。
定义电偶极矩（Electric Dipole Moment）$|\vec{p}|=qd$，方向由负电荷指向正电荷。
当距离电偶极子很远的时候：
$$
E=\frac{1}{2\pi \varepsilon_{0}} \frac{p}{z^{3}}\text{(electric dipole)}
$$

![[Electrostatics - 静电学.png|298]]
则可以推出：
- 当 $y\gg d$ 时， $E(y)= \frac{\vec{p}}{2\pi \varepsilon_{0}y^3}$。
- 当 $x\gg d$ 时，$E(x)=- \frac{\vec{p}}{4\pi \varepsilon_{0}x^3}$。 
并且有 $\vec{\tau}=\vec{p}\times \vec{E}$，$U=-W=-\int \tau d\theta=-\vec{p}\cdot \vec{E}$。
微波炉的原理就是水分子作为电偶极子会在电场中旋转产生动能。

### 电通量（Electric Flux）

对于一个面，可以定义它的**面积矢量（Surface Area）**，矢量的大小为面积的大小，方向为法线的方向之一。我们规定：
- 若面是有向的线围成的，则使用右手定则确定矢量方向。
- 若面围成了一块体积，则矢量的方向由体的内部指向外部。

从而可以定义电通量
$$
\Phi = \vec{E} \cdot \vec{A}=|\vec{E}||\vec{A}|\cos \theta
$$
对于一个闭合曲面（高斯曲面，Gaussian Surface），里面放一个正电荷，则总电通量必然为正；放一个负电荷，则总电通量必然为负。
$$
\Phi = \oint \vec{E} \cdot d\vec{A}
$$
对于一个球：
$$
\Phi=\oint \frac{1}{4\pi\varepsilon_{0}} \frac{q}{r^{2}}dA=\frac{1}{4\pi \varepsilon_{0}} \frac{q}{r^{2}}4\pi r^{2}=\frac{q}{\varepsilon_{0}}
$$
进一步推广，得到 **高斯定律（Gauss's Law）**：对于高斯曲面，它内部所包的电荷为 $q_{\text{enc}}$。则
$$
\Phi= \frac{q_{\text{enc}}}{\varepsilon_{0}}
$$
或
$$
\varepsilon_{0} \oint \vec{E}\cdot d\vec{A}=q_{\text{enc}}
$$
![[Electrostatics - 静电学-1.png|364]]
例如无穷大均匀带电面的电场，满足 $q_{\text{enc}}=\sigma A=\varepsilon_{0} \oint EdA=\varepsilon_{0} E (2A)\implies E=\frac{\sigma}{2\varepsilon_{0}}$。
从而平行板电容器的电场 $E=\frac{\sigma}{\varepsilon_{0}}$。 
导体表面的电场也为 $E=\frac{\sigma}{\varepsilon_{0}}$ 。
高斯定律主要适用于对称/近似无穷大的情况。

对称：球对称，柱对称，平移对称，面对称。对不同的面选不一样的高斯曲面，一般是一个球或者圆柱。

注意导体内部的电场恒为 $0$，也就是说，任取一个导体内的高斯曲面，它所包的电荷量都为 $0$。

### 电势（Electric Potential）

电势能 $\Delta U=-W=-q_{0}\int_{i}^f \vec{E}\cdot d\vec{s}$。
定义电势 $V=\frac{U}{q_{0}}$，故有 $\Delta V=-\int_{i}^f \vec{E}\cdot d\vec{s}$。电势的单位为伏特（Volt）。
定义无穷远处的电势为 $0$，且大地的电势为 $0$，则：
$$
V=-\int_{\infty}^f  \vec{E} \cdot d\vec{s}
$$
从这个式子可以得到：
$$
\vec{E_{s}}=-\frac{\partial V}{\partial s}
$$
也就是说，电场方向与电势降低的方向相同。在三维空间中：
$$
\vec{E}=-\left( \frac{\partial}{\partial x} \hat{i}+ \frac{\partial}{\partial y}\hat{j}+\frac{\partial}{\partial z}\hat{k}\right)V
=- \vec{\nabla} V
$$
点电荷的电势：
$$
V=\frac{1}{4\pi \varepsilon_{0} } \frac{q}{r}
$$
那么求电势的两种方法：
- 若电场不好求，用叠加原理： $$
V=\int dV=\frac{1}{4\pi\varepsilon_{0}} \int \frac{dq}{r}
$$
- 若电场好求，用定义：$$
V=-\int_{\infty}^f  \vec{E} \cdot d\vec{s}
$$
电势相等的点组成**等势面（Equipotential surface）**，等势面与电场线垂直。
由于金属内部电场为 $0$，金属都是**等势体**。

假设某导体由一个小球（$Q_{1},R_{1}$）和一个大球（$Q_{2},R_{2}$）组成，则有
$$
\begin{cases}
\frac{kQ_{1}}{R_{1}}=\frac{kQ_{2}}{R_{2}} (\text{电势相等}) \\
4\pi R_{1}^2 E_{1}=\frac{Q_{1}}{\varepsilon_{0}}(\text{对小球列高斯定理}) \\
4\pi R_{2}^{2}E_{2}=\frac{Q_{2}}{\varepsilon_{0}}(\text{对大球列高斯定理})
\end{cases}
$$
则可以推出 $E_{1}R_{1}=E_{2}R_{2}$，且 $\sigma_{1}R_{1}=\sigma_{2}R_{2}$。可以理解为，导体中，表面曲率半径小的地方，所带的电荷更多，电场也更大。

#### 电偶极子的电势

![[Electrostatics - 静电学-2.png|204]] 
$$
\begin{align}
V&=V_{(+)}+V_{(-)}=k\left( \frac{q}{r_{(+)}}-\frac{q}{r_{(-)}} \right) \\
&=kq \frac{r_{(-)}-r_{(+)}}{r_{(+)}r_{{(-)}}}\\
&\xlongequal{r\gg d} kq \frac{d\cos\theta}{r^{2}}\\
&= \frac{1}{4\pi\varepsilon_{0}} \frac{p\cos\theta}{r^{2}}
\end{align}
$$
## 电容器（Capacitor）

电容（Capacitance）$C$ 的单位为法拉（Farad, F）。定义式：
$$
C=\frac{q}{V}
$$
可以推导出平行板电容器的电容 $C=\frac{\varepsilon_{0}A}{d}$，圆柱形电容器的电容 $C=2\pi\varepsilon_{0} \frac{L}{\ln(b / a)}$，球形电容器的电容 $C=4\pi\varepsilon_{0} \frac{ab}{b-a}$。当球形电容器 $b\to \infty$，相当于一个孤立的球体，那么 $C=4\pi\varepsilon_{0} a$。
电容器的串联：

$$
\begin{align}
&V_{\text{1}}+V_{\text{2}}=V\\
&Q_{1}= Q_{2}=Q \\
\implies & \frac{1}{C_{1}}+\frac{1}{C_{2}}=\frac{1}{C}
\end{align}
$$
多个电容的串联：$\frac{1}{C}=\sum \frac{1}{C_{i}}$。
并联：
$$
\begin{align}
&V_{1}=V_{2}=V \\
&Q_{1}+Q_{2}=Q \\
\implies &C_{1}+C_{2}=C
\end{align}
$$
多个电容的并联：$C=\sum C_{i}$。
电容器储存的电势能：
$$
\begin{align}
&W=\int vdq=\frac{1}{C}\int qdq=\frac{Q^{2}}{2C}\\
\implies& U=\frac{Q^{2}}{2C}=\frac{1}{2}CV^{2}=\frac{1}{2}QV
\end{align}
$$
能量密度 
$$
u=\frac{U}{Ad}=\frac{\frac{1}{2}CV^{2}}{Ad}=\frac{1}{2}\varepsilon_{0}E^{2}
$$
![[Electrostatics - 静电学-3.png]]
若存在电介质（dielectric）：
$$
E= \frac{\sigma-\sigma_{i}}{\varepsilon_{0}}=\frac{E_{0}}{\frac{\sigma}{\sigma-\sigma_{i}}}=\frac{E_{0}}{\kappa}
$$
其中 $\kappa=\frac{\sigma}{\sigma-\sigma _{i}}>1$ 为介电常数（dielectric constant）。 
将原来公式中的 $\varepsilon_{0}$ 替换为 $\kappa\varepsilon_{0}$ 即为有电介质的情况。
例如，有电介质的情况下的高斯定理：
$$
\varepsilon_{0} \oint \kappa \vec{E}\cdot d\vec{A}=q(\text{free charge})
$$
有电介质的电容：$C=\kappa  \frac{Q}{V}$。
注意是 $V$ 不变还是 $Q$ 不变。
- 若 $V$ 不变，$C=\kappa C_{0}$，$Q=CV$ 变大。
- 若 $Q$ 不变，$C=\kappa C_{0}$，$V=\frac{Q}{C}$ 变小。