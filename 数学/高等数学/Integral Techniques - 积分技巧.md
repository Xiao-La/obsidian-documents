前置： [[Antiderivative and Integral - 积分]]
### 杂类

#### 定积分
- 注意是否区间关于 0 对称而且被积函数是奇函数。
- 区间再现： $$\int^{\pi/2}_{0}f(\sin x) dx=\int^{\pi/2}_{0}f(\cos x)dx$$ 
-  更一般的，$$\int^{a}_{0}f(x)dx=\frac{1}{2}  \int^{a}_{0} \left[f(x)+f(a-x)\right]dx$$
- 类似的，$$\int^{a}_{\frac{1}{a}} f(x)dx=\frac{1}{2} \int^{a}_{\frac{1}{a}} \left[f(x)+\frac{1}{x^2}f\left( \frac{1}{x} \right)\right]dx$$
#### 不定积分
- $\frac{1}{a^2+x^2}, \frac{1}{\sqrt{1-ax^2}}, \frac{1}{|ax|\sqrt{a^2x^2-1}}\dots$ 考虑反三角函数
- 三角函数积分公式表：[[Integral-1]]
- Wallis 公式：
$$
\int^{\pi/2}_{0}\sin^nxdx=\int^{\pi/2}_{0}\cos^nxdx=\begin{cases}
\frac{n-1}{n} \cdot  \frac{n-3}{n-2}\dots \frac{2}{3}\cdot 1 & (\text{n为奇数})\\
\frac{n-1}{n}\cdot \frac{n-3}{n-2} \dots \frac{1}{2} \cdot \frac{\pi}{2} & (\text{n为偶数})
\end{cases}
$$
- 对分子为多项式，分母为二次式的平方根的形式，有如下的恒等式：$$\int \frac{P_{n}(x)}{\sqrt{ ax^2+bx+c }} dx=Q_{n-1}(x)\sqrt{ ax^2+bx+c }  + \int \frac{K}{\sqrt{ ax^2+bx+c } } dx$$ 其中 $P_{n}$ 为一个 $n$ 次多项式，$Q_{n-1}$ 为一个 $n-1$ 次多项式，可以通过待定系数法确定。这个恒等式可以通过求导证明。
- 对于这个形式，使用倒数代换 $u=\frac{1}{ax+b}$ 往往能消掉一次项：
  $$
\int \frac{1}{(ax+b)\sqrt{ cx^2+dx+e }} dx
$$
- 以下公式最好直接背，因为三角换元容易造成难以处理的绝对值：
  $$
\frac{1}{\sqrt{ x^2\pm a^2}} = \ln|x+\sqrt{ x^2\pm a^2 }|
$$
### 换元（Substitution）

#### 第一类（凑微分）
$$
\int g(f(x))\times f'(x)dx \xlongequal{u=f(x)} \int g(u)du
$$
关于三角函数的经验凑微分技巧：
1. 若将 $\sin x$ 换成 $-\sin x$ 后，原式变为其相反数，则凑 $\sin x dx=-d\cos x$。
2. 若将 $\cos x$ 换成 $-\cos x$ 后，原式变为其相反数，则凑 $\cos xdx=d\sin x$。
3. 若将 $\sin x$ 和 $\cos x$ 换成 $-\sin x$ 和 $-\cos x$ 后，原式不变，则凑 $\sec^2dx=d\tan x$。
4. 也可考虑万能公式。
#### 第二类（去根号）

$$
\int f(x) dx \xlongequal{x=g(t)} \int f(g(t)) g'(t) dt
$$
1. 积分式中有 $\sqrt{ ax+b }$ 时，换元 $x=\frac{t^2-b}{a}$，则 $dx=\frac{2t}{a}dt$。
2. $\sqrt{ a^2-x^2 }$ 考虑三角换元 $x=a\sin\theta$。
3. $\sqrt{ a^2+x^2 }$ 考虑三角换元 $x=a\tan\theta$。
4. $\sqrt{ x^2-a^2 }$ 考虑三角换元 $x=a\sec \theta$。
5. 上面这些三角换元不必死记硬背公式，画一个含 $\theta, a, x$ 的直角三角形即可直观看出关系。
### 分部积分（Integration by Parts）

$$
\int udv=uv-\int vdu
$$
或
$$
\int uv'dx =uv-\int vu'dx
$$
用在函数可分解成两个乘积，其中一个容易求导，另一个容易求原函数时尝试。
经验顺序：**反对幂三指**，排在后面的选为 $v'$。

特别的，
$$
\int f(x)dx=xf(x)-\int xdf(x)
$$
也就是说如果一个函数的反函数容易积分，则分部积分法可用。
表格法：
![[Integral-1.png]]
### 部分分式（Integration Using Partial Fractions）

当 $F(x)$ 的次数小于 $G(x)$ 时，可以将这个有理分式拆开：

$$
\frac{F(x)}{G(x)=\prod_{i} (x-x_{i})^{a_{i}}}=\sum_{i} \sum _{1\leq k\leq a_{i}} \frac{t_{i}}{(x-x_{0})^k}
$$
注意如果分母包含不可约的二次因式如 $x^2+x+1$，那么对它拆的时候分子待定系数为 $Ax+B$，而不是简单的常数。
任何实系数多项式都可以分解成若干一次因式和二次因式的乘积，例如
$$
\frac{1}{x^4+1}=\frac{1}{(x^2+1-\sqrt{ 2 }x)(x^2+1+\sqrt{ 2 }x)}
$$
然后可以用部分分式来积分。