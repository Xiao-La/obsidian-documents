## 复数的不同表达形式

$$z=a+bi=re^{i\theta}=r(\cos  \theta+i\sin\theta)$$
## 单位根

方程 $$
z^n=1
$$
的根被称为 $n$ 次单位根 (The $n\text{th}$ roots of unity)。
$$
z=1^{1/n}=(e^{2k\pi i})^{1/n}
$$
$$
\implies z_{k}=e^{2\pi ki/n}, k=0, 1, 2,\dots n-1
$$
$k=1$ 给出主单位根（Principal $n\text{th}$ root of unity）。
单位根有许多有用的性质，例如，若 $z,w$ 是 $n$ 次单位根，则：
- $zw$ 是 $n$ 次单位根。
- $\frac{1}{z}$ 是 $n$ 次单位根。
- $\frac{z}{w}$ 是 $n$ 次单位根。
- $z^k$ 是 $n$ 次单位根。
另外，所有 $n$ 次单位根的和为 $0$：
$$
1+z+z^2+\dots+z^{n-1}=\frac{1-z^n}{1-z}=0
$$
所有 $n$ 次单位根的积：
$$
1\times z^1 \times z^{2}\times\dots\times z^{n-1}=\begin{cases} (z^{n})^{(n-1)/2}=1, & \text{when n is odd} \\ (z^{n/2})^{n-1}=-1, &  \text{when n is even} \end{cases}
$$
## 代数基本定理

代数基本定理（Fundamental Theorem of Algebra）：
- 每个次数为 $n\ge 1$ 的复系数多项式可以完全分解为 $n$ 个一次因子：
   $$
p(z)=a_n z^n+a_{n-1} z^{n-1}+\cdots+a_1 z+a_0,\quad a_n\neq 0,\ n\ge 1
$$
  $$
  \implies p(z)=a_n\prod_{k=1}^n (z-\lambda_k),\quad \lambda_k\in\mathbb{C}.
  $$
- 若系数为实数，则根要么为实数，要么成共轭复数成对出现；并且总根数（按重数计）恰为次数 $n$。

这里，若系数为实数，那么共轭复数成对出现，是因为 $p(z)=0\implies\overline{p(z)}= p(\bar{z})=0$。
## 棣莫弗定理

棣莫弗定理（De Moivre's Theorem）：

$$
[\cos \phi +i \sin \phi]^{n}=\cos(n\phi)+i\sin(n\phi)
$$
可以用来算出 $n$ 倍角公式。
把上式中的 $\phi$ 换成 $-\phi$，可以推出：
$$
[\cos \phi-i\sin \phi]^{n}=\cos(n\phi)-i\sin(n\phi)
$$
