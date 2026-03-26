$$\mathscr{L}^p$$
## 形式语言（Formal Language）

语言（Language）：
- 字母表（Alphabet）
- 语法（Syntax）
- 语义（Semantics）

### 字母表

命题（Proposition）
- 原子命题（Atomic Proposition, atom）：最小的不可分的命题。
- 复合命题（Compound Proposition）

逻辑连接词（Logic Connectives）
1. 否定（Not, Negation） ($\neg$)
2. 合取 （And, Conjunction）($\land$)
3. 析取 （Or, Disjunction）($\lor$)
4. 异或 （Exclusive Or）($\oplus$)
5. 蕴含 （Implication） ($\to$)
6. 等价（If and only if, Equivalence）($\leftrightarrow$)

标点符号（Punctuation）
### 语法

表达式 (Expression)：有限的符号组合。
- 良构公式（Well-formed formulas, wff）

WFF 的形式归纳定义： $\text{Form}(\mathscr{L}^p)$ 是满足以下条件的表达式的最小集合：
- $\text{Atom}(\mathscr{L}^p) \subseteq\text{Form}(\mathscr{L}^p)$
- 若 $\alpha \in\text{Form}(\mathscr{L}^p)$，则 $(\neg \alpha) \in\text{Form}(\mathscr{L}^p)$
- 若 $\alpha,\beta \in\text{Form}(\mathscr{L}^p)$，则 $(\alpha \land \beta), (\alpha \lor \beta), (\alpha \to \beta), (\alpha \leftrightarrow \beta) \in\text{Form}(\mathscr{L}^p)$

概念
- 空表达式（Empty expression）：长度为 $0$ 的表达式，记作 $\lambda$。
- 连接（Concatenation）：$uv$ 表示按顺序连接两个表达式 $u,v$ 得到的结果，$\lambda u = u\lambda = u$。
- 段（Segment）：若存在表达式 $w_1,w_2$ 使得 $u = w_1 v w_2,$ 则称 $v$ 是 $u$ 的一个段。
- 真段（Proper segment）：若 $v$ 是 $u$ 的段，且 $v$ 非空并且 $v \ne u$，则 $v$ 是 $u$ 的真段。
- 初始段/前缀（Initial segment / Prefix）与终止段/后缀（Terminal segment / Suffix）：若 $u = vw$ ，其中 $u,v,w$ 为表达式，则 $v$ 是 $u$ 的初始段（前缀），$w$ 是 $u$ 的终止段（后缀）。
- 真前缀（Proper prefix）与真后缀（Proper suffix）：若 $u = vw$，其中 $u,v,w$ 为表达式，且 $v,w$ 均非空，则 $v$ 是 $u$ 的真前缀，$w$ 是 $u$ 的真后缀。

WFF 的性质：
- WFF 是非空的表达式。
- WFF 中的开闭括号数量相等。
- 良构公式 $\varphi \in \mathscr{L}^P$ 的任意**真前缀** 中，左括号（opening brackets）的个数**严格多于**右括号（closing brackets）的个数。
- 类似地，$\varphi \in \mathscr{L}^P$ 的任意**真后缀**中，右括号的个数**严格多于**左括号的个数。
- 因此，真前缀与真后缀都**不是** $\mathscr{L}^P$ 中的良构公式。

可以使用这些性质来判定一个表达式不是一个 WFF，但要判定一个表达式是 WFF，需要使用定义中的构造规则。
也就是说，一个表达式是 WFF 当且仅当它有一个解析树（Parse Tree）：
![[Propositional Logic - 命题逻辑.png|505]]
或简化形式：
![[Propositional Logic - 命题逻辑-1.png|504]]

概念
- 子公式（subformula）：公式 $G$ 若在公式 $F$ 内出现，则称 $G$ 是 $F$ 的子公式。
- 真子公式（proper subformula）：若 $G$ 是 $F$ 的子公式且 $G \neq F$，则称 $G$ 是 $F$ 的真子公式。
- 解析树节点（parse tree nodes）：$F$ 的解析树的所有节点所对应的公式，构成 $F$ 的子公式集合。
- 直接子公式（immediate subformulas）：某公式在其解析树中的**子节点**（children）所对应的公式。
- 主连接词（leading connective）：用于连接这些子节点的连接词。

唯一可读性定理（Unique Readability Theorem）：有唯一的一种方式来构造每个 WFF。（消除二义性（Ambiguity））
- 证明：考虑 $\varphi = (\neg\alpha)$ 和 $\varphi = (\alpha * \beta)$。

为了可读性，有*惯例：*
- 将 $F$ 和 $(F)$ 视为相同的公式。
- 优先级（Precedence）：从高到低为 $(), \neg,\land,\lor,\to,\leftrightarrow$。
- 结合性（Associativity）：$\land, \lor, \leftrightarrow$ 具有结合性。$\to$ 具有右结合性。

### 语义

**常见逻辑连接词（Logical Connectives）真值表（Truth table）**
$\neg, \land$ 的真值表显然。
$\lor$ 注意是“Inclusive Or”。
$\to$  的真值表：

| $P$   | $Q$   | $P\to Q$ |
| ----- | ----- | -------- |
| false | false | true     |
| false | true  | true     |
| true  | false | false    |
| true  | true  | true     |
这里 $P$ 是前件（Antecedent），$Q$ 是后件（Consequence），$P\to Q$ 相当于 $\neg P \land Q$。

$\leftrightarrow$ 的真值表：

| $P$   | $Q$   | $P\leftrightarrow Q$ |
| ----- | ----- | -------------------- |
| false | false | true                 |
| false | true  | false                |
| true  | false | false                |
| true  | true  | true                 |

真值赋值（Truth Valuation）
- 函数 $v:\mathrm{Atom}(\mathscr{L}^P)\to\{0,1\}$。
- 记号：若 $p\in \mathrm{Atom}(\mathscr{L}^P)$，则用 $v(p)$ 或 $p^v$ 表示 $p$ 在赋值 $v$ 下的真值，且 $p^v\in\{0,1\}$。

若 $A \in \mathscr{L}^p$：
• 若 $\forall v$，有 $A^v=1$ 则称 $A$ 为永真式（tautology/重言式） 
• 若 $\forall v$，有 $A^v=0$ 则称 $A$ 为永假式（contradiction/矛盾式) 
• 若 $\exists v$，使得 $A^v=1$ 则称 $A$ 为可满足的（satisfiable）

要证明某个式子是永真式/永假式/可满足的，可以用：
- 赋值树（Valuation Tree）：
![[Propositional Logic - 命题逻辑-2.png|487]]
- 反证法（Proof by Contradiction）
- 真值表

逻辑等价（Logical Equivalence）：在任意赋值下，两个式子都有相同的值，则称它们等价。也就是说，$A\leftrightarrow B$ 是永真式。
![[Propositional Logic - 命题逻辑-3.png|440]]
![[Propositional Logic - 命题逻辑-4.png|540]]
![[Propositional Logic - 命题逻辑-5.png|541]]

**代换实例（Substitution Instance）：** 将一个式子里的某些部分替换为其他式子，且保持替换的一致性（相同的部分替换为相同的式子）得到的式子。
- 一个永真式的代换实例仍然是永真式。
**代换定理：** 如果 $A$ 是一个 wff ，它有一个子式 $C$，且 $C \equiv D$，则将 $A$ 中的某些 $C$ 代换成 $D$ 得到的结果 $B$ 有 $A\equiv B$。

逻辑等价（$\equiv$）意味着真值表相同，它是 $\text{Form}(\mathscr{L}^p)$ 上的一个等价关系，也就是说满足自反性，对称性和传递性。

**一组式子的可满足性（Satisfiability）**：若 $\Sigma \subseteq\text{Form}(\mathscr{L}^p)$，则定义 $\Sigma^v=1$ 当且仅当 $\forall B\in \Sigma, B^v=1$。若存在某种赋值 $v$ 使得 $\Sigma^v=1$, 则称 $\Sigma$ 是可满足的（Satisfiable）；称 $v$ 满足了 $\Sigma$.

**蕴含（Entailment）：** 假设 $\Sigma \subseteq\text{Form}(\mathscr{L}^p), \alpha\in\text{Form}(\mathscr{L}^p)$，称 $\Sigma$ 蕴含 $A$（记作 $\Sigma \vDash A$ ），或 $A$ 是 $\Sigma$ 推出的结论，当且仅当 $\forall v, \Sigma^v =1\to A^v=1$。
- $A\equiv B$ 当且仅当 $A\vDash B$ 且 $B\vDash A$。
- $\varnothing \vDash A$ 说明 $A$ 是永真式（因为空集是空真的）。
- $A\vDash B$ 当且仅当 $A\to B$ 是永真式。

**证明蕴含关系：**
- 列真值表，说明 $\Sigma ^v=1$ 的行中都有 $A^v=1$。
- 反证法，假设存在 $v$ 使得 $\Sigma^v=1$ 但是 $A^v=0$，导出矛盾
**证明不蕴含关系：**
- 找到一种赋值 $v$ 使得 $\Sigma^v=1$ 但是 $A^{v}=0$。

$n$ 元布尔函数（N-ary Boolean Functions）：
$$
f:\{ T,F \}^{n}\to \{ T, F \}
$$
共有 $2^{2^n}$ 种可能的 $n$ 元布尔函数。

一些有意义的二元布尔函数：
- 或非（Joint Denial）：$p \downarrow q \equiv \neg(p\lor q)$
- 与非（Alternative Denial）： $p\uparrow q \equiv \neg(p\land q)$
- 异或（Exclusive or）：$p \otimes q\equiv \neg(p\leftrightarrow q)$。

**完备集合（Adequate Set）：** 所有 wff 都能只用集合中的连接词表示。
**定理：** $\{ \neg, \land, \lor \},\{ \neg, \land \}, \{ \neg, \lor \}, \{ \neg, \to \}$  都是完备集合。

要证明一个集合完备，只需证明其他逻辑连接词可以只用集合中的连接词表示（这里的全集是 $\{ \neg, \land, \lor , \to, \leftrightarrow \}$）。
要证明一个集合不完备，可以考虑证明该集合构造出来的式子具有一些特性，然后说明用某个其他连接词构造的式子不具备这个特性，从而证明后者无法用前者表示。

定理：任意的 $n$ 元布尔函数都可以只用一个完备集合中的连接词定义。