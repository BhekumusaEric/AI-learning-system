---
title: "Lab 5: Customer Segmentation"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab5_customer_segmentation.ipynb"
resources:
  - title: "Kaggle: Mall Customer Segmentation"
    url: "https://www.kaggle.com/datasets/vjchoudhary7/customer-segmentation-tutorial-in-python"
---

# Lab 5: Customer Segmentation

## The Challenge

A shopping mall has data on 200 customers — their age, annual income, and spending score (1-100, assigned by the mall based on purchase history).

The marketing team wants to know: **Are there natural groups of customers?** If so, they can target each group with different promotions.

This is an **unsupervised learning** problem — there are no labels. You need to discover the groups yourself.

---

## What You'll Build

A **K-Means clustering** model that groups customers into segments based on their income and spending behavior.

**Input features:**
- `Annual_Income_k` — Annual income in thousands of dollars
- `Spending_Score` — Score from 1 (low spender) to 100 (high spender)

**Output:** Cluster assignment for each customer

---

## Key Concepts You'll Practice

**K-Means Clustering** — Assigns each point to the nearest cluster center (centroid). Then moves the centroid to the average of its assigned points. Repeats until stable.

**The Elbow Method** — How do you choose K? Run K-Means for K=1 to K=10. Plot the inertia (total distance from points to their centroid). Look for the "elbow" — where adding more clusters stops helping much.

**Inertia** — Lower = tighter, more compact clusters. But more clusters always means lower inertia. The elbow is the sweet spot.

---

## Step-by-Step Guide

1. **Load** — Simulated mall customer data
2. **Explore** — Histograms of age, income, spending
3. **Elbow Method** — Find the best K
4. **Train K-Means** — With your chosen K
5. **Visualize** — Scatter plot with colored clusters and centroids
6. **Interpret** — What does each cluster represent?

---

## Your Tasks in the Notebook

Fill in 3 blanks:
```python
best_k = ___    # Look at the elbow plot (hint: 5)

kmeans = ___    # KMeans(n_clusters=best_k, random_state=42, n_init=10)
___             # Fit on X
```

---

## Expected Customer Segments

After clustering, you should find roughly 5 groups:

| Cluster | Income | Spending | Marketing Strategy |
|---------|--------|----------|--------------------|
| A | Low | Low | Budget deals |
| B | Low | High | Impulse buyers — flash sales |
| C | Medium | Medium | Loyalty programs |
| D | High | High | Premium products |
| E | High | Low | Convince them to spend more |

> **This is real business intelligence!** Companies like Amazon and Netflix use clustering to personalize recommendations for different customer types.
