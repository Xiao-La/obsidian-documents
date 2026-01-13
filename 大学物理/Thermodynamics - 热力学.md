
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

### 热机

利用循环过程做功，这需要过程的 $\text{p-V}$ 图线是顺时针方向的闭合曲线。
![[Thermodynamics-1.png]]

热机效率 $\varepsilon= \frac{|W|}{|Q_{H}|}=1-\frac{|Q_{L}|}{|Q_{H}|}$。
对于理想卡诺热机：
![[Thermodynamics-2.png]]
对整个过程，$|Q|=|W|=Q_{\text{in}}-Q_{\text{out}}$。而且通过绝热过程的方程可推 $\frac{V_{2}}{V_{1}}=\frac{V_{3}}{V_{4}}$。
有 $W=RT_{H}\ln \frac{V_{2}}{V_{1}}-RT_{L} \frac{V_{3}}{V_{4}}=R(T_{H}-T_{C})\ln \frac{V_{2}}{V_{1}}$，$Q_{H}=RT_{H}\ln \frac{V_{2}}{V_{1}}$。
那么 $0\leq \varepsilon = 1- \frac{T_{C}}{T_{H}}<1$ 。

卡诺指出，不同的热机在冷源和热源温度一致时，卡诺热机的效率是最高的。
### 制冷机
![[Thermodynamics-3.png]]
$K= \frac{|Q_{L}|}{|W|}=\frac{|Q_{L}|}{|Q_{H}|-|Q_{L}|}= \frac{T_{L}}{T_{H}-T_{L}}$。


### 热力学第二定律

克劳修斯表述：热量不能自发地从低温物体传递到高温物体。

开尔文表示：不可能从单一热源吸取热量并将其完全转化为有用的功而不产生其他影响。

实质：自发发生的热现象有方向性，一切与热现象的实际过程都是不可逆的。

#### 熵

定义熵变（Entropy Change）：

$$dS=\frac{dQ_{\text{rev}}}{T}$$
那么理想气体可逆过程的熵变：
$$
\Delta S= \int \frac{dE+dW}{T}= \int \frac{nC_{v}}{T}dT + \int \frac{nR}{V}dV=nC_{v} \ln \frac{T_{2}}{T_{1}} + nR \ln \frac{V_{2}}{V_{1}}
$$
一些特例：
1. 等压过程（Isobaric Process）：$\Delta S=nC_{p} \ln \frac{T_{2}}{T_{1}}$。
2. 等温过程（Isothermal Process）：$\Delta S= nR\ln \frac{V_{2}}{V_{1}}$ 。
3. 绝热过程（Adiabatic Process）：$\Delta S=0$。
4. 等容过程（Isochoric Process）：$\Delta S = nC_{v} \ln \frac{T_{2}}{T_{1}}=nC_{v} \ln \frac{p_{2}}{p_{1}}$。
5. 相变（Phase Change）：$\Delta S=\frac{\Delta Q}{T}=\frac{Lm}{T}$。
6. 同相变温（Same Phase, Change in Temperature）：$\Delta S= \int \frac{dQ}{T}=\int \frac{cm}{T}dT=cm\ln \frac{T_{2}}{T_{1}}$
**熵增定律（热力学第二定律）：** 绝热过程中 $S_{f}-S_{i}\geq 0$，当且仅当过程可逆时取等。
推论：孤立系统的熵永远不减，达到平衡态时熵达到最大值。

熵的统计解释：
$$
S=k\ln W
$$
其中 $W$ 为微观状态数（Microstates）。
实际计算使用斯特林近似：$\ln N!\sim N(\ln N)-N$