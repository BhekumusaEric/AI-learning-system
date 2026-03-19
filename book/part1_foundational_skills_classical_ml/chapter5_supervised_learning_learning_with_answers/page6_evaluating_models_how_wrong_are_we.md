---
title: "Evaluating Models: How Wrong Are We?"
type: "read"
resources:
  - title: "Scikit-Learn: Model Evaluation"
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html"
---

# Evaluating Models: How Wrong Are We?

## Measuring Prediction Accuracy

Once you have predictions, you need ways to quantify how good or bad they are. Different metrics serve different purposes.

### Regression Metrics

For predicting continuous values (prices, temperatures):

**Mean Squared Error (MSE):**
```
MSE = (1/n) × Σ(actual - predicted)²

- Squares errors (makes large errors worse)
- Always positive
- Units are squared (dollars² for price predictions)
- Lower is better
```

**Root Mean Squared Error (RMSE):**
```
RMSE = √MSE

- Same units as original data
- Easier to interpret
- Still penalizes large errors
```

**Mean Absolute Error (MAE):**
```
MAE = (1/n) × Σ|actual - predicted|

- Absolute values (no squaring)
- Less sensitive to outliers
- Same units as data
```

### Classification Metrics

For predicting categories (spam/not spam):

**Accuracy:**
```
Accuracy = correct_predictions / total_predictions

- Simple percentage correct
- Can be misleading with imbalanced classes
```

**Precision:**
```
Precision = true_positives / (true_positives + false_positives)

- "When I predict positive, how often am I right?"
- Important when false positives are costly
```

**Recall (Sensitivity):**
```
Recall = true_positives / (true_positives + false_negatives)

- "How many actual positives did I catch?"
- Important when false negatives are costly
```

### Confusion Matrix

```
Predicted:   No     Yes
Actual: No   TN     FP
        Yes  FN     TP

- TN: True Negative
- FP: False Positive
- FN: False Negative
- TP: True Positive
```

### Choosing Metrics

- **Business context matters**: What errors cost more?
- **Dataset balance**: Accuracy fails with imbalanced data
- **Multiple metrics**: Use precision, recall, F1-score together

### Cross-Validation

Instead of single train/test split:
- Split data into K folds
- Train on K-1 folds, test on 1 fold
- Repeat K times
- Average performance across all folds

### Remember
- MSE/RMSE for regression, accuracy/precision/recall for classification
- Choose metrics based on your problem
- Cross-validation gives more reliable estimates
- Always evaluate on unseen test data

Next, practice calculating MSE!