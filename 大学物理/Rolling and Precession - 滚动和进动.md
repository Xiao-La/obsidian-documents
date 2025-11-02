前置： [[Rotation - 定轴转动]]
## 滚动

纯滚动 (Smooth Rolling) = 纯平动 + 纯转动。
其中平动和转动的关系满足 $v_{com}=\omega R$，这可以用位移求导得出。
在每一个瞬间，也可以看作绕着点 P 的纯转动。
证明： [[Rolling-1]]
![[Rolling-1.png]]

纯滚动的动能 $K=K_{translation}+K_{rotation}=\frac{1}{2}mv_{com}^2 + \frac{1}{2} I_{com} \omega^2$。
力矩 $\tau_{net}=I_{com}\alpha$。
动能定理 $W_{net}=\int \vec{F_ {{net}} } d\vec{r_{com}}+\int \tau_{net}d\theta=\Delta K=\Delta K_{translation}+\Delta K_{rotation}$。

质点的角动量 $\vec{\mathscr{l}}=\vec{r}\times \vec{p}$。
刚体的角动量在 $z$ 轴的分量 $\vec{L_{z}}=I\vec{\omega}$。
容易推出 $\tau=\frac{d\mathscr{\vec{l}}}{dt}$。进一步的，若 $\tau$ 为 0，则 $\mathscr{l}$ 不变。
质心系：$L_{tot}=\vec{R}\times M\vec{v}+L_{com}$。

计算中常用 $\gamma =\frac{I^2}{MR^2}$ 简化表达式。
## 进动

**进动（Precession）** 是指自转刚体受外力作用时自转轴绕某一中心旋转的现象。
![[Precesssion-1.png]]
```image-layout-a
![[Precession-2.png]]
![[Precession-3.png]]
```

过程中，进动角速度 $\Omega=\frac{d\phi}{dt}=\frac{\frac{dL}{L}}{dt}=\frac{\tau}{L}= \frac{Mgr}{I\omega}$。
进动角速度的方向和 $\omega$ 的方向有关。 