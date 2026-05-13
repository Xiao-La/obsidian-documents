定义：对 $n$ 阶矩阵 $A$，若 $x \in \mathbb{R}^{n}$ ，$x\neq 0$，$\lambda \in \mathbb{R}$，使得
$$
Ax=\lambda x
$$
则称 $\lambda$ 为 $A$ 的特征值（Eigenvalue），$x$ 是 $\lambda$ 对应的特征向量（Eigenvector associated to $\lambda$）。
对于给定的矩阵 $A$，要求特征值，则要解方程 
$$
(A-\lambda I)x=0
$$
既然这里 $x\neq 0$，必然有 
$$\det(A-\lambda I)=0$$
称 $f(\lambda)=\det(A-\lambda I)$ 为特征多项式（Characteristic polynomial），方程 $f(\lambda)=0$ 为特征方程（Characteristic Equation），是一个关于 $\lambda$ 的 $n$ 次方程。
解这个方程，就可以得到所有 $\lambda$；再回代求解 $x$，那么对每个 $\lambda_{i}$，$x$ 就落在 $A-\lambda_{i} I$ 的零空间中。

几何意义 ：经过  $A$ 代表的线性变换后，于原来的向量共线的向量就是特征向量。如果是投影矩阵，几何意义就比较明显。

定义矩阵 $A$ 的迹（trace）为其对角线之和：
$$
\text{tr}(A)=\sum a_{ii}
$$
那么对于方程 $f(\lambda)=0$，通过考察其 $\lambda^{n-1}$ 与 $\lambda^0$ 的系数，根据韦达定理有
$$
\sum \lambda_{i}=\text{tr}(A)
$$
$$
\prod \lambda_{i}=\det(A)
$$
**利用特征值和特征向量，可以将 $n$ 阶矩阵 $A$ 进行对角化（Diagonalization）：**
- 假设 $A$ 有 $n$ 个相互独立的特征向量 $v_{1},v_{2},\dots,v_{n}$，令 $S=\begin{bmatrix}v_{1} & v_{2} & \dots & v_{n}\end{bmatrix}$。
- 那么 $\Lambda =S^{-1}AS$ 是一个对角矩阵$$
\Lambda=\begin{bmatrix}
\lambda_{1} \\
 & \lambda_{2} \\ 
 &  & \ddots \\
 &  &  & \lambda_{n}
\end{bmatrix}
$$
- 几何意义：$S$ 相当于一个基变换矩阵：$\begin{bmatrix}v_{1} & v_{2} & \dots & v_{n}\end{bmatrix}=\begin{bmatrix}e_{1} & e_{2} & \dots & e_{n}\end{bmatrix}S$，以特征向量为基进行线性变换，只是相当于把它们按照相应的特征值进行伸缩。
- 代数视角也容易验证。
- 称 $S$ 为特征向量矩阵（Eigenvector Matrix），称 $\Lambda$ 为特征值矩阵（Eigenvalue matrix）。这里 $S$ 不是唯一的，因为特征向量不唯一。
- **可对角化的充要条件是特征向量相互独立。**
- 对角化可以便于算 $A^n$，因为 $A^n=S\Lambda^{n}S^{-1}$。

**定理：若特征向量 $x_{1},x_{2},\dots,x_{n}$ 有着各异的特征值，则这些特征向量相互独立。**
- 用归纳法得到证明：对方程 $\sum_{i=1}^k c_{i}x_{i}=0$，左乘 $(A-\lambda_{j}I)$，得到 $$\sum_{i=1}^k c_{i}(\lambda _{i}-\lambda_{j})x_{i}=0$$
- 基础情况：取 $k=2$，$j=1$ 得到 $c_{2}(\lambda_{2}-\lambda_{1})x_{2}=0$，由于 $\lambda_{2}-\lambda_{1}\neq 0$ 且 $x_{2}\neq 0$，有 $c_{2}=0$；同理 $c_{1}=0$。所以 $x_{1},x_{2}$ 相互独立
- 假设对 $k$ 命题成立，那么对 $k+1$，左乘 $A-\lambda_{j}I$ 会变成$$
\sum_{i\neq j}c_{i}(\lambda_{i}-\lambda_{j})x_{i}=0
$$
- 这是一个 $k$ 个向量的情况，根据归纳假设，对任意 $i\neq j$ 都有 $c_{i}=0$。遍历所有 $j$，得到所有 $c$ 都为 $0$，故而命题对 $k+1$ 也成立。进一步，对任意 $n$ 都成立。
- 另一种证明方式：利用下面的定理，令 $f(x)=\prod_{i\neq j}(x-\lambda _{i})$，那么对方程 $\sum_{i=1}^nc_{i}x_{i}=0$ 左乘 $f(A)$，则有 $\sum_{i=1}^nc_{i}f(A)x_{i}=\sum_{i=1}^nc_{i}f(\lambda_{i})x_{i}=0$，然而对 $i\neq j$ 都有 $f(\lambda_{i})=0$，对 $i=j$ 有 $f(\lambda_{i})\neq 0$, 于是 $c_{j}=0$。同理 $c_{1}=c_{2}=\dots=c_{n}=0$。

**定理：若  $x$ 是 $A$ 的特征向量，对应特征值 $\lambda$，则 $x$ 同时也是 $A^k$ 的特征向量，对应特征值 $\lambda^k$。**
- 证明： $A^kx=A^{k-1}Ax=A^{k-1}\lambda x=\lambda A^{k-1}x=\dots=\lambda^kx$。
进一步，令  $f(x)=a_{n}x^n+a_{n-1}x^{n-1}+\dots+a_{0}$，且 $v$ 为 $A$ 的一个特征向量，对应特征值 $\lambda$，那么有
$$
f(A)v=\sum a_{i}A^nv=\sum a_{i}\lambda^{n}v=f(\lambda)v
$$
也就是说， $v$ 仍然是 $f(A)$ 的特征向量，对应特征值 $f(\lambda)$。

**定理：若 $A,B$ 为可对角化的矩阵，则** 
$$
AB=BA \iff A,B\text{ share the same eigenvector } S
$$
从而 $AB$ 也与 $A,B$ 有相同的特征向量，且该特征向量对应的特征值为 $A,B$ 对应特征值相乘。
证明：
- 右推左比较简单，因为若 $A=S\Lambda_{1}S^{-1},B=S\Lambda_{2}S^{-1}$，则 $AB=S\Lambda_{1}\Lambda_{2}S^{-1},BA=S\Lambda_{2}\Lambda_{1}S^{-1}$。由于 $\Lambda_{1},\Lambda_{2}$ 是对角矩阵，$\Lambda_{1}\Lambda_{2}=\Lambda_{2}\Lambda_{1}$。因此 $AB=BA$。
- 左推右比较困难。一个弱的情况是，$B$ 的特征值各异，设为 $\mu_{1},\mu_{2},\dots,\mu_{n}$，且有 $Bv_{i}=\mu_{i}v_{i}$，那么可推 $v_{1},v_{2},\dots,v_{n}$ 相互独立。只需证明， $v_{i}$ 也是 $A$ 的特征向量。
- 这里条件是 $ABv_{i}=BAv_{i}=\mu_{i}Av_{i}$，也就是说，$Av_{i}$ 是 $B$ 的特征向量，且这里 $Av_{i}$ 和 $v_{i}$ 具有相同的特征值 $\mu_{i}$。
- 假设 $Av_{i}$ 和 $v_{i}$ 线性无关。我们考察 $n+1$ 个向量 $v_{1},v_{2},\dots,v_{n},Av_{i}$，对于方程 $(\sum c_{i}v_{i})+c_{n+1}Av_{i}=0$ 我们构造 $v_{i}'=c_{n+1}Av_{i}+c_{i}v_{i}$ 也是一个特征值为 $\mu_{i}$ 的特征向量，则方程等价于 $c_{1}v_{1}+\dots+1\cdot v_{i}'+\dots+c_{n}v_{n}=0$。这里，如果 $v_{i}'\neq 0$，那么 $v_{1},\dots,v_{i}',\dots,v_{n}$ 是特征值互异的特征向量，所以它们相互独立，这个方程就不可能成立了（出现了非零解）。
- 所以唯一的可能性就是 $v_{i}'=0$。然而这样的话，结合我们的假设，就有 $c_{i}=c_{n+1}=0$，另外 $c_{1}=c_{2}=c_{i-1}=c_{i+1}=\dots=c_{n}=0$，这就出现了 $n+1$ 个 $\mathbb{R}^n$ 中的向量相互独立，矛盾。
- 因此假设不成立，$Av_{i}$ 与 $v_{i}$ 线性相关，因此 $v_{i}$ 也是 $A$ 的特征向量。

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
设 $A=\begin{bmatrix}1 & 1 \\ 1 & 0\end{bmatrix},u_{n}=\begin{bmatrix}F_{n+1} \\ F_{n}\end{bmatrix}$，则
$$
u_{n}=A^n u_{0}
$$
将系数矩阵对角化：
$$
\det(A-\lambda I)=\left| \begin{matrix} 1-\lambda & 1 \\
1 & -\lambda \end{matrix} \right|=0
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
\begin{align}
F_{n}&=u_{n 1}=(A^n u_{0})_{2}=(A^n)_{21} \\
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
\end{align}

$$
对于一般的递推数列，通用的方法是，构造差分方程
$$
u_{k+1}=Au_{k}
$$
- 若 $u_{0}=x_{i}$ 是一个 $A$ 的特征向量，特征值为 $\lambda_{i}$，那么有
$$
u_{n}=A^k u_{0} =\lambda_{i}^k x_{i}
$$
- 若 $u_{0}=c_{1}x_{1}+\dots+c_{n}x_{n}$，其中 $x_{i}$ 为 $A$ 的特征向量，特征值为 $\lambda _i$，则有
$$
u_{k}=A^ku_{0}=\sum c_{i}\lambda_{i}^kx_{i}
$$
也就是说，先用特征向量为基表示 $u_{0}$，然后矩阵的幂次就直接变成特征值的幂次。