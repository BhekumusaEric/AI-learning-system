---
title: "PCA Visualization Practice"
type: "practice"
resources:
  - title: "StatQuest: PCA Main Ideas"
    url: "https://www.youtube.com/watch?v=FgakZw6K1QQ"
---

# PCA Visualization Practice

## Practice: Visualizing High-Dimensional Data

Use PCA to reduce the Iris dataset from 4 dimensions to 2, then visualize the clusters.

### Initial Code

```python
import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

iris = load_iris()
X = iris.data   # shape: (150, 4)
y = iris.target

# 1. Create a PCA model that reduces to 2 components
pca = 

# 2. Fit and transform X in one step (fit_transform)
X_pca = 

# 3. Store the explained variance ratio for each component
explained_variance = 

# 4. Store the total variance explained (sum of both components)
total_variance = 

# Don't change the code below - it's for testing
def check_pca():
    return X_pca.shape, total_variance, len(explained_variance)
```

### Hidden Tests

Test 1: PCA reduced to 2 dimensions (shape 150, 2)
Test 2: High variance explained (>90%)
Test 3: Explained variance array has 2 values

### Hints
- Use PCA(n_components=2)
- fit_transform() does both fitting and transforming
- explained_variance_ratio_ shows variance per component
- Scatter plot with different colors for species