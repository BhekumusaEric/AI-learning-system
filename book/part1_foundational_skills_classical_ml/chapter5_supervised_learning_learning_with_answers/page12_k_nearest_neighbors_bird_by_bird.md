---
resources:
  - title: "Scikit-Learn: Supervised Learning"
    url: "https://scikit-learn.org/stable/supervised_learning.html"
  - title: "StatQuest: Machine Learning Index"
    url: "https://www.youtube.com/user/joshstarmer"
---

# K-Nearest Neighbors: Bird by Bird

## Learning by Finding Similar Examples

K-Nearest Neighbors (KNN) is a simple but effective algorithm that classifies new examples by finding the most similar training examples and copying their labels.

### The Intuition

Imagine classifying animals:
- New animal: "Has fur, 4 legs, barks"
- Look at similar animals in training data
- Most similar: dogs
- Conclusion: It's probably a dog too!

### How KNN Works

1. **Choose K**: Number of neighbors to consider (e.g., K=3)
2. **Calculate distances**: Measure similarity to all training examples
3. **Find K nearest**: Select the K most similar examples
4. **Vote**: For classification - majority vote of neighbors
   **Average**: For regression - average of neighbor values

### Distance Metrics

**Euclidean Distance** (straight-line distance):
```
distance = √((x₁ - x₂)² + (y₁ - y₂)² + ...)
```

**Manhattan Distance** (city block distance):
```
distance = |x₁ - x₂| + |y₁ - y₂| + ...
```

**Cosine Similarity** (angle between vectors):
```
similarity = (A • B) / (|A| × |B|)
```

### Choosing K

- **Small K**: Sensitive to noise, can overfit
- **Large K**: Smoother decisions, but may miss local patterns
- **Odd K**: Avoids ties in binary classification
- **Cross-validation**: Try different K values

### Visual Example

```
Training data: ● = Class A, ○ = Class B
New point: ✱

K=1: Nearest neighbor is ● → Predict A
K=3: 2×●, 1×○ → Predict A (majority)
K=5: 3×●, 2×○ → Predict A
```

### Advantages

- **Simple**: No training phase, just stores data
- **Flexible**: Works for any distance metric
- **Non-parametric**: No assumptions about data distribution
- **Interpretable**: Decisions based on similar examples

### Disadvantages

- **Slow prediction**: Must search all training data
- **Memory intensive**: Stores entire training set
- **Curse of dimensionality**: Performance degrades in high dimensions
- **Sensitive to irrelevant features**: All features contribute equally

### Applications

- **Recommendation systems**: "People like you also liked..."
- **Image classification**: Compare to similar images
- **Anomaly detection**: Flag points far from all neighbors
- **Medical diagnosis**: Compare patient symptoms

### Remember
- Lazy learner: No training, all work at prediction time
- Distance-based: Similar inputs give similar outputs
- Choose K carefully: Too small = noisy, too large = smooth
- Preprocess features: Scale features to similar ranges

Next, practice KNN classification!