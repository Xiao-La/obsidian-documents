## Binary Logic

逻辑门的真值表/符号/画图：
![[Boolean Algebra - 布尔代数-6.png|479]]
![[Boolean Algebra - 布尔代数-7.png|483]]
逻辑门（AND, OR, NOT, NAND, NOR, XOR）。
0, 1; L, H; T, F。

## Boolean Algebra

- 二进制变量组成的集合 $S$
- 运算符集合：AND ($\cdot$), OR (+), NOT (')
- 一些公理和定理
公理和定理都保持对偶性（Duality）。
- 把 $\cdot$ 替换为 $+$，同时把 $0$ 替换为 $1$，等号仍然成立。
 ![[Boolean Algebra - 布尔代数.png|474]]
运算优先级
- 括号>NOT>AND>OR

![[Boolean Algebra - 布尔代数-1.png|473]]

这些定理可以用真值表或代数方法证明。

布尔函数（Boolean Functions）：一个布尔代数的表达式，可以用一个逻辑门组成的逻辑图表示。
- Literal：一个变量或它的补。
- Product Term：把 Literals 用 $\cdot$ 连接。
- Sum Term：把 Literals 用 $+$ 连接。
每个布尔函数都有且只有一种真值表的表达方式，但有很多种代数表达方式，也就是多种逻辑门的实现方式。例如：
- $F_{1}=x'y'z+x'yz+xy', F_{2}=xy'+x'z$，这两个函数是等价的，具有相同的真值表。
- $F_{2}$ 的 Literals 和 Terms 都更少，所以采用 $F_{2}$ 的电路更简洁更经济。

布尔函数 $F$ 的补（Complement）$F'$ ：
- 先取对偶式（Dual）：把 $\cdot$ 与 $+$ 相互替换，把 $0$ 和 $1$ 相互替换；
- 再把每个 Literal 取反。
- 例如， $F=x'y'z+x'yz+xy'$，那么 $F'=(x+y+z')(x+y'+z')(x'+y)$。

- 最小项（Minterm）：包含了所有的 Literals （包括补的形式）的 AND 项。
  - 例如，对两个变量 $x,y$ ，最小项： $x'y',x'y,xy',xy(m_{0}\sim m_{3})$。 
- 最大项（Maxterm）：包含了所有的 Literals （包括补的形式）的 OR 项。
  - 例如，对两个变量 $x,y$ ，最大项： $x+y,x+y',x'+y,x'+y'(M_{0}\sim M_{3})$。 
这个编号就是对应变量的十进制值。另外有 $M_{i}=m_{i}'$。
![[Boolean Algebra - 布尔代数-2.png|521]]
Standard Form（不唯一）
- Sum of product (sop) 例如 $F=y'+xy+x'yz'$
- Product of sum (pos) 例如 $F=x(y'+z)(x'+y+z')$

那么一个真值表可以表达成 Canonical Form（唯一）：
- Sum-of-minterms (som)。
- Product-of-maxterms (pom)。
![[Boolean Algebra - 布尔代数-3.png|69]]
例如这个函数 $F$ 可以写成：
- Som：$F=m_{1}+m_{3}+m_{6}+m_{7}=\sum(1,3,6,7)$
- Pom：$F=(x+y+z)(x+y'+z)(x'+y+z)(x'+y+z')=M_{0}\cdot M_{2}\cdot M_{4}\cdot M_{5}=\prod(0,2,4,5)$ 
把一个布尔函数写成 Canonical Form（Expand）：把每一项都变成含所有 variable 的形式
- 例： $F=A+B'C=A(B+B')(C+C')+(A+A')B'C=\dots=\sum(1,4,5,6,7)$
- 例：![[Boolean Algebra - 布尔代数-4.png|499]]

在所有 16 种二元布尔函数中，有 8 种是标准的逻辑门：
![[Boolean Algebra - 布尔代数-5.png|345]]

## 卡诺图（Karnaugh Map, K-map）

把真值表转换为方格，便于化简成 **minimum** sum of products 以减少逻辑门的数量。
二元：
![[Boolean Algebra - 布尔代数-8.png|204]]
那么重叠的部分可以直接合并，即上图表示 $A+B$。

三元：
![[Boolean Algebra - 布尔代数-9.png|385]]
注意这里 $BC$ 按照 $00,01,11,10$ 的顺序（即格雷码），保证相邻的方格只变化一位。
![[Boolean Algebra - 布尔代数-12.png|302]]
有几个圈就对应几个 term，因此我们想要圈的数量越少越好（圈越大越好），重叠也越少越好。（圈住的方格数都是二的幂次）

四元：
![[Boolean Algebra - 布尔代数-13.png|269]]

Implicant（蕴含）：让 $F$ 为 $1$ 的 product term。
Prime implicant（PI, 质蕴含）：极大的圈。
Essential prime implicant（EPI, 基本质蕴含）：当 Minterm 只被一个 PI 覆盖。
那么我们优先圈 EPI。

**Don't Care Condition：** 在电路中有些位不涉及到输入输出，它们是 0 是 1 无所谓，所以卡诺图里面可以把它们用 X 表示代替 $0$ 或 $1$。