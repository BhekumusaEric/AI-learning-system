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
depths = range(1, 9)
cv_scores = []

for depth in depths:
    model = DecisionTreeClassifier(max_depth=depth, random_state=42)
    score = cross_val_score(model, X, y, cv=5).mean()
    cv_scores.append(score)

# 2. Find the depth with the highest cross-val score
best_depth = depths[np.argmax(cv_scores)]

# 3. Train a final model using best_depth on all the data
final_model = DecisionTreeClassifier(max_depth=best_depth, random_state=42).fit(X, y)

# --- 🖼️ VISUALIZE (Complexity vs Accuracy) ---
import matplotlib.pyplot as plt
plt.plot(depths, cv_scores, marker='o', color='purple')
plt.axvline(x=best_depth, color='red', linestyle='--', label='Sweet Spot')
plt.title('Finding the Best Model Complexity')
plt.xlabel('Tree Depth (Complexity)')
plt.ylabel('Mean CV Accuracy')
plt.legend()
plt.show()

# Don't change below
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
