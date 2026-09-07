## Local Search
### Hill Climbing

Choose a random state, and keep moving to a better neighbor state. 
It can find the **local extrema.**
**Variants:**
- Steepest-ascent - always choose the highest-valued neighbor
- Stochastic - choose randomly from higher-valued neighbors
- First-choice - choose the first higher-valued neighbor
- Random-restart - conduct hill climbing multiple times
- Local beam search - choose the k-highest-valued neighbor 

### Simulated Annealing

High temperature to lower temperature.
Less and less likely to accept worse result.

Function Simulated-Annealing (_problem_, _max_):
- _current_ = initial state of _problem_
- For _t_ = 1 to _max_:
    - _T_ = Temperature (_t_)
    - _neighbor_ = random neighbor of _current_
    - _ΔE_ = how much better _neighbor_ is than _current_
    - If _ΔE_ > 0:
        - _current_ = _neighbor_
    - With probability e^(_ΔE/T_) set _current_ = _neighbor_
- Return _current_

Local search can be used to solve TSP problem.

## Linear Programing

- Minimize $c_{1}x_{1}+\dots+c_{n}x_{n}$.
- With constraints of form $a_{1}x_{1}+\dots+a_{n}x_{n}\leq b$ or $a_{1}x_{1}+\dots+a_{n}x_{n}=b$.
- With bounds for each variable $l_{i}\leq x_{i}\leq u_{i}$.

Algorithms:
- Simplex
- Interior Points

```python
import scipy.optimize

# Objective Function: 50x_1 + 80x_2
# Constraint 1: 5x_1 + 2x_2 <= 20
# Constraint 2: -10x_1 + -12x_2 <= -90

result = scipy.optimize.linprog(
    [50, 80],  # Cost function: 50x_1 + 80x_2
    A_ub=[[5, 2], [-10, -12]],  # Coefficients for inequalities
    b_ub=[20, -90],  # Constraints for inequalities: 20 and -90
)

if result.success:
    print(f"X1: {round(result.x[0], 2)} hours")
    print(f"X2: {round(result.x[1], 2)} hours")
else:
    print("No solution")
```

## Constraint Satisfaction

- Set of variables $\{ X_{1},X_{2},\dots,X_{n} \}$
- Set of domains for each variable $\{D_{1},D_{2},\dots,D_{n}\}$
- Set of constraint $C$

Graph of constraints : use a graph to express the constraints
- Hard constraints - must be satisfied
- Soft constraints - preferred to be satisfied
- Unary constraint - 1 variable
- Binary constraint - 2 variable

![[3 - Optimization.png|422]]

An edge connecting A and B - binary constriant $(A,B)$
Node consistency - unary constraint for $A$ - remove some values from $A$ 's domain
Arc consistency - binary constraint - edge

Function Revise (_csp, X, Y_):
- _revised_ = _false_
- for _x_ in _X.domain_:
    - if no _y_ in _Y.domain_ satisfies constraint for (_X, Y_):
        - delete _x_ from _X.domain_
        - _revised_ = true
- Return _revised_

Function AC-3 (_csp_):
- _queue_ = all arcs in _csp_
- While _queue_ non-empty:
    - (_X, Y_) = Dequeue (_queue_)
    - If Revise (_csp, X, Y_):
        - If size of _X_. Domain == 0:
            - Return _false_
        - For each _Z_ in _X_. Neighbors - {_Y_}:
            - Enqueue (queue, (_Z, X_))
- Return true

### Backtracking Search

**CSPs as Search Problems**
（Assigning each variable with a value and checking the constraints）

Function Backtrack (_assignment, csp_):
- If _assignment_ complete:
    - Return _assignment_
- _var_ = Select-Unassigned-Var (_assignment, csp_)
- For _value_ in Domain-Values (_var, assignment, csp_):
    - If _value_ consistent with _assignment_:
        - Add {_var = value_} to _assignment_
        - _result_ = Backtrack (_assignment, csp_)
        - If _result_ ≠ _failure_:
            - Return _result_
        - _remove_ {_var = value_} from _assignment_
- Return failure

Enhanced version: Maintaining Arc-Consistency
- Enforcing arc-consistency every time we make a new assignment
- Call AC-3

Select-Unassigned-Var
- Minimum remaining values heuristic - select the smallest value
- Degree heuristic - select the highest degree

Domain-Values
- Least-constraining Values Heuristic: return values in order by #(choices ruled out for neighboring variables) 