
1.7 2.5 3.5 5.4 6.4 6.5 不考

## Chapter 3

1. Orthogonal definition: $u^Tv=0$
2. $C(A)\perp N(A^T), C(A^T)\perp N(A)$
3. Projections $\frac{aa^T}{a^Ta}$
4. Gram-Schmidt -> $QR$, $v_{1},v_{2},v_{3}\to q_{1},q_{2},q_{3}$

## Chapter 4

1. Compute $\det(A)$
2. $\lvert AB \rvert=\lvert A \rvert \lvert B \rvert, \lvert A^T \rvert = \lvert A \rvert$
3. Cofactor Expansion $\lvert A \rvert=\sum_{j}a_{ij}C_{ij}$
4. $A^{-1}= \frac{C^T}{\lvert A \rvert}$ 
5. Cramer's Rule $Ax=b$ -> $x_{j}= \frac{\lvert B_{j} \rvert}{\lvert A \rvert}$
6. $d_{k}= \frac{\lvert A_{k} \rvert}{\lvert A_{k-1} \rvert}$

## Chapter 5

1. $\lvert A-\lambda I \rvert=0$
2. $A-\lambda I=0$ -> $N(A-\lambda I)$ - eigenspace
3. A is diagonalizable <->  A has n independent eigenvectors <- there exists n distinct eigenvalues
$$
A=S\Lambda S^{-1}
$$$A^k=S\Lambda^kS^{-1}$ , sequence -> $u_{n+1}=Au_{n}$
4. Complex Matrix - $A^H$
Hermitian $A^H=A$
Unitary $U^HU=I$
Skew-Hermitian $A^H=-A$ 
-> Normal Matrices $A^HA=AA^H$ -> Spectral Theorem $A=U\Lambda U^H$
-> Symmetric $A^T=A$ -> $A=Q\Lambda Q^T$

## Chapter 6

1. $x^TAx$ <-> A symmetric

2. A>0 TFAE:
$\lambda_{i}>0$
$\lvert A_{k} \rvert>0$
$d_{k}>0$
$A=C^TC$, C invertible

3.  Quadric Surface $x^TAx=1$
$A=Q\Lambda Q^T$ -> $(Q^Tx)^T\Lambda(Q^Tx)=1$ -> $y^T\Lambda y=1$
$\lambda_{1}y_{1}^{2}+\lambda y_{2}^{2}+\dots=1$

4.  Law of Inertia
$\exists x=Cy, f(y)=y_{1}^{2}+y_{2}^{2}+\dots+y_{p}^{2}-y_{p+1}^{2}-\dots-y_{r}^{2}$ 
P - positive inertia, q 0 negative inertia

5. SVD
$$
A=U\Sigma V^T
$$

