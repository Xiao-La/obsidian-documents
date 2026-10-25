向量（Vector）运算的 8 条性质：
- $\boldsymbol{x}+\boldsymbol{y}=\boldsymbol{y}+\boldsymbol{x}$。
- $(\boldsymbol{x}+\boldsymbol{y})+\boldsymbol{z}=\boldsymbol{x}+(\boldsymbol{y}+\boldsymbol{z})$。
- 存在一个唯一的零向量 $\boldsymbol{0}$ 使得 $\boldsymbol{x}+\boldsymbol{0}=\boldsymbol{0}+\boldsymbol{x}=\boldsymbol{x}$。
- 对每个 $\boldsymbol{x}$，存在一个唯一的 $-\boldsymbol{x}$ 使得 $\boldsymbol{x}+(-\boldsymbol{x})=(-\boldsymbol{x})+\boldsymbol{x}=\boldsymbol{0}$
- $1\boldsymbol{x}=\boldsymbol{x}$
- $(c_{1}c_{2})\boldsymbol{x}=c_{1}(c_{2}\boldsymbol{x})$
- $c(\boldsymbol{x}+\boldsymbol{y})=c\boldsymbol{x}+c\boldsymbol{y}$
- $(c_{1}+c_{2})\boldsymbol{x}=c_{1}\boldsymbol{x}+c_{2}\boldsymbol{x}$
注意这里的向量可以不止是一列数字，也可以是矩阵，也可以是函数，只要能做线性组合就好。

定义 **向量空间（Vector Space）** $V$ 为一个向量的集合，其中定义了向量的加法运算与数乘运算，且这些运算满足以上 8 条性质。

对一个向量空间 $(V, +, \cdot)$，它具有以下性质：
- $0\cdot \boldsymbol{x}=\boldsymbol{0}$
- $(-1)\cdot \boldsymbol{x}=-\boldsymbol{x}$
- 若 $\boldsymbol{x}+\boldsymbol{y}=\boldsymbol{x}+\boldsymbol{z}$，则 $\boldsymbol{y}=\boldsymbol{z}$
- $\beta \cdot \boldsymbol{0}=\boldsymbol{0}, \forall \beta \in \mathbb{R}$
- $\alpha \cdot \boldsymbol{x}=\boldsymbol{0}\implies\alpha=0$ 或 $\boldsymbol{x}=\boldsymbol{0}$

定义 **子空间（Subspace）** 为一个向量空间 $V$ 的非空子集 $W$，且满足：
- 加法封闭性：若 $\boldsymbol{x},\boldsymbol{y}\in W$，则 $\boldsymbol{x}+\boldsymbol{y}\in W$。
- 数乘封闭性：若 $\boldsymbol{x} \in W, c\in \mathbb{R}$，则 $c \boldsymbol{x}\in W$
例如，对空间 $\mathbb{R}^{3}$，可能的子空间为零空间，通过原点的直线，通过原点的面，以及它本身。

### 四大基本空间

对于一个 $m\times n$ 矩阵 $A$，它的：

- **列空间（Column Space）：** 所有列向量的线性组合，记作 $C(A)$，为一个 $\mathbb{R}^m$ 的子空间。
>  推论：$A\boldsymbol{x}=\boldsymbol{b}$ 是相容的当且仅当 $\boldsymbol{b}\in C(A)$；若 $A\in M_{n\times n}$ 非奇异，则 $C(A)=\mathbb{R}^n$。
>  $\boldsymbol{b} \in C(A)\implies \exists \boldsymbol{c}\in \mathbb{R}^n,\text{s.t.} A\boldsymbol{c}=\boldsymbol{b}$

- **零空间/核空间（Nullspace/Kernel）：** 所有使得 $A\boldsymbol{x}=\boldsymbol{0}$ 的向量 $\boldsymbol{x}$，记作 $N(A)$，为一个 $\mathbb{R}^n$ 的子空间。
>  推论：若 $A\boldsymbol{x}=\boldsymbol{b}$ 有特解 $\boldsymbol{x}_{0}$，则所有的解可以写成 $\boldsymbol{x}=\boldsymbol{x}_{0}+\boldsymbol{x}_{n}$，其中 $\boldsymbol{x}_{n} \in N(A)$。

- **行空间（Row Space）**：$C(A^{\top}) \subseteq \mathbb{R}^n$
- **左零空间（Left Nullspace）：** ****$N(A^{\top})\subseteq \mathbb{R}^m$


### 向量张成的空间

被向量 $\boldsymbol{w}_{1},\boldsymbol{w}_{2},\dots,\boldsymbol{w}_{l}$ 张成的空间（Spanned by $\boldsymbol{w}_{1},\boldsymbol{w}_{2},\dots \boldsymbol{w}_{l}$）为这些向量的所有线性组合构成的集合。

空间 $V$  的基（Basis）：
- 一组线性无关的向量 $\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots,\boldsymbol{v}_{n}$ 。
- $V$ 为这些向量张成的空间。
这里 $n=\dim V$。
记得验证空间非空。

定理：$\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots \boldsymbol{v}_{n}\in \mathbb{R}^n$ 是 $\mathbb{R}^{n}$ 的一组基，当且仅当 $A=[\boldsymbol{v}_{1}\dots \boldsymbol{v}_{n}]$ 可逆。

对于多项式集 $\mathbb{R}[x]_{\leq n}=\{ a_{0}+a_{1}x+\dots+a_{n}x^{n} | a_{0},a_{1},a_{2},\dots,a_{n}\in \mathbb{R}\}$，一组基为 $1,x,x^{2},x^{3},\dots,x^{n}$。

定理：若向量空间 $V$ 存在两组基 $\boldsymbol{v}_{1},\boldsymbol{v}_{2},\dots,\boldsymbol{v}_{n}$ 和 $\boldsymbol{w}_{1},\boldsymbol{w}_{2},\dots,\boldsymbol{w}_{m}$，则 $m=n$。这里 $n$ 定义为向量空间 $V$ 的维数（dimension）$\dim V$。

### 基本空间的基

对于 $m\times n$ 矩阵 $A$：
**找 $C(A)$ 的基：**
- 将 $A$ 化为阶梯型矩阵 $U$，则 $U$ 的一组列线性无关等价于对应的 $A$ 的列是线性无关的。
- $C(U)$ 的一组基是其 $r$ 个包含主元的列（这与 $C(A)$ 不同，需要回去找 $A$ 的列）。
- $\dim C(A)=r=\operatorname{rank}(A)$。
**找 $N(A)$ 的基：**
- 找 $A\boldsymbol{x}=\boldsymbol{0}$ 的特解，也就是说化成行最简型 $R$ 后得到 $n-r$ 个自由变量，将其中一个设为 $1$，其他设为 $0$ 得到一个特解，总共得到 $n-r$ 个特解。这些特解就是基。
- $\dim N(A)=n-r$，也称为零化度（Nullity）。

**秩-零化度定理：** $\operatorname{rank}(A)+\dim N(A)=n$。

**找 $C(A^{\top})$ 的基：**
-  行变换不影响行空间，因此 $C(A^{\top})=C(U^{\top})$。
-  $\dim C(A^{\top})=r=\operatorname{rank}(A^{\top})$。
**找 $N(A^{\top})$ 的基：**
- 设 $A=LU$，则 $L^{-1}$ 的最后 $m-r$ 行构成 $N(A^{\top})$ 的基。
- $\dim N(A^{\top})=m-r$。

从而我们可以发现，$C(A), N(A^{\top})\subseteq \mathbb{R}^m, C(A^{\top}), N(A)\subseteq \mathbb{R}^n$ ，且有：
$$
C(A) \perp N(A^{\top})
$$
$$
C(A^{\top}) \perp N(A)
$$

高斯-约旦消元法求解四大基本子空间：$\begin{bmatrix}A\mid I\end{bmatrix}\to \begin{bmatrix}R\mid E\end{bmatrix}$

|基本子空间|维数|提取方法|
|---|---|---|
|**行空间 $C(A^{\top})$**| $r$ |直接取 $R$ 的 $r$ 个非零行向量|
|**列空间 $C(A)$**| $r$ |找 $R$ 中的主元列，取**原矩阵 $A$** 中对应的列|
|**零空间 $N(A)$**| $n-r$ |利用 $R$ 求解 $R\boldsymbol{x}=0$ 的基础解系|
|**左零空间 $N(A^{\top})$**| $m-r$ |取 $E$ 中对应 $R$ 里全零行所在位置的那几行|