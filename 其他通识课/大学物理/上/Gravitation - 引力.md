 牛顿引力定律（Newton's Law of Gravitation）：
$$
F=G \frac{m_{1}m_{2}}{r^2}
$$
或
$$
\mathbf{F}=-G \frac{m_{1}m_{2}}{r^2} \hat{\mathbf{r}}=-G \frac{m_{1}m_{2}}{r^3} \mathbf{r}
$$
其中 $G=6.67\times 10^{-11} \mathrm{N} \cdot \mathrm{m}^2 \text{/ kg}^2$。


### 叠加原理 （The Principle of Superposition）

$$
\mathbf{F}_{1, net} = \sum^{n}_{i=2}\mathbf{F}_{1i}
$$

### 球壳定理（The Shell Theorem）

1. **均匀球壳**对壳外的质点的引力等于把球壳的全部质量集中到球心后产生的引力。
2. **均匀球壳**对壳内的质点不产生净引力。

推论：**实心均匀球体**内部在距中心为 $r$ 的点处的引力，只来自半径为 $r$ 的球体内的质量，壳外质量不产生贡献。

### 重力与引力的关系

![[Gravitation-1.png]]
实际上，支持力 $\mathbf{N}$ 和 $\mathbf{F}_{g}$ 一起提供自转的向心力，而 $\mathbf{N}$ 和 $m\mathbf{g}$ 相等。故有 $\mathbf{F}_{g}=m \mathbf{a}_{c} + m \mathbf{g}$。

### 引力势能

万有引力是保守力，将无穷远点设为零势能点，即可推出引力势能的表达式。
双粒子系统： $U(r)=-\int_r^\infty \frac{GMm}{r^{\prime 2}}\,\mathrm{d}r^{\prime}=-\frac{GMm}{r}$。
三粒子系统：$U=-\frac{Gm_{1}m_{2}}{r_{12}}-\frac{Gm_{1}m_{3}}{r_{13}}-\frac{Gm_{2}m_{3}}{r_{23}}$。
逃逸速度 （Escape Speed）指脱离引力场需要的速度：
$$
E=K+U=\frac{1}{2}mv^2 - \frac{Gm_{1}m_{2}}{r}=0 \implies v=\sqrt{ \frac{2GM}{r} }
$$

### 开普勒三大定律

假设太阳不动，那么开普勒三大定律指出：
1. 轨道定律：所有行星走椭圆轨道 $r=\frac{p}{1+e\cos\theta}$。
2. 面积定律：太阳和行星连线扫过的面积随时间均匀变化：$$ \frac{\mathrm{d}A}{\mathrm{d}t}=\frac{1}{2}r^2 \frac{\mathrm{d}\theta}{\mathrm{d}t}=\frac{1}{2}\omega r^2=\frac{L}{2m}=\text{constant} $$
3. 周期定律：行星运动满足 $\frac{T^2}{a^3}=\text{constant}\left( = \frac{4\pi^2}{GM} \right)$，其中 $a$ 是椭圆半长轴长度，$T$ 为行星运动的周期。
![[Gravitation-2.png]]
