___
 设 $\mathbf{A}=\begin{bmatrix}1 & 2 \\ 1 & 2\end{bmatrix}$，求 $\mathbf{A}^n$。
 - 猜想结论，使用数学归纳法证明。
 - 拆 $\mathbf{A}=\begin{bmatrix}1 & 2\end{bmatrix} \begin{bmatrix}1 \\ 1\end{bmatrix}$，使用矩阵乘法结合律得 $\mathbf{A}^n=\begin{bmatrix}1 & 2\end{bmatrix} \left( \begin{bmatrix}1 \\ 1\end{bmatrix} \begin{bmatrix}1 & 2\end{bmatrix} \right) ^{n-1} \begin{bmatrix}1 \\ 1\end{bmatrix}=3^{n-1}\mathbf{A}$。
___
 若方程 $\mathbf{A}\mathbf{x}=\mathbf{O}$ 存在非零解 $\mathbf{x}$，证明矩阵 $\mathbf{A}$ 不可逆。
 - 使用**结合律**。假设 $\mathbf{A}$ 存在逆 $\mathbf{A}^{=1}$。一方面，$\mathbf{A}^{-1}\mathbf{A}\mathbf{x}=\mathbf{A}^{-1}\mathbf{O}=\mathbf{O}$，另一方面， $\mathbf{A}^{-1}\mathbf{A}\mathbf{x}=\mathbf{I}\mathbf{x}=\mathbf{x}$。也就是说， $\mathbf{x}=\mathbf{O}$，与假设矛盾，故假设不成立。
___
