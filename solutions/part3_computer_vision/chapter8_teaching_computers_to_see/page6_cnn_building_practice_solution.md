# CNN Building Practice

## Practice: Building a Simple CNN

Create a convolutional neural network for classifying handwritten digits.

### Initial Code

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Load MNIST dataset (handwritten digits 0-9)
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# Preprocess data
X_train = X_train.astype('float32') / 255.0  # Normalize to 0-1
X_test = X_test.astype('float32') / 255.0

# Add channel dimension (grayscale images)
X_train = X_train.reshape(-1, 28, 28, 1)
X_test = X_test.reshape(-1, 28, 28, 1)

# Convert labels to one-hot encoding
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

# 1. Build the CNN model
model = keras.Sequential([
    # Convolutional layer: 32 filters, 3x3 kernel, ReLU activation
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    
    # Max pooling: 2x2 pool size
    layers.MaxPooling2D((2, 2)),
    
    # Another conv layer
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Another pooling
    layers.MaxPooling2D((2, 2)),
    
    # Flatten for dense layers
    layers.Flatten(),
    
    # Dense layer with dropout
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    
    # Output layer: 10 classes, softmax activation
    layers.Dense(10, activation='softmax')
])

# 2. Compile the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# 3. Train the model (just a few epochs for practice)
history = model.fit(X_train[:1000], y_train[:1000],  # Small subset for speed
                    epochs=3,
                    validation_data=(X_test[:200], y_test[:200]))

# 4. Evaluate on test set
test_loss, test_accuracy = model.evaluate(X_test[:500], y_test[:500], verbose=0)

# Don't change the code below - it's for testing
def check_cnn():
    return model.count_params() > 1000, test_accuracy > 0.5, len(history.history['accuracy']) == 3
```

### Hidden Tests

Test 1: Model has reasonable number of parameters (>1000)
Test 2: Achieves at least 50% test accuracy
Test 3: Training completed for 3 epochs

### Hints
- Use Conv2D for convolutional layers
- MaxPooling2D for downsampling
- Flatten before dense layers
- Dropout helps prevent overfitting
- Softmax for multi-class output

## Solution

Below is one possible correct implementation for the practice exercise.

```python
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import numpy as np

# Load MNIST dataset (handwritten digits 0-9)
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# Preprocess data
X_train = X_train.astype('float32') / 255.0  # Normalize to 0-1
X_test = X_test.astype('float32') / 255.0

# Add channel dimension (grayscale images)
X_train = X_train.reshape(-1, 28, 28, 1)
X_test = X_test.reshape(-1, 28, 28, 1)

# Convert labels to one-hot encoding
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)

# 1. Build the CNN model
model = keras.Sequential([
    # Convolutional layer: 32 filters, 3x3 kernel, ReLU activation
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    
    # Max pooling: 2x2 pool size
    layers.MaxPooling2D((2, 2)),
    
    # Another conv layer
    layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Another pooling
    layers.MaxPooling2D((2, 2)),
    
    # Flatten for dense layers
    layers.Flatten(),
    
    # Dense layer with dropout
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    
    # Output layer: 10 classes, softmax activation
    layers.Dense(10, activation='softmax')
])

# 2. Compile the model
model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# 3. Train the model (just a few epochs for practice)
history = model.fit(X_train[:1000], y_train[:1000],  # Small subset for speed
                    epochs=3,
                    validation_data=(X_test[:200], y_test[:200]))

# 4. Evaluate on test set
test_loss, test_accuracy = model.evaluate(X_test[:500], y_test[:500], verbose=0)

# Don't change the code below - it's for testing
def check_cnn():
    return model.count_params() > 1000, test_accuracy > 0.5, len(history.history['accuracy']) == 3
```
