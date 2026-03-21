---
title: "Data Loading and Preprocessing"
type: "practice"
---

# Data Loading and Preprocessing

## Step 1: Loading Fashion-MNIST and Preparing Image Data

In this first step, we'll load the Fashion-MNIST dataset and prepare it for training our CNN. Proper data preprocessing is crucial for deep learning models to learn effectively from image data.

### Learning Objectives
- Load the Fashion-MNIST dataset
- Understand image data structure
- Normalize pixel values
- Reshape data for CNN input
- Create training/validation/test splits
- Visualize sample images

### Code Walkthrough

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
import pandas as pd

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Set style for plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("TensorFlow version:", tf.__version__)
print("Keras version:", keras.__version__)

# 1. Load the Fashion-MNIST dataset
print("\n" + "="*50)
print("LOADING FASHION-MNIST DATASET")
print("="*50)

# Fashion-MNIST class names
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat',
               'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot']

# Load the dataset
(X_train_full, y_train_full), (X_test, y_test) = keras.datasets.fashion_mnist.load_data()

print(f"Training data shape: {X_train_full.shape}")
print(f"Training labels shape: {y_train_full.shape}")
print(f"Test data shape: {X_test.shape}")
print(f"Test labels shape: {y_test.shape}")

# 2. Understand the data structure
print("\n" + "="*50)
print("DATA STRUCTURE ANALYSIS")
print("="*50)

print(f"Image dimensions: {X_train_full.shape[1:]} pixels")
print(f"Number of classes: {len(class_names)}")
print(f"Training samples per class: {np.bincount(y_train_full)}")
print(f"Test samples per class: {np.bincount(y_test)}")

# Check data types
print(f"Data type: {X_train_full.dtype}")
print(f"Label type: {y_train_full.dtype}")
print(f"Pixel value range: {X_train_full.min()} - {X_train_full.max()}")

# 3. Visualize sample images
print("\n" + "="*50)
print("SAMPLE IMAGE VISUALIZATION")
print("="*50)

def plot_sample_images(X, y, class_names, n_samples=5):
    """Plot sample images from each class"""
    fig, axes = plt.subplots(2, 5, figsize=(15, 6))
    fig.suptitle('Sample Images from Each Fashion Category', fontsize=16)
    
    for class_idx in range(len(class_names)):
        # Find indices of this class
        class_indices = np.where(y == class_idx)[0]
        # Select random samples
        selected_indices = np.random.choice(class_indices, n_samples, replace=False)
        
        for i, idx in enumerate(selected_indices[:5]):  # Show first 5
            row = class_idx // 5
            col = (class_idx % 5) * 5 + i
            
            if row < 2 and col < 5:
                axes[row, col].imshow(X[idx], cmap='gray')
                axes[row, col].axis('off')
                if i == 0:
                    axes[row, col].set_title(f'{class_names[class_idx]}', fontsize=12)
    
    plt.tight_layout()
    plt.show()

# Plot sample images
plot_sample_images(X_train_full, y_train_full, class_names)

# 4. Data preprocessing
print("\n" + "="*50)
print("DATA PREPROCESSING")
print("="*50)

# Normalize pixel values to [0, 1]
X_train_full = X_train_full.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

print("After normalization:")
print(f"Training data range: {X_train_full.min():.3f} - {X_train_full.max():.3f}")
print(f"Test data range: {X_test.min():.3f} - {X_test.max():.3f}")

# Reshape for CNN input (add channel dimension)
X_train_full = X_train_full.reshape(-1, 28, 28, 1)
X_test = X_test.reshape(-1, 28, 28, 1)

print(f"Reshaped training data: {X_train_full.shape}")
print(f"Reshaped test data: {X_test.shape}")

# 5. Create validation set
print("\n" + "="*50)
print("CREATING VALIDATION SET")
print("="*50)

# Split training data into train and validation
X_train, X_val, y_train, y_val = train_test_split(
    X_train_full, y_train_full, 
    test_size=0.1,  # 10% for validation
    random_state=42,
    stratify=y_train_full  # Maintain class distribution
)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Validation set: {X_val.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")

# Verify class distribution
print("\nClass distribution:")
print("Training set:")
for i, count in enumerate(np.bincount(y_train)):
    print(f"  {class_names[i]}: {count}")
    
print("Validation set:")
for i, count in enumerate(np.bincount(y_val)):
    print(f"  {class_names[i]}: {count}")

print("Test set:")
for i, count in enumerate(np.bincount(y_test)):
    print(f"  {class_names[i]}: {count}")

# 6. Data augmentation setup (preview)
print("\n" + "="*50)
print("DATA AUGMENTATION PREVIEW")
print("="*50)

# Create data augmentation layers
data_augmentation = keras.Sequential([
    keras.layers.RandomFlip("horizontal"),
    keras.layers.RandomRotation(0.1),
    keras.layers.RandomZoom(0.1),
])

# Show example of augmented images
sample_image = X_train[0:1]  # Take first image, keep batch dimension

plt.figure(figsize=(12, 4))

# Original image
plt.subplot(1, 4, 1)
plt.imshow(sample_image[0, :, :, 0], cmap='gray')
plt.title('Original')
plt.axis('off')

# Show 3 augmented versions
for i in range(3):
    augmented = data_augmentation(sample_image, training=True)
    plt.subplot(1, 4, i + 2)
    plt.imshow(augmented[0, :, :, 0], cmap='gray')
    plt.title(f'Augmented {i+1}')
    plt.axis('off')

plt.tight_layout()
plt.show()

# 7. Create TensorFlow datasets for efficient training
print("\n" + "="*50)
print("CREATING TENSORFLOW DATASETS")
print("="*50)

# Create datasets
batch_size = 32

train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train))
train_dataset = train_dataset.shuffle(buffer_size=10000).batch(batch_size).prefetch(tf.data.AUTOTUNE)

val_dataset = tf.data.Dataset.from_tensor_slices((X_val, y_val))
val_dataset = val_dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)

test_dataset = tf.data.Dataset.from_tensor_slices((X_test, y_test))
test_dataset = test_dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)

print("Datasets created successfully!")
print(f"Training batches: {len(train_dataset)}")
print(f"Validation batches: {len(val_dataset)}")
print(f"Test batches: {len(test_dataset)}")

# 8. Final data summary
print("\n" + "="*50)
print("FINAL DATA SUMMARY")
print("="*50)

print("Data shapes:")
print(f"  X_train: {X_train.shape}")
print(f"  y_train: {y_train.shape}")
print(f"  X_val: {X_val.shape}")
print(f"  y_val: {y_val.shape}")
print(f"  X_test: {X_test.shape}")
print(f"  y_test: {y_test.shape}")

print(f"\nData types:")
print(f"  Features: {X_train.dtype}")
print(f"  Labels: {y_train.dtype}")

print(f"\nValue ranges:")
print(f"  Pixel values: [{X_train.min():.3f}, {X_train.max():.3f}]")
print(f"  Labels: [{y_train.min()}, {y_train.max()}]")

print("\nData preprocessing complete!")
```

### Key Concepts Covered

**Image Data Handling:**
- Loading datasets with Keras
- Understanding image dimensions and channels
- Converting data types for neural networks

**Data Normalization:**
- Scaling pixel values to [0,1] range
- Importance of normalization for gradient descent
- Maintaining consistent data ranges

**Data Splitting:**
- Creating train/validation/test splits
- Stratified splitting for balanced classes
- Proper data partitioning for model evaluation

**TensorFlow Datasets:**
- Efficient data pipelines with tf.data
- Batching and prefetching for performance
- Dataset shuffling for better training

### Important Technical Details

**Image Format:**
- Grayscale images: (28, 28, 1)
- Pixel values: 0-255 originally, 0.0-1.0 after normalization
- Single channel (grayscale) vs RGB images

**Data Pipeline:**
- Shuffling prevents order-dependent learning
- Batching improves GPU utilization
- Prefetching overlaps data loading with training

**Memory Considerations:**
- Fashion-MNIST is small ( manageable on most systems)
- Larger datasets require different loading strategies
- GPU memory affects batch size selection

### Best Practices

- Always normalize image data
- Use stratified splits for classification
- Create validation sets for hyperparameter tuning
- Use tf.data for efficient data loading
- Set random seeds for reproducibility

### Practice Exercise

1. Load a different dataset (like MNIST digits)
2. Experiment with different normalization techniques
3. Create additional data splits (e.g., 60/20/20)
4. Visualize more sample images and their distributions

### Next Steps

With our data properly preprocessed, we're ready to build the CNN architecture. In the next step, we'll design convolutional layers, pooling, and the complete network structure.

### Key Takeaways

- Image data requires specific preprocessing steps
- Normalization is crucial for neural network training
- Proper data splitting ensures reliable model evaluation
- TensorFlow datasets provide efficient data pipelines
- Visualization helps understand data characteristics