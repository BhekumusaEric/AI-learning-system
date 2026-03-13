---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "ML Glossary: Activation Functions"
    url: "https://ml-cheatsheet.readthedocs.io/en/latest/activation_functions.html"
---

# Activation Functions: The Decision Maker

## Adding Non-Linearity to Neural Networks

Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns beyond straight lines.

### Why Non-Linearity Matters

Without activation functions, neural networks would just be linear regressions:
- Multiple linear layers = single linear layer
- Can't learn curves, circles, or complex shapes
- Limited to linear decision boundaries

### Common Activation Functions

**Sigmoid:**
```
f(x) = 1 / (1 + e^(-x))

- Output: 0 to 1
- Good for binary classification
- Problem: vanishing gradients for large |x|
```

**Tanh (Hyperbolic Tangent):**
```
f(x) = (e^x - e^(-x)) / (e^x + e^(-x))

- Output: -1 to 1
- Zero-centered (better than sigmoid)
- Still has vanishing gradient issues
```

**ReLU (Rectified Linear Unit):**
```
f(x) = max(0, x)

- Output: 0 to ∞
- Most popular in hidden layers
- Solves vanishing gradient problem
- Problem: "dying ReLU" (neurons stuck at 0)
```

**Leaky ReLU:**
```
f(x) = x if x > 0 else 0.01x

- Output: -∞ to ∞
- Fixes dying ReLU problem
- Allows small negative values
```

**Softmax:**
```
f(xᵢ) = e^(xᵢ) / Σe^(xⱼ)

- Output: probabilities that sum to 1
- Used in output layer for multi-class classification
- Converts logits to probabilities
```

### Choosing Activation Functions

- **Hidden layers**: ReLU or variants (fast, effective)
- **Binary classification output**: Sigmoid
- **Multi-class output**: Softmax
- **Regression output**: Linear (no activation)

### The Vanishing Gradient Problem

Some activations (sigmoid, tanh) cause gradients to become very small:
- Learning slows down or stops
- Deep networks can't train properly
- ReLU helps but has its own issues

### Modern Trends

- **Swish**: f(x) = x * sigmoid(x) - combines best of both
- **GELU**: Used in transformers (GPT, BERT)
- **Adaptive activations**: Functions that change during training

### Remember
- Add non-linearity to networks
- ReLU is most common for hidden layers
- Output activation depends on task
- Wrong activation can prevent learning

Next, experiment with different activation functions!