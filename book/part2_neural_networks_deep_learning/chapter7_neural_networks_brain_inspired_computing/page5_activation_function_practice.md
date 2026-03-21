---
title: "Activation Function Practice"
type: "practice"
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

# Implement each activation function from scratch

def sigmoid(x):
    # Returns values between 0 and 1
    # Formula: 1 / (1 + e^(-x))
    pass

def relu(x):
    # Returns x if x > 0, else 0
    # Hint: np.maximum()
    pass

def tanh_activation(x):
    # Returns values between -1 and 1
    # Hint: np.tanh()
    pass

# Test inputs
x = np.array([-3.0, -1.0, 0.0, 1.0, 3.0])

# Apply each function
sigmoid_out = sigmoid(x)
relu_out = relu(x)
tanh_out = tanh_activation(x)

# Don't change the code below - it's for testing
def check_activations():
    return sigmoid_out, relu_out, tanh_out
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