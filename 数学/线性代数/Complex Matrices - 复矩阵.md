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
\bar{\boldsymbol{x}}=\begin{bmatrix}
\overline{x_{1}} \\
\vdots \\
\overline{x_{n}}
\end{bmatrix}
$$
定义内积（inner product）：
$$
\left\langle  \boldsymbol{x},\boldsymbol{y} \right\rangle  :=\overline{\boldsymbol{x}}^{\top}\boldsymbol{y}= \overline{x_{1}}y_{1}+\overline{x_{2}}y_{2}+\dots+\overline{x_{n}}y_{n}\in \mathbb{C}
$$
定义正交：
$$
\boldsymbol{x}\perp \boldsymbol{y}\iff \left\langle  \boldsymbol{x},\boldsymbol{y} \right\rangle  =0
$$
定义长度（Length）：
$$
\lVert \boldsymbol{x} \rVert ^{2}=\overline{\boldsymbol{x}}^{\top}\boldsymbol{x}=\overline{x_{1}}x_{1}+\overline{x_{2}}x_{2}+\dots+\overline{x_{n}}x_{n}
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
A^{\mathrm{H}}:=\overline{A}^{\top}=\overline{A^{\top}}
$$
这里有
$$
(AB)^{\mathrm{H}}=B^{\mathrm{H}}A^{\mathrm{H}}
$$
用定义容易证明。

#### 埃尔米特矩阵（Hermitian Matrices）

满足 $A^{\mathrm{H}}=A$ 的矩阵。
- 埃尔米特矩阵是方阵。
- 对角元为实数。（共轭等于本身）
- 若这里 $A$ 是实矩阵，则 $A^{\mathrm{H}}=A^{\top}$，所以它为一个对称矩阵。


**定理：埃尔米特矩阵的特征值是实数。**
  - 引理：$\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{x}$ 是实数。这是因为，$(\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{x})^{\mathrm{H}}=\boldsymbol{x}^{\mathrm{H}}A^{\mathrm{H}}(\boldsymbol{x}^{\mathrm{H}})^{\mathrm{H}}=\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{x}$。
  - 假设 $\lambda\in \mathbb{C}$ 是一个 $A$ 的特征值，对应非零的特征向量 $\boldsymbol{x}\in \mathbb{C}^n$。
  - 那么 $A\boldsymbol{x}=\lambda \boldsymbol{x}$，因此 $\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{x}=\boldsymbol{x}^{\mathrm{H}}\lambda \boldsymbol{x}=\lambda \lVert \boldsymbol{x} \rVert^{2}$ 是一个实数，而 $\lVert \boldsymbol{x} \rVert^{2}$ 也是一个实数。
  - 那么 $\lambda= \frac{\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{x}}{\boldsymbol{x}^{\mathrm{H}}\boldsymbol{x}}$ 是一个实数。

**定理：若 $\boldsymbol{x},\boldsymbol{y}$ 是埃尔米特矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $\boldsymbol{x}\perp \boldsymbol{y}$。**
  - 证明：$(A\boldsymbol{x})^{\mathrm{H}} \boldsymbol{y}$  既等于 $(\lambda \boldsymbol{x})^{\mathrm{H}}\boldsymbol{y}=\lambda (\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y})$，又等于 $\boldsymbol{x}^{\mathrm{H}}A^{\mathrm{H}}\boldsymbol{y}=\boldsymbol{x}^{\mathrm{H}}A\boldsymbol{y}=\boldsymbol{x}^{\mathrm{H}}\mu \boldsymbol{y}=\mu(\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y})$。由于 $\lambda\neq \mu$，必然有 $\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}=0$。

**定理：实对称矩阵可以被对角化分解为 $A=Q\Lambda Q^{\top}$ 的形式，其中 $Q$ 是一个正交矩阵（列为特征向量），$\Lambda$ 是一个对角矩阵。**
- 实对称矩阵是埃尔米特矩阵，因此若特征值两两不同，可得特征向量两两垂直。再标准化一下就得到 $S=Q$，由于 $Q^{\top}Q=I$，就得到上面的形式。
**进一步的，实对称矩阵可以写成一维投影矩阵（投影到每个特征向量上）的线性组合。**
-
$$
A=Q\Lambda Q^{\top}=\begin{bmatrix}
\boldsymbol{x}_{1} & \dots & \boldsymbol{x}_{n}
\end{bmatrix} \begin{bmatrix}
\lambda_{1} \\
 & \ddots \\
 &  & \lambda_{n}
\end{bmatrix}\begin{bmatrix}
\boldsymbol{x}_{1}^{\top} \\
\vdots\\
\boldsymbol{x}_{n}^{\top}

\end{bmatrix}
=\sum\lambda_{i}\boldsymbol{x}_{i}\boldsymbol{x}_{i}^{\top}
$$
**推广：埃尔米特矩阵可以被对角化分解为**
$$
A=U\Lambda U^{\mathrm{H}}
$$
其中 $U$ 是酉矩阵，满足 $U^{\mathrm{H}}U=I$。

#### 酉矩阵 （Unitary Matrix）

 有着规范正交的列的 $n\times n$ 的复矩阵。
$$
U^{\mathrm{H}}U=I
$$

**定理：$(U\boldsymbol{x})^{\mathrm{H}}(U\boldsymbol{y})=\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}$（保内积）。**

**定理：每个 $U$ 的特征值都有 $\lvert \lambda\rvert =1$。**
- $(U\boldsymbol{x})^{\mathrm{H}}(U\boldsymbol{x})=\boldsymbol{x}^{\mathrm{H}}\boldsymbol{x}=(\bar\lambda \boldsymbol{x}^{\mathrm{H}})(\lambda \boldsymbol{x})=\lvert \lambda\rvert ^{2}\boldsymbol{x}^{\mathrm{H}}\boldsymbol{x}\implies \lvert \lambda \rvert=1$
例如：
$$
U=\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$
则
$$
\det(U-\lambda I) =\lambda^{2}-2\cos\theta\lambda+1
$$
$$
\implies\lambda=\cos\theta\pm i\sin\theta=e^{\pm i\theta}\implies \lvert \lambda \rvert =1
$$
**定理：若 $\boldsymbol{x},\boldsymbol{y}$ 是酉矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $\boldsymbol{x}\perp \boldsymbol{y}$。**
- $\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}=(U\boldsymbol{x})^{\mathrm{H}}(U\boldsymbol{y})=(\lambda \boldsymbol{x})^{\mathrm{H}}(\mu \boldsymbol{y})=\mu\bar{\lambda}(\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y})$。
- 这里 $\mu\bar{\lambda}=(\mu-\lambda)\bar{\lambda}+\lambda\bar{\lambda}=(\mu-\lambda)\bar{\lambda}+1\neq 1$。
- 所以 $\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}=0$。

#### 斜埃尔米特矩阵（Skew-Hermitian Matrices）

$$
K^{\mathrm{H}}=-K
$$
对角元素满足 $a-bi=-(a+bi)\implies a=0$，所以为纯虚数。
若 $K$ 是实矩阵，则称 $K$ 是斜对称/反对称（Skew-Symmetric）的（$K^{\top}=-K$），对角元为 $0$。
**若 $K$ 为 skew-Hermitian 矩阵，则 $iK$ 为 Hermitian 矩阵。**
- $K^{\mathrm{H}}=-K\implies(iK)^{\mathrm{H}}=\bar i K^{\mathrm{H}}=-i(-K)=iK$。

**skew-Hermitian 矩阵的特征值为纯虚数。**
- $iK$ 是 Hermitian 矩阵。因此，$(iK)\boldsymbol{x}=\lambda \boldsymbol{x},\lambda\in \mathbb{R}$。
- 因此 $K\boldsymbol{x}=\frac{\lambda}{i}\boldsymbol{x}=-\lambda i\boldsymbol{x}$.

**定理：若 $\boldsymbol{x},\boldsymbol{y}$ 是斜埃尔米特矩阵的两特征向量，对应不同的特征值 $\lambda,\mu$，则 $\boldsymbol{x}\perp \boldsymbol{y}$。**

#### 总结


| Real                                | Cpx                                                |
| ----------------------------------- | -------------------------------------------------- |
| $\lVert \boldsymbol{x} \rVert^{2}=\sum x_{i}^{2}$    | $\lVert \boldsymbol{x} \rVert^{2}=\sum \lvert x_{i} \rvert^{2}$ |
| $\left\langle  \boldsymbol{x},\boldsymbol{y} \right\rangle  =\boldsymbol{x}^{\top}\boldsymbol{y}$          | $\left\langle  \boldsymbol{x},\boldsymbol{y} \right\rangle  =\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}$                         |
| Orthogonal：$\boldsymbol{x}^{\top}\boldsymbol{y}=0$                 | Orthogonal：$\boldsymbol{x}^{\mathrm{H}}\boldsymbol{y}=0$                                |
| $A^{\top}$                               | $A^{\mathrm{H}}$                                              |
| $(AB)^{\top}=B^{\top}A^{\top}$                     | $(AB)^{\mathrm{H}}=B^{\mathrm{H}}A^{\mathrm{H}}$                                    |
| Symmetric Matrices $A=A^{\top}$          | Hermitian Matrices $A=A^{\mathrm{H}}$                         |
| Symmetric Matrices $A=Q\Lambda Q^{\top}$ | Hermitian Matrices $A=U\Lambda U^{\mathrm{H}}$                |
| Orthogonal Matrices $Q^{\top}Q=I$        | Unitary Matrices $U^{\mathrm{H}}U=I$                          |
| Skew-Symmetric Matrices $A^{\top}=-A$    | Skew-Hermitian Matrices $A^{\mathrm{H}}=-A$                   |
对于 Hermitian, Unitary, Skew-Hermitian 矩阵，不同的特征值对应的特征向量相互垂直。它们都可以用酉矩阵进行对角化。

### 相似矩阵

定义：称 $A,B$ 为相似矩阵，当且仅当存在可逆矩阵 $M$ 使得 $B=M^{-1}AM$（也就是 $A=MBM^{-1}$）。记作 $A\sim B$。

定理：若 $A\sim B$，则 $A$ 和 $B$ 有相同的特征值，且 $A$ 的每个特征向量 $\boldsymbol{x}$ 对应 $B$ 的特征向量 $M^{-1}\boldsymbol{x}$。
- $A\boldsymbol{x}=\lambda \boldsymbol{x}\implies B(M^{-1}\boldsymbol{x})=M^{-1}AMM^{-1}\boldsymbol{x}=M^{-1}A\boldsymbol{x}=\lambda(M^{-1}\boldsymbol{x})$。
- 另一种解释：$\det(B-\lambda I)=\det(M^{-1}AM-\lambda I)=\det(M^{-1}(A-\lambda I)M)=\det(A-\lambda I)$。

相似矩阵的集合意义：$A\sim B$ 可以解释成它们代表相同的线性变换 $T:\mathbb{R}^n\to \mathbb{R}^n$，只是用不同的基 $V=\begin{bmatrix}\boldsymbol{v}_{1} & \dots & \boldsymbol{v}_{n} \end{bmatrix}$ 和 $W=\begin{bmatrix}\boldsymbol{w}_{1} & \dots & \boldsymbol{w}_{n}\end{bmatrix}$，且有：
$$
W=VM
$$
就有
$$
B=M^{-1}AM
$$

Schur Lemma：对任意复矩阵 $A$，存在一个酉矩阵 $U$，使得 $T=U^{-1}AU$ 为一个上三角矩阵。
证明：
- 假设存在 $T=U^{-1}AU$ 是一个上三角矩阵，则 $AU=UT$，设 $U=\begin{bmatrix}\boldsymbol{x}_{1} & \dots & \boldsymbol{x}_{n}\end{bmatrix}$ 对照一下得到 $A\boldsymbol{x}_{1}=t_{11}\boldsymbol{x}_{1}$。那么 $\lVert \boldsymbol{x}_{1} \rVert=1$ 且 $\boldsymbol{x}_{1}$ 是 $A$ 的一个特征向量，特征值为 $t_{11}$。
- $n=2$ 的情况：$$\begin{aligned}
A\boldsymbol{x}_{1}=t_{11}\boldsymbol{x}_{1} & & (1) \\
A\boldsymbol{x}_{2}=t_{12}\boldsymbol{x}_{1}+t_{22}\boldsymbol{x}_{2} &  & (2)
\end{aligned} $$
- 由于 $\det (A-\lambda I)=0$ 有至少一个解 $\lambda_{1}\in \mathbb{C}$，则可以找到 $\boldsymbol{v}_{1}\in \mathbb{C}^{2}\setminus\{0\}$，使得 $A\boldsymbol{v}_{1}=\lambda_{1}\boldsymbol{v}_{1}$。
- 我们令 $\boldsymbol{x}_{1}=\frac{\boldsymbol{v}_{1}}{\lVert \boldsymbol{v}_{1} \rVert},t_{11}=\lambda_{1}$，则 $(1)$ 成立。
- 存在 $\boldsymbol{x}_{2}\in \mathbb{C}^{2}$，使得 $\boldsymbol{x}_{1}\perp \boldsymbol{x}_{2}$，$\lVert \boldsymbol{x}_{2} \rVert=1$，这里 $\boldsymbol{x}_{1},\boldsymbol{x}_{2}$ 就是 $\mathbb{C}^{2}$ 的一组基（用 Gram-Schmidt 正交化可以找到）, 那么存在 $t_{12},t_{22}\in \mathbb{C}$，使得 $A\boldsymbol{x}_{2}=t_{12}\boldsymbol{x}_{1}+t_{22}\boldsymbol{x}_{2}$。这就得到了一个上三角矩阵 $T$。
- $n=3$ 的情况：同样有一个 $A\boldsymbol{x}_{1}=\lambda_{1}\boldsymbol{x}_{1}$，用 Gram-Schmidt 正交化方法，可以找到一组标准正交基 $\boldsymbol{x}_{1},\boldsymbol{x}_{2},\boldsymbol{x}_{3}\in \mathbb{C}^3$，那么有：
$$\begin{aligned}
A\boldsymbol{x}_{1}=\lambda_{1}\boldsymbol{x}_{1}  \\
A\boldsymbol{x}_{2}=a_{12}\boldsymbol{x}_{1}+a_{22}\boldsymbol{x}_{2}+a_{32}\boldsymbol{x}_{3}  \\
A\boldsymbol{x}_{3}=a_{13}\boldsymbol{x}_{1}+a_{23}\boldsymbol{x}_{2}+a_{33}\boldsymbol{x}_{3}
\end{aligned} $$
- 这里令 $U'=\begin{bmatrix}\boldsymbol{x}_{1} & \boldsymbol{x}_{2} & \boldsymbol{x}_{3}\end{bmatrix}$ ，

  $$
  T'=\begin{bmatrix}\lambda_{1} & a_{12} & a_{13} \\ 0 & a_{22} & a_{23} \\ 0 & a_{32} & a_{33}\end{bmatrix}
  $$

  。
- 那么就有 $AU'=U'T'$。把 $T'$ 写成

  $$
  \begin{bmatrix}\lambda_{1} & a \\ 0 & A_{1}\end{bmatrix}
  $$

  。要把 $A_{1}$ 变成上三角矩阵，这个就是 $n=2$ 的情况，于是存在 $U_{1}$ 使得 $U_{1}^{-1}A_{1}U_{1}$ 是上三角矩阵。
- 那么存在

  $$
  U_{2}=\begin{bmatrix}1 & 0 \\ 0 & U_{1}\end{bmatrix},U_{2}^{-1}=\begin{bmatrix}1 & 0 \\ 0 & U_{1}^{-1}\end{bmatrix}
  $$

   是一个酉矩阵，使得

  $$
  T=U_{2}^{-1}T'U_{2}=\begin{bmatrix}\lambda_{1} & aU_{1} \\ 0 & U_{1}^{-1}A_{1}U_{1}\end{bmatrix}
  $$

   是一个上三角矩阵。
- 于是有 $T=U_{2}^{-1}U'^{-1}AU'U_{2}$，也就是存在 $U=U'U_{2}$ 使得 $T=U^{-1}AU$ 为上三角矩阵。
- 递归可证明原定理。


谱定理（Spectral Theorem）：若 $A$ 是埃尔米特矩阵，则存在酉矩阵 $U$ 使得 $U^{-1}AU=\Lambda$（实对称矩阵）。
- Schur Lemma 给出存在酉矩阵 $U$ 使得 $U^{-1}AU$  是上三角矩阵。
- 又因为 $(U^{-1}AU)^{\mathrm{H}}=(U^{\mathrm{H}}AU)^{\mathrm{H}}=U^{\mathrm{H}}A^{\mathrm{H}}U=U^{\mathrm{H}}AU=U^{-1}AU$，它是一个对角矩阵。

Remark：若 $A$ 是一个实对称矩阵，Schur Lemma 中的 $U$ 可以选成 $Q$，进一步得出 $Q^{-1}AQ$ 是对角矩阵。（正交对角化）

将对称矩阵 $A$ 写成 $Q\Lambda Q^{\top}$，叫做 $A$ 的 **谱分解**：
$$
A=Q\Lambda Q^{\top}=\sum\lambda_{i}\boldsymbol{u}_{i}\boldsymbol{u}_{i}^{\top}
$$
这就是一些投影矩阵的和。

**代数重数**：特征方程中，某一个根的重根数，叫做这个根的代数重数。

谱分解定理（Spectrum Decomposition Theorem）：任何埃尔米特矩阵 $A$ 有 $k$ 个特征值 $\lambda_{1},\dots,\lambda_{k}$，每个特征值对应的特征向量张成子空间 $V_{i}$ 则谱定理告诉我们：
$$
A=\sum\lambda_{i}P_{i}
$$
其中 $P_{i}$ 为向子空间 $V_{i}$ 作投影的投影矩阵。

定义正规矩阵（Normal Matrices）：若 $AA^{\mathrm{H}}=A^{\mathrm{H}}A$，则称 $A$ 为正规的（Normal）。
- Hermitian, Skew-Hermitian, Unitary 矩阵都是正规矩阵。
Remark：
- Hermitian 矩阵 $A^{\mathrm{H}}=A$，则 $\lambda=\bar{\lambda}$，则 $\lambda$ 为实数。
- Skew Hermitian 矩阵 $A^{\mathrm{H}}=-A$，则 $\lambda=-\bar{\lambda}$，则 $\lambda$ 为纯虚数。
- Unitary 矩阵 $A^{\mathrm{H}}A=I$，则 $\bar{\lambda}\lambda=\lvert \lambda \rvert^{2}=1$，则 $\lvert \lambda \rvert=1$。

正规矩阵的谱定理（Spectral Theorem for Normal Matrices）：一个复矩阵 $A$ 可以被酉矩阵 $U$ 对角化，当且仅当 $A$ 是正规矩阵。
- 证明：$\implies$：$A=U\Lambda U^{\mathrm{H}}$，那么 $AA^{\mathrm{H}}=U(\Lambda\Lambda^{\mathrm{H}})U^{\mathrm{H}}=U(\Lambda^{\mathrm{H}}\Lambda)U^{\mathrm{H}}=A^{\mathrm{H}}A$。
- 右推左：Schur Lemma 给出存在酉矩阵 $U$ 使得 $T=U^{\mathrm{H}}AU$ 是一个上三角矩阵。这里 $TT^{\mathrm{H}}=(U^{\mathrm{H}}AU)(U^{\mathrm{H}}A^{\mathrm{H}}U)=U^{\mathrm{H}}AA^{\mathrm{H}}U=U^{\mathrm{H}}A^{\mathrm{H}}AU=T^{\mathrm{H}}T$。那么 $T$ 也是一个正规矩阵。可以证明，上三角的正规矩阵必然是对角矩阵，于是就完成了证明。

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
-   $$
  (J_{i}-\lambda_{i}I)\boldsymbol{x}=0\implies \boldsymbol{x}=c\begin{bmatrix}1 \\ 0 \\ \vdots \\ 0\end{bmatrix},\quad c\in\mathbb{C}
  $$

  。
约当形可对角化当且仅当所有约当块的大小均为 $1$。
有相同的 Jordan Form 等价于相似。