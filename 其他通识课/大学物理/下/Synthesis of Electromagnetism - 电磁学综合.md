
### LC 振荡电路 （LC Oscillator）
![[Electromagnetism - 电磁学综合.png]]
能量守恒：
$$
\frac{Q^{2}}{2C}+ \frac{1}{2}Li^{2}=U
$$
这是一个关于 $q$ 的二阶微分方程（假定电流流进正极板，才有 $i=\frac{dQ}{dt}$），类似与弹簧振子。那么有
$$
q=Q\cos(\omega t+\phi)
$$
这里 $\omega= \frac{1}{\sqrt{ LC }}$。

有电阻的情况，就相当于阻尼振荡（Damped Oscillator）：
![[Electromagnetism - 电磁学综合-1.png]]

有交流电源和电阻的情况，就相当于受迫振荡。
![[Electromagnetism - 电磁学综合-2.png]]
有如下关系，其中 $\omega$ 是电源频率：
$$
\varepsilon=\varepsilon_{m}\sin \omega t
$$
$$
i=I_{m}\sin(\omega t-\phi)
$$
$$
\implies V_{R}=iR=I_{m}R\sin(\omega t-\phi)
$$
$$
V_{L}=L \frac{di}{dt}=L\omega I_{m}\sin\left( \omega t-\phi+\frac{\pi}{2} \right)
$$
$$
V_{C} = \frac{\int idt}{C}= \frac{1}{\omega C} I_{m} \sin\left( \omega t-\phi-\frac{\pi}{2} \right)
$$
**直观理解：电感是对抗电流的变化的，所以电压提前于电流；电容器是先有电流充电才有电压的，所以电压落后于电流。**
这里称 $X_{L}=\omega L$ 为感抗（Inductive Reactance），$X_{C}=\frac{1}{\omega C}$ 为容抗（Capacitive Reactance）。上方是相图（Phasor Diagram），因此电感的电势差相位领先电流 $\frac{\pi}{2}$，电容的落后电流 $\frac{\pi}{2}$。
![[Electromagnetism - 电磁学综合-3.png]]
图中可以看到， $\varepsilon$ 领先电流相位 $\phi$。
这里定义阻抗 (Impedance)
$$
Z= \sqrt{ R^{2}+(X_{L}-X_{C})^{2} }
$$
这里也有
$$
\tan \phi= \frac{V_{L}-V_{C}}{V_{R}}= \frac{X_{L}-X_{C}}{R}(\text{相位常数, Phase Constant})
$$
因此，当 $X_{L}=X_{C}$ 时， $\phi=0$，达到共振（Resonance），$I_{m}$（振幅）达到最大：
$$
\omega_{d}=\omega= \frac{1}{\sqrt{ LC }}
$$
在 $X_{L}<X_{C}$ 时，$\phi<0$，$I_{m}$ 随 $\omega_{d}$ 增加而增加（称为容性/mainly capacitive，此时电压落后于电流）；在 $X_{L}>X_{C}$ 时， $\phi>0$，$I_{m}$ 随 $\omega_{d}$ 增加而减小（称为感性/mainly inductive，此时电压提前于电流）。
**直观理解：$\omega_{d}$ 从 $0$ 增加到 $\infty$ 时，感抗在从 $0$ 增加到 $\infty$，容抗在从 $\infty$ 减小到 $0$。总阻抗取决于它们差值的大小，当他们相等的时候阻抗最小，电流幅值最大。左边，容抗大，为电容性；右边，感抗大，为电感性。**

另外，定义 **功率因数（Power Factor）** 为 $\cos \phi=\frac{R}{Z}$，即有功功率和总功率的比值。

### 交流电路（AC）中的功率

$$
I_{\text{rms}}=\frac{I}{\sqrt{ 2 }}, V_{\text{rms}}= \frac{V}{\sqrt{ 2 }}, \varepsilon_{\text{rms}} = \frac{\varepsilon _{m}}{\sqrt{ 2 }}
$$
$$
P_{\text{avg}}=I^{2}_{\text{rms}}R
$$
在包含 $\varepsilon,C,L,R$ 的电路中：

$$
P_{\text{avg}}=I_{\text{rms}}^{2}R= \frac{\varepsilon_{\text{rms}}}{Z}I_{\text{rms}}R=\varepsilon_{\text{rms}}I_{\text{rms}}\cos \phi
$$
### 变压器（Transformer）

![[Electromagnetism - 电磁学综合-4.png|294]]
电压关系：
$$
\frac{V_{2}}{V_{1}}= \frac{N_{2}}{N_{1}}
$$
能量守恒，有
$$
V_{1}I_{1}=V_{2}I_{2}
$$
因此在电源端的等效电阻为
$$
\frac{V_{1}}{I_{1}}= \frac{R}{\left( \frac{N_{2}}{N_{1}} \right)^{2}}
$$
### 位移电流

位移电流（Displacement Current）为空间中的电场变化的等效电流，它会产生磁场：
$$
i_{D}=\varepsilon_{0} \frac{d\Phi_{E}}{dt}=\varepsilon_{0} \frac{d}{dt}\int \vec{E}\cdot d\vec{A}
$$
电容器充放电中，就会产生位移电流。
根据麦克斯韦理论，为了保持闭合电路中“电流”的连续性，流入电容器极板的传导电流等于极板间的位移电流。
麦克斯韦修正后的安培定律：
$$
\int \vec{B}\cdot d\vec{l}=\mu_{0}(i+i_{D})
$$
## 麦克斯韦方程组

电磁波是横波 (EM waves $\rightarrow$ Transverse waves)。

电磁波的存在是基于麦克斯韦方程组推导出来的。一般形式的麦克斯韦方程组积分形式如下：

$$
\begin{cases}
\oint \mathbf{E} \cdot \mathrm{d}\mathbf{A} = \frac{q_{\text{enc}}}{\varepsilon_0} & \text{(高斯定律)} \\
\oint \mathbf{B} \cdot \mathrm{d}\mathbf{A} = 0 & \text{(高斯磁定律)} \\
\oint \mathbf{E} \cdot \mathrm{d}\mathbf{l} = -\frac{\mathrm{d}}{\mathrm{d}t} \int \mathbf{B} \cdot \mathrm{d}\mathbf{A} & \text{(法拉第感应定律)} \\
\oint \mathbf{B} \cdot \mathrm{d}\mathbf{l} = \mu_0 \left( \int \mathbf{J} \cdot \mathrm{d}\mathbf{A} + \varepsilon_0 \frac{\mathrm{d}}{\mathrm{d}t} \int \mathbf{E} \cdot \mathrm{d}\mathbf{A} \right) & \text{(安培-麦克斯韦定律)}
\end{cases}
$$

**自由空间条件产生自洽波动：**
在远离辐射源的自由空间中，没有自由电荷 ($q = 0$)，也没有传导电流 ($\mathbf{J} = 0$)。将这两个条件代入上述方程，原本需要电荷和电流激发的项消失了，方程变得高度对称。这表明：**交变的电场可以自发产生磁场，交变的磁场也可以自发产生电场。** 它们交替激发，形成在空间中传播的电磁波。

在自由空间中，沿 $x$ 轴正方向传播的最简单的电磁波形式是平面简谐波：
$$
\begin{cases}
E = E_m \sin(kx - \omega t) \\
B = B_m \sin(kx - \omega t)
\end{cases}
$$

![[Synthesis of Electromagnetism - 电磁学综合.png|468]]

电磁波具有以下六个重要特征：
1. 步调一致 ($E \text{ and } B$ are in phase)：电场 $\mathbf{E}$ 和磁场 $\mathbf{B}$ 是**同相**的。
2. 相互垂直 ($E \text{ and } B$ are perpendicular)：电场分量和磁场分量不仅彼此相互垂直，而且它们都垂直于波的传播方向。因此电磁波是横波。
3. 定向传播 ($\hat{E} \times \hat{B} = \hat{c}$)。
 4. 振幅比例固定 ($E_m = cB_m$)：在真空中，电场的峰值大小 $E_m$ 与磁场的峰值大小 $B_m$ 之间保持一个固定的比例关系，这个比例常数就是真空中光速 $c$。
 5. 波速由真空常数决定 ($c = 1/\sqrt{\mu_0\varepsilon_0}$)：电磁波在真空中的传播速度（光速 $c$）仅仅取决于真空磁导率 $\mu_0$ 和真空电容率 $\varepsilon_0$。这一推导证明了光本质上也是一种电磁波。
 6. 能量均分 ($u_E = u_B$)：电磁波在传播过程中携带着能量。在任何时刻、真空中的任何一点，电场贡献的能量密度 $u_E$ 和磁场贡献的能量密度 $u_B$ 是绝对相等的。


为了描述电磁波在某一时刻、某一点传输能量的方向和速率，物理学引入了**坡印廷矢量（Poynting vector） $\vec{S}$**。其定义式（矢量形式）为：
$$ \vec{S} = \frac{1}{\mu_0} \vec{E} \times \vec{B} $$

*   **方向：** $\vec{S}$ 的方向由 $\vec{E} \times \vec{B}$ 决定，这意味着能量是沿着波的传播方向流动的。
*   **大小推导：** 因为 $\vec{E}$ 和 $\vec{B}$ 相互垂直，所以叉乘的大小直接等于乘积 $EB$。再利用真空中电场和磁场的幅值关系 $E = cB$，可以推导出 $\vec{S}$ 大小的多种等效表达形式。光学中常用只含 $E$ 的形式。
$$ S = \frac{1}{\mu_0} EB = \frac{1}{c\mu_0} E^2 = \frac{c}{\mu_0} B^2 $$
*   **物理意义：** 量纲为 **功率/面积 ($W/m^2$)**。它表示单位时间内，垂直穿过单位面积的电磁能量。

由于电磁波的电场 $E$ 和磁场 $B$ 是极高频周期性变化的，坡印廷矢量 $\vec{S}$ 也在快速振荡。考察一段时间内能量传输的**平均效果**，这个时间平均值就被称为电磁波的**强度 (Intensity)**，用字母 $I$ 表示：
$$ I = \langle S \rangle = \frac{1}{c\mu_0} \langle E^2 \rangle = \frac{1}{2c\mu_0} E_m^2 = \frac{1}{c\mu_0} E_{\text{rms}}^2 $$

*   $\langle S \rangle$ 表示对瞬时值 $S$ 取时间平均。对于正弦波，周期内平方的平均值 $\langle E^2 \rangle = \frac{1}{2} E_m^2$ （其中 $E_m$ 是电场的峰值/最大幅值）。$E_{\text{rms}}$ 代表电场的**有效值** (均方根值, Root Mean Square)，$E_{\text{rms}} = E_m / \sqrt{2}$。因此 $\frac{1}{2} E_m^2$ 等于 $E_{\text{rms}}^2$。

强度的本质是：
$$ \left( \frac{\text{power}}{\text{area}} \right)_{avg} $$
即：**平均辐射功率除以受照面积**。

如果产生电磁波的是一个向四面八方均匀辐射的**点辐射源 (Point source)**，能量会在空间中以球面波的形式向外扩散。根据能量守恒定律，辐射源发出的总平均功率（average power）在距离源为 $r$ 时，会均匀分布在半径为 $r$ 的整个球面上：

$$ I = \frac{\text{average power}}{4\pi r^2} \propto \frac{1}{r^2} $$
因此来自点源的电磁波强度与距离的平方成反比（$I \propto 1/r^2$）。

### 光子动量与辐射压（Radiation Pressure）

除了波动性，光（电磁波）也具有粒子性。光子（Photons）静止质量为零，但携带着能量和**动量**。

光子所携带的动量 $P$ 与其能量 $U$ 之间的关系为：

$$ P = \frac{U}{c} $$
*(注：$c$ 为真空中光速)*

当一束强度为 $I$ 的电磁波在 $\Delta t$ 时间内照射到面积为 $A$ 的物体表面时，传递的总能量为 $U = I A \Delta t$。根据表面性质的不同，物体获得的动量变化量 $\Delta P$ 有两种极端情况：
*   **完全吸收 (Totally absorbed)：** 
    物体吸收所有入射光子。
    $$ \Delta P = \frac{U}{c} = \frac{IA\Delta t}{c} $$
*   **完全反射 (Totally reflected)：**
    入射光子被原路弹回，动量改变量翻倍。
    $$ \Delta P = \frac{2U}{c} = \frac{2IA\Delta t}{c} $$

因为光传递了动量，所以电磁波会对物体施加力。

**1. 辐射力 (Force, $F$)**
根据牛顿第二定律 ($F = \frac{\Delta P}{\Delta t}$)，电磁波施加的力为：
*   完全吸收：$$ F = \frac{IA}{c} $$
*   完全反射：$$ F = \frac{2IA}{c} $$

**2. 辐射压 (Pressure, $p$)**
压强定义为单位面积上的力 ($p = \frac{F}{A}$)，即：
*   完全吸收：$$ p = \frac{I}{c} $$
*   完全反射：$$ p = \frac{2I}{c} $$
通过单位（量纲）理解辐射压本质的直观对应关系：
$$ \frac{I}{c} = \frac{S_{avg}}{c} = \frac{\text{energy}/(m^2 \cdot sec)}{c} $$
由于 **$\text{energy} / c = \text{momentum}$ (能量/光速 = 动量)**，上式可理解为：
**单位时间、单位面积上所传递的动量**。由动量定理可知，这正是**压强 (pressure)** 的物理定义。

### 偏振（Polarization）

*   **偏振面定义：** 电磁波中**电场 $\vec{E}$** 振动所在的平面。
*   **线偏振光：** 电场 $\vec{E}$ 只在单一固定方向上振动的光。
*   **非偏振光 (自然光)：** 电场 $\vec{E}$ 在各个方向振动概率相等的随机光。可等效为**两个相互垂直、强度相等的线偏振光叠加**。

![[Synthesis of Electromagnetism - 电磁学综合-1.png|326]]

**1. 起偏：非偏振光 $\rightarrow$ 线偏振光**
*   **原理：** 当强度为 $I_0$ 的非偏振光穿过偏振片时，只有平行于偏振轴的电场分量通过。
*   **强度变化：** 透射光变为线偏振光，强度减半：
    $$ I_1 = \frac{1}{2} I_0 $$
**2. 检偏：马吕斯定律 (Malus's Law)**
*   **原理：** 当振幅为 $E$、强度为 $I_1$ 的线偏振光穿过偏振片时，设振动面与偏振片透光轴夹角为 $\phi$。透射光的电场变为 $E_{\parallel} = E \cos\phi$。
*   **光强公式：** 由于光强 $I \propto E^2$，透射光强度 $I_2$ 满足**马吕斯定律**：
    $$ I_2 = I_1 \cos^2\phi $$
    *(注：当夹角 $\phi = 0^\circ$ 时透射极强；当 $\phi = 90^\circ$ 时透射为零，即消光)*
