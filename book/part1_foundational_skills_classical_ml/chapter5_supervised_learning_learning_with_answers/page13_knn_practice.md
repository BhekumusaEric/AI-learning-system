---
title: "KNN Practice"
type: "practice"
resources:
  - title: "StatQuest: K-Nearest Neighbors"
    url: "https://www.youtube.com/watch?v=HVXime0nQeI"
---

# KNN Practice

## Practice: Classifying Iris Flowers

Use K-Nearest Neighbors to classify iris flowers based on their measurements.

### Initial Code

```python
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
import numpy as np

# Load the Iris dataset
iris = load_iris()
X = iris.data
y = iris.target
target_names = iris.target_names

# 1. Split into train/test sets (test_size=0.3, random_state=42)
X_train, X_test, y_train, y_test = 

# 2. Create a KNeighborsClassifier with K=3
knn = 

# 3. Train the model


# 4. Predict on the test set
predictions = 

# 5. Calculate accuracy
accuracy = 

# 6. Predict the species for this single flower measurement
sample_flower = np.array([[5.1, 3.5, 1.4, 0.2]])
sample_prediction = 
sample_species = target_names[sample_prediction[0]]

# Don't change the code below - it's for testing
def check_knn():
    return accuracy, len(predictions), sample_species
```

### Hidden Tests

Test 1: KNN achieves good accuracy (>80%)
Test 2: Predictions match test set size
Test 3: Sample prediction is valid species

### Hints
- KNeighborsClassifier(n_neighbors=3) for K=3
- fit() on training data, predict() on test data
- classification_report gives precision/recall per class
- Single predictions need 2D array: [[features]]