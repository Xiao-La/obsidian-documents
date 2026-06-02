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

优先级（Precedence）：
- 有括号优先
- $\forall x,\exists x$ 的优先级和 $\neg$ 相同，高于所有二元连接符
- 在 $\neg,\exists,\forall$ 之间是右结合的

解析树（Parse Tree）例如 $\forall x((P(x)\to Q(x))\land S(x,y))$
![[FOL - 一阶逻辑.png|283]]

### 形式化表达（Formalization）

Every student knows math.
$\forall xS(x)\to K(x,\text{Math})$
Some student knows math.
$\exists xS(x)\land K(x,\text{Math})$

Every student is younger than some instructor.
$\forall x(S(x)\to(\exists y(I(y)\land Y(x,y))))$

Every Son of my father is my brother.
用 Predicate： $\forall x\forall y(F(x,m)\land S(y,x)\to B(y,m))$
用 Function：$\forall x(S(x,f(m))\to B(x,m))$

## 语义（Semantics）

Scope（作用域）：在公式 $\forall x\alpha$ 或 $\exists x\alpha$ 中，$x$ 是量化变量（Quantified Variable），它的 Scope 就是 $\alpha$。例如，$\forall xP(x)\land Q(x)$ 中，$x$ 的 Scope 是 $P(x)$。

定义 
- Free Variables（自由变元）：不在量化变量 $x$ 的 scope 中的 $x$ 就是自由变元。
- Bounded Variables（约束变元）：其他情况。
另一种定义方式：解析树中，如果一个叶子节点 $x$ 到根节点的路径中不存在 $\forall x$ 或 $\exists x$，则它是一个自由变元。否则，为约束变元。
![[FOL - 一阶逻辑-1.png|323]]
定义：没有自由变量的公式叫做 **Closed Formula / Sentence**（闭公式/句子）。因为没有自由变量才能决定真或假。
对闭公式赋予意义需要对其中非逻辑符号（常量，谓词和函数）做阐释（Interpretation）（对应到定定义域上）。例如：![[FOL - 一阶逻辑-2.png]]
对变量也赋予一个值，就是环境（Environment）。例如：$E(x)=1$ 就是说在环境 $E$ 中， $x=1$。
定义：在 $\mathcal{I}$ 和 $E$ 中，项 $t$ 的值记为 $t^{(\mathcal{I},E)}$。若它是常量，则为 $c^{\mathcal{I}}$。若它为变量，则为 $x^E$。若为函数，则为迭代的产物。
有了阐释和环境，原子公式（Atom Formula）的值也就可以确定了：$P(t_{1},\dots,t_{n})^{(\mathcal{I},E)}$。进一步，可迭代定义出任何 wff 的值。
为了形式化定义含有量词的公式的值，我们定义一个新的记号 $E\left[ x\mapsto d \right]$：
$$
E\left[ x \mapsto d \right](y):=\begin{cases}
d & \text{if } y=x \\
E(y) & \text{if } y\neq x 
\end{cases} 
$$
那么定义
![[FOL - 一阶逻辑-3.png]]

**逻辑等价：**
对偶性 （Duality）：
$$
\neg \forall xP(x)\equiv \exists x\neg P(x)
$$
$$
\neg \exists xP(x)\equiv \forall x\neg P(x)
$$
因而 $\exists \sim \neg \forall \neg, \forall\sim \neg \exists \neg$。
且命题逻辑中的逻辑等价在一阶逻辑中仍然成立。
量词的可交换性（Commutativity）：
$$
\forall x\forall yP(x,y)\equiv \forall y\forall xP(x,y)
$$
$$
\exists x\exists yP(x,y)\equiv \exists y\exists xP(x,y)
$$
这里需要是相同种类的量词。
可交换性（Distributivity）：
$$
\forall x(P(x)\land Q(x))\equiv (\forall xP(x))\land(\forall xQ(x))
$$

$$
\exists x(P(x)\lor Q(x))\equiv(\exists xP(x))\lor(\exists xQ(x))
$$
若定义域有穷，则可以通过枚举把量词拆成合取或析取式。

**可满足性（Satisfiability）：** 与命题逻辑类似。一个阐释 $\mathcal{I}$ 和环境 $E$ 满足 $\alpha$，记作 $\mathcal{I}\vDash_{E}\alpha$，当且仅当 $\alpha^{(\mathcal{I},E)}=1$。否则为不满足，记作 $\mathcal{I}\not\vDash_{E}\alpha$。
若对任何 $E$ 都有 $\mathcal{I}\vDash_{E}\alpha$，则称 $\mathcal{I}$ 满足 $\alpha$，记作 $\mathcal{I}\vDash\alpha$。
拓展到一组公式：$\mathcal{I}\vDash_{E}\Sigma$。这里记号 $\vDash$ 代表满足。

语义蕴含（Semantic Entailment）的定义：对于 FOL 中的公式组 $\Sigma$ 和公式 $\alpha$，有 $\Sigma\vDash\alpha$ 当且仅当：
- 对任意诠释 $\mathcal{I}$ 和环境 $E$，若 $\mathcal{I}\vDash_{E}\Sigma$ 则 $\mathcal{I}\vDash_{E}\alpha$。
这里记号 $\vDash$ 表示蕴含。

在 FOL 中，一个公式 $\alpha$ 是：
- 永真的（Valid）：$\mathcal{I}_{E}\vDash\alpha$ 对任意 $\mathcal{I},E$。类似与 PL 中的永真式（Tautology）
- 可满足的（Satisfiable）：存在一组诠释和环境满足 $\alpha$。
- 不可满足的（Unsatisfiable）：不存在诠释和环境满足 $\alpha$。
$\emptyset\vDash\alpha$ 表示 $\alpha$ 是正当的/永真式。
例如：
$$
\exists y\forall x R(x,y)\to \forall x\exists yR(x,y)
$$
$$
\exists x(P(x)\to \forall xP(x))
$$
**FOL 的不可判定性（Undecidability）**：给定一个公式，不可能用某个程序判断它是否是永真式。（可以表示为停机问题）
而 PL 可以决定，因为可以用真值表判定。

### ND 证明

替换（Substitution）：
$$
\alpha[t/x]
$$
表示将公式 $\alpha$ 中的**自由变元** $x$ 替换为 $t$。
为了避免语义的改变（Capture），需要替换为新的变量（Fresh Variable），也就是在 $\alpha$ 中没有出现过的变量。

推理规则：
- $\forall e$：
$$
\dfrac{\forall x\,\alpha}{\alpha[t/x]}
$$
- $\exists i$：
$$
\dfrac{\alpha[t/x]}{\exists x\,\alpha}
$$
- $\forall i$：
$$
\dfrac{
\boxed{
\begin{aligned}
y\text{ fresh} \\
\vdots \\
\alpha [y/x]
\end{aligned}}
}{\forall x \, \alpha}
$$
这里 fresh variable 不可以出现在 subproof 之外。最好不要出现在任何的 $\alpha$ 和 $\Sigma$ 中。
例如：![[FOL - 一阶逻辑-4.png]]
- $\exists e$：
$$
\dfrac{(\exists x\,\alpha)_\,\boxed{\begin{align}
\alpha[u / x], u\text{ fresh} \\
\vdots \\
\beta
\end{align}} }{\beta}
$$
ND for FOL 是完备的（Complete）和可靠的（Sound）。

任何 FOL 中的公式可以写成前束范式（Prenex Normal Form）：
$$
Q_{1}x_{1}Q_{2}x_{2}\dots Q_{k}x_{k}B
$$
其中 $Q_{i}$ 为量词，$B$ 为无量词的公式。

*其他逻辑系统：*
- Higher-Order Logic(HOL, 可描述 Property of a property / function 等)
- Temporal Logic（描述时间线上的逻辑）
- Modal Logic（描述必要性/可能性）
- Hoare Logic（可证明计算机程序的正确性）