
## 堆排序（Heap Sort）

用堆这种数据结构来加速选择排序的过程。
可以把数组对应到一个二叉树（Binary Tree）。
- 下标的对应关系： $\text{Parent}(i)= \lfloor i / 2 \rfloor,\text{Left}(i)=2i,\text{Right}(i)=2i+1$。

大根堆：一个二叉树，具有 Max-heap Property：
$$
A[\text{Parent}(i)]\geq A[i]
$$
![[Sorting.png|471]]
小根堆，一个二叉树，具有 Min-heap Property：
$$
A[\text{Parent}(i)]\leq A[i]
$$
以大根堆为例，堆排序的步骤：
- 从一个无序的数组建立堆。（Build-Max-Heap）
- 不断拿出堆顶的最大元素放到数组的末尾，然后维护堆的性质（Max-Heapify）。这里用 $A.\text{heap-size}$ 表示还没有放到末尾的元素个数。

$\text{Max-Heapify}(A,i)$：假设 $\text{Left}(i),\text{Right}(i)$ 都是大根堆，但 $i$ 处可能破坏堆的性质。那么，可以通过不断向下调整（"float down"），把 $i$ 与它的**较大的**子节点（如果比 $i$ 大）交换，不断递归地重复即可。
![[Sorting-1.png|493]]
运行时间：我们说树中一个节点的高度（height）是它到叶子节点的最长简单路径的长度。那么若 $i$ 的高度为 $h$，则运行时间是 $O(h)$ 的。（不是 $\Omega (h)$，因为可能提前停下）这里 $h$ 最多是 $\log n$，因为 $h$ 层的二叉树至少有 $1+2+4+\dots+2^{h-1}+1=2^{h}$ 个节点。
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