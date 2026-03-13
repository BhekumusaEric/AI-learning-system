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

# 1. Create and train the model
model = LinearRegression()
model.fit(sizes, prices)

# 2. Predict price for a 1800 sq ft house
new_size = np.array([[1800]])
predicted_price = model.predict(new_size)

# 3. Get the slope (coefficient)
slope = model.coef_[0]

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

## Solution

Below is one possible correct implementation for the practice exercise.

```python
from sklearn.linear_model import LinearRegression
import numpy as np

# Training data: house sizes (sq ft) and prices ($1000s)
sizes = np.array([1000, 1500, 2000, 2500, 3000]).reshape(-1, 1)
prices = np.array([200, 250, 300, 350, 400])

# 1. Create and train the model
model = LinearRegression()
model.fit(sizes, prices)

# 2. Predict price for a 1800 sq ft house
new_size = np.array([[1800]])
predicted_price = model.predict(new_size)

# 3. Get the slope (coefficient)
slope = model.coef_[0]

# Don't change the code below - it's for testing
def check_model():
    return predicted_price[0], slope
```
