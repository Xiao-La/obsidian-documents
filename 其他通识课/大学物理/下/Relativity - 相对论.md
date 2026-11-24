狭义相对论的两个基本假设（Postulates）：
- 物理规律在所有惯性参考系（Inertial Reference Frame）中具有相同形式，没有哪个参考系是特殊的。
- 真空光速在所有惯性参考系、所有方向上都是 $c$，与光源的运动无关。

世界点（事件，Event）：四维时空中的一个点 $(t,x,y,z)$。
世界线：物体在四维时空中运动画出的线。
两个世界点之间的时空间隔（Space-Time Interval）
$$
s^{2}=[c(t_{2}-t_{1})]^{2}-[(x_{2}-x_{1})^{2}+(y_{2}-y_{1})^{2}+(z_{2}-z_{1})^{2}] = (c\Delta t)^{2}- l^{2}
$$
是一个和参考系无关的量。从这个就可以推导出所有狭义相对论。

## 洛伦兹变换（Lorentz Transformation）

设 $S'$ 系以速度 $v$ 沿 $x$ 轴正方向相对于 $S$ 系运动。定义速度参数（Speed Parameter）$\beta=v/c$ 和洛伦兹因子（Lorentz Factor）
$$
\gamma= \frac{1}{\sqrt{ 1-\beta^{2} }}\geq 1
$$
低速（$v\ll c$）时用的是伽利略变换（Galilean Transformation），时间是绝对的：
$$
x=x'+vt',\quad t=t'
$$
洛伦兹变换（写成两个事件之差的形式）：
$$
\Delta x=\gamma(\Delta x'+v\Delta t'),\quad \Delta t=\gamma\left( \Delta t'+ \frac{v\Delta x'}{c^{2}} \right)
$$
垂直于运动的方向不变：$\Delta y=\Delta y',\Delta z=\Delta z'$。
逆变换只要把 $v$ 换成 $-v$：
$$
\Delta x'=\gamma(\Delta x-v\Delta t),\quad \Delta t'=\gamma\left( \Delta t- \frac{v\Delta x}{c^{2}} \right)
$$

速度变换：物体在 $S'$ 中沿 $x$ 方向的速度为 $u'$，那么在 $S$ 中的速度为
$$
u= \frac{u'+v}{1+u'v / c^{2}}
$$
反过来，$S$ 中速度为 $u$，则 $S'$ 中速度为
$$
u'= \frac{u-v}{1-uv / c^{2}}
$$
$v\ll c$ 时就退化为 $u=u'+v$。无论 $u'$ 和 $v$ 多接近光速，$u$ 都不会超过 $c$；若 $u'=c$，则 $u=c$，这正是光速不变。

## 同时性的相对性（Simultaneity）

两个事件在 $S'$ 中同时、不同地发生：$\Delta t'=0,\Delta x'\neq 0$。代入洛伦兹变换
$$
\Delta t=\gamma \frac{v\Delta x'}{c^{2}}\neq 0
$$
所以在 $S$ 中看，它们不是同时发生的。

## 时间膨胀（Time Dilation）

光钟：$S'$ 中光在相距 $d$ 的两面镜子之间往返一次，用时 $\Delta t_{0}=2d / c$。在 $S$ 中看，镜子在横向运动，光走的是斜线：
$$
\Delta t= \frac{2}{c}\sqrt{ d^{2}+\left( \frac{v\Delta t}{2} \right)^{2} }
$$
两式联立得到
$$
\Delta t= \frac{\Delta t_{0}}{\sqrt{ 1-\beta^{2} }}=\gamma \Delta t_{0}
$$
也可以直接用洛伦兹变换：$\Delta x'=0$ 时 $\Delta t=\gamma \Delta t'$。

固有时间/原时（Proper Time）$\Delta t_{0}$：两个事件在某个惯性系中发生在**同一地点**，在这个参考系中测得的时间间隔。在其他任何惯性系中测同一对事件，时间间隔都更长，也就是“动钟变慢”。
- 例如飞船上的人吃一顿饭，开始和结束都在飞船上的同一位置，飞船上一只钟就能测出来，测得的是原时 $\Delta t_{0}$。
- 地面上看，这两件事发生在不同的位置，要用两只同步好的钟来测，测得的是 $\gamma \Delta t_{0}$。

## 长度收缩（Length Contraction）

固有长度/原长（Proper Length）$l_{0}$：在物体静止的参考系中测得的长度。
设一根杆静止在 $S'$ 中，沿 $x$ 轴放置，那么 $\Delta x'=l_{0}$。在 $S$ 中杆在运动，测它的长度必须**同时**记录两端的位置，即 $\Delta t=0$，此时 $\Delta x=l$。代入逆变换 $\Delta x'=\gamma(\Delta x-v\Delta t)$ 得到 $l_{0}=\gamma l$，即
$$
l= \frac{l_{0}}{\gamma}=l_{0}\sqrt{ 1-\beta^{2} }
$$
也就是“动尺变短”。只有平行于运动方向的长度会收缩，垂直方向不变。

原长和原时往往不在同一个参考系。以飞船从地球飞到海王星为例：
- 地球上看，地球和海王星不动，它们的距离是原长 $l_{0}$；出发和到达发生在不同地点，飞行时间 $\Delta t=l_{0} / v$ 不是原时。
- 飞船上看，出发和到达都发生在飞船所在的位置，飞行时间是原时 $\Delta t_{0}=\Delta t / \gamma$；而地球和海王星以 $v$ 运动，它们的距离收缩为 $l=l_{0} / \gamma=v\Delta t_{0}$。

## 多普勒效应（Doppler Effect）

光源和观察者的相对速度为 $v$，$\beta=v/c$，光源静止系中测得的频率为固有频率（Proper Frequency）$f_{0}$。光的传播不需要介质，所以结果只和相对速度有关。
相互远离时：
$$
f=f_{0}\sqrt{ \frac{1-\beta}{1+\beta} }
$$
相互靠近时，把 $\beta$ 换成 $-\beta$ 即可。
远离时频率变小、波长变大，就是红移（Red Shift）；靠近时反之，是蓝移（Blue Shift）。

横向多普勒效应（Transverse Doppler Effect）：光源的运动方向垂直于观察方向时，只剩下时间膨胀的效果：
$$
f=f_{0}\sqrt{ 1-\beta^{2} }
$$
