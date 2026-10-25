 平动和转动有许多对应的地方，应该对比着学习。

| Translation         | Rotation                    |
| ------------------- | --------------------------- |
| $x$                 | $\theta$                    |
| $v=\frac{\mathrm{d}x}{\mathrm{d}t}$   | $\omega=\frac{\mathrm{d}\theta}{\mathrm{d}t}$ |
| $a=\frac{\mathrm{d}v}{\mathrm{d}t}$   | $\alpha=\frac{\mathrm{d}\omega}{\mathrm{d}t}$ |
| $m$                 | $I$                         |
| $F_{\mathrm{net}}=ma$        | $\tau_{\mathrm{net}} = I\alpha$      |
| $W=\int F\ \mathrm{d}x$      | $W = \int \tau\ \mathrm{d}\theta$    |
| $K=\frac{1}{2}mv^2$ | $K=\frac{1}{2}I\omega^2$    |
| $P=Fv$              | $P=\tau\omega$              |
| $W=\Delta K$        | $W = \Delta K$              |
 在转动中，质量 $m$ 与转动惯量 $I$ 对应，力 $F$ 与力矩 $\tau$ 对应。

 **差异**：转动中的加速度分为 **切向加速度** 和 **法向加速度**，对应公式 $$  \mathbf{a}=\alpha r \hat{\mathbf{t}}+\omega^2r\hat{\mathbf{r}_{c}}$$

质点的转动惯量为 $mr^2$，刚体的转动惯量 $I=\int r^2\,\mathrm{d}m$，一般不太好算，所以会给一些常见几何体的（转轴过质心情况下的）转动惯量表。
 然后可以用平行轴定理 $I=I_{\mathrm{com}}+Mh^2$ 算出新转轴下的转动惯量。

**算轴力**：由于轴力对转动没有贡献，需要对质点进行运动学分析。