## 概念与记号

对角矩阵（Diagonal Matrix）：$a_{i,j}=0(i\neq j)$ 的方矩阵。
单位矩阵（Identity Matrix）：记作 $\mathbf{I}_{n}$ ，其中  $a_{i,i}=1$，其他为 $0$ 的方矩阵。
置换矩阵（Permutation Matrix）：每行每列都恰有一个 $1$ 的矩阵，用它去乘另一个矩阵，可以交换矩阵的某些行。

阶梯形（Echelon Form）矩阵：
1. 每行的第一个非零项都是 $1$。
2. 每行的第一个非零项都在上一行的第一个非零项右边。
3. 全为 $0$ 的行都在矩阵的最底部。
简化阶梯形（Reduced Echelon Form）矩阵：每行的第一个非零项为该列中唯一的非零项。例如：
$$
\begin{bmatrix}
1 & 2 & 0 \\
0 & 0 & 1 \\
0 & 0 & 0
\end{bmatrix}
$$
矩阵的逆（Inverse）：$\mathbf{A}$ 的逆记作 $\mathbf{A}^{-1}$，符合 $\mathbf{A}^{-1}\mathbf{A}=\mathbf{I}$。
矩阵的转置（Transpose）：$\mathbf{A}$ 的转置记作 $\mathbf{A}^T$ ，其中 $a_{ij}'= a_{ji}$。

矩阵的线性运算（加减，数乘）和向量是一样的，直接对对应的项运算。

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
1. 新矩阵的行由 $\mathbf{B}$ 的行组合而来。
2. 新矩阵由 $\mathbf{A}$ 的列（$n\times 1$）和 $\mathbf{B}$ 的行（$1 \times p$ ）相乘（得到 $n\times p$ 矩阵）再相加而来。
矩阵乘法满足结合律（Associative Law）和分配律（Distributive Law），但不满足交换律（Commutative Law）。
一个矩阵与单位矩阵相乘会得到它自己，与零矩阵相乘会得到零矩阵。
## 矩阵的逆

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
## 线性方程组

用矩阵可以表示线性方程组，解 $n$ 阶方程组就可以通过求 $n$ 阶方矩阵的逆得到。

$$
\mathbf{A}\mathbf{x}=\mathbf{b}
\implies \mathbf{x}=\mathbf{A}^{-1}\mathbf{b}
$$
其中 $\mathbf{A}$ 为线性方程组的系数矩阵（Coefficient Matrix）。 
将线性方程组的系数矩阵右侧添加常数列，就构成了增广矩阵（Augmented Matrix），记作 $[\mathbf{A}|\mathbf{b}]$。
### 高斯消元法

保持线性方程组的解不变的线性变换叫做初等变换（Elementary Operations）。交换两个方程（$E_{i} \leftrightarrow E_{j}$），将某个方程乘一个非零常数（$kE_{i}$），以及把一个方程的倍数加到另一个方程上（$E_{i}+kE_{j}$），都属于初等变换。
对矩阵的行进行类似的变换，叫做初等行变换（Elementary Row Operations）。
那么高斯消元的步骤：
1. 对增广矩阵进行初等行变换为简化阶梯形；
2. 还原线性方程组；
3. 找出方程组通解。

