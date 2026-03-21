---
title: "MSE Practice"
type: "practice"
resources:
  - title: "Scikit-Learn: mean_squared_error"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.mean_squared_error.html"
---

# MSE Practice

## Practice: Calculating Mean Squared Error

Calculate MSE for sample predictions to understand model accuracy.

### Initial Code

```python
import numpy as np

# Sample actual values and predictions
actual_prices = np.array([300000, 250000, 400000, 350000, 275000])
predicted_prices = np.array([310000, 240000, 390000, 360000, 280000])

# 1. Calculate the squared error for each prediction
#    Hint: (actual - predicted) ** 2
squared_errors = 

# 2. Calculate Mean Squared Error (MSE)
#    Hint: mean of squared_errors
mse = 

# 3. Calculate Root Mean Squared Error (RMSE)
#    Hint: square root of mse
rmse = 

# 4. Calculate Mean Absolute Error (MAE)
#    Hint: mean of absolute differences
mae = 

# Don't change the code below - it's for testing
def check_mse():
    return mse, rmse, mae
```

### Hidden Tests

Test 1: MSE is a positive number
Test 2: RMSE is positive and smaller than MSE
Test 3: MAE is positive
Test 4: MSE > MAE (due to squaring)

### Hints
- Squared errors: (actual - predicted)²
- MSE = mean of squared errors
- RMSE = square root of MSE
- MAE = mean of absolute errors