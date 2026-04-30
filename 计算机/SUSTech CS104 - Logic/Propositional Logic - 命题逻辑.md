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
- 反证法，假设存在 $v$ 使得 $\Sigma^v=1$ 但是 $A^v=0$，导出矛盾。
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

### 形式推演系统

形式证明系统（Formal Proof System）
- 语言 (符号，字母表，wff)
- 推理（公理，推理规则）

由前提 $\Sigma$ 可以推出结论 $A$ 记作：
$$
\Sigma \vdash A
$$
#### Hilbert-style System
$$
\mathscr{H}
$$
线性。

**语言：**
- 字母表： $\Sigma=\{ (,),\neg, \to, p, q, r, \dots \}$
- 公式：与 wff 类似的定义。

**公理（Axioms）：**
- $A\to(B\to A)$
- $(A\to(B\to C))\to((A\to B)\to(A\to C))$
- $(\neg A\to \neg B)\to(B\to A)$
*注意这里是语法和符号上的公理，和语义无关。*

**推理规则（Inference rule）：**
- 分离规则（Modus ponens, MP）：$\displaystyle \dfrac{(A \to B,\, A)}{B}$

**证明（Proof）**：
- 以 $\Sigma$ 为前提（Premises）对 $A$ 的一个证明，是一个有限序列 $A_{1}, A_{2}, \dots, A_{n}$。
- 对于任意 $i\leq n$，$A_{i}$ 是以下三种情况之一：
    - 是  $\mathscr{H}$ 中的一个公理，或一个 $\Sigma$ 中的一个公式。
    - 是 $A_{j}(j<i)$。
    - 是通过 MP 从 $A_{j}, A_{k}(j, k<i)$ 推导出来的。
- 这里我们称 $A_{n}$ 是 $\mathscr{H}$ 中的一个定理（Theorem）。
- $A_{n}$ 可被证明记作 $\Sigma\vdash A_{n}$。
- 若 $\Sigma=\varnothing$，则简记为 $\vdash A_{n}$。

例如 (Theorem H1) $A\to A$ 的证明：
![[Propositional Logic - 命题逻辑-6.png|496]]

**（可靠性定理/Soundness）若 $\vdash A$，则 $\vDash A$ 。**
也就是说，任何 Hilbert 系统证明出来的结论都是永真式。
- 可以对证明序列的长度 $\mathscr{l}$ 归纳来证明此类定理。
  - Base case：长度为 $1$ 的情况。
  - I.H.：假设对 $k<n$ 成立。
  - Inductive step：证明对 $n$ 成立。

**（单调性定理/Monotonicity）** 若 $\Sigma\vdash A$，则 $\Sigma \cup \{ B \} \vdash A$。

**导出规则（Derived rules）：** 从 MP 出发可以证明的一些推导规则，用于简化证明。
- Deduction Rule：$$
\Sigma\cup \{ A \} \vdash B \text{ iff } \Sigma \vdash A\to B
$$
例如 (Theorem H2) $(A\to B)\to((B\to C)\to(A\to C))$ 的证明：
![[Propositional Logic - 命题逻辑-8.png|516]]
- Contrapositive Rule:
$$
\text{if } \Sigma\vdash \neg B\to \neg A, \text{then } \Sigma\vdash  A\to B 
$$

(Theorem H3) 
$$
\vdash \neg \neg A\to A
$$
- Transitivity Rule (Proven by H2):
$$
\frac{\Sigma\vdash A\to B \text{ and } \Sigma\vdash B\to C}{\Sigma\vdash  A\to C}
$$
- Exchange of antecedent rule:
$$
\frac{\Sigma\vdash  A\to(B\to C)}{\Sigma\vdash B\to(A\to C)}
$$
(Theorem H4) $\vdash A$ 和 $\vdash \neg A$ 可以证明任何事。
$$
\vdash \neg A\to(A\to B)
$$
$$
\vdash A\to(\neg A\to B)
$$
- Double Negation Rule  (Proven by H3)
  $$
\frac{\vdash \neg \neg A}{\vdash A}
$$
$$
\frac{\vdash A}{\vdash \neg \neg A}
$$
为了证明中的方便，引入记号：（Theorem H5）
$$
\vdash\text{true}
$$
$$
\vdash \neg \text{false}
$$
- Reductio ad absurdum (reduction to absurdity/proof by contradiction)
$$
\frac{\vdash \neg A\to\text{false}}{\vdash A}
$$
(Theorem H6)
$$
\vdash (A\to \neg A)\to \neg A
$$

#### Natural Deduction System

语言：
- 字母表： $\Sigma =\{ (,),\neg,\land, \lor, \to,\leftrightarrow,p,q,r, \dots \}$
- 公式：与 wff 类似的定义。

推理规则（Inference Rules）：
- 自反（Reflexivity）：$\Sigma \cup {\alpha}\vdash\alpha$ or $\Sigma,\alpha\vdash\alpha$
- 每条规则包括 introduction 和 elimination 两部分。
- $\land\text{i}$ ：$$
\frac{\alpha \,\, \beta}{\alpha \land\beta}
$$
- $\land \text{e}$：
$$
\frac{\alpha \land\beta}{\alpha}, \frac{\alpha \land\beta}{\beta}
$$
- $\to\text{e}$：
$$
\frac{(\alpha\to\beta) \,\, \alpha}{ \beta}
$$
- $\to\text{i}$：
$$
\frac{\boxed{\begin{aligned}
\alpha \\
\dots \\
\beta 
\end{aligned}}}{\alpha\to\beta}
$$
或： 若 $\Sigma,\alpha\vdash_{ND} \beta$，则 $\Sigma\vdash_{ND}(\alpha\to\beta)$。这里被框起来的就是一个子证明（Subproof）。
![[Propositional Logic - 命题逻辑-9.png|428]]
子证明里面可以用外部的行，外部不可以用子证明里面的行。
- $\lor\text{i}$ ：
$$
\frac{\alpha}{(\alpha \lor\beta)}, \frac{\alpha}{(\beta \lor\alpha)}
$$
- $\lor\text{e}$（Proof by cases）：
$$
\frac{(\alpha_{1}\lor\alpha_{2})\,\,\boxed{\begin{align}
\alpha_{1} \\
\dots \\
\beta
\end{align}}\,\,\boxed{\begin{align}
\alpha_{2} \\
\dots \\
\beta
\end{align}}}{\beta}
$$
- $\neg\text{i}$（用 $\perp$ 表示矛盾）：
$$
\frac{\boxed {\begin{align}
\alpha \\
\dots \\
\perp
\end{align}}}{\neg\alpha}
$$
- $\neg\text{e}$ 或 $\perp\text{i}$：
$$
\frac{\alpha\,\,\neg\alpha}{\perp}
$$
- $\neg \neg\text{e}$：
$$
\frac{(\neg(\neg\alpha))}{\alpha}
$$
- $\perp\text{e}$:
$$
\frac{\perp}{\alpha}
$$

导出规则（Derived Rules）若有 $\Sigma\vdash_{ND}\alpha$，则可视为有一个导出规则
$$
\frac{\Sigma}{\alpha}
$$
- 否定后件（Modus tollens, MT）： 
$$
\{ (p\to q,\neg q) \}\vdash _{ND}(\neg p)
$$
- $\neg \neg i$：
$$
\frac{\alpha }{(\neg(\neg\alpha))}
$$
- 反证法（Proof by contradiction, reductio ad absurdum）
$$
\frac{\boxed{\begin{align}
(\neg\alpha) \\
\dots \\
\perp
\end{align}}}{\alpha}
$$
- 排中律（Law of Excluded Middle, Tertiam non datur）
$$
\frac{}{(\alpha \lor(\neg \alpha))}
$$

这些证明都是语法上的（Syntactic）。不用关心语义。


##### 可靠性和完备性

可靠性（Soundness）：证明的结论（Conclusion）总是前提（Premises）的一个逻辑上的结果（Consequence）。也就是说，我们称证明系统可靠，当
$$
\Sigma\vdash A\implies \Sigma\vDash A
$$
完备性（Completeness）：任何逻辑上的结果可以被证明系统证明。也就是说，我们称证明系统完备，当
$$
\Sigma\vDash A\implies \Sigma\vdash A
$$

要证明 ND 的可靠性，可以通过对证明序列的长度来归纳得到。
- Base Case：$n=1$，则 $\alpha$ 是一个前提，则 $\alpha \in \Sigma$，根据定义，$\Sigma\vDash\alpha$。
- I.H.： $\Sigma\vdash\alpha\implies \Sigma\vDash\alpha$ 对长度 $k$ 的证明成立。
- Inductive Step：考虑第 $k+1$ 步推出 $\alpha$ 的各种情况。
  - 考虑有 Sub-proof 的情况，比如第 $k+1$ 行是一个 $\to\text{i}: \beta\to \gamma$，I.H. 就不能直接用了，因为前 $k$ 行不是完整的证明。但是可以令 $\Sigma'=\Sigma \cup \{ \beta \}$，在新的 $\Sigma'$ 下，前 $k$ 行就变成完整的证明了，由于 I.H. 对任意的 $\Sigma$ 都成立，所以 $\Sigma'\vdash \gamma \implies \Sigma'\vDash\gamma$，也就是 $\Sigma\cup \{ \beta \}\vDash \gamma$。从而可以通过反证法证明 $\Sigma\vDash \beta\to\gamma$。
有了可靠性，证明蕴含就可以用：真值表，定义，反证法，以及 **用 ND 证明**。

要证明 ND 的完备性，设 $\Sigma=\{ a_{0},a_{1},\dots,a_{n} \}$ ，可以分别证明三个引理：
- Lemma 1: 若 $\Sigma\vDash\beta$，则 $\emptyset \vDash(a_{0}\to(a_{1}\to(\dots\to(a_{n}\to\beta))))$。
- Lemma 2: 对任意 wff $\gamma$，若 $\emptyset\vDash \gamma$, 则 $\emptyset\vdash_{ND}\gamma$。（永真式可以被证明）
- Lemma 3: 若 $\emptyset\vdash_{ND}(a_{0}\to(a_{1}\to(\dots\to(a_{n}\to\beta)\dots))$，则 $\{ a_{0},a_{1},\dots,a_{n} \}\vdash_{ND}\beta$。也就是说 $\Sigma\vdash_{ND}\beta$。
Lemma 1 容易用反证法证明。Lemma 3 可以重复用 $\to\text{e}$ 消去最后得到 $\beta$ 证明。
Lemma 2：
- 例如有两个 Atom $p,q$，就只需要证明 $p,q\vdash\gamma,\ p, \neg q\vdash\gamma,\ \neg p, q \vdash \gamma,\ \neg p, \neg q\vdash \gamma$ 四种情况。因为，我们可以用排中律构造一个这样的证明：![[Propositional Logic - 命题逻辑-10.png|545]]
- 对于 $n$ 个 Atom $p_{1},p_{2},\dots,p_{n}$ 的一般情况，有子引理（Sublemma）：对任意由这些 Atom 组成的 wff $\gamma$，对任意赋值 $v$，有：
  - 若 $\gamma^v=1$，则 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash\gamma$。
  - 若 $\gamma^v=0$，则 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash\neg \gamma$。
- 这里 $\hat{p_{i}}=\begin{cases}p_{i} & p_{i}^v=1 \\ \neg p_{i} & p_{i}^v=0\end{cases}$。
- 如果证明了这个 Sublemma，那么其第一种情况（$\gamma^v=1$） 恰好对应了前面的构造，所以就能证明 Lemma 2。
Sublemma 的证明：
-  对 $\gamma$ 的构造进行归纳证明。
- Base case:  $\gamma=p_{1}$ （atom）
  - 若 $\gamma^v=p_{1}^v=1$，则 $\hat{p_{1}}=p_{1}\vdash p_{1}=\gamma$。
  - 若 $\gamma^v=p_{1}^v=0$，则 $\hat{p_{1}}=\neg p_{1}\vdash\neg p_{1}=\neg \gamma$。
- Inductive Hypothesis: 用 $P(\gamma)$ 表示 $\gamma$ 符合 Sublemma，假设 $P(\gamma_{1}), P(\gamma_{2})$ 成立。
- Inductive Step: 
  - Case 1: $\gamma=\neg \gamma_{1}$。
    - 若 $\gamma^v=(\neg \gamma_{1})^v=1$，则 $\gamma_{1}^v=0$。则有 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \} \vdash \neg \gamma_{1}=\gamma$。
    - 若 $\gamma^v=(\neg \gamma_{1})^v=0$，则 $\gamma_{1}^v=1$。则有 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \} \vdash \gamma_{1}$。用 $\neg \neg\text{i}$ 规则，有 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash (\neg(\neg \gamma_{1}))=\neg \gamma$。
  - Case 2:  $\gamma=\gamma_{1}\to \gamma_{2}$。
    - 若 $\gamma^v=0$，则 $\gamma_{1}^v=1, \gamma_{2}^v=0$。假设 $\gamma_{1}$ 包含 $\{ q_{1},\dots,q_{k} \}$ 这些 Atom，$\gamma_{2}$ 包含 $\{ r_{1},r_{2},\dots,r_{w} \}$ 这些 Atom，则 I.H. 给出 $\{ \hat{q_{1}},\dots,\hat{q_{k}} \}\vdash \gamma_{1}, \{ \hat{r_{1}}, \dots, \hat{r_{w}} \}\vdash \neg \gamma_{2}$。由于这里的前提都是 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash\gamma$ 的子集，所以可以得到 $\{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash\gamma_{1}, \{ \hat{p_{1}}, \hat{p_{2}}, \dots, \hat{p_{n}} \}\vdash\neg\gamma_{2}$。只要构造一个从这两个命题出发对 $\neg(\gamma_{1}\to \gamma_{2})$ 的证明即可。这用 PBC 是容易的。
    - 若 $\gamma^v=1$，类似的去讨论即可。
   - 其他二元连接符的 Cases 也类似。

 
#### Resolution

定义单式/文字（Literal）：Atom 或 Atom 的否定。
定义子式/子句（Clause）：
- 析取子式（Disjunctive Clause）：用 $\lor$ 连接单式。
- 合取子式（Conjunctive Clause）：用 $\land$ 连接单式。
定义合取范式（Conjunctive Normal Form, CNF）：用 $\land$ 连接析取子式，形如
$$
(l_{11} \lor\dots \lor l_{1n_{1}})\land\dots \land(l_{k1}\lor\dots \lor l_{kn_{k}})
$$
定义析取范式（Disjunctive Normal Form, DNF）：用 $\lor$ 连接合取子式，形如
$$
(l_{11} \land\dots \land l_{1n_{1}})\lor\dots \lor(l_{k1}\land\dots \land l_{kn_{k}})
$$
Lemma: 若 $A$ 是 CNF 形式， $B$ 是 DNF 形式，则 $\neg A$ 与一个 DNF 形式的式子逻辑等价，$\neg B$ 与一个 CNF 形式的式子逻辑等价。
Theorem: 任何式子 $A\in\text{Form}(\mathscr{L}^p)$ 都可以与  CNF 形式和 DNF 形式的式子等价。
- 证明：
  - Case 1： $A$ 为永真式，则 $A\equiv p\lor \neg p$（CNF/DNF）。
  - Case 2： $A$ 为矛盾，则 $A\equiv p\land \neg p$ （CNF/DNF）。
  - Case 3： $A$ 可满足。不失一般性，假设真值表为：

| P   | Q   | A   |
| --- | --- | --- |
| 0   | 0   | 1   |
| 0   | 1   | 0   |
| 1   | 0   | 1   |
| 1   | 1   | 0   |

  - 则 $A$ 的真值表与（row 1 and row 3）相同，即 $A\equiv(\neg p\land \neg q)\lor(p\land \neg q)$ （DNF）。
  - 另外， $A$ 的真值表与 （not row 2 and not row4）相同，即 $A\equiv \neg(\neg p\land q)\land \neg(p\land q)\equiv(p\lor \neg q)\land(\neg p\lor \neg q)$（CNF）.

将任意式子转化为 DNF/CNF：
![[Propositional Logic - 命题逻辑-11.png|555]]

定义 $B$ 为 $A$ 的主合取/析取范式（Principle CNF/DNF）：
- $B$ 是 $A$ 的 CNF/DNF。
- 每个 $B$ 中的子句（clause）都包含 $A$ 中的所有命题变量恰好一次，且没有两个相同的子句。
要写出主 CNF 和主 DNF，可以先写出真值表，DNF 就是所有值为 1 的 row 析取，CNF 就是所有值为 0 的 row 先否定再合取。

Resolution（归结/消解）也称为 Refutation System，用于（计算机辅助）证明矛盾。
只考虑 CNF。
归结推理规则（Resolution Inference）：
$$
\dfrac{(\alpha \lor p) \ \ \  ((\neg p)\lor\beta)}{(\alpha \lor\beta)}
$$
特例：
$$
\dfrac{(\alpha \lor p)\ \ \ (\neg p)}\alpha{}
$$
$$
\dfrac{p\ \ \ (\neg p)}{\perp}
$$
在 Resolution Proof 中，要证明 $\Sigma\vdash_{\text{Res}}\varphi$：
- 转换为证明 $\Sigma\cup \{ \neg \varphi \}\vdash_{\text{Res}}\perp$。
- 首先把 $\neg \varphi$ 和 $\Sigma$ 转换为 CNF。
- 将 CNF 从 $\land$ 分开，变成一堆析取子式（Disjunctive Clauses）。
- 再把析取子式从 $\lor$ 分开，把每个析取子式变成单式的集合。
- 在这些集合上不断使用 Resolution Inference，直到不再可以使用，或获得 $\perp$ 证明命题。
这里 $\perp$ 为空子句/空集。

例如，要证明 $\{ p,q \}\vdash_{\text{Res}}(p\land q)$：
- 前提转换为 $\{ p,q,\neg(p\land q) \}$。
- 转换为 CNF $\{ p,q,\neg p\lor \neg q \}$。
- 变成集合记号 $\{ p \}, \{ q \}, \{ \neg p,\neg q \}$。
- 应用 Resolution Inference。
![[Propositional Logic - 命题逻辑-12.png]]

Resolution Proof System 是可靠且完备的。

Satisfiability（SAT）问题：一组命题逻辑公式是否可以同时满足。(例如，解决软件包依赖关系)
SAT Solver 可用 Resolution 实现。

