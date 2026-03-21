---
title: "MLP Practice"
type: "practice"
colab_notebook: "notebooks/part2_neural_networks/chapter7/page13_mlp_practice.ipynb"
resources:
  - title: "PyTorch: Optimizing Model Parameters"
    url: "https://pytorch.org/tutorials/beginner/basics/optimization_tutorial.html"
---

# MLP Practice

## Practice: Improve Digit Classification with an MLP

Build a multi-layer perceptron (MLP) in PyTorch and compare its accuracy to a single-layer network.

### Initial Code

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms

transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
train_data = datasets.MNIST('.', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_data, batch_size=64, shuffle=True)

# 1. Define an MLP with TWO hidden layers
#    Architecture: 784 → 128 → 64 → 10
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        # Layer 1: 784 → 128
        self.fc1 = 
        # Layer 2: 128 → 64
        self.fc2 = 
        # Layer 3: 64 → 10
        self.fc3 = 

    def forward(self, x):
        # Flatten input
        x = x.view(-1, 28 * 28)
        # Apply fc1 + ReLU
        x = 
        # Apply fc2 + ReLU
        x = 
        # Apply fc3 (no activation)
        x = 
        return x

model = MLP()

# 2. Loss function and Adam optimizer (lr=0.001)
criterion = 
optimizer = 

# 3. Train for one epoch
model.train()
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

# 4. Evaluate on one batch
model.eval()
with torch.no_grad():
    sample_images, sample_labels = next(iter(train_loader))
    sample_outputs = model(sample_images)
    _, predicted = torch.max(sample_outputs, 1)
    accuracy = (predicted == sample_labels).float().mean().item()

# Don't change the code below - it's for testing
def check_mlp():
    return accuracy, loss.item(), len(list(model.parameters()))
```

### Hidden Tests

Test 1: Accuracy > 50%
Test 2: Loss is positive
Test 3: Model has parameters (not empty)

### Hints
- Use multiple dense layers and ReLU activations
- Adam optimizer helps with convergence
- Flatten input before feeding to dense layers