---
title: "Logistic Regression Practice"
type: "practice"
resources:
  - title: "StatQuest: Logistic Regression"
    url: "https://www.youtube.com/watch?v=yIYKR4sgzI8"
---

# Logistic Regression Practice

## Practice: Spam Email Classification

Use logistic regression to classify emails as spam or not spam based on features.

### Initial Code

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

# Email features: [contains_free, contains_winner, contains_urgent, num_exclamation_marks]
# Labels: 1 = spam, 0 = not spam
X = np.array([
    [1, 0, 1, 3], [0, 0, 0, 0], [1, 1, 0, 2], [0, 0, 1, 1],
    [1, 0, 0, 5], [0, 0, 0, 1], [0, 1, 1, 4], [0, 0, 0, 0]
])
y = np.array([1, 0, 1, 0, 1, 0, 1, 0])

# 1. Split into train/test sets (test_size=0.25, random_state=42)
X_train, X_test, y_train, y_test = 

# 2. Create a LogisticRegression model
model = 

# 3. Train the model


# 4. Predict on the test set
predictions = 

# 5. Calculate accuracy
accuracy = 

# 6. Get probability predictions (predict_proba)
probabilities = 

# Don't change the code below - it's for testing
def check_logistic():
    return accuracy, probabilities.shape, len(predictions)
```

### Hidden Tests

Test 1: Model achieves at least 50% accuracy
Test 2: Probabilities have 2 columns (spam/not spam)
Test 3: Number of predictions matches test set size

### Hints
- Use LogisticRegression() from sklearn
- predict_proba() gives probabilities for both classes
- predict() gives class predictions (0 or 1)