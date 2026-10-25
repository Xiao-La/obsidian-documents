
$\boldsymbol{x}, \boldsymbol{y} \in \mathbb{R}^{n}$ 正交（Orthogonal）定义为  $\boldsymbol{x}^{\top}\boldsymbol{y}=0$。
$\boldsymbol{x}\in \mathbb{R}^n$ 的长度（Length）定义为 $\lVert \boldsymbol{x}\rVert  = \sqrt{ \boldsymbol{x}^{\top}\boldsymbol{x} }$。
$\boldsymbol{x},\boldsymbol{y}\in \mathbb{R}^n$ 之间的角度定义为 $\cos\theta= \frac{\boldsymbol{x}^{\top}\boldsymbol{y}}{\lVert \boldsymbol{x} \rVert\lVert \boldsymbol{y} \rVert}$。

**柯西-施瓦茨不等式（Cauchy-Schwarz）：** 对于任意两个内积空间中的向量 $\boldsymbol{x},\boldsymbol{y}$，有：
$$
\lvert \boldsymbol{x}\cdot \boldsymbol{y}\rvert ^{2}\leq \lvert \boldsymbol{x} \cdot \boldsymbol{x} \rvert \lvert \boldsymbol{y}\cdot \boldsymbol{y} \rvert
$$
这和角度的定义相统一，因为 $\lvert \cos\theta\rvert \leq 1$ 。

定理：若一组向量相互正交且它们不是零向量，则它们是线性无关的。
- 证明：对于方程 $c_{1}\boldsymbol{v}_{1}+c_{2}\boldsymbol{v}_{2}+\dots+c_{n}\boldsymbol{v}_{n}=0$，将它点乘 $\boldsymbol{v}_{1}$ 得 $\boldsymbol{v}_{1}^{\top}(c_{1}\boldsymbol{v}_{1}+c_{2}\boldsymbol{v}_{2}+\dots+c_{n}\boldsymbol{v}_{n})=0$，也就是说 $\boldsymbol{v}_{1}^{\top}c_{1}\boldsymbol{v}_{1}=c_{1}\lVert \boldsymbol{v}_{1} \rVert^{2}=0$。由于 $\lVert \boldsymbol{v}_{1} \rVert\neq 0$，那么 $c_{1}=0$。类似的 $c_{i}$ 都为 $0$。

两个子空间 $V,W$ 彼此正交定义为 $\forall \boldsymbol{v}\in V, \boldsymbol{w}\in W$，有 $\boldsymbol{v}^{\top}\boldsymbol{w}=0$。记作 $V \perp W$。

$C(A)\perp N(A^{\top})$
- 证明：$\boldsymbol{b} \in C(A) \implies \exists \boldsymbol{x},\text{s.t. }A\boldsymbol{x}=\boldsymbol{b}$；$\boldsymbol{y}\in N(A^{\top})\implies \boldsymbol{y}^{\top}A=0$。从而 $\boldsymbol{y}^{\top}\boldsymbol{b}=\boldsymbol{y}^{\top}(A\boldsymbol{x})=(\boldsymbol{y}^{\top}A)\boldsymbol{x}=0$。从而 $\boldsymbol{y}^{\top}\perp \boldsymbol{b}$。

$C(A^{\top})\perp N(A)$
- 证明：$\boldsymbol{x}\in N(A)\implies A\boldsymbol{x}=0\implies \boldsymbol{x}^{\top}A^{\top}=0$，故 $\boldsymbol{x}\perp A^{\top}$。

$V\subseteq \mathbb{R}^n$ 的垂直补（Orthogonal Complement）定义为所有满足 $\boldsymbol{v}\perp V$ 的向量 $\boldsymbol{v}$ 组成的集合，记作 $V^{\perp}$。一个空间和其垂直补的维数之和为 $n$。

可以证明 $C(A)^{\perp}=N(A^{\top}), C(A^{\top})^{\perp}= N(A)$。
- $A\boldsymbol{x}=\boldsymbol{b}$ 相容的一个等价条件：$\boldsymbol{y}^{\top}\boldsymbol{b}=0 , \forall \boldsymbol{y}\in N(A^{\top})$。

$A$ 表示的线性变换把 $C(A^{\top})$ 映射到 $C(A)$ 中，把 $N(A)$ 映射到 $0$。对于任何一个 $n$ 维向量 $\boldsymbol{x}$，它可以写成 $\boldsymbol{x}=\boldsymbol{x}_{r}+\boldsymbol{x}_{n}$，而 $A\boldsymbol{x}=A(\boldsymbol{x}_{r}+\boldsymbol{x}_{n})=A\boldsymbol{x}_{r}$。这里 $\boldsymbol{x}_{r}$ 是行空间中的一个向量，而 $A\boldsymbol{x}_{r}$ 是列空间中的一个向量。所以从几何上看，它把自己的行空间映射到列空间。

## 投影与最小平方解

$\boldsymbol{b}$ 在非零向量 $\boldsymbol{a}$ 上的投影（Projection）：$\boldsymbol{p}= \lVert \boldsymbol{b} \rVert\cos\theta  \frac{\boldsymbol{a}}{\lVert \boldsymbol{a} \rVert}=\frac{\boldsymbol{a}^{\top}\boldsymbol{b}}{\lVert \boldsymbol{a} \rVert^{2}}\boldsymbol{a}$。
投影的矩阵表示： $T:\mathbb{R}^n\to \mathbb{R}^n, \boldsymbol{b} \mapsto \frac{\boldsymbol{a}^{\top}\boldsymbol{b}}{\lVert \boldsymbol{a} \rVert^{2}}\boldsymbol{a}$。所以矩阵表示就是 $\frac{\boldsymbol{a}\boldsymbol{a}^{\top}}{\boldsymbol{a}^{\top}\boldsymbol{a}}$。

应用：**最小平方解（Least Square Solutions）**，求平方和 $\sum_{i=1}^m(a_{i1}x_{1}+a_{i2}x_{2}+\dots+a_{in}x_{n}-b_{i})^{2}$ 的最小值，其中 $a_{ij}, b_{i}$ 为常数。
- 把问题转换为求 $\lVert A\boldsymbol{x}-\boldsymbol{b} \rVert^{2}$ 的最小值。$A$ 将 $\boldsymbol{x}$ 映射到 $C(A)$ 中。在平面 $C(A)$ 中的向量 $A\boldsymbol{x}$ 与任意向量 $\boldsymbol{b}$ 终点连线的长度最小，需要这个连线与 $C(A)$ 垂直，所以 $\boldsymbol{b}-A\hat{\boldsymbol{x}} \in C(A)^{\perp}=N(A^{\top})$。那么 $A^{\top}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=0$。
- **只需解方程 $(A^{\top} A)\hat{\boldsymbol{x}}=A^{\top} \boldsymbol{b}$。**
- 为什么这个方程组有解？从几何角度可以理解。
- 也可以通过证明 $\operatorname{rank}(A^{\top}A)=\operatorname{rank}(\begin{bmatrix}A^{\top}A &A^{\top}\boldsymbol{b}\end{bmatrix})$。
  - 显然 $\operatorname{rank}(A^{\top}A)\leq\operatorname{rank}(\begin{bmatrix}A^{\top}A &A^{\top}\boldsymbol{b}\end{bmatrix})$。
  - 另有 $\operatorname{rank}(A^{\top}A)=\operatorname{rank}(A^{\top})\geq\operatorname{rank}(A^{\top} \begin{bmatrix}A & \boldsymbol{b}\end{bmatrix})=\operatorname{rank}(\begin{bmatrix}A^{\top}A & A^{\top}\boldsymbol{b}\end{bmatrix})$。
- 若 $A^{\top} A$ 可逆，则 $\hat{\boldsymbol{x}}=(A^{\top}A)^{-1}A^{\top} \boldsymbol{b}$ 。也就是，$A$ 的最优左逆左乘 $\boldsymbol{b}$。
- 若 $A$ 可逆，则可以进一步得到 $\hat{\boldsymbol{x}}=A^{-1}\boldsymbol{b}$。

对于 $n=2$ 的情况就是用最小二乘法求线性回归直线。
- 设这个回归直线为  $b=C+Dt$。则要使得残差平方和 $\sum_{i=1}^m(C+Dt_{i}-b_{i})^{2}$ 最小。
- 这里

  $$
  A=\begin{bmatrix}1 & t_{1} \\ 1  & t_{2} \\ \dots & \dots \\ 1 & t_{m}\end{bmatrix}
  $$

  ，

  $$
  \boldsymbol{b}=\begin{bmatrix}b_{1} \\ b_{2} \\ \dots \\ b_{m}\end{bmatrix}
  $$

  。
- 则只需解方程

  $$
  A^{\top}A\begin{bmatrix}C \\ D\end{bmatrix}=A^{\top}\boldsymbol{b}
  $$

   即可求出直线的系数。
- 为了方便计算，可以让 $b=C_{1}+D_{1}(t-\bar{t})$，这里原直线的参数 $C=C_{1}-D_{1}\bar t, D=D_{1}$。那么

  $$
  A=\begin{bmatrix}1 & t_{1}-\bar{t} \\ 1 & t_{2}-\bar{t} \\ \dots & \dots \\ 1 & t_{m}-\bar{t}\end{bmatrix}
  $$

  ，则 $A=\begin{bmatrix}\boldsymbol{v}_{1} & \boldsymbol{v}_{2}\end{bmatrix}$ 的两列是正交的。那么 $\hat{C}_1=\frac{\boldsymbol{v}_{1}^{\top}b}{\boldsymbol{v}_{1}^{\top}\boldsymbol{v}_{1}},\hat{D}_1=\frac{\boldsymbol{v}_{2}^{\top}b}{\boldsymbol{v}_{2}^{\top}\boldsymbol{v}_{2}}$。

考虑这个几何问题，选取 $C(A)$ 的一组基作为 $A$ 的列（列满秩）。
- 由于 $A\hat{\boldsymbol{x}}$ 为 $C(A)$ 上使得其终点与 $\boldsymbol{b}$ 终点连线垂直于 $C(A)$ 的向量，$\boldsymbol{b}$ 在 $C(A)$ 上的投影即为 $\boldsymbol{p}=A\hat{\boldsymbol{x}}=A(A^{\top}A)^{-1}A^{\top}\boldsymbol{b}$。
- 那么投影到 $C(A)$ 的线性变换的矩阵表示为 $P=A(A^{\top}A)^{-1} A^{\top}$。
- 这里 $P$ 有些性质。比如 $P^{2}=P$, $P^{\top}=P$。


**定义投影矩阵（Projection Matrix）**：满足 $P^{2}=P$ 且 $P^{\top}=P$ 的矩阵。
- 任何投影矩阵都来自于投影到某个列空间 $C(A)$ 的投影。
- 推论：容易验证 $Q=I-P$ 也是投影矩阵。若 $P=A(A^{\top}A)^{-1}A^{\top}$，则 $Q$ 是投影到 $C(A)^{\perp}=N(A^{\top})$ 的投影矩阵。这是因为，$\boldsymbol{x}$ 可以正交分解为 $P\boldsymbol{x}+(I-P)\boldsymbol{x}$。
- 例如要求投影到平面 $x+y+z=0$ 的投影矩阵，可以先求投影到其法向量

  $$
  \boldsymbol{n}=\begin{bmatrix}1 \\ 1 \\ 1\end{bmatrix}
  $$

   上的投影矩阵 $\frac{\boldsymbol{n}\boldsymbol{n}^{\top}}{\boldsymbol{n}^{\top}\boldsymbol{n}}$，再用恒等矩阵减去它。
- 求高维投影矩阵，不如去找它正交补的投影矩阵，再用恒等矩阵减去它就好了。


加权最小平方解（Weighted least-square solution）：求平方和 $\sum_{i=1}^mw_{i}^{2}(a_{i1}x_{1}+a_{i2}x_{2}+\dots+a_{in}x_{n}-b_{i})^{2}$ 的最小值，其中 $a_{ij}, b_{i}$ 为常数。
- 只需要把 $w_{i}$ 放到平方里面去即可。
- 构造 $W=\operatorname{diag}(w_1,\dots,w_m)$，则转换为求 $\lVert WA\hat{\boldsymbol{x}_{w}}-W\boldsymbol{b} \rVert^{2}$ 的最小值。
- 也就是 $(WA)^{\top}(WA)\hat{\boldsymbol{x}_{w}}=(WA)^{\top}(W\boldsymbol{b})$。
- 也就是 $A^{\top}(W^{\top}W)A\hat{\boldsymbol{x}_{w}}=A^{\top}(W^{\top}W)\boldsymbol{b}$。

## 规范正交基与正交矩阵

规定 $\boldsymbol{q}_{1},\boldsymbol{q}_{2},\dots,\boldsymbol{q}_{s}$ 为一组向量，且满足：
  $$
\boldsymbol{q}_{i}^{\top}\boldsymbol{q}_{j}=\begin{cases}
1 & i=j \\
0 & i\neq j
\end{cases}
$$
则称它们是规范正交（Orthonormal）的。
若 $\boldsymbol{q}_{1}, \boldsymbol{q}_{2},\dots,\boldsymbol{q}_{n}$ 是空间 $V$ 的一组基且它们规范正交，则称它们为规范正交基（Orthonormal Basis）。

正交矩阵（Orthogonal Matrix）：一个有着规范正交的列的**方矩阵**
$$
Q^{\top}Q=I
$$
例如，旋转矩阵，排列矩阵以及反射矩阵都是正交矩阵。
正交矩阵代表的变换会保持长度不变：
$$
\lVert Q\boldsymbol{x} \rVert=\lVert \boldsymbol{x} \rVert  
$$
这是因为，$(Q\boldsymbol{x})^{\top}(Q\boldsymbol{x})=\boldsymbol{x}^{\top}Q^{\top}Q\boldsymbol{x}=\boldsymbol{x}^{\top}\boldsymbol{x}$。
更一般地，它会保持内积不变/夹角不变：
$$
(Q\boldsymbol{x})^{\top}(Q\boldsymbol{y})=\boldsymbol{x}^{\top}\boldsymbol{y}
$$

正交基/正交矩阵的好处：
- 坐标非常容易求出来。
$$
\boldsymbol{b}=\sum x_{i}\boldsymbol{q}_{i}
$$
$$
\implies \boldsymbol{q}_{i}^{\top}\boldsymbol{b}=\boldsymbol{q}_{i}^{\top}\boldsymbol{q}_{i}x_{i}
$$
$$
\implies x_{i}=\boldsymbol{q}_{i}^{\top}\boldsymbol{b}
$$
- 逆非常容易求出来。
$$
Q=\begin{bmatrix}
\boldsymbol{q}_{1} & \boldsymbol{q}_{2} & \dots & \boldsymbol{q}_{n}
\end{bmatrix}
$$
$$
\implies Q^{-1}=Q^{\top}
$$
$$
Q\boldsymbol{x}=\boldsymbol{b}\implies \boldsymbol{x}=Q^{\top}\boldsymbol{b}=\begin{bmatrix}
\boldsymbol{q}_{1}^{\top}\boldsymbol{b} \\
\dots \\
\boldsymbol{q}_{n}^{\top}\boldsymbol{b}
\end{bmatrix}
$$
- 任意向量分解到基上都相当于投影上去。
$$
\boldsymbol{b}=\sum (\boldsymbol{q}_{i}^{\top}\boldsymbol{b})\boldsymbol{q}_{i}
$$
- 长度很好求。
$$
\lVert \boldsymbol{b} \rVert = \sqrt{ \sum (\boldsymbol{q}_{i}^{\top}\boldsymbol{b})^{2} }
$$

- $Q^{\top}$ 也是一个正交矩阵，也就是说行也是正交的
$$
(Q^{\top})^{\top}Q^{\top}=(QQ^{\top})^{\top}=I
$$
- 【*注意这里的 $Q$ 代表不一定为方阵，但列正交的情况* 】若要求 $Q\boldsymbol{x}=\boldsymbol{b}$ 的最小平方解，则 $\hat{\boldsymbol{x}}=(Q^{\top}Q)Q^{\top}\boldsymbol{b}=Q^{\top}\boldsymbol{b}$，则投影 $\boldsymbol{p}=Q\hat{\boldsymbol{x}}=QQ^{\top}\boldsymbol{b}=\sum (\boldsymbol{q}_{i}^{\top}\boldsymbol{b})\boldsymbol{q}_{i}$，也就是说，投影到 $C(Q)$ 相当于投影到 $Q$ 的列向量上再相加。
- 投影到 $C(Q)$ 上的投影矩阵为 $P=Q(Q^{\top}Q)^{-1}Q^{\top}=QQ^{\top}$。

## Householder 变换

Householder 变换：将某个向量 $\boldsymbol{x}$ 关于某个 $n-1$ 维超平面  $V$  做反射。假设平面的法向量为 $\boldsymbol{v}$，则变换的矩阵表示为
$$
H=I_{n}-2 \frac{\boldsymbol{v}\boldsymbol{v}^{\top}}{\boldsymbol{v}^{\top}\boldsymbol{v}}
$$
这是因为，$H:\mathbb{R}^n \to \mathbb{R}^n, \boldsymbol{x}=\boldsymbol{x}_{\parallel}+\boldsymbol{x}_{\perp}\mapsto \boldsymbol{x}_{\parallel}-\boldsymbol{x}_{\perp}$，又有 $P_{v}\boldsymbol{x}=\boldsymbol{x}_{\perp}$，则 $H\boldsymbol{x}=\boldsymbol{x}_{\parallel}-\boldsymbol{x}_{\perp}=\boldsymbol{x}-2\boldsymbol{x}_{\perp}=\boldsymbol{x}-2P_{v}\boldsymbol{x}$，进而 $H=I-2P_{v}=I-2 \frac{\boldsymbol{v}\boldsymbol{v}^{\top}}{\boldsymbol{v}^{\top}\boldsymbol{v}}$。
- 对合性：$H^{2}=I$
- 正交性：$H^{\top}H=I$
- 对称性：$H=H^{\top}$
Householder 变换的意义在于，作为一个反射变换，它可以将向量的某些元素置零而保持长度不变。
- 例题：要找某个对称矩阵 $A$ 使得 $A^{2}=I$ 且其第一列为某单位向量 $\boldsymbol{u}$。
- 若 $\boldsymbol{u}=\boldsymbol{e}_1$，可取 $A=I$；否则令 $A$ 为一个 Householder 矩阵，由题意得 $A\boldsymbol{e}_{1}=\boldsymbol{u}$，也就是说 $\boldsymbol{e}_{1}$ 与 $\boldsymbol{u}$ 关于 Householder 变换的超平面对称，那么可以取法向量 $\boldsymbol{v}=\boldsymbol{e}_{1}-\boldsymbol{u}$。从而得到矩阵 $A$。

## Gram-Schmidt 正交化

若我们已经有了 $V$ 的一组基 $\{ \boldsymbol{a}_{1},\boldsymbol{a}_{2},\dots,\boldsymbol{a}_{n} \}$，我们可以通过 Gram-Schmidt 正交化（Orthogonalization）求出 $V$ 的一组规范正交基 $\boldsymbol{q}_{1},\boldsymbol{q}_{2},\dots,\boldsymbol{q}_{n}$。
先把 $\boldsymbol{a}_{1}$ 归一化：
  $$\boldsymbol{q}_{1}=\frac{\boldsymbol{a}_{1}}{\lVert \boldsymbol{a}_{1} \rVert}$$
把 $\boldsymbol{a}_{2}$ 去掉其投影到 $\boldsymbol{q}_{1}$ 的部分，再归一化
$$
\boldsymbol{q}_{2}=\frac{\boldsymbol{a}_{2}-(\boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{2})\boldsymbol{q}_{1}}{\lVert \boldsymbol{a}_{2}-(\boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{2})\boldsymbol{q}_{1}\rVert }
$$
循环往复，减去往前面所有（正交的）向量做的投影：
$$
\boldsymbol{u}_{j+1}=\boldsymbol{a}_{j+1}-\sum_{i=1}^j (\boldsymbol{q}_{i}^{\top} \boldsymbol{a}_{j+1})\boldsymbol{q}_{i}
$$
$$
\boldsymbol{q}_{j+1}= \frac{\boldsymbol{u}_{j+1}}{\lVert \boldsymbol{u}_{j+1} \rVert }
$$
当然也可以到最后再做单位化，计算会简单一些。

### QR 分解

$$
A=\begin{bmatrix}
\boldsymbol{a}_{1} & \boldsymbol{a}_{2} & \dots & \boldsymbol{a}_{n}
\end{bmatrix}
$$
$$
Q=\begin{bmatrix}
\boldsymbol{q}_{1} & \boldsymbol{q}_{2} & \dots & \boldsymbol{q}_{n}
\end{bmatrix}
$$
这里有：
$$
\begin{aligned}
\boldsymbol{a}_{1}&=\lVert \boldsymbol{a}_{1} \rVert \boldsymbol{q}_{1}= \boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{1}\boldsymbol{q}_{1}\\
\boldsymbol{a}_{2}&=(\boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{2})\boldsymbol{q}_{1}+(\boldsymbol{q}_{2}^{\top}\boldsymbol{a}_{2})\boldsymbol{q}_{2} \\
\dots \\
\boldsymbol{a}_{n}&=\sum_{i=1}^n(\boldsymbol{q}_{i}^{\top}\boldsymbol{a}_{n})\boldsymbol{q}_{i}
\end{aligned}
$$
因此可以构造矩阵
$$
R=\begin{bmatrix}
\boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{1} & \boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{2} & \dots & \boldsymbol{q}_{1}^{\top}\boldsymbol{a}_{n} \\
0 & \boldsymbol{q}_{2}^{\top}\boldsymbol{a}_{2} & \dots & \boldsymbol{q}_{2}^{\top}\boldsymbol{a}_{n} \\
0 & 0 & \dots & \dots \\
0 & 0 & 0 & \boldsymbol{q}_{n}^{\top}\boldsymbol{a}_{n} \\
\end{bmatrix}
$$
使得 $A=QR$。也就是说，$R$ 的第 $i$ 列是 $A$ 的第 $i$ 列在 $\boldsymbol{q}_{1},\boldsymbol{q}_{2},\dots,\boldsymbol{q}_{i}$ 做投影得到。也可以用 $R=Q^{\top}A$ 来算。
这里 $A$ 是一个列线性无关的 $m\times n$ 矩阵，$Q$ 是列规范正交的 $m\times n$ 矩阵，$R$ 是可逆的上三角矩阵。
（若 $m=n$：任何可逆的矩阵可以分解成一个正交矩阵乘一个上三角矩阵。）

若 $A=QR$，则 $A\boldsymbol{x}=\boldsymbol{b}$ 的最小平方解： $A^{\top}A=(QR)^{\top}(QR)=R^{\top}R$，故方程 $A^{\top}A\hat{\boldsymbol{x}}=A^{\top}\boldsymbol{b}$ 化简为 $R^{\top}R\hat{\boldsymbol{x}}=R^{\top}Q^{\top}\boldsymbol{b}$，由于 $R^{\top}$ 可逆，有：
$$
R\hat{\boldsymbol{x}}=Q^{\top}\boldsymbol{b}
$$ 这个方程比较好解，因为 $R$ 是上三角矩阵，只需回代即可。

## 内积

定义抽象的向量空间中的内积 $\left\langle  \cdot, \cdot \right\rangle :V\times V\to \mathbb{R}$，要求满足：
- 对称性（Symmetric）：$\left\langle  \boldsymbol{v},\boldsymbol{w} \right\rangle  =\left\langle  \boldsymbol{w},\boldsymbol{v} \right\rangle $
- 双线性（Bilinear）：$\left\langle  c_{1}\boldsymbol{v}+c_{2}\boldsymbol{w},\boldsymbol{a} \right\rangle  = c_{1} \left\langle  \boldsymbol{v},\boldsymbol{a} \right\rangle  + c_{2}\left\langle  \boldsymbol{w},\boldsymbol{a} \right\rangle , \left\langle  \boldsymbol{a}, c_{1}\boldsymbol{v}+c_{2}\boldsymbol{w} \right\rangle  = c_{1}\left\langle  \boldsymbol{a},\boldsymbol{v} \right\rangle +c_{2}\left\langle  \boldsymbol{a},\boldsymbol{w} \right\rangle $。
- 正定性（Positive-Definiteness）： $\left\langle  \boldsymbol{v},\boldsymbol{v} \right\rangle  \geq 0$, 且 $\boldsymbol{v}=\boldsymbol{0} \iff \left\langle  \boldsymbol{v},\boldsymbol{v} \right\rangle  = 0$


例如，对定义在 $[0,1]$ 上的 $f(t)$，要找其最佳拟合直线 $b=C+Dt$，则需要让 $E^{2}=\int_{0}^1(f(t)-C-Dt)^{2}\,\mathrm{d}t$ 最小。
- 我们定义这里的内积为 $\left\langle  f,g \right\rangle  =\int_{0}^1f(t)g(t)\,\mathrm{d}t$。
- 让 $\boldsymbol{v}_{1}=f(t), \boldsymbol{v}_{2}=C\cdot 1+D \cdot t$，则要让 $\lVert \boldsymbol{v}_{1}-\boldsymbol{v}_{2} \rVert^{2}$ 最小。
- 这里 $\boldsymbol{v}_{2}$ 在 $\{ 1,t \}$ 张成的平面内，故这个长度最小，需要 $\boldsymbol{v}_{2}$ 为 $\boldsymbol{v}_{1}$ 在这个平面上的投影。
- 用 Gram-Schmidt 正交化可以找到一组正交基 $\boldsymbol{a}_{1}=  1, \boldsymbol{a}_{2}=t-\frac{1}{2}$ 。
- 于是这个投影就是  
$$
\frac{\left\langle  \boldsymbol{a}_{1}, \boldsymbol{v}_1 \right\rangle  }{\left\langle  \boldsymbol{a}_{1}, \boldsymbol{a}_{1} \right\rangle  } \boldsymbol{a}_{1}+ \frac{\left\langle  \boldsymbol{a}_{2},\boldsymbol{v}_1 \right\rangle  }{\left\langle  \boldsymbol{a}_{2},\boldsymbol{a}_{2} \right\rangle  } \boldsymbol{a}_{2}
$$
- 这也就是要找的直线。

