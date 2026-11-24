
## 寄存器（Register）

种类：
- SISO（Serial-in to Serial-out）
- SIPO（Serial-in to Parallel-out）
- PISO（Parallel-in to Serial-out）
- PIPO（Parallel-in to Parallel-out）
方向：
- 左移位（Left shift）
- 右移位（Right shift）
- 旋转（Rotate left/right）
- 双向（Bidirectional）
也有通用寄存器（Universal shift register）
可以用 FF 来实现，所有的 FF 都由同一个时钟信号驱动。

4-bit SISO Register：
![[Standard Component 2 - 标准组件（时序电路）.png|653]]数据会在每一个时钟周期往右传递一位。

4-bit PISO Register：
![[Standard Component 2 - 标准组件（时序电路）-1.png|647]]
4-bit PIPO Register：
![[Standard Component 2 - 标准组件（时序电路）-2.png]]但是这种实现方法，会让输出在时钟上升沿始终与输入同步。为了实现 load 的功能，可以使用多路选择器，把 $Q$ 再接回 FF 的输入端口，实现用一个 load 信号来控制是透传还是维持：
![[Standard Component 2 - 标准组件（时序电路）-3.png|587]]
Universal shift register：可以双方向移位，以及并行 load/out。
![[Standard Component 2 - 标准组件（时序电路）-4.png|605]]具体实现：
![[Standard Component 2 - 标准组件（时序电路）-5.png|433]]
Serial to Parallel Converter：
![[Standard Component 2 - 标准组件（时序电路）-6.png|511]]这里 SIPO 的时钟要更快。

## Sequence Generator

$n$ 个 FF 可以生成一个长度 $N\leq2 ^{n}$ 的序列。
![[Standard Component 2 - 标准组件（时序电路）-7.png|588]]要不停生成某个序列，就需要去设计上图中的组合电路。这就需要我们列出真值表。
例如，要生成序列 10011，需要 3 个 FF，因为 $5\leq2^{3}$。于是可以列出 input Z 与 $Q_{0},Q_{1},Q_{2}$ 的真值表，从而得到表达式 $Z=(Q_{1}Q_{2})'$，最后完成整个序列生成器。
![[Standard Component 2 - 标准组件（时序电路）-8.png]]再比如，要生成 110101，按同样的方法画真值表，会发现有同样的两个状态，对应不同的次态。
![[Standard Component 2 - 标准组件（时序电路）-9.png|367]]因此，三个 FF 是不够的，需要四个。
![[Standard Component 2 - 标准组件（时序电路）-10.png]]