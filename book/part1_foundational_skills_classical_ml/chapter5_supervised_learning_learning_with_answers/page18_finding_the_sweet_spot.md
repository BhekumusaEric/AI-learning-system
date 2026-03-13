---
title: "Scikit-Learn: Supervised Learning"
type: "read"
resources:
  - title: "Scikit-Learn: Cross-Validation"
    url: "https://scikit-learn.org/stable/modules/cross_validation.html"
---

# Finding the Sweet Spot

## Balancing Model Complexity: The Art of Avoiding Overfitting and Underfitting

Now that you understand overfitting and underfitting, let's learn how to find the perfect balance between the two.

### The Bias-Variance Tradeoff

Every machine learning model makes two types of errors:

**Bias:** How far off the model's predictions are from the true values (on average)
**Variance:** How much the model's predictions vary for different training sets

### The Sweet Spot

```
High Bias, Low Variance    ← Underfitting
    ↓
Perfect Balance           ← Just Right!
    ↓
Low Bias, High Variance    ← Overfitting
```

### Visualizing the Tradeoff

Imagine throwing darts at a target:

**High Bias, Low Variance:** All darts cluster together, but far from the bullseye
**Low Bias, High Variance:** Darts are spread out around the bullseye
**Perfect Balance:** Darts cluster tightly around the bullseye

### Techniques to Find the Sweet Spot

#### 1. Cross-Validation

Instead of one train/test split, use multiple splits:

```python
from sklearn.model_selection import cross_val_score

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5)
print(f"Cross-validation scores: {scores}")
print(f"Average score: {scores.mean():.3f} (+/- {scores.std() * 2:.3f})")
```

**Why it helps:** Tests model on different data subsets, gives more reliable performance estimate.

#### 2. Learning Curves

Plot performance vs training set size:

```python
from sklearn.model_selection import learning_curve

train_sizes, train_scores, val_scores = learning_curve(
    model, X, y, cv=5, n_jobs=-1, 
    train_sizes=np.linspace(0.1, 1.0, 10))

plt.plot(train_sizes, train_scores.mean(axis=1), label='Training score')
plt.plot(train_sizes, val_scores.mean(axis=1), label='Validation score')
plt.xlabel('Training set size')
plt.ylabel('Score')
plt.legend()
plt.show()
```

**What to look for:**
- **Underfitting:** Both curves flat and low
- **Overfitting:** Training high, validation low, gap between curves
- **Good fit:** Both curves converge to high score

#### 3. Regularization

Add penalties to prevent overfitting:

**L1 Regularization (Lasso):** Makes some coefficients exactly zero
**L2 Regularization (Ridge):** Shrinks all coefficients toward zero

```python
from sklearn.linear_model import Ridge

# Ridge regression with different alpha values
alphas = [0.1, 1.0, 10.0, 100.0]
for alpha in alphas:
    model = Ridge(alpha=alpha)
    scores = cross_val_score(model, X, y, cv=5)
    print(f"Alpha {alpha}: {scores.mean():.3f}")
```

#### 4. Hyperparameter Tuning

Systematically try different model settings:

```python
from sklearn.model_selection import GridSearchCV

# Define parameter grid
param_grid = {
    'max_depth': [3, 5, 7, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

# Grid search with cross-validation
grid_search = GridSearchCV(DecisionTreeClassifier(), param_grid, cv=5)
grid_search.fit(X_train, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.3f}")
```

### Model-Specific Techniques

#### For Decision Trees:
- `max_depth`: Limit tree depth
- `min_samples_split`: Minimum samples to split a node
- `min_samples_leaf`: Minimum samples in a leaf
- `max_features`: Limit features considered for splits

#### For Neural Networks:
- **Dropout:** Randomly turn off neurons during training
- **Early stopping:** Stop training when validation error stops improving
- **Batch normalization:** Stabilize learning
- **Weight decay:** L2 regularization on weights

#### For KNN:
- **k value:** Try different numbers of neighbors
- **Distance metric:** Euclidean, Manhattan, etc.
- **Weighted voting:** Closer neighbors have more influence

### The Validation Set Method

1. **Split your data:** Training (60%), Validation (20%), Test (20%)
2. **Train models** with different complexity on training set
3. **Evaluate on validation set** to choose best model
4. **Final evaluation** on test set (only once!)

### Common Patterns

**Underfitting solutions:**
- Increase model complexity
- Add more features
- Train longer (for neural networks)
- Use more sophisticated algorithms

**Overfitting solutions:**
- Simplify the model
- Add regularization
- Get more training data
- Use cross-validation
- Feature selection

### Real-World Example: Polynomial Regression

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import Pipeline

# Try different polynomial degrees
degrees = [1, 2, 3, 4, 5, 10]

for degree in degrees:
    model = Pipeline([
        ('poly', PolynomialFeatures(degree=degree)),
        ('linear', LinearRegression())
    ])
    
    scores = cross_val_score(model, X, y, cv=5)
    print(f"Degree {degree}: CV score = {scores.mean():.3f}")
```

**Result:** Usually degree 2-4 works best, higher degrees overfit.

### When to Stop Tuning

**Signs you're done:**
- Cross-validation scores are stable
- Learning curves show good fit
- Test set performance is acceptable
- Model generalizes well to new data

**Warning signs:**
- Still overfitting despite all techniques
- Need much more data
- Problem might be unsolvable with current features

### Key Takeaways

- **Bias-variance tradeoff** is fundamental to ML
- **Cross-validation** gives reliable performance estimates
- **Learning curves** diagnose underfitting/overfitting
- **Regularization** prevents overfitting
- **Hyperparameter tuning** finds optimal settings
- **Validation set** helps choose the best model
- **More data** usually helps more than complex models

### Remember

Finding the sweet spot is both art and science. Start simple, use cross-validation to guide your choices, and always validate on data the model hasn't seen during training. The goal is a model that performs well on new, unseen data - not just the training set!

You've now mastered the fundamentals of supervised learning. Ready to explore unsupervised learning?