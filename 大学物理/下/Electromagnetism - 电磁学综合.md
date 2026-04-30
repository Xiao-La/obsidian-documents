
### LC 振荡电路 （LC Oscillator）
![[Electromagnetism - 电磁学综合.png]]
能量守恒：
$$
\frac{Q^{2}}{2C}+ \frac{1}{2}Li^{2}=0
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
在 $X_{L}<X_{C}$ 时，$\phi<0$，$I_{m}$ 随 $\omega_{d}$ 增加而增加（称为容性/mainly capacitive）；在 $X_{L}>X_{C}$ 时， $\phi>0$，$I_{m}$ 随 $\omega_{d}$ 增加而减小（称为感性/mainly inductive）。
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
