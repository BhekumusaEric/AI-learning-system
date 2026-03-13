---
resources:
  - title: "Scikit-Learn: Supervised Learning"
    url: "https://scikit-learn.org/stable/supervised_learning.html"
  - title: "StatQuest: Machine Learning Index"
    url: "https://www.youtube.com/user/joshstarmer"
---

# Decision Trees: 20 Questions

## Making Decisions Like a Game of 20 Questions

Decision trees are machine learning models that make predictions by asking a series of yes/no questions, just like the game "20 Questions."

### How Decision Trees Work

Imagine you're trying to identify an animal by asking questions:

```
Is it bigger than a breadbox?
├── Yes → Is it a mammal?
│   ├── Yes → Does it have stripes?
│   │   ├── Yes → It's a tiger!
│   │   └── No → It's an elephant!
│   └── No → Does it fly?
│       ├── Yes → It's a bird!
│       └── No → It's a fish!
└── No → Is it fuzzy?
    ├── Yes → It's a caterpillar!
    └── No → It's a rock!
```

### Tree Structure

**Root Node:** The first question (top of the tree)
**Internal Nodes:** Questions that split the data
**Leaf Nodes:** Final predictions (bottom of the tree)
**Branches:** The yes/no paths between nodes

### Building a Decision Tree

The algorithm automatically chooses questions by:

1. **Finding the best split:** Which question best separates the data?
2. **Measuring impurity:** How mixed are the classes in each group?
3. **Greedy approach:** At each step, choose the question that reduces impurity most

### Common Splitting Criteria

**Gini Impurity:** Measures how "mixed" a group is
- Pure group (all same class): Gini = 0
- 50/50 split: Gini = 0.5
- Goal: Minimize total Gini impurity

**Entropy:** Similar to Gini, measures disorder
- More sensitive to class distributions
- Used in ID3, C4.5 algorithms

### Example: Email Classification

```
Does email contain "free money"?
├── Yes → SPAM
└── No → Does email contain "urgent"?
    ├── Yes → Does sender have verified badge?
    │   ├── Yes → NOT SPAM
    │   └── No → SPAM
    └── No → NOT SPAM
```

### Advantages of Decision Trees

**Easy to understand:** Visual and interpretable
**Handles mixed data:** Numbers and categories
**No feature scaling needed:** Robust to different scales
**Non-linear relationships:** Can capture complex patterns
**Feature selection:** Automatically identifies important features

### Disadvantages

**Overfitting:** Can become too complex and memorize training data
**Unstable:** Small data changes can create very different trees
**Biased toward features with more categories:** Prefers features with many possible values

### Preventing Overfitting

**Maximum depth:** Limit how deep the tree can grow
**Minimum samples per leaf:** Require a certain number of samples in each leaf
**Pruning:** Remove branches that don't improve performance

### Real-World Applications

**Medical diagnosis:** Does patient have symptom X? Y? Z?
**Credit scoring:** Income > $50K? Credit score > 700?
**Customer segmentation:** Age < 25? Income > $100K?
**Recommendation systems:** Watched action movies? Likes Marvel?

### Decision Trees vs Other Models

**vs Linear Regression:**
- Trees: Non-linear, categorical data, interpretable
- Linear: Linear relationships, numerical data, coefficients

**vs Neural Networks:**
- Trees: Interpretable, faster training, smaller datasets
- Neural nets: Complex patterns, less interpretable, need more data

### Ensemble Methods

Single decision trees can be weak, but combining many trees creates powerful models:

**Random Forest:** Many trees vote on the final prediction
**Gradient Boosting:** Trees learn from previous trees' mistakes
**XGBoost:** Optimized version of gradient boosting

### Key Concepts

- **Splitting:** Choosing questions to separate data
- **Impurity:** How mixed the classes are
- **Leaf nodes:** Final predictions
- **Depth:** How many questions deep
- **Pruning:** Removing unnecessary branches

### Remember

Decision trees turn complex decisions into simple yes/no questions. They're like a flowchart that the computer learns from data. While individual trees can overfit, they're the foundation for powerful ensemble methods like random forests.

Next, let's build your own decision tree!