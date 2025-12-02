[[Antiderivative and Integral - 积分]]
### 杂类

#### 定积分
- 注意是否区间关于 0 对称而且被积函数是奇函数。
- 区间再现： $$\int^{\pi/2}_{0}f(\sin x) dx=\int^{\pi/2}_{0}f(\cos x)dx$$ 
-  更一般的，$$\int^{a}_{0}f(x)dx=\frac{1}{2}  \int^{a}_{0} \left[f(x)+f(a-x)\right]dx$$
- 类似的，$$\int^{a}_{\frac{1}{a}} f(x)dx=\frac{1}{2} \int^{a}_{\frac{1}{a}} \left[f(x)+\frac{1}{x^2}f\left( \frac{1}{x} \right)\right]dx$$
#### 不定积分
- $\frac{1}{a^2+x^2}, \frac{1}{\sqrt{1-ax^2}}, \frac{1}{|ax|\sqrt{a^2x^2-1}}\dots$ 考虑反三角函数，或直接背公式
- $\sqrt{ a^2-x^2 }$ 考虑三角换元 $x=a\sin\theta$，$\sqrt{ a^2+x^2 }$ 考虑三角换元 $x=a\tan\theta$，或直接背公式
- 三角函数积分公式表：[[Integral-1]]
### 换元（Substitution）
$$
\int g(f(x))\times f'(x)dx=\int g(f)df
$$
### 分部积分（Integration by Parts）

$$
\int uv'dx =uv-\int vu'dx
$$
用在函数可分解成两个乘积，其中一个容易求导，另一个容易积分时尝试。
特别的，若 $v'=1$：
$$
\int f(x)dx=xf(x)-\int xf'(x)dx
$$
