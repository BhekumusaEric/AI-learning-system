---
title: "Train/Test Split"
type: "practice"
resources:
  - title: "Scikit-Learn: train_test_split"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html"
---

# Train/Test Split

## Practice: Split Data for Honest Evaluation

If you train and test on the same data, your model just memorizes — it won't work on new data. The fix is to split your data: train on one part, test on the other.

### Initial Code

```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
import numpy as np

# House sizes (sq ft) and prices ($1000s)
X = np.array([1000, 1200, 1500, 1800, 2000, 2200, 2500, 3000]).reshape(-1, 1)
y = np.array([200, 220, 260, 290, 310, 330, 370, 420])

# 1. Split into train/test sets
#    Use test_size=0.25 and random_state=42
X_train, X_test, y_train, y_test = 

# 2. Create and train a LinearRegression model on the training set
model = 


# 3. Predict on the test set
y_pred = 

# 4. Calculate MSE on the test set
mse = 

# 5. How many samples are in the training set?
train_size = 

# Don't change the code below - it's for testing
def check_split():
    return train_size, len(y_pred), mse
```

### Hidden Tests

Test 1: train_size == 6 (75% of 8)
Test 2: len(y_pred) == 2 (25% of 8)
Test 3: mse is a positive float

### Evaluation Code
```python
assert train_size == 6, "Expected 6 training samples (75% of 8)"
assert len(y_pred) == 2, "Expected 2 test predictions (25% of 8)"
assert isinstance(mse, float) and mse > 0, "MSE should be a positive float"
```

### Hints
- `train_test_split(X, y, test_size=0.25, random_state=42)`
- Train with `model.fit(X_train, y_train)`
- Predict with `model.predict(X_test)`
- `mean_squared_error(y_test, y_pred)` for MSE
