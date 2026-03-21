---
title: "Lab 3: Iris Flower Classification"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab3_iris_classification.ipynb"
resources:
  - title: "Kaggle: Iris Dataset"
    url: "https://www.kaggle.com/datasets/uciml/iris"
---

# 🌸 Lab 3: Iris Flower Classification

## The Challenge

A botanist wants to automatically identify iris flower species from physical measurements. There are 3 species:

- **Setosa** — Small petals, easy to identify
- **Versicolor** — Medium-sized
- **Virginica** — Largest petals

**Can you build a classifier that identifies the species from 4 measurements?**

---

## What You'll Build

You'll train and compare two classifiers:

1. **K-Nearest Neighbors (KNN)** — "What species are my 5 closest neighbors?"
2. **Support Vector Machine (SVM)** — Finds the best boundary between classes

**Input features:**
- `sepal length` — Length of the outer leaf (cm)
- `sepal width` — Width of the outer leaf (cm)
- `petal length` — Length of the inner petal (cm)
- `petal width` — Width of the inner petal (cm)

**Target:** Species (0=Setosa, 1=Versicolor, 2=Virginica)

---

## Key Concepts You'll Practice

**KNN (K-Nearest Neighbors)** — To classify a new flower, find the K most similar flowers in the training set and take a vote. If 4 out of 5 neighbors are Setosa, predict Setosa.

**Choosing K** — Too small (K=1) → overfits. Too large (K=50) → underfits. You'll use a loop to find the best K.

**Feature Scaling** — KNN uses distance. If one feature has values 0-100 and another has 0-1, the first dominates. StandardScaler fixes this.

**Cross-Validation** — Instead of one train/test split, test on 5 different splits and average the results. More reliable!

---

## Step-by-Step Guide

1. **Load** — sklearn's built-in Iris dataset (150 flowers, 50 per species)
2. **Visualize** — Scatter plots showing how species cluster
3. **Split** — 70% train, 30% test
4. **Scale** — StandardScaler
5. **Train KNN** — Start with k=5
6. **Find best K** — Loop from k=1 to k=15
7. **Train SVM** — Compare with KNN
8. **Report** — Precision, recall, F1 per species

---

## Your Tasks in the Notebook

Fill in 4 blanks:
```python
knn = ___          # KNeighborsClassifier(n_neighbors=5)
___                # Fit on X_train_s, y_train

best_k = ___       # k_values[accuracies.index(max(accuracies))]
```

---

## Expected Results

Both KNN and SVM should achieve **≥ 95% accuracy** on Iris — it's a relatively easy dataset. The interesting part is seeing which species gets confused with which!

> **Fun fact:** Setosa is always perfectly classified. Versicolor and Virginica sometimes get confused because they overlap in feature space.
