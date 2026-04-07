
$x, y \in \mathbb{R}^{n}$ 正交（Orthogonal）定义为  $x^Ty=0$。
$x\in \mathbb{R}^n$ 的长度（Length）定义为 $||x|| = \sqrt{ x^Tx }$。
$x,y\in \mathbb{R}^n$ 之间的角度定义为 $\cos\theta= \frac{x^Ty}{\lVert x \rVert\lVert y \rVert}$。

**柯西-施瓦茨不等式（Cauchy-Schwarz）：** 对于任意两个内积空间中的向量 $x,y$，有：
$$
|x\cdot y|^{2}\leq \lvert x \cdot x \rvert \lvert y\cdot y \rvert 
$$
这和角度的定义相统一，因为 $|\cos\theta|\leq 1$ 。

定理：若一组向量相互正交且它们不是零向量，则它们是线性无关的。
- 证明：对于方程 $c_{1}v_{1}+c_{2}v_{2}+\dots+c_{n}v_{n}=0$，将它点乘 $v_{1}$ 得 $v_{1}^T(c_{1}v_{1}+c_{2}v_{2}+\dots+c_{n}v_{n})=0$，也就是说 $v_{1}^Tc_{1}v_{1}=c_{1}\lVert v_{1} \rVert^{2}=0$。由于 $\lVert v_{1} \rVert\neq 0$，那么 $c_{1}=0$。类似的 $c_{i}$ 都为 $0$。

两个子空间 $V,W$ 彼此正交定义为 $\forall v\in V, w\in W$，有 $v^Tw=0$。记作 $V \perp W$。

$C(A)\perp N(A^T)$
- 证明：$b \in C(A) \implies \exists x,\text{s.t. }Ax=b$；$y\in N(A^T)\implies y^TA=0$。从而 $y^Tb=y^T(Ax)=(y^TA)x=0$。从而 $y^T\perp b$。

$C(A^T)\perp N(A)$
- 证明：$x\in N(A)\implies Ax=0\implies x^TA^T=0$，故 $x\perp A^T$。

$V\subseteq \mathbb{R}^n$ 的垂直补（Orthogonal Complement）定义为所有满足 $v\perp V$ 的向量 $v$ 组成的集合，记作 $V^{\perp}$。一个空间和其垂直补的维数之和为 $n$。

可以证明 $C(A)^{\perp}=N(A^T), C(A^{T})^{\perp}= N(A)$。
- $Ax=b$ 相容的一个等价条件：$y^Tb=0 , \forall y\in N(A^{T})$。


$b$ 在 $a$ 上的投影（Projection）：$p= \lVert p \rVert \frac{a}{\lVert a \rVert}= \lVert b \rVert\cos\theta  \frac{a}{\lVert a \rVert}=\frac{a^Tb}{\lVert a \rVert^{2}}a$。


