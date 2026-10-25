组合逻辑中，任何时候的输出只与当前的输入有关；而时序逻辑中，还与先前的输入有关。
- 无记忆性（Memoryless）：$o=f(i)$ (o 为输出，i 为输入)
- 使用真值表 + K-map 或是代数化简，来让这个布尔函数更简单。

分析
- 真值表
- 代数

设计
- 细化问题
- 形式化 -> 真值表
- 优化 -> 卡诺图
- 画 Logic Diagram

对于有多个输出的电路，为了简化，我们可以把它们卡诺图共有部分单独圈出来以减少 gate 的使用：
![[Combinational Logic - 组合逻辑-4.png|460]]


**Gate Delay.** 逻辑门存在传播延迟（Propagation Delay），即输出的变化会滞后于输入。
**Timing Hazard / Glitches（毛刺）.** 由于不同路径的传播延迟不同，在电路的特定情况下会产生跳变，跳变到错误的状态，这时又恰好进行了采样，就会发生不想要的结果。
- static 1 hazard
- static 0 hazard
例如这里 $F$ 本不应该变化，但是因为 D 与 E 是不同步的，导致有一段时间，$F$ 发生了变化。这就是一个 static 1 hazard.
![[Combinational Logic - 组合逻辑-1.png|555]]
**Remark:** 对 static 1 hazard，若输入变化对应的两个相邻 1 不在同一个圈内，就存在毛刺风险（见上图，从紫色的圈跳到了黄色的圈）。可以增加一个覆盖这两个 1 的冗余圈来消除该风险。
![[Combinational Logic - 组合逻辑-2.png|342]]
上面是 static 1 hazard。
对于 static 0 hazard，若两个相邻 0 不在同一个圈内，也存在毛刺风险。可以增加覆盖它们的冗余 0 圈来消除该风险。例如：
![[Combinational Logic - 组合逻辑-3.png|324]]


## 仿真与测试

4 值仿真器：
- 0(low), 1(high), X(unknown), Z(high impedance)

