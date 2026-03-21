---
title: "Lab 1: Titanic Survival Prediction"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab1_titanic_survival.ipynb"
resources:
  - title: "Kaggle: Titanic Competition"
    url: "https://www.kaggle.com/competitions/titanic"
---

# 🚢 Lab 1: Titanic Survival Prediction

## The Challenge

On April 15, 1912, the RMS Titanic sank after hitting an iceberg. Of the 2,224 passengers and crew, 1,502 died. One of the reasons so many people died was that there weren't enough lifeboats.

Some groups had better survival chances than others — women, children, and 1st class passengers were prioritized. **Can you build a model to predict who survived?**

This is the most famous beginner competition on Kaggle. Thousands of data scientists have tackled it. Now it's your turn.

---

## What You'll Build

A **Decision Tree classifier** that takes passenger information and predicts: **survived (1) or died (0)**.

**Input features:**
- `pclass` — Ticket class (1st, 2nd, 3rd)
- `sex` — Male or female
- `age` — Age in years
- `sibsp` — Number of siblings/spouses aboard
- `parch` — Number of parents/children aboard

**Target:** `survived` (0 = No, 1 = Yes)

---

## Key Concepts You'll Practice

**Data Cleaning** — Real data has missing values. The `age` column has gaps — you'll fill them with the median age.

**Feature Engineering** — Computers need numbers, not words. You'll convert `sex` from "male"/"female" to 0/1.

**Decision Tree** — A model that asks a series of yes/no questions:
- "Is the passenger female?" → Yes → more likely survived
- "Is the class 1st?" → Yes → more likely survived

**Accuracy** — The percentage of correct predictions. Aim for **≥ 70%**.

---

## Step-by-Step Guide

The notebook walks you through:

1. **Load data** — Using seaborn's built-in Titanic dataset
2. **Explore** — See survival rates by gender and class
3. **Visualize** — Bar charts showing who survived
4. **Clean** — Fill missing ages, encode gender
5. **Split** — 80% train, 20% test
6. **Train** — `DecisionTreeClassifier(max_depth=4)`
7. **Evaluate** — Check accuracy
8. **Interpret** — Which features mattered most?

> **Remember:** `max_depth=4` limits how deep the tree grows. Too deep = memorizes training data. Too shallow = misses patterns. 4 is a good starting point!

---

## Your Tasks in the Notebook

Fill in 3 blanks:
```python
model = ___          # Create DecisionTreeClassifier(max_depth=4)
___                  # Fit the model on training data
predictions = ___    # Make predictions on test data
```

That's it! The rest is already written for you.

---

## Expected Result

✅ Accuracy ≥ 70%

The most important feature is usually `sex` — women had a much higher survival rate. Can you confirm this from the feature importance chart?
