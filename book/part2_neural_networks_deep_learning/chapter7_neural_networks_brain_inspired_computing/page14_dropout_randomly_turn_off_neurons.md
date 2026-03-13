---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "PyTorch: nn.Dropout"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html"
---

# Dropout: Randomly Turn Off Neurons

## Preventing Overfitting with Randomness

Dropout is a regularization technique that randomly turns off (drops) a percentage of neurons during training. This forces the network to rely on multiple paths and prevents it from memorizing the training data.

### How Dropout Works

During training:
- Each neuron is kept with probability `p` (e.g., 0.5)
- Dropped neurons are ignored for that batch
- This creates a different “thinned” network each step

During evaluation:
- All neurons are active
- Outputs are scaled to match training behavior

### Why Dropout Helps

- Prevents co-adaptation (neurons relying on each other)
- Encourages redundancy (multiple neurons learn similar features)
- Acts like model averaging (ensemble of sub-networks)

### Typical Dropout Rates

- Hidden layers: 0.2 – 0.5
- Input layer: 0.1 – 0.2

### Using Dropout in Code

In PyTorch:
```python
import torch.nn as nn

dropout = nn.Dropout(p=0.5)

x = dropout(x)
```

In Keras:
```python
from tensorflow.keras.layers import Dropout

dropout = Dropout(0.5)
```

### When Not to Use Dropout

- Small datasets: may underfit
- Batch normalization: sometimes less effective together
- During inference: dropout is disabled (only in training)

### Remember
- Dropout is a regularization technique
- Randomly drops neurons during training
- Improves generalization by preventing overfitting
- Always disabled during evaluation

Next: Learn about the Adam optimizer for smarter learning rates.