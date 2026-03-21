---
title: "Choosing K: How Many Groups?"
type: "read"
resources:
  - title: "Wikipedia: Elbow Method (clustering)"
    url: "https://en.wikipedia.org/wiki/Elbow_method_(clustering)"
---

# Choosing K: How Many Groups?

## Practice: Finding the Optimal Number of Clusters

Experiment with different values of K to see how it affects clustering quality.

### Initial Code

```python
import numpy as np
from sklearn.cluster import KMeans

customers = np.array([
    [15, 39], [15, 81], [16, 6],  [16, 77], [17, 40],
    [17, 76], [18, 6],  [18, 94], [19, 3],  [19, 72],
    [25, 5],  [25, 73], [28, 82], [30, 4],  [30, 73],
    [40, 55], [40, 47], [43, 54], [46, 51], [48, 59],
    [70, 29], [70, 77], [71, 35], [71, 95], [75, 5],
    [75, 93], [77, 12], [77, 97], [78, 1],  [78, 89],
])

# Try K values from 2 to 8 and record the inertia for each
k_values = range(2, 9)
inertias = []

for k in k_values:
    # Create a KMeans model with n_clusters=k and random_state=42
    # Fit it to customers and append its .inertia_ to inertias
    

# Look at the inertias — where does the drop slow down? That's the "elbow".
# 1. Set best_k to your chosen value (a number between 2 and 8)
best_k = 

# 2. Create and fit a final KMeans model using best_k
final_kmeans = 


# Don't change the code below - it's for testing
def check_elbow():
    return len(inertias), best_k, final_kmeans.n_clusters
```

### Hidden Tests

Test 1: Tried multiple K values (inertias has 7 values)
Test 2: Chose a reasonable K (between 3-6)
Test 3: Final model has correct number of clusters

### Hints
- Inertia measures how spread out clusters are
- Look for the "elbow" where improvement slows
- Lower inertia is better, but too many clusters overfit