---
title: "Building Your First Neural Network"
type: "practice"
colab_notebook: "notebooks/part2_neural_networks/chapter7/page11_building_your_first_neural_network.ipynb"
resources:
  - title: "PyTorch: Build the Neural Network"
    url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html"
---

# Building Your First Neural Network

## Practice: Build a Neural Network from Scratch with NumPy

Before using frameworks like PyTorch, let's build the core pieces of a neural network by hand using NumPy. This is the best way to truly understand what's happening inside.

We'll build a 2-layer network that learns the XOR function:
- Input: 2 values (0 or 1)
- Hidden layer: 4 neurons, sigmoid activation
- Output: 1 neuron, sigmoid activation

### Initial Code

```python
import numpy as np

def sigmoid(x):
    # Sigmoid activation: 1 / (1 + e^(-x))
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    # Derivative of sigmoid: s(x) * (1 - s(x))
    s = sigmoid(x)
    return s * (1 - s)

# XOR training data
X = np.array([[0,0], [0,1], [1,0], [1,1]])  # inputs
y = np.array([[0],   [1],   [1],   [0]])     # expected outputs

np.random.seed(42)

# 1. Initialise weights randomly (small values)
#    W1: shape (2, 4)  — connects 2 inputs to 4 hidden neurons
#    W2: shape (4, 1)  — connects 4 hidden neurons to 1 output
W1 = np.random.randn(2, 4) * 0.1
W2 = np.random.randn(4, 1) * 0.1

# 2. Initialise biases to zeros
#    b1: shape (1, 4),  b2: shape (1, 1)
b1 = np.zeros((1, 4))
b2 = np.zeros((1, 1))

lr = 0.5
losses = []

for epoch in range(5000):
    # --- Forward pass ---
    # Hidden layer: z1 = X @ W1 + b1,  a1 = sigmoid(z1)
    z1 = X @ W1 + b1
    a1 = sigmoid(z1)

    # Output layer: z2 = a1 @ W2 + b2,  a2 = sigmoid(z2)
    z2 = a1 @ W2 + b2
    a2 = sigmoid(z2)

    # --- Loss: Mean Squared Error ---
    loss = np.mean((y - a2) ** 2)
    losses.append(loss)

    # --- Backward pass ---
    # Output layer gradients
    dL_da2 = -2 * (y - a2) / len(X)
    da2_dz2 = sigmoid_derivative(z2)
    delta2 = dL_da2 * da2_dz2          # shape (4, 1)

    # Hidden layer gradients
    delta1 = (delta2 @ W2.T) * sigmoid_derivative(z1)  # shape (4, 4)

    # 3. Update weights and biases using gradient descent
    #    W2 -= lr * (a1.T @ delta2)
    #    b2 -= lr * sum of delta2 (axis=0, keepdims=True)
    #    W1 -= lr * (X.T @ delta1)
    #    b1 -= lr * sum of delta1 (axis=0, keepdims=True)
    W2 -= lr * (a1.T @ delta2)
    b2 -= lr * np.sum(delta2, axis=0, keepdims=True)
    W1 -= 
    b1 -= 

# Final predictions (round to 0 or 1)
final_output = np.round(sigmoid(sigmoid(X @ W1 + b1) @ W2 + b2)).astype(int)

# Don't change the code below - it's for testing
def check_training():
    return losses[0], losses[-1], final_output.flatten().tolist()
```

### Hidden Tests

Test 1: losses[-1] < losses[0] (loss decreased over training)
Test 2: final_output matches XOR: [0, 1, 1, 0]

### Evaluation Code
```python
assert losses[-1] < losses[0], "Loss should decrease over 5000 epochs"
assert final_output.flatten().tolist() == [0, 1, 1, 0], "Network should learn XOR correctly"
```

### Hints
- `W1 -= lr * (X.T @ delta1)` — same pattern as W2 update
- `b1 -= lr * np.sum(delta1, axis=0, keepdims=True)` — sum over the batch
- If loss isn't decreasing, check that you're subtracting (not adding) the gradient
