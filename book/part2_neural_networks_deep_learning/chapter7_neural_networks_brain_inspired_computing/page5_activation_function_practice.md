---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "PyTorch: Non-linear Activations"
    url: "https://pytorch.org/docs/stable/nn.html#non-linear-activations-weighted-sum-nonlinearity"
---

# Activation Function Practice

## Practice: Comparing Activations

Implement and compare different activation functions on the same input.

### Initial Code

```python
import numpy as np
import matplotlib.pyplot as plt

# Define activation functions
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

def relu(x):
    return np.maximum(0, x)

def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)

# Test inputs
x = np.linspace(-5, 5, 100)

# 1. Apply each activation function
sigmoid_out = sigmoid(x)
tanh_out = tanh(x)
relu_out = relu(x)
leaky_out = leaky_relu(x)

# 2. Find the range (min/max) of each activation's output
sigmoid_range = (sigmoid_out.min(), sigmoid_out.max())
tanh_range = (tanh_out.min(), tanh_out.max())
relu_range = (relu_out.min(), relu_out.max())
leaky_range = (leaky_out.min(), leaky_out.max())

# 3. Test specific values
test_value = 2.0
sigmoid_test = sigmoid(test_value)
relu_test = relu(test_value)

# Don't change the code below - it's for testing
def check_activations():
    return sigmoid_range, relu_range, sigmoid_test > 0.5, relu_test == test_value
```

### Hidden Tests

Test 1: Sigmoid range is (0, 1)
Test 2: ReLU range starts at 0
Test 3: Sigmoid(2.0) > 0.5
Test 4: ReLU(2.0) = 2.0

### Hints
- Use np.exp() for sigmoid
- np.maximum() for ReLU
- np.where() for leaky ReLU
- All functions should work on arrays