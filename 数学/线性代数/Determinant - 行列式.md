#### 求二阶矩阵的行列式
$$
\mathbf{A}=\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
 的行列式为 $\det(\mathbf{A})=ad-bc$。
 
##### 求三阶矩阵的行列式
$$
\mathbf{A}=\begin{bmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{bmatrix}
$$
先定义矩阵中 $a_{ij}$ 的余子式（Minor）$M_{ij}$ 为删掉第 $i$ 行和第 $j$ 列后剩下项所组成矩阵的行列式。
那么三阶矩阵的行列式：
$$\det(\mathbf{A})=a_{11}M_{11}-a_{12}M_{12}+a_{13}M_{13}$$
