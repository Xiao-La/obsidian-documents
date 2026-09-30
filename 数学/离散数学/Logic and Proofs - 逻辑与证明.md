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
![[Logic - 逻辑-1.png|433]]
![[Logic - 逻辑-2.png|432]]
![[Logic - 逻辑-3.png|434]]
![[Logic - 逻辑-4.png|436]]

对于一阶逻辑：
![[Logic - 逻辑-5.png|437]]

## 数学证明（Mathematical Proof）
**Axiom（公理）：** 不证自明的命题。
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

