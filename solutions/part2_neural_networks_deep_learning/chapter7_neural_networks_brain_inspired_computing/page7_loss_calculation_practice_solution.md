# Loss Calculation Practice

## Measuring How Wrong Your Model Is

Now that you understand different loss functions, let's practice calculating them yourself.

### Task 1: Mean Squared Error (MSE) for Regression

You have a model that predicts house prices. Here are the actual prices and your model's predictions:

| House | Actual Price | Predicted Price |
|-------|--------------|-----------------|
| 1     | $300,000     | $280,000        |
| 2     | $450,000     | $470,000        |
| 3     | $200,000     | $220,000        |
| 4     | $600,000     | $580,000        |
| 5     | $350,000     | $340,000        |

Calculate the Mean Squared Error for these predictions.

### MSE Formula Reminder
```
MSE = (1/n) * Σ(actual - predicted)²
```

### Code Template

```python
import numpy as np

# House price predictions (in thousands for easier calculation)
actual_prices = np.array([300, 450, 200, 600, 350])  # in $1000s
predicted_prices = np.array([280, 470, 220, 580, 340])  # in $1000s

# Calculate squared errors
squared_errors = (actual_prices - predicted_prices) ** 2

# Calculate MSE
mse = np.mean(squared_errors)

print(f"Squared errors: {squared_errors}")
print(f"Mean Squared Error: ${mse * 1000:,.0f}")  # Convert back to dollars

# Calculate Root Mean Squared Error (RMSE)
rmse = np.sqrt(mse)
print(f"Root Mean Squared Error: ${rmse * 1000:,.0f}")
```

### Expected Results
- MSE: $4,000,000 (or $4M in actual dollars)
- RMSE: $2,000 (or $2K in actual dollars)

### Task 2: Binary Cross-Entropy for Classification

Your spam classifier gives these probabilities for 5 emails:

| Email | Actual Class | Predicted Probability |
|-------|--------------|----------------------|
| 1     | Spam (1)     | 0.9                  |
| 2     | Not Spam (0) | 0.3                  |
| 3     | Spam (1)     | 0.8                  |
| 4     | Not Spam (0) | 0.1                  |
| 5     | Spam (1)     | 0.7                  |

Calculate the Binary Cross-Entropy loss.

### Binary Cross-Entropy Formula
```
BCE = - (1/n) * Σ[y * log(p) + (1-y) * log(1-p)]
```

### Code Template

```python
# Spam classification predictions
actual_labels = np.array([1, 0, 1, 0, 1])  # 1 = spam, 0 = not spam
predicted_probs = np.array([0.9, 0.3, 0.8, 0.1, 0.7])

# Calculate binary cross-entropy
# For each example: -[y*log(p) + (1-y)*log(1-p)]
losses = - (actual_labels * np.log(predicted_probs) + 
           (1 - actual_labels) * np.log(1 - predicted_probs))

# Average loss
bce = np.mean(losses)

print(f"Individual losses: {losses}")
print(f"Binary Cross-Entropy: {bce:.4f}")

# Perfect predictions would have BCE = 0
# Random guessing would have BCE ≈ 0.693 (ln(2))
```

### Expected Results
- BCE should be around 0.2-0.3 (quite good predictions)

### Task 3: Categorical Cross-Entropy for Multi-Class

Your digit classifier predicts probabilities for handwritten digits:

| Image | True Digit | Pred(0) | Pred(1) | Pred(2) | Pred(3) | Pred(4) |
|-------|------------|---------|---------|---------|---------|---------|
| 1     | 2          | 0.1     | 0.1     | 0.6     | 0.1     | 0.1     |
| 2     | 0          | 0.7     | 0.1     | 0.1     | 0.05    | 0.05    |
| 3     | 4          | 0.0     | 0.2     | 0.1     | 0.1     | 0.6     |

Calculate the Categorical Cross-Entropy loss.

### Code Template

```python
# Multi-class predictions (5 classes: digits 0-4)
actual_labels = np.array([2, 0, 4])  # True digits

# Prediction probabilities for each class
predictions = np.array([
    [0.1, 0.1, 0.6, 0.1, 0.1],  # Image 1: predicted mostly 2
    [0.7, 0.1, 0.1, 0.05, 0.05], # Image 2: predicted mostly 0
    [0.0, 0.2, 0.1, 0.1, 0.6],   # Image 3: predicted mostly 4
])

# Calculate categorical cross-entropy
cce_losses = []
for i in range(len(actual_labels)):
    true_class = actual_labels[i]
    predicted_prob = predictions[i, true_class]
    loss = -np.log(predicted_prob)
    cce_losses.append(loss)

cce = np.mean(cce_losses)

print(f"Individual losses: {cce_losses}")
print(f"Categorical Cross-Entropy: {cce:.4f}")

# For comparison: random guessing would be -ln(1/5) ≈ 1.609
# Perfect prediction would be -ln(1) = 0
```

### Understanding Your Results

**MSE for regression:**
- Measures average squared prediction error
- Units are squared (dollars² in this case)
- RMSE gives error in original units

**Binary Cross-Entropy:**
- Measures how confident wrong predictions were
- Lower is better (0 = perfect)
- Used for binary classification

**Categorical Cross-Entropy:**
- Extension of binary cross-entropy to multiple classes
- Penalizes confident wrong predictions heavily
- Standard loss for multi-class classification

### Bonus: Loss Function Comparison

Try these experiments:
1. **Perfect predictions:** What happens to each loss?
2. **Confident wrong predictions:** Set predicted prob to 0.01 for correct class
3. **Uncertain predictions:** Set all probs to 0.2

How do the losses behave differently?

### Key Takeaways

- **MSE:** Good for regression, penalizes large errors quadratically
- **Cross-entropy:** Good for classification, measures prediction confidence
- **Loss guides learning:** Neural networks minimize these functions
- **Scale matters:** Different problems need different loss functions

Great job! Now you can measure how wrong your models are.

## Solution

Below is one possible correct implementation for the practice exercise.

```python
# No initial code block found.
```
