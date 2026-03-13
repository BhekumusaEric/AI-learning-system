---
title: "Scikit-Learn: Supervised Learning"
type: "read"
resources:
  - title: "StatQuest: Decision Trees"
    url: "https://www.youtube.com/watch?v=7VeUPuVNf6I"
---

# Decision Tree Practice

## Build Your Own Decision Tree Classifier

Now let's practice building and using decision trees with scikit-learn.

### Task: Classify Animals

You'll build a decision tree to classify animals into categories based on their characteristics.

### The Dataset

We'll use a simple animal classification dataset with these features:
- **weight_kg:** Animal weight in kilograms
- **height_cm:** Animal height in centimeters  
- **has_fur:** True/False - does the animal have fur?
- **can_fly:** True/False - can the animal fly?
- **lays_eggs:** True/False - does the animal lay eggs?

The target classes are:
- **mammal:** Warm-blooded, fur, live birth
- **bird:** Warm-blooded, feathers, lays eggs, can fly
- **reptile:** Cold-blooded, scales, lays eggs
- **fish:** Cold-blooded, scales, lives in water, lays eggs

### Code Template

```python
import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Sample animal data
# Features: [weight_kg, height_cm, has_fur, can_fly, lays_eggs]
X = np.array([
    [5, 30, 1, 0, 0],      # Cat: 5kg, 30cm, has fur, can't fly, no eggs
    [80, 170, 1, 0, 0],    # Human: 80kg, 170cm, has fur, can't fly, no eggs
    [0.1, 10, 1, 1, 1],    # Hummingbird: 0.1kg, 10cm, has fur-like feathers, can fly, lays eggs
    [2, 25, 0, 1, 1],      # Parrot: 2kg, 25cm, no fur, can fly, lays eggs
    [200, 300, 0, 0, 1],   # Crocodile: 200kg, 300cm, no fur, can't fly, lays eggs
    [0.5, 15, 0, 0, 1],    # Snake: 0.5kg, 15cm, no fur, can't fly, lays eggs
    [1000, 400, 0, 0, 1],  # Turtle: 1000kg, 400cm, no fur, can't fly, lays eggs
    [1.5, 20, 0, 0, 1],    # Goldfish: 1.5kg, 20cm, no fur, can't fly, lays eggs
])

# Labels: 0=mammal, 1=bird, 2=reptile, 3=fish
y = np.array([0, 0, 1, 1, 2, 2, 2, 3])

# Split the data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Create and train the decision tree
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)

# Make predictions
y_pred = clf.predict(X_test)

# Calculate accuracy
accuracy = accuracy_score(y_test, y_pred)
print(f"Decision Tree Accuracy: {accuracy * 100:.1f}%")

# Test on new animals
new_animals = np.array([
    [4, 25, 1, 0, 0],      # Dog: should be mammal (0)
    [0.05, 8, 1, 1, 1],    # Bee hummingbird: should be bird (1)
    [50, 200, 0, 0, 1],    # Iguana: should be reptile (2)
    [0.8, 12, 0, 0, 1],    # Betta fish: should be fish (3)
])

new_predictions = clf.predict(new_animals)
animal_names = ['Mammal', 'Bird', 'Reptile', 'Fish']

print("\nPredictions for new animals:")
for i, pred in enumerate(new_predictions):
    print(f"Animal {i+1}: Predicted as {animal_names[pred]}")

# Don't change the code below - it's for testing

def check_decision_tree():
    # Expect the new animals to be classified as [mammal, bird, reptile, fish]
    expected = [0, 1, 2, 3]
    return (
        isinstance(accuracy, float)
        and len(new_predictions) == 4
        and list(new_predictions) == expected
    )
```

### Expected Output

When you run this code, you should see:
- Accuracy around 75-100% (depending on the random split)
- Correct classifications for the new animals

### Experiment with Parameters

Try changing the `max_depth` parameter:
- `max_depth=1`: Very simple tree, might underfit
- `max_depth=None`: Full depth, might overfit
- `max_depth=3`: Balanced complexity

### Visualizing the Tree

Add this code to visualize your decision tree:

```python
from sklearn.tree import plot_tree
import matplotlib.pyplot as plt

# Plot the decision tree
plt.figure(figsize=(20,10))
feature_names = ['weight_kg', 'height_cm', 'has_fur', 'can_fly', 'lays_eggs']
class_names = ['mammal', 'bird', 'reptile', 'fish']

plot_tree(clf, 
          feature_names=feature_names,
          class_names=class_names,
          filled=True,
          rounded=True)

plt.show()
```

### Understanding the Tree

Look at the visualization to see:
- Which features the tree chose first (most important)
- How the tree splits the data
- The decision boundaries for each class

### Common Issues and Solutions

**Overfitting:** Tree too deep, memorizes training data
- Solution: Reduce `max_depth`, increase `min_samples_leaf`

**Underfitting:** Tree too simple, poor performance
- Solution: Increase `max_depth`, allow more complexity

**Unbalanced data:** Some classes have more examples
- Solution: Use `class_weight='balanced'`

### Real-World Tips

- **Feature scaling:** Decision trees don't need it (unlike some other models)
- **Missing values:** Can handle them with `fillna()` or imputation
- **Categorical features:** Convert to numbers (0/1 for binary, one-hot encoding for multiple categories)
- **Feature importance:** Check `clf.feature_importances_` to see which features matter most

### Challenge: Improve the Model

Try to improve the accuracy by:
1. Adding more training examples
2. Adjusting the tree parameters
3. Adding more features (like `lives_in_water`, `has_scales`, etc.)

Decision trees are powerful because they're interpretable - you can understand exactly why they make each prediction!