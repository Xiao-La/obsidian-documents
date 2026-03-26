## 矩阵基本概念

$m$ 行 $n$ 列的矩阵可记成 $\mathbf{A}=[a_{ij}]_{m\times n}$

矩阵的线性运算（加减，数乘）和向量是一样的，直接对对应的分量（Entry）运算。

单位矩阵/恒等矩阵（Identity Matrix）：记作 $\mathbf{I}_{n}$ ，其中 $a_{i,i}=1$，其他为 $0$ 的方矩阵。
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

### 基于乘法的特殊变换矩阵

置换矩阵（Permutation Matrix）：每行每列都恰有一个 $1$ 的矩阵。用它左乘另一个矩阵，可以交换矩阵的某些行。

**初等矩阵：**
- 可交换两行的置换矩阵。
- 将 $\mathbf{I}_{n}$ 中的 $(i,j)$ 位置替换为 $l$ 得到的矩阵。用它左乘另一个矩阵，可以把该矩阵的第 $j$ 行乘以 $l$ 加到第 $i$ 行上去。
- 将单位矩阵中第 $i$ 行的 $1$ 替换为 $k$ 的到的矩阵。用它左乘以另一个矩阵，可以把该矩阵的第 $i$ 行乘以 $k$。
>  【左行右列】以上如果换成右乘这些变换矩阵，会变成初等列变换。


## 线性方程组（Linear System）

用矩阵可以表示线性方程组：$\mathbf{A}\mathbf{x}=\mathbf{b}$，其中 $\mathbf{A}$ 为线性方程组的系数矩阵（Coefficient Matrix）。 

将线性方程组的系数矩阵右侧添加常数列，就构成了增广矩阵（Augmented Matrix），记作 $[\mathbf{A}|\mathbf{b}]$。

### 行观点和列观点

若线性方程组至少有一组解，则称其为相容的（Consistent），反之则为不相容的（Inconsistent）。
- 行观点（Row Picture）：每个方程表示一个平面。线性方程组相容，当且仅当所有平面有非空交。
- 列观点（Column Picture）：方程组表示了向量的线性组合。线性方程组相容，当且仅当常数列表示的向量落在系数列表示的向量张成的空间。
### 线性方程组的奇异性

奇异（Singular）：没有解或无穷多组解。
非奇异 （Nonsingular）：有且仅有一组解。
从而可以定义矩阵的奇异性： $\mathbf{A}$ 是非奇异矩阵当且仅当 $\forall \mathbf{b},\mathbf{A}\mathbf{x}=\mathbf{b}$ 非奇异。
## 高斯消元与 LU 分解

### 高斯消元法

保持线性方程组的解不变（Equivalent System）的线性变换叫做初等变换（Elementary Operations）。
交换两个方程（$E_{i} \leftrightarrow E_{j}$），将某个方程乘一个非零常数（$E_{i} \gets kE_{i}$），以及把一个方程的倍数加到另一个方程上（$E_{i}\gets E_{i}+ kE_{j}$），都属于初等变换。
对矩阵的行进行类似的变换，叫做初等行变换（Elementary Row Operations）。

那么高斯消元（Gaussian Elimination）的步骤：
1. 对增广矩阵进行初等行变换为行阶梯形（Row Echelon Form）；
2. 回代（Back Substitution）。

>  每一行中第一个非零的元素称为主元（Pivots）。

### LU 分解 （LU factorization）

假设矩阵 $\mathbf{A}$ 进行高斯消元之后得到上三角矩阵（Upper triangular matrix） $\mathbf{U}$，则它可以分解为：
$$
\mathbf{A}=\mathbf{L}\mathbf{U}
$$
其中 $\mathbf{L}$ 是下三角矩阵（Lower triangle matrix），对角元素为 $1$。高斯消元的乘子（Multiplier）记录在对角线（Diagonal）的下方。
- $l_{ij}$ 表示高斯消元中的步骤：$E_{i} \leftarrow E_{i}-l_{ij}E_{j}$。
$\mathbf{U}$ 是上三角矩阵，对角元素为主元。

>  若发现高斯消元中需要进行交换两行的操作，则引入 $\mathbf{A}'=\mathbf{P}\mathbf{A}$，然后再对 $\mathbf{A}'$ 进行高斯消元。一般的，有：
>  $$
\mathbf{P}\mathbf{A}=\mathbf{L}\mathbf{U}
$$

若已知 LU 分解，则可以把方程 $\mathbf{A}\mathbf{x}=\mathbf{b}$ 转换为：
$$
\begin{cases}
 \mathbf{U}\mathbf{x}=\mathbf{c} \\
\mathbf{Lc}=\mathbf{b}
\end{cases}
$$
这两个方程都是行阶梯形的，非常好解。

>  LU 分解的唯一性：若 $\mathbf{A}=\mathbf{L}_{1}\mathbf{U}_{1}=\mathbf{L}_{2}\mathbf{U}_{2}$，且 $\mathbf{L}_{1}, \mathbf{L}_{2}$ 的对角元素都是 $1$，则 $\mathbf{L}_{1}=\mathbf{L}_{2}, \mathbf{R}_{1}=\mathbf{R}_{2}$。

>  LDU 分解：使用对角矩阵 $\mathbf{D}$ （对角元素为主元）使得 $\mathbf{L}, \mathbf{U}$ 的对角元素都是 $1$。




### 解一般的方程组 Ax=b

>  行最简形（Reduced row echelon form）：主元都是 $1$，且每个主元位置所在列都只有这个主元不为 $0$。

一般的，对于 $\mathbf{A}\mathbf{x}=\mathbf{0}$，可以用初等行变换得到行最简形 $\mathbf{R}\mathbf{x}=\mathbf{0}$。
把变量分为主元变量和自由变量。
将自由变量其中一个赋值为 $1$，其他赋值为 $0$，会得到（ # 自由变量 ）个特解，它们的线性组合即为所有解 （也就是零空间 $N(\mathbf{A})$）。

对一般的方程组 $\mathbf{A}\mathbf{x}=\mathbf{b}, \mathbf{b} \neq \mathbf{0}$，其中 $\mathbf{A}$ 为 $m\times n$ 矩阵：
- $\mathbf{A}\mathbf{x}=\mathbf{b}\to \mathbf{U}\mathbf{x}=\mathbf{c}\to \mathbf{R}\mathbf{x}=\mathbf{d}$，有 $r$ 个主元行和 $r$ 个主元列，则 $\mathbf{A}$ 的秩（Rank）为 $r$。$\mathbf{U}$ 和 $\mathbf{R}$ 的最后 $m-r$ 行都是 $0$。故当且仅当 $\mathbf{c}$ 和 $\mathbf{d}$ 的最后 $m-r$ 个分量为 $0$ 时，原方程有解。
  >  也就是说，原方程有解有 $m-r$ 个条件。
- 完整的解集为： $\mathbf{x}=\mathbf{x}_{p}+\mathbf{x}_{n}$，其中 $\mathbf{x}_{p}$ 为使得所有自由变量为 $0$ 的 $\mathbf{A}\mathbf{x}=\mathbf{b}$ 的特解，$\mathbf{x}_{n}\in N(\mathbf{A})$（也就是解 $\mathbf{A}\mathbf{x}=\mathbf{0}$ 时将自由变量其中一个赋值为 $1$，其他赋值为 $0$，得到的 $n-r$ 个特解的线性组合）。
  >  也就是说， $N(\mathbf{A})$ 有 $n-r$ 个特解。
  
  