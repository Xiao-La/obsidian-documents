$$
\mathscr{L}
$$
## 语法（Syntax）

### 概念

Domain （论域）：一个非空的对象（Objects）的集合。
Constant（常量）：论域中确定的（Concrete）对象。
Variable（变量）：确定的值的“占位符（Place Holders）”。
Predicate （谓词）：论域单个对象的一种属性，或多个对象之间的一种关系。
- 例如：用 $S(\text{andy})$ 表示 Andy 是一个学生，这是一个一元谓词（Unary Predicate）。两个参数的谓词就是二元谓词（Binary Predicate），以此类推。
Quantifiers（量词）：描述有多少对象使命题成立。
- The universal quantifier $\forall$（全称量词）。"for all", "every"
- The existential quantifier $\exists$（存在量词）。"there exists", "for some"
Universal Proposition（全称命题）：$\forall x P(x)$。
Existential Proposition（存在命题）：$\exists xP(x)$。
这里 $P$ 是某种属性。
Function（函数）：$n$ 元到一元的映射，记作 $f^{(n)}$。
- 例如：$m(y)$ 表示 $y$ 的母亲，是一个一元函数 （Unary Function）。

### 字母表

Non-logical symbols（非逻辑符号）：
- Constant symbols（个体常元）：$c_{1},c_{2},c_{3},\dots$
- Predicates（谓词/关系符号）：$P,Q,P_{1},P_{2},\dots,Q_{1}^1,Q_{1}^2$（这里上标表示参数个数）
- Function Symbols（函词）：$f,g,h,f_{1},f_{2}^2,..,g_{1}^2,\dots$（这里上标表示参数个数）
Logical symbols（逻辑符号）：
- Quantifiers（量词）：$\forall, \exists$
- Variables（个体变元）：$x,y,z,x_{1},x_{2},\dots,y_{1},y_{2},\dots$
- Connectives（连词）：$\neg,\land,\lor, \to,\leftrightarrow$
- Punctuation（标点）：$($ 和 $)$ 和 $,$
- Equality（等号）：$=$（一种特别的二元关系）

### 项

Terms（项）就是 Object。严格定义为：
- Constant symbols 和 Variables 都是 Term。
- 若 $f^n$ 是一个 $n$ 元函数且 $t_{1},t_{2},\dots,t_{n}$ 为 Term，则 $f^n(t_{1},t_{2},\dots,t_{n})$ 也是 Term。
- 只有上述递归定义的结果才是 Term。
$\text{Term}(\mathscr{L})$
### 原子公式

Atomic Formula/Atom（原子公式）为施加在项上的 **Predicate**。严格定义为，它为以下两种形式之一：
- $P(t_{1},\dots,t_{n})$，其中 $P$ 是一个 $n$ 元 Predicate，而 $t_{i}\in\text{Term}(\mathscr{L})$.
- $=(t_{1},t_{2})$ （有时写作 $t_{1}=t_{2}$），$t_{1},t_{2}\in\text{Term}(\mathscr{L})$。
$\text{Atom}(\mathscr{L})$

### 公式

Formula（公式）的定义为， $\alpha \in Form(\mathscr L)$ 当且仅当它能由以下规则（有限次使用）生成：
- $Atom(\mathscr L)\subseteq Form(\mathscr L)$。
- 若 $\alpha\in Form(\mathscr L)$，则 $(\neg\alpha)\in Form(\mathscr L)$。
- 若 $\alpha,\beta\in Form(\mathscr L)$，则 $(\alpha * \beta)\in Form(\mathscr L)$，其中 $*\in\{\land,\lor,\to,\leftrightarrow\}$。
- 若 $\alpha\in Form(\mathscr L)$ 且 $x$ 是变量，则 $(\forall x\,\alpha)\in Form(\mathscr L)$ 且 $(\exists x\,\alpha)\in Form(\mathscr L)$。

惯例：
- 可像命题逻辑中一样省略部分括号。
- 量词周围的括号可省略。