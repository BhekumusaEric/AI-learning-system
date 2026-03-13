---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "Wikipedia: Perceptron"
    url: "https://en.wikipedia.org/wiki/Perceptron"
---

# The Perceptron: One Artificial Neuron

## The Building Block of Neural Networks

The perceptron is the simplest artificial neuron, inspired by biological neurons in the brain. It's the foundation of all neural networks.

### Biological Inspiration

Real neurons:
1. Receive signals from other neurons
2. Sum the signals
3. "Fire" (send signal) if sum exceeds threshold

### Artificial Perceptron

```
Inputs: x₁, x₂, x₃
Weights: w₁, w₂, w₃
Bias: b

Output: y = activation( w₁x₁ + w₂x₂ + w₃x₃ + b )
```

### The Perceptron Algorithm

1. **Initialize weights** randomly
2. **For each training example**:
   - Calculate output: ŷ = step_function(∑wᵢxᵢ + b)
   - Update weights: wᵢ = wᵢ + η(y - ŷ)xᵢ
   - Update bias: b = b + η(y - ŷ)
3. **Repeat** until convergence

### Activation Functions

**Step Function:**
```
f(x) = 1 if x ≥ 0
      0 if x < 0
```

**Sigmoid:**
```
f(x) = 1 / (1 + e^(-x))
```

**ReLU (Rectified Linear Unit):**
```
f(x) = max(0, x)
```

### Learning Rule

The perceptron learning rule:
- If prediction is correct: no change
- If prediction is too low: increase weights for active inputs
- If prediction is too high: decrease weights for active inputs

### Limitations

- Only works for linearly separable data
- Can't learn XOR function
- Single layer perceptrons are limited

### Multi-Layer Perceptrons

Stack multiple perceptrons:
- **Input layer**: Receives raw data
- **Hidden layers**: Process information
- **Output layer**: Makes final prediction

This overcomes the limitations of single perceptrons!

### Remember
- Simplest artificial neuron
- Learns by adjusting weights
- Foundation of deep learning
- Limited to linear problems (unless stacked)

Next, implement your own perceptron!