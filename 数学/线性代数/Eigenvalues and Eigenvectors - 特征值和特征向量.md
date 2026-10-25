定义：对 $n$ 阶矩阵 $A$，若 $\boldsymbol{x} \in \mathbb{R}^{n}$ ，$\boldsymbol{x}\neq 0$，$\lambda \in \mathbb{R}$，使得
$$
A\boldsymbol{x}=\lambda \boldsymbol{x}
$$
则称 $\lambda$ 为 $A$ 的特征值（Eigenvalue），$\boldsymbol{x}$ 是 $\lambda$ 对应的特征向量（Eigenvector associated to $\lambda$）。
对于给定的矩阵 $A$，要求特征值，则要解方程
$$
(A-\lambda I)\boldsymbol{x}=0
$$
既然这里 $\boldsymbol{x}\neq 0$，必然有
$$\det(A-\lambda I)=0$$
称 $f(\lambda)=\det(A-\lambda I)$ 为特征多项式（Characteristic polynomial），方程 $f(\lambda)=0$ 为特征方程（Characteristic Equation），是一个关于 $\lambda$ 的 $n$ 次方程。
解这个方程，就可以得到所有 $\lambda$；再回代求解 $\boldsymbol{x}$，那么对每个 $\lambda_{i}$，$\boldsymbol{x}$ 就落在 $A-\lambda_{i} I$ 的零空间中。

几何意义 ：经过  $A$ 代表的线性变换后，于原来的向量共线的向量就是特征向量。如果是投影矩阵，几何意义就比较明显。

定义矩阵 $A$ 的迹（trace）为其对角线之和：
$$
\operatorname{tr}(A)=\sum a_{ii}
$$
那么对于方程 $f(\lambda)=0$，通过考察其 $\lambda^{n-1}$ 与 $\lambda^0$ 的系数，根据韦达定理有
$$
\sum \lambda_{i}=\operatorname{tr}(A)
$$
$$
\prod \lambda_{i}=\det(A)
$$
### 对角化

**利用特征值和特征向量，可以将 $n$ 阶矩阵 $A$ 进行对角化（Diagonalization）：**
- 假设 $A$ 有 $n$ 个相互独立的特征向量 $\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots,\boldsymbol{v}_{n}$，令 $S=\begin{bmatrix}\boldsymbol{v}_{1} & \boldsymbol{v}_{2} & \dots & \boldsymbol{v}_{n}\end{bmatrix}$。
- 那么 $\Lambda =S^{-1}AS$ 是一个对角矩阵$$
\Lambda=\begin{bmatrix}
\lambda_{1} \\
 & \lambda_{2} \\
 &  & \ddots \\
 &  &  & \lambda_{n}
\end{bmatrix}
$$
- 几何意义：$S$ 相当于一个基变换矩阵：$\begin{bmatrix}\boldsymbol{v}_{1} & \boldsymbol{v}_{2} & \dots & \boldsymbol{v}_{n}\end{bmatrix}=\begin{bmatrix}\boldsymbol{e}_{1} & \boldsymbol{e}_{2} & \dots & \boldsymbol{e}_{n}\end{bmatrix}S$，以特征向量为基进行线性变换，只是相当于把它们按照相应的特征值进行伸缩。
- 代数视角也容易验证。
- 称 $S$ 为特征向量矩阵（Eigenvector Matrix），称 $\Lambda$ 为特征值矩阵（Eigenvalue matrix）。这里 $S$ 不是唯一的，因为特征向量不唯一。
- **$n$ 阶矩阵可对角化的充要条件是存在 $n$ 个线性无关的特征向量。**
- 对角化可以便于算 $A^n$，因为 $A^n=S\Lambda^{n}S^{-1}$。

**定理：若特征向量 $\boldsymbol{x}_{1},\boldsymbol{x}_{2},\dots,\boldsymbol{x}_{n}$ 有着各异的特征值，则这些特征向量相互独立。**
- 用归纳法得到证明：对方程 $\sum_{i=1}^k c_{i}\boldsymbol{x}_{i}=0$，左乘 $(A-\lambda_{j}I)$，得到 $$\sum_{i=1}^k c_{i}(\lambda _{i}-\lambda_{j})\boldsymbol{x}_{i}=0$$
- 基础情况：取 $k=2$，$j=1$ 得到 $c_{2}(\lambda_{2}-\lambda_{1})\boldsymbol{x}_{2}=0$，由于 $\lambda_{2}-\lambda_{1}\neq 0$ 且 $\boldsymbol{x}_{2}\neq 0$，有 $c_{2}=0$；同理 $c_{1}=0$。所以 $\boldsymbol{x}_{1},\boldsymbol{x}_{2}$ 相互独立
- 假设对 $k$ 命题成立，那么对 $k+1$，左乘 $A-\lambda_{j}I$ 会变成$$
\sum_{i\neq j}c_{i}(\lambda_{i}-\lambda_{j})\boldsymbol{x}_{i}=0
$$
- 这是一个 $k$ 个向量的情况，根据归纳假设，对任意 $i\neq j$ 都有 $c_{i}=0$。遍历所有 $j$，得到所有 $c$ 都为 $0$，故而命题对 $k+1$ 也成立。进一步，对任意 $n$ 都成立。
- 另一种证明方式：利用下面的定理，令 $f(x)=\prod_{i\neq j}(x-\lambda _{i})$，那么对方程 $\sum_{i=1}^nc_{i}\boldsymbol{x}_{i}=0$ 左乘 $f(A)$，则有 $\sum_{i=1}^nc_{i}f(A)\boldsymbol{x}_{i}=\sum_{i=1}^nc_{i}f(\lambda_{i})\boldsymbol{x}_{i}=0$，然而对 $i\neq j$ 都有 $f(\lambda_{i})=0$，对 $i=j$ 有 $f(\lambda_{i})\neq 0$, 于是 $c_{j}=0$。同理 $c_{1}=c_{2}=\dots=c_{n}=0$。

**定理：若  $\boldsymbol{x}$ 是 $A$ 的特征向量，对应特征值 $\lambda$，则 $\boldsymbol{x}$ 同时也是 $A^k$ 的特征向量，对应特征值 $\lambda^k$。**
- 证明： $A^k\boldsymbol{x}=A^{k-1}A\boldsymbol{x}=A^{k-1}\lambda \boldsymbol{x}=\lambda A^{k-1}\boldsymbol{x}=\dots=\lambda^k\boldsymbol{x}$。
进一步，令  $f(x)=a_{n}x^n+a_{n-1}x^{n-1}+\dots+a_{0}$，且 $\boldsymbol{v}$ 为 $A$ 的一个特征向量，对应特征值 $\lambda$，那么有
$$
f(A)\boldsymbol{v}=\sum_{i=0}^n a_{i}A^i\boldsymbol{v}=\sum_{i=0}^n a_{i}\lambda^{i}\boldsymbol{v}=f(\lambda)\boldsymbol{v}
$$
也就是说， $\boldsymbol{v}$ 仍然是 $f(A)$ 的特征向量，对应特征值 $f(\lambda)$。

**定理：若 $A,B$ 为可对角化的矩阵，则**
$$
AB=BA \iff A,B\text{ share a common eigenvector basis } S
$$
从而 $AB$ 也与 $A,B$ 有相同的特征向量，且该特征向量对应的特征值为 $A,B$ 对应特征值相乘。
证明：
- 右推左比较简单，因为若 $A=S\Lambda_{1}S^{-1},B=S\Lambda_{2}S^{-1}$，则 $AB=S\Lambda_{1}\Lambda_{2}S^{-1},BA=S\Lambda_{2}\Lambda_{1}S^{-1}$。由于 $\Lambda_{1},\Lambda_{2}$ 是对角矩阵，$\Lambda_{1}\Lambda_{2}=\Lambda_{2}\Lambda_{1}$。因此 $AB=BA$。
- 左推右比较困难。一个弱的情况是，$B$ 的特征值各异，设为 $\mu_{1},\mu_{2},\dots,\mu_{n}$，且有 $B\boldsymbol{v}_{i}=\mu_{i}\boldsymbol{v}_{i}$，那么可推 $\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots,\boldsymbol{v}_{n}$ 相互独立。只需证明， $\boldsymbol{v}_{i}$ 也是 $A$ 的特征向量。
- 这里条件是 $AB\boldsymbol{v}_{i}=BA\boldsymbol{v}_{i}=\mu_{i}A\boldsymbol{v}_{i}$，若 $A\boldsymbol{v}_i=0$，则 $\boldsymbol{v}_i$ 已是 $A$ 的零特征值特征向量；否则 $A\boldsymbol{v}_{i}$ 是 $B$ 的特征向量，且这里 $A\boldsymbol{v}_{i}$ 和 $\boldsymbol{v}_{i}$ 具有相同的特征值 $\mu_{i}$。
- 假设 $A\boldsymbol{v}_{i}$ 和 $\boldsymbol{v}_{i}$ 线性无关。我们考察 $n+1$ 个向量 $\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots,\boldsymbol{v}_{n},A\boldsymbol{v}_{i}$，对于方程 $(\sum c_{i}\boldsymbol{v}_{i})+c_{n+1}A\boldsymbol{v}_{i}=0$ 我们构造 $\boldsymbol{v}_{i}'=c_{n+1}A\boldsymbol{v}_{i}+c_{i}\boldsymbol{v}_{i}$ 也是一个特征值为 $\mu_{i}$ 的特征向量，则方程等价于 $c_{1}\boldsymbol{v}_{1}+\dots+1\cdot \boldsymbol{v}_{i}'+\dots+c_{n}\boldsymbol{v}_{n}=0$。这里，如果 $\boldsymbol{v}_{i}'\neq 0$，那么 $\boldsymbol{v}_{1},\dots,\boldsymbol{v}_{i}',\dots,\boldsymbol{v}_{n}$ 是特征值互异的特征向量，所以它们相互独立，这个方程就不可能成立了（出现了非零解）。
- 所以唯一的可能性就是 $\boldsymbol{v}_{i}'=0$。然而这样的话，结合我们的假设，就有 $c_{i}=c_{n+1}=0$，另外 $c_{1}=c_{2}=c_{i-1}=c_{i+1}=\dots=c_{n}=0$，这就出现了 $n+1$ 个 $\mathbb{R}^n$ 中的向量相互独立，矛盾。
- 因此假设不成立，$A\boldsymbol{v}_{i}$ 与 $\boldsymbol{v}_{i}$ 线性相关，因此 $\boldsymbol{v}_{i}$ 也是 $A$ 的特征向量。

**结论：$AB$ 与 $BA$ 的非零特征值始终相同。若它们都为 $n\times n$ 方阵，则它们的特征多项式也相同。**
$$
\lambda^n \det(AB - \lambda I_{m})=\lambda ^m \det(BA-\lambda I_{n})
$$
其中 $A$ 为 $m\times n$ 矩阵， $B$ 为 $n\times m$ 矩阵。

**结论：秩为 $1$ 的 $n$ 阶矩阵至少有 $n-1$ 个特征值为 $0$。（$N(A)$ 有 $n-1$ 维，对应特征值为 $0$ 的特征向量）**
### 递推数列与 Markov 矩阵

**应用：推导斐波那契数列通项公式**
斐波那契数列：$F_{0}=0,F_{1}=1$，且有
$$
\begin{bmatrix}
F_{n+2} \\
F_{n+1}
\end{bmatrix}
=
\begin{bmatrix}
1  & 1 \\
1 & 0
\end{bmatrix}
\begin{bmatrix}
F_{n+1} \\
F_{n}
\end{bmatrix}
$$
设

$$
A=\begin{bmatrix}1 & 1 \\ 1 & 0\end{bmatrix},\boldsymbol{u}_{n}=\begin{bmatrix}F_{n+1} \\ F_{n}\end{bmatrix}
$$

，则
$$
\boldsymbol{u}_{n}=A^n \boldsymbol{u}_{0}
$$
将系数矩阵对角化：
$$
\det(A-\lambda I)=\left\lvert  \begin{matrix} 1-\lambda & 1 \\
1 & -\lambda \end{matrix} \right\rvert =0
$$
解得
$$
\lambda_{1}=\frac{1+\sqrt{ 5 }}{2},\lambda_{2}=\frac{1-\sqrt{ 5 }}{2}
$$
对应的特征向量为
$$
S=\begin{bmatrix}
\lambda_{1} & \lambda_{2} \\
1 & 1
\end{bmatrix}
$$
那么有
$$
A^n=(S\Lambda S^{-1})^n=S\begin{bmatrix}
\lambda_{1}^n & 0 \\
0 & \lambda_{2}^n
\end{bmatrix}S^{-1}
$$
这里
$$
\begin{aligned}
F_{n}&=u_{n 2}=(A^n \boldsymbol{u}_{0})_{2}=(A^n)_{21} \\
&=\frac{1}{\lambda_{1}-\lambda_{2}}\left(\begin{bmatrix}
\lambda_{1} & \lambda_{2} \\
1 & 1
\end{bmatrix}\begin{bmatrix}
\lambda_{1}^n & 0 \\
0 & \lambda_{2}^n
\end{bmatrix}\begin{bmatrix}
1 & -\lambda_{2} \\
-1 & \lambda_{1}
\end{bmatrix}\right)_{21}\ \\
&=\frac{1}{\lambda_{1}-\lambda_{2}}(\lambda_{1}^n-\lambda_{2}^n) \\
&=\frac{1}{\sqrt{ 5 }}\left( \left( \frac{1+\sqrt{ 5 }}{2} \right)^n- \left( \frac{1-\sqrt{ 5 }}{2} \right)^n\right)
\end{aligned}

$$
对于一般的递推数列，通用的方法是，构造差分方程
$$
\boldsymbol{u}_{k+1}=A\boldsymbol{u}_{k}
$$
- 若 $\boldsymbol{u}_{0}=\boldsymbol{x}_{i}$ 是一个 $A$ 的特征向量，特征值为 $\lambda_{i}$，那么有
$$
\boldsymbol{u}_{k}=A^k \boldsymbol{u}_{0} =\lambda_{i}^k \boldsymbol{x}_{i}
$$
- 若 $\boldsymbol{u}_{0}=c_{1}\boldsymbol{x}_{1}+\dots+c_{n}\boldsymbol{x}_{n}$，其中 $\boldsymbol{x}_{i}$ 为 $A$ 的特征向量，特征值为 $\lambda _i$，则有
$$
\boldsymbol{u}_{k}=A^k\boldsymbol{u}_{0}=\sum c_{i}\lambda_{i}^k\boldsymbol{x}_{i}
$$
也就是说，先用特征向量为基表示 $\boldsymbol{u}_{0}$，然后矩阵的幂次就直接变成特征值的幂次。
典型的应用就是 Markov 链（概率的转移），对应的递推矩阵称为 Markov 矩阵。定义：一个 $n\times n$ 矩阵 $A$ 被称为 Markov 矩阵，当且仅当
- $a_{ij}\geq 0$。
- 每一列的和都是 $1$。
它具有的性质：
- $A$ 一定有一个特征值 $1$。
  - 证明：由于 $A$ 的每列之和为 $1$，有 $\begin{bmatrix}1 &  \dots & 1\end{bmatrix}A=\begin{bmatrix}1 & \dots & 1\end{bmatrix}$。那么就有 $\begin{bmatrix}1 & \dots & 1\end{bmatrix}^{\top}$ 是 $A^{\top}$ 的一个特征向量，特征值为 $1$。由于 $\det(A^{\top}-\lambda I)=\det((A-\lambda I)^{\top})=\det(A-\lambda I)$，$A$ 与 $A^{\top}$ 具有相同的特征方程，因而 $A$ 也有特征值 $1$。
- 存在某个特征值为 $1$ 对应的特征向量，它的每个分量都非负。
- 其他特征值满足 $\lvert\lambda_{i} \rvert\leq 1$。这里 $\lambda_{i}$ 可以是虚数。
- 若 $a_{ij}>0$，则其他特征值满足 $\lvert \lambda_{i} \rvert < 1$。

