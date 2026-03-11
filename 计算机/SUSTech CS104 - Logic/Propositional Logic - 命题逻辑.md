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

唯一可读性定理（Unique Readability Theorem）：有唯一的一种方式来构造每个 WFF。
