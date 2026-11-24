
时序逻辑相比于组合逻辑，就是：输出不仅取决于输入，还取决于电路当前的状态。那么就必须要有一个寄存的单元，把电路的当前状态存下来。
![[Sequential Logic - 时序逻辑.png|473]]
分为：
- 同步时序电路：依赖于离散的时间。
- 异步时序电路：依赖于每一个瞬间的状态。

同步时序电路需要一个时钟模块，输出只被时钟的脉冲影响。

## 锁存器（Latch）

### SR Latch

Set / Reset Latch 可以存 1 bit 的信号。

![[Sequential Logic - 时序逻辑-1.png|468]]

两种可用的状态：
- Set：$Q=1,Q'=0$
- Reset: $Q=0,Q'=1$

分析：
- 若 $R=1,S=0$，由于 NOR Gate 的性质，容易发现，会形成稳定状态 $Q=0,Q'=1$。
- 若 $R=0,S=1$，由于 NOR Gate 的性质，容易发现，会形成稳定状态 $Q=1,Q'=0$。
- 若 $R=0,S=0$。假设此时 $Q=0,Q'=1$，那么会发现电路状态不改变；假设此时 $Q=1,Q'=0$，那么会发现电路状态也不会改变。（会保持原来的状态）。
- 若 $R=1,S=1$。发现此时 $Q=0,Q'=0$，我们**禁止**这种情况。

因此 SR Latch 的 function table 就是：

| $S$ | $R$ | $Q$ | $Q'$ |  |
| --- | --- | --- | --- | --- |
| 0 | 0 | last $Q$ | last $Q'$ | no change |
| 0 | 1 | 0 | 1 | reset state |
| 1 | 0 | 1 | 0 | set state |
| 1 | 1 | 0 | 0 | forbidden |

时序图：

![[Sequential Logic - 时序逻辑-3.png|396]]


### S'R' Latch

这是一个 Low Active 的 Latch。

![[Sequential Logic - 时序逻辑-4.png|429]]

进行分析可知，它的 function table 就是：

![[Sequential Logic - 时序逻辑-5.png|475]]

这也就是把 SR Latch 的输入信号改成低电平有效。

### Clocked SR Latch

用 Clock / En 信号来启用/禁用 一个 SR Latch。

电路图：只需要在一个 SR Latch 的基础上，把 S, R 信号 AND 上这个 使能信号 即可。

![[Sequential Logic - 时序逻辑-6.png|411]]

Function Table:

| $C$ | $S$ | $R$ | $Q$ | $Q'$ |  |
| --- | --- | --- | --- | --- | --- |
| 0 | X | X | last $Q$ | last $Q'$ | no change |
| 1 | 0 | 0 | last $Q$ | last $Q'$ | no change |
| 1 | 0 | 1 | 0 | 1 | reset state |
| 1 | 1 | 0 | 1 | 0 | set state |
| 1 | 1 | 1 | 0 | 0 | forbidden |

### D Latch / Transparent Latch

只保留一个输入信号 D，来保障送入 SR Latch 中的 S, R 是反向的；再用 Clock 信号来做 no change 的情况。最后的效果就是，C=0 则 Q 不变，C=1 则 Q 与 D 相同。

![[Sequential Logic - 时序逻辑-8.png|587]]

简化图为：

![[Sequential Logic - 时序逻辑-9.png|315]]

## Flip-Flop

Latch 是对电平（Level）敏感的；而使用 flip-flop 就可以只对上升沿/下降沿（Edge）敏感。
想要延迟信号，用多个 Latch 串联是不行的；用多个 Flip-flop 串联就可以。
### D Flip-Flop（DFF）

用两个 D Latch 来设计出一个 flip-flop：

![[Sequential Logic - 时序逻辑-10.png]]

这里 M 是 Master D Latch，对低电平敏感；S 是 Slave D Latch，对高电平敏感。

这就保证了：当 CLK=0 时，D 会透传到 P，但是 S 传不过去；当 CLK=1 时，D 传不到 P，而之前存的 P 会透传到 Q。因此，只在**上升沿**的瞬间，D 才会透传到 Q。其他情况 Q 都保持不变。
因此，Function Table 就是：

| $C$ | $D$ | $Q$ | $Q'$ |  |
| --- | --- | --- | --- | --- |
| 0 | X | last $Q$ | last $Q'$ | no change |
| 1 | X | last $Q$ | last $Q'$ | no change |
| $\uparrow$ | 0 | 0 | 1 | $Q$ follows $D$ |
| $\uparrow$ | 1 | 1 | 0 | $Q$ follows $D$ |

Symbol：
![[Sequential Logic - 时序逻辑-12.png|367]]

多个 FF 串联，就可以实现把一个信号延迟几个时间周期传播的效果：
![[Sequential Logic - 时序逻辑-13.png|470]]
这里 X 的值就在第三个时间周期才被 Q3 得到。

也可以使用 3 个 SR Latch 实现 DFF ：
![[Sequential Logic - 时序逻辑-14.png|487]]

用这个可以实现 **异步 Reset 的 DFF：**

![[Sequential Logic - 时序逻辑-15.png]]

也就是说，reset 信号会立即导致 reset。
而 **同步 Reset**，就只会在 clock 上升沿时检查 reset 信号是否被触发。

### 特性表（Characteristic Table）

对于 FF，我们知道 Clock 信号不变的时候，输出的值是不变的；我们只关心上升沿的瞬间。因此，可以把 Function Table 进行简化，只看上升沿时 $Q$ 和 $D$，这里 D 是在第 t 个时间周期， Q 是在第 t+1 个时间周期 的关系：

Function table

| Clk | D   | Q      | Q'      |           |
| --- | --- | ------ | ------- | --------- |
| 0   | X   | last Q | last Q' | no change |
| 1   | X   | last Q | last Q' | no change |
| ↑   | 0   | 0      | 1       | Q follows D |
| ↑   | 1   | 1      | 0       | Q follows D |

Convert to Characteristic table：

D Flip-Flop Characteristic table

| D   | Q(t + 1) |       |
| --- | -------- | ----- |
| 0   | 0        | Reset |
| 1   | 1        | Set   |

这里就有 Characteristic Equation（特性方程 ）：
$$
Q_{t+1}=D' \cdot 0+ D \cdot 1=D
$$
### J-K Flip-Flop

Function Table:

| Clk | $J$ | $K$ | $Q$ | $Q'$ |
| --- | --- | --- | --- | --- |
| 0 | x | x | last $Q$ | last $Q'$ |
| 1 | x | x | last $Q$ | last $Q'$ |
| $\uparrow$ | 0 | 0 | last $Q$ | last $Q'$ |
| $\uparrow$ | 0 | 1 | 0 | 1 |
| $\uparrow$ | 1 | 0 | 1 | 0 |
| $\uparrow$ | 1 | 1 | last $Q'$ | last $Q$ |

写成特性表就是：

| $J$ | $K$ | $Q(t+1)$ |  |
| --- | --- | --- | --- |
| 0 | 0 | $Q(t)$ | No change |
| 0 | 1 | 0 | Reset |
| 1 | 0 | 1 | Set |
| 1 | 1 | $Q'(t)$ | Complement |

从而，特性方程：
$$
Q_{t+1}=J'K'Q_{t}+J'K\cdot0+JK'\cdot1+JKQ'_{t}=\dots=JQ_{t}'+K'Q_{t}
$$

Symbol：
![[Sequential Logic - 时序逻辑-19.png|347]]

JKFF 可以通过 DFF 实现。
这是因为，从特性方程上看：
$$
Q_{t+1}=D=JQ_{t}'+K'Q_{t}
$$
那只需要把 $JQ_{t}'+K'Q_{t}$ 接到 DFF 的 $D$ 上即可。
![[Sequential Logic - 时序逻辑-20.png]]

### T Flip-Flop

T: Toggle. 功能就是，当 $T=0$ 时，上升沿处输出保持不变；当 $T=1$ 时，上升沿处输出取反。也就是说：
$$
Q_{t+1}=T'Q_{t}+TQ'_{t}=T \oplus Q_{t}
$$
这可以用 DFF 实现，也可以用 JKFF 实现。
![[Sequential Logic - 时序逻辑-21.png]]
## 分析同步时序电路

用 Flip-Flop 实现的同步时序电路：

![[Sequential Logic - 时序逻辑-22.png]]

一个 Flip-Flop 可以存 1 bit 的状态。

分析步骤：
- 推导 FF 的 input equation
- 推导 state & output equations
- 生成 state & output tables
- 生成 state diagram

例如这个电路：
![[Sequential Logic - 时序逻辑-23.png|368]]
- FF 的 input equation：
$$
D_{A}=Q_{A}x+Q_{B}x,\quad D_{B}=Q_{A}'x
$$
- State equation：
$$
\begin{aligned}
&Q_{A}(t+1)=D_{A}(t)=Q_{A}(t)x(t)+Q_{B}(t)x(t) \\
&Q_{B}(t+1)=D_{B}(t)=Q_{A}'(t)x(t)
\end{aligned}
$$
- Output equation：
$$
y(t)=(Q_{A}(t)+Q_{B}(t))x'(t)\leftrightarrow y=(Q_{A}+Q_{B})x'
$$
- 从而得到 state table：

*First Form of the State Table*

| Present State $Q_AQ_B$ | Input $x$ | Next State $Q_AQ_B$ | Output $y$ |
| :---: | :---: | :---: | :---: |
| 00 | 0 | 00 | 0 |
| 00 | 1 | 01 | 0 |
| 01 | 0 | 00 | 1 |
| 01 | 1 | 11 | 0 |
| 10 | 0 | 00 | 1 |
| 10 | 1 | 10 | 0 |
| 11 | 0 | 00 | 1 |
| 11 | 1 | 10 | 0 |

*Second Form of the State Table*

| Present State $Q_AQ_B$ | Next State ($x=0$) | Next State ($x=1$) | Output $y$ ($x=0$) | Output $y$ ($x=1$) |
| :---: | :---: | :---: | :---: | :---: |
| 00 | 00 | 01 | 0 | 0 |
| 01 | 00 | 11 | 1 | 0 |
| 10 | 00 | 10 | 1 | 0 |
| 11 | 00 | 10 | 1 | 0 |

- 进一步可以画出 state diagram：
![[Sequential Logic - 时序逻辑-25.png|399]]
这里每一个节点表示 $Q_{A},Q_{B}$ 的值（也就是一个状态），一条边表示从一个状态到下一个状态，边上写这个状态转移发生时的 input / output。

其他例子：
- 用 JKFF 实现的电路：
![[Sequential Logic - 时序逻辑-26.png|455]]

![[Sequential Logic - 时序逻辑-27.png|512]]
- 用 TFF 实现的电路
![[Sequential Logic - 时序逻辑-28.png|478]]
![[Sequential Logic - 时序逻辑-29.png|469]]

## 有限状态机（Finite State Machine）

有两种模型：
- Moore FSM（输出只和当前状态有关）
- Mealy FSM（输出和当前状态以及输入有关）

![[Sequential Logic - 时序逻辑-30.png|490]]

可以从 state diagram 去理解：
![[Sequential Logic - 时序逻辑-31.png|449]]

### 化简

若有些状态在 state table 中对应的 next state 和 output 都一模一样，那么可以只保留其中一个，把表中用到 **去掉的状态** 的地方直接换成保留的那个就行。输出会是等效的，例如：

![[Sequential Logic - 时序逻辑-32.png]]

### 赋值（Assignment）

在上面的表里面，化简后有五种状态 $a,b,c,d,e$，它们可以根据实际的用途进行具体的赋值。例如这样的三种：

*Three Possible Binary State Assignments*

| State | Assignment 1, Binary | Assignment 2, Gray Code | Assignment 3, One-Hot |
| :---: | :---: | :---: | :---: |
| $a$ | 000 | 000 | 00001 |
| $b$ | 001 | 001 | 00010 |
| $c$ | 010 | 011 | 00100 |
| $d$ | 011 | 010 | 01000 |
| $e$ | 100 | 110 | 10000 |

*Reduced State Table with Binary Assignment 1*

| Present State | Next State ($x=0$) | Next State ($x=1$) | Output ($x=0$) | Output ($x=1$) |
| :---: | :---: | :---: | :---: | :---: |
| 000 | 000 | 001 | 0 | 0 |
| 001 | 010 | 011 | 0 | 0 |
| 010 | 000 | 011 | 0 | 0 |
| 011 | 100 | 011 | 0 | 1 |
| 100 | 000 | 011 | 0 | 1 |


### 激励表（Excitation Table）

把 Characteristic Table 反过来，也就是去列出每个输出对应的输入。
![[Sequential Logic - 时序逻辑-34.png]]

## 设计时序电路

也就是把分析步骤反过来。
1. Specification: design description or timing diagram
2. Formulation: develop state diagram
3. Generate state and output tables
4. Minimize States if necessary
5. Assign binary values to the state (encoding)
6. Derive state and output equations
7. Choose memory elements (DFFs, JKFFs, TFFs)
8. Derive simplified input equations and output equations
9. Draw logic schematic

例如：用 JKFF 实现这个真值表：

| Present $A$ | Present $B$ | Input $x$ | Next $A$ | Next $B$ |
| --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 | 1 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 1 | 1 |
| 1 | 1 | 0 | 1 | 1 |
| 1 | 1 | 1 | 0 | 0 |

那么可以结合 excitation table 得到 JKFF 的输入：

| Present $A$ | Present $B$ | Input $x$ | Next $A$ | Next $B$ | $J_A$ | $K_A$ | $J_B$ | $K_B$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 0 | 0 | 0 | 0 | 0 | 0 | X | 0 | X |
| 0 | 0 | 1 | 0 | 1 | 0 | X | 1 | X |
| 0 | 1 | 0 | 1 | 0 | 1 | X | X | 1 |
| 0 | 1 | 1 | 0 | 1 | 0 | X | X | 0 |
| 1 | 0 | 0 | 1 | 0 | X | 0 | 0 | X |
| 1 | 0 | 1 | 1 | 1 | X | 0 | 1 | X |
| 1 | 1 | 0 | 1 | 1 | X | 0 | X | 0 |
| 1 | 1 | 1 | 0 | 0 | X | 1 | X | 1 |

再结合卡诺图得到 input equation，就可以进一步去做实现了。



