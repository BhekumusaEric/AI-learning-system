---
resources:
  - title: "3Blue1Brown: Neural Networks"
    url: "https://www.3blue1brown.com/topics/neural-networks"
  - title: "PyTorch Deep Learning Basics"
    url: "https://pytorch.org/tutorials/beginner/basics/intro.html"
---

# Gradient Descent: Downhill to Success

## Finding the Lowest Point by Following the Slope

Gradient descent is the algorithm that trains neural networks and many other machine learning models. It's like rolling a ball downhill to find the bottom of a valley.

### The Analogy: Hiking Down a Mountain

Imagine you're lost in the mountains at night with only a flashlight. You need to get to the lowest point (the valley) to find civilization. How do you do it?

**The gradient descent way:**
1. Look around with your flashlight
2. Find the direction that goes most downhill
3. Take a step in that direction
4. Repeat until you can't go any lower

### Mathematical Foundation

In machine learning, we want to minimize a loss function L(θ), where θ are the model parameters (weights and biases).

**Gradient:** The slope (derivative) of the loss function
**Direction:** Negative gradient points toward lower loss
**Step size:** How far to move in that direction

### The Basic Algorithm

```
Repeat until convergence:
    1. Calculate gradient: ∇L = ∂L/∂θ
    2. Update parameters: θ = θ - α * ∇L
    3. Check if loss decreased enough
```

Where α (alpha) is the learning rate.

### Visual Example

Imagine a simple loss function: L(θ) = θ²

```
Loss vs Parameter θ
    ↑
  4 │          *
  3 │        *   *
  2 │      *       *
  1 │    *           *
  0 │___*_______________*___→
      -2 -1  0  1  2
```

**Gradient:** dL/dθ = 2θ
**Update:** θ = θ - α * 2θ

If θ = 2, gradient = 4, so we move left toward 0.

### Types of Gradient Descent

#### 1. Batch Gradient Descent
Uses all training examples to compute gradient:
- **Pros:** Stable, accurate gradient
- **Cons:** Slow for large datasets
- **When to use:** Small datasets

```python
# Pseudocode
for epoch in range(max_epochs):
    gradient = compute_gradient_all_data(X, y, theta)
    theta = theta - learning_rate * gradient
```

#### 2. Stochastic Gradient Descent (SGD)
Uses one training example at a time:
- **Pros:** Fast, can escape local minima
- **Cons:** Noisy, never converges exactly
- **When to use:** Large datasets, online learning

```python
for epoch in range(max_epochs):
    for i in range(n_samples):
        gradient = compute_gradient_one_example(X[i], y[i], theta)
        theta = theta - learning_rate * gradient
```

#### 3. Mini-Batch Gradient Descent
Uses small batches of training examples:
- **Pros:** Balance of speed and stability
- **Cons:** Hyperparameter (batch size)
- **When to use:** Most practical scenarios

```python
batch_size = 32
for epoch in range(max_epochs):
    for batch in get_batches(X, y, batch_size):
        gradient = compute_gradient_batch(batch, theta)
        theta = theta - learning_rate * gradient
```

### The Learning Rate α

**Too small:** Slow convergence, gets stuck in local minima
**Too large:** Overshoots minimum, may diverge
**Just right:** Converges efficiently

### Adaptive Learning Rates

**Momentum:** Remembers previous gradients, builds speed
**RMSProp:** Adapts learning rate per parameter
**Adam:** Combines momentum and RMSProp (most popular)

### Local vs Global Minima

**Local minimum:** Lowest point in your neighborhood
**Global minimum:** Absolute lowest point in the entire landscape

**Challenge:** Gradient descent can get stuck in local minima
**Solutions:** Multiple random starts, momentum, different optimizers

### Convergence Criteria

**Stop when:**
- Loss change < threshold
- Gradient magnitude < threshold
- Maximum iterations reached
- Validation loss stops improving (early stopping)

### Real-World Considerations

**Feature scaling:** Normalize features so gradients are similar magnitude
**Initialization:** Start weights randomly (not all zero)
**Regularization:** Add penalties to prevent overfitting
**Monitoring:** Track loss on training and validation sets

### Example: Linear Regression with Gradient Descent

```python
import numpy as np

# Simple gradient descent for y = mx + b
X = np.array([1, 2, 3, 4, 5])
y = np.array([2, 4, 6, 8, 10])  # True relationship: y = 2x

# Initialize parameters
m = 0.0  # slope
b = 0.0  # intercept
learning_rate = 0.01
n_iterations = 1000

for i in range(n_iterations):
    # Predictions
    y_pred = m * X + b
    
    # Gradients
    dm = -2 * np.mean(X * (y - y_pred))  # ∂L/∂m
    db = -2 * np.mean(y - y_pred)        # ∂L/∂b
    
    # Update parameters
    m = m - learning_rate * dm
    b = b - learning_rate * db
    
    # Print progress every 100 iterations
    if i % 100 == 0:
        loss = np.mean((y - y_pred) ** 2)
        print(f"Iteration {i}: Loss = {loss:.4f}, m = {m:.4f}, b = {b:.4f}")

print(f"Final: m ≈ {m:.4f} (should be 2.0), b ≈ {b:.4f} (should be 0.0)")
```

### Common Issues and Solutions

**Stuck in local minimum:**
- Try different initializations
- Use momentum
- Increase learning rate temporarily

**Oscillating around minimum:**
- Decrease learning rate
- Use momentum or Adam optimizer

**Very slow convergence:**
- Increase learning rate
- Check for numerical issues
- Scale features properly

**Diverging (loss increases):**
- Decrease learning rate significantly
- Check gradient calculations
- Add gradient clipping

### Key Takeaways

- **Gradient descent** follows the slope downhill to minimize loss
- **Learning rate** controls step size - critical hyperparameter
- **Mini-batch SGD** is most practical for neural networks
- **Adam optimizer** usually works best out of the box
- **Monitor training** to detect convergence issues
- **Early stopping** prevents overfitting

Gradient descent is the engine that powers modern machine learning. Understanding it helps you debug training issues and choose better hyperparameters!