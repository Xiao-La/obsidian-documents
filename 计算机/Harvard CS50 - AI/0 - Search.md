
### Search Problem

Concepts: Agent, State (Initial State), Actions, Transition Model, State Space, Goal Test, Path Cost.

>  **Transition Model:** A function $\text{Result(s, a)}$ returns the state resulting from performing action $\text{a}$ in state $\text{s}$.
### Solving Search Problem

Concepts: Solution (Optimal Solution), Node, Frontier

>  **Frontier:** the mechanism that “manages” the _nodes_. 

Search Processes: Repeat
1. If the frontier is empty: Stop. There is no solution to the problem.
2. Remove a node from the frontier. This is the node that will be considered.
3. If the node contains the goal state: Return the solution. Stop.
    Else,
    - Expand the node (find all the new nodes that could be reached from this node), and add resulting nodes to the frontier.
    * Add the current node to the explored set.
### Depth-First Search, DFS

DFS uses a **stack** as the frontier.

### Breadth-First Search, BFS

BFS uses a **queue** as the frontier.

>  Guaranteed to find the optimal solution.

### Greedy Best-First Search, GBFS

Concepts: Uninformed / Informed Search Algorithm.

>  **Informed Search Algorithm**: Consider additional knowledge to improve its performance.

GBFS expands node with lowest value of $h(n)$.

$h(n)=\text{estimate cost to goal}$

>  Not guaranteed to find the optimal solution.

### A* Search

A* search expands node with lowest value of $h(n)+g(n)$. 

$g(n)=\text{cost to reach node}$ 

- $h(n)$ is **admissive（可接受的）** if $0\leq h(n)\leq h^*(n)$ ($h^*(n)$ is the real cost to goal).
- $h(n)$ is **consistent（一致的）** if $h(n)\leq h(n')+\text{cost}(n\to n')$.

>  A* search is optimal if $h(n)$ is admissive and consistent.
### Minimax & Alpha-Beta Pruning

Concepts: Adversarial Search（对抗搜索）
#### Game

- Initial State $S_{0}$
- $\text{Player}(s)$, $\text{Actions}(s)$, $\text{Result}(s, a)$, $\text{Terminal}(s)$, $\text{Utility}(s)$
#### Minimax

Given a state $s$

- The **maximizing player** picks action $a$ in $\text{Actions}(s)$ that produces the highest value of $\text{Min-Value}(\text{Result}(s, a))$.
- The **minimizing player** picks action _a_ in $\text{Actions}(s)$ that produces the lowest value of $\text{Max-Value}(\text{Result}(s, a))$.

#### Alpha-Beta Pruning

Keep tracking: 
- $\alpha$: The lower bound of the score that the maximizing player can reach.
- $\beta$: The upper bound of the score that the minimizing player can reach.
If $\alpha \geq \beta$ happens for a node, there is no need to expand the node any more.
![[0 - Search-2.png]]

```pseudo
\begin{algorithm}
  \caption{Alpha-Beta Pruning}
  \begin{algorithmic}
    \Require{A node \texttt{u}, alpha bound \texttt{alph}, beta bound \texttt{beta}, a boolean \texttt{is\_max}, an evaluation function \texttt{Evaluate}}
    \Function{AlphaBeta}{\texttt{u}, \texttt{alph}, \texttt{beta}, \texttt{is\_max}}
      \If{\texttt{u} has no children}
        \State \Return \texttt{Evaluate(u)}
      \EndIf
      \If{\texttt{is\_max} = true}
        \ForAll{\texttt{child} of \texttt{u}}
          \State \texttt{alph} $\gets$ $\max(\texttt{alph}, \texttt{AlphaBeta(child, alph, beta, false)})$
          \If{\texttt{alph} $\ge$ \texttt{beta}}
            \Break
          \EndIf
        \EndFor
        \State \Return \texttt{alph}
      \Else
        \ForAll{\texttt{child} of \texttt{u}}
          \State \texttt{beta} $\gets$ $\min(\texttt{beta}, \texttt{AlphaBeta(child, alph, beta, true)})$
          \If{\texttt{alph} $\ge$ \texttt{beta}}
            \Break
          \EndIf
        \EndFor
        \State \Return \texttt{beta}
      \EndIf
    \EndFunction
  \end{algorithmic}
\end{algorithm}
```
