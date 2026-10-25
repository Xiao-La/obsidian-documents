线性变换将一个向量空间映射到另一个向量空间 $T:V\to W$，它满足这两个条件：
$$
\text{1. }T(\boldsymbol{a}+\boldsymbol{b})=T(\boldsymbol{a})+T(\boldsymbol{b})
$$
$$
\text{2. }T(k\boldsymbol{a})=kT(\boldsymbol{a})
$$
线性变换可以用矩阵表示，其定义如下：
设 $V$ 和 $W$ 是同一个数域 $F$ 上的有限维向量空间，且 $\dim(V) = n$，$\dim(W) = m$。设 $T: V \to W$ 是一个从 $V$ 到 $W$ 的线性变换。设 $\boldsymbol{\alpha}_1, \boldsymbol{\alpha}_2, \dots, \boldsymbol{\alpha}_n$ 是定义域 $V$ 的一组基， $\boldsymbol{\beta}_1, \boldsymbol{\beta}_2, \dots, \boldsymbol{\beta}_m$ 是目标域 $W$ 的一组基。那么 $T(\boldsymbol{\alpha}_j)$ 可以唯一地表示为这些基向量的线性组合：
$$T(\boldsymbol{\alpha}_j) = a_{1j}\boldsymbol{\beta}_1 + a_{2j}\boldsymbol{\beta}_2 + \dots + a_{mj}\boldsymbol{\beta}_m = \sum_{i=1}^m a_{ij}\boldsymbol{\beta}_i$$
我们将上述 $n$ 个等式（$j=1, 2, \dots, n$）中的系数 $a_{ij}$ 排列成一个 $m \times n$ 的矩阵 $A$。具体来说，把 $T(\boldsymbol{\alpha}_j)$ 在基 $\beta$ 下的坐标列向量作为矩阵 $A$ 的第 $j$ 列：

$$A = \begin{pmatrix}
a_{11} & a_{12} & \dots & a_{1n} \\
a_{21} & a_{22} & \dots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \dots & a_{mn}
\end{pmatrix}$$

这个矩阵 $A$ 就称为**线性变换 $T$ 在基 $\alpha$ 和基 $\beta$ 下的矩阵表示**。
上述关系通常可以用分块矩阵的形式简记为：
$$T(\boldsymbol{\alpha}_1, \boldsymbol{\alpha}_2, \dots, \boldsymbol{\alpha}_n) = (\boldsymbol{\beta}_1, \boldsymbol{\beta}_2, \dots, \boldsymbol{\beta}_m) A$$

矩阵表示的意义：如果 $V$ 中的向量 $\boldsymbol{v}$ 在基 $\alpha$ 下的坐标列向量为 $\boldsymbol{x} = (x_1, x_2, \dots, x_n)^{\top}$；其像 $T(\boldsymbol{v})$ 在 $W$ 的基 $\beta$ 下的坐标列向量为 $\boldsymbol{y} = (y_1, y_2, \dots, y_m)^{\top}$。那么，抽象的线性变换 $T(\boldsymbol{v})$ 等价于其坐标向的矩阵乘法 $\boldsymbol{y} = A\boldsymbol{x}$。



**旋转矩阵**
$$
T_{\theta}=\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$
表示将 $\mathbb{R}^{2}$ 的基向量 $\boldsymbol{i}=(1,0),\boldsymbol{j}=(0,1)$ 绕原点逆时针旋转 $\theta$ ：
$$
\boldsymbol{i}'=T_{\theta}(\boldsymbol{i})=T_{\theta}\begin{bmatrix}
1 \\
0
\end{bmatrix}=\begin{bmatrix}
\cos\theta \\
\sin\theta
\end{bmatrix}
$$
$$
\boldsymbol{j}'= T_{\theta}(\boldsymbol{j})=T_{\theta}\begin{bmatrix}
0 \\
1
\end{bmatrix}
=\begin{bmatrix}
-\sin\theta \\
\cos\theta
\end{bmatrix}
$$
**投影矩阵**
$$
P_{\theta}=\begin{bmatrix}
\cos ^{2}\theta & \cos\theta \sin\theta \\
\cos\theta \sin\theta & \sin ^{2}\theta
\end{bmatrix}
$$
表示将 $\mathbb{R}^{2}$ 的基向量 $\boldsymbol{i}=(1,0),\boldsymbol{j}=(0,1)$ 投影到 $\boldsymbol{v}=(\cos\theta, \sin\theta)$ 上。

**反射矩阵**
$R_{\theta}:\mathbb{R}^{2}\to \mathbb{R}^{2}$ 表示向量由 $\boldsymbol{v}=(\cos\theta, \sin\theta)$ 反射。由几何关系有
$$
 R_{\theta}(\boldsymbol{v})+\boldsymbol{v}=2P_{\theta}(\boldsymbol{v})
$$
那么就有
$$
R_{\theta}=2P_{\theta}-I=\begin{bmatrix}
\cos(2\theta) & \sin(2\theta) \\
\sin(2\theta) & -\cos(2\theta)
\end{bmatrix}
$$

这里的变换矩阵和**基的选取**有关。
线性变换的变换基（Change of basis）：若 $T:V\to V$ 是一个线性变换，而 $A$ 是 $T$ 在基 $\boldsymbol{v}_{1}, \dots, \boldsymbol{v}_{n}$ 下的矩阵表示，$B$ 是 $T$  在基 $\boldsymbol{w}_{1},\dots, \boldsymbol{w}_{n}$ 下的矩阵表示。
若 $\begin{bmatrix}\boldsymbol{w}_{1} \dots \boldsymbol{w}_{n}\end{bmatrix}=\begin{bmatrix}\boldsymbol{v}_{1}\dots \boldsymbol{v}_{n}\end{bmatrix}S$，则有 $B=S^{-1}AS$。

**理解：** $W\boldsymbol{x}=V(S\boldsymbol{x})$。也就是说，$W$ 基下的坐标 $\boldsymbol{x}$ 对应 $V$ 基下的坐标 $S\boldsymbol{x}$！所以，在基 $W$ 下，线性变换的矩阵表示为 $\boldsymbol{y}=B\boldsymbol{x}$，这里 $\boldsymbol{x},\boldsymbol{y}$ 都是 $W$ 基下的坐标。把 $\boldsymbol{y}=B\boldsymbol{x}$ 翻译成 $V$ 基下的坐标：$S\boldsymbol{y}=A(S\boldsymbol{x})$！对比一下，就可以得到 $B=S^{-1}AS$！