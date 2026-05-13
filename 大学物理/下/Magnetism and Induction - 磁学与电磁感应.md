地磁场与经线之间存在一个磁偏角（Magnetic Declination）。与地面还存在一个磁倾角（Magnetic Inclination）。
目前没有发现磁单极子，任何磁体都有两极。磁场线是闭合的圈，在外部从 N 极走到 S 极，内部从 S 极回到 N 极。
## 磁场力（Magnetic Force）

### 对于粒子

通过移动电荷在磁场中受到的磁场力来定义磁感应强度（Magnetic Flux Density）$B$，国际单位为特斯拉（$\text{T}$），也有单位高斯（$\text{G}$），这里 $1\text{T}=10000\text{G}$。
$$
\vec{F}=q\vec{v}\times \vec{B}
$$
洛伦兹力（Lorentz Force）：
$$
\vec{F}=q(\vec{E}+\vec{v}\times \vec{B})
$$
霍尔效应（The Hall Effect）：
$$
\begin{cases}
qE=qv_{d}B \\
v_{d}=\frac{J}{ne}=\frac{i}{neA} \\
V=Ed \\
A=dl
\end{cases}
\implies n=\frac{Bi}{Vle}
$$
![[Magnetism - 磁学.png|464]] 
这里 $n$ 是单位体积内载流子的数量。载流子为正电或者负电，其受力方向是一致的，但导致的电势高低是不一样的。

显然带电粒子垂直于磁场入射，所受的磁场力会使其做匀速圆周运动。
如果在平行于磁场方向有速度，就会做一个螺旋状运动。

回旋加速器（Cyclotron）：由于  $T=\frac{2\pi m}{qB},r=\frac{mv}{qB}$，通过周期性改变电场的方向即可做到一直加速。
质谱仪（Mass Spectrometer）：测量粒子的质量。

### 对于导线

对于直导线：
$$
\begin{cases}
q=it \\
l=v_{d}t \\
F=qv_{d}B\sin \phi
\end{cases}
\implies \vec{F}=i\vec{l}\times \vec{B}
$$
对于任意导线，若磁场恒定：
$$
\vec{F}=\int id\vec{l}\times \vec{B}=i\left( \int \vec{l} \right)\times \vec{B}=i\vec{L}\times \vec{B}
$$
这里 $\vec{L}$ 为导线首尾相接得到的矢量。

### 磁偶极矩/磁矩（Magnetic Dipole）

![[Magnetism - 磁学-1.png|538]]

$$
F_{\text{side}}=aIB
$$
$$
\tau=2\times\frac{1}{2}baIB\sin\theta=baIB\sin\theta
$$
定义磁偶极矩 $\vec{\mu}=I\vec{A}$，其方向为右手握电流，大拇指指向的方向，垂直于线圈。 
则有
$$
\tau=\mu \times B
$$
若有 $N$ 匝（Loops）的线圈，则 $\vec{\mu}=Ni\vec{A}$。
和电偶极矩类似，磁矩也会带势能：
$$
U=-\vec{\mu}\cdot \vec{B}
$$
这里势能零点就是 $\vec{\mu} \perp \vec{B}$ 的情况。

## 电流产生的磁场

电流产生磁场的方向可以用右手定则判断（右手握电流，大拇指指向电流方向，四指即为磁场方向）。

### 毕奥-萨伐尔定律（Biot-Savart Law）

$$
d\vec{B}=\frac{\mu_{0}}{4\pi}  \frac{id\vec{s}\times \hat{r}}{r^{2}}
$$
这里 $d\vec{s}$ 为沿着电流方向的一小段长度。$\mu_{0}=4\pi \times 10^{-7}$ 为磁导率（Permeability）。
对一个无穷长的直导线，积分得到
$$
B=\int_{-\infty}^{\infty} \frac{\mu_{0}}{4\pi} \frac{i dz}{z^{2}+R^{2}} \frac{R}{\sqrt{ z^{2}+R^{2} }}=\frac{\mu_{0}i}{2\pi R} 
$$
其中 $R$ 为某点到导线的垂直距离。
若导线不是直的，则可以分解为 $x,y,x$ 三个分量分别积分。
$1\text{A}$ 的大小是通过两个平行直导线之间磁场力的大小来定义的。
一个角度为 $\varphi$  圆弧形导线：
$$
B=\int \frac{\mu_{0}}{4\pi} \frac{ird\theta}{r^{2}}=\frac{\mu_{0}i\varphi}{4\pi r}
$$



### 安培定律（Ampere's Law）

磁场的高斯定律（Gauss）：对于一个高斯面，有 
$$
\oint \vec{B}\cdot d\vec{A}=0
$$
这对计算磁场没有什么帮助。
有安培定律：
$$
\oint \vec{B}\cdot d\vec{l}=\mu_{0}I_{\text{enc}}
$$
这里选择一个回路的方向，则定义满足回路方向右手定则的电流为正，反之为负。
定律使用的条件：电流稳定，没有磁性材料，且没有随时间变化的电场。
*或者，定义磁场强度（The Intensity of a magnetic field）为 $H$，有 $\oint \vec{H}\cdot d\vec{l}=I_{\text{enc}}$.

![[Magnetism - 磁学-2.png|438]]
理想的螺线管 (Solenoid)：
$$
\oint \vec{B}\cdot d\vec{l}=BL=\mu_{0} nLI\implies B=\mu_{0}nI
$$
其中 $n$ 为匝数的线密度（$\text{/m}$）。
![[Magnetism - 磁学-3.png|530]]
环形螺线管（Toroid / Toroidal Solenoid），在螺线管内部：
$$
\oint \vec{B}\cdot d\vec{l}=2\pi rB=\mu_{0}NI\implies B=\frac{\mu_{0}NI}{2\pi r} 
$$
其中 $N$ 为总匝数。
![[Magnetism - 磁学-4.png|510]] 
电流平板（Current Sheet）：假设电流线密度均匀且为 $J_{S}$，有
$$
\oint \vec{B}\cdot d\vec{r}=2BL=\mu_{0} (J_{S}L)\implies B=\frac{1}{2}\mu_{0}J_{S}
$$
### 电磁感应

楞次定律（Lenz's law）：电磁感应产生的电动势和感应电流的方向为抗拒磁通量改变的方向。
法拉第定律（Faraday's law）：电动势和磁通量的变化率成正比。
$$
\varepsilon \propto  \frac{d\Phi_{B}}{dt}
$$
这里 $\Phi_{B}=\int \vec{B}\cdot d\vec{A}$。
结合这两个定律，可以证明：
$$
\varepsilon=- \frac{d\Phi_{B}}{dt}=-\frac{d}{dt} \int \vec{B}\cdot d\vec{A} 
$$
这里的正方向是右手定则确定的。
另外有
$$
\left| \varepsilon \right| = \frac{d\Phi}{dt}=B \frac{dA}{dt}+A \frac{dB}{dt}
$$
注意多圈的线圈要乘上 $N$。
考虑激发的电场，一个回路中有关系：
$$
\varepsilon=\oint \vec{E}\cdot d\vec{l}
$$
所以这里的电场和静电场不同，没有起点和终点，不是保守场。（基尔霍夫定律不直接适用，要考虑感应电动势）
故有
$$
\oint \mathbf{E}d\mathbf{l}=-\frac{d}{dt}\int \mathbf{B}d\mathbf{A}
$$

### 电感

变化的电流会产生变化的磁场，从而产生感应电动势，来抵抗电流的变化，这就叫自感电动势 （Self-Induced emf）。
定义自感的电感（Self-Inductance）：
$$
L= \frac{N\Phi_{B}}{i}
$$
电感是元器件自己的属性，单位为亨利（Henry）。
那么自感电动势为（相当于沿着电流方向从负极穿到正极，大小为 $\varepsilon_{L}$ 的一个电池）
$$
\varepsilon_{L}=-L \frac{di}{dt}
$$
螺线管的电感：
$$
L= \frac{N\Phi_{B}}{i}=\frac{(nl)(\mu_{0}in)A}{i}=\mu_{0}n^{2}lA
$$
RL 电路：

![[Magnetism and Induction - 磁学与电磁感应.png]]
令时间常数 $\tau=\frac{L}{R}$，时间常数大，电流就变化得慢。

![[Magnetism and Induction - 磁学与电磁感应-1.png]]

电感器件的磁场中可以存储能量：
$$
  \frac{dU_{B}}{dt}=iL \frac{di}{dt}
$$
$$
\implies U_{B}= \frac{1}{2}Li^{2}
$$
直螺线管中，能量密度
$$
u_{B}= \frac{U_{B}}{Al}= \frac{Li^{2}}{2Al}= \frac{B^{2}}{2\mu_{0}}
$$

互感（Mutual Induction）：一个螺线管中电流变化，会引发磁场变化，引发另一个螺线管中产生感应电动势。
线圈 2 关于线圈 1 的互感强度(Mutual Inductance)：
$$
M_{21}= \frac{N_{2}\Phi_{21}}{i_{1}}
$$
从而有 $\varepsilon_{2}=-M_{21} \frac{di_{1}}{dt}$。
类似的，$\varepsilon_{1}=-M_{12} \frac{di_{2}}{dt}$。
这里 $M_{21}=M_{12}=\frac{N_{2}\Phi_{21}}{i_{1}}=\frac{N_{1}\Phi_{12}}{i_{2}}$。
