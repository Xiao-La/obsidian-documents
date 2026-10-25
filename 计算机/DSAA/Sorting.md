
## 堆排序（Heap Sort）

用堆这种数据结构来加速选择排序的过程。
可以把数组对应到一个二叉树（Binary Tree）。
- 下标的对应关系： $\text{Parent}(i)= \lfloor i / 2 \rfloor,\text{Left}(i)=2i,\text{Right}(i)=2i+1$。

大根堆：一个完全二叉树，具有 Max-heap Property：
$$
A[\text{Parent}(i)]\geq A[i]
$$
![[Sorting.png|471]]
小根堆，一个完全二叉树，具有 Min-heap Property：
$$
A[\text{Parent}(i)]\leq A[i]
$$
以大根堆为例，堆排序的步骤：
- 从一个无序的数组建立堆。（Build-Max-Heap）
- 不断拿出堆顶的最大元素放到数组的末尾，然后维护堆的性质（Max-Heapify）。这里用 $A.\text{heap-size}$ 表示还没有放到末尾的元素个数。

$\text{Max-Heapify}(A,i)$：考虑以 $i$ 为根的子树。假设 $\text{Left}(i),\text{Right}(i)$ 都是大根堆，但 $i$ 处可能破坏堆的性质。那么，可以通过不断向下调整（"float down"），把 $i$ 与它的**较大的**子节点（如果比 $i$ 大）交换，不断递归地重复即可。
![[Sorting-1.png|493]]
运行时间：我们说树中一个节点的高度（height）是它到叶子节点的最长简单路径的长度。那么若 $i$ 的高度为 $h$，则运行时间是 $O(h)$ 的。（不是 $\Omega (h)$，因为可能提前停下）这里 $h$ 最多是 $\log n$，因为高度为 $h$ 的完全二叉树至少有 $1+2+4+\dots+2^{h-1}+1=2^{h}$ 个节点。
正确性：对高度进行归纳证明。Base case 就是叶子节点。假设对 $i-1$ 高度已经成立，那么对 $i$ 高度，交换之后就化为了 $i-1$ 的情况，所以也成立。

$\text{Build-Max-Heap}(A,n)$：从叶子节点开始，从下至上不断执行 $\text{Max-Heapify}$。这是因为 $\text{Max-Heapify}$ 假设了 $\text{Left}(i)$ 和 $\text{Right}(i)$ 都是大根堆。另外我们注意到 $A[( \lfloor n / 2 \rfloor + 1),\dots,n]$ 都是叶子节点，所以不需要操作就自然形成大根堆。那么只需要从 $\lfloor n / 2 \rfloor$ 开始往前做即可。
![[Sorting-2.png|267]]
正确性：可以通过 Loop invariant “在迭代 $i$ 开始时，$i+1,i+2,\dots,n$ 都是一个大根堆的根节点“ 证明。
运行时间：显然是 $O(n\log n)$ 的。一个更紧的界是 $\Theta(n)$。
- 这是因为，大多数节点的高度都很小。实际上，高度为 $h$ 的节点最多只有 $\left\lceil  \frac{n}{2^{h+1}}  \right\rceil$ 个。
- 这个可以归纳证明，首先 $h=0$ 时就是叶子节点，确实最多是 $\lceil n / 2 \rceil$ 个；然后高度 $h$ 的节点个数相当于我们删掉叶子节点之后的新的树（节点数是 $\lfloor n / 2 \rfloor$）的高度 $h-1$ 的节点个数，这个最多就是 $\lceil \lfloor n / 2 \rfloor / 2^{h} \rceil\leq \lceil n / 2^{h+1} \rceil$，证明完毕。
- 那么运行时间就是
$$
T(n)=\sum_{h=1}^{\lfloor \log n \rfloor }\left\lceil  \frac{n}{2^{h+1}}  \right\rceil O(h)=O\left( n\sum_{h=1}^{\lfloor \log n \rfloor } \frac{h}{2^{h}} \right)=O\left( n\sum_{h=1}^{\infty} \frac{h}{2^{h}}\right)=O(n)
$$
- 还可以证明 $\Omega(n)$（循环带来的）。
- 因此是 $\Theta(n)$ 的。

结合上面的两个函数，得到堆排序：
![[Sorting-3.png|484]]
运行时间是 $O(n)+(n-1)\cdot O(\log n)=O(n\log n)$ 的。
可以通过循环不变量证明正确性。

## 快速排序（Quicksort）

快速排序的最坏情况是 $\Theta (n^{2} )$ 的，而平均情况下是常数很小的 $\Theta(n\log n)$ 的。
快速排序用到了分治。
- Divide：找到一个 pivot，把它放到正确的位置，也就是说，使得其左边的元素都比它更小，右边的元素都比它更大。
- Conquer：递归地去排左边和右边的子数组。
- Combine：不需要。

伪代码：
![[Sorting-4.png|434]]
![[Sorting-5.png|438]]

Partition 的正确性可以用 loop invariant 证明。在每次迭代开始时：
- $A[k]\leq x$ 对于 $p\leq k\leq i$。
- $A[k]>x$ 对于 $i+1\leq k\leq j-1$。
- $A[k]=x$ 对于 $k=r$。
Initialization 显然成立。通过对每次迭代的 $A[j]$ 与 $x$ 的大小关系分类，容易说明 Maintenance。当循环结束时，这个 loop invariant 就证明了这个循环把 $A[p\dots r]$ 分成了三个部分：
- $A[p\dots i](\leq A[r])$
- $A[i+1\dots r-1](>A[r])$
- $A[r]$
再做一次交换，就可以把 $A[r]$ 放到正确的位置上：$i+1$。

Partition 的运行时间是 $\Theta(n)$。

### 运行时间分析

#### 最坏情况

每次 partition 都把数组分成一个空的子数组和一个 $n-1$ 个元素的子数组，造成不平衡的情况：
$$
T(n)=T(n-1)+T(0)+\Theta(n)
$$
通过 substitution method 容易说明此时 $T(n)=\Theta(n^{2})$。（直观上，可以理解为等差数列求和）
- **证明：** 考虑最坏情况的递归表达式：
$$
T(n)=\max _{0\leq q\leq n-1}(T(q)+T(n-q-1))+\Theta(n)
$$
- 猜测 $T(n)\leq cn^{2}$，考虑通过 substitution method 证明：若对更小的 $n$ 已经成立，那么
$$
\begin{aligned}
T(n)&\leq \max _{0\leq q\leq n-1}(c q ^{2}+c(n-q-1) ^{2})+\Theta(n) \\
&\leq c (n-1)^{2}+\Theta(n) \\
&\leq cn^{2}
\end{aligned}
$$
- 这里这个 $\max$ 的取等在 $q$ 是端点的时候取到，也就是上面说的最坏情况。

#### 最好情况

 每次 partition 分成一半一半：
$$
T(n)=2T(n / 2)+\Theta(n)
$$
通过 master theorem 可以说明 $T(n)=\Theta(n\log n)$。

#### 平均情况

**随机化。** 为了避免最坏情况，我们可以在 partition 前面让我们选的 pivot 是随机的：
![[Sorting-6.png|441]]

当数组元素互异时，随机化的 QuickSort 的**期望运行时间**是 $\Theta(n\log n)$。
- **直觉：** 一个好的 partition 是把数组分成它的某个常数比例，例如，分成 $3:1$。一个不好的 partition 是把数组分成 $0$ 和 $n-1$。如果好的和坏的等可能交替出现，那好的 partition 会主导，导致 $\Theta(n\log n)$。
- **直观证明：** 假设每种 split $q=1,2, \dots, n$ 等可能，对这些情况取平均：
$$
\begin{aligned}
T(n)=& \frac{1}{n} \cdot \sum _{q=1}^{n}(T(q-1)+T(n-q)+\Theta(n)) \\
=&  \frac{1}{n} \cdot \sum _{q=1}^{n}T(q-1)+ \frac{1}{n} \sum _{q=1}^{n}T(n-q)+\frac{1}{n} \sum _{q=1}^{n}\Theta(n) \\
=& \frac{1}{n} \cdot \sum _{k=0}^{n-1}2T(k)+\Theta(n) 
\end{aligned}
$$
- 通过归纳证明，可以证明上面的 $T(n)\leq cn\ln n$，于是 $T(n)=O(n\log n)$。
- **证明：** 我们考虑在整个 QuickSort 中，Partition 的 Line 4 执行的总次数 $X$。可以看出，这个 $X$ 决定了整个算法的上界（其他行的执行次数都不会更大），其实也是下界，所以 $T(n)=\Theta(X(n))$。用 indicator random variable $X_{ij}$ 表示 $z_{i}$ 和 $z_{j}$  发生了一次比较（这里 $z_{1},z_{2},\dots,z_{n}$ 表示从小到大排列的元素）。那么
$$
\mathrm{E}(X)=\sum _{i=1}^{n-1}\sum _{j=i+1}^{n}\mathrm{E}(X_{ij})=\sum _{i=1}^{n-1}\sum _{j=i+1}^{n}P(X_{ij}=1)
$$
- 那么我们要考虑 $X_{ij}=1$ 的概率，也就是 $z_{i}$ 与 $z_{j}$ 发生了一次比较的概率。观察到，比较发生且只发生在这种情况：在 $z_{i},z_{i+1},\dots,z_{j-1},z_{j}$ 这些元素之间， $z_{i}$ 或 $z_{j}$ 被首先选为了 pivot，在其他元素还没被选到之前（否则，若这些元素中的其他元素先被选为了 pivot，数组就会从这个元素分成两半，两边的元素不可能再发生比较）。那么发生的概率就是：
$$
P(X_{ij}=1)= \frac{2}{j-i+1}
$$
- 于是 
$$
\begin{aligned}
\mathrm{E}(X)&=\sum _{i=1}^{n-1}\sum _{j=i+1}^{n} \frac{2}{j-i+1} \\
&= \sum _{i=1}^{n-1}\sum _{k=2}^{n-i+1} \frac{2}{k} \\
&<\sum _{i=1}^{n-1}\sum _{k=1}^{n} \frac{2}{k} \\ 
&=\sum _{i=1}^{n-1} O(\log n) \\
&=O(n\log n)
\end{aligned}
$$
- 于是 $T(n)=O(n\log n)$。

## 比较排序的时间复杂度

任何比较排序的时间复杂度，都有 $T(n)=\Omega( n\log n)$。这可以通过 **决策树（Decision Tree）** 说明：
![[Sorting-7.png|438]]
每个 **叶节点** 都是原数组的一种 **排列**，其他节点 $i:j$ 表示 $a_{i},a_{j}$ 做了一次比较，这里 $a_{i},a_{j}$ 表示原数组中 $i,j$ 位置对应的值。例如，上图表示 Insertion Sort 的决策树。那么，比较排序的每次运行都可以表示为根节点到一个叶节点的简单路径。
最坏情况下的时间复杂度，就是根节点到叶节点的 **最长路径长度**。
由于排序算法应该对初始的所有可能的排列都给出正确的答案，叶节点的个数至少是 $n!$。高度为 $h$ 的二叉树最多有 $2^{h}$ 个叶子，因此有
$$
2^{h}\geq n!
$$
因此我们有路径长度的下界：
$$
T(n)=\Omega(h)=\Omega(\log (n!))=\Omega(n\log n)
$$


