### 复矩阵

复向量空间 （Complex Vector Space） $\mathbb{C}^n$：
$$
\begin{bmatrix}
x_{1} \\
\vdots \\
x_{n}
\end{bmatrix}
$$
其中 $x_{i}\in \mathbb{C}$，也就是说，$x_{i}=a_{i}+i b_{i}$。
空间中定义的加法和数乘（这里的数是复数）都是平凡的。
定义共轭：
$$
\bar{x}=\begin{bmatrix}
\overline{x_{1}} \\
\vdots \\
\overline{x_{n}}
\end{bmatrix}
$$
定义内积（inner product）：
$$
\left< x,y \right> :=\overline{x}^Ty= \overline{x_{1}}y_{1}+\overline{x_{2}}y_{2}+\dots+\overline{x_{n}}y_{n}\in \mathbb{C}
$$
定义正交：
$$
x\perp y\iff \left< x,y \right> =0
$$
定义长度（Length）：
$$
\lVert x \rVert ^{2}=\overline{x}^Tx=\overline{x_{1}}x_{1}+\overline{x_{2}}x_{2}+\dots+\overline{x_{n}}x_{n}
$$
复矩阵（Complex Matrices）:
$$
A=(a_{ij})_{m\times n}, a_{ij}\in \mathbb{C}
$$
共轭：
$$
\bar{A}=(\overline{a_{ij}})_{m\times n}
$$
$$
\overline{AB}=\overline{A}\,\,\overline{B}
$$
$$
\overline{\lambda A}=\overline{\lambda}\,\,\overline{A}
$$
共轭转置（Conjugate Transpose）：
$$
A^H:=\overline{A}^T=\overline{A^T}
$$
这里有
$$
(AB)^H=B^HA^H
$$
用定义容易证明。

#### **埃尔米特矩阵（Hermitian Matrices）：*

满足 $A^H=A$ 的矩阵。
- 埃尔米特矩阵是方阵。
- 对角元为实数。（共轭等于本身）
- 若这里 $A$ 是实矩阵，则 $A^H=A^T$，所以它为一个对称矩阵。


**定理：埃尔米特矩阵的特征值是实数。**
  - 引理：$x^HAx$ 是实数。这是因为，$(x^HAx)^H=x^HA^H(x^H)^H=x^HAx$。
  - 假设 $\lambda\in \mathbb{C}$ 是一个 $A$ 的特征值，对应非零的特征向量 $x\in \mathbb{C}^n$。
  - 那么 $Ax=\lambda x$，因此 $x^HAx=x^H\lambda x=\lambda \lVert x \rVert^{2}$ 是一个实数，而 $\lVert x \rVert^{2}$ 也是一个实数。
  - 那么 $\lambda= \frac{x^HAx}{x^Hx}$ 是一个实数。

**定理：若 $x,y$ 是埃尔米特矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $x\perp y$。**
  - 证明：$(Ax)^H y$  既等于 $(\lambda x)^Hy=\lambda (x^Hy)$，又等于 $x^HA^Hy=x^HAy=x^H\mu y=\mu(x^Hy)$。由于 $\lambda\neq \mu$，必然有 $x^Hy=0$。

**定理：实对称矩阵可以被对角化分解为 $A=Q\Lambda Q^T$ 的形式，其中 $Q$ 是一个正交矩阵（列为特征向量），$\Lambda$ 是一个对角矩阵。**
- 实对称矩阵是埃尔米特矩阵，因此若特征值两两不同，可得特征向量两两垂直。再标准化一下就得到 $S=Q$，由于 $Q^TQ=I$，就得到上面的形式。
**进一步的，实对称矩阵可以写成一维投影矩阵（投影到每个特征向量上）的线性组合。**
- 
$$
A=Q\Lambda Q^T=\begin{bmatrix}
x_{1} & \dots & x_{n} 
\end{bmatrix} \begin{bmatrix}
\lambda_{1} \\
 & \ddots \\
 &  & \lambda_{n}
\end{bmatrix}\begin{bmatrix}
x_{1}^T \\
\vdots\\
x_{n}^T

\end{bmatrix}
=\sum\lambda_{i}x_{i}x_{i}^T
$$
**推广：埃尔米特矩阵可以被对角化分解为**
$$
A=U\Lambda U^H
$$
其中 $U$ 是酉矩阵，满足 $U^HU=I$。

#### 酉矩阵 （Unitary Matrix）
 
 有着规范正交的列的 $n\times n$ 的复矩阵。
$$
U^HU=I
$$

**定理：$(Ux)^H(Uy)=x^Hy$（保内积）。**

**定理：每个 $U$ 的特征值都有 $|\lambda|=1$。**
- $(Ux)^H(Ux)=x^Hx=(\lambda x^H)(\lambda x)=\lambda^{2}x^Hx\implies \lvert \lambda \rvert=1$
例如：
$$
U=\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$
则
$$
\lvert U-\lambda I \rvert =\lambda^{2}-2\cos\theta\lambda+1
$$
$$
\implies\lambda=\cos\pm i\sin\theta=e^{\pm i\theta}\implies \lvert \lambda \rvert =1
$$
**定理：若 $x,y$ 是酉矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $x\perp y$。****
- $x^Hy=(Ux)^H(Uy)=(\lambda x)^H(\mu y)=\mu\bar{\lambda}(x^Hy)$。
- 这里 $\mu\bar{\lambda}=(\mu-\lambda)\bar{\lambda}+\lambda\bar{\lambda}=(\mu-\lambda)\bar{\lambda}+1\neq 1$。
- 所以 $x^Hy=0$。

#### 斜埃尔米特矩阵（Skew-Hermitian Matrices）

$$
K^H=-K
$$
对角元素满足 $a-bi=-(a+bi)\implies a=0$，所以为纯虚数。
若 $K$ 是实矩阵，则称 $K$ 是斜对称/反对称（Skew-Symmetric）的（$K^T=K$），对角元为 $0$。
**若 $K$ 为 skew-Hermitian 矩阵，则 $iK$ 为 Hermitian 矩阵。**
- $K^H=-K\implies(iK)^H=(\bar{i} \bar{K})^T=K^T(-i)^T=-iK^H=iK$。

**skew-Hermitian 矩阵的特征值为纯虚数。**
- $iK$ 是 Hermitian 矩阵。因此，$(iK)x=\lambda x,\lambda\in \mathbb{R}$。
- 因此 $Kx=\frac{\lambda}{i}x=-\lambda ix$.

**定理：若 $x,y$ 是斜埃尔米特矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $x\perp y$。

#### 总结


| Real                                | Cpx                                                |
| ----------------------------------- | -------------------------------------------------- |
| $\lVert x \rVert=\sum x_{i}^{2}$    | $\lVert x \rVert^{2}=\sum \lvert x_{i} \rvert^{2}$ |
| $\left< x,y \right> =x^Ty$          | $\left< x,y \right> =x^Hy$                         |
| Orthogonal：$x^Ty=0$                 | Orthogonal：$x^Ty=0$                                |
| $A^T$                               | $A^H$                                              |
| $(AB)^T=B^TA^T$                     | $(AB)^H=B^HA^H$                                    |
| Symmetric Matrices $A=A^T$          | Hermitian Matrices $A=A^H$                         |
| Symmetric Matrices $A=Q\Lambda Q^T$ | Hermitian Matrices $A=U\Lambda U^H$                |
| Orthogonal Matrices $Q^TQ=I$        | Unitary Matrices $U^HU=I$                          |
| Skew-Symmetric Matrices $A^T=-A$    | Skew-Hermitian Matrices $A^H=-A$                   |
对于 Hermitian, Unitary, Skew-Hermitian 矩阵，不同的特征值对应的特征向量相互垂直。它们都可以用酉矩阵进行对角化。

### 相似矩阵

定义：称 $A,B$ 为相似矩阵，当且仅当存在可逆矩阵 $M$ 使得 $B=M^{-1}AM$（也就是 $A=MBM^{-1}$）。记作 $A\sim B$。

定理：若 $A\sim B$，则 $A$ 和 $B$ 有相同的特征值，且 $A$ 的每个特征向量 $x$ 对应 $B$ 的特征向量 $M^{-1}x$。
- $Ax=\lambda x\implies B(M^{-1}x)=M^{-1}AMM^{-1}x=M^{-1}Ax=\lambda(M^{-1}x)$。
- 另一种解释：$\det(B-\lambda I)=\det(M^{-1}AM-\lambda I)=\det(M^{-1}(A-\lambda I)M)=\det(A-\lambda I)$。

相似矩阵的集合意义：$A\sim B$ 可以解释成它们代表相同的线性变换 $T:\mathbb{R}^n\to \mathbb{R}^n$，只是用不同的基 $V=\begin{bmatrix}v_{1} & \dots & v_{n} \end{bmatrix}$ 和 $W=\begin{bmatrix}w_{1} & \dots & w_{n}\end{bmatrix}$，且有：
$$
W=VM
$$
就有
$$
B=M^{-1}AM
$$

Schor Lemma：对任意复矩阵 $A$，存在一个酉矩阵 $U$，使得 $T=U^{-1}AU$ 为一个上三角矩阵。
证明：
- 假设存在 $T=U^{-1}AU$ 是一个上三角矩阵，则 $AU=UT$，设 $U=\begin{bmatrix}x_{1} & \dots & x_{n}\end{bmatrix}$ 对照一下得到 $Ax_{1}=t_{11}x_{1}$。那么 $\lVert x_{1} \rVert=1$ 且 $x_{1}$ 是 $A$ 的一个特征向量，特征值为 $t_{11}$。
- $n=2$ 的情况：$$\begin{align}
Ax_{1}=t_{11}x_{1} & & (1) \\
Ax_{2}=t_{12}x_{1}+t_{22}u_{2} &  & (2)
\end{align} $$
- 由于 $\det (A-\lambda I)=0$ 有至少一个解 $\lambda_{1}\in \mathbb{C}$，则可以找到 $v_{1}\in \mathbb{C}$，使得 $Av_{1}=\lambda_{1}v_{1}$。
- 我们令 $x_{1}=\frac{v_{1}}{\lVert v_{1} \rVert},t_{11}=\lambda_{1}$，则 $(1)$ 成立。
- 存在 $x_{2}\in \mathbb{C}^{2}$，使得 $x_{1}\perp x_{2}$，$\lVert x_{2} \rVert=1$，这里 $x_{1},x_{2}$ 就是 $\mathbb{C}^{2}$ 的一组基（用 Gram-Schmidt 正交化可以找到）, 那么存在 $t_{12},t_{22}\in \mathbb{C}$，使得 $Ax_{2}=t_{12}x_{1}+t_{22}x_{2}$。这就得到了一个上三角矩阵 $T$。
- $n=3$ 的情况：同样有一个 $Ax_{1}=\lambda_{1}x_{1}$，用 Gram-Schmidt 正交化方法，可以找到一组标准正交基 $x_{1},x_{2},x_{3}\in \mathbb{C}^3$，那么有：
$$\begin{align}
Ax_{1}=\lambda_{1}x_{1}  \\
Ax_{2}=a_{12}x_{1}+a_{22}x_{2}+a_{32}x_{3}  \\
Ax_{3}=a_{13}x_{1}+a_{23}x_{2}+a_{33}x_{3}
\end{align} $$
- 这里令 $U'=\begin{bmatrix}x_{1} & x_{2} & x_{3}\end{bmatrix}$ ，$T'=\begin{bmatrix}\lambda_{1} & a_{12} & a_{13} \\ 0 & a_{22} & a_{23} \\ 0 & a_{32} & a_{33}\end{bmatrix}$。
- 那么就有 $AU'=U'T'$。把 $T'$ 写成 $\begin{bmatrix}\lambda_{1} & a \\ 0 & A_{1}\end{bmatrix}$。要把 $A_{1}$ 变成上三角矩阵，这个就是 $n=2$ 的情况，于是存在 $U_{1}$ 使得 $U_{1}^{-1}A_{1}U_{1}$ 是上三角矩阵。
- 那么存在 $U_{2}=\begin{bmatrix}1 & 0 \\ 0 & U_{1}\end{bmatrix},U_{2}^{-1}=\begin{bmatrix}1 & 0 \\ 0 & U_{1}^{-1}\end{bmatrix}$ 是一个酉矩阵，使得 $T=U_{2}^{-1}T'U_{2}=\begin{bmatrix}\lambda_{1} & aU_{1} \\ 0 & U_{1}^{-1}A_{1}U_{1}\end{bmatrix}$ 是一个上三角矩阵。
- 于是有 $T=U_{1}^{-1}U'^{-1}T'U'U_{1}$，也就是存在 $U=U'U_{1}$ 使得 $T=U^{-1}AU$ 为上三角矩阵。
- 递归可证明原定理。


谱定理（Spectral Theorem）：若 $A$ 是埃尔米特矩阵，则存在酉矩阵 $U$ 使得 $U^{-1}AU=\Lambda$（实对称矩阵）。
- Schor Lemma 给出存在酉矩阵 $U$ 使得 $U^{-1}AU$  是上三角矩阵。
- 又因为 $(U^{-1}AU)^H=(U^HAU)^H=U^HA^HU=U^HAU=U^{-1}AU$，它是一个对角矩阵。

Remark：若 $A$ 是一个实对称矩阵，Schor Lemma 中的 $U$ 可以选成 $Q$，进一步得出 $Q^{-1}AQ$ 是对角矩阵。（正交对角化）

将对称矩阵 $A$ 写成 $Q\Lambda Q^T$，叫做 $A$ 的 **谱分解**：
$$
A=Q\Lambda Q^T=\sum\lambda_{i}u_{i}u_{i}^T
$$
这就是一些投影矩阵的和。

**代数重数**：特征方程中，某一个根的重根数，叫做这个根的代数重数。

谱分解定理（Spectrum Decomposition Theorem）：任何埃尔米特矩阵 $A$ 有 $k$ 个特征值 $\lambda_{1},\dots,\lambda_{k}$，每个特征值对应的特征向量张成子空间 $V_{i}$ 则谱定理告诉我们：
$$
A=\sum\lambda_{i}P_{i}
$$
其中 $P_{i}$ 为向子空间 $V_{i}$ 作投影的投影矩阵。

定义正规矩阵（Normal Matrices）：若 $AA^H=A^HA$，则称 $A$ 为正规的（Normal）。
- Hermitian, Skew-Hermitian, Unitary 矩阵都是正规矩阵。
Remark：
- Hermitian 矩阵 $A^H=A$，则 $\lambda=\bar{\lambda}$，则 $\lambda$ 为实数。
- Skew Hermitian 矩阵 $A^H=-A$，则 $\lambda=-\bar{\lambda}$，则 $\lambda$ 为纯虚数。
- Unitary 矩阵 $A^HA=I$，则 $\bar{\lambda}\lambda=\lvert \lambda \rvert^{2}=1$，则 $\lvert \lambda \rvert=1$。

正规矩阵的谱定理（Spectral Theorem for Normal Matrices）：一个复矩阵 $A$ 可以被酉矩阵 $U$ 对角化，当且仅当 $A$ 是正规矩阵。
- 证明：$\implies$：$A=U\Lambda U^H$，那么 $AA^H=U(\Lambda\Lambda^H)U^H=U(\Lambda^H\Lambda)U^H=A^HA$。 
- 右推左：Schor Lemma 给出存在酉矩阵 $U$ 使得 $T=U^HAU$ 是一个上三角矩阵。这里 $TT^H=(U^HAU)(U^HA^HU)=U^HAA^HU=U^HA^HAU=T^HT$。那么 $T$ 也是一个正当矩阵。可以证明，上三角的正规矩阵必然是对角矩阵，于是就完成了证明。

（期末不考）
定义约当块（Jordan Block）：
$$
J_{i}=\begin{bmatrix}
\lambda_{i} & 1 \\
 & \lambda_{i} & 1 \\
 &  & \ddots & \ddots \\
 &  &  & \ddots & 1 \\
 &  &  &  & \lambda_i
\end{bmatrix}
$$
定义约当形（Jordan Form）：
$$
J=\begin{bmatrix}
J_{1} \\
 & J_{2} \\
 &  & \ddots \\
 &  &  & J_{s}
\end{bmatrix}
$$
其中 $J_{i}$ 为约当块。

那么：
- $\det(J_{i}-\lambda I)=(\lambda_{i}-\lambda)^n=0\implies\lambda=\lambda_{i}$。
- $(J_{i}-\lambda_{i}I)x=0\implies x=\begin{bmatrix}1 \\ 0 \\ \vdots \\ 0\end{bmatrix}$。
约当形的矩阵是最不可对角化的形式。
有相同的 Jordan Form 等价于相似。