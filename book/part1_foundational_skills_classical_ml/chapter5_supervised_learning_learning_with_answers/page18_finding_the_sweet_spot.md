---
title: "Finding the Sweet Spot"
type: "practice"
resources:
  - title: "Scikit-Learn: Cross-Validation"
    url: "https://scikit-learn.org/stable/modules/cross_validation.html"
---

# Finding the Sweet Spot

## Practice: Tune Model Complexity with Cross-Validation

Too simple → underfits. Too complex → overfits. Cross-validation helps you find the right balance by testing your model on multiple different splits of the data.

### Initial Code

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score
from sklearn.datasets import load_iris
import numpy as np

iris = load_iris()
X, y = iris.data, iris.target

# 1. Try max_depth values from 1 to 8 and store the mean cross-val score for each
#    Use cross_val_score(model, X, y, cv=5) and take .mean()
depths = range(1, 9)
cv_scores = []

for depth in depths:
    model = DecisionTreeClassifier(max_depth=depth, random_state=42)
    # Calculate 5-fold cross-validation score and append the mean to cv_scores
    

# 2. Find the depth with the highest cross-val score
best_depth = 

# 3. Train a final model using best_depth on all the data
final_model = 


# Don't change the code below - it's for testing
def check_sweet_spot():
    return len(cv_scores), best_depth, final_model.max_depth
```

### Hidden Tests

Test 1: cv_scores has 8 values (one per depth)
Test 2: best_depth is between 1 and 8
Test 3: final_model.max_depth == best_depth

### Evaluation Code
```python
assert len(cv_scores) == 8, "Expected one score per depth (1 through 8)"
assert 1 <= best_depth <= 8, "best_depth should be one of the tested values"
assert final_model.max_depth == best_depth, "final_model should use best_depth"
```

### Hints
- `cross_val_score(model, X, y, cv=5).mean()` gives the average score
- `np.argmax(cv_scores)` gives the index of the highest score
- `depths` starts at 1, so `best_depth = depths[np.argmax(cv_scores)]`
- Fit the final model with `final_model.fit(X, y)`
