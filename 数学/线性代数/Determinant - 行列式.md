## 行列式的性质与定义

二位和三维上，几何上，行列式是一个有向的面积或体积。

若要定义高维的体积 $\det (A)$，它需要满足这些特性：
- $\det (I)=1$。
- 若 $A$ 有两行相同，则 $\det(A)=0$。
- $\det(A)$ 线性地依赖于每一行：
$$
B=\begin{bmatrix}
v_{1} \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}, C=\begin{bmatrix}
v_{1}' \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}, A=\begin{bmatrix}
c_{1}v_{1}+c_{1}'v_{1}' \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}\implies \det (A)=c_{1}\det(B)+c_{1}'\det(C)
$$


从这些特性出发，可以证明：

- 若将 $A$ 交换两行得到 $A'$，则 $\det(A')=-\det(A)$。

- 第三种初等行变换（将某一行的倍数加到另一行）不改变行列式。

- 若 $A$ 是三角形矩阵，则有 $\det(A)=\prod_{i=1}^n a_{ii}$。

> 证明：
> 	若 $A$ 是对角矩阵，则显然成立。
> 	若 $A$ 的对角元素都非零，则可以用第三种初等行变换把它变成对角矩阵而不改变行列式。
> 	若有某个对角元素是零，则第三种初等行变换可以使 $A$ 出现零行，于是行列式为零，也等于对角线元素的乘积。

- 若 $A$ 奇异，则 $\det (A)=0$。若 $A$ 可逆，则 $\det(A)\neq 0$。

>  证明：
> 	 初等行变换不会改变 $\det(A)$ 是否为零。
> 	 那么只需要看高斯消元得到的上三角矩阵 $U$ 即可。
> 	 若 $A$ 奇异，则 $U$ 对角元素中有 $0$，故 $\det(A)=0$。
> 	 若 $A$ 可逆，则 $U$ 对角元素都非 $0$，则 $\det(A)\neq 0$。
	
  - $\det(AB)=\det(A)\det(B)$。特别的，若 $B=A^{-1}$，则有 $\det(A)\det(A^{-1})=1$。
>  证明：
> 	 若 $B$ 奇异，也就是说 $\det(B)=0$，则 $\text{rank}(AB)\leq\text{rank}(B)<n$，故 $AB$ 也奇异，故 $\det(AB)=0$，得证。
> 	 若 $B$ 可逆，也就是说 $\det(B)\neq 0$，只需要证明 $\frac{\det(AB)}{\det(B)}=\det(A)$。
> 	 构造一个映射 $d: M_{n\times n}\to \mathbb{R}, A \mapsto \frac{\det(AB)}{\det(B)}$，那么只需要证明 $d(A)$ 和 $\det(A)$ 是同一个映射。
> 	 检验三个特性即可：
> 	 1.  $d(I)=\frac{\det(IB)}{\det(B)}=1$。
> 	 2. 若 $A$ 两行相同，则 $AB$ 也有两行相同，则 $d(A)= \frac{\det(AB)}{\det(B)}=0$。
> 	 3. 
$$
A_{1}=\begin{bmatrix}
v_{1} \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}, A_{2}=\begin{bmatrix}
v_{1}' \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}, A=\begin{bmatrix}
c_{1}v_{1}+c_{1}'v_{1}' \\
v_{2} \\
\dots \\
v_{n}
\end{bmatrix}\implies
\begin{align}
d(A)&= \frac{\det(AB)}{\det(B)} \\ &=\frac{c_{1}\det(A_{1}B)+c_{1}'\det(A_{2}B)}{\det(B)} \\ &=c_{1}d(A_{1})+c_{1}'d(A_{2})
\end{align}
$$


- $\det (A)=\det(A^T)$
>  证明：
> 	 $\forall A,\exists P,L,U,s.t. PA=LU$。
> 	 那么 $\det(P)\det(A)=\det(L)\det(U)$。
> 	 另外， $(PA)^T=(LU)^T$，也就是 $A^TP^T=U^TL^T$。
> 	 那么 $\det(P^T)\det(A^T)=\det(U^T)\det(L^T)$。
> 	 由于 $L,U$ 都是三角形矩阵，它们的行列式就是对角线元素之乘积。故它们做转置行列式不变。
> 	 另外，由于 $P^TP=I$，有 $\det(P)\det(P^T)=1$。另外，由于交换两行给行列式添符号，有 $\det(P)=\pm\det(I)=\pm 1$。结合两者得到 $\det(P)=\det(P^T)$。
> 	 所以 $\det(A)=\det(A^T)$。
 
- $\det(A)=\pm(\text{product of pivots})$。（用 $LU$ 分解证明）

行列式的几何意义：假设 $A$ 分解为 $A=QR$。
那么 $\det(A)=\det(Q)\det(R)$。这里 $Q$ 是一个正交矩阵，故 $\det(Q^TQ)=1$，则 $\det(Q)=\pm 1$。
那么 $\det(A)=\pm \det(R)=\pm \prod q_{i}^Ta_{i}$。这相当于 $\text{底}\times\text{高}\times\text{高}\times\dots$，是一个高维体积。

*注意一般 $\det(A+B)\neq \det(A)+\det(B)$，例如 $\det(2A)=2^n\det(A)$*

## 行列式的求法

#### 求二阶矩阵的行列式
$$
\mathbf{A}=\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
$$
 的行列式为 $\det(\mathbf{A})=ad-bc$。
 证明：
 $$
\left| \begin{matrix} a & b \\
c & d  \end{matrix} \right| = \left| \begin{matrix} a & 0 \\
c & d \end{matrix} \right| + \left| \begin{matrix} 0 & b \\
c & d \end{matrix} \right| =  ad \left| \begin{matrix} 1 & 0 \\
0 & 1 \end{matrix} \right| +bc \left| \begin{matrix} 0 & 1 \\
1 & 0 \end{matrix} \right| = ad-bc
$$
 
#### 求三阶矩阵的行列式
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
证明：
把 $A$ 用行列式的线性特性拆成 $3^3$ 个行列式之和，每个形如 $a_{1i}a_{2j}a_{3k}\left| \begin{matrix} e_{i}  \\ e_{j} \\ e_{k}\end{matrix} \right|$。这里，如果有两行相同，那么行列式为 $0$，所以只剩下那些每行都不一样的，共有 $3! = 6$ 种。那么
$$
\det(A)=\sum_{(\alpha_{1},\alpha_{2},\alpha_{3})} a_{1\alpha_{1}}a_{2\alpha_{2}}a_{3\alpha_{3}}\det(P)
$$

#### 求一般矩阵的行列式

将上面的情况推广到 $n$ 阶：考虑 $(1,2,\dots,n)$ 的所有排列 $p=(\alpha_{1},\alpha_{2},\dots,\alpha_{n})$，则有大公式（Big Formula）：
$$
\det(A)=\sum_{(\alpha_{1},\alpha_{2},\dots,\alpha_{n})} a_{1\alpha_{1}}a_{2\alpha_{2}}\dots a_{n\alpha _{n}}\det(P)
$$
这里 $\det(P)=\pm 1$ 是该排列对应的置换矩阵的行列式，也是该排列 $p$ 的 **逆序数（Inversion Number）**，即集合 $\{ (i,j)|i<j,\alpha_{i}>\alpha_{j} \}$ 的基数，记作 $\text{inv}(p)$，则有
$$
\det(P)=(-1)^{\text{inv}(p)}
$$
（这是因为，逆序数对应该置换矩阵要交换多少次行可以交换回恒等矩阵）
当然这个计算的复杂度是阶乘的，实际计算还是用 $PA=LU$ 分解然后求主元之积。

另外，如果我们固定 $\alpha_{1}=1$，得到大公式的一部分 $a_{11} \sum_{(\alpha_{2},\alpha_{3},\dots,\alpha_{n})}a_{2\alpha_{2}}\dots a_{n\alpha _{n}}\det(P)=a_{11}M_{11}$，这里 $M_{ij}$ 表示余子式（Minor），再定义 $C_{ij}=(-1)^{i+j}M_{ij}$ 为代数余子式（Cofactor）。继续固定 $\alpha_{1}=2,3,\dots$，可得到：
$$
\det(A)=\sum(-1)^{k-1} M_{1k}= \sum_{i=1}^n a_{1i}C_{1i}
$$
定义行列式对第 $i$ 行的拉普拉斯展开（Laplace Expansion）：
$$
\det(A)= \sum_{k=1}^n a_{ik}C_{ik}
$$
由于 $\det(A)=\det(A^T)$ ，也可以对第 $j$ 列展开：
$$
\det(A)= \sum_{k=1}^n a_{kj}C_{kj}
$$

#### 用行列式求矩阵的逆

构建代数余子式构成的矩阵 $C$，其中 $C_{ij}=(-1)^{i+j}\det(M_{ij})$。
$$
A^{-1}= \frac{C^T}{\det(A)}
$$
**证明：**
要证明
$$
A \frac{C^T}{\det(A)}=I
$$
只需证明
$$
AC^T=\det(A)I
$$
考虑 $AC^T$ 的 $(i,i)$ 分量，这正好是 $A$ 的行列式对第 $i$ 行展开：
$$
(AC^T)_{i i}=\sum_{k=1}^n a_{i k}C_{i k}=\det(A)
$$
考虑 $AC^T$ 的 $(i,j)$ 分量（$i\neq j$）：
$$
(AC^T)_{ij}=\sum_{k=1}^na_{i k}C_{j k}
$$
我们构造一个新的矩阵 $A'$，使得它的第 $j$ 行被替换为第 $i$ 行，那么 $\det(A')=0$，但是又会发现上面这个 $(AC^T)_{ij}$ 恰好是 $A'$ 的行列式对第 $j$ 行展开。故而有 $(AC^T)_{ij}=0$。
这就证明了原命题。

#### 用行列式解方程

对方程 $Ax=b$，有 $x=A^{-1}b= \frac{C^T}{\det(A)}b$。
$C^Tb$ 的第 $i$ 个分量为：
$$
C_{1i}b_{1}+C_{2i}b_{2}+\dots+C_{ni}b_{n}
$$
这可以看成把 $A$ 的第 $i$ 列替换成 $b$ （设为 $B_{i}$）然后将行列式按第 $i$ 行展开。
这就是 **克莱姆法则（Cramer's Rule）：**
$$
x_{j}= \frac{\det(B_{j})}{\det(A)}
$$
### 用行列式求主元

设第 $k$ 个主元为 $d_{k}$，有
$$
d_{k}= \frac{\det(A_{k})}{\det(A_{k-1})}
$$
其中 $A_{k}$ 为 $A$ 左上角的 $k\times k$ 子矩阵，假设 $\det(A)\neq 0$。
**证明：** 假设 $A=LDU$，主元就是 $D$ 中的对角线元素。那么用分块矩阵的思想有
$$
\begin{align}
A=LDU&=\begin{bmatrix}
L_{k}  & 0 \\
* & *
\end{bmatrix} \begin{bmatrix}
D_{k} & 0 \\
0 & *
\end{bmatrix}
\begin{bmatrix}
U_{k} & * \\
0 & *
\end{bmatrix} \\
&=\begin{bmatrix}
L_{k}D_{k}U_{k} & * \\
* & *
\end{bmatrix} =\begin{bmatrix}
A_{k} & * \\
* & *
\end{bmatrix}
\end{align}
$$
所以有 $A_{k}=L_{k}D_{k}U_{k}$。
所以  $\det(A_{k})=\det(L_{k})\det(D_{k})\det(U_{k})=d_{1}d_{2}\dots d_{k}$。
那么 $d_{k}= \frac{d_{1}d_{2}\dots d_{k}}{d_{1}d_{2}\dots d_{k-1}}=\frac{\det(A_{k})}{\det(A_{k-1})}$ 。