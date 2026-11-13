## Propositional Logic

命题（Proposition）的定义：
- 陈述性（Declarative）
- 真值（Either true or false）

逻辑连接符（Logic Connectives）：
- Negation $\neg$
- Conjunction/and $\land$
- Disjunction/or $\lor$
- Exclusive or $\oplus$
- Implication $\to$
- Biconditional $\leftrightarrow$

真值表（Truth table）：表示不同的命题之间，所有真值（T/F）之间的关系。
- 行数：若涉及 $n$ 个命题，则有 $2^{n}$ 行。
例如异或的真值表：

| $p$ | $q$ | $p \oplus q$ |
| --- | --- | --- |
| T | T | F |
| T | F | T |
| F | T | T |
| F | F | F |

- $p\oplus q\equiv \neg(p\leftrightarrow q)$
- $p\to q \equiv \neg p\lor q$ (Useful Law)

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

Associative Laws:
- $(p\lor q)\lor r\equiv p\lor(q\lor r)$
- $(p\land q)\land r\equiv p\land(q\land r)$

Distributive Laws:
- $p\lor(q\land r)\equiv(p\lor q)\land(p\lor r)$
- $p\land(q\lor r)\equiv(p\land q)\lor(p\land r)$

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

Predicate $P(x_{1},\dots,x_{n})$ 只能称为**Statement**；只有当每个 $x_{i}$ 换成具体的值，或用量词约束全部自由变量，它才成为一个 **proposition**（具有真值）。
- Universe/Domain：所有可能取值 $(x_{1},x_{2}\dots x_{n})$ 的集合。
- Truth set：让 $P(x_{1},\dots ,x_{n})$ 成立的取值 $(x_{1},x_{2}\dots x_{n})$ 的集合。

$\forall$ 和 $\exists$ 的优先级比其他逻辑运算符更高。

通常 $\forall, \to$ 搭配，$\exists, \land$ 搭配。
-  $\neg \exists x P(x)\equiv \forall x\neg P(x)$ (De Morgan Law) 否定之后改变量词类型，把否定放到谓词上。这对嵌套也成立：  $\neg(\forall x\exists yP(x,y))\equiv \exists x\forall y\neg P(x,y)$。
- $\neg \forall x(P(x)\to Q(x))\equiv \exists x(P(x)\land \neg Q(x))$

嵌套的量词若种类不同不可交换。

翻译：There is **EXACTLY** one person whom everybody loves.
$$
\exists y(\forall xL(x,y) \land \forall z(\forall xL(x,z)\to z=y))
$$


## Inference

对于命题逻辑有如下的 **Inference Rules:**

**modus ponens** (*law of detachment*) 肯定前件式

$$\begin{array}{l}p\to q\\p\\\hline \therefore q\end{array}\qquad \text{corresponding tautology: } (p\land(p\to q))\to q$$

**modus tollens** 否定后件式

$$\begin{array}{l}p\to q\\\neg q\\\hline \therefore \neg p\end{array}\qquad \text{corresponding tautology: } (\neg q\land(p\to q))\to\neg p$$

**hypothetical syllogism** 假言三段论

$$\begin{array}{l}p\to q\\q\to r\\\hline \therefore p\to r\end{array}\qquad \text{corresponding tautology: } ((p\to q)\land(q\to r))\to(p\to r)$$

**disjunctive syllogism** 选言三段论

$$\begin{array}{l}p\lor q\\\neg p\\\hline \therefore q\end{array}\qquad \text{corresponding tautology: } (\neg p\land(p\lor q))\to q$$

**Addition**

$$\begin{array}{l}p\\\hline \therefore p\lor q\end{array}\qquad \text{corresponding tautology: } p\to(p\lor q)$$

**Simplification**

$$\begin{array}{l}p\land q\\\hline \therefore p\end{array}\qquad \text{corresponding tautology: } (p\land q)\to p$$

**Conjunction**

$$\begin{array}{l}p\\q\\\hline \therefore p\land q\end{array}\qquad \text{corresponding tautology: } ((p)\land(q))\to(p\land q)$$

**Resolution**

$$\begin{array}{l}\neg p\lor r\\p\lor q\\\hline \therefore q\lor r\end{array}\qquad \text{corresponding tautology: } ((p\lor q)\land(\neg p\lor r))\to(q\lor r)$$

对于一阶逻辑：

- **Universal Instantiation** (UI)

  $$\begin{array}{l}\forall x P(x)\\\hline \therefore P(c)\end{array}$$

- **Universal Generalization** (UG)

  $$\begin{array}{l}P(c)\text{ for an arbitrary }c\\\hline \therefore \forall x P(x)\end{array}$$

- **Existential Instantiation** (EI)

  $$\begin{array}{l}\exists x P(x)\\\hline \therefore P(c)\text{ for some element }c\end{array}$$

- **Existential Generalization** (EG)

  $$\begin{array}{l}P(c)\text{ for some element }c\\\hline \therefore \exists x P(x)\end{array}$$

## 数学证明（Mathematical Proof）

**Axiom（公理）：** 在一个理论中选定、不经证明而作为推理起点的命题。
**Theorem（定理）：** 可以证明的命题。
**Lemma（引理）：** 可以证明的命题，用于证明其他命题。
**Corollary（推论）：** 从定理可以推出来的结论。

**Formal Proof：** 每一步都遵循逻辑，从前提/公理/引理/定理中获得。  
**Informal Proof：** 更常用，使用自然语言。

证明定理（形如 $p\to q$）的基本方法（可以通过 $p\to q$ 的真值表理解）：
- Direct proof
- Proof by contrapositive （逆否命题）
- Proof by contradiction（说明 $p\land \neg q$ 不可能发生以说明 $p\to q$）
- Proof by cases （$(p_{1}\lor\dots \lor p_{n})\to q \equiv(p_{1}\to q)\land(p_{2}\to q)\land\dots \land(p_{n}\to q)$）
- Proof of equivalence （$p\leftrightarrow q\equiv(p\to q)\land(q\to p)$）

Vacuous Proof：证明 $p$ 永远是假的，那么 $p\to q$ 就是真的。
Trivial Proof：证明 $q$ 永远是真的，那么 $p\to q$ 就是真的。
证明含量词的命题
- Proof by cases
- Counterexample
- Constructive proof
- Non constructive - proof by contradiction
## 数学归纳法

数学归纳法（Mathematical Induction），其实是把反证法（非直接证明）转换成一个直接的证明的结果。

**Proof by Smallest Counterexample.**  要证明 $P(n)$ 成立 $\forall n=0,1,2, \dots$：
- 假设有反例。首先验证 $P(0)$ 成立。那么就可以令 $m>0$ 是 **最小的** 使得 $P(n)$ 为假的反例。
- 那么 $P(m')$ 成立 $\forall0\leq m'<m$。用这件事去说明 $P(m)$ 是真的，那就导致了矛盾。
- 于是没有反例，也就是说 $P(n)$ 成立 $\forall n=0,1,2, \dots$。

要使用这种“找最小反例”的证明，需要证明的集合需要是 **良序集（Well-Ordered Set）**。自然数/正整数的集合自然就是良序集。

Proof by Smallest Counterexample 的证明过程，其实就相当于数学归纳法。因此有：
**The Weak Principle of Mathematical Induction.**
- （Base Step）：若 $P(b)$ 成立。
- （Inductive Step）：$P(n-1)\to P(n)$ 对所有 $n> b$ 成立，那么 $P(n)$ 对所有 $n\geq b$ 成立。

另外还有：
**The Strong Principle of Mathematical Induction.**
- （Base Step）：若 $P(b)$ 成立。
- （Inductive Step）：$P(b)\land P(b+1)\land\dots  \land P(n-1)\to P(n)$ 对所有 $n> b$ 成立，那么 $P(n)$ 对所有 $n\geq b$ 成立。

格式：

A *typical* proof by mathematical induction, showing that a statement $P(n)$ is true for all integers $n\ge b$ consists of three steps:

1. We show that $P(b)$ is true. – Base Step
2. We then, $\forall n>b$, show either

   $(*)\quad P(n-1)\to P(n)$

   or

   $(**)\quad P(b)\land P(b+1)\land\cdots\land P(n-1)\to P(n)$

   We need to make the inductive hypothesis of either $P(n-1)$ or $P(b)\land P(b+1)\land\cdots\land P(n-1)$. We then use $(*)$ or $(**)$ to derive $P(n)$.
3. We conclude on the basis of the principle of mathematical induction that $P(n)$ is true for all $n\ge b$.

