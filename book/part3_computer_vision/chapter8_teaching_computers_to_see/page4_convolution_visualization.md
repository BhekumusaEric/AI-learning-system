---
resources:
  - title: "Stanford CS231n: Convolutional Neural Networks"
    url: "https://cs231n.github.io/"
  - title: "PyTorch Computer Vision Tutorial"
    url: "https://pytorch.org/tutorials/beginner/transfer_learning_tutorial.html"
---

# Convolution Visualization

## Practice: Applying Filters to Images

Apply different convolutional filters to see how they detect edges and patterns in images.

### Initial Code

```python
import numpy as np
import matplotlib.pyplot as plt

def apply_convolution(image, kernel):
    """Apply a convolution kernel to an image"""
    # Get dimensions
    image_height, image_width = image.shape
    kernel_height, kernel_width = kernel.shape
    
    # Calculate output dimensions
    output_height = image_height - kernel_height + 1
    output_width = image_width - kernel_width + 1
    
    # Initialize output
    output = np.zeros((output_height, output_width))
    
    # Apply convolution
    for i in range(output_height):
        for j in range(output_width):
            # Extract region of interest
            region = image[i:i+kernel_height, j:j+kernel_width]
            # Element-wise multiplication and sum
            output[i, j] = np.sum(region * kernel)
    
    return output

# Create a simple test image (gradient)
image = np.zeros((10, 10))
for i in range(10):
    image[i, :] = i * 25  # Vertical gradient

# Define convolution kernels
# Horizontal edge detection
horizontal_edge = np.array([[-1, -1, -1],
                           [ 0,  0,  0],
                           [ 1,  1,  1]])

# Vertical edge detection
vertical_edge = np.array([[-1,  0,  1],
                         [-1,  0,  1],
                         [-1,  0,  1]])

# Sharpening filter
sharpen = np.array([[ 0, -1,  0],
                   [-1,  5, -1],
                   [ 0, -1,  0]])

# 1. Apply horizontal edge detection
horizontal_result = apply_convolution(image, horizontal_edge)

# 2. Apply vertical edge detection
vertical_result = apply_convolution(image, vertical_edge)

# 3. Apply sharpening filter
sharpen_result = apply_convolution(image, sharpen)

# 4. Check output shapes
shapes_match = (horizontal_result.shape == vertical_result.shape == sharpen_result.shape)

# Don't change the code below - it's for testing
def check_convolution():
    return horizontal_result.shape[0] < image.shape[0], vertical_result.shape[1] < image.shape[1], shapes_match
```

### Hidden Tests

Test 1: Convolution reduces image dimensions
Test 2: Output width is smaller than input
Test 3: All outputs have same shape

### Hints
- Convolution slides kernel over image
- Output size = input_size - kernel_size + 1
- Element-wise multiply region with kernel, then sum
- Different kernels detect different patterns