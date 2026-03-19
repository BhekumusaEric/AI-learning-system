---
title: "Features and Labels"
type: "read"
resources:
  - title: "Google ML Crash Course: Framing"
    url: "https://developers.google.com/machine-learning/crash-course/framing/ml-terminology"
---

# Features and Labels

## The Building Blocks of Supervised Learning

Every supervised learning problem can be broken down into features (inputs) and labels (outputs).

### Features (X)

Features are the information you use to make predictions:
- **Numerical**: Age (25), height (170.5), price ($299.99)
- **Categorical**: Color (red/blue/green), size (S/M/L)
- **Text**: Words in a review, email content
- **Images**: Pixel values, edges, shapes

### Labels (y)

Labels are what you're trying to predict:
- **Regression**: Continuous values (house prices, temperatures)
- **Classification**: Categories (spam/not spam, dog/cat/bird)

### Example: House Price Prediction

```
Features (X):
- Square footage: 2000
- Bedrooms: 3
- Bathrooms: 2
- Age: 10 years
- Location: "Downtown"

Label (y):
- Price: $350,000
```

### Feature Engineering

Turning raw data into useful features:
- **Numerical transformations**: Age → age_squared, log_price
- **Categorical encoding**: "Red" → [1,0,0], "Blue" → [0,1,0]
- **Text features**: Word counts, sentiment scores
- **Date features**: Day of week, month, season

### The Data Matrix

Supervised learning data is usually organized as:
- **X**: Feature matrix (n_samples × n_features)
- **y**: Label vector (n_samples)

```
X = [[sqft, beds, baths],  y = [price,
     [2000, 3, 2],         350000,
     [1500, 2, 1],         250000,
     [3000, 4, 3]]         500000]
```

### Feature Importance

Not all features are equally useful:
- **Relevant features**: Help predict the label
- **Irrelevant features**: Add noise, hurt performance
- **Redundant features**: Duplicate information

### Remember
- Features are inputs, labels are outputs
- Choose features that correlate with labels
- More features aren't always better
- Quality matters more than quantity

Next, learn how to split data for training and testing!