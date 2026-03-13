---
resources:
  - title: "Scikit-Learn: Supervised Learning"
    url: "https://scikit-learn.org/stable/supervised_learning.html"
  - title: "StatQuest: Machine Learning Index"
    url: "https://www.youtube.com/user/joshstarmer"
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

# 1. Calculate squared errors for each prediction
squared_errors = (actual_prices - predicted_prices) ** 2

# 2. Calculate Mean Squared Error (MSE)
mse = np.mean(squared_errors)

# 3. Calculate Root Mean Squared Error (RMSE)
rmse = np.sqrt(mse)

# 4. Calculate Mean Absolute Error (MAE) for comparison
mae = np.mean(np.abs(actual_prices - predicted_prices))

# 5. Which error metric is larger: MSE or MAE?
# (Since MSE squares errors, it should be larger)

# Don't change the code below - it's for testing
def check_mse():
    return mse > 0, rmse > 0, mae > 0, mse > mae
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