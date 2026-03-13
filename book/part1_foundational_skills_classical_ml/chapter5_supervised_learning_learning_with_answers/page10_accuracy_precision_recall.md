---
resources:
  - title: "Scikit-Learn: Supervised Learning"
    url: "https://scikit-learn.org/stable/supervised_learning.html"
  - title: "StatQuest: Machine Learning Index"
    url: "https://www.youtube.com/user/joshstarmer"
---

# Accuracy, Precision, Recall

## Classification Metrics Beyond Accuracy

While accuracy seems straightforward, it can be misleading. Precision and recall provide deeper insights into classification performance, especially with imbalanced data.

### The Accuracy Trap

Accuracy = correct predictions / total predictions

**Problem:** In imbalanced datasets, high accuracy can hide poor performance.

Example: Medical diagnosis with 95% healthy patients:
- Model predicts "healthy" for everyone → 95% accuracy
- But misses all sick patients! (0% recall for disease)

### Precision: Quality of Positive Predictions

Precision = True Positives / (True Positives + False Positives)

**"When I predict positive, how often am I right?"**

```
Predicted: Spam    Not Spam
Actual:   Spam     TP        FN
          Not Spam FP        TN

Precision = TP / (TP + FP)
```

**High precision:** Few false positives (conservative classifier)
**Low precision:** Many false positives (aggressive classifier)

### Recall: Coverage of Actual Positives

Recall = True Positives / (True Positives + False Negatives)

**"How many actual positives did I catch?"**

```
Recall = TP / (TP + FN)
```

**High recall:** Few false negatives (sensitive classifier)
**Low recall:** Many false negatives (misses positives)

### F1-Score: Balancing Precision and Recall

F1 = 2 × (Precision × Recall) / (Precision + Recall)

**Harmonic mean** of precision and recall:
- Balances both metrics
- Penalizes extreme values
- Good for imbalanced datasets

### Real-World Examples

**Spam Detection:**
- **High precision:** Important (avoid blocking legitimate emails)
- **High recall:** Also important (catch most spam)

**Medical Diagnosis:**
- **High recall:** Critical (don't miss sick patients)
- **High precision:** Also important (avoid false alarms)

**Fraud Detection:**
- **High precision:** Avoid investigating innocent transactions
- **High recall:** Catch most fraudulent activity

### Confusion Matrix

```
                Predicted Positive    Predicted Negative
Actual Positive       TP (True Positive)    FN (False Negative)
Actual Negative       FP (False Positive)   TN (True Negative)
```

### Multi-Class Classification

For multiple classes, calculate metrics for each class:
- **Macro-average:** Simple average across classes
- **Weighted average:** Average weighted by class frequency
- **Micro-average:** Global TP, FP, FN counts

### Choosing Metrics

- **Balanced dataset:** Accuracy or F1-score
- **Imbalanced dataset:** Precision, recall, F1-score
- **Cost-sensitive:** Choose based on error costs
- **Multiple metrics:** Report precision, recall, and F1

### Remember
- Accuracy can be misleading with imbalanced data
- Precision: Quality of positive predictions
- Recall: Coverage of actual positives
- F1-score: Balanced metric
- Choose metrics based on your problem's priorities

Next, practice calculating these metrics!