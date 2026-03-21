---
title: "Lab 2: House Price Prediction"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab2_house_prices.ipynb"
resources:
  - title: "Kaggle: House Prices Competition"
    url: "https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques"
---

# 🏠 Lab 2: House Price Prediction

## The Challenge

A real estate company wants to automatically estimate house prices. Instead of hiring appraisers for every property, they want an ML model that can predict prices from measurable features.

You'll use the **California Housing dataset** — a benchmark dataset with data from the 1990 California census. Each row is a block of houses, and you'll predict the median house value.

---

## What You'll Build

Two regression models and compare them:

1. **Linear Regression** — Fits a straight line through the data
2. **Random Forest Regressor** — An ensemble of 100 decision trees

**Input features:**
- `MedInc` — Median income in the block
- `HouseAge` — Median house age
- `AveRooms` — Average number of rooms
- `AveBedrms` — Average number of bedrooms
- `Population` — Block population
- `AveOccup` — Average household size
- `Latitude` / `Longitude` — Location

**Target:** Median house value (in $100,000s)

---

## Key Concepts You'll Practice

**R² Score** — Measures how well the model explains the variance in prices.
- R² = 1.0 → perfect predictions
- R² = 0.0 → no better than guessing the mean
- R² > 0.75 → good model

**RMSE (Root Mean Squared Error)** — Average prediction error in dollars.

**Feature Scaling** — Linear Regression needs scaled features. Random Forest doesn't. You'll see why this matters.

**Ensemble Methods** — Random Forest combines 100 trees. Each tree sees a random subset of data and features. The final prediction is the average. This reduces overfitting dramatically.

---

## Step-by-Step Guide

1. **Load** — California Housing dataset from sklearn
2. **Explore** — Correlation between income and price
3. **Visualize** — Scatter plot of income vs price
4. **Split** — 80/20 train/test
5. **Scale** — StandardScaler for Linear Regression
6. **Train Linear Regression** — Your first blank to fill
7. **Train Random Forest** — Your second blank to fill
8. **Compare** — Side-by-side scatter plots of predictions vs actual

---

## Your Tasks in the Notebook

Fill in 4 blanks:
```python
lr_model = ___    # LinearRegression()
___               # Fit on X_train_scaled, y_train

rf_model = ___    # RandomForestRegressor(n_estimators=100, random_state=42)
___               # Fit on X_train (no scaling!), y_train
```

---

## Expected Results

| Model | R² Score | RMSE |
|-------|----------|------|
| Linear Regression | ~0.60 | ~$85k |
| Random Forest | ~0.80 | ~$55k |

> **Why does Random Forest win?** House prices aren't linear — a house in San Francisco costs much more than one in rural areas even with the same size. Random Forest captures these non-linear patterns.
