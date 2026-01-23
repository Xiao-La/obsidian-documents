线性变换将一个向量中的空间映射到另一个向量空间，它满足这两个条件：
$$
\text{1. }\mathbf{L}(a+b)=\mathbf{L}(a)+\mathbf{L}(b)
$$
$$
\text{2. }\mathbf{L}(ka)=k\mathbf{L}(a)
$$
线性变换可以用矩阵表示，矩阵的列表示基向量在变换后的坐标，例如：
$$
T=\begin{bmatrix}
\cos\theta & -\sin\theta \\
\sin\theta & \cos\theta
\end{bmatrix}
$$
表示将基向量绕原点逆时针旋转 $\theta$ ：
$$
\mathbf{i}'=\mathbf{T}(\mathbf{i})=T\begin{bmatrix}
1 \\
0
\end{bmatrix}=\begin{bmatrix}
\cos\theta \\
\sin\theta 
\end{bmatrix}
$$
$$
\mathbf{j}'= \mathbf{T}(\mathbf{j})=T\begin{bmatrix}
0 \\
1
\end{bmatrix}
=\begin{bmatrix}
-\sin\theta \\
\cos\theta 
\end{bmatrix}
$$
