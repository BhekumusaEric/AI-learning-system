---
title: "Loss Calculation Practice"
type: "practice"
resources:
  - title: "PyTorch: Loss Functions"
    url: "https://pytorch.org/docs/stable/nn.html#loss-functions"
---

# Loss Calculation Practice

## Practice: Calculate MSE and Binary Cross-Entropy

Loss functions measure how wrong your model is. Let's calculate two of the most common ones by hand.

**MSE formula:** `(1/n) * Σ(actual - predicted)²`

**Binary Cross-Entropy formula:** `-(1/n) * Σ[y * log(p) + (1-y) * log(1-p)]`

### Initial Code

```python
import numpy as np

# --- Task 1: MSE for regression ---
actual_prices    = np.array([300, 450, 200, 600, 350])   # in $1000s
predicted_prices = np.array([280, 470, 220, 580, 340])

# 1. Calculate squared errors for each prediction
squared_errors = 

# 2. Calculate MSE (mean of squared errors)
mse = 

# 3. Calculate RMSE (square root of MSE)
rmse = 

# --- Task 2: Binary Cross-Entropy for classification ---
actual_labels   = np.array([1, 0, 1, 0, 1])   # 1=spam, 0=not spam
predicted_probs = np.array([0.9, 0.3, 0.8, 0.1, 0.7])

# 4. Calculate per-example BCE loss
#    For each i: -[y*log(p) + (1-y)*log(1-p)]
bce_losses = 

# 5. Calculate mean BCE
bce = 

# Don't change the code below - it's for testing
def check_losses():
    return mse, rmse, bce
```

### Hidden Tests

Test 1: mse == 400.0
Test 2: rmse == 20.0
Test 3: bce < 0.5 (good predictions → low loss)

### Evaluation Code
```python
assert abs(mse - 400.0) < 1e-6, "MSE should be 400.0"
assert abs(rmse - 20.0) < 1e-6, "RMSE should be 20.0"
assert bce < 0.5, "BCE should be low since predictions are confident and correct"
```

### Hints
- `squared_errors = (actual - predicted) ** 2`
- `mse = np.mean(squared_errors)`
- `rmse = np.sqrt(mse)`
- `bce_losses = -(actual * np.log(probs) + (1 - actual) * np.log(1 - probs))`
