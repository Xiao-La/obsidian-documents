
**横波（Transverse Wave）** 指质点振动方向与波传播方向相反的波。
**纵波（longitudinal Wave）** 指质点振动方向与波传播方向相同的波。

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