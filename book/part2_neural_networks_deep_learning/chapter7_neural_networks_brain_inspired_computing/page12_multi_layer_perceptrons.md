---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "PyTorch: nn.Sequential"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Sequential.html"
---

# Multi-Layer Perceptrons

## Stacking Layers for More Power

A Multi-Layer Perceptron (MLP) is a neural network with one or more hidden layers. More layers allow the model to learn more complex patterns.

### Structure of an MLP

- **Input layer**: Receives raw data
- **Hidden layers**: Each layer transforms data with weights + activation
- **Output layer**: Produces final prediction

Example:
```
Input → Dense(128) → ReLU → Dense(64) → ReLU → Dense(10) → Softmax
```

### Why Multiple Layers Help

- First layer learns simple patterns (edges, line segments)
- Next layers combine patterns into higher-level features (parts of objects)
- Deeper layers can represent very complex functions

### Universal Approximation Theorem

A neural network with at least one hidden layer can approximate any function (given enough neurons), which is why MLPs are so powerful.

### Overfitting vs Capacity

- More layers = more capacity = can model more complex data
- Too much capacity can overfit (memorize training data)
- Regularization (dropout, weight decay) helps

### Good Practices

- Start with 1–2 hidden layers for small datasets
- Use ReLU or other non-linear activations
- Normalize input data (mean=0, std=1)
- Monitor validation loss to avoid overfitting

### Remember
- MLPs are neural networks with hidden layers
- Depth allows learning complex patterns
- Each layer transforms the data
- Balance depth with regularization and data size

Next: Practice building an MLP and see performance improve.