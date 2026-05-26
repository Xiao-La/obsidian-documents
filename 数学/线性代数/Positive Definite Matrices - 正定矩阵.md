### 二次型

$$
f(x,y)=ax^{2}+2bxy+cy^{2}
$$
 这样的（二元）二次型在原点处都是驻点：$\frac{ \partial f }{ \partial x }=\frac{ \partial f }{ \partial y }=0$。
 若 $f(x,y)$ 在原点之外是严格大于零的，称它为正定的（Positive Definite）。
 配方之后可以知道，这个二次型正定当且仅当：$$
a>0\
,,\, ac>b^{2}
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

若 $f=x^TAx$ 是一个正定二次型，则把 $A$ 叫做正定矩阵。