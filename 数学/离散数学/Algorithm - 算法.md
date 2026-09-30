
算法：解决问题或用于计算的，有限序列的精确指令。

>  Algorithm出自“Algoritmi”，这是花拉子米（al-Khwārizmī）的拉丁文译名。

我们关心随着 input size（记作 $n$）变大，运行时间的渐进表现（Asymptotic behavior）。使用大 $O$ 记号表示上界：$f(n)=O(g(n))$ 若
$$
\exists c,n_{0}, \forall n>n_{0} , \lvert f(n) \rvert\leq c \lvert g(n) \rvert  
$$
结论：$f(x)=\sum_{i=0}^{n} a_{i}x^{i}=O(x^{n})$。（多项式的主项决定增长速度）
![[Algorithm - 算法.png|332]]
- $n^{n}$ 并不是 $O(n!)$ 的。
- 但是，$n\log n=O(\log n!)$。
- 这是因为，$n^{n}\leq(n!)^{2}$。

定理：若 $f_{1}(x)=O(g_{1}(x)),f_{2}(x)=O(g_{2}(x))$，则
-  $(f_{1}+f_{2})(x)=O(\max(|g_{1}(x)|,|g_{2}(x)|))$
- $(f_{1}f_{2})(x)=O(g_{1}(x)g_{2}(x))$

类似于大 $O$ 记号，还有表示下界的 $\Omega$ 记号，还有表示渐进同阶的 $\Theta$ 记号。

计算问题（Computational Problem）：定义了输入和输出。
实例（Instance）：一个问题的实例是一组问题所需的所有输入。
正确的算法（Correct Algorithm）： 对所有的输入实例都能给出正确的解答。

时间复杂度（Time complexity）：基础的机器运算（Machine Operations） 的数量。
空间复杂度（Space complexity）：需要的内存量（Amount of memory）。
复杂度实际上是 input size 的函数。
**定义 input size：** 能够编码输入数据所需要的最少的比特数。
- 例如，输入数据是一个整数 $n$，则 input size 就是 $\log_{2}n$。也就是说，朴素的判断合数的算法（试除法）的复杂度实际上是 $O(2^{\text{size}(n)})$
- 例如，输入数据是一个数组 $a_{1},a_{2},\dots,a_{n}$，则 input size 就是 $n\cdot \log_{2}a$，其中 $a=\max{a_{i}}$。（由于这里 $a$ 是个常数，那么表示复杂度的时候只会写成 $n$ 的函数）
- 例如要计算 $a\times b$，可以定义 $t=\log_{2}\max(a,b)$

**定义** 正函数 $f(n)$ 和 $g(n)$ 是同类的（of the **same type**），若
$$
c_{1}g(n^{a_{1}})^{b_{1}}\leq f(n)\leq c_{2}g(n^{a_{2}})^{b_{2}}
$$
对所有足够大的 $n$。其中 $a_{1},a_{2},b_{1},b_{2},c_{1},c_{2}$ 为正常数。


## P, NP

对于判定性问题（Decision Problems），我们对于一个输入数据，最终输出 yes / no 两种结果。