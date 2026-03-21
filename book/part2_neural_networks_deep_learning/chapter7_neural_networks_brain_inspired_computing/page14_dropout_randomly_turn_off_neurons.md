---
title: "Dropout: Randomly Turn Off Neurons"
type: "practice"
resources:
  - title: "PyTorch: nn.Dropout"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Dropout.html"
---

# Dropout: Randomly Turn Off Neurons

## Practice: Add Dropout to Prevent Overfitting

Dropout randomly turns off neurons during training, forcing the network to learn more robust features. Add it between layers using `nn.Dropout(p=0.5)` where `p` is the probability of dropping a neuron.

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

# 1. Define an MLP with Dropout added between layers
class MLPWithDropout(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        # Add a Dropout layer with p=0.5
        self.dropout1 = 
        self.fc2 = nn.Linear(256, 128)
        # Add another Dropout layer with p=0.3
        self.dropout2 = 
        self.fc3 = nn.Linear(128, 10)

    def forward(self, x):
        x = x.view(-1, 784)
        # Apply fc1 → ReLU → dropout1
        x = 
        x = 
        # Apply fc2 → ReLU → dropout2
        x = 
        x = 
        # Apply fc3 (no dropout on output layer)
        x = self.fc3(x)
        return x

model = MLPWithDropout()
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 2. Train for one epoch
model.train()
for images, labels in train_loader:
    optimizer.zero_grad()
    outputs = model(images)
    loss = criterion(outputs, labels)
    loss.backward()
    optimizer.step()

# 3. Switch to eval mode (disables dropout) and evaluate
model.eval()
with torch.no_grad():
    imgs, lbls = next(iter(train_loader))
    preds = model(imgs)
    _, predicted = torch.max(preds, 1)
    accuracy = (predicted == lbls).float().mean().item()

# Don't change the code below - it's for testing
def check_dropout():
    return accuracy, loss.item(), model.dropout1.p, model.dropout2.p
```

### Hidden Tests

Test 1: dropout1.p == 0.5
Test 2: dropout2.p == 0.3
Test 3: loss > 0

### Evaluation Code
```python
assert model.dropout1.p == 0.5, "dropout1 should have p=0.5"
assert model.dropout2.p == 0.3, "dropout2 should have p=0.3"
assert loss.item() > 0, "loss should be positive"
```

### Hints
- `nn.Dropout(p=0.5)` creates a dropout layer that drops 50% of neurons
- Apply it after ReLU: `x = self.dropout1(F.relu(self.fc1(x)))`
- Always call `model.eval()` before evaluating — this disables dropout
- Never apply dropout to the output layer
