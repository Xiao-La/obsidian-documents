
## 拓扑基础

前置： [[Set and Function - 集合与函数]]

**开子集（Open Subset）**：我们把集合 $X$ 的**幂集** $\mathscr{P}$ **划分为两部分**，一部分是 $X$ 的开子集，剩下的部分为 $X$ 的非开子集。
这里开子集的那一部分，就是 $X$ 的一个**拓扑（Topology）**，记作 $\mathscr{T}$。这个划分也要满足三个基本性质：
- **空集与全集。** 
$$\varnothing, X\in \mathscr{T}$$
- **有限个开子集之交也是开子集。** 
$$O_{i}\in \mathscr{T},i=1,2, \dots,n\to \bigcap _{i}O_{i}\in \mathscr{T}$$
- **任意个开子集之并也是开子集。**
$$
O_{\alpha}\in \mathscr{T},\forall \alpha\to \bigcup _{\alpha}O_{\alpha}\in \mathscr{T}
$$
一个集合配上它的一个拓扑，记为  $(X,\mathscr{T})$ ，就是一个**拓扑空间（Topological Space）**。
一些特殊的拓扑空间：
- **离散拓扑。**$(X,\mathscr{T}=\mathscr{P})$，开子集最多。
- **凝聚拓扑。**$(X,\mathscr{T}=\{ \varnothing ,S\})$，开子集最少。
- 对 $X=\mathbb{R}^{n}$：先定义开球（Open Ball）：
$$
B(x_{0},r)=\{ x\in \mathbb{R}^{n}| \lvert x-x_{0} \rvert<r \}
$$
- 其中 $\lvert x-x_{0} \rvert$ 表示 $x$ 与 $x_{0}$ 之间的欧氏距离。
- 那么可以定义 **通常拓扑** 为所有 **可表示为开球之并** 的子集，记作 $\mathscr{T}_{u}$。
- 对 $\mathbb{R}^{2}$ 就是开圆盘（Open Disk），对 $\mathbb{R}^{1}$ 就是开区间（Open Interval）。

**诱导拓扑（Induced Topology）**：当我们有 $X$ 的子集 $A$，可以从 $X$ 的拓扑 $\mathscr{T}$ 得到子集 $A$ 的一个拓扑
$$
\mathscr{S}:=\{ V \subseteq A \mid \exists O \in \mathscr{T},\, V=O\cap A \}
$$

定义拓扑空间之间的映射 $f:(X,\mathscr{T})\to (Y,\mathscr{S})$ 的 **连续性**（记作 $C^{0}$）：
$$
O\in \mathscr{S}\to f^{-1}[O]\in \mathscr{T}
$$
这里 $f^{-1}[O]$ 表示 $O$ 的所有元素对应的原像组成的集合。
- 考虑 $f:\mathbb{R}\to \mathbb{R}$ 一元函数，上述定义和通常的 $\varepsilon-\delta$ 语言是等价的：陪域的一个开区间的“逆像”是定义域中开区间的并。

定义 **同胚（Homeomorphism）**：我们说两个拓扑空间是**相互同胚**的，若它们之间存在双射，且这个映射及其逆映射都是连续的。这个映射就叫做**同胚映射**，简称**同胚**。
- 几何直观上看，对一个几何对象不剪，不粘地变换，就和原来是相互同胚的。