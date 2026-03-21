---
title: "Building Your First Neural Network"
type: "practice"
resources:
  - title: "PyTorch: Build the Neural Network"
    url: "https://pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html"
---

# Building Your First Neural Network

## Practice: Build a Neural Network with PyTorch

Build a simple neural network to classify handwritten digits (MNIST).

- Input: 28×28 pixel images (flattened to 784)
- Hidden layer: 128 neurons, ReLU activation
- Output: 10 neurons (one per digit 0–9)

### Initial Code

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms

# Load MNIST
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
train_dataset = datasets.MNIST('.', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=64, shuffle=True)

# 1. Define the network
class SimpleNN(nn.Module):
    def __init__(self):
        super().__init__()
        # First fully connected layer: 784 inputs → 128 outputs
        self.fc1 = 
        # Second fully connected layer: 128 inputs → 10 outputs
        self.fc2 = 

    def forward(self, x):
        # Flatten: (batch, 1, 28, 28) → (batch, 784)
        x = x.view(-1, 28 * 28)
        # Apply fc1 then ReLU
        x = 
        # Apply fc2 (no activation — CrossEntropyLoss handles that)
        x = 
        return x

model = SimpleNN()

# 2. Define the loss function (CrossEntropyLoss for multi-class)
criterion = 

# 3. Define the optimizer (Adam, lr=0.001)
optimizer = 

# 4. Training loop — one epoch
model.train()
for images, labels in train_loader:
    # Zero out old gradients
    
    # Forward pass
    outputs = 
    # Calculate loss
    loss = 
    # Backward pass
    
    # Update weights
    

# Don't change the code below - it's for testing
def check_training():
    return isinstance(loss.item(), float), loss.item() > 0
```

### Hidden Tests

Test 1: loss is a float
Test 2: loss > 0

### Hints
- `nn.Linear(in_features, out_features)` defines a fully connected layer
- `F.relu(self.fc1(x))` applies ReLU after the first layer
- `nn.CrossEntropyLoss()` for the loss, `optim.Adam(model.parameters(), lr=0.001)` for the optimizer
- Training loop order: `zero_grad()` → forward → loss → `backward()` → `step()`
