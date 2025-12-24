
### 热力学系统

热力学系统（Thermodynamic System）由状态参量（State Quantities）描述。
状态参量分为广延量（Extensive Quantity）和强度量（Intensive Quantity）。

**简单体系（Simple System）：** 只用考虑 $p, V$ 两个参量的体系。

按系统（System）与环境（Surroundings）的关系分类：
1. 孤立系统（Isolated System）：能量与物质都不交换。
2. 封闭系统（Closed System）：只交换能量，不交换物质。
3. 开放系统（Open System）：物质和能量都交换。

按物相（Phase）分类：
1. 单相系统（Homogeneous System）
2. 多相系统（Heterogeneous System）

按组分（Component）分类：
1. 单组分系统（Single Component System）
2. 多组分系统（Multi-Component System）


### 热平衡

平衡态（Equilibrium State）的定义：
1. 宏观物理量不随时间变化。
2. 不存在稳定的能流或物质流。

### 热力学第零定律

**热力学第零定律（Zeroth law of thermodynamics and temperature）：**
1. 热平衡是可以传递的。
2. 处于热平衡的物体拥有相同的温度（Temperature）。

经验温标：如摄氏度/华氏度等，由生活中的某事物的冷热程度标定。
绝对温标：开氏温标（Kelvin Scale），与摄氏温标的换算为 $0 \degree \text{C}=273.15 \text{K}$。
开氏温标下，水的三相点的温度：$273.16 \text{K}$。

用压强测温度：依赖于 $T=Cp$（理想气体），则 $T=T_{3} \frac{p}{p_{3}}$，其中 $T_{3}, p_{3}$ 为水的三相点的温度与压强。

### 热膨胀

**二维情形：**

$$
\frac{\Delta L}{L} = \alpha \Delta T
$$
其中 $\alpha$ 为线膨胀系数，$\alpha>0$ 为热胀冷缩，$\alpha<0$ 为热缩冷胀。

**三维情形：**
$$
\frac{\Delta V}{V}=\beta \Delta T
$$
其中 $\beta$ 为体膨胀系数，这里有关系 $\beta=3\alpha$。

### 物态方程

物态方程（The Equation of State）
$$
f(p,V,T)=0
$$
对于理想气体（Ideal Gas）：
$$
pV-nRT=0
$$

### 热传递

热（Heat）是由于温度差异自发传递的能量。

热传递（Heat Transfer）的方法：
#### 热传导

热传导速率（Thermal Conduction Rate）：
$$
P_{\text{cond}}=\frac{Q}{t}=kA \frac{T_{H}-T_{C}}{L} = \frac{\Delta T}{R}$$
其中 $R=L / kA$ 为热阻（Thermal Resistance），$k$ 为导热系数（Thermal Conductivity）。
热阻和电阻的串并联计算是一样的。

**稳态**：两个热源之间的热流（$P_{\text{cond}}$）不变且处处一致。注意热源是温度保持不变的热库。

#### 对流 

流体热胀冷缩导致其流动，从而传递热量。
#### 辐射 

物体向外辐射的热功率：
$$
P_{\text{rad}}=\sigma \varepsilon A T^4
$$
物体吸收环境的热功率（基尔霍夫定律）：
$$
P_{\text{abs}}=\sigma \varepsilon A T^4_{\text{env}}
$$
净吸收功率：
$$
P_{\text{net}}=P_{\text{abs}}-P_{\text{rad}}=\sigma \varepsilon A (T_{\text{env}}^2-T^4)
$$
其中 $A$ 为物体表面积，$T$ 为物体温度，$\sigma$ 为斯忒藩-玻尔兹曼常数（Stefan-Boltzmann Constant），$\varepsilon$ 为与物体材料有关的介于 $0$ 和 $1$ 之间的量。
对黑体（Blackbody）来说，$\varepsilon=1$，即物体吸收和发射辐射能力都最强。

#### 热传递导致温度变化

$$
Q=C\Delta T=cm\Delta T
$$
其中 $C$ 为热容量（Heat Capacity），$c=\frac{C}{m}$ 为比热容（Specific Heat）。

#### 热传递导致相变

$$
Q=Lm
$$
其中 $L$ 为相变潜热（Latent Heat）。


### 热力学第一定律
#### 热力学过程

$$
(p_{i}, V_{i}, T_{i})\to (p_{f}, V_{f}, T_{f})
$$
过程分为不可逆过程（Irreversible Process）和可逆过程（Reversible Process）。
可逆过程只存在于理想中，它意味着初态到末态中的所有状态都是静态状态。
准静态过程（Quasi-static Process）是通过拉长过程的时间来近似可逆过程。

绝热过程（Adiabatic Process）：$Q=0$。
恒容过程（Isochoric / Constant-volume Process）：$W=0$。
循环过程(Cyclical / Loop Process)：$\Delta E_{\text{int}}=0$。
#### 热力学过程中的功

将系统对外界做的功（Work done by the system）定义为正：
$$
W_{\text{by}}=\int_{V_{i}}^{V_{f}} pdV 
$$
#### 热力学过程中的热

将系统从外界吸收的热定义为正：

$$
Q=C_{\text{process}} \Delta T
$$
其中 $C_{\text{process}}$ 和过程强相关。

#### 内能

热力学第一定律指出，能量是守恒的，那么热力学过程中剩下的能量会跑到系统内部，这被称为系统的内能（Internal Energy）：

$$
\Delta E_{\text{int}}=Q-W_{\text{by}}
$$
也就是说，不存在第一类永动机。
自由膨胀（Free Expansion）中，$Q=W=0$。
