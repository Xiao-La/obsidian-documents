
## 电流 
 
电流为电荷因电场作用在导体中定向移动产生的，定义为单位时间内通过一个截面的正电荷量。
$$
i=\frac{dq}{dt}
$$
电流为一个标量。
微观表示
  $$
i=\frac{\Delta q}{\Delta t}=\frac{NALe}{\frac{L}{v_{d}}}=nAev_{d}
$$
定义电流密度
$$
\vec{J}=\frac{i}{A}\hat{v_{d}}=ne \vec{v_{d}}
$$
那么有 
$$
di=\vec{J}d\vec{A}
$$

## 电阻

定义电阻率（Resistivity）为电场强度与电流密度的比值，它只与材料有关：
$$
\rho=\frac{E}{J}
$$
导电率（Conductivity）为：
$$
\sigma=\frac{1}{\rho}=\frac{J}{E}
$$
定义电阻（金属材料）（Resistance）为：
$$
R=\frac{V}{I}\text{(Ohm's Law)}
$$
若电阻率处处相等，截面面积不变，则可以推出电阻和电阻率的关系：
$$
V=IR=EL=\rho JL=\frac{\rho IL}{A}
$$
$$
\implies R=\frac{\rho L}{A}
$$
一般情况下 $R=\int \frac{\rho(x)}{A(x)}dx$。

电阻率与温度之间的关系：
$$
\rho (T)=\rho_{0}(1+\alpha (T-T_{0}))
$$
或
$$
\alpha= \frac{1}{\rho_{0}} \frac{\Delta \rho}{\Delta T}
$$
$\alpha>0$：温度越高，电阻率越高；$\alpha <0$：温度越高，电阻率越低。
超导材料：在 $T<T_{0}$ 下，电阻率变成了 $0$。
可以用测电阻来测温度。
金属中有
$$
\rho=\frac{E}{J}=\frac{\frac{ma}{e}}{nev_{d}}= \frac{m}{e^{2}n\tau}
$$
其中 $\tau$ 为两次碰撞之间的时间，与电场大小无关。
电阻的串联：
$$
R=R_{1}+R_{2}+\dots +R_{n}
$$
并联：
$$
R=\frac{1}{R_{1}}+\frac{1}{R_{2}}+\dots+\frac{1}{R_{n}}

$$
## 电功率

$$
U=qV\implies dU=Vdq=VIdt
$$
$$
\implies P=\frac{dU}{dt}=IV
$$
在纯电阻的情况下, 应用欧姆定律有：
$$
P=I^{2}R=\frac{V}{R}
$$
## 电路

电动势（Electromotive Force, emf）$\varepsilon$ 为将电流从低电势转换为高电势的影响。一个理想的 emf 可以保持恒定的电势差。
真实的电池会存在内阻 $r$，那么对于整个回路有
$$
\varepsilon=I(R+r)
$$

基尔霍夫定律（Kirchhoff's Rules）：
- 基尔霍夫节点定则（Kirchhoff's Junction Rule）：对于电路中任意的节点，有 $\sum I=0$。
- 基尔霍夫回路定则（Kirchhoff's Loop Rule）：对于电路中任意的回路，从某一个点经过一圈回到原点，有 $\sum V=0$。（例如，沿着电流方向经过电阻，电势减小；从电池的负极穿到正极，电势上升）。
电流的方向可以随便假设，最后看算出来数值的正负来确定实际方向。

### RC 电路

（电容器充电）存在一个电动势 $\varepsilon$，一个电阻 $R$  和一个电容器 $C$ 的回路中，由基尔霍夫回路定则得：
$$
\varepsilon-iR-\frac{q}{C}=0
$$
这等价于关于 $q$ 的一阶微分方程：
$$
\frac{dq}{dt}=-\frac{q-C\varepsilon}{RC}
$$
解得
$$
q=C\varepsilon(1-e^{-t/RC})
$$
以及
$$
i=\frac{dq}{dt}=\frac{\varepsilon}{R} e^{-t/RC}
$$
$$
V=\frac{q}{C}=\varepsilon(1-e^{-t/RC})
$$
这里 $RC=\tau$ 为**时间常数(Time Constant)**，单位为秒。
（电容器放电）在上面的情况下去掉电动势：
$$
-iR-\frac{q}{C}=0
$$
解得
$$
q=Q_{0}e^{-t/RC}
$$
$$
i=-\frac{Q}{RC}e^{-t/RC}=I_{0}e^{-t/RC}
$$
