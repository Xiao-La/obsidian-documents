
## Artificial Neural Networks (ANN)

Model mathematical function from inputs to outputs, based on the structure and parameters of the network.

Learning the network's parameters based on data.

Consider the case of linear boundary, we use the hypothesis function $h(x_{1},x_{2})=w_{0}+w_{1}x_{1}+w_{2}x_{2}$, here we call $w_{0}$ the "bias". 

### Activation Function

We have different **activation function**(the threshold for classification):
![[5 - Neural Networks.png]]
![[5 - Neural Networks-1.png]]
![[5 - Neural Networks-2.png]]

### Neural Network Structure

Here $h(x_{1},x_{2})=g(w_{0}+w_{1}x_{1}+w_{2}x_{2})$ ($g$ is a activation function) represents a simplest ANN:

![[5 - Neural Networks-3.png|596]]
For example, we want to do an "or" function with this structure, we can set $w_{0}=-1, w_{1}=1, w_{2}=1$, and set $g$ with the step function.

Using linear function we can handle multiple inputs: $h=g\left(w_{0}+ \sum w_{i}x_{i} \right)$.
### Gradient Descent

- Start with a random choice of weights.
- Keep doing:
	- Calculate the gradient based on **all data points**: direction that will lead to decreasing loss.
	- Update the weights based on the gradient.

Variants:
- Stochastic Gradient Descent: calculate the gradient only using one data point.
- Mini-Batch Gradient Descent:  calculate the gradient using  a small batch

A case with multiple inputs and outputs: (multi-class classification)
![[5 - Neural Networks-4.png|545]]

### Multilayer Neural Networks

![[5 - Neural Networks-5.png]]

### Backpropagation

To train a multilayer neural network:
- Start with a random choice of weight.
- Repeat:
  - Calculate error for output layer.
  - For each layer, starting with output layer, and moving inwards towards earliest hidden layer:
     - Propagate error back one layer.
     - Update the weights.

### Deep Neural Networks

Neural networks with multiple hidden layers.
Deep learning.

### Overfitting

More nodes/layers -> more accurate / more likely overfitting

**Dropout:** Temporarily removing units (randomly) from a neural network to avoid overfitting. 

### TensorFlow

A tool developed by google to play with neural networks.

### Computer Vison

Recognize images.

We can use neural networks to do this.
A way is to use vectors (each pixel) to represent images.
Better way:
- **Image Convolution**: Applying a filter that adds each pixel value to its neighbors, weighted according to a kernel matrix.
![[5 - Neural Networks-6.png]]
`10=(10*0 + 20*(-1) + 30*0 + 10*(-1) + 20*5 + 30*(-1) + 20*0 + 30*(-1) + 40*0)`

![[5 - Neural Networks-7.png]]

This matrix is often used to detect edges. (Same values leads to 0, larger if the central is different from neighbors)

**Pooling:** Reduce the size of an image by pooling some pixels together. A way is to use **max-pooling** (choose the maximum value of a picture)

### Convolutional Neural Network (CNN)

Neural networks that use convolution, usually for analyzing images.

![[5 - Neural Networks-8.png|391]]

Input  -> Network -> Output

### Feed-Forward Neural Networks

Neural Network that has connections only in one direction.

### Recurrent Neural Networks

![[5 - Neural Networks-9.png]]

E.g. generate a sequence of words based on a picture.
Sometimes we can also use multiple inputs to learn from. (Another recurrent neural network) , e.g. learn from a sequence of words; translation.

One of the type: **Long short-term memory neural network / LSTM**