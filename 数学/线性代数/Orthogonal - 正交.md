
$x, y \in \mathbb{R}^{n}$ 正交（Orthogonal）定义为  $x^Ty=0$。
$x\in \mathbb{R}^n$ 的长度（Length）定义为 $||x|| = \sqrt{ x^Tx }$。
$x,y\in \mathbb{R}^n$ 之间的角度定义为 $\cos\theta= \frac{x^Ty}{\lVert x \rVert\lVert y \rVert}$。

**柯西-施瓦茨不等式（Cauchy-Schwarz）：** 对于任意两个内积空间中的向量 $x,y$，有：
$$
|x\cdot y|^{2}\leq \lvert x \cdot x \rvert \lvert y\cdot y \rvert 
$$
这和角度的定义相统一，因为 $|\cos\theta|\leq 1$ 。

定理：若一组向量相互正交且它们不是零向量，则它们是线性无关的。
- 证明：对于方程 $c_{1}v_{1}+c_{2}v_{2}+\dots+c_{n}v_{n}=0$，将它点乘 $v_{1}$ 得 $v_{1}^T(c_{1}v_{1}+c_{2}v_{2}+\dots+c_{n}v_{n})=0$，也就是说 $v_{1}^Tc_{1}v_{1}=c_{1}\lVert v_{1} \rVert^{2}=0$。由于 $\lVert v_{1} \rVert\neq 0$，那么 $c_{1}=0$。类似的 $c_{i}$ 都为 $0$。

两个子空间 $V,W$ 彼此正交定义为 $\forall v\in V, w\in W$，有 $v^Tw=0$。记作 $V \perp W$。

$C(A)\perp N(A^T)$
- 证明：$b \in C(A) \implies \exists x,\text{s.t. }Ax=b$；$y\in N(A^T)\implies y^TA=0$。从而 $y^Tb=y^T(Ax)=(y^TA)x=0$。从而 $y^T\perp b$。

$C(A^T)\perp N(A)$
- 证明：$x\in N(A)\implies Ax=0\implies x^TA^T=0$，故 $x\perp A^T$。

$V\subseteq \mathbb{R}^n$ 的垂直补（Orthogonal Complement）定义为所有满足 $v\perp V$ 的向量 $v$ 组成的集合，记作 $V^{\perp}$。一个空间和其垂直补的维数之和为 $n$。

可以证明 $C(A)^{\perp}=N(A^T), C(A^{T})^{\perp}= N(A)$。
- $Ax=b$ 相容的一个等价条件：$y^Tb=0 , \forall y\in N(A^{T})$。

$A$ 表示的线性变换把 $C(A^T)$ 映射到 $C(A)$ 中，把 $N(A)$ 映射到 $0$。对于任何一个 $n$ 维向量 $x$，它可以写成 $x=x_{r}+x_{n}$，而 $Ax=A(x_{r}+x_{n})=Ax_{r}$。这里 $x_{r}$ 是行空间中的一个向量，而 $Ax_{r}$ 是列空间中的一个向量。所以从几何上看，它把自己的行空间映射到列空间。

## 投影与最小平方解

$b$ 在 $a$ 上的投影（Projection）：$p= \lVert p \rVert \frac{a}{\lVert a \rVert}= \lVert b \rVert\cos\theta  \frac{a}{\lVert a \rVert}=\frac{a^Tb}{\lVert a \rVert^{2}}a$。
投影的矩阵表示： $T:\mathbb{R}^n\to \mathbb{R}^n, b \mapsto \frac{a^Tb}{\lVert a \rVert^{2}}a$。所以矩阵表示就是 $\frac{aa^T}{a^Ta}$。

应用：**最小平方解（Least Square Solutions）**，求平方和 $\sum_{i=1}^m(a_{i1}x_{1}+a_{i2}x_{2}+\dots+a_{in}x_{n}-b_{i})^{2}$ 的最小值，其中 $a_{ij}, b_{i}$ 为常数。
- 把问题转换为求 $\lVert Ax-b \rVert^{2}$ 的最小值。$A$ 将 $x$ 映射到 $C(A)$ 中。在平面 $C(A)$ 中的向量 $Ax$ 与任意向量 $b$ 终点连线的长度最小，需要这个连线与 $C(A)$ 垂直，所以 $b-A\hat{x} \in C(A)^{\perp}=N(A^T)$。那么 $A^T(b-A\hat{x})=0$。
- **只需解方程 $\mathbf{(A^T A)\hat{x}=A^T b}$。**
- 为什么这个方程组有解？从几何角度可以理解。
- 也可以通过证明 $\text{rank}(A^TA)=\text{rank}(\begin{bmatrix}A^TA &A^Tb\end{bmatrix})$。
  - 显然 $\text{rank}(A^TA)\leq\text{rank}(\begin{bmatrix}A^TA &A^Tb\end{bmatrix})$。
  - 另有 $\text{rank}(A^TA)=\text{rank}(A^T)\geq\text{rank}(A^T \begin{bmatrix}A & b\end{bmatrix})=\text{rank}(\begin{bmatrix}A^TA & A^Tb\end{bmatrix})$。
- 若 $A^T A$ 可逆，则 $\hat{x}=(A^TA)^{-1}A^T b$ 。也就是，$A$ 的最优左逆左乘 $b$。
- 若 $A$ 可逆，则可以进一步得到 $\hat{x}=A^{-1}b$。

对于 $n=2$ 的情况就是用最小二乘法求线性回归直线。
- 设这个回归直线为  $b=C+Dt$。则要使得残差平方和 $\sum_{i=1}^m(C+Dt_{i}-b_{i})^{2}$ 最小。
- 这里 $A=\begin{bmatrix}1 & t_{1} \\ 1  & t_{2} \\ \dots & \dots \\ 1 & t_{m}\end{bmatrix}$，$b=\begin{bmatrix}b_{1} \\ b_{2} \\ \dots \\ b_{m}\end{bmatrix}$。
- 则只需解方程 $A^TA\begin{bmatrix}C \\ D\end{bmatrix}=A^T$ 即可求出直线的系数。
- 为了方便计算，可以让 $b=C_{1}+D_{1}(t-\bar{t})$，这里原直线的参数 $C=C_{1}-D_{1}t, D=D_{1}$。那么 $A=\begin{bmatrix}1 & t_{1}-\bar{t} \\ 1 & t_{2}-\bar{t} \\ \dots & \dots \\ 1 & t_{n}-\bar{t}\end{bmatrix}$，则 $A=\begin{bmatrix}v_{1} & v_{2}\end{bmatrix}$ 的两列是正交的。那么 $\hat{C}=\frac{v_{1}^Tb}{v_{1}^Tv_{1}},\hat{D}=\frac{v_{2}^Tb}{v_{2}^Tv_{2}}$。

考虑这个几何问题。
- 由于 $A\hat{x}$ 为 $C(A)$ 上使得其终点与 $b$ 终点连线垂直于 $C(A)$ 的向量，$b$ 在 $C(A)$ 上的投影即为 $p=A\hat{x}=A(A^TA)^{-1}A^Tb$。
- 那么投影到 $C(A)$ 的线性变换的矩阵表示为 $P=A(A^TA)^{-1} A^T$。
- 这里 $P$ 有些性质。比如 $P^{2}=P$, $P^T=P$。


**定义投影矩阵（Projection Matrix）**：满足 $P^{2}=P$ 且 $P^T=P$ 的矩阵。
- 任何投影矩阵都来自于投影到某个列空间 $C(A)$ 的投影。
- 推论：容易验证 $Q=I-P$ 也是投影矩阵。若 $P=A(A^TA)^{-1}A^T$，则 $Q$ 是投影到 $C(A)^{\perp}=N(A^T)$ 的投影矩阵。这是因为，$x$ 可以正交分解为 $Px+(I-P)x$。
- 例如要求投影到平面 $x+y+z=0$ 的投影矩阵，可以先求投影到其法向量 $n=\begin{bmatrix}1 \\ 1 \\ 1\end{bmatrix}$ 上的投影矩阵 $\frac{nn^T}{n^Tn}$，再用恒等矩阵减去它。
- 求高维投影矩阵，不如去找它正交补的投影矩阵，再用恒等矩阵减去它就好了。


加权最小平方解（Weighted least-square solution）：求平方和 $\sum_{i=1}^mw_{i}^{2}(a_{i1}x_{1}+a_{i2}x_{2}+\dots+a_{in}x_{n}-b_{i})^{2}$ 的最小值，其中 $a_{ij}, b_{i}$ 为常数。
- 只需要把 $w_{i}$ 放到平方里面去即可。
- 构造 $W=\begin{bmatrix}w_{1} & \dots & \dots & \dots \\ \dots  & w_{2} & \dots & \dots \\ \dots & \dots & \dots & \dots \\ \dots & \dots & \dots & w_{n} \end{bmatrix}$，则转换为求 $\lVert WA\hat{x_{w}}-Wb \rVert^{2}$ 的最小值。
- 也就是 $(WA)^T(WA)\hat{x_{w}}=(WA)^T(Wb$。
- 也就是 $A^T(W^TW)A\hat{x_{w}}=A^T(W^TW)B$。

## 规范正交基与正交矩阵

规定 $q_{1},q_{2},\dots,q_{s}$ 为一组向量，且满足：
  $$
q_{i}^Tq_{j}=\begin{cases}
1 & i=j \\
0 & i\neq j
\end{cases}
$$
则称它们是规范正交（Orthonormal）的。
若 $q_{1}, q_{2},\dots,q_{n}$ 是空间 $V$ 的一组基且它们规范正交，则称它们为规范正交基（Orthonormal Basis）。

正交矩阵（Orthogonal Matrix）：一个有着规范正交的列的**方矩阵**
$$
Q^TQ=I
$$
例如，旋转矩阵，排列矩阵以及反射矩阵都是正交矩阵。
正交矩阵代表的变换会保持长度不变：
$$
\lVert Qx \rVert=\lVert x \rVert  
$$
这是因为，$(Qx)^T(Qx)=x^TQ^TQx=x^Tx$。
更一般地，它会保持内积不变/夹角不变：
$$
(Qx)^T(Qy)=x^Ty
$$

正交基/正交矩阵的好处：
- 坐标非常容易求出来。
$$
b=\sum x_{i}q_{i}
$$
$$
\implies q_{i}^Tb=q_{i}^Tq_{i}x_{i}
$$
$$
\implies x_{i}=q_{i}^Tb
$$
- 逆非常容易求出来。
$$
Q=\begin{bmatrix}
q_{1} & q_{2} & \dots & q_{n}
\end{bmatrix}
$$
$$
\implies Q^{-1}=Q^T
$$
$$
Qx=b\implies x=Q^Tb=\begin{bmatrix}
q_{1}^Tb \\
\dots \\
q_{n}^Tb
\end{bmatrix}
$$
- 任意向量分解到基上都相当于投影上去。
$$
b=\sum (q_{i}^Tb)q_{i}
$$
- 长度很好求。
$$
\lVert b \rVert = \sqrt{ \sum (q_{i}b)^{2} }
$$

- $Q^T$ 也是一个正交矩阵，也就是说行也是正交的
$$
(Q^T)^TQ^T=(QQ^T)^T=I
$$
- 【*注意这里的 $Q$ 代表不一定为方阵，但列正交的情况* 】若要求 $Qx=b$ 的最小平方解，则 $\hat{x}=(Q^TQ)Q^Tb=Q^Tb$，则投影 $p=Q\hat{x}=QQ^Tb=\sum (q_{i}^Tb)q_{i}$，也就是说，投影到 $C(Q)$ 相当于投影到 $Q$ 的列向量上再相加。
- 投影到 $C(Q)$ 上的投影矩阵为 $P=Q(Q^TQ)^{-1}Q^T=QQ^T$。

## Householder 变换

Householder 变换：将某个向量 $x$ 关于某个 $n-1$ 维超平面  $V$  做反射。假设平面的法向量为 $v$，则变换的矩阵表示为
$$
H=I_{n}-2 \frac{vv^T}{v^Tv}
$$
这是因为，$H:\mathbb{R}^n \to \mathbb{R}^n, x=x_{\parallel}+x_{\perp}\mapsto x_{\parallel}-x_{\perp}$，又有 $P_{v}x=x_{\perp}$，则 $Hx=x_{\parallel}-x_{\perp}=x-2x_{\perp}=x-2P_{v}x$，进而 $H=I-2P_{v}=I-2 \frac{vv^T}{v^Tv}$。
- 对合性：$H^{2}=I$
- 正交性：$H^TH=0$
- 对称性：$H=H^T$
Householder 变换的意义在于，作为一个反射变换，它可以将向量的某些元素置零而保持长度不变。
- 例题：要找某个对称矩阵 $A$ 使得 $A^{2}=I$ 且其第一列为某单位向量 $u$。
- 不妨令 $A$ 为一个 Householder 矩阵，由题意得 $Ae_{1}=u$，也就是说 $e_{1}$ 与 $u$ 关于 Householder 变换的超平面对称，那么可以取法向量 $v=e_{1}-u$。从而得到矩阵 $A$。 

## Gram-Schmidt 正交化

若我们已经有了 $V$ 的一组基 $\{ a_{1},a_{2},\dots,a_{n} \}$，我们可以通过 Gram-Schmidt 正交化（Orthogonalization）求出 $V$ 的一组规范正交基 $q_{1},q_{2},\dots,q_{n}$。
先把 $a_{1}$ 归一化：
  $$q_{1}=\frac{a_{1}}{\lVert a_{1} \rVert}$$
把 $a_{2}$ 去掉其投影到 $q_{1}$ 的部分，再归一化
$$
q_{2}=\frac{a_{2}-(q_{1}^Ta_{2})a_{1}}{\lVert a_{2}-(q_{1}^Ta_{2}) a_{1}\rVert }
$$
循环往复，减去往前面所有（正交的）向量做的投影：
$$
A_{j+1}=a_{j+1}-\sum_{i=1}^j (q_{i}^T a_{j+1})q_{i}
$$
$$
q_{j+1}= \frac{A_{j+1}}{\lVert A_{j+1} \rVert }
$$
当然也可以到最后再做单位化，计算会简单一些。

### QR 分解

$$
A=\begin{bmatrix}
a_{1} & a_{2} & \dots & a_{n}
\end{bmatrix}
$$
$$
Q=\begin{bmatrix}
q_{1} & q_{2} & \dots & q_{n}
\end{bmatrix}
$$
这里有：
$$
\begin{align}
a_{1}&=\lVert a_{1} \rVert q_{1}= q_{1}^Ta_{1}q_{1}\\
a_{2}&=(q_{1}^Ta_{2})q_{1}+(q_{2}^Ta_{2})q_{2} \\
\dots \\
a_{n}&=\sum_{i=1}^n(q_{i}^Ta_{n})q_{i}
\end{align}
$$
因此可以构造矩阵
$$
R=\begin{bmatrix}
q_{1}^Ta_{1} & q_{1}^Ta_{2} & \dots & q_{1}^Ta_{n} \\
0 & q_{2}^Ta_{2} & \dots & q_{2}^Ta_{n} \\
0 & 0 & \dots & \dots \\
0 & 0 & 0 & q_{n}^Ta_{n} \\
\end{bmatrix}
$$
使得 $A=QR$。也就是说，$R$ 的第 $i$ 列是 $A$ 的第 $i$ 列在 $q_{1},q_{2},\dots,q_{i}$ 做投影得到。也可以用 $R=Q^TA$ 来算。
这里 $A$ 是一个列线性无关的 $m\times n$ 矩阵，$Q$ 是列规范正交的 $m\times n$ 矩阵，$R$ 是可逆的上三角矩阵。
（若 $m=n$：任何可逆的矩阵可以分解成一个正交矩阵乘一个上三角矩阵。）

若 $A=QR$，则 $Ax=b$ 的最小平方解： $A^TA=(QR)^T(QR)=R^TR$，故方程 $A^TA\hat{x}=A^Tb$ 化简为 $R^TR\hat{x}=R^TQ^Tb$，由于 $R^T$ 可逆，有：
$$
R\hat{x}=Q^Tb
$$ 这个方程比较好解，因为 $R$ 是上三角矩阵，只需回代即可。

## 内积

定义抽象的向量空间中的内积 $\left< \cdot, \cdot \right>:V\times V\to \mathbb{R}$，要求满足：
- 对称性（Symmetric）：$\left< v,w \right> =\left< w,v \right>$ 
- 双线性（Bilinear）：$\left< c_{1}v+c_{2}w,a \right> = c_{1} \left< v,a \right> + c_{2}\left< w,a \right>, \left< a, c_{1}v+c_{2}w \right> = c_{1}\left< a,v \right>+c_{2}\left< a,w \right>$。
- 正定性（Positive-Definiteness）： $\left< v,v \right> \geq 0$, 且 $v=\vec{0} \iff \left< v,v \right> = 0$


例如，对定义在 $[0,1]$ 上的 $f(t)$，要找其最佳拟合直线 $b=C+Dt$，则需要让 $E^{2}=\int_{0}^1(f(t)-C-Dt)^{2}dt$ 最小。
- 我们定义这里的内积为 $\left< f,g \right> =\int_{0}^1f(t)g(t)dt$。
- 让 $v_{1}=f(t), v_{2}=C\cdot 1+D \cdot t$，则要让 $\lVert v_{1}-v_{2} \rVert^{2}$ 最小。
- 这里 $v_{2}$ 在 $\{ 1,t \}$ 张成的平面内，故这个长度最小，需要 $v_{2}$ 为 $v_{1}$ 在这个平面上的投影。
- 用 Gram-Schmidt 正交化可以找到一组正交基 $a_{1}=  1, a_{2}=t-\frac{1}{2}$ 。
- 于是这个投影就是  
$$
\frac{\left< a_{1}, v \right> }{\left< a_{1}, a_{1} \right> } a_{1}+ \frac{\left< a_{2},v \right> }{\left< a_{2},a_{2} \right> } a_{2}
$$
- 这也就是要找的直线。

