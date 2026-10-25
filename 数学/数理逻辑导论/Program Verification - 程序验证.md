## Hoare Logic

运行命令式程序（imperative program）可以描述为状态（state）的改变。

**Requirements** for a program (程序需求)：自然语言的描述。
**Specification** for a program (程序规范)：形式化的描述。
- Precondition（前置条件）：程序运行前的状态。
- Postcondtion （后置条件）：程序运行后的状态。

这些 Specification 是在 FOL 下，用 Hoare Triples（霍尔三元组）描述的。
Hoare Triple 形如：
$$
(\!\lvert  P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)
$$
其中 $P,Q$ 为前置/后置条件，$C$ 为要检验的代码。

例如，“将 $y$ 设置为 $\max(x,y)$” 的 requirement 可写成这样的 specification：
$$
(\!\lvert  x=a\land y=b \rvert \!) \; C \; (\!\lvert  y=\max(a,b) \rvert \!)
$$
定义一个 Hoare Triple $(\!\lvert  P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)$ 在 Partial Correctness 下 Satisfied，当且仅当：
- 对**任意的**满足 $P$ 的状态 $s_{1}$，如果执行 $C$ 后终止在状态 $s_{2}$，则 $s_{2}$ 满足 $Q$。
记作
$$
\vDash _{par} (\!\lvert  P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)
$$
如果永远不会 Terminate ，也说是 Satisfied。（这也满足定义，不过空真）
我们称一个程序是 Partially Correct，如果它**终止时**总是给出了正确答案。

定义一个 Hoare Triple $(\!\lvert  P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)$ 在 Total Correctness 下 Satisfied，当且仅当：
- 对**任意的**满足 $P$ 的状态 $s_{1}$，执行 $C$ 后，会终止在状态 $s_{2}$，且 $s_{2}$ 满足 $Q$。
记作
$$
\vDash _{\mathrm{tot}} (\!\lvert  P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)
$$
Total correctness = Partial correctness + Termination

Program Variables / Logic Variables：因为程序中的变量会变，在 Hoare Triple 中，我们用 Fresh variable 来表示某些条件，例如：
$$
(\!\lvert  x=x_{0} \land x \geq 0 \rvert \!) \; C \; (\!\lvert  y=x_{0}! \rvert \!)
$$
### Axioms and Rules

要验证一个程序，需要构造一个证明序列：
![[Program Verification - 程序验证-1.png|416]]
（Axiom）
- Assignment： $$
\dfrac{}{(\!\lvert   Q[E/x] \rvert \!) \; x=E \; (\!\lvert  Q(x) \rvert \!)}
$$
也就是，若要再执行赋值 `x=E` 后 $Q(x)$ 成立，则原来把 $Q$ 中的 $x$ 替换为 $E$ 一定成立。
例如，在图中 $\phi$ 应该是 $x+1>0\land y>0$。
![[Program Verification - 程序验证-2.png]]

（Implied Rule）
- Precondition Strengthening
$$
\dfrac{P\to P'\;\;(\!\lvert   P' \rvert \!) \; C \; (\!\lvert  Q \rvert \!)}{(\!\lvert   P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)}
$$
也就是，可以把条件换成一个更强的条件。
- Postcondition Weakening
$$
\dfrac{(\!\lvert   P \rvert \!) \; C \; (\!\lvert  Q' \rvert \!) \;\; Q'\to Q}{(\!\lvert   P \rvert \!) \; C \; (\!\lvert  Q \rvert \!)}  
$$
- Composition
$$
\dfrac{(\!\lvert   P \rvert \!) \; C_{1} \; (\!\lvert  Q \rvert \!) \;\; (\!\lvert   Q \rvert \!) \; C_{2} \; (\!\lvert  R \rvert \!)}{(\!\lvert   P \rvert \!) \; C_{1},C_{2} \; (\!\lvert  R \rvert \!)}
$$
- If statements
$$
\frac{
    (\!\lvert  P \land B \rvert \!) \; C_1 \; (\!\lvert  Q \rvert \!) \qquad (\!\lvert  P \land \neg B \rvert \!) \; C_2 \; (\!\lvert  Q \rvert \!)
}{
    (\!\lvert  P \rvert \!) \text{ if } B \; \{C_1\} \text{ else } \{C_2\} \; (\!\lvert  Q \rvert \!)
}
$$
![[Program Verification - 程序验证-3.png|559]]

**Loop Invariant（循环不变式）**：在循环中始终成立。
- Partial-While：
$$
\frac{
    (\!\lvert  I \land B \rvert \!) \; C \; (\!\lvert  I \rvert \!)
}{
    (\!\lvert  I \rvert \!) \text{ while } B \; \{C\} \; (\!\lvert  I \land \neg B \rvert \!)
}
$$
这里 $I$ 就是一个 Loop Invariant。需要合适地选取一个循环不变式，用来完成我们的证明。
![[Program Verification - 程序验证-4.png|487]]


