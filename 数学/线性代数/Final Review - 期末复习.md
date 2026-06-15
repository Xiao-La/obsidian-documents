> **不考章节：** 1.7 (Special Matrices), 2.5 (Graphs and Networks), 3.5 (FFT), 5.4 (Differential Equations), 6.4 (Minimum Principles), 6.5 (Finite Element Method)

做题中出现的结论：

对于任意 $n$ 阶实方阵 $A$，$A$ 为反对称矩阵的充要条件是：对于任意实向量 $x \in \mathbb{R}^n$，都有二次型 $x^T A x = 0$。

要证明正定性相关的结论，很经常使用 $A=R^TR$ 做替换，然后多去因式分解拆一拆探路。

迹的循环性质：$tr(AB)=tr(BA)$（可以从非零特征值来理解）。

$|I+uv^T| = 1+v^Tu$
## 1 Matrices and Gaussian Elimination

### 1.1 Introduction

（略）

### 1.2 The Geometry of Linear Equations

- **矩阵形式：** $A\mathbf{x} = \mathbf{b}$，$A$ 为系数矩阵
- **增广矩阵：** $[A \mid \mathbf{b}]$
- **相容（Consistent）：** 至少有一组解
- **不相容（Inconsistent）：** 无解

**两种几何观点：**
- **行观点（Row Picture）：** 每个方程表示一个平面。相容 $\iff$ 所有平面有非空交
- **列观点（Column Picture）：** $\mathbf{b}$ 必须落在 $A$ 的列向量张成的空间中

**奇异性（Singularity）：**
- 奇异（Singular）：无解或无穷多解
- 非奇异（Nonsingular）：有且仅有一组解
- $A$ 非奇异 $\iff$ $\forall \mathbf{b},\ A\mathbf{x}=\mathbf{b}$ 非奇异

### 1.3 An Example of Gaussian Elimination

**初等行变换（Elementary Row Operations）——保持解不变：**
1. $E_i \leftrightarrow E_j$（交换两行）
2. $E_i \gets kE_i$（$k \neq 0$，一行乘非零常数）
3. $E_i \gets E_i + kE_j$（一行倍数加到另一行）

**高斯消元步骤：**
1. 对增广矩阵进行初等行变换化为行阶梯形（Row Echelon Form）
2. 回代（Back Substitution）

> 每一行第一个非零元素称为**主元（Pivot）**

### 1.4 Matrix Notation and Matrix Multiplication

矩阵 $\mathbf{A} = [a_{ij}]_{m\times n}$。线性运算（加减、数乘）逐分量进行。$\mathbf{I}_n$ 为单位矩阵。

**矩阵乘法：** $A_{n\times m} \cdot B_{m\times p} = C_{n\times p}$，$c_{ij} = \sum_k a_{ik} b_{kj}$

**四种视角理解乘法：**
1. **行列点乘：** $C$ 的 $(i,j)$ 元 = $A$ 第 $i$ 行与 $B$ 第 $j$ 列的内积
2. **列组合：** $C$ 的列 = $A$ 的列的线性组合，系数来自 $B$ 对应列
3. **行组合：** $C$ 的行 = $B$ 的行的线性组合，系数来自 $A$ 对应行
4. **外积求和：** $C = \sum_k (\text{col}_k A)(\text{row}_k B)$（列 $\times$ 行，得秩一矩阵再求和）

**运算律：**
- 结合律：$(AB)C = A(BC)$
- 分配律：$(A+B)C = AC + BC$
- **不满足交换律**：一般 $AB \neq BA$
- $AI = A$，$A0 = 0$
- 方幂：$A^0 = I_n,\ A^k = A^{k-1}A$

**特殊变换矩阵（左乘）：**
- **置换矩阵（Permutation Matrix）：** 每行每列恰有一个 $1$，用于交换行
- **初等矩阵（Elementary Matrices）：**
  - 交换两行的置换矩阵
  - 将 $I_n$ 的 $(i,j)$ 替换为 $l$：把第 $j$ 行乘 $l$ 加到第 $i$ 行
  - 将 $I_n$ 的 $(i,i)$ 替换为 $k$：把第 $i$ 行乘 $k$

> **【左行右列】**：左乘 → 行变换，右乘 → 列变换

### 1.5 Triangular Factors and Row Exchanges

**LU 分解：** 若 $A$ 消元后（无需行交换）得 $U$，则
$$A = LU$$

- $L$：下三角矩阵，对角元为 $1$。$l_{ij}$ 记录消元乘子（$E_i \leftarrow E_i - l_{ij}E_j$）
- $U$：上三角矩阵，对角元为主元

**需要行交换时：**
$$PA = LU$$

其中 $P$ 为置换矩阵。

**利用 LU 解方程 $A\mathbf{x} = \mathbf{b}$：**
$$\begin{cases} L\mathbf{c} = \mathbf{b} \\ U\mathbf{x} = \mathbf{c} \end{cases}$$

两个都是三角方程组，直接回代。

> **LU 分解唯一性：** 若 $A = L_1U_1 = L_2U_2$，且 $L_1, L_2$ 对角元均为 $1$，则 $L_1 = L_2,\ U_1 = U_2$。

**LDU 分解：** 提取主元到对角矩阵 $D$，使 $L, U$ 对角元都为 $1$：$A = LDU$

### 1.6 Inverses and Transposes

**矩阵的逆：** 方阵 $A$ 的逆 $A^{-1}$ 满足 $AA^{-1} = A^{-1}A = I$

**性质：**
- 逆若存在则唯一：若 $AB_1 = B_1A = I$ 且 $AB_2 = B_2A = I$，则 $B_1 = B_1(AB_2) = (B_1A)B_2 = B_2$
- $(AB)^{-1} = B^{-1}A^{-1}$
- $(A_1 \cdots A_n)^{-1} = A_n^{-1} \cdots A_1^{-1}$
- $(A^{-1})^T = (A^T)^{-1}$

**转置：** $A^T$ 满足 $(A^T)_{ij} = A_{ji}$
- $(A^T)^T = A,\quad (kA)^T = kA^T$
- $(A+B)^T = A^T + B^T$
- $(AB)^T = B^T A^T$

**对称矩阵：** $A^T = A$
- 对称矩阵的逆仍对称
- $RR^T$ 是对称矩阵
- 若 $A^T = A$ 可无行交换分解为 $LDU$，则 $L^T = U$，即 $A = LDL^T$

**左/右逆（对 $m\times n$ 矩阵）：**
- 右逆存在 $\iff$ $r = m$（行满秩，$C(A) = \mathbb{R}^m$）
- 左逆存在 $\iff$ $r = n$（列满秩，$C(A^T) = \mathbb{R}^n$）
- 可逆 $\iff$ $r = m = n$
- 最佳左逆：$(A^TA)^{-1}A^T$；最佳右逆：$A^T(AA^T)^{-1}$

**高斯-约旦法求逆：**
$$[A \mid I] \xrightarrow{\text{行变换}} [I \mid A^{-1}]$$

> 解释：一系列行变换的复合 $T$ 使 $TA = I$，则 $TI = T = A^{-1}$

**可逆的等价条件（TFAE）：**
- $A$ 可逆
- $A$ 有完整的主元集（$n$ 个非零主元）
- $A$ 非奇异
- $A\mathbf{x} = \mathbf{0}$ 仅有零解
- $\text{rank}(A) = n$
- $N(A) = \{0\}$
- $A$ 的列/行线性无关
- $\det(A) \neq 0$

**二阶矩阵求逆：**
$$A^{-1} = \frac{1}{ad-bc}\begin{bmatrix} d & -b \\ -c & a \end{bmatrix}$$

**分块矩阵乘法：**
- $A = \begin{bmatrix} \mathbf{a}_1 \\ \vdots \\ \mathbf{a}_n \end{bmatrix}$（按行分块），$B = [\mathbf{b}_1 \cdots \mathbf{b}_n]$（按列分块）
- $AB = [A\mathbf{b}_1 \cdots A\mathbf{b}_n] = \begin{bmatrix} \mathbf{a}_1 B \\ \vdots \\ \mathbf{a}_n B \end{bmatrix}$
- **注意分块尺寸必须可乘**

### 1.7 Special Matrices and Applications（不考）

---

## 2 Vector Spaces

### 2.1 Vector Spaces and Subspaces

向量空间 $(V, +, \cdot)$ 满足 8 条性质（加法交换/结合/零元/负元 + 数乘结合/分配/单位元）。向量不限于 $\mathbb{R}^n$ 的数字列向量——矩阵、函数等只要能做线性组合即可。

**向量空间的性质：**
- $0\cdot \mathbf{x} = \mathbf{0}$
- $(-1)\cdot \mathbf{x} = -\mathbf{x}$
- $\mathbf{x}+\mathbf{y} = \mathbf{x}+\mathbf{z} \implies \mathbf{y}=\mathbf{z}$
- $\beta \cdot \mathbf{0} = \mathbf{0}$
- $\alpha \cdot \mathbf{x} = \mathbf{0} \implies \alpha=0$ 或 $\mathbf{x}=\mathbf{0}$

**子空间 $W \subseteq V$：**
1. 加法封闭：$\mathbf{x}, \mathbf{y} \in W \implies \mathbf{x}+\mathbf{y} \in W$
2. 数乘封闭：$\mathbf{x} \in W,\ c\in\mathbb{R} \implies c\mathbf{x} \in W$

> $\mathbb{R}^3$ 的子空间只有：$\{\mathbf{0}\}$、过原点的直线、过原点的平面、$\mathbb{R}^3$ 本身

### 2.2 Solving $A\mathbf{x} = \mathbf{0}$ and $A\mathbf{x} = \mathbf{b}$

**齐次方程 $A\mathbf{x} = \mathbf{0}$：**
- 化为行最简形（Reduced Row Echelon Form）$R\mathbf{x} = \mathbf{0}$：主元为 $1$，主元列其余为 $0$
- 分主元变量和自由变量（共 $n-r$ 个）
- 依次令一个自由变量为 $1$、其余为 $0$，得 $n-r$ 个特解
- 全部解 = 这些特解的线性组合 = $N(A)$（零空间）

**非齐次方程 $A\mathbf{x} = \mathbf{b}$（$\mathbf{b} \neq \mathbf{0}$）：**
- $A\mathbf{x}=\mathbf{b} \to U\mathbf{x}=\mathbf{c} \to R\mathbf{x}=\mathbf{d}$
- $A$ 的秩 $r$ = 主元个数。$U$ 和 $R$ 的最后 $m-r$ 行全为零
- **有解条件：** $\mathbf{d}$（和 $\mathbf{c}$）的最后 $m-r$ 个分量为 $0$（共 $m-r$ 个条件）
- **通解：** $\mathbf{x} = \mathbf{x}_p + \mathbf{x}_n$
  - $\mathbf{x}_p$：令所有自由变量为 $0$ 的特解
  - $\mathbf{x}_n \in N(A)$：解 $A\mathbf{x}=0$ 将自由变量依次置 $1$ 得到的 $n-r$ 个特解的线性组合

### 2.3 Linear Independence, Basis, and Dimension

**线性无关（Linearly Independent）：**
$$c_1\mathbf{v}_1 + \cdots + c_n\mathbf{v}_n = \mathbf{0} \iff c_1 = \cdots = c_n = 0$$

- 线性相关 $\iff$ 存在某个向量可表示为其余向量的线性组合
- 零向量与任何向量线性相关
- 行阶梯矩阵的非零行之间线性无关
- $\mathbb{R}^m$ 中任意 $n > m$ 个向量必线性相关

**判断方法：** $[\mathbf{v}_1 \cdots \mathbf{v}_n]\mathbf{x} = \mathbf{0}$ 是否仅有零解。$A$ 的列线性无关 $\iff$ $N(A) = \{\mathbf{0}\}$。

**秩（Rank）：**
- $r = \text{rank}(A)$ = 主元个数 = 极大线性无关行数/列数
- $r \leq \min(m, n)$
- $r(AB) \leq \min(r(A), r(B))$
- 若 $P$ 可逆，则 $r(PA) = r(AP) = r(A)$

**秩一矩阵（Rank 1 Matrix）：** $\dim C(A) = 1$，可分解为列向量 $\times$ 行向量

**秩不等式：**
- $r(A) + r(B) - n \leq r(AB) \leq \min(r(A), r(B))$
- 若 $AB = O$，则 $C(B) \subseteq N(A)$，故 $r(A) + r(B) \leq n$
- $r(A^TA) = r(A)$
- $r(A+B) \leq r(A) + r(B)$
- $A\mathbf{x}=\mathbf{b}$ 有解 $\iff$ $r(A) = r([A \mid \mathbf{b}])$

**基（Basis）与维数（Dimension）：**
- $V$ 的一组基 $=$ 一组线性无关且张成 $V$ 的向量
- $\dim V = n$（所有基大小相同）
- **定理：** $\mathbf{v}_1,\dots,\mathbf{v}_n \in \mathbb{R}^n$ 是 $\mathbb{R}^n$ 的基 $\iff$ $[\mathbf{v}_1 \cdots \mathbf{v}_n]$ 可逆
- 多项式空间 $\mathbb{R}[x]_{\leq n}$ 的一组基：$1, x, x^2, \dots, x^n$

### 2.4 The Four Fundamental Subspaces

对 $m\times n$ 矩阵 $A$：

| 子空间 | 记号 | 所在空间 | 维数 |
|--------|------|----------|------|
| 列空间（Column Space） | $C(A)$ | $\mathbb{R}^m$ | $r$ |
| 零空间/核（Nullspace/Kernel） | $N(A)$ | $\mathbb{R}^n$ | $n-r$ |
| 行空间（Row Space） | $C(A^T)$ | $\mathbb{R}^n$ | $r$ |
| 左零空间（Left Nullspace） | $N(A^T)$ | $\mathbb{R}^m$ | $m-r$ |

**秩-零化度定理：** $\text{rank}(A) + \dim N(A) = n$

**正交关系：**
$$C(A) \perp N(A^T), \quad C(A^T) \perp N(A)$$

**高斯-约旦消元法求四大子空间：** $[A \mid I] \to [R \mid E]$

| 子空间 | 维数 | 提取方法 |
|--------|------|----------|
| 行空间 $C(A^T)$ | $r$ | 取 $R$ 的 $r$ 个非零行 |
| 列空间 $C(A)$ | $r$ | 找 $R$ 的主元列，取**原矩阵 $A$** 中对应的列 |
| 零空间 $N(A)$ | $n-r$ | 解 $R\mathbf{x} = \mathbf{0}$，令自由变量依次为 $1$ 得基础解系 |
| 左零空间 $N(A^T)$ | $m-r$ | 取 $E$ 中 $R$ 全零行对应位置的行（或 $L^{-1}$ 的最后 $m-r$ 行） |

> 行变换**不改变**行空间（$C(A^T) = C(U^T)$），但**改变**列空间。主元列的**列标**不变，但列向量本身变了。

### 2.5 Graphs and Networks（不考）

### 2.6 Linear Transformations

**定义：** $T: V \to W$ 是线性变换，若满足：
$$T(\mathbf{a}+\mathbf{b}) = T(\mathbf{a}) + T(\mathbf{b}), \quad T(k\mathbf{a}) = kT(\mathbf{a})$$

**矩阵表示：** 选 $V$ 的基 $\{\alpha_1,\dots,\alpha_n\}$ 和 $W$ 的基 $\{\beta_1,\dots,\beta_m\}$：
$$T(\alpha_j) = \sum_{i=1}^m a_{ij} \beta_i$$

矩阵 $A = [a_{ij}]_{m\times n}$ 就是 $T$ 在选定的基下的矩阵表示（第 $j$ 列 = $T(\alpha_j)$ 在 $\beta$ 基下的坐标）：
$$T(\alpha_1,\dots,\alpha_n) = (\beta_1,\dots,\beta_m) A$$

**坐标映射：** 若 $\mathbf{v}$ 在 $\alpha$ 基下坐标为 $\mathbf{x}$，则 $T(\mathbf{v})$ 在 $\beta$ 基下的坐标为 $\mathbf{y} = A\mathbf{x}$

**常见 $\mathbb{R}^2$ 上的线性变换：**

| 变换 | 矩阵 |
|------|------|
| 逆时针旋转 $\theta$ | $\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}$ |
| 投影到 $\mathbf{v}=(\cos\theta,\sin\theta)$ | $\begin{bmatrix} \cos^2\theta & \cos\theta\sin\theta \\ \cos\theta\sin\theta & \sin^2\theta \end{bmatrix}$ |
| 关于 $\mathbf{v}=(\cos\theta,\sin\theta)$ 反射 | $\begin{bmatrix} \cos 2\theta & \sin 2\theta \\ \sin 2\theta & -\cos 2\theta \end{bmatrix}$ |

> 反射矩阵 = $2 \times$ 投影矩阵 $- I$（因为 $R(\mathbf{v}) + \mathbf{v} = 2P(\mathbf{v})$）

**基变换（Change of Basis）：** $T: V \to V$ 在基 $\{\mathbf{v}_i\}$ 下矩阵为 $A$，在基 $\{\mathbf{w}_i\}$ 下矩阵为 $B$，且
$$[\mathbf{w}_1 \cdots \mathbf{w}_n] = [\mathbf{v}_1 \cdots \mathbf{v}_n] S$$

则：
$$B = S^{-1} A S$$

**理解：** $\mathbf{w}$ 基下的坐标 $\mathbf{x}$ 对应 $\mathbf{v}$ 基下的坐标 $S\mathbf{x}$。在 $\mathbf{w}$ 基下：$\mathbf{y} = B\mathbf{x}$；翻译到 $\mathbf{v}$ 基：$S\mathbf{y} = A(S\mathbf{x})$。对比即得 $B = S^{-1}AS$。

---

## 3 Orthogonality

### 3.1 Orthogonal Vectors and Subspaces

- **内积/点乘：** $\mathbf{u}^T\mathbf{v} = \sum u_i v_i$
- **正交：** $\mathbf{u}^T\mathbf{v} = 0$
- **长度（范数）：** $\|\mathbf{x}\| = \sqrt{\mathbf{x}^T\mathbf{x}}$
- **夹角：** $\cos\theta = \frac{\mathbf{x}^T\mathbf{y}}{\|\mathbf{x}\|\|\mathbf{y}\|}$

**柯西-施瓦茨不等式（Cauchy-Schwarz）：**
$$|\mathbf{x}\cdot\mathbf{y}|^2 \leq \|\mathbf{x}\|^2 \|\mathbf{y}\|^2$$

（与 $\cos\theta$ 定义统一，因 $|\cos\theta| \leq 1$）

**定理：** 相互正交的非零向量组必线性无关。

**子空间的正交：** $V \perp W$ 若 $\forall v\in V, w\in W,\ v^T w = 0$

**正交补（Orthogonal Complement）：** $V^\perp = \{\mathbf{v} \mid \mathbf{v} \perp V\}$，且 $\dim V + \dim V^\perp = n$

**基本正交关系：**
$$C(A) \perp N(A^T), \quad C(A^T) \perp N(A)$$
$$C(A)^\perp = N(A^T), \quad C(A^T)^\perp = N(A)$$

- 证明 $C(A) \perp N(A^T)$：$\mathbf{b} \in C(A) \implies \exists \mathbf{x}, A\mathbf{x}=\mathbf{b}$；$\mathbf{y} \in N(A^T) \implies \mathbf{y}^T A = 0$。则 $\mathbf{y}^T \mathbf{b} = \mathbf{y}^T(A\mathbf{x}) = (\mathbf{y}^T A)\mathbf{x} = 0$
- 推论：$A\mathbf{x} = \mathbf{b}$ 相容的等价条件：$\mathbf{y}^T\mathbf{b} = 0,\ \forall \mathbf{y} \in N(A^T)$

**几何意义：** $A$ 将行空间 $C(A^T)$ 一一映射到列空间 $C(A)$，将零空间 $N(A)$ 映射到 $\mathbf{0}$。任意 $\mathbf{x} = \mathbf{x}_r + \mathbf{x}_n$（$\mathbf{x}_r \in C(A^T), \mathbf{x}_n \in N(A)$），$A\mathbf{x} = A\mathbf{x}_r$。

### 3.2 Cosines and Projections onto Lines

**向量 $\mathbf{b}$ 在向量 $\mathbf{a}$ 上的投影：**
$$\mathbf{p} = \|\mathbf{b}\|\cos\theta \cdot \frac{\mathbf{a}}{\|\mathbf{a}\|} = \frac{\mathbf{a}^T\mathbf{b}}{\mathbf{a}^T\mathbf{a}} \mathbf{a}$$

**投影矩阵：**
$$P = \frac{\mathbf{a}\mathbf{a}^T}{\mathbf{a}^T\mathbf{a}}$$

- $P$ 是对称的秩一矩阵
- $P^2 = P$（投影两次等于投影一次）

### 3.3 Projections and Least Squares

**最小二乘问题：** 求 $\min \|A\mathbf{x} - \mathbf{b}\|^2$

即最小化 $\sum_{i=1}^m (a_{i1}x_1 + \cdots + a_{in}x_n - b_i)^2$

**几何推导：** $A\mathbf{x}$ 落在 $C(A)$ 中。要使 $\|A\mathbf{x} - \mathbf{b}\|$ 最小，需 $\mathbf{b} - A\hat{\mathbf{x}} \perp C(A)$，即 $\mathbf{b} - A\hat{\mathbf{x}} \in C(A)^\perp = N(A^T)$。

$$A^T(\mathbf{b} - A\hat{\mathbf{x}}) = \mathbf{0} \implies A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$$

**法方程（Normal Equation）：** $A^TA\hat{\mathbf{x}} = A^T\mathbf{b}$

- 法方程始终有解（几何直观保证 + 可证 $r(A^TA) = r([A^TA \mid A^T\mathbf{b}])$）
- 若 $A$ 列满秩（$A^TA$ 可逆）：$\hat{\mathbf{x}} = (A^TA)^{-1}A^T\mathbf{b}$
- 若 $A$ 可逆：$\hat{\mathbf{x}} = A^{-1}\mathbf{b}$

**投影到 $C(A)$：**
$$\mathbf{p} = A\hat{\mathbf{x}} = A(A^TA)^{-1}A^T\mathbf{b}$$

**投影矩阵（Projection Matrix）：**
$$P = A(A^TA)^{-1}A^T$$

- $P^2 = P$（两次投影等于一次）
- $P^T = P$（对称）
- 任何满足 $P^2 = P$ 且 $P^T = P$ 的矩阵都是投影到 $C(P)$ 的投影矩阵
- $I - P$ 也是投影矩阵，投影到 $C(A)^\perp = N(A^T)$

**应用——线性回归（$n=2$）：** 求直线 $b = C + Dt$ 最小化 $\sum (C + Dt_i - b_i)^2$

- $A = \begin{bmatrix}1 & t_1 \\ \vdots & \vdots \\ 1 & t_m\end{bmatrix},\ \mathbf{b} = \begin{bmatrix}b_1 \\ \vdots \\ b_m\end{bmatrix}$，解 $A^TA\begin{bmatrix}C \\ D\end{bmatrix} = A^T\mathbf{b}$
- 技巧：先中心化 $t$——令 $b = C_1 + D_1(t - \bar{t})$，则 $A$ 的两列正交
- 此时 $\hat{C}_1 = \frac{\mathbf{v}_1^T\mathbf{b}}{\mathbf{v}_1^T\mathbf{v}_1},\ \hat{D}_1 = \frac{\mathbf{v}_2^T\mathbf{b}}{\mathbf{v}_2^T\mathbf{v}_2}$，原参数 $C = C_1 - D_1\bar{t},\ D = D_1$

**加权最小二乘（Weighted Least Squares）：** $\min \sum w_i^2(a_{i1}x_1 + \cdots - b_i)^2$

- 构造对角权矩阵 $W = \text{diag}(w_1,\dots,w_n)$，化为 $\min \|WA\hat{\mathbf{x}} - W\mathbf{b}\|^2$
- 法方程：$A^T(W^TW)A\hat{\mathbf{x}} = A^T(W^TW)\mathbf{b}$

### 3.4 Orthogonal Bases and Gram-Schmidt

**规范正交基（Orthonormal Basis）：**
$$q_i^T q_j = \begin{cases} 1 & i=j \\ 0 & i\neq j \end{cases}$$

**正交矩阵（方阵）：** $Q^T Q = I$
- $Q^{-1} = Q^T$（逆极易求）
- $\|Q\mathbf{x}\| = \|\mathbf{x}\|$（保长度）
- $(Q\mathbf{x})^T(Q\mathbf{y}) = \mathbf{x}^T\mathbf{y}$（保内积/保角）
- $Q^T$ 也是正交矩阵（行也正交）

**正交基/正交矩阵的好处：**
- 坐标易求：$\mathbf{b} = \sum x_i q_i \implies x_i = q_i^T\mathbf{b}$
- 方程易解：$Q\mathbf{x} = \mathbf{b} \implies \mathbf{x} = Q^T\mathbf{b}$
- 向量分解即投影：$\mathbf{b} = \sum (q_i^T\mathbf{b}) q_i$
- 长度好求：$\|\mathbf{b}\| = \sqrt{\sum (q_i^T\mathbf{b})^2}$

**半正交矩阵（列规范正交但不一定是方阵）：**
- 投影到 $C(Q)$：$P = Q(Q^TQ)^{-1}Q^T = QQ^T = \sum q_i q_i^T$
- 最小二乘解 $Q\mathbf{x} = \mathbf{b}$：$\hat{\mathbf{x}} = Q^T\mathbf{b}$

**Householder 变换（反射变换）：** 将向量关于法向量 $\mathbf{v}$ 的超平面作反射
$$H = I - 2\frac{\mathbf{v}\mathbf{v}^T}{\mathbf{v}^T\mathbf{v}}$$

- $H^2 = I$（对合），$H^T = H$（对称），$H^T H = I$（正交）
- 用途：将向量某些分量置零而保持长度不变
- 例：找 $A^2 = I$ 且第一列为单位向量 $\mathbf{u}$ 的对称矩阵——取 $A$ 为 Householder 矩阵，法向量 $\mathbf{v} = \mathbf{e}_1 - \mathbf{u}$

**Gram-Schmidt 正交化：** 从基 $\{a_1, a_2, \dots, a_n\}$ 构造规范正交基 $\{q_1, q_2, \dots, q_n\}$

$$q_1 = \frac{a_1}{\|a_1\|}$$
$$A_{j+1} = a_{j+1} - \sum_{i=1}^{j} (q_i^T a_{j+1}) q_i$$
$$q_{j+1} = \frac{A_{j+1}}{\|A_{j+1}\|}$$

> 也可以先不单位化到最后再做，计算更简单。

**QR 分解：**
$$A = QR$$

- $A$：列线性无关的 $m\times n$ 矩阵
- $Q$：$m\times n$ 矩阵，列规范正交
- $R$：$n\times n$ 可逆上三角矩阵，$R_{ij} = q_i^T a_j$（$i \leq j$）

**构造方式：**
$$\begin{align}
a_1 &= (q_1^T a_1) q_1 \\
a_2 &= (q_1^T a_2) q_1 + (q_2^T a_2) q_2 \\
&\vdots \\
a_n &= \sum_{i=1}^n (q_i^T a_n) q_i
\end{align}$$
$$R = \begin{bmatrix}
q_1^T a_1 & q_1^T a_2 & \dots & q_1^T a_n \\
0 & q_2^T a_2 & \dots & q_2^T a_n \\
\vdots & \vdots & \ddots & \vdots \\
0 & 0 & \dots & q_n^T a_n
\end{bmatrix} = Q^T A$$

> 若 $m=n$（$A$ 可逆）：任何可逆矩阵可分解为正交矩阵 $\times$ 上三角矩阵。

**利用 QR 解最小二乘：**
$$A^TA\hat{\mathbf{x}} = A^T\mathbf{b} \implies R^TR\hat{\mathbf{x}} = R^TQ^T\mathbf{b} \implies R\hat{\mathbf{x}} = Q^T\mathbf{b}$$

直接回代，无需解法方程。

**抽象内积空间：** 内积 $\langle\cdot,\cdot\rangle: V\times V\to\mathbb{R}$ 需满足：
1. 对称性：$\langle v,w\rangle = \langle w,v\rangle$
2. 双线性
3. 正定性：$\langle v,v\rangle \geq 0$，且 $v=0 \iff \langle v,v\rangle = 0$

例——函数拟合：定义 $\langle f,g\rangle = \int_0^1 f(t)g(t)dt$，用 Gram-Schmidt 找 $\{1, t\}$ 的正交基 $\{1, t-\frac{1}{2}\}$，则可直接投影。

### 3.5 The Fast Fourier Transform（不考）

---

## 4 Determinants

### 4.1 Introduction

（二维、三维上，行列式是有向面积/体积。高维行列式从性质出发定义。）

### 4.2 Properties of the Determinant

**定义性质：**
1. $\det(I) = 1$
2. 若 $A$ 有两行相同，则 $\det(A) = 0$
3. $\det(A)$ 线性依赖于每一行

**推导性质：**
- 交换两行 → 行列式变号：$\det(P_{ij}A) = -\det(A)$
- 初等行变换（一行的倍数加到另一行）→ 行列式不变
- 三角矩阵的行列式 = 对角元之积：$\det(A) = \prod a_{ii}$
- $A$ 奇异 $\iff$ $\det(A) = 0$；$A$ 可逆 $\iff$ $\det(A) \neq 0$
- **乘积公式：** $\det(AB) = \det(A)\det(B)$
  - 证明：若 $B$ 奇异，$AB$ 也奇异，均为 $0$。若 $B$ 可逆，验证 $d(A) = \frac{\det(AB)}{\det(B)}$ 满足三条定义性质，故 $d(A) = \det(A)$。
- **转置不变：** $\det(A) = \det(A^T)$
  - 证明：利用 $PA = LU$，转置后 $\det(P) = \det(P^T)$，三角矩阵转置行列式不变。
- $\det(A) = \pm (\text{主元之积})$（由 $LU$ 分解）

> 注意：一般 $\det(A+B) \neq \det(A)+\det(B)$；$\det(cA) = c^n\det(A)$

**几何意义（$A = QR$）：** $\det(A) = \det(Q)\det(R) = \pm \prod q_i^T a_i$，相当于"底 $\times$ 高 $\times$ 高 $\times \cdots$"，即高维体积。

### 4.3 Formulas for the Determinant

**大公式（Big Formula）：**
$$\det(A) = \sum_{(\alpha_1,\dots,\alpha_n)} a_{1\alpha_1}a_{2\alpha_2}\cdots a_{n\alpha_n} \cdot (-1)^{\text{inv}(\alpha)}$$

遍历 $(1,2,\dots,n)$ 的所有排列 $\alpha$。$\text{inv}(\alpha)$ = 排列的逆序数（$i<j$ 但 $\alpha_i>\alpha_j$ 的对数）。

> 计算量 $O(n!)$，实际用 $PA = LU$。

**代数余子式（Cofactor）：**
- 余子式 $M_{ij}$：删去第 $i$ 行第 $j$ 列后的 $(n-1)\times(n-1)$ 行列式
- 代数余子式 $C_{ij} = (-1)^{i+j} M_{ij}$

**拉普拉斯展开（第 $i$ 行）：**
$$\det(A) = \sum_{j=1}^n a_{ij} C_{ij}$$

同理可对第 $j$ 列展开：$\det(A) = \sum_{i=1}^n a_{ij} C_{ij}$

（由大公式固定展开行/列即得）

### 4.4 Applications of Determinants

**用行列式求逆：**
$$A^{-1} = \frac{C^T}{\det(A)}$$

其中 $C$ 是代数余子式矩阵（$C_{ij} = (-1)^{i+j}M_{ij}$）。

**证明：** 需证 $AC^T = \det(A)I$：
- $(AC^T)_{ii} = \sum a_{ik}C_{ik} = \det(A)$（第 $i$ 行展开）
- $(AC^T)_{ij} = \sum a_{ik}C_{jk} = 0$（$i\neq j$，相当于将第 $j$ 行"替换"为第 $i$ 行的矩阵的行列式，该矩阵有两行相同，故为 $0$）

**克莱姆法则（Cramer's Rule）：** $A\mathbf{x}=\mathbf{b}$ 的解
$$x_j = \frac{\det(B_j)}{\det(A)}$$

其中 $B_j$ 是将 $A$ 的第 $j$ 列替换为 $\mathbf{b}$ 得到的矩阵。

**推导：** $\mathbf{x} = A^{-1}\mathbf{b} = \frac{C^T}{\det(A)}\mathbf{b}$，$(C^T\mathbf{b})_j = \sum_i C_{ij}b_i = \det(B_j)$（按第 $j$ 列展开）。

**用行列式求主元：**
$$d_k = \frac{\det(A_k)}{\det(A_{k-1})}$$

其中 $A_k$ 是 $A$ 左上角 $k\times k$ 子矩阵（假设 $\det(A) \neq 0$）。

**证明：** $A = LDU$，则 $A_k = L_k D_k U_k$，故 $\det(A_k) = d_1 d_2 \cdots d_k$，相除即得。

---

## 5 Eigenvalues and Eigenvectors

### 5.1 Introduction

**定义：** $A\mathbf{x} = \lambda \mathbf{x}$（$\mathbf{x} \neq \mathbf{0}$）
- $\lambda$：特征值（Eigenvalue）
- $\mathbf{x}$：$\lambda$ 对应的特征向量（Eigenvector）
- 特征空间（Eigenspace）：$N(A - \lambda I)$

**求法：**
1. 解特征方程 $\det(A - \lambda I) = 0$ 得 $\lambda$
2. 对每个 $\lambda_i$，解 $(A - \lambda_i I)\mathbf{x} = \mathbf{0}$ 得特征向量

**几何意义：** 经过 $A$ 代表的线性变换后，与原向量共线的向量。

**迹与行列式：** 由韦达定理考察 $\lambda^{n-1}$ 和 $\lambda^0$ 系数：
$$\sum_{i=1}^n \lambda_i = \text{tr}(A) = \sum a_{ii}$$
$$\prod_{i=1}^n \lambda_i = \det(A)$$

### 5.2 Diagonalization of a Matrix

若 $A$ 有 $n$ 个线性无关的特征向量 $\mathbf{v}_1, \dots, \mathbf{v}_n$：
$$A = S\Lambda S^{-1}$$

- $S = [\mathbf{v}_1 \cdots \mathbf{v}_n]$（特征向量矩阵）
- $\Lambda = \text{diag}(\lambda_1, \dots, \lambda_n)$（特征值矩阵）

**几何意义：** $S$ 相当于基变换矩阵。在以特征向量为基的坐标系中，线性变换只是沿各坐标轴按相应特征值伸缩。

**可对角化条件：**
- $A$ 可对角化 $\iff$ $A$ 有 $n$ 个线性无关的特征向量
- $\impliedby$ $A$ 有 $n$ 个互异的特征值（充分非必要）

**定理：若特征向量对应的特征值互异，则这些特征向量线性无关。**
- 归纳法：假设 $\sum c_i \mathbf{x}_i = \mathbf{0}$，左乘 $(A - \lambda_j I)$ 消去第 $j$ 项，化归为 $k-1$ 个向量的情况。
- 或利用多项式：令 $f(x) = \prod_{i\neq j} (x - \lambda_i)$，左乘 $f(A)$ 得 $c_j = 0$。

**幂的计算：** $A^k = S\Lambda^k S^{-1}$（$\Lambda^k = \text{diag}(\lambda_1^k, \dots, \lambda_n^k)$）

**多项式定理：** 若 $f(x) = a_n x^n + \cdots + a_0$，且 $A\mathbf{x} = \lambda\mathbf{x}$，则
$$f(A)\mathbf{x} = f(\lambda)\mathbf{x}$$

即 $\mathbf{x}$ 也是 $f(A)$ 的特征向量，对应特征值 $f(\lambda)$。

**同时对角化定理：** 若 $A, B$ 均可对角化，则
$$AB = BA \iff A, B \text{ 共享特征向量矩阵 } S$$

此时 $AB$ 的特征向量同 $S$，特征值 = $\lambda_i^A \lambda_i^B$。

**$AB$ 与 $BA$ 的特征值关系：** 非零特征值始终相同。若均为 $n\times n$，特征多项式相同：
$$\lambda^n|AB - \lambda I_n| = \lambda^m|BA - \lambda I_m|$$

（$A$ 为 $m\times n$，$B$ 为 $n\times m$）

**秩一矩阵的特征值：** 必有 $n-1$ 个特征值为 $0$（$N(A)$ 有 $n-1$ 维）。

### 5.3 Difference Equations and Powers $A^k$

**递推数列 $u_{k+1} = A u_k$ 解法：**

若 $u_0 = c_1\mathbf{x}_1 + \cdots + c_n\mathbf{x}_n$（$\mathbf{x}_i$ 为特征向量，特征值 $\lambda_i$），则：
$$u_k = A^k u_0 = \sum c_i \lambda_i^k \mathbf{x}_i$$

**步骤：** 将 $u_0$ 用特征向量为基展开，矩阵的幂次直接变成特征值的幂次。

**斐波那契数列：** $F_0 = 0, F_1 = 1, F_{n+2} = F_{n+1} + F_n$

$$\begin{bmatrix} F_{n+1} \\ F_n \end{bmatrix} = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}^n \begin{bmatrix} 1 \\ 0 \end{bmatrix}$$

对角化 $A = \begin{bmatrix} 1 & 1 \\ 1 & 0 \end{bmatrix}$，特征值 $\lambda_{1,2} = \frac{1\pm\sqrt{5}}{2}$，得：
$$F_n = \frac{1}{\sqrt{5}}\left( \left(\frac{1+\sqrt{5}}{2}\right)^n - \left(\frac{1-\sqrt{5}}{2}\right)^n \right)$$

**一般差分方程通用解法：** 构造 $u_{k+1} = A u_k$，对角化 $A$，展开 $u_0$，即可得通项。

**Markov 矩阵：**
- 定义：$a_{ij} \geq 0$，且每列之和为 $1$
- 性质：
  - 必有特征值 $1$（因为 $\mathbf{1}^T A = \mathbf{1}^T$，故 $\mathbf{1}$ 是 $A^T$ 的特征向量，$A$ 与 $A^T$ 特征方程相同）
  - 存在特征值 $1$ 对应的特征向量各分量均非负
  - 其余特征值 $|\lambda_i| \leq 1$
  - 若所有 $a_{ij} > 0$，则其余 $|\lambda_i| < 1$

### 5.4 Differential Equations and $e^{At}$（不考）

### 5.5 Complex Matrices

**复向量空间 $\mathbb{C}^n$：** 分量 $x_i \in \mathbb{C}$，共轭 $\bar{\mathbf{x}}$。内积定义为：
$$\langle \mathbf{x}, \mathbf{y} \rangle = \bar{\mathbf{x}}^T \mathbf{y} = \overline{x_1}y_1 + \cdots + \overline{x_n}y_n$$

长度：$\|\mathbf{x}\|^2 = \bar{\mathbf{x}}^T\mathbf{x} = \sum |x_i|^2$

**共轭转置（Conjugate Transpose / Hermitian Transpose）：**
$$A^H = \bar{A}^T = \overline{A^T}$$
性质：$(AB)^H = B^H A^H$

---

**埃尔米特矩阵（Hermitian）：** $A^H = A$
- 方阵，对角元为实数（$\bar{a}_{ii} = a_{ii}$）
- 实对称矩阵是 Hermitian 的特例
- **特征值全为实数**
  - 证明：$A\mathbf{x} = \lambda\mathbf{x} \implies \mathbf{x}^H A\mathbf{x} = \lambda \|\mathbf{x}\|^2$，又 $(\mathbf{x}^H A\mathbf{x})^H = \mathbf{x}^H A^H \mathbf{x} = \mathbf{x}^H A\mathbf{x}$，故 $\mathbf{x}^H A\mathbf{x} \in \mathbb{R}$，故 $\lambda \in \mathbb{R}$
- **不同特征值的特征向量正交**
  - 证明：$(A\mathbf{x})^H \mathbf{y} = \lambda (\mathbf{x}^H \mathbf{y}) = \mathbf{x}^H A^H \mathbf{y} = \mathbf{x}^H A\mathbf{y} = \mu(\mathbf{x}^H \mathbf{y})$，若 $\lambda \neq \mu$ 则 $\mathbf{x}^H \mathbf{y} = 0$

**酉矩阵（Unitary）：** $U^H U = I$
- 保内积：$(U\mathbf{x})^H(U\mathbf{y}) = \mathbf{x}^H \mathbf{y}$
- **特征值满足 $|\lambda| = 1$**
  - 证明：$\|U\mathbf{x}\|^2 = \mathbf{x}^H U^H U\mathbf{x} = \mathbf{x}^H \mathbf{x} = \|\mathbf{x}\|^2$，又 $= |\lambda|^2 \|\mathbf{x}\|^2 \implies |\lambda| = 1$
- **不同特征值的特征向量正交**

**斜埃尔米特矩阵（Skew-Hermitian）：** $K^H = -K$
- 对角元为纯虚数（$a-bi = -(a+bi) \implies a=0$）
- **特征值全为纯虚数**
  - 证明：$iK$ 是 Hermitian 矩阵，$(iK)\mathbf{x} = \lambda\mathbf{x},\ \lambda\in\mathbb{R} \implies K\mathbf{x} = -i\lambda\mathbf{x}$
- **不同特征值的特征向量正交**
- 若 $K$ 为实矩阵，则为反对称矩阵（Skew-Symmetric）：$K^T = -K$，对角元为 $0$

---

| 实矩阵 | 复矩阵 |
|--------|--------|
| $\|\mathbf{x}\|^2 = \sum x_i^2$ | $\|\mathbf{x}\|^2 = \sum \|x_i\|^2$ |
| 内积 $\mathbf{x}^T\mathbf{y}$ | 内积 $\mathbf{x}^H\mathbf{y}$ |
| 转置 $A^T$ | 共轭转置 $A^H$ |
| $(AB)^T = B^T A^T$ | $(AB)^H = B^H A^H$ |
| 对称 $A = A^T$ | Hermitian $A = A^H$ |
| 对称对角化 $A = Q\Lambda Q^T$ | Hermitian 对角化 $A = U\Lambda U^H$ |
| 正交 $Q^T Q = I$ | 酉 $U^H U = I$ |
| 斜对称 $A^T = -A$ | 斜 Hermitian $A^H = -A$ |

### 5.6 Similarity Transformations

**相似矩阵：** $A \sim B$ 若 $\exists$ 可逆 $M$ 使得 $B = M^{-1}AM$

- 相似矩阵有相同的特征值：$\det(B - \lambda I) = \det(M^{-1}(A-\lambda I)M) = \det(A-\lambda I)$
- $A\mathbf{x} = \lambda\mathbf{x} \implies B(M^{-1}\mathbf{x}) = \lambda(M^{-1}\mathbf{x})$（特征向量通过 $M^{-1}$ 变换）
- 几何意义：$A \sim B$ 表示同一线性变换在不同基下的矩阵表示。若 $W = V M$（$V, W$ 为两组基），则 $B = M^{-1} A M$

**Schur 引理：** 对任意复矩阵 $A$，存在酉矩阵 $U$ 使得 $T = U^{-1}AU$ 为上三角矩阵。

**谱定理（Spectral Theorem）——实对称矩阵：**
$$A = Q\Lambda Q^T$$

- $Q$：正交矩阵（列为规范正交的特征向量）
- $\Lambda$：实对角矩阵（特征值全为实数）

**谱分解：**
$$A = \sum_{i=1}^n \lambda_i \mathbf{q}_i \mathbf{q}_i^T$$

将 $A$ 写成一维投影矩阵的线性组合。

**谱定理——Hermitian 推广：** $A = U\Lambda U^H$（$U$ 为酉矩阵，$\Lambda$ 实对角）

**谱定理的证明思路：** Schur 引理给出 $A = U T U^H$（$T$ 上三角），由 $A^H = A$ 得 $T^H = T$，故 $T$ 为对角矩阵。

**谱分解定理（推广版）：** Hermitian 矩阵 $A$ 有 $k$ 个互异特征值 $\lambda_1,\dots,\lambda_k$，对应特征空间 $V_i$：
$$A = \sum_{i=1}^k \lambda_i P_i$$
其中 $P_i$ 是向 $V_i$ 的投影矩阵。

**正规矩阵（Normal Matrices）：** $A^H A = A A^H$
- Hermitian、Skew-Hermitian、Unitary 都是正规矩阵
- **正规矩阵的谱定理：** $A$ 可被酉矩阵对角化 $\iff$ $A$ 是正规矩阵
  - 证明思路：$\implies$ 方向显然。$\impliedby$ 方向用 Schur 引理得 $T = U^H A U$ 上三角，由 $TT^H = T^H T$ 推出 $T$ 必为对角矩阵。
- 特征值特征总结：
  - Hermitian $A^H = A$ $\implies$ $\lambda = \bar{\lambda}$（实数）
  - Skew-Hermitian $A^H = -A$ $\implies$ $\lambda = -\bar{\lambda}$（纯虚数）
  - Unitary $A^H A = I$ $\implies$ $\bar{\lambda}\lambda = |\lambda|^2 = 1$

---

## 6 Positive Definite Matrices

### 6.1 Minima, Maxima, and Saddle Points

**二元二次型 $f(x,y) = ax^2 + 2bxy + cy^2$** 在原点处都是驻点。

矩阵表示：
$$\mathbf{x}^T A \mathbf{x} = \begin{bmatrix} x & y \end{bmatrix} \begin{bmatrix} a & b \\ b & c \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix}$$

| 条件 | 类型 | 图形 |
|------|------|------|
| $a>0,\ ac>b^2$ | 正定（Positive Definite） | 上凸碗形 |
| $a<0,\ ac>b^2$ | 负定（Negative Definite） | 下凸碗形 |
| $a>0,\ ac=b^2$ | 半正定（Positive Semidefinite） | 山谷形（有直线全为零） |
| $a<0,\ ac=b^2$ | 半负定（Negative Semidefinite） | 倒山谷形 |
| $ac<b^2$ | 不定（Indefinite） | 马鞍面，原点为鞍点 |

**$n$ 元二次型：**
$$f(x_1,\dots,x_n) = \mathbf{x}^T A \mathbf{x} = \sum_i \sum_j a_{ij} x_i x_j$$

其中 $A$ 为实对称矩阵（二次型矩阵）。交叉项 $x_i x_j$（$i\neq j$）的系数除以 $2$ 才是 $a_{ij} = a_{ji}$。

### 6.2 Tests for Positive Definiteness

**定义：** 对称矩阵 $A$ 正定（$A > 0$）$\iff$ $\forall \mathbf{x} \neq \mathbf{0},\ \mathbf{x}^T A \mathbf{x} > 0$

**正定的等价条件（TFAE）：**
1. $\forall \mathbf{x} \neq \mathbf{0},\ \mathbf{x}^T A \mathbf{x} > 0$
2. 所有特征值 $\lambda_i > 0$
3. 所有左上主子式 $\det(A_k) > 0$
4. 所有主元 $d_k > 0$
5. 存在可逆矩阵 $R$ 使得 $A = R^T R$

**证明脉络：**
- **$1 \implies 2$：** 将特征向量 $\mathbf{x}_i$ 代入得 $\lambda_i \|\mathbf{x}_i\|^2 > 0 \implies \lambda_i > 0$
- **$2 \implies 1$：** 谱定理展开 $\mathbf{x} = \sum c_i \mathbf{x}_i$，$\mathbf{x}^T A\mathbf{x} = \sum \lambda_i c_i^2 > 0$
- **$2 \implies 3$：** $\det(A) = \prod \lambda_i > 0$。前 $k$ 维子空间限制也为正定，故 $\det(A_k) > 0$
- **$3 \implies 4$：** $d_k = \det(A_k) / \det(A_{k-1}) > 0$
- **$4 \implies 1$：** $A = LDU = LDL^T$（对称性 $\implies U = L^T$），令 $\mathbf{y} = L^T\mathbf{x} \neq \mathbf{0}$，则 $\mathbf{x}^T A\mathbf{x} = \mathbf{y}^T D\mathbf{y} = \sum d_i y_i^2 > 0$
- **$5 \implies 1$：** $\mathbf{x}^T A\mathbf{x} = \|R\mathbf{x}\|^2 > 0$（$R$ 可逆 $\implies R\mathbf{x} \neq \mathbf{0}$）
- **$1 \implies 5$（三种构造方式）：**
  - Cholesky：$A = LDL^T = (L\sqrt{D})(\sqrt{D}L^T) = R^T R$，取 $R = \sqrt{D}L^T$
  - 特征分解：$A = Q\Lambda Q^T = (Q\sqrt{\Lambda})(\sqrt{\Lambda}Q^T) = R^T R$，取 $R = \sqrt{\Lambda}Q^T$
  - 对称平方根：$A = Q\Lambda Q^T = (Q\sqrt{\Lambda}Q^T)^2$，取 $R = \sqrt{A} = Q\sqrt{\Lambda}Q^T > 0$

> $R^T R$ 分解不唯一：若 $A = R^T R$，则 $\forall$ 正交 $Q$，$(QR)^T(QR) = R^T R = A$

**配方与高斯消元的对应：** $A = LDU$ 时，$\mathbf{x}^T A\mathbf{x} = \sum d_i y_i^2$（$\mathbf{y} = L^T\mathbf{x}$），$d_i$ 即第 $i$ 个主元，这恰好是配方过程。

**半正定（Positive Semidefinite, $A \geq 0$）：** $\forall \mathbf{x},\ \mathbf{x}^T A\mathbf{x} \geq 0$

**等价条件（TFAE）：**
- $A \geq 0$
- 所有特征值 $\lambda_i \geq 0$
- 所有主矩阵（Principal Matrices）无负特征值
- 所有主元 $d_i \geq 0$
- 存在矩阵 $R$ 使得 $A = R^T R$（$R$ 未必可逆）

> 技巧：$A \geq 0 \iff A + \varepsilon I > 0,\ \forall \varepsilon > 0$（充分小），取极限即得半正定性质。

**负定：** $A < 0$ 若 $-A > 0$。等价于 $\mathbf{x}^T A \mathbf{x} < 0$。

### 6.3 Singular Value Decomposition

**定理：** 任意 $m\times n$ 矩阵 $A$ 可分解为
$$A = U\Sigma V^T$$

- $U$：$m\times m$ 正交矩阵（$AA^T$ 的特征向量）
- $V$：$n\times n$ 正交矩阵（$A^TA$ 的特征向量）
- $\Sigma$：$m\times n$ 对角矩阵 $\begin{bmatrix} \Sigma_1 & 0 \\ 0 & 0 \end{bmatrix}$，其中 $\Sigma_1 = \text{diag}(\sigma_1,\dots,\sigma_r)$
- $\sigma_i$：**奇异值（Singular Values）**，$\sigma_i = \sqrt{\lambda_i}$，$\lambda_i$ 为 $A^TA$（或 $AA^T$）的非零特征值（$i=1,\dots,r=\text{rank}(A)$）

> $AA^T$ 和 $A^TA$ 都是半正定矩阵，非零特征值相同。

**验证 $A^TA$ 的非零特征值即 $\sigma_i^2$：**
$$A^TA = V\Sigma^T U^T U\Sigma V^T = V(\Sigma^T\Sigma)V^T = V\begin{bmatrix} \Sigma_1^2 & 0 \\ 0 & 0 \end{bmatrix}V^T$$

**核心关系：** $A\mathbf{v}_j = \sigma_j \mathbf{u}_j$（$j=1,\dots,r$）

**子空间对应：**
- $V$ 的前 $r$ 列 = $C(A^T)$ 的标准正交基（行空间）
- $V$ 的后 $n-r$ 列 = $N(A)$ 的标准正交基（零空间）
- $U$ 的前 $r$ 列 = $C(A)$ 的标准正交基（列空间）
- $U$ 的后 $m-r$ 列 = $N(A^T)$ 的标准正交基（左零空间）

**SVD 的构造方法：**
1. 求 $A^TA$ 的特征值 $\lambda_1 \geq \cdots \geq \lambda_r > 0$ 和 $\lambda_{r+1} = \cdots = \lambda_n = 0$
2. $\sigma_i = \sqrt{\lambda_i}$
3. $V$ 由 $A^TA$ 的规范正交特征向量构成
4. 对 $j=1,\dots,r$：$\mathbf{u}_j = A\mathbf{v}_j / \sigma_j$（自动为 $AA^T$ 的单位特征向量）
5. 补全 $U$ 的剩余 $m-r$ 列：求 $N(A^T)$ 的标准正交基（即 $AA^T$ 零特征值的特征向量）

> 存在性证明：$\mathbf{v}_j$ 为 $A^TA$ 的单位特征向量，则 $\|A\mathbf{v}_j\|^2 = \mathbf{v}_j^T A^T A \mathbf{v}_j = \sigma_j^2$，故 $A\mathbf{v}_j / \sigma_j$ 是 $AA^T$ 的单位特征向量。

**SVD 的应用：**

**极分解（Polar Decomposition）：** 任意实方阵 $A = QS$
$$A = U\Sigma V^T = (UV^T)(V\Sigma V^T) = QS$$
- $Q = UV^T$：正交矩阵
- $S = V\Sigma V^T$：对称半正定矩阵
- 类比：$z = re^{i\theta}$，$S$ 类似于模长 $r$，$Q$ 类似于 $e^{i\theta}$

**可逆方阵分解：** $A = Q_1 S Q_2^{-1}$（$Q_1, Q_2$ 正交，$S$ 正定对角），可由 SVD 或直接构造 $A^TA$ 的特征分解得。

**伪逆（Pseudoinverse / Moore-Penrose Inverse）：**
$$A^+ = V\Sigma^+ U^T$$

其中 $\Sigma^+ = \begin{bmatrix} \Sigma_1^{-1} & 0 \\ 0 & 0 \end{bmatrix}$，即把每个 $\sigma_i$ 替换为 $1/\sigma_i$。

**最小二乘的最优解（$A$ 非列满秩时）：** 长度最小的最小二乘解
$$\mathbf{x}^+ = A^+\mathbf{b} = V\Sigma^+ U^T \mathbf{b}$$

最优解落在 $C(A^T)$（行空间）中：$\hat{\mathbf{x}} = \mathbf{x}_r + \mathbf{x}_n$，零空间分量与行空间分量正交，令 $\mathbf{x}_n = \mathbf{0}$ 即最小化长度。

**图片压缩（Image Compression）：** 取前 $k$ 个最大奇异值近似 $A \approx \sum_{i=1}^{k} \sigma_i \mathbf{u}_i \mathbf{v}_i^T$，存储量 $k(m+n+1)$，压缩比 $\frac{mn}{k(m+n+1)}$

**图片降噪（Noise Reduction）：** 丢弃相对很小的奇异值及其分量。

### 6.4 Minimum Principles（不考）
### 6.5 The Finite Element Method（不考）

---

## 补充：合同矩阵与二次超曲面

### 合同（Congruence）

$B = C^T A C$（$C$ 可逆），称 $A$ 与 $B$ 合同。
- 对称矩阵的合同矩阵仍对称
- $I$ 的合同矩阵 $C^T C$ 必为正定

**塞维斯特惯性定律（Sylvester's Law of Inertia）：**
- 合同矩阵与 $A$ 有相同数量的正特征值、负特征值和零特征值
- $p$：正惯性指数（正特征值个数）；$q$：负惯性指数（负特征值个数）
- $r = p+q = \text{rank}(A)$；$p-q$ = 符号差（Signature）

**规范型定理：** 存在变量替换 $\mathbf{x} = C\mathbf{y}$，使 $f(\mathbf{x}) = \mathbf{x}^T A\mathbf{x}$ 化为：
$$f = y_1^2 + \cdots + y_p^2 - y_{p+1}^2 - \cdots - y_r^2$$

该规范型由 $f$ 唯一决定。

**拉格朗日配方法：**
- 有平方项 $\to$ 直接配方，迭代
- 无平方项但有交叉项（如 $x_1 x_2$）$\to$ 令 $x_1 = y_1+y_2,\ x_2 = y_1-y_2$，创造平方差

### 二次超曲面（Quadric Surface）

方程：$\mathbf{x}^T A\mathbf{x} = 1$（$A$ 对称）

作正交变换 $\mathbf{x} = Q\mathbf{y}$，由谱定理 $Q^T A Q = \Lambda$：
$$\sum \lambda_i y_i^2 = 1$$

**$n=3$ 分类：**

| 特征值正负 | 曲面类型 |
|-----------|----------|
| $(+,+,+)$ | 椭球面（Ellipsoid） |
| $(+,+,-)$ | 单叶双曲面（Hyperboloid of One Sheet） |
| $(+,-,-)$ | 双叶双曲面（Hyperboloid of Two Sheets） |
| $(-,-,-)$ | 空集 |
| $(+,+,0)$ | 椭圆柱面（Elliptic Cylinder） |
| $(+,-,0)$ | 双曲柱面（Hyperbolic Cylinder） |
| $(-,-,0)$ | 空集 |
| $(+,0,0)$ | 两个平行平面（Two Parallel Planes） |
| $(-,0,0)$ | 空集 |
| $(0,0,0)$ | 空集 |

> 判断二次曲面类型：先求特征值或利用韦达定理判正负，或配方找惯性指数。
