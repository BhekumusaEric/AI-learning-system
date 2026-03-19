---
title: "KNN Practice"
type: "read"
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
from sklearn.metrics import accuracy_score, classification_report
import numpy as np

# Load the Iris dataset
iris = load_iris()
X = iris.data  # Features: sepal length/width, petal length/width
y = iris.target  # Labels: 0=setosa, 1=versicolor, 2=virginica
feature_names = iris.feature_names
target_names = iris.target_names

# 1. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 2. Create KNN classifier with K=3
knn = KNeighborsClassifier(n_neighbors=3)

# 3. Train the model
knn.fit(X_train, y_train)

# 4. Make predictions on test set
predictions = knn.predict(X_test)

# 5. Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

# 6. Get detailed classification report
report = classification_report(y_test, predictions, target_names=target_names)

# 7. Test on a single flower
sample_flower = np.array([[5.1, 3.5, 1.4, 0.2]])  # Typical setosa measurements
sample_prediction = knn.predict(sample_flower)
sample_species = target_names[sample_prediction[0]]

# Don't change the code below - it's for testing
def check_knn():
    return accuracy > 0.8, len(predictions) == len(y_test), sample_species in target_names
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