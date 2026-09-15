## Propositional Logic

命题（Proposition）的定义：
- 陈述性（Declarative）
- 真值（Either true or false）

逻辑连接符（Logic Connectives）：
- Negation $\neg$
- Conjuntion/and $\land$
- Disjunction/or $\lor$
- Exclusive or $\oplus$
- Implication $\to$
- Biconditional $\leftrightarrow$

真值表（Truth table）：表示不同的命题之间，所有真值（T/F）之间的关系。
- 行数：若涉及 $n$ 个命题，则有 $2^{n}$ 行。
例如异或的真值表：
![[Logic - 逻辑.png|233]]
- $p\oplus q\equiv \neg(p\leftrightarrow q)$
- $p\to q \equiv \neg p\lor q$

关于 Implication，有一些对应的概念：
- Converse of $p\to q$ ： $q\to p$（反/逆命题）
- Contrapositive of $p\to q$： $\neg q\to \neg p$（逆否命题）
- Inverse of $p\to q$ ：$\neg p\to \neg q$（否命题）

从 truth table 得到逻辑表达式：把那些 True 的行用 disjunction 连接，例如异或可以写成 $(p\land \neg q)\lor(\neg p\land q)$。

一个 bit 就可以表示 $0$ 和 $1$。
计算机中布尔变量（Boolean Variable）表示 $0$ 和 $1$。
Bit string 就是一些 bit 组成的序列。
按位操作（bitwise operation）：把 $T$ 和 $F$ 替换为 $1$ 和 $0$ 进行运算。

George Boole：布尔代数（Boolean algebra）的发明者。

Tautology：永真式。（逻辑等价于 T）
Contradiction：永假式。(逻辑等价于 F）
Contingency：可真可假。

逻辑等价（Logical Equivalent）：
- 一种定义：$p$ 与 $q$ 具有相同的真值表。
- 另一种定义：$p\leftrightarrow q$ 是永真式。
- 记作 $p\equiv q$ 或 $p \iff q$。

分配率：
- $(w\land(u\lor v))\equiv(w\land u)\lor(w\land v)$
- $(w\lor(u\land v))\equiv(w\lor u)\land(w\lor v)$。

De Morgan's Law：
- $\neg(p\lor q)\equiv \neg p\land \neg q$
- $\neg(p\land q)\equiv \neg p\lor \neg q$

Identity Law：
- $p\land T\equiv p$
- $p\lor F\equiv p$

Domination Law：
- $p\lor T\equiv T$
- $p\land F\equiv F$ 

Idempotent Law：
- $p\lor p\equiv p$
- $p\land p\equiv p$

Double negation Laws:
- $\neg(\neg p)\equiv p$

Commutative Laws:
- $p\lor q\equiv q\lor p$
- $p\land q\equiv q\land p$

Associatie Laws:
- $(p\lor q)\lor r\equiv p\lor(q\lor r)$
- $(p\land q)\land r\equiv p\land(q\land r)$

Distributive Laws:
- $p\lor(q\land r)\equiv(p\lor q)\land(p\lor r)$
- $p\land(p\lor r)\equiv(p\land q)\lor(p\land r)$

Absorption Laws
- $p\lor(p\land q)\equiv p$
- $p\land(p\lor q)\equiv p$

Negation Laws
- $p\lor \neg p\equiv T$
- $p\land \neg p\equiv F$

证明逻辑等价的方法：
- Truth table
- Logical Equivalence inference
- By discussion
## Predicate Logic / First Order Logic

有量词的逻辑。
- Existential Quantifier：$\exists$
- Universal Quantifier：$\forall$

谓词逻辑包含
- Constant
- Variable
- Predicate：$P(x)$ 给每个 $x$ 赋一个 T / F 值。

Predicate $P(x_{1},\dots,x_{n})$ 只能称为**Statement**；只有当每个 $x_{i}$ 换成具体的值，或在它的前面加上一个 Quantifier，它才成为一个 **proposition**（具有真值）。
- Universe/Domain：所有可能取值 $(x_{1},x_{2}\dots x_{n})$ 的集合。
- Truth set：让 $P(x_{1},\dots ,x_{n})$ 成立的取值 $(x_{1},x_{2}\dots x_{n})$ 的集合。

$\forall$ 和 $\exists$ 的优先级比其他逻辑运算符更高。