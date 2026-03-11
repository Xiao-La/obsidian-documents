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

![[Electrostatics - 静电学.png|298]]
则可以推出：
- 当 $y\gg d$ 时， $E(y)= \frac{\vec{p}}{2\pi \varepsilon_{0}y^3}$。
- 当 $x\gg d$ 时，$E(x)=- \frac{\vec{p}}{4\pi \varepsilon_{0}x^3}$。
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
