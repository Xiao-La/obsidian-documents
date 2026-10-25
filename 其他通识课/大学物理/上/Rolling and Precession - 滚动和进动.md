前置： [[Rotation - 定轴转动]]
## 滚动

纯滚动 (Smooth Rolling) = 纯平动 + 纯转动。
其中平动和转动的关系满足 $v_{\mathrm{com}}=\omega R$，这可以用位移求导得出。
在每一个瞬间，也可以看作绕着点 P 的纯转动。
证明： [[Rolling-1]]
![[Rolling-1.png]]

纯滚动的动能 $K=K_{\mathrm{translation}}+K_{\mathrm{rotation}}=\frac{1}{2}mv_{\mathrm{com}}^2 + \frac{1}{2} I_{\mathrm{com}} \omega^2$。
力矩 $\tau_{\mathrm{net}}=I_{\mathrm{com}}\alpha$。
动能定理 $W_{\mathrm{net}}=\int \mathbf{F}_{\mathrm{net}}\cdot \mathrm{d}\mathbf{r}_{\mathrm{com}}+\int \tau_{\mathrm{net}}\,\mathrm{d}\theta=\Delta K=\Delta K_{\mathrm{translation}}+\Delta K_{\mathrm{rotation}}$。

质点的角动量 $\boldsymbol{\mathscr{l}}=\mathbf{r}\times \mathbf{p}$。
刚体的角动量在 $z$ 轴的分量 $L_z=I\omega$。
容易推出 $\boldsymbol{\tau}=\frac{\mathrm{d}\boldsymbol{\mathscr{l}}}{\mathrm{d}t}$。进一步的，若 $\boldsymbol{\tau}$ 为 0，则 $\boldsymbol{\mathscr{l}}$ 不变。
质心系：$\mathbf{L}_{\mathrm{tot}}=\mathbf{R}\times M\mathbf{v}+\mathbf{L}_{\mathrm{com}}$。

计算中常用 $\gamma =\frac{I_{\mathrm{com}}}{MR^2}$ 简化表达式。
## 进动

**进动（Precession）** 是指自转刚体受外力作用时自转轴绕某一中心旋转的现象。
![[Precesssion-1.png]]
```image-layout-a
![[Precession-2.png]]
![[Precession-3.png]]
```

过程中，进动角速度 $\Omega=\frac{\mathrm{d}\phi}{\mathrm{d}t}=\frac{\frac{\mathrm{d}L}{L}}{\mathrm{d}t}=\frac{\tau}{L}= \frac{Mgr}{I\omega}$。
进动角速度的方向和 $\omega$ 的方向有关。