 平动和转动有许多对应的地方，应该对比着学习。

| Translation         | Rotation                    |
| ------------------- | --------------------------- |
| $x$                 | $\theta$                    |
| $v=\frac{dx}{dt}$   | $\omega=\frac{d\theta}{dt}$ |
| $a=\frac{dv}{dt}$   | $\alpha=\frac{d\omega}{dt}$ |
| $m$                 | $I$                         |
| $F_{net}=ma$        | $\tau_{net} = I\alpha$      |
| $W=\int F\ dx$      | $W = \int I\ d\theta$       |
| $K=\frac{1}{2}mv^2$ | $K=\frac{1}{2}I\omega^2$    |
| $P=Fv$              | $P=\tau\omega$              |
| $W=\Delta K$        | $W = \Delta K$              |
 在转动中，质量 $m$ 与转动惯量 $I$ 对应，力 $F$ 与力矩 $\tau$ 对应。
 **差异**：转动中的加速度分为 **切向加速度** 和 **法向加速度**，对应公式 $$  \vec{a}=\alpha r \hat{t}+w^2r\hat{r_{c}}$$ 
 转动惯量 $I=\int r^2dm$，一般不太好算，所以会给一些常见几何体的（转轴过质心情况下的）转动惯量表。
 然后可以用平行轴定理 $I=I_{com}+Mh^2$ 算出新转轴下的转动惯量。