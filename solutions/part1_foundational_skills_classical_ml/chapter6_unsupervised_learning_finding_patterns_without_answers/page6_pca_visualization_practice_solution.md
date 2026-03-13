# PCA Visualization Practice

## Practice: Visualizing High-Dimensional Data

Use PCA to reduce the Iris dataset from 4 dimensions to 2, then visualize the clusters.

### Initial Code

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# Load the Iris dataset (4 features: sepal length/width, petal length/width)
iris = load_iris()
X = iris.data  # Shape: (150, 4)
y = iris.target  # Species labels: 0, 1, 2
feature_names = iris.feature_names

# 1. Create PCA model to reduce to 2 dimensions
pca = PCA(n_components=2)

# 2. Fit and transform the data
X_pca = pca.fit_transform(X)

# 3. Check how much variance is explained
explained_variance = pca.explained_variance_ratio_
total_variance = explained_variance.sum()

# 4. Create a scatter plot of the reduced data
# Color points by species
plt.figure(figsize=(8, 6))
colors = ['red', 'green', 'blue']
species_names = ['Setosa', 'Versicolor', 'Virginica']

for i, (color, species) in enumerate(zip(colors, species_names)):
    mask = y == i
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], 
               c=color, label=species, alpha=0.7)

plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('Iris Dataset - PCA Reduced to 2D')
plt.legend()
plt.grid(True, alpha=0.3)

# Show the plot
plt.show()

# Don't change the code below - it's for testing
def check_pca():
    return X_pca.shape, total_variance > 0.9, len(explained_variance)
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

## Solution

Below is one possible correct implementation for the practice exercise.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# Load the Iris dataset (4 features: sepal length/width, petal length/width)
iris = load_iris()
X = iris.data  # Shape: (150, 4)
y = iris.target  # Species labels: 0, 1, 2
feature_names = iris.feature_names

# 1. Create PCA model to reduce to 2 dimensions
pca = PCA(n_components=2)

# 2. Fit and transform the data
X_pca = pca.fit_transform(X)

# 3. Check how much variance is explained
explained_variance = pca.explained_variance_ratio_
total_variance = explained_variance.sum()

# 4. Create a scatter plot of the reduced data
# Color points by species
plt.figure(figsize=(8, 6))
colors = ['red', 'green', 'blue']
species_names = ['Setosa', 'Versicolor', 'Virginica']

for i, (color, species) in enumerate(zip(colors, species_names)):
    mask = y == i
    plt.scatter(X_pca[mask, 0], X_pca[mask, 1], 
               c=color, label=species, alpha=0.7)

plt.xlabel('Principal Component 1')
plt.ylabel('Principal Component 2')
plt.title('Iris Dataset - PCA Reduced to 2D')
plt.legend()
plt.grid(True, alpha=0.3)

# Show the plot
plt.show()

# Don't change the code below - it's for testing
def check_pca():
    return X_pca.shape, total_variance > 0.9, len(explained_variance)
```
