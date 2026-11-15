
### Propositional Logic（命题逻辑）

**Propositional Symbols:** $P, Q, R\dots$
**Logical Connectives:**
1. Not（否定） ($\neg$)
2. And（合取） ($\land$)
3. Or（析取） ($\lor$)
4. Exclusive Or（异或） ($\oplus$)
5. Implication（蕴含） ($\to$)

| $P$   | $Q$   | $P\to Q$ |
| ----- | ----- | -------- |
| false | false | true     |
| false | true  | true     |
| true  | false | false    |
| true  | true  | true     |

5. Biconditional（双条件/当且仅当） ($\leftrightarrow$)

| $P$   | $Q$   | $P\leftrightarrow Q$ |
| ----- | ----- | -------------------- |
| false | false | true                 |
| false | true  | false                |
| true  | false | false                |
| true  | true  | true                 |

**Concepts:** 

- **Sentence:** An assertion in a knowledge representation language.
- **Model:** An assignment of a truth value to every proposition.
- **Knowledge Base (KB):** A set of sentences know by an agent. 
- **Entail（蕴含）：** $\alpha \vDash \beta$ means in **every model** where $\alpha$ is true, $\beta$ is true, too. 
- **Clause（子句）：** A disjunction of literals, e.g. ($P\lor Q\lor R$)
- **Conjunctive normal form (CNF)（合取范式）：** Logical sentence that is a conjunction of clauses, e.g. ($(A\lor B\lor C)\land (D\lor \neg E)\land (F\lor G)$)


### Model Checking Algorithm（模型检查算法）

To determine if KB entails $\alpha$, we enumerate all possible models, and check if in every model where KB is true, $\alpha$ is true as well.

```pseudo
\begin{algorithm}
\caption{Model Checking for $\mathit{KB}$ Entailing $\alpha$}
\begin{algorithmic}
  \Require a set of propositional atoms $\mathit{Atoms}$, a knowledge base $\mathit{KB}$ (a set of formulas), a formula $\alpha$
  \Ensure whether $\mathit{KB}$ entails $\alpha$; optionally a counterexample valuation
  \Procedure{Entails-By-Model-Checking}{$\mathit{KB}, \alpha, \mathit{Atoms}$}
    \State $\mathit{valuations} =$ \Call{Generate-All-Valuations}{$\mathit{Atoms}$}
    \ForAll{$v \in \mathit{valuations}$}
      \If{\Call{Satisfies-KB}{$v, \mathit{KB}$}}
        \If{\Call{Evaluate}{$\alpha, v$} $== \textsc{false}$}
          \Return “not entailed”, with counterexample $v$
        \EndIf
      \EndIf
    \EndFor
    \Return “entailed”
  \EndProcedure
  \Procedure{Satisfies-KB}{$v, \mathit{KB}$}
    \ForAll{$\phi \in \mathit{KB}$}
      \If{\Call{Evaluate}{$\phi, v$} $== \textsc{false}$}
        \Return $\textsc{false}$
      \EndIf
    \EndFor
    \Return $\textsc{true}$
  \EndProcedure
  \Procedure{Generate-All-Valuations}{$\mathit{Atoms}$}
    \Return an iterator over all mappings $\mathit{Atoms} \to \{\textsc{true}, \textsc{false}\}$
  \EndProcedure
  \Procedure{Evaluate}{$\phi, v$}
    \If{\Call{Is-Atom}{$\phi$}}
      \Return $v[\phi]$
    \Elif{\Call{Is-Negation}{$\phi$}}
      \Return not \Call{Evaluate}{$\phi.\mathit{sub}, v$}
    \Elif{\Call{Is-Conjunction}{$\phi$}}
      \Return \Call{Evaluate}{$\phi.\mathit{left}, v$} and \Call{Evaluate}{$\phi.\mathit{right}, v$}
    \Elif{\Call{Is-Disjunction}{$\phi$}}
      \Return \Call{Evaluate}{$\phi.\mathit{left}, v$} or \Call{Evaluate}{$\phi.\mathit{right}, v$}
    \Elif{\Call{Is-Exclusive-Or}{$\phi$}}
      \Return \Call{Evaluate}{$\phi.\mathit{left}, v$} $\ne$ \Call{Evaluate}{$\phi.\mathit{right}, v$}
    \Elif{\Call{Is-Implication}{$\phi$}}
      \Return not \Call{Evaluate}{$\phi.\mathit{left}, v$} or \Call{Evaluate}{$\phi.\mathit{right}, v$}
    \Elif{\Call{Is-Biconditional}{$\phi$}}
      \Return \Call{Evaluate}{$\phi.\mathit{left}, v$} $==$ \Call{Evaluate}{$\phi.\mathit{right}, v$}
    \Else
      \State \textbf{error} “unsupported formula”
    \EndIf
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

### Inference（推理）

- **Modus Ponens（肯定前件）：** $\displaystyle \dfrac{(\alpha \to \beta,\, \alpha)}{\beta}$

- **And Elimination（合取消去）：** $\displaystyle \dfrac{(\alpha \land \beta)}{(\alpha,\, \beta)}$

- **Double Negation Elimination（双重否定消去）：** $\displaystyle \dfrac{(\neg(\neg \alpha))}{\alpha}$

- **Implication Elimination（蕴含消去）：** $\displaystyle \dfrac{(\alpha \to \beta)}{(\neg \alpha \lor \beta)}$

- **Biconditional Elimination（双条件消去）：** $\displaystyle \dfrac{(\alpha \leftrightarrow \beta)}{((\alpha \to \beta) \land (\beta \to \alpha))}$

- **De Morgan's law（德摩根律）：**
  - $\displaystyle \dfrac{\neg(\alpha \land \beta)}{(\neg \alpha \lor \neg \beta)}$
  - $\displaystyle \dfrac{\neg(\alpha \lor \beta)}{(\neg \alpha \land \neg \beta)}$

- **Distributive Property（分配律）：**
  - $\displaystyle \dfrac{(\alpha \land (\beta \lor \gamma))}{((\alpha \land \beta) \lor (\alpha \land \gamma))}$
  - $\displaystyle \dfrac{(\alpha \lor (\beta \land \gamma))}{((\alpha \lor \beta) \land (\alpha \lor \gamma))}$


> $()$ is equivalent to *false*: $$\dfrac{\begin{array}{c}
P \\
\neg P
\end{array}}{()}$$

### Inference by Resolution（归结推理）

To determine if KB entails $\alpha$, we check if $(\text{KB}\land \neg\alpha)$ is a contradiction.
1. Convert $(\text{KB}\land \neg\alpha)$  to Conjunctive Normal Form.
2. Keep checking to see if we can use resolution（归结） to produce a new clause.
3. If we ever produce the empty clause（空子句）, i.e., there is a contradiction, then $\text{KB}\vDash \alpha$.
4. If contradiction is not achieved and no more clauses can be inferred, there is no entailment.

### First-Order Logic（一阶逻辑）

**Concepts:**
- **Constant Symbol（常量符号）：** Objects.
- **Predicate Symbol（谓词符号）：** Relations or functions that take an argument and return a true of false value.
- **Universal Quantification（全称量化）：**  $\forall x, \dots$
- **Existential Quantification（存在量化）：** $\exists x, \dots$
