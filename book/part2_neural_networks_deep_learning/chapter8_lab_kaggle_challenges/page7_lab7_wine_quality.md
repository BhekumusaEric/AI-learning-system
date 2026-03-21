---
title: "Lab 7: Wine Quality Prediction"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab7_wine_quality.ipynb"
resources:
  - title: "Kaggle: Wine Quality Dataset"
    url: "https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009"
---

# 🍷 Lab 7: Wine Quality Prediction

## The Challenge

A winery produces thousands of bottles per year. Quality control currently requires a human expert to taste each batch — expensive and slow. They want an ML model that can predict wine quality from **chemical measurements** taken during production.

This is a real dataset from the UCI Machine Learning Repository, used in a published research paper.

---

## What You'll Build

A **Gradient Boosting classifier** that predicts whether a wine is good quality (score ≥ 7) or not, based on 11 chemical properties.

**Input features (11 chemical measurements):**
- `fixed acidity`, `volatile acidity`, `citric acid`
- `residual sugar`, `chlorides`
- `free sulfur dioxide`, `total sulfur dioxide`
- `density`, `pH`, `sulphates`
- `alcohol`

**Target:** `good_wine` (1 = quality ≥ 7, 0 = quality < 7)

---

## Key Concepts You'll Practice

**Gradient Boosting** — Builds trees sequentially. Each new tree corrects the mistakes of the previous ones. One of the most powerful algorithms for tabular data (used in Kaggle competitions constantly).

**Class Imbalance** — Only ~14% of wines are "good quality". This is imbalanced. We use `stratify=y` in train_test_split to ensure both splits have the same ratio.

**AUC-ROC Score** — Better than accuracy for imbalanced datasets. Measures how well the model separates the two classes. AUC = 1.0 is perfect, AUC = 0.5 is random guessing.

**Cross-Validation** — 5-fold CV gives a more reliable estimate than a single train/test split. You'll see the mean ± standard deviation of accuracy.

---

## Step-by-Step Guide

1. **Load** — Red wine dataset directly from UCI (requires internet)
2. **Convert** — Quality score → binary good/bad
3. **Explore** — Box plots: what separates good from bad wine?
4. **Split** — 80/20 stratified split
5. **Train** — Gradient Boosting Classifier
6. **Evaluate** — Accuracy + AUC score
7. **Feature Importance** — What chemical property matters most?
8. **Cross-Validate** — 5-fold CV for reliable estimate

---

## Your Tasks in the Notebook

Fill in 3 blanks:
```python
gb_model = ___    # GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
___               # Fit on X_train, y_train

cv_scores = ___   # cross_val_score(gb_model, X, y, cv=5, scoring='accuracy')
```

---

## Expected Results

✅ Accuracy ≥ 82%
✅ AUC ≥ 0.80

The most important feature is almost always **alcohol** — higher alcohol content strongly predicts good quality. Can you confirm this from the feature importance chart?

> **This is Lab 7 — the final lab!** You've now completed challenges covering classification, regression, clustering, and text analysis. These are the core skills used in real-world data science jobs.
