[[Matrices and System of Linear Equations -  矩阵与线性方程组]]
## 矩阵的逆

矩阵的逆（Inverse）：方阵 $\mathbf{A}$ 的逆记作 $\mathbf{A}^{-1}$，符合 $\mathbf{A}\mathbf{A}^{-1}= \mathbf{A}^{-1}\mathbf{A}=\mathbf{I}$。

矩阵的逆如果存在，则一定唯一：

>  假设存在两个矩阵 $\mathbf{B}_{1}, \mathbf{B}_{2}$ 使得 $\mathbf{A}\mathbf{B}_{1}=\mathbf{B}_{1}\mathbf{A}=\mathbf{I}$ 且 $\mathbf{A}\mathbf{B}_{2}=\mathbf{B}_{2}\mathbf{A}=\mathbf{I}$ ，那么有：
>  $$
\begin{cases}
(\mathbf{B}_{1}\mathbf{A})\mathbf{B}_{2}=\mathbf{I}\mathbf{B}_{2}=\mathbf{B}_{2}\\
\mathbf{B}_{1}(\mathbf{A}\mathbf{B}_{2})=\mathbf{B}_{1}\mathbf{I}=\mathbf{B}_{1}
\end{cases}
$$
>  即 $\mathbf{B}_{1}=\mathbf{B}_{2}$。

性质：
-  $(\mathbf{A}\mathbf{B})^{-1}=\mathbf{B}^{-1}\mathbf{A}^{-1}$。  
- $(\mathbf{A}_{1}\dots \mathbf{A}_{n})^{-1}=\mathbf{A}_{n}^{-1}\mathbf{A}_{n-1}^{-1}\dots \mathbf{A}_{1}^{-1}$

矩阵的左/右逆（Left/Right Inverse）：对 $m\times n$ 矩阵 $\mathbf{A}$，若存在 $\mathbf{B}$ 使得 $\mathbf{A}\mathbf{B}=\mathbf{I}_{m}$，则称 $\mathbf{B}$ 为 $\mathbf{A}$ 的右逆矩阵，$\mathbf{A}$ 为 $\mathbf{B}$ 的左逆矩阵。

对一个 $m\times n$ 矩阵，它存在右逆等价于 $r=m$（行满秩，也说明 $C(\mathbf{A})=\mathbb{R}^m$）。类似的，存在左逆等价于 $r=n$（列满秩，也说明 $C(\mathbf{A}^T)=\mathbb{R}^n$）。记忆： $\begin{bmatrix}1  & 0\end{bmatrix}\begin{bmatrix}1 \\ 0\end{bmatrix}=\mathbf{I}_{1}$。
推论：矩阵可逆的条件为 $r=m=n$。

左右逆的最佳选择（Best Choices）$\mathbf{B}=(\mathbf{A}^T\mathbf{A})^{-1}\mathbf{A}^T, \mathbf{C}=\mathbf{A}^T(\mathbf{A}\mathbf{A}^T)^{-1}$。
#### 高斯-约旦方法（Gauss-Jordan method）求逆

$$
\mathbf{A}\mathbf{B}=\mathbf{I}
$$
$$
\implies  \mathbf{A}\begin{bmatrix}
\mathbf{b}_{1} & \mathbf{b}_{2} & \dots & \mathbf{b}_{n}
\end{bmatrix}=\begin{bmatrix}
\mathbf{e}_{1} & \mathbf{e}_{2} & \dots & \mathbf{e}_{n}
\end{bmatrix} \\
$$
$$
\implies \mathbf{A}\mathbf{b}_{i}=\mathbf{e}_{i}(1\leq i\leq n)
$$
第 $i$ 组解 $\mathbf{b}_{i}$ 即对应逆矩阵的第 $i$ 列。为解这一系列的线性方程组，可以构造增广矩阵：
$$
\begin{bmatrix}
\mathbf{A} | \mathbf{I}
\end{bmatrix}
$$
对它进行一系列初等行变换，把它化成形式：
$$
\begin{bmatrix}
\mathbf{I}|\mathbf{B}
\end{bmatrix}
$$
那么右边的每 $i$ 列就是第 $i$ 个方程组的解，于是得到 $\mathbf{A}^{-1}=\mathbf{B}$。
另一种角度，设一系列初等行变换的复合 $\mathbf{T}$ 使得 $\mathbf{T}\mathbf{A}=\mathbf{I}$，那么 $\mathbf{B}=\mathbf{T}\mathbf{I}=\mathbf{T}=\mathbf{A}^{-1}$。

#### 判断逆是否存在

- $\mathbf{A}\text{ is invertible} \Leftrightarrow \mathbf{A}\text{ has a full set of pivots}$ 
 > Proof:
 > - $\mathbf{A}\text{ is invertible} \Leftarrow \text{ Gauss-Jordan method works} \Leftarrow \mathbf{A}\text{ has a full set of pivots}$ 
 > - $\mathbf{A}\text{ is invertible} \Rightarrow \mathbf{A}\mathbf{x}=\mathbf{O}\text{ only has zero solution} \Rightarrow \mathbf{A}\text{ has a full set of pivots}$  

- $\mathbf{A}\text{ is invertible} \Leftrightarrow \mathbf{A}\text{ is nonsingular}$ 
 > Proof:
 > - $\mathbf{A}\text{ is invertible}\Leftarrow \mathbf{A}\text{ has a full set of pivots} \Leftarrow \mathbf{A}\mathbf{x}=\mathbf{O}\text{ only has zero solution} \Leftarrow  \mathbf{A}\text{ is nonsingular}$
 > - $\mathbf{A}\text{ is invertible} \Rightarrow \mathbf{x}=\mathbf{A}^{-1}\mathbf{b}$  


- $\mathbf{A}\text{ is invertible} \Leftrightarrow \mathbf{A}\mathbf{x}=\mathbf{0}\text{ only has zero solution}$ 
- $\mathbf{A}\text{ is invertible} \Leftrightarrow\text{rank}(A)=n$
- $\mathbf{A}\text{ is invertible} \Leftrightarrow N(A)=\{ 0 \}$
- $\mathbf{A}\text{ is invertible} \Leftrightarrow\text{The columns/rows of A is linear independent}$
#### 求二阶矩阵的逆

$$
\mathbf{A}=\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
 的逆为 
 $$
\mathbf{A}^{-1}=\frac{1}{\det(\mathbf{A})} \begin{bmatrix}
d & -b \\
-c & a
\end{bmatrix}
$$

#### 求三阶矩阵的逆
$$
\mathbf{A}=\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
$$
需要先构造余子式的矩阵
$$
\mathbf{M}= \begin{bmatrix}
M_{11} & M_{12} & M_{13} \\
M_{21} & M_{22} & M_{23} \\
M_{31} & M_{32} & M_{33}
\end{bmatrix}
$$
再交替添负号
$$
\mathbf{C}=\begin{bmatrix}
M_{11} & -M_{12} & M_{13} \\
-M_{21} & M_{22} & -M_{23} \\
M_{31} & -M_{32} & M_{33}
\end{bmatrix}
$$
最后做转置
$$
\mathbf{C}^T=\begin{bmatrix}
M_{11} & -M_{21} & M_{31} \\
-M_{12} & M_{22} & -M_{32} \\
M_{13} & -M_{23} & M_{33}
\end{bmatrix}
$$
那么
$$
\mathbf{A}^{-1}=\frac{1}{\det(\mathbf{A})}\mathbf{C}^T
$$

即 $a_{ij}'=\frac{1}{\det(\mathbf{A})}M_{ji} (-1)^{i+j}$ 。
（证明见行列式）
## 矩阵的转置

矩阵的转置（Transpose）：矩阵 $\mathbf{A}$ 的转置记作 $\mathbf{A}^T$ ，其中 $a_{ij}'= a_{ji}$。相当于把行换成列，列换成行。转置的性质：
- $(\mathbf{A}^T)^T=\mathbf{A}$
- $(k\mathbf{A})^T=kA^T$
- $(\mathbf{A}+\mathbf{B})^T=\mathbf{A}^T+\mathbf{B}^{T}$
- $(\mathbf{A}\mathbf{B})^T=\mathbf{B}^{T}\mathbf{A}^{T}$
- $(\mathbf{A}^{-1})^{T}=(\mathbf{A}^{T})^{-1}$

对称矩阵（Symmetric Matrix）：满足  $\mathbf{A}^T=\mathbf{A}$ 的矩阵 $\mathbf{A}$ 称为对称矩阵。
- 对称矩阵的逆还是对称矩阵。
- $\mathbf{R}\mathbf{R}^T$ 为对称矩阵。 
- $\mathbf{S}=\mathbf{L}\mathbf{D}\mathbf{L}^T$。

定理：若 $\mathbf{A}^T=\mathbf{A}$ 可以被在不用行交换的情况下分解为 $\mathbf{L}\mathbf{D}\mathbf{U}$，则有 $\mathbf{L}^T=\mathbf{U}$。

## 分块矩阵

使用分块矩阵（Partitioned Matrices）来思考矩阵的运算。也就是说，把矩阵分为若干块，每一块是一个小矩阵，则可以把这些小矩阵看成一个新的元素。

用分块矩阵来看矩阵乘法：把 $\mathbf{A}$ 的每一行看成一个新的元素，则 $\mathbf{A}=\begin{bmatrix}\mathbf{a}_{1} \\ \mathbf{a}_{2} \\ \vdots \\\mathbf{a}_{n}\end{bmatrix}$，把 $\mathbf{B}$ 的每一列看成一个新的元素，则 $\mathbf{B}=\begin{bmatrix}\mathbf{b}_{1} & \mathbf{b}_{2} & \cdots & \mathbf{b}_{n}\end{bmatrix}$ 。
那么可以把 $\mathbf{A}\mathbf{B}$ 看成
$$
\mathbf{A}\mathbf{B}=\begin{bmatrix}
\mathbf{A}
\end{bmatrix}\begin{bmatrix}\mathbf{b}_{1} & \mathbf{b}_{2} & \cdots & \mathbf{b}_{n}\end{bmatrix}=\begin{bmatrix}\mathbf{A}\mathbf{b}_{1} & \mathbf{A}\mathbf{b}_{2} & \cdots & \mathbf{A}\mathbf{b}_{n}\end{bmatrix}
$$
或
$$
\mathbf{A}\mathbf{B}=\mathbf{A}=\begin{bmatrix}\mathbf{a}_{1} \\ \mathbf{a}_{2} \\ \vdots \\\mathbf{a}_{n}\end{bmatrix}\begin{bmatrix}
\mathbf{B}
\end{bmatrix}
=\mathbf{A}=\begin{bmatrix}\mathbf{a}_{1}\mathbf{B} \\ \mathbf{a}_{2}\mathbf{B} \\ \vdots \\\mathbf{a}_{n}\mathbf{B}\end{bmatrix}
$$
注意分块的矩阵尺寸要保证可乘。

## 矩阵的秩

线性相关（Linear Dependent）：设 $\mathbf{v}_{1}, \mathbf{v}_{2},\dots \mathbf{v}_{n}\in V$，若 $c_{1}\mathbf{v}_{1}+c_{2}\mathbf{v}_{2}+\dots+c_{n}\mathbf{v}_{n}=\mathbf{0}$ 当且仅当 $c_{1}=c_{2}=\dots =c_{n}=0$，则称这组向量线性无关。否则，称为线性相关。
- 线性相关：存在 $c_{i}\neq 0$ 使得 $c_{i}\mathbf{v}_{i}=\sum _{j\neq i} c_{j}\mathbf{v}_{j}$，即 $\mathbf{v}_{i}=\sum_{j\neq i} \frac{c_{j}}{c_{i}}\mathbf{v}_{j}$ ，即存在一个向量可以表示为其他向量的线性组合。

判断向量是否线性相关等价于判断 $\begin{bmatrix}\mathbf{v}_{1} & \mathbf{v}_{2}  & \dots & \mathbf{v}_{n}\end{bmatrix}\mathbf{x}=\mathbf{0}$ 是否存在非零解。
$\mathbf{A}$ 的列线性无关当且仅当 $N(\mathbf{A})=\{ \mathbf{0} \}$。

>  零向量与任何向量线性相关。
>  行阶梯矩阵的非零行之间是线性无关的。
>  在 $\mathbb{R}^{2}$ 中，两个向量线性相关说明它们同一条直线上，三个向量之间一定是线性相关的。
>  在 $\mathbb{R}^m$ 中，任何 $n(n>m)$ 个向量必然线性相关。


矩阵 $\mathbf{A}$ 的秩（Rank）：
- 主元的个数，记作 $r$ 或 $\text{rank}(\mathbf{A})$。
- 极大的线性无关（Linearly Independent）的行/列的个数。

关于秩的一些性质：
- $r\leq \min(m,n)$
- $r(\mathbf{A}\mathbf{B})\leq \min(r(\mathbf{A}), r(\mathbf{B}))$

**秩一矩阵（Rank 1 matrix）** 可以拆成一个列向量乘一个行向量。这是因为，它的列空间的维数 $\text{dim} C(\mathbf{A})=\text{rank}(\mathbf{A})=1$。

若 $P$ 是一个可逆矩阵，则 $r(\mathbf{P}\mathbf{A})=r(\mathbf{A}\mathbf{P})=r(\mathbf{A})$。

若 $AB=O$，则有 $C(B) \subseteq N(A)$，则有 $\text{rank}(B)\leq n-\text{rank(A)}$，也就是：
$$
\text{rank}(A)+\text{rank}(B)\leq n
$$
一般的，有$$\text{rank}(AB)=\text{rank}(B)-\text{dim}(N(A)\cap C(B))\geq\text{rank}(B)-\text{dim}N(A)=\text{rank}(B)-\text{rank(A)}+n$$ 故而有
$$
\text{rank}(A)+\text{rank}(B)-n\leq\text{rank}(AB)
$$

一些题目中的结论： $\text{rank}(A^TA)=\text{rank}(A)$， $\text{rank}(A+B)\leq\text{rank}(A)+\text{rank}(B)$。
$Ax=b$ 有解等价于 $A$ 与 $\begin{bmatrix}A |b\end{bmatrix}$ 的秩相等。