---
title: "Lab 4: Handwritten Digit Recognition"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab4_digit_recognition.ipynb"
resources:
  - title: "Kaggle: Digit Recognizer Competition"
    url: "https://www.kaggle.com/competitions/digit-recognizer"
---

#  Lab 4: Handwritten Digit Recognition

## The Challenge

This is the classic MNIST problem — one of the most famous datasets in machine learning. Banks use digit recognition to read cheque amounts. Post offices use it to sort mail by zip code.

You'll build a classifier that reads **8×8 pixel images** of handwritten digits (0-9) and identifies what digit it is.

---

## What You'll Build

A **Random Forest classifier** trained on 64 pixel values (an 8×8 image flattened into a row of numbers).

**Input:** 64 pixel values (0-16 grayscale intensity)
**Output:** Digit class (0, 1, 2, ..., 9)

---

## Key Concepts You'll Practice

**Images as Numbers** — Every pixel is just a number. An 8×8 image = 64 numbers. The model learns which pixel patterns correspond to which digit.

**Multi-class Classification** — Not just yes/no, but 10 possible classes. The model outputs probabilities for each class and picks the highest.

**Confusion Matrix** — A 10×10 grid showing which digits get confused with which. The diagonal = correct predictions. Off-diagonal = mistakes.

**Per-class Accuracy** — Some digits are harder than others. Which one does your model struggle with most?

---

## Step-by-Step Guide

1. **Load** — sklearn's digits dataset (1,797 images)
2. **Visualize** — Display sample images for each digit
3. **Split** — 80% train, 20% test
4. **Train** — `RandomForestClassifier(n_estimators=100)`
5. **Evaluate** — Accuracy score
6. **Confusion Matrix** — Heatmap of predictions vs truth
7. **Analyze** — Find the hardest digit to classify

---

## Your Tasks in the Notebook

Fill in 3 blanks:
```python
rf = ___           # RandomForestClassifier(n_estimators=100, random_state=42)
___                # Fit on X_train, y_train

hardest_digit = ___ # np.argmin(per_class_acc)
```

---

## Expected Results

 Accuracy ≥ 95%

Random Forest is very powerful for this task. The confusion matrix will show that digits like 3 and 8, or 4 and 9, sometimes get confused — they look similar even to humans!

> **Challenge:** After completing the notebook, try changing `n_estimators` from 100 to 200. Does accuracy improve? By how much?
