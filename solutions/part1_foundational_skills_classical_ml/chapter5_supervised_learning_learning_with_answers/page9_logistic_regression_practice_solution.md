# Logistic Regression Practice

## Practice: Spam Email Classification

Use logistic regression to classify emails as spam or not spam based on features.

### Initial Code

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

# Sample email features: [contains_free, contains_winner, contains_urgent, num_exclamation_marks]
# Labels: 1 = spam, 0 = not spam
X = np.array([
    [1, 0, 1, 3],  # Spam: "FREE!!! URGENT WINNER!"
    [0, 0, 0, 0],  # Not spam: "Meeting tomorrow"
    [1, 1, 0, 2],  # Spam: "You WON! FREE prize!"
    [0, 0, 1, 1],  # Not spam: "Urgent: Project deadline"
    [1, 0, 0, 5],  # Spam: "FREE!!!!!"
    [0, 0, 0, 1],  # Not spam: "Hello!"
    [0, 1, 1, 4],  # Spam: "WINNER! URGENT!!!!"
    [0, 0, 0, 0]   # Not spam: "Thanks for your help"
])

y = np.array([1, 0, 1, 0, 1, 0, 1, 0])

# 1. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# 2. Create and train logistic regression model
model = LogisticRegression()
model.fit(X_train, y_train)

# 3. Make predictions on test set
predictions = model.predict(X_test)

# 4. Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

# 5. Get probability predictions for test set
probabilities = model.predict_proba(X_test)

# Don't change the code below - it's for testing
def check_logistic():
    return accuracy >= 0.5, probabilities.shape[1] == 2, len(predictions) == len(y_test)
```

### Hidden Tests

Test 1: Model achieves at least 50% accuracy
Test 2: Probabilities have 2 columns (spam/not spam)
Test 3: Number of predictions matches test set size

### Hints
- Use LogisticRegression() from sklearn
- predict_proba() gives probabilities for both classes
- predict() gives class predictions (0 or 1)

## Solution

Below is one possible correct implementation for the practice exercise.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np

# Sample email features: [contains_free, contains_winner, contains_urgent, num_exclamation_marks]
# Labels: 1 = spam, 0 = not spam
X = np.array([
    [1, 0, 1, 3],  # Spam: "FREE!!! URGENT WINNER!"
    [0, 0, 0, 0],  # Not spam: "Meeting tomorrow"
    [1, 1, 0, 2],  # Spam: "You WON! FREE prize!"
    [0, 0, 1, 1],  # Not spam: "Urgent: Project deadline"
    [1, 0, 0, 5],  # Spam: "FREE!!!!!"
    [0, 0, 0, 1],  # Not spam: "Hello!"
    [0, 1, 1, 4],  # Spam: "WINNER! URGENT!!!!"
    [0, 0, 0, 0]   # Not spam: "Thanks for your help"
])

y = np.array([1, 0, 1, 0, 1, 0, 1, 0])

# 1. Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

# 2. Create and train logistic regression model
model = LogisticRegression()
model.fit(X_train, y_train)

# 3. Make predictions on test set
predictions = model.predict(X_test)

# 4. Calculate accuracy
accuracy = accuracy_score(y_test, predictions)

# 5. Get probability predictions for test set
probabilities = model.predict_proba(X_test)

# Don't change the code below - it's for testing
def check_logistic():
    return accuracy >= 0.5, probabilities.shape[1] == 2, len(predictions) == len(y_test)
```
