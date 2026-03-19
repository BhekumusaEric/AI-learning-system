---
title: "Transfer Learning Practice"
type: "read"
resources:
  - title: "PyTorch: Transfer Learning Tutorial"
    url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"
---

# Transfer Learning Practice

## Practice: Fine-Tune a Pre-trained Model

Use a pre-trained model and adapt it to a new task with a small dataset.

### Initial Code

```python
import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.utils import to_categorical

# Load CIFAR-10 (10 classes, 32x32 color images)
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Normalize and one-hot encode
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# Load MobileNetV2 without top layers
base_model = MobileNetV2(input_shape=(32, 32, 3), include_top=False, weights='imagenet')
base_model.trainable = False  # Freeze base

# Add a new classification head
x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(128, activation='relu')(x)
x = layers.Dropout(0.5)(x)
outputs = layers.Dense(10, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=outputs)

# Compile model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train on CIFAR-10 (small subset for speed)
model.fit(x_train[:1000], y_train[:1000], epochs=3, batch_size=32, validation_split=0.2)

# Evaluate on test data
loss, accuracy = model.evaluate(x_test[:500], y_test[:500], verbose=0)

# Don't change the code below - it's for testing
def check_transfer_learning():
    return accuracy > 0.3, loss > 0, len(model.layers) > 0
```

### Hidden Tests

Test 1: Model achieves at least 30% accuracy on test subset
Test 2: Loss is a positive number
Test 3: Model has layers (not empty)

### Hints
- Freeze base model weights to prevent large updates
- Add a small dense classifier on top
- Train on a small subset for quick results
- Use dropout to reduce overfitting