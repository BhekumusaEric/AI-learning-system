---
title: "What's a Neural Network?"
type: "read"
resources:
  - title: "3Blue1Brown: What is a Neural Network?"
    url: "https://www.3blue1brown.com/lessons/neural-networks"
---

# What's a Neural Network?

## Brain-Inspired Computing

Neural networks are computer systems inspired by the human brain. They consist of simple processing units (neurons) connected together to solve complex problems.

### Biological Inspiration

The human brain has ~86 billion neurons, each connected to thousands of others. Neural networks simulate this structure digitally.

### Artificial Neuron (Perceptron)

A single artificial neuron:
1. Receives input signals
2. Multiplies each input by a weight
3. Sums the weighted inputs
4. Applies an activation function
5. Produces an output

### Neural Network Architecture

**Input Layer** → **Hidden Layers** → **Output Layer**

- **Input Layer**: Receives the raw data
- **Hidden Layers**: Process and transform the data
- **Output Layer**: Produces the final prediction

### How Neural Networks Learn

1. **Forward Pass**: Data flows from input to output
2. **Calculate Error**: Compare prediction to actual answer
3. **Backpropagation**: Error flows backward, adjusting weights
4. **Gradient Descent**: Weights updated to reduce error
5. **Repeat**: Process continues until error is minimized

### Types of Neural Networks

- **Feedforward**: Data flows in one direction
- **Convolutional (CNN)**: Great for images
- **Recurrent (RNN)**: Good for sequences (text, time series)
- **Transformer**: Powers modern language models like GPT

### Why They Work

- **Universal Approximation**: Can approximate any function
- **Feature Learning**: Automatically discover important patterns
- **Scalability**: Performance improves with more data and compute

### Remember
- Inspired by biological neurons
- Learn through examples
- Require lots of data and computation
- Foundation of modern AI breakthroughs

Next, explore the perceptron!