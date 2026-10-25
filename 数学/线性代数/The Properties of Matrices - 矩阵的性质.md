[[Matrices and System of Linear Equations -  矩阵与线性方程组]]
## 矩阵的逆

矩阵的逆（Inverse）：方阵 $A$ 的逆记作 $A^{-1}$，符合 $AA^{-1}= A^{-1}A=I$。

矩阵的逆如果存在，则一定唯一：

>  假设存在两个矩阵 $B_{1}, B_{2}$ 使得 $AB_{1}=B_{1}A=I$ 且 $AB_{2}=B_{2}A=I$ ，那么有：
>  $$
\begin{cases}
(B_{1}A)B_{2}=IB_{2}=B_{2}\\
B_{1}(AB_{2})=B_{1}I=B_{1}
\end{cases}
$$
>  即 $B_{1}=B_{2}$。

性质：
-  $(AB)^{-1}=B^{-1}A^{-1}$。  
- $(A_{1}\dots A_{n})^{-1}=A_{n}^{-1}A_{n-1}^{-1}\dots A_{1}^{-1}$

矩阵的左/右逆（Left/Right Inverse）：对 $m\times n$ 矩阵 $A$，若存在 $B$ 使得 $AB=I_{m}$，则称 $B$ 为 $A$ 的右逆矩阵，$A$ 为 $B$ 的左逆矩阵。

对一个 $m\times n$ 矩阵，它存在右逆等价于 $r=m$（行满秩，也说明 $C(A)=\mathbb{R}^m$）。类似的，存在左逆等价于 $r=n$（列满秩，也说明 $C(A^{\top})=\mathbb{R}^n$）。记忆：

$$
\begin{bmatrix}1  & 0\end{bmatrix}\begin{bmatrix}1 \\ 0\end{bmatrix}=I_{1}
$$

。
推论：矩阵可逆的条件为 $r=m=n$。

左右逆的最佳选择（Best Choices）$B=(A^{\top}A)^{-1}A^{\top}, C=A^{\top}(AA^{\top})^{-1}$。
#### 高斯-约旦方法（Gauss-Jordan method）求逆

$$
AB=I
$$
$$
\implies  A\begin{bmatrix}
\boldsymbol{b}_{1} & \boldsymbol{b}_{2} & \dots & \boldsymbol{b}_{n}
\end{bmatrix}=\begin{bmatrix}
\boldsymbol{e}_{1} & \boldsymbol{e}_{2} & \dots & \boldsymbol{e}_{n}
\end{bmatrix} \\
$$
$$
\implies A\boldsymbol{b}_{i}=\boldsymbol{e}_{i}(1\leq i\leq n)
$$
第 $i$ 组解 $\boldsymbol{b}_{i}$ 即对应逆矩阵的第 $i$ 列。为解这一系列的线性方程组，可以构造增广矩阵：
$$
\begin{bmatrix}
A \mid  I
\end{bmatrix}
$$
对它进行一系列初等行变换，把它化成形式：
$$
\begin{bmatrix}
I\mid B
\end{bmatrix}
$$
那么右边的每 $i$ 列就是第 $i$ 个方程组的解，于是得到 $A^{-1}=B$。
另一种角度，设一系列初等行变换的复合 $T$ 使得 $TA=I$，那么 $B=TI=T=A^{-1}$。

#### 判断逆是否存在

- $A\text{ is invertible} \Leftrightarrow A\text{ has a full set of pivots}$
 > Proof:
 > - $A\text{ is invertible} \Leftarrow \text{ Gauss-Jordan method works} \Leftarrow A\text{ has a full set of pivots}$
 > - $A\text{ is invertible} \Rightarrow A\boldsymbol{x}=\boldsymbol{0}\text{ only has zero solution} \Rightarrow A\text{ has a full set of pivots}$  

- $A\text{ is invertible} \Leftrightarrow A\text{ is nonsingular}$
 > Proof:
 > - $A\text{ is invertible}\Leftarrow A\text{ has a full set of pivots} \Leftarrow A\boldsymbol{x}=\boldsymbol{0}\text{ only has zero solution} \Leftarrow  A\text{ is nonsingular}$
 > - $A\text{ is invertible} \Rightarrow \boldsymbol{x}=A^{-1}\boldsymbol{b}$  


- $A\text{ is invertible} \Leftrightarrow A\boldsymbol{x}=\boldsymbol{0}\text{ only has zero solution}$
- $A\text{ is invertible} \Leftrightarrow\operatorname{rank}(A)=n$
- $A\text{ is invertible} \Leftrightarrow N(A)=\{ 0 \}$
- $A\text{ is invertible} \Leftrightarrow\text{The columns/rows of A is linear independent}$
#### 求二阶矩阵的逆

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

#### 求三阶矩阵的逆
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
再交替添负号
$$
C=\begin{bmatrix}
M_{11} & -M_{12} & M_{13} \\
-M_{21} & M_{22} & -M_{23} \\
M_{31} & -M_{32} & M_{33}
\end{bmatrix}
$$
最后做转置
$$
C^{\top}=\begin{bmatrix}
M_{11} & -M_{21} & M_{31} \\
-M_{12} & M_{22} & -M_{32} \\
M_{13} & -M_{23} & M_{33}
\end{bmatrix}
$$
那么
$$
A^{-1}=\frac{1}{\det(A)}C^{\top}
$$

即 $a_{ij}'=\frac{1}{\det(A)}M_{ji} (-1)^{i+j}$ 。
（证明见行列式）
## 矩阵的转置

矩阵的转置（Transpose）：矩阵 $A$ 的转置记作 $A^{\top}$ ，其中 $a_{ij}'= a_{ji}$。相当于把行换成列，列换成行。转置的性质：
- $(A^{\top})^{\top}=A$
- $(kA)^{\top}=kA^{\top}$
- $(A+B)^{\top}=A^{\top}+B^{\top}$
- $(AB)^{\top}=B^{\top}A^{\top}$
- $(A^{-1})^{\top}=(A^{\top})^{-1}$

对称矩阵（Symmetric Matrix）：满足  $A^{\top}=A$ 的矩阵 $A$ 称为对称矩阵。
- 对称矩阵的逆还是对称矩阵。
- $RR^{\top}$ 为对称矩阵。
- $S=LDL^{\top}$。

定理：若 $A^{\top}=A$ 可以被在不用行交换的情况下分解为 $LDU$，则有 $L^{\top}=U$。

## 分块矩阵

使用分块矩阵（Partitioned Matrices）来思考矩阵的运算。也就是说，把矩阵分为若干块，每一块是一个小矩阵，则可以把这些小矩阵看成一个新的元素。

用分块矩阵来看矩阵乘法：把 $A$ 的每一行看成一个新的元素，则

$$
A=\begin{bmatrix}\boldsymbol{a}_{1} \\ \boldsymbol{a}_{2} \\ \vdots \\\boldsymbol{a}_{n}\end{bmatrix}
$$

，把 $B$ 的每一列看成一个新的元素，则 $B=\begin{bmatrix}\boldsymbol{b}_{1} & \boldsymbol{b}_{2} & \cdots & \boldsymbol{b}_{n}\end{bmatrix}$ 。
那么可以把 $AB$ 看成
$$
AB=\begin{bmatrix}
A
\end{bmatrix}\begin{bmatrix}\boldsymbol{b}_{1} & \boldsymbol{b}_{2} & \cdots & \boldsymbol{b}_{n}\end{bmatrix}=\begin{bmatrix}A\boldsymbol{b}_{1} & A\boldsymbol{b}_{2} & \cdots & A\boldsymbol{b}_{n}\end{bmatrix}
$$
或
$$
AB=\begin{bmatrix}\boldsymbol{a}_{1} \\ \boldsymbol{a}_{2} \\ \vdots \\\boldsymbol{a}_{n}\end{bmatrix}\begin{bmatrix}
B
\end{bmatrix}
=\begin{bmatrix}\boldsymbol{a}_{1}B \\ \boldsymbol{a}_{2}B \\ \vdots \\\boldsymbol{a}_{n}B\end{bmatrix}
$$
注意分块的矩阵尺寸要保证可乘。

## 矩阵的秩

线性相关（Linear Dependent）：设 $\boldsymbol{v}_{1}, \boldsymbol{v}_{2},\dots \boldsymbol{v}_{n}\in V$，若 $c_{1}\boldsymbol{v}_{1}+c_{2}\boldsymbol{v}_{2}+\dots+c_{n}\boldsymbol{v}_{n}=\boldsymbol{0}$ 当且仅当 $c_{1}=c_{2}=\dots =c_{n}=0$，则称这组向量线性无关。否则，称为线性相关。
- 线性相关：存在 $c_{i}\neq 0$ 使得 $c_{i}\boldsymbol{v}_{i}=\sum _{j\neq i} c_{j}\boldsymbol{v}_{j}$，即 $\boldsymbol{v}_{i}=\sum_{j\neq i} \frac{c_{j}}{c_{i}}\boldsymbol{v}_{j}$ ，即存在一个向量可以表示为其他向量的线性组合。

判断向量是否线性相关等价于判断 $\begin{bmatrix}\boldsymbol{v}_{1} & \boldsymbol{v}_{2}  & \dots & \boldsymbol{v}_{n}\end{bmatrix}\boldsymbol{x}=\boldsymbol{0}$ 是否存在非零解。
$A$ 的列线性无关当且仅当 $N(A)=\{ \boldsymbol{0} \}$。

>  零向量与任何向量线性相关。
>  行阶梯矩阵的非零行之间是线性无关的。
>  在 $\mathbb{R}^{2}$ 中，两个向量线性相关说明它们同一条直线上，三个向量之间一定是线性相关的。
>  在 $\mathbb{R}^m$ 中，任何 $n(n>m)$ 个向量必然线性相关。


矩阵 $A$ 的秩（Rank）：
- 主元的个数，记作 $r$ 或 $\operatorname{rank}(A)$。
- 极大的线性无关（Linearly Independent）的行/列的个数。

关于秩的一些性质：
- $r\leq \min(m,n)$
- $r(AB)\leq \min(r(A), r(B))$

**秩一矩阵（Rank 1 matrix）** 可以拆成一个列向量乘一个行向量。这是因为，它的列空间的维数 $\dim C(A)=\operatorname{rank}(A)=1$。

若 $P$ 是一个可逆矩阵，则 $r(PA)=r(AP)=r(A)$。

若 $AB=O$，则有 $C(B) \subseteq N(A)$，则有 $\operatorname{rank}(B)\leq n-\operatorname{rank}(A)$，也就是：
$$
\operatorname{rank}(A)+\operatorname{rank}(B)\leq n
$$
一般的，有$$\operatorname{rank}(AB)=\operatorname{rank}(B)-\dim(N(A)\cap C(B))\geq\operatorname{rank}(B)-\dim N(A)=\operatorname{rank}(B)+\operatorname{rank}(A)-n$$ 故而有
$$
\operatorname{rank}(A)+\operatorname{rank}(B)-n\leq\operatorname{rank}(AB)
$$

一些题目中的结论： $\operatorname{rank}(A^{\top}A)=\operatorname{rank}(A)$， $\operatorname{rank}(A+B)\leq\operatorname{rank}(A)+\operatorname{rank}(B)$。
$A\boldsymbol{x}=\boldsymbol{b}$ 有解等价于 $A$ 与 $\begin{bmatrix}A \mid \boldsymbol{b}\end{bmatrix}$ 的秩相等。