---
title: "Learning Rate: Step Size Matters"
type: "practice"
resources:
  - title: "Machine Learning Mastery: Learning Rate"
    url: "https://machinelearningmastery.com/understand-the-dynamics-of-learning-rate-on-deep-learning-neural-networks/"
---

# Learning Rate: Step Size Matters

## Practice: See How Learning Rate Affects Training

The learning rate controls how big each update step is. Too large and the model overshoots; too small and it barely moves. Let's see this in action with a simple gradient descent simulation.

### Initial Code

```python
import numpy as np

def loss_function(w):
    # Simple parabola: minimum at w=3
    return (w - 3) ** 2

def gradient(w):
    # Derivative of (w-3)^2 = 2*(w-3)
    return 2 * (w - 3)

def gradient_descent(learning_rate, start_w=0.0, steps=20):
    """Run gradient descent and return the loss history."""
    w = start_w
    loss_history = []
    for _ in range(steps):
        loss_history.append(loss_function(w))
        # Update w: move in the opposite direction of the gradient
        w = w - learning_rate * gradient(w)
    return loss_history, w

# 1. Run gradient descent with a small learning rate (0.01)
loss_small, final_w_small = gradient_descent(learning_rate=0.01)

# 2. Run gradient descent with a good learning rate (0.1)
loss_good, final_w_good = gradient_descent(learning_rate=0.1)

# 3. Run gradient descent with a large learning rate (1.5)
loss_large, final_w_large = gradient_descent(learning_rate=1.5)

# 4. Which final_w is closest to 3.0 (the true minimum)?
#    Store the learning rate value that worked best
best_lr = 

# Don't change the code below - it's for testing
def check_learning_rate():
    return final_w_small, final_w_good, final_w_large, best_lr
```

### Hidden Tests

Test 1: final_w_good is closer to 3.0 than final_w_small
Test 2: final_w_large is far from 3.0 (diverged or oscillating)
Test 3: best_lr == 0.1

### Evaluation Code
```python
assert abs(final_w_good - 3.0) < abs(final_w_small - 3.0), "lr=0.1 should converge faster than lr=0.01"
assert best_lr == 0.1, "The best learning rate among the three is 0.1"
```

### Hints
- The update rule is: `w = w - learning_rate * gradient(w)`
- A good lr converges to the minimum (w ≈ 3)
- A large lr causes the loss to bounce or grow
- Compare `abs(final_w - 3.0)` to see which is closest