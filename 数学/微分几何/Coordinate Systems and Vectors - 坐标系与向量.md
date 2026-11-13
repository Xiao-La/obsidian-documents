## 坐标系

**Index notation（指标记号）:** 在笛卡尔坐标系中，把 $(x,y,z)$ 换成 $x^{1},x^{2},x^{3}$；以此类推。

常用的坐标系：
- 笛卡尔坐标。
- 极坐标。
- 柱坐标。
- 球坐标。
另外还有：
- 椭圆柱坐标。
- 抛物柱坐标。
- 抛物坐标。
其中，笛卡尔坐标可以唯一地表示空间中的每一点；而极坐标，柱坐标等却在原点处有“缺陷”。以极坐标为例，$x^{1}=\rho \cos \varphi, x^{2}=\rho \sin \varphi$，那么 $\rho=0$，$\varphi$ 可以取任何值，都会指向原点。要避免的话，只能去平移坐标系。

**Line element / metric（线元 / 度量）：** $dl$，有时也指 $dl^{2}$，按一般的求和记号可以写成
$$
dl^{2}=\sum _{i=1}^{N} (dx^{i})^{2}
$$
这可以等效为用 **Einstein summation convention（爱因斯坦求和记号）：**
$$
dl^{2}=dx^{i}dx^{i}
$$
省略了求和记号。当我们在每一项中看到**恰好两个**相同的 index，就知道需要求和。

## 向量

按照 index notation，三维向量可以写成
$$
\mathbf{V}=V^{1}\hat{\mathbf{e}}_{1}+V^{2} \hat{\mathbf{e}}_{2}+V^{3}\hat{\mathbf{e}}_{3}
$$
按照 Einstein summation convention，一般的向量可以写成
$$
\mathbf{V}=V^{i}\hat{\mathbf{e}}_{i}
$$
向量加法可以写成
$$
\mathbf{V}+\mathbf{U}=V^{i}\hat{\mathbf{e}}_{i}+U^{j}\hat{\mathbf{e}}_{j}=(V^{i}+U^{i})\hat{\mathbf{e}}_{i}
$$
点乘可以写成
$$
\mathbf{V}\cdot \mathbf{U}=(V^{i} \hat{\mathbf{e}}_{i})\cdot (U^{j} \hat{\mathbf{e}}_{j})
$$
这里定义 **Kronecker delta**：
$$
\delta _{ij}=\hat{\mathbf{e}}_{i} \cdot \hat{\mathbf{e}}_{j}= \begin{cases}
1 & i=j \\
0 & i\neq j 
\end{cases}
$$
那么点乘可以进一步写成
$$
\mathbf{V}\cdot \mathbf{U}= V^{i}U^{j} \delta _{ij}
$$
### 上标与下标

对这些 **dummy indices**（恰好出现两次的 index），有 **lowering / raising：**
$$
U^{j}\delta _{ij}=U_{i},\quad V^{i}\delta _{ij}=V_{j}
$$
$$
U_{j}\delta ^{ij}=U^{i},\quad V_{i}\delta ^{ij}=V^{j}
$$
定义 **hybrid Kronecker delta：**
$$
\delta _{j}^{i}=\delta ^{ik} \delta _{kj}
$$
那么可以得到
$$
U^{j} \delta _{j}^{i}=U^{i}
$$
上式中，$i$ 这种 **每项恰好出现一次，且每项里名字相同** 的指标叫做 **free index。**

有时我们会称分量带上标的为 **contravariant vector / vector**；称带下标的为 **covariant vector / dual vector**。对笛卡尔坐标来说，这两种没区别，也就是说 $U_{i}=U^{i}$；后面就会介绍到一般情况下的区别。总结一下，向量点积有这些等价写法：
$$
\mathbf{V}\cdot \mathbf{U}=V^{i}U^{j}\delta _{ij}=V_{i}U_{j}\delta ^{ij}=V^{i}U_{j} \delta ^{j}_{i}=V^{i}U_{i}=V_{i}U^{i}
$$
一种用矩阵的直观理解方式：把上标看成列向量的成分，把下标看成行向量的成分，例如：
$$
V_{i}U^{i}\leftrightarrow \begin{pmatrix}
V_{x} & V_{y} & V_{z} 
\end{pmatrix} \begin{pmatrix}
U_{x} \\
U_{y} \\
U_{z}
\end{pmatrix}
$$
而 Kronecker delta 可以看成表示单位矩阵的分量：
$$
[\delta]= \begin{pmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{pmatrix}
$$
这里有
$$
\delta ^{ij}\delta _{ij}=\delta ^{i}_{i}=3
$$
进一步，对任意矩阵，它的 trace 可以由它的分量用 Kronecker delta 缩并（contract）下标得到
$$
\delta ^{ij}A_{ij}=\delta _{ij}A^{ij}=A^{i}_{i}=\operatorname{tr}(A)
$$

Remark：free indices 的数量，决定了 结果是什么类型。例如：
- 向量点积中数量为 $0$，那么结果就是标量。
- 在 lowering 的式子中，数量为 $1$，那么结果是向量。
- $\delta _{ij}$ 这个 term，数量为 $2$，那么结果是矩阵。

Remark： 缩并应该一上一下配对，例如不能写 $V^{i}U^{i}$，而写 $V^{i}U_{i}$ 就是对的。

## 微分

常用 **nabla / del** 算子 $\nabla$ 来对坐标求导，**在笛卡尔坐标系下**，它用 index notation 可以写成：
$$
\vec{\nabla}= \hat{\mathbf{e}}_{i} \partial ^{i}= \delta ^{ij} \hat{\mathbf{e}}_{i}  \partial _{j}
$$
这里我们定义
$$
\partial _{i}= \frac{\partial}{\partial x^{i}}
$$
散度（Divergence）用 index notation 可以写成
$$
\vec{\nabla}  \cdot \mathbf{V}= \frac{\partial V^{i}}{\partial x^{i}}= \partial _{i}V^{i}
$$
而 函数 $f$ 的梯度（gradient）可以写成
$$
\vec{\nabla} f = \delta ^{ij} \hat{\mathbf{e}}_{i} (\partial _{j}f) = \hat{\mathbf{e}}_{i} (\partial ^{i}f)
$$
Remark: 这里顺序很重要，因为 $\partial _{i}$ 算子右边放的是我们想要求导的东西，所以不应该写 $\partial _{i}\delta ^{ij}$ 这样的东西。
定义方向微分（directional derivative）为
$$
df=d\boldsymbol{r} \cdot  \vec{\nabla}f = dx^{i} (\partial _{i}f)
$$
另外还可以定义 Laplacian 算子 $\nabla ^{2}$：
$$
\nabla ^{2}= \vec{\nabla}\cdot \vec{\nabla}=  \delta ^{ij}\partial _{i}\partial _{j}= \partial ^{i}\partial _{i}=\partial _{i} \partial ^{i}
$$
