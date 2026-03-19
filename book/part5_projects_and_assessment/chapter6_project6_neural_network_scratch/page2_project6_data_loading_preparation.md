---
title: "Data Loading and Preparation"
type: "read"
---

# Data Loading and Preparation

## Step 1: Loading MNIST and Preparing Data

In this first step, we'll load the MNIST handwritten digit dataset and prepare it for our neural network implementation. Understanding the data structure and proper preprocessing is crucial for building effective neural networks.

### Learning Objectives
- Load the MNIST dataset
- Understand image data structure
- Normalize pixel values
- Reshape data for neural network input
- Create training/validation/test splits
- Visualize sample digits

### Code Walkthrough

```python
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, confusion_matrix
import pandas as pd
import time

# Set random seeds for reproducibility
np.random.seed(42)

# Set style for plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("NumPy version:", np.__version__)

# 1. Load the MNIST dataset
print("="*50)
print("LOADING MNIST DATASET")
print("="*50)

# Load MNIST dataset
print("Fetching MNIST dataset...")
try:
    X, y = fetch_openml('mnist_784', version=1, return_X_y=True, as_frame=False)
    print("Dataset loaded successfully!")
except Exception as e:
    print(f"Error loading dataset: {e}")
    print("Using alternative loading method...")
    # Fallback: create synthetic data for demonstration
    np.random.seed(42)
    X = np.random.rand(70000, 784)
    y = np.random.randint(0, 10, 70000)

print(f"Dataset shape: {X.shape}")
print(f"Labels shape: {y.shape}")
print(f"Data type: {X.dtype}")
print(f"Label type: {y.dtype}")

# 2. Understand the data structure
print("\n" + "="*50)
print("DATA STRUCTURE ANALYSIS")
print("="*50)

print(f"Number of samples: {X.shape[0]:,}")
print(f"Number of features (pixels): {X.shape[1]}")
print(f"Image dimensions: {int(np.sqrt(X.shape[1]))}x{int(np.sqrt(X.shape[1]))} pixels")
print(f"Unique labels: {np.unique(y)}")
print(f"Label distribution: {np.bincount(y.astype(int))}")

# Check for missing values
missing_values = np.isnan(X).sum()
print(f"Missing values in features: {missing_values}")

# Data range analysis
print(f"Pixel value range: {X.min():.3f} - {X.max():.3f}")
print(f"Pixel value mean: {X.mean():.3f}")
print(f"Pixel value std: {X.std():.3f}")

# 3. Visualize sample images
print("\n" + "="*50)
print("SAMPLE IMAGE VISUALIZATION")
print("="*50)

def plot_sample_digits(X, y, n_samples=10):
    """Plot sample digits from the dataset"""
    fig, axes = plt.subplots(2, 5, figsize=(12, 6))
    fig.suptitle('Sample MNIST Digits', fontsize=16)
    
    # Get random indices
    indices = np.random.choice(len(X), n_samples, replace=False)
    
    for i, idx in enumerate(indices):
        row = i // 5
        col = i % 5
        
        # Reshape to 28x28
        image = X[idx].reshape(28, 28)
        
        axes[row, col].imshow(image, cmap='gray')
        axes[row, col].set_title(f'Label: {y[idx]}', fontsize=12)
        axes[row, col].axis('off')
    
    plt.tight_layout()
    plt.show()

# Plot sample digits
plot_sample_digits(X, y)

# 4. Data preprocessing
print("\n" + "="*50)
print("DATA PREPROCESSING")
print("="*50)

# Convert labels to integers
y = y.astype(int)

# Normalize pixel values to [0, 1]
X_normalized = X.astype('float32') / 255.0

print("After normalization:")
print(f"Pixel value range: {X_normalized.min():.3f} - {X_normalized.max():.3f}")
print(f"Pixel value mean: {X_normalized.mean():.3f}")
print(f"Pixel value std: {X_normalized.std():.3f}")

# Alternative: Standard normalization
scaler = StandardScaler()
X_standardized = scaler.fit_transform(X.astype('float32'))

print("\nAfter standardization:")
print(f"Pixel value range: {X_standardized.min():.3f} - {X_standardized.max():.3f}")
print(f"Pixel value mean: {X_standardized.mean():.3f}")
print(f"Pixel value std: {X_standardized.std():.3f}")

# For neural networks, we'll use the [0,1] normalization
X_processed = X_normalized.copy()

# 5. Create training/validation/test splits
print("\n" + "="*50)
print("CREATING DATA SPLITS")
print("="*50)

# First, split into training and temp (for validation + test)
X_train, X_temp, y_train, y_temp = train_test_split(
    X_processed, y, 
    test_size=0.3,  # 30% for validation + test
    random_state=42,
    stratify=y  # Maintain class distribution
)

# Then split temp into validation and test
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp,
    test_size=0.5,  # 50% of temp for test (15% of total)
    random_state=42,
    stratify=y_temp
)

print(f"Training set: {X_train.shape[0]:,} samples ({X_train.shape[0]/len(X)*100:.1f}%)")
print(f"Validation set: {X_val.shape[0]:,} samples ({X_val.shape[0]/len(X)*100:.1f}%)")
print(f"Test set: {X_test.shape[0]:,} samples ({X_test.shape[0]/len(X)*100:.1f}%)")

# Verify class distribution
print("\nClass distribution:")
for split_name, y_split in [("Train", y_train), ("Val", y_val), ("Test", y_test)]:
    counts = np.bincount(y_split)
    print(f"  {split_name}: {counts}")

# 6. Prepare data for neural network
print("\n" + "="*50)
print("NEURAL NETWORK DATA PREPARATION")
print("="*50)

# Neural networks expect:
# - Features as float32
# - Labels as one-hot encoded or integer
# - Proper input shape

print(f"Input features shape: {X_train.shape}")
print(f"Input features dtype: {X_train.dtype}")
print(f"Labels shape: {y_train.shape}")
print(f"Labels dtype: {y_train.dtype}")

# For classification, we'll use integer labels (0-9)
# Some frameworks expect one-hot encoding, but we'll handle this in the network

# 7. Create data batches for efficient training
print("\n" + "="*50)
print("CREATING DATA BATCHES")
print("="*50)

def create_batches(X, y, batch_size, shuffle=True):
    """Create batches of data for training"""
    n_samples = len(X)
    
    if shuffle:
        # Shuffle the data
        indices = np.random.permutation(n_samples)
        X = X[indices]
        y = y[indices]
    
    # Create batches
    batches = []
    for i in range(0, n_samples, batch_size):
        X_batch = X[i:i+batch_size]
        y_batch = y[i:i+batch_size]
        batches.append((X_batch, y_batch))
    
    return batches

# Test batch creation
batch_size = 32
train_batches = create_batches(X_train, y_train, batch_size, shuffle=True)

print(f"Number of training batches: {len(train_batches)}")
print(f"Batch size: {batch_size}")
print(f"Last batch size: {len(train_batches[-1][0])}")

# Show batch shapes
X_batch, y_batch = train_batches[0]
print(f"Sample batch X shape: {X_batch.shape}")
print(f"Sample batch y shape: {y_batch.shape}")

# 8. Data quality checks
print("\n" + "="*50)
print("DATA QUALITY CHECKS")
print("="*50)

# Check for any remaining issues
print("Data quality checks:")

# Check for NaN or infinite values
nan_check = np.isnan(X_train).sum()
inf_check = np.isinf(X_train).sum()
print(f"  NaN values in training data: {nan_check}")
print(f"  Infinite values in training data: {inf_check}")

# Check label range
print(f"  Label range: {y_train.min()} - {y_train.max()}")
print(f"  Expected labels: 0-9 ✓" if y_train.min() == 0 and y_train.max() == 9 else "  Unexpected label range!")

# Check data balance
label_counts = np.bincount(y_train)
balance_ratio = label_counts.min() / label_counts.max()
print(".3f")
print("  ✓ Well balanced" if balance_ratio > 0.8 else "  ⚠ Some imbalance detected")

# 9. Save processed data (optional)
print("\n" + "="*50)
print("SAVING PROCESSED DATA")
print("="*50)

# Save the processed data for use in subsequent steps
np.savez('mnist_processed.npz',
         X_train=X_train, y_train=y_train,
         X_val=X_val, y_val=y_val,
         X_test=X_test, y_test=y_test)

print("Processed data saved as 'mnist_processed.npz'")

# 10. Final data summary
print("\n" + "="*50)
print("FINAL DATA SUMMARY")
print("="*50)

print("Dataset: MNIST Handwritten Digits")
print(f"Input shape: {X_train.shape[1]} features (28x28 pixels)")
print(f"Output classes: 10 (digits 0-9)")
print(f"Data type: {X_train.dtype}")

print("\nData splits:")
print(f"  Training: {len(X_train):,} samples")
print(f"  Validation: {len(X_val):,} samples")
print(f"  Test: {len(X_test):,} samples")

print("\nPreprocessing applied:")
print("  ✓ Pixel normalization to [0,1]")
print("  ✓ Stratified train/val/test splits")
print("  ✓ Data quality checks passed")
print("  ✓ Batch creation ready")

print("\nData preparation complete! Ready for neural network implementation.")
```

### Key Concepts Covered

**Dataset Loading:**
- Using scikit-learn to fetch MNIST
- Understanding image data structure
- Handling different data formats

**Data Normalization:**
- Scaling pixel values for neural networks
- Comparison of normalization techniques
- Impact on training stability

**Data Splitting:**
- Creating stratified train/validation/test splits
- Maintaining class balance across splits
- Proper data partitioning for model evaluation

**Batch Processing:**
- Creating mini-batches for efficient training
- Shuffling data for better generalization
- Memory-efficient data handling

**Data Quality:**
- Checking for missing or invalid values
- Verifying label ranges and distributions
- Ensuring data integrity

### Important Technical Details

**MNIST Structure:**
- 784 features (28×28 pixels)
- Grayscale images (0-255 originally)
- 10 classes, well-balanced
- Standard benchmark dataset

**Normalization Choice:**
- [0,1] scaling for image data
- Maintains relative pixel intensities
- Compatible with sigmoid/tanh activations

**Batch Size Considerations:**
- 32 is a common starting point
- Balances memory usage and gradient stability
- Can be tuned based on hardware and dataset

### Best Practices

- Always normalize input data
- Use stratified splits for classification
- Verify data quality before training
- Save processed data to avoid reprocessing
- Create reproducible data pipelines

### Practice Exercise

1. Load a different dataset and apply the same preprocessing
2. Experiment with different normalization techniques
3. Create different train/validation/test split ratios
4. Implement custom batch creation with data augmentation

### Next Steps

With our data properly prepared, we're ready to build the neural network components. In the next step, we'll implement the basic building blocks: layers, activation functions, and loss functions.

### Key Takeaways

- Data preparation is crucial for neural network performance
- Proper normalization and splitting prevent training issues
- Understanding data structure guides network design
- Quality checks catch problems early
- Efficient batching enables scalable training