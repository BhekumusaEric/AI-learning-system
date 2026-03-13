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

# Load data
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
train_data = datasets.MNIST('.', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_data, batch_size=64, shuffle=True)

# Define an MLP with one hidden layer
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(28*28, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)

    def forward(self, x):
        x = x.view(-1, 28*28)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

model = MLP()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train for 1 epoch
model.train()
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

# Quick evaluation on a small subset
model.eval()
with torch.no_grad():
    sample_images, sample_labels = next(iter(train_loader))
    sample_outputs = model(sample_images)
    _, predicted = torch.max(sample_outputs, 1)
    accuracy = (predicted == sample_labels).float().mean().item()

# Don't change the code below - it's for testing
def check_mlp():
    return accuracy > 0.5, loss.item() > 0, len(list(model.parameters())) > 0
```

### Hidden Tests

Test 1: Accuracy > 50%
Test 2: Loss is positive
Test 3: Model has parameters (not empty)

### Hints
- Use multiple dense layers and ReLU activations
- Adam optimizer helps with convergence
- Flatten input before feeding to dense layers

## Solution

Below is one possible correct implementation for the practice exercise.

```python
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torchvision import datasets, transforms

# Load data
transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5,), (0.5,))])
train_data = datasets.MNIST('.', train=True, download=True, transform=transform)
train_loader = torch.utils.data.DataLoader(train_data, batch_size=64, shuffle=True)

# Define an MLP with one hidden layer
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(28*28, 128)
        self.fc2 = nn.Linear(128, 64)
        self.fc3 = nn.Linear(64, 10)

    def forward(self, x):
        x = x.view(-1, 28*28)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x

model = MLP()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# Train for 1 epoch
model.train()
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

# Quick evaluation on a small subset
model.eval()
with torch.no_grad():
    sample_images, sample_labels = next(iter(train_loader))
    sample_outputs = model(sample_images)
    _, predicted = torch.max(sample_outputs, 1)
    accuracy = (predicted == sample_labels).float().mean().item()

# Don't change the code below - it's for testing
def check_mlp():
    return accuracy > 0.5, loss.item() > 0, len(list(model.parameters())) > 0
```
