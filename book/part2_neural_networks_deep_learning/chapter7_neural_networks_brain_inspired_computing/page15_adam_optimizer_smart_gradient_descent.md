---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "PyTorch: optim.Adam"
    url: "https://pytorch.org/docs/stable/generated/torch.optim.Adam.html"
---

# Adam Optimizer: Smart Gradient Descent

## Adaptive Learning Rates for Every Parameter

Adam is a popular optimizer that adapts learning rates for each parameter based on past gradients, making training faster and more stable.

### Why Adam Works Well

Adam combines ideas from two earlier methods:
- **Momentum**: Smooths gradients by keeping a moving average
- **RMSProp**: Scales learning rates based on recent gradient magnitudes

### The Algorithm (High Level)

1. Compute gradient `g` for each parameter
2. Update moving averages:
   - `m` (mean of gradients)
   - `v` (mean of squared gradients)
3. Correct bias in `m` and `v` (especially early in training)
4. Update parameters using `m / (sqrt(v) + ε)`

### Typical Hyperparameters

- `learning_rate` (α): often 0.001
- `beta1`: momentum term (default 0.9)
- `beta2`: second moment term (default 0.999)
- `epsilon`: small constant for numerical stability (1e-8)

### Why Adam is Popular

- Works well with little tuning
- Handles sparse gradients (e.g., NLP embeddings)
- Fast convergence in many applications

### When to Use Adam

- When you want a reliable optimizer with minimal tuning
- For deep networks and large datasets
- When gradients vary significantly across parameters

### When Not to Use Adam

- Some problems benefit from SGD with momentum
- Can sometimes generalize worse (requires tuning)
- Less interpretable than simple SGD

### Remember
- Adam adapts learning rates per parameter
- Combines momentum and RMSProp ideas
- Great default choice for many models
- Still benefit from learning rate scheduling

Next: Use Adam in your neural network training.