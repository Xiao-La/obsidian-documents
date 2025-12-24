前置： [[Transverse Wave - 横波]]

**纵波（longitudinal Wave）** 指质点振动方向与波传播方向相同的波。

**声波（Sound Waves）** 是一种常见的纵波。
声波的波速：
$$
v=\sqrt{ \frac{B}{\rho} }
$$
其中 $B$ 是介质的体变模量（Bulk Modulus），$\rho$ 为介质的密度。
$$
B=- \frac{\Delta p}{\Delta V/V}
$$
由于气体最容易被压缩（$B$ 很小），液体次之，固体最难，故而声速：固体>液体>气体。
可以证明（[[Wave-3]]），声波的方程：
$$
s(x,t)=s_{m}\cos(kx-\omega t)
$$
进而：
$$
\Delta p(x,t)=-B \frac{\partial s}{\partial x}=Bks_{m}\sin(kx-\omega t)
$$
$$
\implies p_{m}=Bks_{m}=v\rho\omega s_{m}
$$
能量传递的平均功率：
$$
P_{avg}=\frac{1}{2}ABk\omega s_{m}^2
$$
定义声音的**强度（Intensity）** 为单位面积的功率：
$$
I=\frac{P_{avg}}{A}=\frac{1}{2}\rho v\omega^2s_{m}^2
$$

在三维空间中，波面为球形：
$$
I(r)=\frac{P_{s}}{4\pi r^2}
$$

进而定义**声级（Sound Level，单位为分贝 dB）：**
$$
\beta=(10\text{dB})\log \frac{I}{I_{0}}
$$
其中 $I_{0}=10^{-12}\text{W/m}^2$，约为人能听到的最小声强。

## 声波的干涉

### 路程差导致的相位差
$$
\begin{align}
s(P,t)&=s_{1}(x,t)+s_{2}(x,t) \\
&=s_{m}\cos(kx_{1}-\omega t)+s_{m}\cos(kx_{2}-\omega t) \\
&=2s_{m}\cos\left( \frac{k\Delta L}{2} \right)\cos(\omega t-\bar{\phi})
\end{align}
$$
其中 $\Delta L=|x_{2}-x_{1}|, \bar{\phi}=\frac{k(x_{1}+x_{2})}{2}$ 。
由于 $\frac{k\Delta L}{2}=\frac{\pi \Delta L}{\lambda}$，有：
1. 若 $\Delta L$ 为半波长的偶数倍，则为相长干涉。
2. 若 $\Delta L$ 为半波长的奇数倍，则为相消干涉。


### 节拍

两列波 $s_{1}=s_{m}\cos \omega_{1}, s_{2}=s_{m} \cos \omega_{2}$，那么它们的叠加 $s = 2s_{m} \cos \frac{\omega_{1}-\omega_{2}}{2}  \cos \frac{\omega_{1}+\omega_{2}}{2}$
叠加会形成这样的波形：
![[Wave-7.png]]
$\omega_{\text{beat}}=|\omega_{1}-\omega_{2}|, f_{\text{beat}}=|f_{1}-f_{2}|$

### 驻波

同横波，注意考虑 Open End 和 Closed End。

## 多普勒效应

波源（Source）的速度为 $v_{S}$ ，检测者（Detector）速度为 $v_{D}$ ，声音的速度为 $v$，则检测者感受到的声音频率为
$$
f'=f \frac{v\pm v_{D}}{v\pm v_{S}}
$$
两者接近，$f'>f$，两者远离，$f'<f$。
注意这个公式需要介质没有速度。如果介质有速度，应把介质选为参考系。

超音速（Supersonic）：$v_{S}>v$ 的情形，会引发激波（Shock Wave）.
马赫数（Mach Number）：$\frac{v_{S}}{v}$。
![[Wave-8.png]] 
$$
\sin \theta= \frac{v}{v_{S}}
$$