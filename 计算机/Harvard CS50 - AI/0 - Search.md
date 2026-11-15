### Search Problem

Concepts: Agent（智能体）, State（状态） (Initial State（初始状态）), Actions（动作）, Transition Model（转移模型）, State Space（状态空间）, Goal Test（目标测试）, Path Cost（路径代价）.

>  **Transition Model（转移模型）:** A function $\text{Result(s, a)}$ returns the state resulting from performing action $\text{a}$ in state $\mathrm{s}$.
### Solving Search Problem

Concepts: Solution（解） (Optimal Solution（最优解）), Node（节点）, Frontier（前沿/边界）

>  **Frontier（前沿/边界）:** the mechanism that “manages” the _nodes_.

Search Processes: Repeat
1. If the frontier is empty: Stop. There is no solution to the problem.
2. Remove a node from the frontier. This is the node that will be considered.
3. If the node contains the goal state: Return the solution. Stop.
    Else,
    - Add the current state to the explored set. Expand the node and add successor states that are neither explored nor already in the frontier.
    * The explored set（已探索集合）stores states.
### Depth-First Search, DFS（深度优先搜索）

DFS uses a **stack（栈）** as the frontier.

### Breadth-First Search, BFS（广度优先搜索）

BFS uses a **queue（队列）** as the frontier.

>  Guaranteed to find the shortest path in number of steps; optimal in path cost when every step has the same positive cost（每步代价相同时保证最优）.

### Greedy Best-First Search, GBFS（贪心最佳优先搜索）

Concepts: Uninformed / Informed Search Algorithm（无信息/有信息〔启发式〕搜索算法）.

>  **Informed Search Algorithm（有信息/启发式搜索算法）**: Consider additional knowledge to improve its performance.

GBFS expands node with lowest value of $h(n)$.

$h(n)=\text{estimate cost to goal}$

>  Not guaranteed to find the optimal solution（不保证找到最优解）.

### A* Search（A* 搜索）

A* search expands node with lowest value of $h(n)+g(n)$.

$g(n)=\text{cost to reach node}$

- $h(n)$ is **admissive（可采纳）** if $0\leq h(n)\leq h^*(n)$ ($h^*(n)$ is the real cost to goal).
- $h(n)$ is **consistent（一致的）** if $h(n)\leq h(n')+\text{cost}(n\to n')$.

>  A* search is optimal（最优） if $h(n)$ is admissive and consistent.
### Minimax & Alpha-Beta Pruning（极大极小与 α-β 剪枝）

Concepts: Adversarial Search（对抗搜索）
#### Game（博弈）

- Initial State $S_{0}$（初始状态）
- $\text{Player}(s)$（玩家）, $\text{Actions}(s)$（动作）, $\text{Result}(s, a)$（结果/转移）, $\text{Terminal}(s)$（终止）, $\text{Utility}(s)$（效用）
#### Minimax（极大极小）

Given a state $s$

- The **maximizing player（最大化玩家）** picks action $a$ in $\text{Actions}(s)$ that produces the highest value of $\text{Min-Value}(\text{Result}(s, a))$.
- The **minimizing player（最小化玩家）** picks action _a_ in $\text{Actions}(s)$ that produces the lowest value of $\text{Max-Value}(\text{Result}(s, a))$.

#### Alpha-Beta Pruning（α-β 剪枝）

Keep tracking:
- $\alpha$: The lower bound（下界） of the score that the maximizing player can reach.
- $\beta$: The upper bound（上界） of the score that the minimizing player can reach.
If $\alpha \geq \beta$ holds for a node, there is no need to expand the node any more.
![[0 - Search-2.png]]

```pseudo
\begin{algorithm}
\caption{Alpha-Beta Pruning}
\begin{algorithmic}
  \Require a node $u$, an alpha bound $\alpha$, a beta bound $\beta$, a flag $\mathit{is}\text{-}\mathit{max}$, an evaluation function \textsc{Evaluate}
  \Procedure{Alpha-Beta}{$u, \alpha, \beta, \mathit{is}\text{-}\mathit{max}$}
    \If{$u$ has no children}
      \Return \Call{Evaluate}{$u$}
    \EndIf
    \If{$\mathit{is}\text{-}\mathit{max}$}
      \ForAll{$\mathrm{child}\ v\ \mathrm{of}\ u$}
        \State $\alpha = \max(\alpha,$ \Call{Alpha-Beta}{$v, \alpha, \beta, \textsc{false}$}$)$
        \If{$\alpha \ge \beta$}
          \Break
        \EndIf
      \EndFor
      \Return $\alpha$
    \Else
      \ForAll{$\mathrm{child}\ v\ \mathrm{of}\ u$}
        \State $\beta = \min(\beta,$ \Call{Alpha-Beta}{$v, \alpha, \beta, \textsc{true}$}$)$
        \If{$\alpha \ge \beta$}
          \Break
        \EndIf
      \EndFor
      \Return $\beta$
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```
