---
title: "Building Your First Neural Network"
type: "read"
resources:
  - title: "PyTorch: Build the Neural Network"
    url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html"
---

# Building Your First Neural Network

## Create a Model That Learns

Let’s build a simple neural network using PyTorch to classify handwritten digits (MNIST). This shows the full training loop: forward pass, loss, backward pass, and update.

### Network Overview

- Input: 28×28 pixel images (flattened to 784 inputs)
- Hidden layer: 128 neurons, ReLU activation
- Output: 10 neurons (one per digit), softmax for probabilities

### Code Walkthrough

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms

# 1. Load MNIST dataset
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
train_dataset = datasets.MNIST('.', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)

# 2. Define the network
class SimpleNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(28*28, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = x.view(-1, 28*28)  # Flatten
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = SimpleNN()

# 3. Loss and optimizer
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 4. Training loop (one epoch)
model.train()
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

# Don't change the code below - it's for testing
def check_training():
    return isinstance(loss.item(), float), loss.item() > 0
```

### Tips
- `model.train()` enables dropout/batchnorm behavior
- `optimizer.zero_grad()` clears old gradients
- `loss.backward()` computes gradients
- `optimizer.step()` updates weights

Next: Learn why deeper networks (more layers) are more powerful.