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