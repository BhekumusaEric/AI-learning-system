---
title: "Classification Metrics Practice"
type: "practice"
resources:
  - title: "Scikit-Learn: Classification Report"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.metrics.classification_report.html"
---

# Classification Metrics Practice

## Practice: Calculate Accuracy, Precision, and Recall

A spam classifier was tested on 100 emails. Here are the results:

- **True Positives (TP):** 45 — correctly flagged as spam
- **False Positives (FP):** 10 — legitimate emails wrongly flagged
- **True Negatives (TN):** 35 — correctly identified as legitimate
- **False Negatives (FN):** 10 — spam emails that slipped through

Use the formulas below to calculate the three metrics:

```
Accuracy  = (TP + TN) / (TP + TN + FP + FN)
Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
```

### Initial Code

```python
# Confusion matrix values
true_positives  = 45
false_positives = 10
true_negatives  = 35
false_negatives = 10

# 1. Calculate accuracy
accuracy = 

# 2. Calculate precision
precision = 

# 3. Calculate recall
recall = 

# Don't change the code below - it's for testing
def check_metrics():
    return accuracy, precision, recall
```

### Hidden Tests

Test 1: accuracy == 0.8
Test 2: precision ≈ 0.818
Test 3: recall ≈ 0.818

### Evaluation Code
```python
assert abs(accuracy - 0.8) < 1e-6, "Accuracy should be 0.8 (80%)"
assert abs(precision - (45/55)) < 1e-6, "Precision should be 45/55 ≈ 0.818"
assert abs(recall - (45/55)) < 1e-6, "Recall should be 45/55 ≈ 0.818"
```

### Hints
- Accuracy: correct predictions out of all predictions
- Precision: how reliable is a positive prediction?
- Recall: how many actual positives did we catch?
