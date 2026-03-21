---
title: "Adam Optimizer: Smart Gradient Descent"
type: "practice"
resources:
  - title: "PyTorch: optim.Adam"
    url: "https://pytorch.org/docs/stable/generated/torch.optim.Adam.html"
---

# Adam Optimizer: Smart Gradient Descent

## Practice: Compare SGD vs Adam

Adam adapts the learning rate for each parameter automatically. Let's train the same network with both SGD and Adam and compare how fast they converge.

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

def make_model():
    return nn.Sequential(
        nn.Flatten(),
        nn.Linear(784, 128),
        nn.ReLU(),
        nn.Linear(128, 10)
    )

def train_one_epoch(model, optimizer):
    criterion = nn.CrossEntropyLoss()
    model.train()
    total_loss = 0
    for images, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(train_loader)

# 1. Train with SGD (lr=0.01)
model_sgd = make_model()
# Create an SGD optimizer for model_sgd with lr=0.01
optimizer_sgd = 
loss_sgd = train_one_epoch(model_sgd, optimizer_sgd)

# 2. Train with Adam (lr=0.001)
model_adam = make_model()
# Create an Adam optimizer for model_adam with lr=0.001
optimizer_adam = 
loss_adam = train_one_epoch(model_adam, optimizer_adam)

# 3. Which optimizer achieved lower loss after one epoch?
#    Set best_optimizer to either 'sgd' or 'adam'
best_optimizer = 

# Don't change the code below - it's for testing
def check_optimizers():
    return loss_sgd, loss_adam, best_optimizer
```

### Hidden Tests

Test 1: loss_sgd is a positive float
Test 2: loss_adam is a positive float
Test 3: best_optimizer is 'adam' (Adam typically converges faster)

### Evaluation Code
```python
assert isinstance(loss_sgd, float) and loss_sgd > 0, "loss_sgd should be a positive float"
assert isinstance(loss_adam, float) and loss_adam > 0, "loss_adam should be a positive float"
assert best_optimizer == 'adam', "Adam typically achieves lower loss in one epoch"
```

### Hints
- `optim.SGD(model.parameters(), lr=0.01)`
- `optim.Adam(model.parameters(), lr=0.001)`
- Compare `loss_sgd` and `loss_adam` to decide `best_optimizer`
- Adam usually converges faster because it adapts the learning rate per parameter
