---
resources:
  - title: "3Blue1Brown: Neural Networks"
    url: "https://www.3blue1brown.com/topics/neural-networks"
  - title: "PyTorch Deep Learning Basics"
    url: "https://pytorch.org/tutorials/beginner/basics/intro.html"
---

# Backpropagation: Learning from Mistakes

## How Neural Networks Learn

Backpropagation is the process that tells each neuron how much it contributed to the error, so it can adjust its weights and do better next time.

### The Big Idea

1. **Forward pass**: Input flows through the network to produce a prediction
2. **Compute loss**: Compare prediction to the correct answer
3. **Backward pass**: Propagate error backwards through the network
4. **Update weights**: Use gradients to adjust weights in the right direction

### Gradients and the Chain Rule

Neural networks are composed of many functions chained together. Backpropagation uses calculus to compute gradients efficiently:
- Gradient tells how much the loss changes when a weight changes
- The chain rule combines gradients layer by layer

### Steps in Backpropagation

1. Compute loss derivative with respect to output
2. Multiply by derivative of activation functions
3. Propagate through each layer (from output to input)
4. Update weights using gradients and learning rate

### Why Backpropagation Works

- It uses gradient descent to minimize loss
- Each weight is adjusted based on its contribution to the error
- Layers closer to the output get direct feedback first

### Common Misconceptions

- Backprop isn't special magic — it's just calculus (the chain rule)
- It doesn’t "teach" the network; it provides gradient signals
- You don’t need to implement it yourself (frameworks do it for you)

### Remember
- Backprop drives learning in neural networks
- It uses gradients and the chain rule
- Error flows backward from output to input
- Weight updates depend on learning rate

Next: Build your first neural network using a framework.