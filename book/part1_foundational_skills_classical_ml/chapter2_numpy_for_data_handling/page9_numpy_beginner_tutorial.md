---
title: "NumPy Beginner Tutorial — Full Notebook"
type: "lab"
colab_notebook: "notebooks/part1_foundational_skills_classical_ml/chapter2_numpy/numpy_beginner_tutorial.ipynb"
resources:
  - title: "NumPy Official Documentation"
    url: "https://numpy.org/doc/stable/"
  - title: "NumPy Quickstart Guide"
    url: "https://numpy.org/doc/stable/user/quickstart.html"
---

# 🔢 NumPy Beginner Tutorial — Full Notebook

## What This Is

You've worked through the NumPy chapter page by page. This notebook brings **everything together** in one place — a complete, runnable Google Colab tutorial you can keep, share, and come back to whenever you need a refresher.

It covers all 10 sections from scratch, with real examples and a cheat sheet at the end.

---

## What's Inside

| Section | Topic |
|---|---|
| 1 | What is NumPy and why it matters |
| 2 | Your first array — lists vs arrays |
| 3 | Creating arrays (arange, linspace, zeros, ones, random) |
| 4 | Shape and dimensions — 1D, 2D, reshape |
| 5 | Maths on arrays — element-wise operations |
| 6 | Aggregate functions — sum, mean, min, max, std |
| 7 | Indexing and slicing — 1D and 2D |
| 8 | Boolean masking — filtering without loops |
| 9 | Useful functions — sort, argsort, where, vstack, hstack |
| 10 | Real example — student grade analysis end-to-end |
| 11 | Cheat sheet — everything on one printable page |

---

## Why NumPy Matters

Every ML library you will ever use is built on NumPy:

- **scikit-learn** — all datasets are NumPy arrays
- **PyTorch** — tensors are NumPy arrays with GPU support
- **TensorFlow** — same idea
- **Pandas** — DataFrames are built on NumPy under the hood

When you call `model.fit(X, y)`, `X` and `y` are NumPy arrays. When you preprocess data with `StandardScaler`, it's doing NumPy operations. Understanding NumPy means understanding what every ML library is actually doing.

---

## Key Things to Pay Attention To

**Vectorisation** — the whole point of NumPy is to avoid Python loops. If you find yourself writing `for i in range(len(array))`, there's almost always a NumPy way to do it in one line.

**Shape** — before you do anything with an array, check its `.shape`. Most bugs in ML code come from shape mismatches. Get into the habit of printing shapes constantly.

**Axis** — `axis=0` means "operate down the rows" (per column), `axis=1` means "operate across the columns" (per row). This trips up everyone at first. The real example in Section 9 makes it click.

**Boolean masking** — this is how pandas `.loc[]` filtering works under the hood. Master it here and pandas will feel natural.

**Min-max normalisation** — Section 9 shows you how to scale data to 0–1. This is exactly what `MinMaxScaler` in sklearn does. Once you see the NumPy version, the sklearn version is just a wrapper.

---

## Open in Google Colab

Click the button in the notebook viewer above, or open directly:

> Run each cell in order. Read the output. Don't just execute — understand what each line does before moving on.

---

## After This Notebook

You're ready for:
- **Chapter 3: Pandas** — DataFrames are 2D NumPy arrays with labels
- **Chapter 5: Supervised Learning** — all sklearn models take NumPy arrays as input
- Any real ML project — you now speak the language every library uses
