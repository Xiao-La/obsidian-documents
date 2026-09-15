## Binary Logic

逻辑门的真值表/符号/画图：
![[Number Systems - 数字系统-10.png|409]]

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
- 最大项（Maxterm）：包含了所有的 Literals （包括补的形式）的 AND 项。
  - 例如，对两个变量 $x,y$ ，最大项： $x+y,x+y',x'+y,x'+y'(M_{0}\sim M_{3})$。 
这个编号就是对应变量的十进制值。另外有 $M_{i}=m_{i}'$。
![[Boolean Algebra - 布尔代数-2.png|521]]
那么一个真值表可以表达成：
- Sum-of-minterms (som)。
- Product-of-maxterms (pom)。
![[Boolean Algebra - 布尔代数-3.png|69]]
例如这个函数 $F$ 可以写成：
- Som：$F=m_{1}+m_{3}+m_{6}+m_{7}=\sum(1,3,6,7)$
- Pom：$F=(x+y+z)(x+y'+z)(x'+y+z)(x'+y+z')=M_{0}\cdot M_{2}\cdot M_{4}\cdot M_{5}=\prod(0,2,4,5)$ 
