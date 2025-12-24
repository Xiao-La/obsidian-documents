对角矩阵（Diagonal Matrices）：$a_{i,j}=0(i\neq j)$ 的方矩阵。
单位矩阵（Identity Matrices） $I_{n}$：$a_{i,i}=1$，其他为 $0$ 的方矩阵。
矩阵的转置：$A^T$ 中 $a_{ij}'= a_{ji}$
矩阵的线性运算（加减，数乘）和向量是一样的，直接对对应的项运算。

## 矩阵乘法

$n\times m$ 和 $m \times p$ 的矩阵可以相乘得到一个 $n\times p$ 的矩阵，新矩阵中，第 $i$ 行第 $j$ 列的数由第一个矩阵的第 $i$ 行与第二个矩阵的第 $j$ 列做向量点乘得到。

一个矩阵与单位矩阵相乘会得到它自己，与零矩阵相乘会得到零矩阵。

## 矩阵的行列式

#### 二阶矩阵
$$
A=\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
 的行列式为 $\det(A)=ad-bc$。
 
##### 三阶矩阵
$$
A=\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
$$
先定义矩阵中 $a_{ij}$ 的余子式（Minor）$M_{ij}$ 为删掉第 $i$ 行和第 $j$ 列后剩下项所组成矩阵的行列式。
那么三阶矩阵的行列式：
$$\det(A)=a_{11}M_{11}-a_{12}M_{12}+a_{13}M_{13}$$

## 矩阵的逆

方矩阵的逆，指与它相乘为单位矩阵的矩阵。

#### 二阶矩阵
$$
A=\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
 的逆为 
 $$
A^{-1}=\frac{1}{\det(A)} \begin{bmatrix}
d & -b \\
-c & a
\end{bmatrix}
$$
#### 三阶矩阵
$$
A=\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
$$
需要先构造余子式的矩阵
$$
M= \begin{bmatrix}
M_{11} & M_{12} & M_{13} \\
M_{21} & M_{22} & M_{23} \\
M_{31} & M_{32} & M_{33}
\end{bmatrix}
$$
再交替添符号
$$
C=\begin{bmatrix}
M_{11} & -M_{12} & M_{13} \\
-M_{21} & M_{22} & -M_{23} \\
M_{31} & -M_{32} & M_{33}
\end{bmatrix}
$$
最后做转置
$$
C^T=\begin{bmatrix}
M_{11} & -M_{21} & M_{31} \\
-M_{12} & M_{22} & -M_{32} \\
M_{13} & -M_{23} & M_{33}
\end{bmatrix}
$$
那么
$$
A^{-1}=\frac{1}{\det(A)}C^T
$$
即 $a_{ij}'=\frac{1}{\det(A)}M_{ji} (-1)^{i+j}$ 。
## 线性方程组

用矩阵可以表示线性方程组，解 $n$ 阶方程组就可以通过求 $n$ 阶方矩阵的逆得到。

$$
A \begin{bmatrix}
x \\
y \\
\dots
\end{bmatrix}
=\begin{bmatrix}
m \\
n \\
\dots
\end{bmatrix}
$$

$$
\implies 
\begin{bmatrix}
x \\
y \\
\dots
\end{bmatrix}
=
A^{-1}
\begin{bmatrix}
m \\
n \\
\dots
\end{bmatrix}
$$
