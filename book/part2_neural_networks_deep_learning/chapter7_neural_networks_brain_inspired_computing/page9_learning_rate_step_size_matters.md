---
title: "Learning Rate: Step Size Matters"
type: "read"
resources:
  - title: "Machine Learning Mastery: Learning Rate"
    url: "https://machinelearningmastery.com/understand-the-dynamics-of-learning-rate-on-deep-learning-neural-networks/"
---

# Learning Rate: Step Size Matters

## How Fast Should a Network Learn?

The learning rate controls how big each update step is during training. Getting it right is crucial: too large and training becomes unstable; too small and it takes forever.

### What the Learning Rate Does

- **Too high**: The model jumps around and may never converge
- **Too low**: Training is slow and may get stuck
- **Just right**: Smoothly descends toward the minimum loss

### Visualizing the Learning Rate

Imagine descending a hill to reach the lowest point:
- Large steps can overshoot the valley
- Tiny steps take forever

### Common Strategies

- **Fixed learning rate**: Simple, but not always optimal
- **Learning rate schedules**: Reduce learning rate over time
  - Step decay (reduce by factor every N epochs)
  - Exponential decay
  - Cosine annealing
- **Adaptive optimizers**: Automatically adjust learning rate per parameter (e.g., Adam)

### Practical Tips

- Start with a small value like 0.001
- Watch the loss curve: if it bounces, lower the learning rate
- If loss decreases too slowly, try increasing it slightly
- Use learning rate finders to find a good range

### Remember
- Learning rate is one of the most important hyperparameters
- It controls the "step size" of gradient descent
- Too big → divergence, too small → slow progress
- Combine with optimizers for best results

Next: Learn how gradients make neural networks learn (backpropagation).