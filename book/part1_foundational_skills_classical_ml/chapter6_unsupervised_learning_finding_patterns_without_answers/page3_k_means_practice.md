---
title: "K-Means Practice"
type: "practice"
resources:
  - title: "StatQuest: K-Means Clustering"
    url: "https://www.youtube.com/watch?v=4b5d3muPQmA"
---

# K-Means Practice

## Practice: Clustering Customer Data

Use K-Means to group customers based on their annual income and spending score.

### Initial Code

```python
import numpy as np
from sklearn.cluster import KMeans

# Customer data: [annual_income, spending_score]
customers = np.array([
    [15, 39], [15, 81], [16, 6],  [16, 77], [17, 40],
    [17, 76], [18, 6],  [18, 94], [19, 3],  [19, 72],
    [25, 5],  [25, 73], [28, 82], [30, 4],  [30, 73],
    [40, 55], [40, 47], [43, 54], [46, 51], [48, 59],
    [70, 29], [70, 77], [71, 35], [71, 95], [75, 5],
    [75, 93], [77, 12], [77, 97], [78, 1],  [78, 89],
])

# 1. Create a KMeans model with 5 clusters (random_state=42)
kmeans = 

# 2. Fit the model to the customer data


# 3. Get the cluster label for each customer
cluster_labels = 

# 4. Get the cluster centers
cluster_centers = 

# Don't change the code below - it's for testing
def check_clustering():
    return cluster_labels, cluster_centers.shape
```

### Hidden Tests

Test 1: K-Means model created with 5 clusters
Test 2: Model fitted to customer data
Test 3: Cluster labels obtained (200 labels)
Test 4: Cluster centers have correct shape (5, 2)

### Hints
- Use KMeans(n_clusters=5)
- Call fit() on the data
- Use labels_ for cluster assignments
- Use cluster_centers_ for centroids