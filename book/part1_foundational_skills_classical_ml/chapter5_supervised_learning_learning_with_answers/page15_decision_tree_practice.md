---
title: "Decision Tree Practice"
type: "practice"
resources:
  - title: "StatQuest: Decision Trees"
    url: "https://www.youtube.com/watch?v=7VeUPuVNf6I"
---

# Decision Tree Practice

## Practice: Classify Animals

Build a decision tree to classify animals based on their features.

Features: `[weight_kg, height_cm, has_fur, can_fly, lays_eggs]`
Labels: `0=mammal, 1=bird, 2=reptile, 3=fish`

### Initial Code

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X = np.array([
    [5, 30, 1, 0, 0],
    [80, 170, 1, 0, 0],
    [0.1, 10, 0, 1, 1],
    [2, 25, 0, 1, 1],
    [200, 300, 0, 0, 1],
    [0.5, 15, 0, 0, 1],
    [1000, 400, 0, 0, 1],
    [1.5, 20, 0, 0, 1],
])
y = np.array([0, 0, 1, 1, 2, 2, 2, 3])

# 1. Split into train/test sets (test_size=0.3, random_state=42)
X_train, X_test, y_train, y_test = 

# 2. Create a DecisionTreeClassifier with max_depth=3 and random_state=42
clf = 

# 3. Train the classifier
 

# 4. Predict on the test set
y_pred = 

# 5. Calculate accuracy
accuracy = 

# 6. Predict the class for these two new animals:
#    [4, 25, 1, 0, 0]  → should be mammal (0)
#    [0.05, 8, 0, 1, 1] → should be bird (1)
new_animals = np.array([[4, 25, 1, 0, 0], [0.05, 8, 0, 1, 1]])
new_predictions = 

# Don't change the code below - it's for testing
def check_decision_tree():
    return accuracy, list(new_predictions)
```

### Hidden Tests

Test 1: accuracy is a float between 0 and 1
Test 2: new_predictions == [0, 1]
Test 3: clf is a fitted DecisionTreeClassifier

### Evaluation Code
```python
assert isinstance(accuracy, float), "accuracy should be a float"
assert list(new_predictions) == [0, 1], "Expected [mammal, bird] for the two new animals"
```

### Hints
- `train_test_split(X, y, test_size=0.3, random_state=42)`
- `DecisionTreeClassifier(max_depth=3, random_state=42)`
- Use `.fit()` to train, `.predict()` to get labels
- `accuracy_score(y_test, y_pred)` compares predictions to truth
