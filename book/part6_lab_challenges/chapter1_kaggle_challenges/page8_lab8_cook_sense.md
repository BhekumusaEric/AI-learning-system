---
title: "Lab 8: CookSense AI Challenge"
type: "lab"
colab_notebook: "notebooks/lab_kaggle_challenges/lab8_cook_sense.ipynb"
resources:
  - title: "Kaggle: CookSense AI Challenge"
    url: "https://www.kaggle.com/competitions/cook-sense-ai-challenge"
  - title: "Scikit-learn: TF-IDF Vectorizer"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html"
  - title: "Scikit-learn: MultiLabelBinarizer"
    url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.MultiLabelBinarizer.html"
  - title: "Understanding TF-IDF"
    url: "https://www.youtube.com/watch?v=OymqCnh-ADA"
---

# 🍳 Lab 8: CookSense AI Challenge

## The Challenge

A food-tech startup called **CookSense** has built a smart cooking assistant. They have a massive database of recipes — each one has a list of ingredients. The challenge: **given only the ingredients, predict what cuisine the dish belongs to.**

Can a model look at `["soy sauce", "ginger", "sesame oil", "tofu"]` and know it's **Japanese**? Or see `["olive oil", "tomato", "basil", "mozzarella"]` and recognise **Italian**?

This is a **real Kaggle competition**. You'll build a model, generate predictions, and could submit to the leaderboard.

> 🔗 **Competition link:** [kaggle.com/competitions/cook-sense-ai-challenge](https://www.kaggle.com/competitions/cook-sense-ai-challenge)

---

## What Makes This Interesting

Most ML problems use numbers as input — house sizes, temperatures, pixel values. This one uses **text** (ingredient names). That means you need to convert words into numbers before any model can learn from them.

This is your first taste of **Natural Language Processing (NLP)** applied to a real problem.

---

## What You'll Build

A **multi-class text classifier** that:
1. Takes a list of ingredients as input
2. Converts them into numerical features using **TF-IDF**
3. Trains a **Logistic Regression** model to predict cuisine
4. Evaluates accuracy and generates a submission file

**Input:** `["garlic", "olive oil", "tomato", "basil", "pasta"]`
**Output:** `"italian"`

---

## The Dataset

The competition provides three files:

| File | What it contains |
|---|---|
| `train.json` | Recipes with ingredients + correct cuisine label |
| `test.json` | Recipes with ingredients only (no label — you predict these) |
| `sample_submission.csv` | The format Kaggle expects for your predictions |

**Training data structure:**
```json
{
  "id": 10259,
  "cuisine": "greek",
  "ingredients": ["romaine lettuce", "black olives", "grape tomatoes", "garlic", "pepper", "feta cheese crumbles"]
}
```

**Test data structure** (no cuisine — that's what you predict):
```json
{
  "id": 18009,
  "ingredients": ["baking powder", "eggs", "all-purpose flour", "raisins", "milk", "white sugar"]
}
```

---

## Key Concepts Explained

### 1. What is TF-IDF?

**TF-IDF** stands for **Term Frequency — Inverse Document Frequency**. It's a way to turn words into numbers that captures how *important* a word is.

Think of it this way:
- **"salt"** appears in almost every recipe → not very useful for identifying cuisine → gets a **low score**
- **"miso paste"** only appears in Japanese recipes → very useful → gets a **high score**

TF-IDF automatically figures this out. Words that are common everywhere get penalised. Words that are rare and specific get rewarded.

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Each recipe becomes one "document" — ingredients joined as a string
# ["garlic", "olive oil", "tomato"] → "garlic olive oil tomato"
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(ingredient_strings)
```

The result `X` is a matrix where:
- Each **row** = one recipe
- Each **column** = one ingredient
- Each **value** = the TF-IDF score of that ingredient in that recipe

### 2. Why Logistic Regression for Text?

You might expect a neural network for NLP. But for this kind of problem — short text, many classes, structured vocabulary — **Logistic Regression with TF-IDF is surprisingly powerful** and trains in seconds.

It works by learning: *"if the recipe has high TF-IDF scores for 'miso', 'dashi', 'sake' → predict Japanese"*.

We use `LogisticRegression(max_iter=1000, C=5)`:
- `max_iter=1000` — gives the solver enough iterations to converge
- `C=5` — controls regularisation. Higher C = less regularisation = model fits training data more closely

### 3. Multi-Class Classification

There are **20 different cuisines** in this dataset (Italian, Mexican, Chinese, Indian, etc.). This is called **multi-class classification** — more than 2 possible outputs.

Logistic Regression handles this automatically using a strategy called **One-vs-Rest (OvR)**: it trains 20 separate binary classifiers, one per cuisine, then picks the one with the highest confidence.

### 4. Joining Ingredients into a String

The ingredients come as a Python list. TF-IDF expects a string. So we join them:

```python
# Before: ["olive oil", "garlic", "tomato"]
# After:  "olive oil garlic tomato"
ingredient_string = " ".join(ingredients)
```

We do this for every recipe in the dataset.

---

## Step-by-Step Guide

### Step 1: Load the Data

```python
import json
import pandas as pd

# Load training data
with open('train.json', 'r') as f:
    train_data = json.load(f)

# Load test data
with open('test.json', 'r') as f:
    test_data = json.load(f)

# Convert to DataFrames
train_df = pd.DataFrame(train_data)
test_df = pd.DataFrame(test_data)

print(f"Training recipes: {len(train_df)}")
print(f"Test recipes: {len(test_df)}")
print(f"Cuisines: {train_df['cuisine'].nunique()}")
print(train_df['cuisine'].value_counts())
```

You'll see the dataset has ~40,000 training recipes across 20 cuisines. Italian and Mexican are the most common.

---

### Step 2: Explore the Data

```python
import matplotlib.pyplot as plt

# How many recipes per cuisine?
cuisine_counts = train_df['cuisine'].value_counts()
plt.figure(figsize=(12, 5))
cuisine_counts.plot(kind='bar', color='#00ff9d')
plt.title('Number of Recipes per Cuisine')
plt.xlabel('Cuisine')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()

# How many ingredients does a typical recipe have?
train_df['num_ingredients'] = train_df['ingredients'].apply(len)
print(f"Average ingredients per recipe: {train_df['num_ingredients'].mean():.1f}")
print(f"Max ingredients: {train_df['num_ingredients'].max()}")
print(f"Min ingredients: {train_df['num_ingredients'].min()}")
```

> **Notice:** The dataset is **imbalanced** — Italian has ~8,000 recipes, Brazilian has ~500. This means the model will naturally be better at predicting common cuisines. Keep this in mind when reading your accuracy.

---

### Step 3: Prepare the Features

```python
# Join ingredient lists into strings
# ["garlic", "olive oil"] → "garlic olive oil"
train_df['ingredient_str'] = train_df['ingredients'].apply(lambda x: ' '.join(x))
test_df['ingredient_str'] = test_df['ingredients'].apply(lambda x: ' '.join(x))

# Separate features (X) and labels (y)
X_train_raw = train_df['ingredient_str']
y_train = train_df['cuisine']
X_test_raw = test_df['ingredient_str']

print("Sample ingredient string:")
print(X_train_raw.iloc[0])
print("\nCuisine:", y_train.iloc[0])
```

---

### Step 4: Convert Text to Numbers with TF-IDF

```python
from sklearn.feature_extraction.text import TfidfVectorizer

# Create the vectorizer
# ngram_range=(1,2) means we also capture two-word phrases like "soy sauce", "olive oil"
# min_df=2 ignores ingredients that appear in fewer than 2 recipes (typos, rare items)
vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=2)

# Fit on training data and transform both train and test
# IMPORTANT: only fit on training data — never on test data
# (fitting on test data would be "data leakage" — cheating)
X_train = vectorizer.fit_transform(X_train_raw)
X_test = vectorizer.transform(X_test_raw)  # transform only, not fit_transform

print(f"Training matrix shape: {X_train.shape}")
# e.g. (39774, 8000) — 39,774 recipes, 8,000 unique ingredient terms
```

> **Why `fit_transform` on train but only `transform` on test?**
> `fit` learns the vocabulary from the data. If you fit on test data too, the model would "see" test data during training — that's cheating. Always fit only on training data.

---

### Step 5: Train the Model

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Split training data into train/validation (80/20)
# We use this to evaluate before submitting to Kaggle
X_tr, X_val, y_tr, y_val = train_test_split(
    X_train, y_train,
    test_size=0.2,
    random_state=42,
    stratify=y_train  # ensures each cuisine is proportionally represented
)

# Train Logistic Regression
# C=5 gives slightly less regularisation — works well for text
# max_iter=1000 ensures convergence
model = LogisticRegression(max_iter=1000, C=5, random_state=42)
model.fit(X_tr, y_tr)

print("Model trained!")
```

---

### Step 6: Evaluate on Validation Set

```python
# Predict on validation set
val_predictions = model.predict(X_val)

# Overall accuracy
accuracy = accuracy_score(y_val, val_predictions)
print(f"Validation Accuracy: {accuracy:.4f} ({accuracy*100:.1f}%)")

# Per-cuisine breakdown
print("\nPer-cuisine performance:")
print(classification_report(y_val, val_predictions))
```

The `classification_report` shows **precision**, **recall**, and **F1-score** per cuisine:
- **Precision** — of all recipes predicted as "Italian", what % were actually Italian?
- **Recall** — of all actual Italian recipes, what % did we correctly identify?
- **F1** — harmonic mean of precision and recall (the balanced score)

> **Expected accuracy: ~78–82%** with this approach. That's strong for 20 classes!

---

### Step 7: Visualise the Confusion Matrix

```python
from sklearn.metrics import confusion_matrix
import seaborn as sns
import numpy as np

# Get the list of cuisines in sorted order
cuisines = sorted(y_train.unique())

# Compute confusion matrix
cm = confusion_matrix(y_val, val_predictions, labels=cuisines)

# Plot
plt.figure(figsize=(14, 12))
sns.heatmap(
    cm,
    annot=True,
    fmt='d',
    cmap='Greens',
    xticklabels=cuisines,
    yticklabels=cuisines
)
plt.title('Confusion Matrix — Cuisine Prediction')
plt.ylabel('Actual Cuisine')
plt.xlabel('Predicted Cuisine')
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
```

The confusion matrix shows where the model gets confused. You'll likely see:
- **British ↔ Irish** — very similar ingredient profiles
- **Chinese ↔ Japanese** — both use soy sauce, ginger, sesame
- **Spanish ↔ Mexican** — overlapping spices

This is expected — even humans sometimes confuse these cuisines!

---

### Step 8: Retrain on Full Training Data

Before generating predictions, retrain on **all** training data (not just 80%). More data = better model.

```python
# Retrain on the full training set
model.fit(X_train, y_train)
print("Retrained on full dataset")
```

---

### Step 9: Generate Predictions and Submission File

```python
# Predict cuisines for test recipes
test_predictions = model.predict(X_test)

# Create submission DataFrame
submission = pd.DataFrame({
    'id': test_df['id'],
    'cuisine': test_predictions
})

# Save to CSV
submission.to_csv('submission.csv', index=False)
print("Submission file saved!")
print(submission.head(10))
print(f"\nPrediction distribution:")
print(submission['cuisine'].value_counts())
```

---

### Step 10: Submit to Kaggle

1. Go to [kaggle.com/competitions/cook-sense-ai-challenge](https://www.kaggle.com/competitions/cook-sense-ai-challenge)
2. Click **"Submit Predictions"**
3. Upload your `submission.csv`
4. See your score on the leaderboard!

---

## Your Tasks in the Notebook

Fill in 4 blanks:

```python
# 1. Join ingredients into strings
train_df['ingredient_str'] = train_df['ingredients'].apply(___)

# 2. Fit and transform training data
X_train = vectorizer.___(X_train_raw)

# 3. Transform test data (no fitting!)
X_test = vectorizer.___(X_test_raw)

# 4. Train the model
___.fit(X_tr, y_tr)
```

---

## How to Improve Your Score

Once you have a baseline, try these improvements:

**Better text preprocessing:**
```python
# Remove numbers and special characters from ingredient names
import re
def clean_ingredients(ingredients):
    cleaned = [re.sub(r'[^a-zA-Z\s]', '', ing).lower().strip() for ing in ingredients]
    return ' '.join(cleaned)
```

**Try a different model:**
```python
from sklearn.svm import LinearSVC
# LinearSVC often outperforms Logistic Regression on text classification
model = LinearSVC(C=1.0, max_iter=2000)
```

**Ensemble — combine multiple models:**
```python
from sklearn.ensemble import VotingClassifier
# Combine predictions from multiple models for better accuracy
```

---

## Expected Results

| Metric | Target |
|---|---|
| Validation Accuracy | ≥ 78% |
| Top cuisines F1 | ≥ 0.85 |
| Kaggle leaderboard score | ≥ 0.75 |

---

## What You've Learned

By completing this lab you've practiced:

 **Loading JSON data** — a common real-world format  
 **Text feature extraction** — TF-IDF vectorisation  
 **Multi-class classification** — predicting one of 20 categories  
 **Data leakage prevention** — fit only on training data  
 **Model evaluation** — accuracy, classification report, confusion matrix  
 **Kaggle submission** — generating a properly formatted CSV  
 **NLP fundamentals** — treating ingredient lists as text documents  

> This is the kind of problem that appears in real data science interviews. Being able to say "I built a text classifier that predicts cuisine from ingredients with 80% accuracy and submitted to Kaggle" is a strong portfolio piece.
