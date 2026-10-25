
## 译码器（Decoder）


**One-hot Representation.** 用 $n$ 个 bit 的比特串表示 $n$ 个元素，每串都只有一个 bit 为 1，其他 bit 为 0（或是反过来）。

例如： **3-to-8-Line Decoder.**
![[Standard Component - 标准组件.png|538]]
可以用框图来省略 decoder 内部的内容。
![[Standard Component - 标准组件-1.png]]
这种 decoder 实际上生成了所有的 minterm。把它们连出来可以造出 SOM 形式的输出。

其他 decoder 的例子：
- BCD 码翻译到数码管的七段信号。
- 地址译码。

例：一个 decoder 可以得到 minterm 的取反，那对 $F=\sum(0,1,2,5,6)$，我们可以：
- $F=(F')'=((m_{0}+m_{1}+m_{2}+m_{5}+m_{6})')'=(m_{0}'\cdot m_{1}'\cdot m_{2}'\cdot m_{5}'\cdot m_{6}')'$，那么只需要接对应的信号出来，做一个 NAND gate 即可。
- $F=\prod (3,4,7)=m_{3}'\cdot m_{4}'\cdot m_{7}'$ ，选出对应的信号，做一个 AND gate 即可。

使能信号 Decoder (Enable)：有一个 Enable 信号，控制电路是否生效。
反向的 Enable（Active Low）

![[Standard Component - 标准组件-2.png]]

两个 3x8 decoder（带 enable 信号）可以拼成一个 4x16 decoder：
![[Standard Component - 标准组件-3.png]]
这里通过 $w$ 控制使能信号：$w=0$ 时上面的 decoder 使能，$w=1$ 时下面的 decoder 使能。

其他：BCD-to-7-Segment Display Decoder

## 多路选择器（Multiplexers, MUX)

MUX 从许多的（通常是 $2^{n}$）输入信号中，根据 $n$ 位的选择信号 S 来选择其中的 1 个，送到一个单个的输出信号。
例如一个 2:1 MUX：
![[Standard Component - 标准组件-4.png|210]]
例如一个 4:1 MUX：
![[Standard Component - 标准组件-5.png|198]]
具体实现上，生成选择信号的就是 Decoder。所以可以看成：
- MUX = Decoder + OR gate

MUX 可以用来实现某个真值表。例如要实现 AND gate：

![[Standard Component - 标准组件-6.png]]

只需要把输入信号当成选择信号，然后把 MUX 的输入变成常量，表示真值表的对应行。
一种更简单的实现方法，只需要用 2:1 MUX：

![[Standard Component - 标准组件-7.png|530]]
类似的，一个 3 输入的真值表，也可以从 8:1 MUX 化简成 4:1 MUX 来实现。
![[Standard Component - 标准组件-8.png|445]]
如果再化简呢？用 2:1 MUX，也可以实现：
![[Standard Component - 标准组件-9.png|430]]

另一方面，也可以用小的 MUX 去直接实现更宽的 MUX。例如下图中用 3 个 2:1 MUX 实现了一个 4:1 MUX。
![[Standard Component - 标准组件-10.png|488]]

## 编码器（Encoder）

把 one-hot representation 转换为二进制。然而这里的问题就是，如果输入不合法，也就是说，不止一个信号为 1，该如何处理？我们使用 Priority Encoder：
![[Standard Component - 标准组件-11.png]]
令 $D_{3}$ 具有最高的 priority，也就是说，只要 $D_{3}$ 为 $1$，输出就是 $3$。$D_{3}$ 为 $0$ 且 $D_{2}$ 为 $1$ 时，输出就是 $2$，以此类推。
写出这样的真值表之后，可以用卡诺图来找到对应的 $x,y$ 的表达式。

