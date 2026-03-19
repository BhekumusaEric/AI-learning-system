---
title: "Linear Regression: Drawing Lines"
type: "read"
resources:
  - title: "Scikit-Learn: Linear Regression"
    url: "https://scikit-learn.org/stable/modules/linear_model.html#ordinary-least-squares"
---

# Linear Regression: Drawing Lines

## Finding the Best-Fitting Line

Linear regression finds a straight line that best fits your data points, allowing you to make predictions for new data.

### The Concept

Imagine plotting house size vs price:
- Each point represents a house (size, price)
- You want to draw a line that best fits all points
- New houses can be predicted using the line

### The Line Equation

```
y = mx + b

Where:
- y: predicted value (price)
- x: input feature (size)
- m: slope (how much y changes per unit x)
- b: intercept (y when x=0)
```

### Finding the Best Line

**Ordinary Least Squares (OLS):**
- Calculate the line that minimizes the sum of squared errors
- "Squared errors" = (actual y - predicted y)²
- Why squared? Penalizes large errors more

### Visual Example

```
Actual data points: ● ● ● ● ●
Best fit line:     ________________

Errors (residuals): | |   |
                    ↓ ↓   ↓
```

### Multiple Features

Linear regression works with multiple inputs:

```
y = m₁x₁ + m₂x₂ + m₃x₃ + b

Features: size, bedrooms, bathrooms
Prediction: price
```

### Assumptions

Linear regression assumes:
- **Linearity**: Relationship between x and y is linear
- **Independence**: Errors are independent
- **Homoscedasticity**: Constant error variance
- **Normality**: Errors are normally distributed

### When to Use

- Predicting continuous values
- Understanding relationships between variables
- Baseline model for regression problems
- Interpretable results (coefficients show feature importance)

### Remember
- Fits a line to minimize squared errors
- Works for single or multiple features
- Sensitive to outliers
- Foundation for many advanced techniques

Next, practice linear regression!