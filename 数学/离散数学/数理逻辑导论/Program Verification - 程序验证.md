## Hoare Logic

运行命令式程序（imperative program）可以描述为状态（state）的改变。

**Requirements** for a program (程序需求)：自然语言的描述。
**Specification** for a program (程序规范)：形式化的描述。
- Precondition（前置条件）：程序运行前的状态。
- Postcondtion （后置条件）：程序运行后的状态。

这些 Specification 是在 FOL 下，用 Hoare Triples（霍尔三元组）描述的。
Hoare Triple 形如：
$$
(\!| P |\!) \; C \; (\!| Q |\!)
$$
其中 $P,Q$ 为前置/后置条件，$C$ 为要检验的代码。

例如，“将 $y$ 设置为 $\max(x,y)$” 的 requirement 可写成这样的 specification：
$$
(\!| x=a\land y=b |\!) \; C \; (\!| y=\max(a,b) |\!)
$$
定义一个 Hoare Triple $(\!| P |\!) \; C \; (\!| Q |\!)$ 在 Partial Correctness 下 Satisfied，当且仅当：
- 对**任意的**满足 $P$ 的状态 $s_{1}$，如果执行 $C$ 后终止在状态 $s_{2}$，则 $s_{2}$ 满足 $Q$。
记作 
$$
\vDash _{par} (\!| P |\!) \; C \; (\!| Q |\!)
$$
如果永远不会 Terminate ，也说是 Satisfied。（这也满足定义，不过空真）
我们称一个程序是 Partially Correct，如果它**终止时**总是给出了正确答案。

定义一个 Hoare Triple $(\!| P |\!) \; C \; (\!| Q |\!)$ 在 Total Correctness 下 Satisfied，当且仅当：
- 对**任意的**满足 $P$ 的状态 $s_{1}$，执行 $C$ 后，会终止在状态 $s_{2}$，且 $s_{2}$ 满足 $Q$。
记作
$$
\vDash _{tot} (\!| P |\!) \; C \; (\!| Q |\!)
$$
Total correctness = Partial correctness + Termination

Program Variables / Logic Variables：因为程序中的变量会变，在 Hoare Triple 中，我们用 Fresh variable 来表示某些条件，例如：
$$
(\!| x=x_{0} \land x \geq 0 |\!) \; C \; (\!| y=x_{0}! |\!)
$$
### Axioms and Rules

要验证一个程序，需要构造一个证明序列：
![[Program Verification - 程序验证-1.png|416]]
（Axiom）
- Assignment： $$
\dfrac{}{(\!|  Q[E/x] |\!) \; x=E \; (\!| Q(x) |\!)}
$$
也就是，若要再执行赋值 `x=E` 后 $Q(x)$ 成立，则原来把 $Q$ 中的 $x$ 替换为 $E$ 一定成立。
例如，在图中 $\phi$ 应该是 $x+1>0\land y>0$。
![[Program Verification - 程序验证-2.png]]

（Implied Rule）
- Precondition Strengthening
$$
\dfrac{P\to P'\;\;(\!|  P' |\!) \; C \; (\!| Q |\!)}{(\!|  P |\!) \; C \; (\!| Q |\!)}
$$
也就是，可以把条件换成一个更强的条件。
- Postcondition Weakening
$$
\dfrac{(\!|  P |\!) \; C \; (\!| Q' |\!) \;\; Q'\to Q}{(\!|  P |\!) \; C \; (\!| Q |\!)}  
$$
- Composition
$$
\dfrac{(\!|  P |\!) \; C_{1} \; (\!| Q |\!) \;\; (\!|  Q |\!) \; C_{2} \; (\!| R |\!)}{(\!|  P |\!) \; C_{1},C_{2} \; (\!| R |\!)}
$$
- If statements
$$
\frac{
    (\!| P \land B |\!) \; C_1 \; (\!| Q |\!) \qquad (\!| P \land \neg B |\!) \; C_2 \; (\!| Q |\!)
}{
    (\!| P |\!) \text{ if } B \; \{C_1\} \text{ else } \{C_2\} \; (\!| Q |\!)
}
$$
![[Program Verification - 程序验证-3.png|559]]

**Loop Invariant（循环不变式）**：在循环中始终成立。
- Partial-While：
$$
\frac{
    (\!| I \land B |\!) \; C \; (\!| I |\!)
}{
    (\!| I |\!) \text{ while } B \; \{C\} \; (\!| I \land \neg B |\!)
}
$$
这里 $I$ 就是一个 Loop Invariant。需要合适地选取一个循环不变式，用来完成我们的证明。
![[Program Verification - 程序验证-4.png|487]]


