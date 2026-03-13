---
title: "Scikit-Learn: Supervised Learning"
type: "read"
resources:
  - title: "Scikit-Learn: Logistic Regression"
    url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression"
---

# Logistic Regression: Yes/No Predictions

## Predicting Probabilities and Categories

Logistic regression predicts probabilities for binary outcomes, making it perfect for yes/no decisions like spam detection or pass/fail classification.

### The Problem with Linear Regression for Classification

Linear regression predicts continuous values, but classification needs categories:
- Email: Spam or Not Spam
- Medical test: Positive or Negative
- Loan: Approve or Deny

Linear regression can predict values outside 0-1 range, which doesn't make sense for probabilities.

### Logistic Regression Solution

Logistic regression applies a sigmoid function to linear regression output:

```
Linear: ŷ = w₁x₁ + w₂x₂ + ... + b
Logistic: ŷ = sigmoid(w₁x₁ + w₂x₂ + ... + b)
```

Where sigmoid(x) = 1 / (1 + e^(-x))

### Output Interpretation

- **Probability**: ŷ between 0 and 1
- **Classification**: If ŷ ≥ 0.5 → Class 1 (positive), else Class 0 (negative)
- **Decision boundary**: Linear equation where ŷ = 0.5

### Training Process

Uses **log loss** (cross-entropy) instead of MSE:
```
Loss = -[y × log(ŷ) + (1-y) × log(1-ŷ)]

- Penalizes confident wrong predictions heavily
- Rewards confident correct predictions
```

### Multi-Class Extension

**Softmax regression** for multiple classes:
- Output probabilities for each class
- Sum of probabilities = 1
- Choose class with highest probability

### Advantages

- **Interpretable**: Coefficients show feature importance
- **Probabilistic**: Outputs confidence levels
- **Fast to train**: Works well on large datasets
- **Foundation**: Basis for neural networks

### When to Use

- Binary classification problems
- Need probability estimates
- Want interpretable model
- Large datasets with linear decision boundaries

### Remember
- Uses sigmoid to constrain output to 0-1
- Trained with log loss, not MSE
- Coefficients indicate feature importance
- Great baseline for classification tasks

Next, practice logistic regression!