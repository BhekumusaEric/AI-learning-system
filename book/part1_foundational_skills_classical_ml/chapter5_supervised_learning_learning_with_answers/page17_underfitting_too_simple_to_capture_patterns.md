# Underfitting: Too Simple to Capture Patterns

## When Models Are Too Simple

Underfitting occurs when a model is too simple to capture the underlying patterns in the data, leading to poor performance on both training and test data.

### The Opposite of Overfitting

**Overfitting:** Model too complex, memorizes training data
**Underfitting:** Model too simple, misses important patterns

### Signs of Underfitting

**Training performance:** Poor (low accuracy)
**Test performance:** Poor (low accuracy)
**No gap:** Similar performance on train and test

### Why Underfitting Happens

1. **Too simple model:** Linear model for curved data
2. **Insufficient features:** Missing important variables
3. **Not enough training:** Model didn't learn enough
4. **Wrong algorithm:** Using simple method for complex problem

### Visual Example

```
True pattern: ~~~~~~~~~~~~~ (curved relationship)
Underfit:     ____________________ (straight line)
Overfit:      ⠁⠂⠃⠄⠅⠆⠇⠈⠉⠊ (wiggly line following noise)
Good fit:     ~~~~~~~~~ (follows curve without noise)
```

### Examples of Underfitting

**Linear regression on quadratic data:**
- Data: y = x² + noise
- Model: y = mx + b
- Result: Straight line can't fit parabola

**Shallow neural network for complex images:**
- Task: Recognize objects in photos
- Model: Single layer perceptron
- Result: Can't learn complex visual patterns

**Simple classifier for nuanced categories:**
- Task: Sentiment analysis (positive/negative/neutral)
- Model: Rule-based (count positive words)
- Result: Misses context and sarcasm

### How to Fix Underfitting

**More Complex Models:**
- Add polynomial features: x, x², x³
- Deeper neural networks
- More sophisticated algorithms

**Better Features:**
- Feature engineering
- Domain knowledge
- Automatic feature learning

**More Training:**
- Train longer
- Use better optimization
- Adjust learning rates

**Ensemble Methods:**
- Combine multiple simple models
- Random forests, gradient boosting

### Bias-Variance Tradeoff

**High bias (underfitting):** Model makes wrong assumptions
**High variance (overfitting):** Model too sensitive to training data

**Goal:** Balance bias and variance for minimum total error

### Detecting Underfitting

1. **Learning curves:** Plot error vs training size
   - Underfitting: High error that doesn't decrease much

2. **Train vs test error:** Both high and similar

3. **Model complexity:** Try more complex models

4. **Cross-validation:** Consistent poor performance

### Real-World Solutions

**Polynomial regression:** For curved relationships
**Neural networks:** For complex patterns
**Feature engineering:** Better input representations
**Ensemble learning:** Combine multiple models

### Remember
- Underfitting: Too simple, poor performance everywhere
- Overfitting: Too complex, great training, poor test
- Balance complexity with data and problem
- Monitor both training and validation performance
- Cross-validation helps find the sweet spot

Next, find the balance between underfitting and overfitting!