向量（Vector）运算的 8 条性质：
- $\mathbf{x}+\mathbf{y}=\mathbf{y}+\mathbf{x}$。
- $(\mathbf{x}+\mathbf{y})+\mathbf{z}=\mathbf{x}+(\mathbf{y}+\mathbf{z})$。
- 存在一个唯一的零向量 $\mathbf{0}$ 使得 $\mathbf{x}+\mathbf{0}=\mathbf{0}+\mathbf{x}=\mathbf{x}$。
- 对每个 $\mathbf{x}$，存在一个唯一的 $-\mathbf{x}$ 使得 $\mathbf{x}+(-\mathbf{x})=(-\mathbf{x})+\mathbf{x}=\mathbf{0}$
- $1\mathbf{x}=\mathbf{x}$
- $(c_{1}c_{2})\mathbf{x}=c_{1}(c_{2}\mathbf{x})$
- $c(\mathbf{x}+\mathbf{y})=c\mathbf{x}+c\mathbf{y}$
- $(c_{1}+c_{2})\mathbf{x}=c_{1}\mathbf{x}+c_{2}\mathbf{x}$
注意这里的向量可以不止是一列数字，也可以是矩阵，也可以是函数，只要能做线性组合就好。

定义 **向量空间（Vector Space）** $V$ 为一个向量的集合，其中定义了向量的加法运算与数乘运算，且这些运算满足以上 8 条性质。

对一个向量空间 $(V, +, \cdot)$，它具有以下性质：
- $0\cdot \mathbf{x}=\mathbf{0}$
- $(-1)\cdot \mathbf{x}=-\mathbf{x}$
- 若 $\mathbf{x}+\mathbf{y}=\mathbf{x}+\mathbf{z}$，则 $\mathbf{y}=\mathbf{z}$
- $\beta \cdot \mathbf{0}=\mathbf{0}, \forall \beta \in \mathbb{R}$
- $\alpha \cdot \mathbf{x}=\mathbf{0}\implies\alpha=0$ 或 $\mathbf{x}=\mathbf{0}$

定义 **子空间（Subspace）** 为一个向量空间 $V$ 的非空子集 $W$，且满足：
- 加法封闭性：若 $\mathbf{x},\mathbf{y}\in W$，则 $\mathbf{x}+\mathbf{y}\in W$。
- 数乘封闭性：若 $\mathbf{x} \in W, c\in \mathbb{R}$，则 $c \mathbf{x}\in W$
例如，对空间 $\mathbb{R}^{3}$，可能的子空间为零空间，通过原点的直线，通过原点的面，以及它本身。

### 四大基本空间

对于一个 $m\times n$ 矩阵 $\mathbf{A}$，它的：

- **列空间（Column Space）：** 所有列向量的线性组合，记作 $C(\mathbf{A})$，为一个 $\mathbb{R}^m$ 的子空间。
>  推论：$\mathbf{A}\mathbf{x}=\mathbf{b}$ 是相容的当且仅当 $\mathbf{b}\in C(\mathbf{A})$；若 $\mathbf{A}\in M_{n\times n}$ 非奇异，则 $C(\mathbf{A})=\mathbb{R}^n$。
>  $\mathbf{b} \in C(\mathbf{A})\implies \exists \mathbf{c}\in \mathbb{R}^m,\text{s.t.} \mathbf{A}\mathbf{c}=\mathbf{b}$

- **零空间/核空间（Nullspace/Kernal）：** 所有使得 $\mathbf{A}\mathbf{x}=\mathbf{0}$ 的向量 $\mathbf{x}$，记作 $N(\mathbf{A})$，为一个 $\mathbb{R}^n$ 的子空间。
>  推论：若 $\mathbf{A}\mathbf{x}=\mathbf{b}$ 有特解 $\mathbf{x}_{0}$，则所有的解可以写成 $\mathbf{x}=\mathbf{x}_{0}+\mathbf{x}_{n}$，其中 $\mathbf{x}_{n} \in N(\mathbf{A})$。

- **行空间（Row Space）**：$C(\mathbf{A}^T) \subset \mathbb{R}^n$
- **左零空间（Left Nullspace）：** ****$N(\mathbf{A}^T)\subset \mathbb{R}^m$


### 向量张成的空间

被向量 $\mathbf{w}_{1},\mathbf{w}_{2},\dots,\mathbf{w}_{l}$ 张成的空间（Spanned by $\mathbf{w}_{1},\mathbf{w}_{2},\dots \mathbf{w}_{l}$）为这些向量的所有线性组合构成的集合。

空间 $V$  的基（Basis）：
- 一组线性无关的向量 $v_{1},v_{2},\dots,v_{n}$ 。
- $V$ 为这些向量张成的空间。
这里 $n=\text{dim}V$。

定理：$\mathbf{v}_{1},\mathbf{v}_{2},\dots \mathbf{v}_{n}\in \mathbb{R}^n$ 是 $\mathbb{R}^{n}$ 的一组基，当且仅当 $\mathbf{A}=[\mathbf{v}_{1}\dots \mathbf{v}_{n}]$ 可逆。

对于多项式集 $\mathbb{R}[x]_{\leq n}=\{ a_{0}+a_{1}x+\dots+a_{n}x^{n} | a_{1},a_{2},\dots,a_{n}\in \mathbb{R}\}$，一组基为 $1,x,x^{2},x^{3},\dots,x^{n}$。

定理：若向量空间 $V$ 存在两组基 $\mathbf{v}_{1},\mathbf{v}_{2},\dots,\mathbf{v}_{n}$ 和 $\mathbf{w}_{1},\mathbf{w}_{2},\dots,\mathbf{w}_{n}$，则 $m=n$。这里 $n$ 定义为向量空间 $V$ 的维数（dimension）$\text{dim}V$。

### 基本空间的基

对于 $m\times n$ 矩阵 $\mathbf{A}$：
**找 $C(\mathbf{A})$ 的基：**
- 将 $\mathbf{A}$ 化为阶梯型矩阵 $\mathbf{U}$，则 $\mathbf{U}$ 的一组列线性无关等价于对应的 $\mathbf{A}$ 的列是线性无关的。
- $C(\mathbf{U})$ 的一组基是其 $r$ 个包含主元的列（这与 $C(\mathbf{A})$ 不同，需要回去找 $\mathbf{A}$ 的列）。
- $\text{dim}C(\mathbf{A})=r=\text{rank}(\mathbf{A})$。
**找 $N(\mathbf{A})$ 的基：**
- 找 $\mathbf{A}\mathbf{x}=\mathbf{0}$ 的特解，也就是说化成行最简型 $\mathbf{R}$ 后得到 $n-r$ 个自由变量，将其中一个设为 $1$，其他设为 $0$ 得到一个特解，总共得到 $n-r$ 个特解。这些特解就是基。
- $\text{dim}N(\mathbf{A})=n-r$，也称为零化度（Nullity）。

**秩-零化度定理：** $\text{rank}(\mathbf{A})+\text{dim}N(\mathbf{A})=n$。

**找 $C(\mathbf{A}^T)$ 的基：**
-  行变换不影响行空间，因此 $C(\mathbf{A}^T)=C(\mathbf{U}^T)$。
-  $\text{dim}C(\mathbf{A}^T)=r=\text{rank}(\mathbf{A}^T)$。
**找 $N(\mathbf{A}^T)$ 的基：
- 设 $\mathbf{A}=\mathbf{L}\mathbf{U}$，则 $\mathbf{L}^{-1}$ 的最后 $m-r$ 行构成 $N(\mathbf{A}^T)$ 的基。
- $\text{dim}N(\mathbf{A}^T)=m-r$。

从而我们可以发现，$C(\mathbf{A}), N(\mathbf{A}^T)\subset \mathbb{R}^m, C(\mathbf{A}^T), N(\mathbf{A})\subset \mathbb{R}^n$ ，且有：
$$
C(\mathbf{A}) \perp N(\mathbf{A}^{T})
$$
$$
C(\mathbf{A^T}) \perp N(\mathbf{A})
$$

高斯-约旦消元法求解四大基本子空间：$\begin{bmatrix}A|I\end{bmatrix}\to \begin{bmatrix}R|E\end{bmatrix}$

|基本子空间|维数|提取方法|
|---|---|---|
|**行空间 $C(A^T)$**| $r$ |直接取 $R$ 的 $r$ 个非零行向量|
|**列空间 $C(A)$**| $r$ |找 $R$ 中的主元列，取**原矩阵 $A$** 中对应的列|
|**零空间 $N(A)$**| $n-r$ |利用 $R$ 求解 $Rx=0$ 的基础解系|
|**左零空间 $N(A^T)$**| $m-r$ |取 $E$ 中对应 $R$ 里全零行所在位置的那几行|