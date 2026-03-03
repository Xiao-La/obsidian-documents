## 概念与记号

$m$ 行 $n$ 列的矩阵可记成 $\mathbf{A}=[a_{ij}]_{m\times n}$

单位矩阵/恒等矩阵（Identity Matrix）：记作 $\mathbf{I}_{n}$ ，其中  $a_{i,i}=1$，其他为 $0$ 的方矩阵。

置换矩阵（Permutation Matrix）：每行每列都恰有一个 $1$ 的矩阵，用它去乘另一个矩阵，可以交换矩阵的某些行（相当于对单位矩阵交换某些行），对应一种初等行变换。

定义矩阵 $\mathbf{E}_{ij}(l)(i \neq j)$ 为将 $\mathbf{I}_{n}$ 中的 $(i,j)$ 位置替换为 $l$ 得到的矩阵，则它乘以另一个矩阵相当于把该矩阵的第 $j$ 行乘以 $l$ 加到第 $i$ 行上去，对应一种初等行变换。

矩阵的逆（Inverse）：$\mathbf{A}$ 的逆记作 $\mathbf{A}^{-1}$，符合 $\mathbf{A}^{-1}\mathbf{A}=\mathbf{I}$。
矩阵的转置（Transpose）：$\mathbf{A}$ 的转置记作 $\mathbf{A}^T$ ，其中 $a_{ij}'= a_{ji}$。

矩阵的线性运算（加减，数乘）和向量是一样的，直接对对应的分量（Entry）运算。

## 矩阵乘法 (Matrix Multiplication)

$n\times m$ 和 $m \times p$ 的矩阵可以相乘得到一个 $n\times p$ 的矩阵，矩阵 $\mathbf{A}$ 和矩阵 $\mathbf{B}$ 相乘，得到矩阵 $\mathbf{C}$ 中的第 $i$ 行第 $j$ 列的数为
$$
c_{ij}=\sum_{k}a_{ik}b_{kj}
$$
有几种视角来解释矩阵乘法；
1. 新矩阵中，第 $i$ 行第 $j$ 列的数由 $\mathbf{A}$ 的第 $i$ 行与 $\mathbf{B}$ 的第 $j$ 列做向量点乘得到。
2. 新矩阵的列由 $\mathbf{A}$ 的列组合而来。
   >  $$
\begin{bmatrix}
a&b \\
c&d \\
e&f
\end{bmatrix}
\begin{bmatrix}
x&y \\
z&l
\end{bmatrix}
\text{的第1列为：}x\begin{bmatrix}
a \\
c \\
e
\end{bmatrix}
+z \begin{bmatrix}
b \\
d \\
f
\end{bmatrix}
$$
3. 新矩阵的行由 $\mathbf{B}$ 的行组合而来。
4. 新矩阵由 $\mathbf{A}$ 的列（$n\times 1$）和 $\mathbf{B}$ 的行（$1 \times p$ ）相乘（得到 $n\times p$ 矩阵）再相加而来。

矩阵乘法满足：
1. 结合律（Associative Law）：$(\mathbf{A}\mathbf{B})\mathbf{C}=\mathbf{A}(\mathbf{B}\mathbf{C})$。
2. 分配律（Distributive Law）：$(\mathbf{A}+\mathbf{B})\mathbf{C}=\mathbf{A}\mathbf{C}+\mathbf{B}\mathbf{C}$。
但不满足交换律（Commutative Law）：$\mathbf{A}\mathbf{B}$ 与 $\mathbf{B}\mathbf{A}$ 不一定相等。

方矩阵的幂： $\mathbf{A}^0=\mathbf{I}_{n}, \mathbf{A}^k=\mathbf{A}^{k-1}\mathbf{A}$。
一个矩阵与单位矩阵相乘会得到它自己，与零矩阵相乘会得到零矩阵。
## 矩阵的逆（Inverse）

方矩阵的逆，指与它相乘为单位矩阵的矩阵。
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
## 线性方程组（Linear System）

用矩阵可以表示线性方程组，解 $n$ 阶方程组就可以通过求 $n$ 阶方矩阵的逆得到。

$$
\mathbf{A}\mathbf{x}=\mathbf{b}
\implies \mathbf{x}=\mathbf{A}^{-1}\mathbf{b}
$$
其中 $\mathbf{A}$ 为线性方程组的系数矩阵（Coefficient Matrix）。 
将线性方程组的系数矩阵右侧添加常数列，就构成了增广矩阵（Augmented Matrix），记作 $[\mathbf{A}|\mathbf{b}]$。

### 行观点和列观点

若线性方程组至少有一组解，则称其为相容的（Consistent），反之则为不相容的（Inconsistent）。
- 行观点（Row Picture）：每个方程表示一个平面。线性方程组相容，当且仅当所有平面有非空交。
- 列观点（Column Picture）：方程组表示了向量的线性组合。线性方程组相容，当且仅当常数列表示的向量落在系数列表示的向量张成的空间。

### 线性方程组的奇异性

奇异（Singular）：没有解或无穷多组解。
非奇异 （Nonsingular）：有且仅有一组解。

### 高斯消元法

保持线性方程组的解不变（Equivalent System）的线性变换叫做初等变换（Elementary Operations）。
交换两个方程（$E_{i} \leftrightarrow E_{j}$），将某个方程乘一个非零常数（$E_{i} \gets kE_{i}$），以及把一个方程的倍数加到另一个方程上（$E_{i}\gets E_{i}+ kE_{j}$），都属于初等变换。
对矩阵的行进行类似的变换，叫做初等行变换（Elementary Row Operations）。

那么高斯消元（Gaussian Elimination）的步骤：
1. 对增广矩阵进行初等行变换为行阶梯形（Row Echelon Form）；
2. 回代（Back Substitution）。

>  每一行中第一个非零的元素称为主元（Pivots）。

