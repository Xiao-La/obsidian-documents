前置：[[Rotation - 定轴转动]]

振动（Oscillation）指的是在两个位置或状态之间的来回运动。
振动一个循环所需要的时间为**周期（Period）： $T$**。
频率 （Frequency）$f=\frac{1}{T}=\frac{\omega}{2\pi}$ 。

### 简谐运动

振动位置是时间的正弦函数的运动，称为**简谐运动（Simple Harmonic Function, SHM）**。
$$
x(t)=x_{m}\cos(\omega t+\phi)
$$
其中 $x_{m}$ 是**振幅（Amplitude）**，$\omega t+\phi$ 是**相位（Phase）**，$\phi$ 是**相位角（Phase Angle）**， $\omega$ 是**角频率（Angular Frequency）**，而且有：
$$
\omega =\frac{2\pi}{T}=2\pi f
$$
通过求导可以得到：
$$
v(t)=\frac{dx(t)}{dt}=-\omega x_{m} \sin(\omega t+\phi)
$$
$$
a(t)=\frac{dv(t)}{dt}=-\omega^2
x_{m}\cos(\omega t+\phi)$$
 不难看出 $a=-w^2x$，故而 $F=ma=-m\omega^2x$，这里的力就叫**回复力（Restoring Force）**。
反过来通过 $F=-kx$ 可以求得 $\omega=\sqrt{ \frac{k}{m} }, T=2\pi \sqrt{ \frac{m}{k} }$。

能量角度，势能 $U=\frac{1}{2}kx^2=\frac{1}{2}kx_{m}^2\cos^2(\omega t+\phi)$，动能 $K=\frac{1}{2}mv^2=\frac{1}{2}kx_{m}^2\sin^2(\omega t+\phi)$，它们之和即为机械能，故系统机械能守恒：
$$
E=\frac{1}{2}kx_{m}^2=\frac{1}{2}mv_{m}^2
$$
### 角简谐振动

角简谐运动（Angular SHM）是扭摆（Torsion pendulum）的原理。
$$
\tau = -\kappa \theta= I \frac{d^2\theta}{dt^2}
$$
$$
\implies \theta(t)= \theta_{m} \cos(\omega t + \phi) 
$$
其中 $\omega = \sqrt{ \frac{\kappa}{I} }$。
对单摆来说， $\tau=\vec{h} \times m\vec{g} = -hmg\sin\theta\sim -hmg\theta$，故 $\kappa=hmg$，$I=I_{com}+mh^2$。
$$
\implies \omega=\sqrt{ \frac{mgh}{I_{com}+mh^2} }\sim \sqrt{ \frac{g}{h} }
$$
这里的 $h$ 是转轴到质心的距离。
能量角度，势能 $U=mgh(1-\cos\theta)\sim \frac{1}{2}mgh\theta^2$，动能 $K=\frac{1}{2} I \Omega^2$，它们之和即为机械能，系统机械能守恒：
$$
E=\frac{1}{2}I\Omega_{m}^2 = \frac{1}{2} mgh\theta_{m}^2
$$
####  阻尼简谐振动

阻尼简谐振动（Damped SHM）是受到一个正比于 $v$ 的阻力的简谐振动：
$$
F_{net}=-bv-kx=ma
$$
$$
\implies m \frac{d^2x}{dt^2} + b \frac{dx}{dt} +kx = 0
$$
$$
\implies x(t)=x_{m} e^{bt/2m} \cos(\omega' t + \phi)
 $$
 其中 $$\omega' = \sqrt{ \frac{k}{m} -\frac{b^2}{4m^2}}, E(t)\simeq \frac{1}{2}kx_{m}^2 e^{-\frac{bt}{m}}$$
### 共振

受迫振动（Forced Oscillation）的频率始终和周期性的驱动力（Driving Force）的频率相同。
当受迫振动的频率达到本真频率 （Natural Angular Frequency）时，振动的振幅最大，这种现象叫做共振 （Resonance）。

### 等效劲度系数

弹簧的串联：
$$
\frac{1}{k_{eff}}=\sum_{i} \frac{1}{k_{i}}
$$
弹簧的并联：
$$
k_{eff}=\sum_{i} k_{i}
$$
