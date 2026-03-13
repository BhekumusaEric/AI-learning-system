---
title: "3Blue1Brown: Neural Networks"
type: "read"
resources:
  - title: "Google ML Crash Course: Descending into ML"
    url: "https://developers.google.com/machine-learning/crash-course/descending-into-ml/video-lecture"
---

# Loss Functions: Measuring Mistakes

## How Neural Networks Measure Error

Loss functions quantify how wrong a neural network's predictions are, guiding the learning process by telling the network which direction to adjust its weights.

### Why Loss Functions Matter

Neural networks learn by:
1. Making predictions
2. Calculating how wrong they are (loss)
3. Adjusting weights to reduce loss
4. Repeating until loss is minimized

### Regression Losses

For predicting continuous values (prices, temperatures):

**Mean Squared Error (MSE):**
```
MSE = (1/n) × Σ(actual - predicted)²

- Squares errors (large mistakes penalized more)
- Always positive
- Differentiable (needed for gradient descent)
- Units: squared units of target variable
```

**Mean Absolute Error (MAE):**
```
MAE = (1/n) × Σ|actual - predicted|

- Absolute values (less sensitive to outliers)
- Same units as target variable
- Less affected by extreme values
```

**Huber Loss:**
```
- Combines MSE and MAE
- Less sensitive to outliers than MSE
- Differentiable everywhere
```

### Classification Losses

For predicting categories (spam/not spam):

**Binary Cross-Entropy (Log Loss):**
```
Loss = -[y × log(ŷ) + (1-y) × log(1-ŷ)]

Where:
- y = actual label (0 or 1)
- ŷ = predicted probability (0 to 1)

- Penalizes confident wrong predictions heavily
- Used with sigmoid activation
- Perfect for binary classification
```

**Categorical Cross-Entropy:**
```
Loss = -Σ(yᵢ × log(ŷᵢ))

Where:
- yᵢ = actual one-hot encoded label
- ŷᵢ = predicted probability for class i

- Extension of binary cross-entropy
- Used with softmax activation
- For multi-class classification
```

**Hinge Loss (SVM):**
```
Loss = max(0, 1 - y × ŷ)

- Used in Support Vector Machines
- Encourages margin between classes
- Less common in deep learning
```

### Properties of Good Loss Functions

1. **Differentiable:** Can compute gradients for backpropagation
2. **Convex:** Single global minimum (preferably)
3. **Appropriate scale:** Not too large or small
4. **Task-specific:** Matches the problem type

### Loss vs Metrics

**Loss functions:** Guide training (differentiable, optimization-friendly)
**Metrics:** Evaluate performance (human-interpretable)

Example:
- Loss: Binary cross-entropy (for training)
- Metric: Accuracy, precision, recall (for evaluation)

### Advanced Losses

**Focal Loss:** Addresses class imbalance by down-weighting easy examples
**Dice Loss:** Used in image segmentation
**Triplet Loss:** For learning embeddings with similarity

### Choosing Loss Functions

- **Regression:** MSE, MAE, Huber
- **Binary classification:** Binary cross-entropy
- **Multi-class:** Categorical cross-entropy
- **Imbalanced data:** Weighted losses, focal loss

### Remember
- Loss functions measure prediction errors
- Guide weight updates during training
- Different losses for different tasks
- Loss decreases during successful training
- Monitor both loss and metrics

Next, practice calculating loss functions!