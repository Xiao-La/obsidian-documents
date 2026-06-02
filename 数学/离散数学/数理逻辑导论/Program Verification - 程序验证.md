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
- 对任意的满足 $P$ 的状态 $s_{1}$，如果执行 $C$ 后终止在状态 $s_{2}$，则 $s_{2}$ 满足 $Q$。
记作 
$$
\vDash _{par} (\!| P |\!) \; C \; (\!| Q |\!)
$$
