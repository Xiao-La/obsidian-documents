

> **考试范围**：命题逻辑 (PL) + 一阶逻辑 (FOL) 的语法、语义、形式化证明系统。
> **不考**：预备知识、可靠性与完备性的*证明*、霍尔逻辑。

---

## 目录

1. [命题逻辑 — 语法](#1-命题逻辑--语法)
2. [命题逻辑 — 语义](#2-命题逻辑--语义)
3. [命题逻辑 — 形式证明系统](#3-命题逻辑--形式证明系统)
   - 3.1 Hilbert-style System
   - 3.2 Natural Deduction (ND)
   - 3.3 Resolution
4. [一阶逻辑 — 语法](#4-一阶逻辑--语法)
5. [一阶逻辑 — 语义](#5-一阶逻辑--语义)
6. [一阶逻辑 — ND 证明](#6-一阶逻辑--nd-证明)
7. [综合练习题](#7-综合练习题)

---

## 1. 命题逻辑 — 语法

### 核心概念

| 概念 | 说明 |
|------|------|
| **字母表 (Alphabet)** | 原子命题 $p,q,r,\dots$；连接词 $\neg,\land,\lor,\to,\leftrightarrow$；标点 $(,)$ |
| **良构公式 (wff)** | 归纳定义：atom 是 wff；若 $\alpha,\beta$ 是 wff，则 $(\neg\alpha), (\alpha\land\beta), (\alpha\lor\beta), (\alpha\to\beta), (\alpha\leftrightarrow\beta)$ 也是 wff |
| **解析树 (Parse Tree)** | 展示公式构造过程的树，叶节点 = atom，内部节点 = 主连接词 |
| **主连接词 (Leading Connective)** | 解析树根节点的连接词 |
| **子公式 (Subformula)** | 解析树中任意节点对应的公式 |

### WFF 的性质

- **括号性质**：WFF 的任意**真前缀**中，左括号严格多于右括号；任意**真后缀**中，右括号严格多于左括号
- 因此，真前缀和真后缀都**不是** WFF
- **唯一可读性定理 (Unique Readability)**：每个 WFF 有唯一的构造方式

> 判定是 WFF → 用构造规则（解析树）；判定不是 WFF → 可用括号性质。

### 惯例 (Convention)

- 优先级从高到低：$(), \neg, \land, \lor, \to, \leftrightarrow$
- 结合性：$\land, \lor, \leftrightarrow$ 左结合；$\to$ **右结合**
- $F$ 和 $(F)$ 视为相同

---

### 例题：Assignment 2

**A2.1** 判断哪些是 wff（按形式定义，不考虑惯例）。

答案：**2, 3, 5, 9, 10**

| # | 表达式 | 判定 | 理由 |
|---|--------|------|------|
| 1 | $\lor pq$ | ❌ | 连接词位置错误（前缀记法不是 wff） |
| 2 | $(p \leftrightarrow (\neg q))$ | ✅ | 按构造规则合法 |
| 3 | $(\neg(p \to (q \land p)))$ | ✅ | 按构造规则合法 |
| 4 | $(p \lor q \land r)$ | ❌ | 缺少括号（按形式定义 $\lor$ 和 $\land$ 不能并列） |
| 5 | $((p \land (\neg q)) \lor (q \to r))$ | ✅ | 按构造规则合法 |
| 6 | $p \neg r$ | ❌ | $\neg$ 不能放在 atom 后面 |
| 7 | $()$ | ❌ | 空括号不是公式 |
| 8 | $(p)$ | ❌ | atom 外不能单独加括号（括号只在连接词引入时出现） |
| 9 | $q$ | ✅ | atom 是 wff |
| 10 | $(\neg(\neg p))$ | ✅ | 按构造规则合法 |

**A2.2** 为以下公式构建简化解析树（标出主连接词）：

- $\neg p \land q \to r$ → 主连接词 $\to$，左子树主连接词 $\land$（$\neg p \land q$）
- $p \lor q \to \neg p \land r$ → 主连接词 $\to$
- $(p \to q) \land \neg(r \lor p \to q)$ → 主连接词 $\land$
- $(\neg((\neg(p \land q)) \lor (\neg r)))$ → 主连接词 $\neg$（最外层）

**A2.3** 归纳证明 $s = c + 1$（$s$ = atom 出现次数，$c$ = 二元连接词出现次数）。

- **Base**: $\alpha$ 为 atom，$c=0, s=1$，$1 = 0+1$ ✓
- **I.H.**: 对 $\alpha, \beta$ 成立，即 $s_\alpha = c_\alpha+1$, $s_\beta = c_\beta+1$
- **Inductive Step**:
  - $\neg\alpha$: $s' = s_\alpha$, $c' = c_\alpha$，故 $s' = c'+1$ ✓
  - $\alpha * \beta$（$*$ 为二元连接词）: $s' = s_\alpha + s_\beta$, $c' = c_\alpha + c_\beta + 1$
    - $s' = (c_\alpha+1)+(c_\beta+1) = (c_\alpha+c_\beta+1)+1 = c'+1$ ✓

**A2.4** 自然语言 → PL 形式化：

| 自然语言 | 关键点 | 公式 |
|----------|--------|------|
| I will eat a fruit **if** it is an apple | "if" = 前置条件 | $A \to E$ |
| I will eat a fruit **only if** it is an apple | "only if" = 必要条件 | $E \to A$ |
| I will eat an apple or an orange **but not both** | XOR | $(A \lor O) \land \neg(A \land O)$ |
| **If** I ace CS, I will apply; **otherwise** I will take another course | if-else 分支 | $(A \to R) \land (\neg A \to C)$ |
| I will carry an umbrella **unless** it is sunny | unless = XOR（按题目要求） | $(U \lor S) \land \neg(U \land S)$ |

**A2.5** MU 谜题（归纳定义的字符串集合 P）：
- 证明 $MUUIU \in P$：给出构造序列即可（从 MI 出发，反复应用 P1-P4）
- 证明 $MU \notin P$：找到 P 中字符串的**不变性质**——设 $c_s$ 为 I 的数量，则 $c_s \bmod 3 \neq 0$。M 和 U 不贡献 I，故对 $MU$，$c_s = 0$，$0 \bmod 3 = 0$，不在 P 中。证明该性质对所有 P 中字符串成立需要对构造规则归纳。

---

## 2. 命题逻辑 — 语义

### 核心概念

**真值赋值 (Truth Valuation)**：$v: \text{Atom}(\mathscr{L}^P) \to \{0,1\}$

| 分类 | 定义 | 简记 |
|------|------|------|
| **永真式 (Tautology)** | $\forall v, A^v = 1$ | $\vDash A$ |
| **永假式 (Contradiction)** | $\forall v, A^v = 0$ | — |
| **可满足的 (Satisfiable)** | $\exists v, A^v = 1$ | — |

**逻辑等价**：$A \equiv B$ 当且仅当 $A \leftrightarrow B$ 是永真式。

**语义蕴含 (Entailment)**：$\Sigma \vDash \alpha$ 当且仅当 $\forall v$，若 $\Sigma^v = 1$ 则 $\alpha^v = 1$。
- $\emptyset \vDash A$ ⟺ $A$ 是永真式
- $A \vDash B$ ⟺ $A \to B$ 是永真式

### 判定方法

| 方法 | 适用场景 |
|------|----------|
| 真值表 (Truth Table) | 通用，$n$ 个 atom 需要 $2^n$ 行 |
| 赋值树 (Valuation Tree) | 比真值表更紧凑，逐步分支 |
| 反证法 | 假设存在 $v$ 使 $\Sigma^v=1$ 且 $\alpha^v=0$，导出矛盾 |

- **证明蕴含**：真值表中 $\Sigma^v=1$ 的每一行都有 $\alpha^v=1$；或反证法
- **证明不蕴含**：找到一个反例赋值即可

### 完备集 (Adequate Set)

- $n$ 元布尔函数共有 $2^{2^n}$ 种
- **完备集**：所有 wff 都能只用该集合中的连接词等价表示
- 已知完备集：$\{\neg, \land\}, \{\neg, \lor\}, \{\neg, \to\}, \{\downarrow\}, \{\uparrow\}$

**证明完备**：从标准全集 $\{\neg, \land, \lor, \to, \leftrightarrow\}$ 出发，说明每个连接词都能用目标集合表示。

**证明不完备**：找到目标集合构造出的所有公式共享某个"不变性质"（如 parity），而某个连接词（如 $\land$）不具备。

### CNF / DNF

| | CNF (合取范式) | DNF (析取范式) |
|---|---|---|
| 形式 | $\bigwedge_i (\bigvee_j l_{ij})$ | $\bigvee_i (\bigwedge_j l_{ij})$ |
| 从真值表构造 | 取值为 **0** 的行，每行否定后合取 | 取值为 **1** 的行，每行析取 |
| 主范式 (Principal) | 每个子句包含所有命题变量恰好一次 | 同左 |

> 定理：任意公式都等价于某个 CNF 和某个 DNF。

### 代换

- **代换实例**：保持一致性替换公式中的 atom。永真式的代换实例仍是永真式。
- **代换定理**：若 $C \equiv D$，则将 $A$ 中的 $C$ 换为 $D$ 得到的 $B$ 满足 $A \equiv B$。

---

### 例题：Assignment 3

**A3.1** 判定公式类型（tautology / contradiction / neither）：

| # | 公式 | 答案 |
|---|------|------|
| 1 | $(\neg r \lor s) \to (r \to (\neg r \lor s))$ | Tautology |
| 2 | $(p \to q) \leftrightarrow (q \to p)$ | Neither |
| 3 | $((p \to r) \land (q \to r)) \leftrightarrow (p \lor q \to r)$ | Tautology |
| 4 | $(p \to q) \land (p \land \neg q)$ | Contradiction |
| 5 | $(\neg(p \leftrightarrow q)) \leftrightarrow (q \lor p)$ | Neither |

**A3.2** 逻辑等价判定：

1. $p \to (q \land \neg q)$ 与 $\neg p$ → **等价**：
   $$p \to F \equiv \neg p \lor F \equiv \neg p$$

2. $(\neg p \lor q) \to q \land (q \to r) \land \neg r$ 与 $(q \land \neg r) \land (\neg r \to \neg q) \lor (p \land \neg q)$ → **等价**：两者均可化简为 $p \land \neg q$。

**A3.3** 语义蕴含判定：

1. $A \to (B \to C) \vDash B \leftrightarrow B \land (A \leftrightarrow A \land C)$ → **成立**。分情况：
   - 若 $A^v = 0$：则 $(A \leftrightarrow A \land C)^v = 1$（因为 $A$ 和 $A \land C$ 均为 0），故结论化简为 $B \leftrightarrow B \land T \equiv B \leftrightarrow B$（永真）
   - 若 $(B \to C)^v = 1$：再分 $B^v = 0$（结论化简为 $F \leftrightarrow F$，永真）和 $C^v = 1$（结论化简为 $B \leftrightarrow B$，永真）

2. $(A \to C) \lor (B \to C) \vDash (A \lor B) \to C$ → **不成立**。反例：$A=1, B=0, C=0$：
   $$(1 \to 0) \lor (0 \to 0) = 0 \lor 1 = 1, \quad (1 \lor 0) \to 0 = 1 \to 0 = 0$$

**A3.4** 给定 $(A_i \to B_i)^v = 1\;(1 \le i \le n)$，$(A_1 \lor \dots \lor A_n)^v = 1$，$(B_i \land B_j)^v = 0\;(i \neq j)$，证明 $(B_i \to A_i)^v = 1$。

**证明**（反证法）：假设存在 $t$ 使 $(B_t \to A_t)^v = 0$，则 $B_t^v = 1, A_t^v = 0$。由于 $\bigvee_i A_i$ 为真，存在 $p \neq t$ 使 $A_p^v = 1$。由 $A_p \to B_p$ 为真得 $B_p^v = 1$。于是 $B_t^v = B_p^v = 1$ 且 $p \neq t$，与 $(B_t \land B_p)^v = 0$ 矛盾。

**A3.5** 证明每个 positive wff（不含 $\neg, \to, \leftrightarrow$）都是可满足的。

**证明**：取赋值 $v$ 将所有 atom 都赋为 $1$。对 positive wff 的结构归纳：
- Base: atom 显然满足（$p^v = 1$）
- I.H.: 假设 $\alpha^v = \beta^v = 1$
- Inductive Step: $(\alpha \land \beta)^v = 1 \land 1 = 1$；$(\alpha \lor \beta)^v = 1 \lor 1 = 1$ ✓

**A3.6** 三门问题：

- 设 $P$: 红门后是自由；$Q$: 蓝门后是自由；$R$: 绿门后是自由
- 门上铭文：红门 = $P$，蓝门 = $\neg Q$，绿门 = $\neg Q$
- 已知条件：
  - 至少一真：$P \lor \neg Q \lor \neg Q \equiv P \lor \neg Q$
  - 至少一假：$\neg(P \land \neg Q \land \neg Q) \equiv \neg P \lor Q$
  - 恰好一扇门通向自由：$(P \land \neg Q \land \neg R) \lor (\neg P \land Q \land \neg R) \lor (\neg P \land \neg Q \land R)$

真值表验证：唯一满足所有条件的赋值是 $P=0, Q=0, R=1$ → 绿门通向自由。

**A3.7** $\{\leftrightarrow, \neg\}$ 是否完备？→ **不完备**。

**核心思路**：先证明只需考虑 2-变量公式（多余变量可以代换为 tautology），再证明任何只含 $\{\leftrightarrow, \neg\}$ 的 2-变量公式 $\alpha$ 满足 $f(\alpha)$ 为偶数（$f(\alpha)$ = 真值表中使 $\alpha=1$ 的行数）。

归纳证明 $f(\alpha)$ 恒为偶数：
- Base: $f(p) = f(q) = 2$（偶数）
- I.H.: $f(\alpha) = 2k_1$, $f(\beta) = 2k_2$
- $\neg\alpha$: $f(\neg\alpha) = 4 - f(\alpha) = 4 - 2k_1 = 2(2-k_1)$（偶数）
- $\alpha \leftrightarrow \beta$: 设 $t_1$ 为 $\alpha=1,\beta=1$ 的行数，$t_4$ 为 $\alpha=0,\beta=0$ 的行数，则 $f(\alpha \leftrightarrow \beta) = t_1 + t_4 = 4 - (2k_1 + 2k_2 - 2t_1) = 2(2 - k_1 - k_2 + t_1)$（偶数）

但 $f(p \land q) = 1$（奇数），故 $p \land q$ 不能用 $\{\leftrightarrow, \neg\}$ 表示。因此 $\{\leftrightarrow, \neg\}$ 不完备。

---

## 3. 命题逻辑 — 形式证明系统

### 3.1 Hilbert-style System ($\mathscr{H}$)

**语言**：仅用 $\neg, \to$。

**公理**：
1. $A \to (B \to A)$
2. $(A \to (B \to C)) \to ((A \to B) \to (A \to C))$
3. $(\neg A \to \neg B) \to (B \to A)$

**推理规则**：Modus Ponens (MP): $\dfrac{A \to B \quad A}{B}$

**重要定理与导出规则**（课堂上已证明，考试可直接引用）：

| 名称 | 内容 |
|------|------|
| H1 | $\vdash A \to A$ |
| Deduction Rule | $\Sigma \cup \{A\} \vdash B$ iff $\Sigma \vdash A \to B$ |
| H2 (Transitivity) | $\vdash (A \to B) \to ((B \to C) \to (A \to C))$ |
| Contrapositive | 若 $\Sigma \vdash \neg B \to \neg A$，则 $\Sigma \vdash A \to B$ |
| H3 | $\vdash \neg \neg A \to A$ |
| H4 | $\vdash \neg A \to (A \to B)$ 和 $\vdash A \to (\neg A \to B)$ |
| H5 | $\vdash \text{true}$（即 $B \to B$），$\vdash \neg \text{false}$ |
| H6 | $\vdash (A \to \neg A) \to \neg A$ |
| Reductio ad absurdum | $\dfrac{\vdash \neg A \to \text{false}}{\vdash A}$ |
| Exchange | $\dfrac{\Sigma \vdash A \to (B \to C)}{\Sigma \vdash B \to (A \to C)}$ |

---

### 例题：Assignment 4.1 (Hilbert)

**A4.1.1** $\vdash (\neg A \to A) \to A$

```
1. {¬A→A} ⊢ ¬A→A                    [Assumption]
2. {¬A→A} ⊢ ¬A→(A→false)            [Theorem H4]
3. {¬A→A} ⊢ (¬A→(A→false))→((¬A→A)→(¬A→false))
                                     [Axiom 2]
4. {¬A→A} ⊢ (¬A→A)→(¬A→false)       [MP 2,3]
5. {¬A→A} ⊢ ¬A→false                [MP 1,4]
6. {¬A→A} ⊢ A                       [Reductio ad absurdum 5]
7. ⊢ (¬A→A)→A                       [Deduction 6]
```

**A4.1.2** $\vdash (\neg A \to \text{false}) \to A$

```
1. {¬A→false} ⊢ ¬A→false            [Assumption]
2. {¬A→false} ⊢ ¬false               [Theorem H5]
3. {¬A→false} ⊢ ¬¬¬false→¬false       [Theorem H3]
4. {¬A→false} ⊢ false→¬¬false         [Contrapositive 3]
5. {¬A→false} ⊢ ¬A→¬¬false            [Transitivity 1,4]
6. {¬A→false} ⊢ ¬false→A              [Contrapositive 5]
7. {¬A→false} ⊢ A                     [MP 2,6]
8. ⊢ (¬A→false)→A                    [Deduction 7]
```

**A4.1.3** $\vdash ((A \to B) \to A) \to A$

```
1. {(A→B)→A} ⊢ (A→B)→A              [Assumption]
2. {(A→B)→A} ⊢ ¬A→(A→B)             [Theorem H4]
3. {(A→B)→A} ⊢ ¬A→A                 [Transitivity 2,1]
4. {(A→B)→A} ⊢ (¬A→A)→A             [Question 1]
5. {(A→B)→A} ⊢ A                    [MP 3,4]
6. ⊢ ((A→B)→A)→A                    [Deduction 5]
```

**A4.1.4** $\vdash (\neg B \to \neg A) \to ((\neg B \to A) \to B)$

```
1. {¬B→¬A, ¬B→A} ⊢ ¬B→¬A            [Assumption]
2. {¬B→¬A, ¬B→A} ⊢ ¬B→A             [Assumption]
3. {¬B→¬A, ¬B→A} ⊢ A→B              [Contrapositive 1]
4. {¬B→¬A, ¬B→A} ⊢ ¬B→B             [Transitivity 2,3]
5. {¬B→¬A, ¬B→A} ⊢ (¬B→B)→B         [Question 1]
6. {¬B→¬A, ¬B→A} ⊢ B                [MP 4,5]
7. {¬B→¬A} ⊢ (¬B→A)→B               [Deduction 6]
8. ⊢ (¬B→¬A)→((¬B→A)→B)             [Deduction 7]
```

> **技巧总结**：Hilbert 证明的核心策略是 **(1) 用 Deduction Rule 把目标变成假设前提推出结论**，**(2) 用 Transitivity 和 Contrapositive 操作蕴含**，**(3) 把之前证过的定理当作引理直接引用**。

---

### 3.2 Natural Deduction (ND)

**语言**：全部连接词 $\neg, \land, \lor, \to, \leftrightarrow$。

**推理规则一览**：

| 连接词 | Introduction | Elimination |
|--------|-------------|-------------|
| $\land$ | $\dfrac{\alpha \quad \beta}{\alpha \land \beta}$ | $\dfrac{\alpha \land \beta}{\alpha}$, $\dfrac{\alpha \land \beta}{\beta}$ |
| $\lor$ | $\dfrac{\alpha}{\alpha \lor \beta}$ 或 $\dfrac{\alpha}{\beta \lor \alpha}$ | $\dfrac{\alpha_1\!\lor\!\alpha_2 \quad \boxed{\alpha_1\!\cdots\!\beta} \quad \boxed{\alpha_2\!\cdots\!\beta}}{\beta}$ |
| $\to$ | $\dfrac{\boxed{\alpha \cdots \beta}}{\alpha \to \beta}$ | $\dfrac{\alpha \to \beta \quad \alpha}{\beta}$ |
| $\neg$ | $\dfrac{\boxed{\alpha \cdots \perp}}{\neg \alpha}$ | — |
| $\perp$ | $\dfrac{\alpha \quad \neg \alpha}{\perp}$ | $\dfrac{\perp}{\alpha}$ |
| $\neg\neg$ | $\dfrac{\alpha}{\neg\neg\alpha}$（导出） | $\dfrac{\neg\neg\alpha}{\alpha}$ |

**导出规则**（可直接引用）：

| 规则 | 内容 |
|------|------|
| Modus Tollens (MT) | $\{p \to q, \neg q\} \vdash \neg p$ |
| PBC (反证法) | $\dfrac{\boxed{\neg\alpha \cdots \perp}}{\alpha}$ |
| LEM (排中律) | $\vdash \alpha \lor \neg\alpha$ |

> 子证明 (Subproof) 内可以用**外部**的行；外部**不能**用子证明内部的行。

**可靠性与完备性**（考试只需了解概念）：
- **Soundness**：$\Sigma \vdash A \implies \Sigma \vDash A$
- **Completeness**：$\Sigma \vDash A \implies \Sigma \vdash A$

---

### 例题：Assignment 4.2 (ND)

**A4.2.1** $\neg(\neg p \lor q) \vdash p$

```
1. ¬(¬p ∨ q)              [Premise]
   ┌ 2. ¬p                [Assume]
   │ 3. ¬p ∨ q            [∨i 2]
   │ 4. ⊥                 [⊥i 1,3]
   └ 5. ¬¬p               [¬i 2-4]
6. p                      [¬¬e 5]
```

**A4.2.2** $p \land q \to r \vdash p \to (q \to r)$

```
1. p ∧ q → r              [Premise]
   ┌ 2. p                 [Assume]
   │   ┌ 3. q             [Assume]
   │   │ 4. p ∧ q         [∧i 2,3]
   │   │ 5. r             [→e 1,4]
   │   └ 6. q → r         [→i 3-5]
   └ 7. p → (q → r)       [→i 2-6]
```

**A4.2.3** $(p \lor q) \lor r \vdash p \lor (q \lor r)$（$\lor$ 结合律）

```
1. (p ∨ q) ∨ r                [Premise]
   ┌ 2. p ∨ q                 [Assume]
   │   ┌ 3. p                 [Assume]
   │   │ 4. p ∨ (q ∨ r)       [∨i 3]
   │   └
   │   ┌ 5. q                 [Assume]
   │   │ 6. q ∨ r             [∨i 5]
   │   │ 7. p ∨ (q ∨ r)       [∨i 6]
   │   └
   │ 8. p ∨ (q ∨ r)           [∨e 2, 3-4, 5-7]
   └
   ┌ 9. r                     [Assume]
   │ 10. q ∨ r                [∨i 9]
   │ 11. p ∨ (q ∨ r)          [∨i 10]
   └
12. p ∨ (q ∨ r)               [∨e 1, 2-8, 9-11]
```

**A4.2.4** $p \land (q \lor r) \vdash (p \land q) \lor (p \land r)$（分配律）

```
1. p ∧ (q ∨ r)                [Premise]
2. p                          [∧e 1]
3. q ∨ r                      [∧e 1]
   ┌ 4. q                     [Assume]
   │ 5. p ∧ q                 [∧i 2,4]
   │ 6. (p ∧ q) ∨ (p ∧ r)     [∨i 5]
   └
   ┌ 7. r                     [Assume]
   │ 8. p ∧ r                 [∧i 2,7]
   │ 9. (p ∧ q) ∨ (p ∧ r)     [∨i 8]
   └
10. (p ∧ q) ∨ (p ∧ r)         [∨e 3, 4-6, 7-9]
```

**A4.2.5** $\neg(p \lor q) \vdash \neg p \land \neg q$（De Morgan）

```
1. ¬(p ∨ q)                   [Premise]
   ┌ 2. p                     [Assume]
   │ 3. p ∨ q                 [∨i 2]
   │ 4. ⊥                     [⊥i 1,3]
   └ 5. ¬p                    [¬i 2-4]
   ┌ 6. q                     [Assume]
   │ 7. p ∨ q                 [∨i 6]
   │ 8. ⊥                     [⊥i 1,7]
   └ 9. ¬q                    [¬i 6-8]
10. ¬p ∧ ¬q                   [∧i 5,9]
```

---

### 例题：Assignment 4.3 (Soundness — $\lor$e case)

**题目**：完成 ND 可靠性证明中 $\lor$e 情形的归纳步骤。

假设第 $k+1$ 行用 $\lor$e 推出 $\alpha$，证明结构为：

```
...
c.  p ∨ q                   [...]
    ┌ c+1. p                [Assume]
    │  ...
    │ j.   α                [...]
    └
    ┌ j+1. q                [Assume]
    │  ...
    │ k.   α                [...]
    └
k+1. α                      [∨e c, c+1-j, j+1-k]
```

令 $\Sigma_1 = \Sigma \cup \{p\}$, $\Sigma_2 = \Sigma \cup \{q\}$。由 I.H.（对 $\le k$ 行的证明成立）：
- $\Sigma \vDash p \lor q$（因为 $p \lor q$ 在 $\le k$ 行被证明）
- $\Sigma_1 \vDash \alpha$（子证明 c+1 到 j 在 $\Sigma_1$ 下是完备证明）
- $\Sigma_2 \vDash \alpha$（子证明 j+1 到 k 在 $\Sigma_2$ 下是完备证明）

**反证法证 $\Sigma \vDash \alpha$**：假设存在 $v$ 使 $\Sigma^v = 1$ 且 $\alpha^v = 0$。
- 由 $\Sigma \vDash p \lor q$ 且 $\Sigma^v = 1$，得 $(p \lor q)^v = 1$
- 由 $\Sigma_1 \vDash \alpha$ 且 $\alpha^v = 0$，得 $\Sigma_1^v = 0$。而 $\Sigma^v = 1$，故 $p^v = 0$
- 同理，由 $\Sigma_2 \vDash \alpha$ 得 $q^v = 0$
- 于是 $(p \lor q)^v = 0$，与 $(p \lor q)^v = 1$ 矛盾

故 $\Sigma \vDash \alpha$ 成立。

---

### 例题：Assignment 5.1 (用 Soundness 做语义论证)

**A5.1** 若 $\{\alpha, \beta\} \vdash_{ND} \gamma$，则 $\emptyset \vDash (\alpha \land \beta) \to \gamma$。

**证明**：由 ND 的 Soundness，$\{\alpha, \beta\} \vdash \gamma \implies \{\alpha, \beta\} \vDash \gamma$。

反证法：假设 $\emptyset \not\vDash (\alpha \land \beta) \to \gamma$，则存在 $v$ 使 $(\alpha \land \beta)^v = 1$ 且 $\gamma^v = 0$。于是 $\alpha^v = 1, \beta^v = 1, \gamma^v = 0$，与 $\{\alpha, \beta\} \vDash \gamma$ 矛盾。故 $\emptyset \vDash (\alpha \land \beta) \to \gamma$。

---

### 3.3 Resolution (归结)

**核心思路**：要证 $\Sigma \vdash_{\text{Res}} \varphi$，转为证 $\Sigma \cup \{\neg \varphi\} \vdash_{\text{Res}} \perp$。

**步骤**：
1. 将 $\Sigma$ 和 $\neg \varphi$ 化为 CNF
2. 拆开 $\land$ → 析取子句的集合
3. 每个子句视为 literal 的集合
4. 反复使用归结规则直到推出 $\perp$（空子句）

**归结规则**：
$$\dfrac{(\alpha \lor p) \quad ((\neg p) \lor \beta)}{(\alpha \lor \beta)} \qquad \dfrac{p \quad \neg p}{\perp}$$

---

### 例题：Assignment 5.2 (Resolution)

**A5.2** $p \to (q \land r) \vdash_{\text{Res}} (\neg q \lor \neg r) \to \neg p$

第一步：转换前提和否定结论为 CNF，再转为子句集合。

- 前提：$p \to (q \land r) \equiv \neg p \lor (q \land r) \equiv (\neg p \lor q) \land (\neg p \lor r)$
- 否定结论：$\neg((\neg q \lor \neg r) \to \neg p) \equiv \neg(\neg(\neg q \lor \neg r) \lor \neg p) \equiv \neg((q \land r) \lor \neg p) \equiv \neg(q \land r) \land p \equiv (\neg q \lor \neg r) \land p$

得到子句集合：$\{\neg p, q\},\; \{\neg p, r\},\; \{\neg q, \neg r\},\; \{p\}$

归结过程：
```
1. {¬p, q}          [Premise]
2. {¬p, r}          [Premise]
3. {¬q, ¬r}         [Premise]
4. {p}              [Premise]
5. {q}              [Res 1,4]
6. {r}              [Res 2,4]
7. {¬r}             [Res 3,5]
8. ⊥                [Res 6,7]
```

---

## 4. 一阶逻辑 — 语法

### 字母表

| 类别 | 符号 |
|------|------|
| **逻辑符号** | 量词 $\forall, \exists$；变量 $x,y,z,\dots$；连接词 $\neg,\land,\lor,\to,\leftrightarrow$；标点 $(,),,$；等号 $=$ |
| **非逻辑符号** | 常量 $c_1,c_2,\dots$；谓词 $P,Q,R,\dots$（带 arity）；函数 $f,g,h,\dots$（带 arity） |

### 项的归纳定义
1. 常量和变量都是项
2. 若 $f^n$ 是 $n$ 元函数，$t_1,\dots,t_n$ 是项，则 $f^n(t_1,\dots,t_n)$ 是项
3. 只有以上生成的才是项

### 原子公式 (Atom)
- $P(t_1,\dots,t_n)$，其中 $P$ 是 $n$ 元谓词，$t_i$ 是项
- $t_1 = t_2$（等号是一种特殊的二元谓词）

### 公式的归纳定义
1. $\text{Atom}(\mathscr{L}) \subseteq \text{Form}(\mathscr{L})$
2. 若 $\alpha \in \text{Form}$，则 $(\neg\alpha) \in \text{Form}$
3. 若 $\alpha,\beta \in \text{Form}$，则 $(\alpha * \beta) \in \text{Form}$（$* \in \{\land,\lor,\to,\leftrightarrow\}$）
4. 若 $\alpha \in \text{Form}$ 且 $x$ 是变量，则 $(\forall x\,\alpha), (\exists x\,\alpha) \in \text{Form}$

### 优先级
1. 括号优先
2. $\forall x, \exists x$ 与 $\neg$ 同级，高于所有二元连接词
3. $\forall, \exists, \neg$ 之间是**右结合**

### 形式化关键对照

| 自然语言 | FOL 模式 |
|----------|----------|
| "Every A is B" | $\forall x (A(x) \to B(x))$ |
| "Some A is B" | $\exists x (A(x) \land B(x))$ |
| "Only A are B" | $\forall x (B(x) \to A(x))$ |
| "No A is B" | $\forall x (A(x) \to \neg B(x))$ 或 $\neg\exists x(A(x) \land B(x))$ |
| "All things that are both A and B are C" | $\forall x(A(x) \land B(x) \to C(x))$ |
| 量词顺序 | $\forall x \exists y$ ≠ $\exists y \forall x$（见 A5.5(d)(e) 的区别） |

---

### 例题：Assignment 5.3-5.5

**A5.3** 判断是否是良构 FOL 公式。答案：**1, 3, 6, 8, 9**

| # | 表达式 | 判定 | 理由 |
|---|--------|------|------|
| 1 | $P(g(a,b))$ | ✅ | atom — 谓词作用于项 |
| 2 | $Q(x, P(a), b)$ | ❌ | $P(a)$ 是公式不是项 |
| 3 | $P(g(f(a), g(x, f(x))))$ | ✅ | atom — 函数嵌套合法 |
| 4 | $R(a, R(a, a))$ | ❌ | $R(a,a)$ 是公式不是项 |
| 5 | $g(a, g(x, y))$ | ❌ | 这是项 (term)，不是公式 |
| 6 | $\forall x(\neg P(x))$ | ✅ | wff |
| 7 | $\exists R(f(a), x)$ | ❌ | $R$ 是谓词不能被量化 |
| 8 | $\exists x Q(x, f(x), b) \to \forall x R(a, x)$ | ✅ | wff |
| 9 | $\exists x \forall y R(x, y)$ | ✅ | wff |

**A5.4** 用给定谓词翻译（$A(x,y)$: x admires y; $B(x,y)$: x attended y; $P(x)$: professor; $S(x)$: student; $L(x)$: lecture; $m$: Mary）

| 句子 | FOL | 易错点 |
|------|-----|--------|
| (a) Mary admires every professor | $\forall x (P(x) \to A(m, x))$ | 不能写成 $\forall x A(m, P(x))$（$P(x)$ 是公式，不是项） |
| (b) Some professor admires Mary | $\exists x (P(x) \land A(x, m))$ | 存在用 $\land$ |
| (c) No student attended every lecture | $\neg\exists x (S(x) \land \forall y (L(y) \to B(x, y)))$ | "no" = 不存在 |
| (d) No lecture was attended by every student | $\neg\exists x (L(x) \land \forall y (S(y) \to B(y, x)))$ | 语态转换，量词位置变了 |
| (e) No lecture was attended by any student | $\forall x (L(x) \to \forall y (S(y) \to \neg B(y, x)))$ | "any" 在 "no" 的语境中 = 全称 |

**A5.5** 自由形式化（自己定义谓词）：

| 句子 | FOL |
|------|-----|
| (a) All red things are in the box | $\forall x (R(x) \to B(x))$ |
| (b) **Only** red things are in the box | $\forall x (B(x) \to R(x))$ |
| (c) No animal is both a cat and a dog | $\forall x (A(x) \to \neg(C(x) \land D(x)))$ |
| (d) Every prize was won by a boy | $\forall x (P(x) \to \exists y (O(y) \land W(y, x)))$ |
| (e) A boy won every prize | $\exists x (O(x) \land \forall y (P(y) \to W(x, y)))$ |

> **(d) vs (e)**：量词顺序是核心区别。(d) 每个 prize 各有自己的 boy（可能不同）；(e) 存在**同一个** boy 赢了所有 prize。

---

## 5. 一阶逻辑 — 语义

### 核心概念

| 概念 | 定义 |
|------|------|
| **自由变元 (Free Variable)** | 不在任何量词作用域内的变量 |
| **约束变元 (Bound Variable)** | 在某个量词作用域内的变量 |
| **句子 (Sentence)** | 无自由变元的公式（也称闭公式） |
| **阐释 (Interpretation) $\mathcal{I}$** | Domain + 常量/函数/谓词的具体含义 |
| **环境 (Environment) $E$** | 给自由变元赋值 |

### 语义定义

- $t^{(\mathcal{I}, E)}$：项 $t$ 在 $(\mathcal{I}, E)$ 下的值（对常量查 $\mathcal{I}$，对变量查 $E$，对函数递归计算）
- $E[x \mapsto d]$：将 $E$ 中 $x$ 的值改为 $d$

量词语义：
- $(\forall x\,\alpha)^{(\mathcal{I},E)} = 1$ ⟺ 对**所有** $d \in$ Domain，$\alpha^{(\mathcal{I}, E[x\mapsto d])} = 1$
- $(\exists x\,\alpha)^{(\mathcal{I},E)} = 1$ ⟺ **存在** $d \in$ Domain，使 $\alpha^{(\mathcal{I}, E[x\mapsto d])} = 1$

### 公式分类

| | 定义 |
|---|------|
| **Valid (永真)** | 对所有 $\mathcal{I}, E$ 都为真（记 $\vDash \alpha$） |
| **Satisfiable (可满足)** | 存在 $\mathcal{I}, E$ 使其为真 |
| **Unsatisfiable (不可满足)** | 对所有 $\mathcal{I}, E$ 都为假 |

> **FOL 的不可判定性**：不存在通用算法判定任意 FOL 公式是否为 valid。（PL 可用真值表判定）

### 语义蕴含

$\Sigma \vDash \alpha$ ⟺ 对所有 $\mathcal{I}, E$，若 $\mathcal{I} \vDash_E \Sigma$ 则 $\mathcal{I} \vDash_E \alpha$

### 重要等价

| 等价关系 |
|----------|
| $\neg\forall x P(x) \equiv \exists x \neg P(x)$ |
| $\neg\exists x P(x) \equiv \forall x \neg P(x)$ |
| $\forall x \forall y P(x,y) \equiv \forall y \forall x P(x,y)$ |
| $\exists x \exists y P(x,y) \equiv \exists y \exists x P(x,y)$ |
| $\forall x(P(x) \land Q(x)) \equiv (\forall x P(x)) \land (\forall x Q(x))$ |
| $\exists x(P(x) \lor Q(x)) \equiv (\exists x P(x)) \lor (\exists x Q(x))$ |

---

### 例题：Assignment 6.1-6.4

**A6.1** 对 $\alpha = \exists x(P(y, z) \land (\forall y(\neg Q(y, x) \lor P(y, z))))$，画解析树并标自由/约束：

- $P(y,z)$ 中的 $y$ → **自由**（在 $\forall y$ 作用域外）
- $P(y,z)$ 中的 $z$ → **自由**
- $Q(y,x)$ 中的 $x$ → **约束**（被 $\exists x$ 绑定）
- $Q(y,x)$ 和 $P(y,z)$（第二个）中的 $y$ → **约束**（被 $\forall y$ 绑定）
- 第二个 $z$ → 与第一个相同，**自由**

**A6.2** Domain $\{3,4\}$, $f^{\mathcal{I}}(3)=4, f^{\mathcal{I}}(4)=3$, $F^{\mathcal{I}} = \{\langle3,4\rangle, \langle4,3\rangle\}$

| 公式 | 值 | 理由 |
|------|-----|------|
| $\forall x \exists y F(x,y)$ | **True** | $x=3$ 有 $y=4$；$x=4$ 有 $y=3$。全满足 |
| $\exists x \forall y F(x,y)$ | **False** | $x=3$ 时 $F(3,3) \notin F^{\mathcal{I}}$；$x=4$ 时 $F(4,4) \notin F^{\mathcal{I}}$。不存在这样的 $x$ |
| $\forall x \forall y (F(x,y) \to F(f(x), f(y)))$ | **True** | 枚举 4 对 $(x,y)$：$(3,3)$ 前提假→整体真；$(3,4)$: $F(3,4)=1, F(f(3),f(4))=F(4,3)=1$；$(4,3)$: 同理；$(4,4)$ 前提假→整体真 |

**A6.3** Domain $\mathbb{N}$, $a^{\mathcal{I}}=2$, $f^{\mathcal{I}}(x,y)=x+y$, $g^{\mathcal{I}}(x,y)=x\times y$, $P^{\mathcal{I}}(x,y): x=y$, $E(x)=0, E(y)=1, E(z)=2$

| 公式 | 自然语言含义 | 真值 |
|------|-------------|------|
| $\forall x P(g(x,a), y)$ | "对所有自然数 $x$, $x \times 2 = 1$" | **False**（$x=0$ 时 $0\neq 1$） |
| $\forall x(P(f(x,a), y) \to \forall y P(f(y,a), x))$ | "对所有 $x$，若 $x+2=1$，则对所有 $y$, $y+2=x$" | **True**（前提 $x+2=1$ 在 $\mathbb{N}$ 上恒假） |
| $\forall x \forall y \exists z P(f(x,y), z)$ | "对所有 $x,y$，存在 $z$ 使 $x+y=z$" | **True** |
| $\exists x P(f(x,y), g(x,z))$ | "存在 $x$ 使 $x+1 = x \times 2$" | **True**（$x=1$: $1+1=2, 1\times2=2$） |

**A6.4** 判定 valid / satisfiable / unsatisfiable：

| 公式 | 答案 | 理由 |
|------|------|------|
| $P(x,y) \to (Q(x,y) \to P(x,y))$ | **Valid** | PL tautology 的代换实例（$A \to (B \to A)$） |
| $\forall x(P(x) \to P(x)) \to \exists y(Q(y) \land \neg Q(y))$ | **Unsatisfiable** | 前件永真，后件永假；$1 \to 0 = 0$ |
| $\forall x \forall y (P(x,y) \to P(y,x))$ | **Satisfiable** | 取 $P$ 为 $=$ → True；取 $P$ 为 $<$ → False。故不是 valid 也不是 unsatisfiable |
| $\neg(\forall x P(x) \to \exists y Q(y)) \land \exists y Q(y)$ | **Unsatisfiable** | 设公式为真：前半要求 $\forall x P(x)=1$ 且 $\exists y Q(y)=0$；后半要求 $\exists y Q(y)=1$。矛盾 |
| $\exists x P(x,y)$ | **Satisfiable** | $y$ 自由，可在阐释中取合适的 $y$ 和 $P$ 满足；也可取不满足的阐释。故 satisfiable |

---

## 6. 一阶逻辑 — ND 证明

### 替换 (Substitution)

$\alpha[t/x]$ 表示将 $\alpha$ 中所有**自由出现**的 $x$ 替换为 $t$。

> 避免 **capture**：若 $t$ 含变量 $y$，而替换处 $x$ 在 $\forall y$ / $\exists y$ 的作用域内，需先 rename bound variable。

### 量词推理规则

| 规则 | 形式 | 条件 |
|------|------|------|
| $\forall e$ | $\dfrac{\forall x\,\alpha}{\alpha[t/x]}$ | $t$ 对 $\alpha$ 中的 $x$ 可代入（无 capture） |
| $\forall i$ | $\dfrac{\boxed{y \text{ fresh} \;\vdots\; \alpha[y/x]}}{\forall x\,\alpha}$ | $y$ 不出现在 subproof 之外的任何地方 |
| $\exists i$ | $\dfrac{\alpha[t/x]}{\exists x\,\alpha}$ | $t$ 对 $\alpha$ 中的 $x$ 可代入 |
| $\exists e$ | $\dfrac{\exists x\,\alpha \quad \boxed{\alpha[u/x], u \text{ fresh} \;\vdots\; \beta}}{\beta}$ | $u$ 不出现在 $\beta$ 或 subproof 外或未释放的假设中 |

> **PL 所有规则在 FOL 中仍然可用。**

---

### 例题：Assignment 6.5 (FOL ND)

**A6.5.1** $\exists x P(x) \lor \exists x Q(x) \vdash \exists x (P(x) \lor Q(x))$

```
1. ∃xP(x) ∨ ∃xQ(x)               [Premise]
   ┌ 2. ∃xP(x)                   [Assume]
   │   ┌ 3. P(u), u fresh        [Assume]
   │   │ 4. P(u) ∨ Q(u)          [∨i 3]
   │   │ 5. ∃x(P(x) ∨ Q(x))      [∃i 4]
   │   └
   │ 6. ∃x(P(x) ∨ Q(x))          [∃e 2, 3-5]
   └
   ┌ 7. ∃xQ(x)                   [Assume]
   │   ┌ 8. Q(u), u fresh        [Assume]
   │   │ 9. P(u) ∨ Q(u)          [∨i 8]
   │   │ 10. ∃x(P(x) ∨ Q(x))     [∃i 9]
   │   └
   │ 11. ∃x(P(x) ∨ Q(x))         [∃e 7, 8-10]
   └
12. ∃x(P(x) ∨ Q(x))              [∨e 1, 2-6, 7-11]
```

**A6.5.2** $\neg\forall x \neg P(x) \vdash \exists x P(x)$

```
1. ¬∀x¬P(x)                       [Premise]
   ┌ 2. ¬∃xP(x)                   [Assume]
   │   ┌ 3. u fresh
   │   │   ┌ 4. P(u)              [Assume]
   │   │   │ 5. ∃xP(x)            [∃i 4]
   │   │   │ 6. ⊥                 [⊥i 2,5]
   │   │   └
   │   │ 7. ¬P(u)                 [¬i 4-6]
   │   └
   │ 8. ∀x¬P(x)                   [∀i 3-7]
   │ 9. ⊥                         [⊥i 1,8]
   └
10. ∃xP(x)                        [PBC 2-9]
```

**A6.5.3** $\{\forall x(Q(x) \to R(x)),\; \exists x(P(x) \land Q(x))\} \vdash \exists x(P(x) \land R(x))$

```
1. ∀x(Q(x)→R(x))                  [Premise]
2. ∃x(P(x)∧Q(x))                  [Premise]
   ┌ 3. P(u)∧Q(u), u fresh       [Assume]
   │ 4. P(u)                      [∧e 3]
   │ 5. Q(u)                      [∧e 3]
   │ 6. Q(u)→R(u)                 [∀e 1]
   │ 7. R(u)                      [→e 5,6]
   │ 8. P(u)∧R(u)                 [∧i 4,7]
   │ 9. ∃x(P(x)∧R(x))            [∃i 8]
   └
10. ∃x(P(x)∧R(x))                [∃e 2, 3-9]
```

**A6.5.4** $\{\forall x P(a, x, x),\; \forall x \forall y \forall z(P(x, y, z) \to P(f(x), y, f(z)))\} \vdash P(f(a), a, f(a))$

```
1. ∀x P(a, x, x)                                [Premise]
2. ∀x∀y∀z(P(x,y,z)→P(f(x),y,f(z)))             [Premise]
3. P(a, a, a)                                   [∀e 1]
4. ∀y∀z(P(a,y,z)→P(f(a),y,f(z)))               [∀e 2]
5. ∀z(P(a,a,z)→P(f(a),a,f(z)))                  [∀e 4]
6. P(a,a,a)→P(f(a),a,f(a))                      [∀e 5]
7. P(f(a),a,f(a))                               [→e 3,6]
```

> 这个证明只需反复用 $\forall e$ 实例化到合适的项，最后 MP。注意选对每次 $\forall e$ 的替换项。

