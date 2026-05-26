前置： [[Thermodynamics - 热力学]]

阿伏伽德罗常数 $N_{A}=6.02\times 10^{23} \text{mol}^{-1}$ 且有这些关系：
$$
n=\frac{N}{N_{A}}=\frac{M_{Sam}}{M}
$$
$$
M=mN_{A}
$$

理想气体（Ideal Gas）：忽略气体分子间的相互作用。
理想气体物态方程：
$$
pV=nRT=NkT
$$
其中 $k=1.38\times {10}^{23} \text{J/K}$ 为玻尔兹曼常数，$R$ 为气体常数，它们之间满足 $kN_{A}=R$。
$R$ 在数值上等于 $8.31$。
### 理想气体的分子速率分布

理想气体的均方根（Root mean square）速度：
$$
v_{\text{rms}}= \sqrt{ \frac{3RT}{M} }
$$
平均平动动能：
$$
K_{\text{avg}}=\frac{3}{2}kT
$$
推导： [[Gas - 1]]

麦克斯韦速率分布函数：
$$
P(v)=4\pi \left( \frac{M}{2\pi RT} \right)^{3/2} v^2 e^{-Mv^2 / 2RT}
$$
从而可以推出三种不同的特殊速率：
1. 平均速率（Average Speed）$v_{\text{avg}}=\sqrt{ \frac{8RT}{\pi M} }$
2. 均方根速率（Root-Mean-Square Speed） $v_{\text{rms}}=\sqrt{ \frac{3RT}{M} }$
3. 最可几速率 (Most Probable Speed) $v_{P}=\sqrt{ \frac{2RT}{M} }$

### 理想气体之间的碰撞

$\Delta t$ 时间内一个气体分子会走过 $L=v_{\text{avg}}\Delta t$，会发生的碰撞次数为 $N_{\text{col}}=(N / V) (\pi d^2 )v_{\text{rel}} \Delta t$。
可以证明 $v_{\text{rel}}=\sqrt{ 2 } v_{\text{avg}}$。

平均自由程（Mean Free Path）定义为每两次碰撞之间气体运动的平均距离：
$$
\lambda= \frac{L}{N_{\text{col}}} = \frac{v_{\text{avg}}\Delta t}{v_{\text{rel}}\Delta t\pi d^2N / V}=\frac{1}{\sqrt{ 2 }\pi d^2N / V}
$$
那么每两次碰撞之间的平均时间间隔（Average Time Between Collisions）：
$$
t=\frac{\lambda}{v_{\text{avg}}}
$$
碰撞频率（Collision Rate） $f=\frac{1}{t}=\frac{v_{\text{avg}}}{\lambda}$

### 摩尔热容

摩尔热容（Molar Specific Heats） 指的是每摩尔气体分子的热容量。
摩尔热容是路径依赖的。对于恒容过程有恒容摩尔热容 $C_{v}$，对于恒压过程有恒压摩尔热容 $C_{P}$。
那么有：
#### 恒容 
  $$Q=nC_{v} \Delta T$$
由于 $W=0$，有

$$
\Delta E_{\text{int}}=Q+W=Q=nC_{v}\Delta T
$$
那么对于所有理想气体，定义
$$
E_{\text{int}}=nC_{v}T
$$
可以看出，理想气体的内能只与温度有关，是一个状态函数而不是路径函数。
对于**单原子分子的理想气体**，内能只考虑平动动能，那么
$$
E_{\text{int}}=NK_{\text{avg}}=N \frac{3}{2}kT=\frac{3}{2}nRT
$$
对比得 $C_{v}=\frac{3}{2}R$。

#### 恒压

$$Q=nC_{p}\Delta T$$
考虑到 $p$ 为常数，有
$$
W=\int pdV=p\Delta V=nR \Delta T 
$$
那么有 
$$
\Delta E_{\text{int}}=Q-W=nC_{P}\Delta T-nR\Delta T
$$
又因为
$$
\Delta E_{\text{int}}=nC_{v} \Delta T
$$
那么可以导出理想气体的一个重要属性：
$$
C_{P}=C_{v}+R
$$
#### 多原子分子的情况
既要考虑平动动能，又要考虑振动动能和转动动能。

$N$ 原子气体分子：
1. 总自由度：$3 N$。
2. 平动自由度：3。
3. 转动自由度：3（非线性）或 2（线性）。
4. 振动自由度：$3N-6$（非线性）或 $3N-5$ （线性）。

对于自由度为 $f$ 的气体分子：

$$
E_{\text{int}}=\frac{1}{2} kT \times N\times f =n \frac{f}{2} RT
$$
对比 $E_{\text{int}}=nC_{v}T$ 可得
$$
C_{v}=\frac{f}{2}R, C_{p}=\left( \frac{f}{2}+1 \right)R
$$
实际上，气体分子的自由度还和温度有关。在低温状态下，转动和振动自由度会被冻结。温度升高之后，转动自由度会先解冻，然后是振动自由度。
![[Gas-Kinetics-1.png]]
基于**能量均分定理**，可通过自由度的比例算出动能大小，例如对于双原子分子，平动动能为 $\frac{3}{5}E_{\text{int}}$。

### 热力学过程计算

#### 恒温 (Isothermic)

$$
W=\int_{V_{1}}^{V_{2}} pdV=\int_{V_{1}}^{V_{2}} \frac{nRT}{V}dV=nRT\ln \frac{V_{2}}{V_{1}}
$$
由于过程等温，$\Delta E_{\text{int}}=0$，从而可以推出 $Q$ 的值。

#### 恒容（Isochoric）

$$
W=0
$$
$$
Q=nC_{v}\Delta T = \left( \frac{C_{v}}{R} \right)V \Delta p
$$
也就是说 $\Delta E_{\text{int}}= (C_{v} / R) V\Delta p$。

#### 恒压（Isobaric）

$$
W=\int p dV = p \int dV=p\Delta V=nR\Delta T
$$
$$
Q=nC_{p}\Delta T= (\frac{C_{p}}{R}) p\Delta V
$$
从而有
$$
\Delta E_{\text{int}}=Q-W=\left( \frac{C_{v}}{R} \right)p\Delta V=nC_{v}\Delta T
$$ 
#### 绝热（Adiabatic）
$$
Q=0
$$
$$W=-\Delta E_{\text{int}}=-nC_{v}\Delta T=\frac{C_{v}}{R}(p_{i}V_{i}-p_{f}V_{f})$$
绝热过程的过程方程为
$$
pV^\gamma=1
$$
或 
$$
TV^{\gamma-1}=1
$$
其中 $\gamma=\frac{C_{p}}{C_{v}}>1$ ，那么绝热过程的曲线比等温过程的曲线更陡峭。

#### 自由膨胀（Free Expansion）
$$
W=0,Q=0, E_{\text{int}}=0
$$
那么 $\Delta T=0, \Delta(pV)=0$。