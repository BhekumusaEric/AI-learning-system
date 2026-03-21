---
title: "Perceptron Practice"
type: "practice"
resources:
  - title: "Towards Data Science: Perceptron Explained"
    url: "https://towardsdatascience.com/what-is-a-perceptron-basics-of-neural-networks-c4eaaeca16ce"
---

# Perceptron Practice

## Practice: Building a Logic Gate

Implement a perceptron that learns the AND logic gate.

### Initial Code

```python
import numpy as np

class Perceptron:
    def __init__(self, input_size, learning_rate=0.1, epochs=100):
        # Initialize weights to zeros (input_size + 1 for bias)
        self.weights = 
        self.learning_rate = learning_rate
        self.epochs = epochs

    def activation(self, x):
        # Step function: return 1 if x >= 0, else 0
        pass

    def predict(self, x):
        # 1. Add bias term (1) to the front of x using np.insert
        x_with_bias = 
        # 2. Calculate the weighted sum (dot product of weights and x_with_bias)
        weighted_sum = 
        # 3. Apply activation and return
        return self.activation(weighted_sum)

    def fit(self, X, y):
        for _ in range(self.epochs):
            for xi, target in zip(X, y):
                prediction = self.predict(xi)
                # Calculate the update: learning_rate * (target - prediction)
                update = 
                # Add bias to xi and update weights
                xi_with_bias = np.insert(xi, 0, 1)
                self.weights += 

# AND gate training data
X_and = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_and = np.array([0, 0, 0, 1])

# 1. Create a Perceptron with input_size=2
perceptron_and = 

# 2. Train it on X_and and y_and


# 3. Get predictions for all 4 inputs
predictions = 

# Don't change the code below - it's for testing
def check_perceptron():
    return predictions, perceptron_and.weights.shape
```

### Hidden Tests

Test 1: Perceptron predicts AND gate correctly [0, 0, 0, 1]
Test 2: Weights have correct shape (3,) - 2 inputs + 1 bias
Test 3: All predictions are 0 or 1

### Hints
- Use np.insert(x, 0, 1) to add bias
- Update rule: weights += learning_rate * (target - prediction) * inputs
- AND gate: only [1,1] → 1, others → 0