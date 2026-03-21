---
title: "Image Loading Practice"
type: "practice"
resources:
  - title: "PyTorch: Torchvision Datasets"
    url: "https://pytorch.org/vision/stable/datasets.html"
---

# Image Loading Practice

## Practice: Loading and Examining Images

Load images and examine their properties as numerical arrays.

### Initial Code

```python
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import numpy as np

# Note: In a real environment, you would load actual image files
# For this practice, we'll simulate image data

# Simulate loading an image (normally: img = mpimg.imread('image.jpg'))
# RGB image: 100x100 pixels, 3 color channels
img = np.random.randint(0, 256, (100, 100, 3), dtype=np.uint8)

# 1. Check the image shape (height, width, channels)
image_shape = img.shape

# 2. Check the data type
image_dtype = img.dtype

# 3. Get the value range (min/max pixel values)
min_value = img.min()
max_value = img.max()

# 4. Extract individual color channels
red_channel = img[:, :, 0]    # Red channel
green_channel = img[:, :, 1]  # Green channel
blue_channel = img[:, :, 2]   # Blue channel

# 5. Convert to grayscale (average of RGB channels)
grayscale = np.mean(img, axis=2).astype(np.uint8)

# Don't change the code below - it's for testing
def check_image():
    return image_shape, str(image_dtype), min_value >= 0, max_value <= 255, grayscale.shape
```

### Hidden Tests

Test 1: Image shape has 3 dimensions (height, width, channels)
Test 2: Data type is uint8 (typical for images)
Test 3: Pixel values range from 0-255
Test 4: Grayscale has 2 dimensions

### Hints
- Image shape: (height, width, channels)
- RGB images have 3 channels
- Pixel values are 0-255 for uint8
- Grayscale: average RGB values