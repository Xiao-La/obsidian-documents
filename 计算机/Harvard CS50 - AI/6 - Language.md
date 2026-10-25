
 Natural Language Processing (NLP)

Language
- Syntax - structure
- Semantics - meaning

## Grammar

Formal grammar: a system of rules for generating sentences in a language.
- Context-Free grammar
- e.g. She saw the city. - NVDN
	- N : Noun
	- V : Verb
	- D : Determiner
- NP (Noun Phrase : N | D NP), VP (Verb Phrase : V | V NP), S (Sentence)
- S -> NP VP
![[6 - Language.png]]
- Others: AP (Adjective Phrase), PP (Prepositional Phrase) ...

Python lib `nltk`

### N-grams

N-grams: use n continuous grams（here a word） to understand the language.

Tokenization: splitting a sequence of characters into pieces (tokens)

We can use n-grams with Markov Chain to understand natural language and generate some sentence.

### Text Classification

Bag-of-words Model: represents text as an unordered collection of words.

To do text classification, we can use Naive Bayes:
$$
P(a\lvert b)= \frac{P(a)P(b\rvert a)}{P(b)}
$$
E.g. we have to classes, positive and negative. We first separate the sentence into words $w_{1},w_{2},\dots,w_{n}$. And **we assume the words are conditionally independent given the class.**
Then the probability that the sentence is positive is:
$$
P(\text{positive} \lvert w_{1},w_{2},\dots,w_{n})= \frac{P(\text{positive})P(w_{1}\rvert \text{positive})\dots P(w_{n}\lvert \text{positive})}{\sum_{c\in\{\text{positive},\text{negative}\}}P(c)\prod_{i=1}^n P(w_i\rvert c)}
$$
And the right hand side can be calculate easily.
To avoid the case that a word never appear in our training data (and make the probability 0), we use:
- Laplace smoothing: add 1 to each value in our distribution.
### Word Representation

Turn words into numbers.
- One-hot representation: a word is a vector with a single 1 and with others 0. (cannot represent similar words)
- Distributed representation: meaning distributed across multiple values.
  - Similar meaning = similar context
  - `word2vec` model

### Attention

Attention score: how important the word is. (a weight)

## Transformers

Old recurrent neural networks is sequential, not parallelized.

Encoder: for every word:
(Input word + Positional encoding)
{-> Multiple **Self-attention**(context) - Multi-headed attention
-> neural network} - repeating
-> encoded representation

Key idea of encoder and decoder:
![[6 - Language-1.png]]


