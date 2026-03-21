---
title: "Linear Regression Practice"
type: "practice"
resources:
  - title: "StatQuest: Linear Regression"
    url: "https://www.youtube.com/watch?v=nk2CQITm_eo"
---

# Linear Regression Practice

## Practice: Predicting House Prices

Use linear regression to predict house prices based on size.

### Initial Code

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data: house sizes (sq ft) and prices ($1000s)
sizes = np.array([1000, 1500, 2000, 2500, 3000]).reshape(-1, 1)
prices = np.array([200, 250, 300, 350, 400])

# 1. Create a LinearRegression model
model = 

# 2. Train the model on sizes and prices
# Hint: use model.fit(X, y)


# 3. Predict the price for a 1800 sq ft house
new_size = np.array([[1800]])
predicted_price = 

# 4. Get the slope (coefficient) from the trained model
slope = 

# Don't change the code below - it's for testing
def check_model():
    return predicted_price[0], slope
```

### Hidden Tests

Test 1: Model trained on correct data
Test 2: Prediction for 1800 sq ft is reasonable (~280)
Test 3: Slope coefficient is positive
Test 4: Uses LinearRegression correctly

### Hints
- Reshape sizes to 2D array with .reshape(-1, 1)
- Use model.fit(X, y) to train
- Use model.predict() for new data
- model.coef_ gives the slope