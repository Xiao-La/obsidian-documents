### 二次型

$$
f(x,y)=ax^{2}+2bxy+cy^{2}
$$
 这样的（二元）二次型在原点处都是驻点：$\frac{ \partial f }{ \partial x }=\frac{ \partial f }{ \partial y }=0$。
 若 $f(x,y)$ 在原点之外是严格大于零的，称它为正定的（Positive Definite）。
 配方之后可以知道，这个二次型正定当且仅当：$$
a>0\
,\, ac>b^{2}
$$
类似的，也有负定（Negative Definite）的情况：
$$
a<0\,,\,ac>b^{2}
$$
正定负定的图形是碗形。
若 $a>0,ac=b^{2}$，称为半正定（ Positive Semidefinite）。
若 $a<0, ac=b^{2}$，称为半负定（ Negative Semidefinite）。
半定的图形是山谷形状，会有一条直线都是 $0$ 。
若 $ac<b^{2}$ ，图形会变成马鞍面（Saddle），此时原点叫做鞍点（Saddle Point）。

矩阵表示：
$$
f(x,y)=\begin{bmatrix}
x & y 
\end{bmatrix} \begin{bmatrix}
a & b \\
b & c
\end{bmatrix}\begin{bmatrix}
x \\
y
\end{bmatrix}=x^TAx
$$
对于 $n$ 元的二次型：
$$
f(x_{1},x_{2},\dots,x_{n})=x^TAx=\sum \sum a_{ij}x_{i}x_{j}
$$
其中 $A$ 是一个实对称矩阵，把它叫作一个二次型矩阵。
这里 $f$ 中，若 $i\neq j$，则 $x_{i}x_{j}$ 的系数除以二才得到 $a_{ij}=a_{ji}$。而矩阵的对角元就是平方项的系数。

### 正定矩阵

若 $f=x^TAx$ 是一个**正定二次型**，则把对称矩阵 $A$ 叫做**正定矩阵**。有时记作 $A>0$。
对对称矩阵 $A$，TFAE：
1.  $x^TAx>0\forall x\neq 0$
2. 所有特征值 $\lambda_{1},\dots,\lambda_{n}>0$
3. 左上角 $k\times k$ 的行列式 $\det(A_{k})>0$ $\forall k$
4. 主元 $d_{k}>0\,\forall k$
5. 存在一个可逆矩阵 $R$，使得 $A=R^TR$

*TFAE : The following are equivalent.*

证明：
- 【 $1\implies 2$ 】若 $x^TAx>0$，假设 $\lambda _i$ 是一个特征值，对应特征向量 $x_{i}\neq 0$，则 $x_{i}^TAx_{i}>0$。又因为 $Ax_{i}=\lambda x_{i}$，有 $\lambda_{i}x_{i}^Tx_{i}=\lambda_{i}\lVert x_{i} \rVert^{2}>0$，故而 $\lambda_{i}>0$。
- 【 $2\implies 1$ 】若 $\lambda_{i}>0$，由谱定理，因为 $A$ 是一个对称矩阵，它可以被一个正交矩阵对角化，也就是说存在一组规范正交的特征向量 $x_{1},\dots,x_{n}$ 使得 $Ax_{i}=\lambda_{i}x_{i}$。任意向量可以写成这组特征向量的线性组合： $x=\sum c_{i}x_{i}$。那么 $x^TAx=\left( \sum c_{i}x_{i}^T \right)A\left( \sum c_{i}x_{i} \right)=\left( \sum c_{i}x_{i}^T \right)\left( \sum c_{i}\lambda_{i}x_{i} \right)=\sum c_{i}^{2}\lambda_{i}$（因为交叉项都为 $0$）。故而 $x^TAx>0$。
- 【 $2\implies 3$ 】 $\det(A_{n})=\prod\lambda_{i}>0$。设原来的二次型为 $g(x_{1}\dots x_{n})=\begin{bmatrix}x_{1}\dots x_{n}\end{bmatrix}A\begin{bmatrix}x_{1} \\ \vdots\\x_{n}\end{bmatrix}$，它是正定的。那么考察 $f(x_{1}\dots x_{k})=\begin{bmatrix}x_{1}\dots x_{k}\end{bmatrix}A\begin{bmatrix}x_{1} \\ \vdots\\x_{k}\end{bmatrix}$，它满足 $f=g(x_{1}\dots x_{k},0\dots 0)$，那么 $f$ 也是正定的。于是 $\det(A_{k})>0$。
- 【 $3\implies 4$ 】 $d_{k}= \frac{\det(A_{k})}{\det(A_{k-1})}>0$。
- 【 $4\implies 1$ 】 假设 $A=LDU$，由于 $A^T=U^TDL^T=A=LDU$，有 $U=L^T$。那么 $\forall x\neq 0,x^TAx=x^T(LDU)x=x^TLDL^Tx$。令 $L^Tx=y\neq 0$，则 $x^TAx=y^TDy=\sum d_{i}y_{i}^{2}>0$。
- 【 $5\implies 1$ 】 $\forall x\neq 0, x^TAx=x^TR^TRx=\lVert Rx \rVert^{2}$，这里由于 $R$ 可逆，$Rx$ 就不为 $0$，因此 $x^TAx>0$。
- 【 $A>0\implies 5$ 】 
  - 法一（Cholesky Decomposition ）：$A=LDU=LDL^T=(L\sqrt{ D })(\sqrt{ D }L^T)$，设 $R=\sqrt{ D }L^T$，则 $A=R^TR$，这里 $R$ 显然可逆。
  - 法二： $A=Q\Lambda Q^T=Q\sqrt{ \Lambda }\sqrt{ \Lambda }Q^T$ ，设 $R=\sqrt{ \Lambda }Q^T$，则 $A=R^TR$，这里 $R$ 显然可逆。
  - 法三：$A=Q\Lambda Q^T=(Q\sqrt{ \Lambda  }Q^T)(Q\sqrt{ \Lambda }Q^T)$，设 $R=Q\sqrt{ \Lambda }Q^T$，则 $R$ 是一个对称的正定矩阵，且 $A=R^TR=R^{2}$。（这里这种分解方式最好的保留了 $A$ 的对称和正交的性质，所以可以定义 $R=\sqrt{ A }>0$）
  - 这里有无穷多种分解，因为若 $A=R^TR$，则对任意 $R'=QR$ 其中 $Q$ 是任意正交矩阵，则 $A=R'^TR'$。

当然，根据定义，也可以去直接把二次多项式给 Complete the square 来判断。
这里你会发现，若 $A=LDU$，则 $x^TAx=\sum d_{i}y_{i}^{2}$，这里 $y_{i}=L^Tx_{i}$，且 $d_{i}$ 为第 $i$ 个主元。这就是配方之后的结果！所以配方和高斯消元的过程其实是对应的。

将一个对称矩阵称为半正定的（Semipositive Definite），若 
$$
x^TAx\geq 0\forall x
$$
记作 $A\geq 0$。
半负定： $x^TAx\leq 0 \forall x$。记作 $A\leq 0$。

TFAE:
- $A\geq 0$
- 特征值 $\lambda_{i} \geq 0$
- 没有主矩阵（Principle Matrices）有负的特征值。
  - 主矩阵：指标集（Index Set） $I\subset \{ 1,2,\dots,n \}$ 对应的主矩阵 $A_{I}$ ，定义为 $A$ 的一个子矩阵，它来自于选取 $A$ 中的所有满足 $i,j\in I$ 的 $a_{ij}$。
- 主元 $d_{i}\geq 0$
- 存在矩阵 $R$ 使得 $A=R^TR$。

要证明这些事情，可以用这个事实：
$$
A\geq 0 \iff A+\varepsilon I>0 \, \, \forall\text{sufficient small }\varepsilon>0
$$
这个事实的证明：
- 左推右： $\forall x\neq 0, x^T(A+\varepsilon I)x=x^TAx+\varepsilon x^Tx>0$。
- 右推左：$x^TAx=\lim_{ \varepsilon \to 0 } x^T(A+\varepsilon I)x\geq 0$。
例如要证明 $A\geq 0\implies\lambda_{i}\geq 0$ ：$A\geq 0 \implies A+\varepsilon I > 0 \implies \lambda_{i}+\varepsilon > 0 \implies\lambda_{i}\geq 0$。

### 合同矩阵

对于二次型 $f=x^TAx$，它可以做换元 $x=Cy$ 来研究，且 
$$
x^TAx=y^T(C^TAC)y
$$
其中 $C$ 是一个可逆的矩阵。

这里定义 $A,B$ 为合同的（Congruent），若存在可逆矩阵 $C$ 使得
$$
B=C^TAC 
$$
合同关系（Congruence）有如下性质：
- 对称矩阵的合同矩阵也是对称矩阵。
- 单位矩阵 $A=I$ 的合同矩阵形如 $B=C^TC$。也就是说，它是正定的！那么 $B$ 的特征值都是正的。

塞维斯特惯性定律（Sylvester's Law of Inertia）：
-  $A$ 的合同矩阵 $C^TAC$ 和 $A$ 有相同数量的正特征值，相同数量的负特征值和相同数量的零特征值。
- 把正特征值的数量称为正惯性指数（Positive index of inertia），记作 $p$。
- 把负特征值的数量称为负惯性指数（Negative index of inertia），记作 $q$。
- 这里 $p+q=\text{rank}(A)$。$p-q$ 称为符号差（Signature）。
该定律也可以表述成：
- 设 $f(x_{1}\dots x_{n})=x^TAx$ 为秩为 $r$ 的 $n$ 元二次型。存在一个线性变量替换 $x=Cy$ 使得 $f$ 变为
$$
g(y_{1}\dots y_{n})=y_{1}^{2}+y_{2}^{2}+\dots+y_{p}^{2}-y_{{p+1}}^{2}-\dots-y_{r}^{2}
$$
- 上述二次型被称为 $f$ 的规范型，其由 $f$ 唯一决定。

### 应用

二次超曲面（Geometry of Quadratic Hypersurface）可以写成
$$
x^TAx=1
$$
要看出它是一种怎样的矩阵，可以做坐标变换 $x=Qy$，其中 $Q$ 是一个正交矩阵。谱定理指出，由于 $A$ 是对称矩阵，存在这样的正交矩阵 $Q$，使得 $Q^TAQ=\Lambda$。
那么原来的曲面等价于
$$
x^TAx=(Qy)^TA(Qy)=y^T(Q^TAQ)y=y^T\Lambda y=\sum\lambda_{i}y_{i}^{2}=1
$$
那么只需要去看 $\lambda_{i}$ 的正负，很容易就可看出来这个曲面是什么形状的。
对于 $n=3$ 的情况，这就可以用来判定三维空间中的二次曲面了：
$$
x^TAx=\lambda_{1}y_{1}^{2}+\lambda_{2}y_{2}^{2}+\lambda_{3}y_{3}^{2}=1
$$
- 若特征值全为正，如 $\lambda_{1},\lambda_{2},\lambda_{3}>0$，则为椭球面（Ellipsoid）。
$$
x^{2}+y^{2}+z^{2}=1
$$
- 若特征值两正一负，如 $\lambda_{1},\lambda_{2}>0,\lambda_{3}<0$，则为单叶双曲面（Hyperboloid of One Sheet）。
$$
x^{2}+y^{2}-z^{2}= 1
$$
- 若特征值一正两负，如 $\lambda_{1}>0,\lambda_{2},\lambda_{3}<0$，则为双叶双曲面 （Hyperboloid of Two Sheet）。
$$
x^{2}-y^{2}-z^{2}=1
$$
- 若特征值全为负，如 $\lambda_{1},\lambda_{2},\lambda_{3}<0$，则为空集。
退化状态：
- 若特征值两正一零，如 $\lambda_{1},\lambda_{2}>0, \lambda_{3}=0$，则为椭圆柱面（Elliptic Cylinder）。
$$
x^{2}+y^{2}=1
$$
- 若特征值一正一负一零，如 $\lambda_{1}>0,\lambda_{2}<0,\lambda_{3}=0$，则为双曲柱面（Hyperbolic Cylinder）。
$$
x^{2}-y^{2}=1
$$
- 若特征值两负一零，如 $\lambda_{1},\lambda_{2}<0,\lambda_{3}=0$，则为空集。
- 若特征值一正两零，如 $\lambda_{1}>0,\lambda_{2},\lambda_{3}=0$，则为两个平行平面（Two  Parallel Planes）。
$$
x^{2}=1
$$
- 若特征值一负两零，如 $\lambda_{1}<0,\lambda_{2},\lambda_{3}=0$，则为空集。
- 若特征值全为零，$\lambda_{1},\lambda_{2},\lambda_{3}=0$，则为空集。

要求这个正负惯性指数，就可以利用塞维斯特惯性定律，转换为规范型就直接看出来了。
- 直接解特征方程。
- 利用韦达定理判断 $\lambda$ 的正负。
- 换元，配方转换为规范型。
*拉格朗日配方法：若至少一个平方项，那就直接对该平方项进行配方，迭代即可。若没有平方项，则挑一个交叉项 $x_{1}x_{2}$，令 $x_{1}=y_{1}+y_{2},x_{2}=y_{1}-y_{2}$，这就用平方差公式创造出了平方项。*
## 奇异值分解（Singular Value Decomposition, SVD）


任何 $m\times n$ 的矩阵 $A$ 可以被分解为
$$
A=U\Sigma V^T
$$
其中：
- $U$ 是 $m\times m$ 的一个正交矩阵。它是 $AA^T$ 的特征向量构成的。
- $V$ 是 $n\times n$ 的一个正交矩阵。它是 $A^TA$ 的特征向量构成的。
- $\Sigma$ 是一个 $m\times n$ 的对角矩阵，它可以写成分块矩阵
$$
\begin{bmatrix}
\Sigma_{1} & 0 \\
0  &0 
\end{bmatrix}
$$
- 其中
$$
\Sigma_{1}= \begin{bmatrix}
\sigma_{1} \\
 & \ddots \\
 &  & \sigma_{r}
\end{bmatrix}
$$
- 其中 $r$ 为 $A$ 的秩，这里 $\sigma_{i}$ 称为奇异值（Singular Value）。
**定义 ：** $A$ 的奇异值 $\sigma_{i}=\sqrt{ \lambda_{i} }=\sqrt{ \mu_{i} }$ ，其中 $\lambda_{i},\mu_{i}$ 是 $AA^T$ 和 $A^TA$ 的非零特征值（$i=1,2,\dots,\text{rank}(A)$）。

（可以这么定义是因为，$AA^T$ 和 $A^TA$ 都是半正定矩阵，特征值都大于零，而且它们的秩都和 $A$ 相同，且它们的非零特征值也相等。验证一下：这里
$$
\begin{align}
A^TA&=(U\Sigma V^T)^TU\Sigma V^T
\\&=V\Sigma^TU^TU\Sigma V^T \\
&=V\Sigma^T\Sigma V^T \\
&=V\begin{bmatrix}
\Sigma_{1}^T\Sigma_{1} & 0 \\
0 & 0
\end{bmatrix}V^T \\
\end{align}
$$
其中
$$
\Sigma_{1}^T\Sigma_{1}=\begin{bmatrix}
\sigma_{1}^{2} \\
 & \ddots  \\
 &  &  \sigma_{r}^{2}
\end{bmatrix}
$$
这里就找到了 $A^TA$ 的一个谱分解。那么，$\sigma_{i}^{2}$ 就是 $A^TA$ 的所有非零特征值！
类似的，由于 $AB$ 和 $BA$ 有相同的非零特征值，那么 $\sigma_{i}^{2}$ 也是 $AA^T$ 的所有非零特征值。
有 $AA^T=U\Sigma \Sigma^TU^T$。
）
这里会发现，由于 $AV=U\Sigma$，如果对 $r$进行分块：
$$
A\begin{bmatrix}
V_{r} & V_{n-r}
\end{bmatrix}=\begin{bmatrix}
U_{r}  & U_{m-r}
\end{bmatrix}\begin{bmatrix}
\Sigma_{r} & 0 \\
0 & 0
\end{bmatrix}
$$
也就是 $AV_{r}=U_{r}\Sigma_{r},AV_{n-r}=0$。
那么 $V$ 的前 $r$ 列就对应 $A$ 的行空间，后 $n-r$ 列就对应 $A$ 的零空间。
同理， $U$ 的前 $r$ 列对应 $A$ 的列空间，后 $m-r$ 列就对应 $A$ 的左零空间。

要求一个矩阵的 SVD 分解，不能随便选取 $U,V$。
需要选取：
$$
Av_{j}=\sigma_{j}u_{j}, j=1,\dots,r
$$
这个从上面的分块矩阵可以看出来。（存在性证明：
- 若 $v_{j}$ 是 $A^TA$ 的一个单位特征向量，对应特征值 $\sigma_{j}^{2}$，则 $A^TAv_{j}=\sigma_{j}^{2}v_{j}$，进而 $AA^TAv_{j}=\sigma_{j}^{2}Av_{j}$，也就是 $Av_{j}$ 是 $AA^T$ 的一个特征向量，对应特征值 $\sigma_{j}^{2}$。而且
$$
\lVert Av_{j} \rVert^{2}=v_{j}^TA^TAv_{j}=v_{j}^T\sigma_{j}^{2} v_{j}=\sigma_{j}^{2}
$$
- 那么 $Av_{j} / \sigma_{j}=u_{j}$ 就是 $AA^T$ 的一个单位特征向量，得证。）
那么就应该先求出 $A^TA$ 的 $r$ 个非零特征值对应的向量和 $n-r$ 个 $A^TA$ 的零空间的向量，来构造 $V$，再利用关系 $u_{j}= Av_{j} / \sigma_{j}$ 来得到前 $r$ 个构造 $u_{j}$。剩下的 $m-r$ 个 $u_{j}$ 需要去求 $N(A^T)$ 然后再做正交化得到。


**定理 ：** 任意可逆方阵 $A$ 都可以写成
$$
A=Q_{1}SQ_{2}^{-1}
$$
其中 $Q_{1},Q_{2}$ 为正交矩阵，$S$ 是一个正定矩阵。
证明：
$$
x^TA^TAx=\lVert Ax \rVert^{2}>0 \forall x\neq 0 
$$
所以 $A^TA$ 是正定的实对称矩阵。那么存在谱分解：
$$
Q_{2}^TA^TAQ_{2}=\Lambda
$$
令 $S=\sqrt{ \Lambda }$，那么 $S$ 是一个正定的对角的可逆矩阵。那么有：
$$
S^{-1}Q_{2}^TQ^TAQ_{2}S^{-1}=I
$$
那么 $AQ_{2}S^{-1}$ 就是一个正交矩阵，记为 $Q_{1}$。于是有
$$
A=Q_{1}SQ_{2}^{-1}
$$

### SVD 的应用

极分解（Polar Decomposition）：任何实方阵 $A$ 可以分解成 $A=QS$，其中 $Q$ 是正交矩阵，$S$ 是对称的半正定的矩阵。
（$A=U\Sigma V^T=(UV^T)(V\Sigma V^T)=QS$）
类比 $z=re^{i\theta}$。这里 $S$ 类似于  $r$，$Q$ 类似与 $e^{i\theta}$。

有效秩（Effective Rank）：用 $A^TA$ 来计算 $A$ 的秩，会更稳定（实际计算中数值可能有一些小的偏差，$A^TA$ 会把这些偏差平方，而缩小。）

图片压缩（Image Compression）：一个 $m\times n$ 的图像，可以进行 SVD 分解，只需要存储 $r$ 个奇异值和奇异向量，共 $r\times(m+n+1)$ 个值。图片压缩比：$\frac{m\times n}{r\times(m+n+1)}$。
图片降噪（Noice Reduction）：直接丢掉相对来说特别小的奇异值和奇异降噪。

最小二乘（Least Square）的最优解：最小二乘的 Normal Equation $A^TAx=A^Tb$ ，如果 $A^TA$ 不可逆，也就是说，$A$ 不是列满秩的，则可能有多个解 $\hat{x}$。其中最优解为长度最小的解 $x^{+}$。
- 记作 $x^{+}=A^+b$ 中，$A^+$ 称为 $A$ 的伪逆（Pseuodoinverse）。
- 容易验证，$\Sigma^{+}$ 就是把每一个 $\sigma$ 求倒数。
- 一般情况下，由于 $\hat{x}=x_{r}+x_{n}$，那么由于零空间和行空间正交，有 $\lVert \hat{x} \rVert^{2}=\lVert x_{r} \rVert^{2}+\lVert x_{n} \rVert ^{2}$，取 $x_{n}=0$，则得到了最优解，**所以最优解是行空间中的。** （可以解 Normal Equation 然后选行空间中的）
- ![[Positive Definite Matrices - 正定矩阵.png]]
- 一般情况下，伪逆有公式
$$
A^{+}=V\Sigma^+ U^T
$$
- 证明：$\lVert Ax-b \rVert=\lVert U\Sigma V^Tx-b \rVert=\lVert \Sigma V^Tx-U^Tb \rVert$。
- 令 $y=V^Tx=V^{-1}x$。只需最小化 $\lVert \Sigma y-U^Tb \rVert$。
- $y^+=\Sigma^+U^Tb$，故而 $x^+=V\Sigma^+U^T$。