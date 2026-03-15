---
title: "Practical Implementation"
type: "read"
---

# Section 2: Practical Implementation

## Coding Challenges & Algorithm Implementation

### Instructions
Complete all coding tasks in this section. Each task requires both working code and explanatory comments. Use the provided code cells or create new files as needed. Your code should be efficient, well-documented, and follow best practices.

---

## Task 1: Data Preprocessing Pipeline (25 points)

**Objective:** Create a complete data preprocessing pipeline for a machine learning dataset.

**Requirements:**
- Handle missing values appropriately
- Encode categorical variables
- Scale numerical features
- Handle outliers
- Create polynomial features
- Return processed data and preprocessing objects

**Dataset:** Use the provided customer churn dataset or create a similar synthetic dataset.

```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

def create_preprocessing_pipeline():
    """
    Create a comprehensive preprocessing pipeline
    
    Returns:
    - pipeline: sklearn Pipeline object
    - feature_names: list of final feature names
    """
    # TODO: Implement preprocessing pipeline
    pass

def preprocess_data(X, y, test_size=0.2):
    """
    Apply preprocessing pipeline to data
    
    Parameters:
    - X: feature matrix
    - y: target vector
    - test_size: proportion for test split
    
    Returns:
    - X_train_processed, X_test_processed, y_train, y_test
    - preprocessing_objects: dict with scaler, encoder, etc.
    """
    # TODO: Implement data preprocessing
    pass

# Test your implementation
# TODO: Create test data and verify pipeline works
```

---

## Task 2: Neural Network Implementation (30 points)

**Objective:** Implement a feedforward neural network from scratch using only NumPy.

**Requirements:**
- Implement forward propagation
- Implement backward propagation
- Support multiple layers and activation functions
- Include proper weight initialization
- Add L2 regularization
- Train on a simple dataset (XOR or similar)

```python
import numpy as np

class NeuralNetwork:
    def __init__(self, layer_sizes, activation='relu', learning_rate=0.01, l2_lambda=0.01):
        """
        Initialize neural network
        
        Parameters:
        - layer_sizes: list of layer sizes [input, hidden1, hidden2, ..., output]
        - activation: activation function ('relu', 'sigmoid', 'tanh')
        - learning_rate: learning rate for gradient descent
        - l2_lambda: L2 regularization parameter
        """
        # TODO: Initialize weights and biases
        pass
    
    def forward(self, X):
        """
        Forward propagation
        
        Parameters:
        - X: input data (batch_size, input_size)
        
        Returns:
        - output: network output
        - cache: intermediate values for backprop
        """
        # TODO: Implement forward propagation
        pass
    
    def backward(self, X, y, output, cache):
        """
        Backward propagation
        
        Parameters:
        - X: input data
        - y: true labels
        - output: network output
        - cache: intermediate values from forward pass
        
        Returns:
        - gradients: dictionary of gradients
        """
        # TODO: Implement backward propagation
        pass
    
    def train(self, X, y, epochs=1000, batch_size=32):
        """
        Train the neural network
        
        Parameters:
        - X: training data
        - y: training labels
        - epochs: number of training epochs
        - batch_size: batch size for mini-batch training
        """
        # TODO: Implement training loop
        pass
    
    def predict(self, X):
        """
        Make predictions
        
        Parameters:
        - X: input data
        
        Returns:
        - predictions: network predictions
        """
        # TODO: Implement prediction
        pass

# Test your implementation
# TODO: Create XOR dataset and train network
def create_xor_data(n_samples=1000):
    """Create XOR dataset for testing"""
    # TODO: Generate XOR data
    pass

# TODO: Train and test your neural network
```

---

## Task 3: K-Means Clustering Algorithm (20 points)

**Objective:** Implement the K-means clustering algorithm from scratch.

**Requirements:**
- Initialize centroids randomly
- Assign points to nearest centroid
- Update centroids as mean of assigned points
- Implement convergence checking
- Handle empty clusters
- Return cluster assignments and centroids

```python
import numpy as np
from sklearn.metrics import silhouette_score

class KMeans:
    def __init__(self, n_clusters=3, max_iter=100, tol=1e-4, random_state=None):
        """
        Initialize K-means clustering
        
        Parameters:
        - n_clusters: number of clusters
        - max_iter: maximum iterations
        - tol: tolerance for convergence
        - random_state: random seed
        """
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.random_state = random_state
        self.centroids = None
        self.labels_ = None
        
    def fit(self, X):
        """
        Fit K-means to data
        
        Parameters:
        - X: data matrix (n_samples, n_features)
        """
        # TODO: Implement K-means algorithm
        pass
    
    def predict(self, X):
        """
        Predict cluster labels for data
        
        Parameters:
        - X: data matrix
        
        Returns:
        - labels: cluster assignments
        """
        # TODO: Implement prediction
        pass
    
    def fit_predict(self, X):
        """
        Fit and predict in one step
        
        Parameters:
        - X: data matrix
        
        Returns:
        - labels: cluster assignments
        """
        self.fit(X)
        return self.labels_

# Test your implementation
# TODO: Create test data and verify clustering works
def create_test_data():
    """Create synthetic clustering data"""
    # TODO: Generate test data with clear clusters
    pass

# TODO: Test K-means and evaluate with silhouette score
```

---

## Task 4: Model Evaluation Framework (25 points)

**Objective:** Create a comprehensive model evaluation framework.

**Requirements:**
- Support classification and regression metrics
- Calculate confusion matrix and derived metrics
- Implement cross-validation scoring
- Create learning curves
- Generate classification reports
- Visualize results

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, classification_report
from sklearn.model_selection import cross_val_score, learning_curve

class ModelEvaluator:
    def __init__(self, model, task='classification'):
        """
        Initialize model evaluator
        
        Parameters:
        - model: trained model object
        - task: 'classification' or 'regression'
        """
        self.model = model
        self.task = task
    
    def evaluate_classification(self, X_test, y_test):
        """
        Evaluate classification model
        
        Parameters:
        - X_test: test features
        - y_test: test labels
        
        Returns:
        - metrics: dictionary of evaluation metrics
        """
        # TODO: Implement classification evaluation
        pass
    
    def evaluate_regression(self, X_test, y_test):
        """
        Evaluate regression model
        
        Parameters:
        - X_test: test features
        - y_test: test labels
        
        Returns:
        - metrics: dictionary of evaluation metrics
        """
        # TODO: Implement regression evaluation
        pass
    
    def cross_validate(self, X, y, cv=5):
        """
        Perform cross-validation
        
        Parameters:
        - X: features
        - y: labels
        - cv: number of folds
        
        Returns:
        - scores: cross-validation scores
        """
        # TODO: Implement cross-validation
        pass
    
    def plot_learning_curve(self, X, y, cv=5):
        """
        Plot learning curve
        
        Parameters:
        - X: features
        - y: labels
        - cv: number of folds
        """
        # TODO: Implement learning curve plotting
        pass
    
    def generate_report(self, X_test, y_test):
        """
        Generate comprehensive evaluation report
        
        Parameters:
        - X_test: test features
        - y_test: test labels
        
        Returns:
        - report: formatted evaluation report
        """
        # TODO: Generate detailed report
        pass

# Test your implementation
# TODO: Create test models and evaluate them
```

---

### Scoring Rubric

- **Functionality (40%)**: Code runs without errors and produces correct results
- **Implementation Quality (30%)**: Clean, efficient, and well-documented code
- **Best Practices (20%)**: Follows Python and ML best practices
- **Completeness (10%)**: All requirements implemented

### Time Limit: 90 minutes

Focus on getting working implementations first, then optimize. Include comments explaining your approach and any assumptions made.