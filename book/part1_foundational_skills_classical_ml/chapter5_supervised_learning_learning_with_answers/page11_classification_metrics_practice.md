---
resources:
  - title: "Scikit-Learn: Supervised Learning"
    url: "https://scikit-learn.org/stable/supervised_learning.html"
  - title: "StatQuest: Machine Learning Index"
    url: "https://www.youtube.com/user/joshstarmer"
---

# Classification Metrics Practice

## Hands-On Practice with Accuracy, Precision, and Recall

Now that you understand the different ways to measure classification performance, let's practice calculating these metrics yourself.

### Task: Evaluate a Spam Email Classifier

You have a spam email classifier that you tested on 100 emails. Here are the results:

- **True Positives (TP):** 45 emails correctly identified as spam
- **False Positives (FP):** 10 emails incorrectly flagged as spam (they were legitimate)
- **True Negatives (TN):** 35 emails correctly identified as legitimate
- **False Negatives (FN):** 10 emails missed as spam (they were spam but not caught)

### Your Mission

Calculate the three key metrics for this classifier:

1. **Accuracy:** What percentage of all predictions were correct?
2. **Precision:** When the classifier said "spam," what percentage was actually spam?
3. **Recall:** Of all the actual spam emails, what percentage did we catch?

### The Formulas (Quick Reference)

```
Accuracy = (TP + TN) / (TP + TN + FP + FN)
Precision = TP / (TP + FP)
Recall = TP / (TP + FN)
```

### Code Template

```python
# Spam classifier evaluation
# Given results from testing on 100 emails

true_positives = 45    # Correctly identified spam
false_positives = 10   # Incorrectly flagged as spam
true_negatives = 35    # Correctly identified legitimate
false_negatives = 10   # Missed spam emails

# Calculate total predictions and actual positives
total_predictions = true_positives + false_positives + true_negatives + false_negatives
total_actual_spam = true_positives + false_negatives
total_actual_legitimate = true_negatives + false_positives

# Calculate accuracy
accuracy = (true_positives + true_negatives) / total_predictions

# Calculate precision
precision = true_positives / (true_positives + false_positives)

# Calculate recall
recall = true_positives / (true_positives + false_negatives)

# Print results as percentages (multiply by 100)
print(f"Accuracy: {accuracy * 100:.1f}%")
print(f"Precision: {precision * 100:.1f}%")
print(f"Recall: {recall * 100:.1f}%")

# Don't change the code below - it's for testing

def check_metrics():
    return (
        abs(accuracy - 0.8) < 1e-6 and
        abs(precision - 0.8181818181818182) < 1e-6 and
        abs(recall - 0.8181818181818182) < 1e-6
    )
```

### Expected Results

When you run this code, you should get:
- Accuracy: 80.0%
- Precision: 81.8%
- Recall: 81.8%

### Understanding Your Results

**Accuracy (80%)**: The classifier got 4 out of 5 emails right overall.

**Precision (81.8%)**: When it flagged an email as spam, it was right about 82% of the time.

**Recall (81.8%)**: It caught 82% of all the actual spam emails.

### Bonus Challenge: What If?

Try changing the numbers and see how the metrics change:

1. **More false positives:** What if FP = 20 instead of 10?
2. **More false negatives:** What if FN = 20 instead of 10?
3. **Perfect classifier:** What if FP = 0 and FN = 0?

How do these changes affect accuracy, precision, and recall differently?

### Key Takeaways

- **Accuracy** tells you overall correctness
- **Precision** tells you reliability when you predict positive
- **Recall** tells you coverage of actual positives
- Different problems prioritize different metrics
- There's often a tradeoff between precision and recall

### Real-World Applications

- **Medical diagnosis:** High recall (catch all diseases) more important than precision
- **Spam filtering:** High precision (don't block good emails) more important than recall
- **Fraud detection:** Balance both - miss some fraud but don't annoy legitimate customers

Great job! You now know how to evaluate classification models properly.