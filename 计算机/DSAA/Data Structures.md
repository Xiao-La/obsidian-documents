
数据结构（Data Structures）是用来维护 **动态集合（Dynamic sets）** 的技术。集合中的每个元素包含：
- Key。用来唯一确定这个元素。
- Satellite data。不被数据结构维护的数据。
- Attributes。被数据结构维护的数据。
这里 Key 通常来自一个全序集（Totally Ordered Set），例如正整数集。
- 这样，就会有最小/最大的 key，每个 key 也会有前驱/后继。
常见的操作：
- **Search(S, k)**：返回 key 为 k 的元素的 pointer。
- **Insert(S, x)**：把 pointer $x$ 指向的元素加到 $S$ 里 。
- **Delete(S, x)**：把 pointer $x$ 指向的 $S$ 中的元素从 $S$ 中删掉。
- **Minimum(S), Maximum(S)** ：返回 key 最小/最大的元素的 pointer。
- **Successor(S, x), Predecessor(S, x)** ：返回比 pointer $x$ 指向的元素的 key  的下一个更大/更小的元素的 pointer。
## 基本数据结构

### 栈（Stack）

后进先出（last-in, first-out / LIFO）。可以用数组实现：

```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Stack-Empty}{$S$}
    \If{$S.\mathit{top} == 0$}
      \Return $\textsc{true}$
    \Else
      \Return $\textsc{false}$
    \EndIf
  \EndProcedure
  \Procedure{Push}{$S, x$}
    \State $S.\mathit{top} = S.\mathit{top} + 1$
    \State $S[S.\mathit{top}] = x$
  \EndProcedure
  \Procedure{Pop}{$S$}
    \If{\Call{Stack-Empty}{$S$}}
      \State \textbf{error} “underflow”
    \Else
      \State $S.\mathit{top} = S.\mathit{top} - 1$
      \Return $S[S.\mathit{top} + 1]$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

### 队列（Queue） 

先进先出（first-in, first-out / FIFO）。也可以用数组实现：

```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Enqueue}{$Q, x$}
    \State $Q[Q.\mathit{tail}] = x$
    \If{$Q.\mathit{tail} == Q.\mathit{length}$}
      \State $Q.\mathit{tail} = 1$
    \Else
      \State $Q.\mathit{tail} = Q.\mathit{tail} + 1$
    \EndIf
  \EndProcedure
  \Procedure{Dequeue}{$Q$}
    \State $x = Q[Q.\mathit{head}]$
    \If{$Q.\mathit{head} == Q.\mathit{length}$}
      \State $Q.\mathit{head} = 1$
    \Else
      \State $Q.\mathit{head} = Q.\mathit{head} + 1$
    \EndIf
    \Return $x$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

这些操作都是 $O(1)$ 的。

### 优先队列（Priority Queues）

用一个堆来实现。这里就是把出队操作变成弹出具有最大/最小的 key 的元素。另外，以最大堆实现的 max-priority queue为例，还可以支持增大一个元素的 key，只需要 float up 即可。
- **handle:** 把一个对象与它在一个数据结构（比如堆）中的位置映射起来。在操作中我们也要去维护每个对象的 handle。
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Max-Heap-Maximum}{$A$}
    \If{$A.\mathit{heap}\text{-}\mathit{size} < 1$}
      \State \textbf{error} “heap underflow”
    \EndIf
    \Return $A[1]$
  \EndProcedure
  \Procedure{Max-Heap-Extract-Max}{$A$}
    \State $\mathit{max} =$ \Call{Max-Heap-Maximum}{$A$}
    \State $A[1] = A[A.\mathit{heap}\text{-}\mathit{size}]$
    \State $A.\mathit{heap}\text{-}\mathit{size} = A.\mathit{heap}\text{-}\mathit{size} - 1$
    \State \Call{Max-Heapify}{$A, 1$}
    \Return $\mathit{max}$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Max-Heap-Increase-Key}{$A, x, k$}
    \If{$k < x.\mathit{key}$}
      \State \textbf{error} “new key is smaller than current key”
    \EndIf
    \State $x.\mathit{key} = k$
    \State find the index $i$ in array $A$ where object $x$ occurs
    \While{$i > 1$ and $A[$\Call{Parent}{$i$}$].\mathit{key} < A[i].\mathit{key}$}
      \State exchange $A[i]$ with $A[$\Call{Parent}{$i$}$]$, updating the information that maps priority queue objects to array indices
      \State $i =$ \Call{Parent}{$i$}
    \EndWhile
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Max-Heap-Insert}{$A, x, n$}
    \If{$A.\mathit{heap}\text{-}\mathit{size} == n$}
      \State \textbf{error} “heap overflow”
    \EndIf
    \State $A.\mathit{heap}\text{-}\mathit{size} = A.\mathit{heap}\text{-}\mathit{size} + 1$
    \State $k = x.\mathit{key}$
    \State $x.\mathit{key} = -\infty$
    \State $A[A.\mathit{heap}\text{-}\mathit{size}] = x$
    \State map $x$ to index $\mathit{heap}\text{-}\mathit{size}$ in the array
    \State \Call{Max-Heap-Increase-Key}{$A, x, k$}
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

这些操作最多都是 $O(\log n)$ 的。

### 链表（Linked List）：

除了 key，还对每一个元素 $x$ 存两个 attribute：$x.prev$ 和 $x.next$，分别指向 $x$ 的前驱和后继，这就是双向链表（doubly linked list）。若只存后继，那就是单向链表（singly linked list），把列表的头（head）和尾（tail）接起来，就会有循环链表（circular list）。
一个双向链表：
![[Data Structures-8.png]]
一些支持的操作：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{List-Search}{$L, k$}
    \State $x = L.\mathit{head}$
    \While{$x \ne \textsc{nil}$ and $x.\mathit{key} \ne k$}
      \State $x = x.\mathit{next}$
    \EndWhile
    \Return $x$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{List-Insert}{$L, x$}
    \State $x.\mathit{next} = L.\mathit{head}$
    \If{$L.\mathit{head} \ne \textsc{nil}$}
      \State $L.\mathit{head}.\mathit{prev} = x$
    \EndIf
    \State $L.\mathit{head} = x$
    \State $x.\mathit{prev} = \textsc{nil}$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{List-Delete}{$L, x$}
    \If{$x.\mathit{prev} \ne \textsc{nil}$}
      \State $x.\mathit{prev}.\mathit{next} = x.\mathit{next}$
    \Else
      \State $L.\mathit{head} = x.\mathit{next}$
    \EndIf
    \If{$x.\mathit{next} \ne \textsc{nil}$}
      \State $x.\mathit{next}.\mathit{prev} = x.\mathit{prev}$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
如果我们创建一个 dummy 的 sentinel 元素，记为 $L.nil$，令它的后继为 head，前驱为 tail，那么就得到一个双向的循环链表，这里上述的代码可以简化，因为一些边界情况不用考虑了。

这里插入和删除一个已知的元素都是 $O(1)$ 的。搜索是 $O(n)$ 的。

## 二叉树（Binary Tree）

递归定义：二叉树（Binary Tree）是一个有限节点的集合，使得
- 树是空的
- 或：由根节点，左子树，右子树组成
一些术语：
- left/right child
- parent
- path
- leaf / internal node
- siblings, parents, ancestor, descendant
- depth：从根节点到这个节点的简单路径长度
- level：同一个深度的节点
- height：从这个节点到一个叶节点的（向下的）最长路径的长度
- height of a tree：根节点的 height
- full：每一个节点要么是叶节点，要么同时有左右孩子
- complete：full，而且 每一个叶节点在同一个 level
实现：
- 用一个类似链表的结构，每个节点有 attributes T.root, left child pointer, right child pointer, parent pointer，便于遍历。
- 也可以像之前的 heap 那样，用单个数组实现
### 归纳证明

在树上证明一个命题，可以用归纳法：
Base case: 说明对“最小的树”成立（依据具体情况，可能是一个空的树，也可能是一个根节点）
Induction step:  更大的树由根节点，左子树，右子树（可能为空）组成。假设命题对左右子树成立，然后推出对整个树成立。

例如，要证明：一个高度至多为 $h$ 的二叉树有不多于 $2^{h}$ 个叶节点。
- Base case：对于 $h=0$，那要么是空集，要么是一个根节点，所以 $\#(\text{leaves})\leq1=2^{0}$。
- Inductive Step：假设对 $h-1$ 成立，那么对 $h$，左子树和右子树都满足归纳假设，于是对这个树有 $\#(\text{leaves})\leq2 \cdot 2^{h-1}=2^{h}$。
### 二叉搜索树（Binary search tree）

一个二叉树，每个节点 $x$ 满足 binary search tree property：
- $x$ 的左子树的任一节点 $y$ 满足 $y.key\leq x.key$。
- $x$ 的右子树的任一节点 $y$ 满足 $y.key\geq x.key$。

二叉搜索树上的一些操作：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Tree-Search}{$x, k$}
    \If{$x == \textsc{nil}$ or $k == x.\mathit{key}$}
      \Return $x$
    \EndIf
    \If{$k < x.\mathit{key}$}
      \Return \Call{Tree-Search}{$x.\mathit{left}, k$}
    \Else
      \Return \Call{Tree-Search}{$x.\mathit{right}, k$}
    \EndIf
  \EndProcedure
  \Procedure{Iterative-Tree-Search}{$x, k$}
    \While{$x \ne \textsc{nil}$ and $k \ne x.\mathit{key}$}
      \If{$k < x.\mathit{key}$}
        \State $x = x.\mathit{left}$
      \Else
        \State $x = x.\mathit{right}$
      \EndIf
    \EndWhile
    \Return $x$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Tree-Minimum}{$x$}
    \While{$x.\mathit{left} \ne \textsc{nil}$}
      \State $x = x.\mathit{left}$
    \EndWhile
    \Return $x$
  \EndProcedure
  \Procedure{Tree-Maximum}{$x$}
    \While{$x.\mathit{right} \ne \textsc{nil}$}
      \State $x = x.\mathit{right}$
    \EndWhile
    \Return $x$
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Tree-Successor}{$x$}
    \If{$x.\mathit{right} \ne \textsc{nil}$}
      \Return \Call{Tree-Minimum}{$x.\mathit{right}$} \Comment{leftmost node in right subtree}
    \Else \Comment{find the lowest ancestor of $x$ whose left child is an ancestor of $x$}
      \State $y = x.p$
      \While{$y \ne \textsc{nil}$ and $x == y.\mathit{right}$}
        \State $x = y$
        \State $y = y.p$
      \EndWhile
      \Return $y$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

这些的复杂度是 $O(h)$，其中 $h$ 为树的高度。这个树可以很不平衡，甚至退化成一条链，所以最坏是 $\Theta(n)$ 的。
这里找 successor：
- 如果 $x$ 有右子树，那后继就是 $x$ 右子树中的最小元素。
- 如果 $x$ 没有右子树，就不断往上跳，一旦往右跳了一次，就跳到了后继。

```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Tree-Insert}{$T, z$}
    \State $x = T.\mathit{root}$
    \State $y = \textsc{nil}$
    \While{$x \ne \textsc{nil}$}
      \State $y = x$
      \If{$z.\mathit{key} < x.\mathit{key}$}
        \State $x = x.\mathit{left}$
      \Else
        \State $x = x.\mathit{right}$
      \EndIf
    \EndWhile
    \State $z.p = y$
    \If{$y == \textsc{nil}$}
      \State $T.\mathit{root} = z$
    \Elif{$z.\mathit{key} < y.\mathit{key}$}
      \State $y.\mathit{left} = z$
    \Else
      \State $y.\mathit{right} = z$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
单点删除操作要复杂一些。分成三种情况：
- 是叶子节点，那就直接删掉。
- 只有一个孩子，那就用这个孩子代替这个节点。
- 有两个孩子，那么需要用它的后继（也就是右子树的最小元素）来代替它。这是可行的，因为后继不会有左孩子。具体实现这个“代替“还有不少细节，见下面。
具体实现：要先实现一个移植（Transplant）操作，能把 $u$ 为根节点的子树换成 $v$ 为根节点的子树：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Transplant}{$T, u, v$}
    \If{$u.p == \textsc{nil}$}
      \State $T.\mathit{root} = v$
    \Elif{$u == u.p.\mathit{left}$}
      \State $u.p.\mathit{left} = v$
    \Else
      \State $u.p.\mathit{right} = v$
    \EndIf
    \If{$v \ne \textsc{nil}$}
      \State $v.p = u.p$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
这个 操作并不更新 $v$ 的左右孩子，需要手动更新。然后就可以实现删除：
```pseudo
\begin{algorithm}
\begin{algorithmic}
  \Procedure{Tree-Delete}{$T, z$}
    \If{$z.\mathit{left} == \textsc{nil}$}
      \State \Call{Transplant}{$T, z, z.\mathit{right}$} \Comment{replace $z$ by its right child}
    \Elif{$z.\mathit{right} == \textsc{nil}$}
      \State \Call{Transplant}{$T, z, z.\mathit{left}$} \Comment{replace $z$ by its left child}
    \Else
      \State $y =$ \Call{Tree-Minimum}{$z.\mathit{right}$} \Comment{$y$ is $z$'s successor}
      \If{$y \ne z.\mathit{right}$} \Comment{is $y$ farther down the tree?}
        \State \Call{Transplant}{$T, y, y.\mathit{right}$} \Comment{replace $y$ by its right child}
        \State $y.\mathit{right} = z.\mathit{right}$ \Comment{$z$'s right child becomes $y$'s right child}
        \State $y.\mathit{right}.p = y$
      \EndIf
      \State \Call{Transplant}{$T, z, y$} \Comment{replace $z$ by its successor $y$}
      \State $y.\mathit{left} = z.\mathit{left}$ \Comment{and give $z$'s left child to $y$, which had no left child}
      \State $y.\mathit{left}.p = y$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
复杂度仍然是 $O(h)$。

遍历二叉树（tree walk），根据遍历根的时机分成三类：
- 前序（Preorder）：根，左，右。
- 中序（Inorder）：左，根，右。
- 后序（Postorder）：左，右，根。

平衡树（self-balancing trees）通过一些操作让二叉查找树的树高变成 $O(\log n)$ 的。
### AVL Trees

名字来源于发明者：Adelson-Velskii & Landis。
不变量：所有节点都是局部平衡的。
- 对于每个节点，左子树的树高和右子树的树高最多差 1。
- 也就是说，对于每个节点 $v$，左右子树分别为 $T_{l},T_{r}$，定义平衡因子（Balance Factor）：
$$
bal(v)=h(T_{l})-h(T_{r})
$$
- 那么 AVL 树需要保证 $bal(v)\in \{ -1,0,1 \}$ 对任意节点 $v$。

**定理：** 令 $\varphi= \frac{\sqrt{5}+1}{2}$，那么 $n$ 个节点的 AVL 树的树高满足
$$
h\leq \frac{\log n}{\log \varphi} 
$$
证明：
- 设 $A(h)$ 表示，高度为 $h$ 的 AVL 树中，最少有多少个节点。那么，对于任意的有 $n$ 个节点且高度为 $h$ 的 AVL 树，都有 $n\geq A(h)$。
- 显然 $A(0)=1$，$A(1)=2$。
- 对于 $h\geq 2$，则必须由一个根节点，一个高度为 $h-1$ 的子树，和一个高度至少为 $h-2$ 的子树组成，于是
$$
A(h)=1+A(h-1)+A(h-2)
$$
- 这里有 $A(h)=Fib(h+2)-1$，其中 $Fib(k)$ 为下标从零开始的斐波那契数列（$Fib(0)=Fib(1)=1$）。这可以用归纳证明。
-  根据斐波那契数列的闭式公式，有不等式
$$
Fib(k)\geq \frac{1}{\sqrt{5} }\left[ \varphi^{k+1}-1 \right]
$$
- 因此，有
$$
n\geq A(h)= Fib(h+2)-1\geq \frac{1}{\sqrt{5} }\left[ \varphi^{h+3}-1 \right]-1
$$
- 化简得到
$$
\sqrt{5}n+\sqrt{5}+1 \geq \varphi ^{h+3}
$$
- 因此
$$
h \leq  \frac{\log(\sqrt{5}n+\sqrt{5}+1)}{\log \varphi}-3\leq \frac{\log n}{\log \varphi}
$$

**插入操作。** 插入 $z$，先按正常的 BST 去做；考虑搜索路径，我们从下至上回溯搜索路径，同时做 **重新平衡**。考虑做到了节点 $v$ ，假设它的**右孩子** $x$ **在搜索路径上**（左孩子的情况是对称的）。那么有三种情况：
- $bal(v)=1$。那么，只需要设 $bal(v)=0$ 即可。并且，$v$ 这个子树的高度没变，所以不需要再向上回溯了。![[Data Structures.png|529]]
- $bal(v)=0$。那么，只需要设 $bal(v)=-1$ 即可。这时候 $v$ 这个子树的高度增加了，所以还需要向上回溯，除非 $v$ 已经是根节点了。
- $bal(v)=-1$，那么插入之后，这个子树变得不平衡了！考虑搜索路径上向下连着的三个节点 $v,x,w$。分两种情况：
  - $w$ 是 $x$ 的右孩子。那么我们需要向左旋转（rotate）这个树：令 $x$ 为 $v$ 的 parent，令 $x$ 的左子树变成 $v$ 的右子树，那么操作之后 $bal(x)=bal(v)=0$。旋转后也不需要再向上回溯。![[Data Structures-9.png|544]]
  - $w$ 是 $x$ 的左孩子。可以先在 $x$ 处右旋一次，再在 $v$ 处左旋一次。这里，最后的结果会是 $w$ 成为了根节点，且 $bal(w)=0$。若初始 $bal(w)=-1$，那么结果（如下图）为 $bal(v)=1,bal(x)=0$。若初始 $bal(w)=1$，那么结果为 $bal(v)=0,bal(x)=-1$。若初始 $bal(w)=0(w=z)$，那么 $bal(v)=bal(x)=0$。![[Data Structures-10.png|540]]
**删除操作。** 类似地，我们正常按 BST 删完之后，我们回溯搜索路径。这里不妨假设删除减少了 **左子树** 的树高（右子树是对称的）。分三种情况：
- $bal(v)=1$，那么只需要设 $bal(v)=0$ 即可。这里 $v$ 子树的高度减少了，所以需要继续向上回溯。
- $bal(v)=0$，那么只需要设 $bal(v)=-1$ 即可。这里 $v$ 子树的高度没变，所以不需要再向上回溯。
- $bal(v)=-1$。那么左子树会变得比右子树的树高少 $2$！考虑 $v$ 的右孩子 $x$（也就是较高的那一侧）。有两种情况：
  - $bal(x)\in \{ -1,0 \}$。那么在 $v$ 处向左旋转就好了。这里若 $bal(x)=0$，那么最后 $bal(v)=-1,bal(x)=1$，树高没变，就不用向上回溯了。若 $bal(x)=-1$，那么最后 $bal(v)=bal(x)=0$，还需要向上回溯，因为树高变了。![[Data Structures-11.png|568]]
  - $bal(x)=1$。需要两次旋转，旋转完也还要向上回溯。![[Data Structures-12.png|560]]