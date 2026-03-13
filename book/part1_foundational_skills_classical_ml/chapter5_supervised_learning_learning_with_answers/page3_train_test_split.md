---
title: "Scikit-Learn: Supervised Learning"
type: "read"
resources:
  - title: "Scikit-Learn: train_test_split"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.train_test_split.html"
---

# Train/Test Split

## Evaluating Machine Learning Models

To know if your model truly learned patterns (rather than memorizing), you must test it on data it hasn't seen during training.

### The Problem

If you train and test on the same data:
- Model might just memorize the training examples
- Performance looks great on training data
- Fails miserably on new data
- This is called **overfitting**

### The Solution: Train/Test Split

1. **Split your data** into two parts:
   - **Training set** (70-80%): Used to train the model
   - **Test set** (20-30%): Used to evaluate performance

2. **Train on training data only**
3. **Evaluate on test data**

### Visual Example

```
Full Dataset: [data1, data2, data3, data4, data5, data6, data7, data8]

Train/Test Split (80/20):
Training: [data1, data2, data3, data4, data5, data6]
Test:     [data7, data8]

Model trains on first 6, evaluates on last 2.
```

### Implementation

```python
from sklearn.model_selection import train_test_split

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, 
    test_size=0.2,      # 20% for testing
    random_state=42     # For reproducible results
)

# Train model
model.fit(X_train, y_train)

# Evaluate on test data
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
```

### Why Random Splitting Matters

- **Stratified sampling**: Maintain class proportions in splits
- **Time series**: Don't split randomly for temporal data
- **Cross-validation**: Multiple train/test splits for robust evaluation

### Common Split Ratios

- **Small datasets** (< 1000 samples): 80/20 or 75/25
- **Large datasets** (> 100k samples): 90/10 or 95/5
- **Very large datasets**: 98/2 or even 99/1

### Remember
- Never peek at test data during training
- Test set simulates real-world performance
- Use same preprocessing on both train and test
- Random state ensures reproducible splits

Next, explore linear regression!