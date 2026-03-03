
## 定义与定理

 数列（Sequence）收敛（Converge）到 $L$ 记作：
$$
\lim_{ n \to \infty } a_{n}=L
$$
也称 $L$ 为数列 $a_{n}$ 的极限。严谨定义为：
 $$
\forall \varepsilon >0, \exists N(\varepsilon)>0,s.t. |a_{n}-L|<\varepsilon,\forall n>N(\varepsilon)
$$
 数列极限的性质与函数极限类似：四则运算与求极限可以交换位置。
 
 同样也适用**夹逼定理（The Sandwich Theorem）**：若 $\lim_{ n \to \infty }a_{n}=\lim_{ n \to \infty }c_{n}=L, c_{n}\leq b_{n}\leq a_{n}$，则有 $\lim_{ n \to \infty }b_{n}=L$。

**数列连续函数定理（The Continuous Function Theorem for Sequences）**：若 $\lim_{ n \to \infty }a_{n}=L$ 且 $f(x)$ 在 $L$ 处连续，那么有 $\lim_{ n \to \infty }f(a_{n})=f(L)$。也就是说，复合一个连续函数和求极限可以交换位置。

为了使用求函数极限的方法，有如下定理：若 $a_{n}=f(n),\forall n\in \mathbb{N}^+$ 且 $\lim_{ x \to \infty }f(x)=L$，那么有 $\lim_{ n \to \infty }a_{n}=\lim_{ x \to \infty }f(x)=L$ 。

数列有界（Bound）的定义为数列同时有上界（Upper Bound）和下界（Lower Bound）。

数列单调（Monotonic）的定义为数列不降（Nondecreasing）或不升（Nonincreasing）。

**单调有界定理（The Monotonic Sequence Theorem）**：单调且有界的数列一定收敛。




