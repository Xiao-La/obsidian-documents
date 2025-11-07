## 平衡 

**平衡（equilibrium）** 状态需要运动状态不变，故而它的条件：
1. 线动量为常数：$F_{net}=\frac{dp}{dt}=0$。
2. 角动量为常数：$\tau_{net}=\frac{d\mathscr{l}}{dt}=0$（需对任意参考点都成立）。
进一步的，静态平衡（Static Equilibrium）需要 $p=0, \mathscr{l}=0$。

*对于合力矩为 0，理论上根据参考点的不同，可列无数个方程；但最多有多少个方程相互独立，取决于系统的自由度。*

**重心（center of gravity, cog）** 指的是重力作用的等效点。
**质心（center of mass, com）** 指的是质量分布的平均位置。
当物体受到的重力加速度处处相等时，它存在重心，而且和质心重合。

## 弹性

![[Elasticity-1.png]]
上图展示了三种**应力（stress）**：拉伸力（tensile stress）/ 剪切力（shearing stress）/ 静水压力（液应力，hydraulic stress）

 $$
\text{应力（stress） = 模量（modulus）}\times \text{应变（strain）}
$$

特别的，对应拉伸力，上面的式子变成：
$$
\frac{F}{A}=E\frac{\Delta L}{L}
$$
这里的 $E$ 被称作**杨氏模量（Young's modulus）**。
类似的，对剪切力，有**剪切模量（shear modulus）** -  $G$，以及 $\frac{F}{A}=G \frac{\Delta x}{L}$。
对静水压力，有**体变模量（bulk modulus）** - $B$，以及 $\frac{F}{A}=B \frac{\Delta V}{V}$。
![[Elasticity-2.png]]
在应力达到 **抗屈强度（yield strength）** 后，发生塑性形变。在**极限强度（ultimate strength）**，发生破裂。

**扭转（twisting）** 物体会产生响应的力矩来阻止这个扭转，满足公式：
$$
\tau = -\kappa \theta
$$
其中 $\kappa$ 是**扭转常数（torsion constant）**。

*对于刚体，modulus 可认为是无穷大，因为它们不能变形。*