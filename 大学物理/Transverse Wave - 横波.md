[[Oscillations - 振动]]
**横波（Transverse Wave）** 指质点振动方向与波传播方向相反的波。

向右传播的波可以写成 $y(x,t)=f(x - vt)$ 的形式。
## 谐波

**谐波（Harmonic/Sinusoidal Waves）** 指 $f(x)$ 是正弦函数的情况：

$$
y(x,t)=y_{m}\sin(k(x\pm vt))
$$

将 $x$ 增加一个波长 $\lambda$，波的形状不变，可以推出 $k=\frac{2\pi}{\lambda}$，$k$ 叫做角波数 （Angular Wave Number），单位 $\text{rad/m}$。
将 $t$ 增加一个周期 $T$，波的形状不变，可以推出 $kv=\frac{2\pi}{T}=\omega$。
故谐波的**标准形式**：
$$
y(x,t)=y_{m}\sin(kx\pm\omega t)
$$
![[Wave-1.png]]
## 绷紧弦上的波

绷紧弦（Stretched String）上的波速
$$
v=\sqrt{ \frac{\tau}{\mu} }
$$
其中 $\tau$ 是弦上的张力（Tension），$\mu=\frac{M}{L}$ 是弦的线密度（Linear Density）
证明： [[Wave-1]]
波能量传递的平均功率：
$$
P_{\text{avg}} = \frac{1}{2}\mu v\omega^2y_{m}^2
$$
证明：[[Wave-2]]

##  谐波的叠加

两列谐波的叠加（Superposition）只需简单相加：
$$
y(x,t)=y_{1}(x,t)+y_{2}(x,t)
$$
稳定的叠加叫做干涉（Interference）。
#### 差某个相位的情况

若两列波振幅，波长和频率相同，只差一个相位 $\phi$，那么它们的叠加：
$$
\begin{align}
y(x,t)&=y_{m}\sin(kx-\omega t)+y_{m}\sin(kx-\omega t+\phi) \\
&=2y_{m}\cos\left( \frac{\phi}{2} \right)\sin\left( kx-\omega t+\frac{\phi}{2} \right)
\end{align}
$$
1. 若 $\cos\left( \frac{\phi}{2} \right)=0$，则两列波反相（Out of phase），称为相消干涉（Destructive Interference）。
2. 若 $\cos\left( \frac{\phi}{2} \right)=\pm 1$，则两列波同相（In phase），称为相长干涉（Constructive Interference）。
#### 传播方向相反的情况

若两列波振幅，波长和频率相同，但传播方向相反，那么它们的叠加：
$$
\begin{align}
y(x,t)&=y_{m} \sin (kx-\omega t) + y_{m} \sin(kx+\omega t) \\
&=2y_{m} \sin kx
 \cos\omega t\end{align}
$$
是一个**驻波（Standing Wave）**。
1. 若 $\sin kx=0$，即 $x=n \frac{\lambda}{2}$，这些点永远不动，叫做节点（Nodes）。
2. 若 $\sin kx=\pm 1$，即 $x=\left( n+\frac{1}{2} \right) \frac{\lambda}{2}$，这些点振幅最大，叫做负点（Antinodes）。
## 波的反射

如果一个波撞到“硬边界”（Hard boundary），会发生半波损，波会跳跃半个相位后反射回来。
如果一个波撞到“软边界”（Soft boundary），会直接反射回来。

如果一个波和其反射的波叠加形成了驻波，则这种现象称为共振（Resonance）。

**可以证明，产生共振的必要条件是硬边界都在节点，软边界都在负点**。

两边都是硬边界的情况，需要 $L=n \frac{\lambda}{2}$ 形成共振：
![[Wave-3.png]]
2. 一边是硬边界一边是软边界的情况，需要 $L=\frac{\lambda}{4} + \frac{\lambda}{2} n$，即 $\lambda=\frac{4L}{m}(m=1,3,5\dots)$ 的情况：
![[Wave-4.png]]
3. 两边都是软边界的情况，需要 $L=n \frac{\lambda}{2}$：
![[Wave-5.png]]

注意，所谓 $\text{nth harmonic}$ ，可以理解成谐波的频率 $f_{n}=nf_{1}$，其中 $f_{1}$ 为 $\text{Foundamental Frequency}$；所谓 $\text{nth lowest harmonic}$，对一边硬边界一边软边界的情况，则取第 $n$ 个可以形成谐波的频率。