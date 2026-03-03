**Concepts:**
- Conditional Probability: $P(a|b) =\frac{P(a\land b)}{P(b)}=\alpha P(a\land b)$
- Random Variables
- Independence: $P(a\land b)=P(a)P(b)$
- Bayes' Rule: $P(b|a)=\frac{P(b)P(a|b)}{P(a)}$
- Joint Probability
- Probability Rules:
  - Negation: $P(\neg a)=1-P(a)$
  - Inclusion-Exclution: $P(a\lor b)=P(a)+P(b)-P(a\land b)$
  - Marginalization: 
    -  $P(a)=P(a,b)+P(a,\neg b)$
    - $P(X=x_{i})=\sum_{j} P(X=x_{i}, Y=y_{j})$
  - Conditioning:
    - $P(a) =P(b)P(a|b) + P(\neg b)P(a|\neg b)$  
	- $P(X=x_{i})=\sum_{j}P(Y=y_{j})P(X=x_{i}|Y=y_{j})$

### Bayesian Network

A Bayesian network is a data structure(directed graphs) that represents the dependencies among random variables.

![[2 - Uncertainty.png]]

**Concepts:**
- Inference
  - Query, Evidence variables, Hidden variables, The goal
- Inference by Enumeration: 
  $$
P(X|e)=\alpha P(X,e)=\alpha \sum_{y}P(X,e,y)
$$
- Approximate Inference (Sampling):
  - Each variable is sampled for a value according to its probability distribution.
  - Likelihood Weighting: 
    - Fixing the evidence variables.
    - Sample the non-evidence variables.
    - Weight each sample by its likelihood: the probability of all the evidence occurring.

### Markov Models

**Concepts:**
- Markov Assumption: the current state depends on only a finite fixed number of previous states.
- Markov Chain: a sequence of random variables where the distribution of each variable follows the Markov assumption.
- Observation and Hidden State
  - Hidden Markov Models: Hidden states generate observed event (Sensor model).
  - Sensor Markov Assumption: The evidence variable depends only on the corresponding state.
- Tasks:

| Tasks                   | Definition                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Filtering               | Given observations from start until now, calculate the probability distribution for the current state. |
| Prediction              | Given observations from start until now, calculate the probability distribution for a future state.    |
| Smoothing               | Given observations from start until now, calculate the probability distribution for a past state. <br> |
| Most likely explanation | Given observations from start until now, calculate most likely sequence of events.                     |
