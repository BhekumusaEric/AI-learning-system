---
title: "Lab 6: Spam Email Detector"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab6_spam_detector.ipynb"
resources:
  - title: "Kaggle: SMS Spam Collection"
    url: "https://www.kaggle.com/datasets/uciml/sms-spam-collection-dataset"
---

# 📧 Lab 6: Spam Email Detector

## The Challenge

Every email service — Gmail, Outlook, Yahoo — needs a spam filter. Without one, your inbox would be flooded with scams, fake prizes, and phishing attempts.

You'll build a spam classifier from scratch using **text data**. The key challenge: ML models need numbers, not words. You'll learn how to convert text into a numerical representation.

---

## What You'll Build

A **Naive Bayes text classifier** that reads email content and predicts: **spam (1) or ham (0)**.

**Input:** Raw email text (a string)
**Output:** spam or ham

---

## Key Concepts You'll Practice

**TF-IDF (Term Frequency-Inverse Document Frequency)** — A way to convert text to numbers.
- **TF** — How often does a word appear in this email?
- **IDF** — How rare is this word across all emails?
- Words like "FREE", "WINNER", "CLICK" are common in spam but rare in normal emails → high TF-IDF score

**Naive Bayes** — A probabilistic classifier that asks: "Given this word appears, how likely is this email spam?" It multiplies probabilities for all words together. Fast and surprisingly effective for text!

**Precision vs Recall** — For spam detection:
- **Precision** — Of emails flagged as spam, how many actually are? (False positives = important emails in spam folder)
- **Recall** — Of all spam emails, how many did we catch? (False negatives = spam in inbox)

---

## Step-by-Step Guide

1. **Load** — 120 spam + 120 ham emails
2. **Explore** — Top words in spam vs ham
3. **Split** — 80/20 train/test (stratified)
4. **Vectorize** — TF-IDF converts text to numbers
5. **Train** — Naive Bayes classifier
6. **Evaluate** — Accuracy + classification report
7. **Test** — Run on 4 new emails

---

## Your Tasks in the Notebook

Fill in 2 blanks:
```python
vectorizer = ___   # TfidfVectorizer(max_features=500, stop_words='english')

nb_model = ___     # MultinomialNB()
___                # Fit on X_train, y_train
```

---

## Expected Results

✅ Accuracy ≥ 85%

The model should correctly identify obvious spam like "WINNER! You have won $1,000,000!" and correctly pass through normal emails like "Can we schedule a meeting tomorrow?"

> **Why Naive Bayes?** It's called "naive" because it assumes all words are independent (which isn't true — "free money" is more spammy than "free" or "money" alone). But despite this simplification, it works remarkably well for spam detection!
