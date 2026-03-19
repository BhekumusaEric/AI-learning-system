---
title: "Images as Numbers"
type: "read"
resources:
  - title: "Stanford CS231n: Image Classification"
    url: "https://cs231n.github.io/classification/"
---

# Images as Numbers

## Digital Image Representation

Computers see images as grids of numbers. Each pixel is a number representing color intensity.

### How Images Work

A digital image is a 2D grid of pixels:
- **Width**: Number of pixels across
- **Height**: Number of pixels down
- **Channels**: Color information (1 for grayscale, 3 for RGB)

### Grayscale Images

A 4x4 grayscale image:
```
[[  0,  50, 100, 150],
 [ 50, 100, 150, 200],
 [100, 150, 200, 255],
 [150, 200, 255, 255]]
```

- 0 = Black
- 255 = White
- Values in between = Shades of gray

### Color Images (RGB)

A color pixel has 3 values: [Red, Green, Blue]
```
[255, 0, 0] = Pure Red
[0, 255, 0] = Pure Green
[0, 0, 255] = Pure Blue
[255, 255, 255] = White
[0, 0, 0] = Black
[255, 255, 0] = Yellow
```

### Image Shapes in NumPy

```python
import numpy as np

# Grayscale: (height, width)
gray_image = np.zeros((100, 200))  # 100x200 grayscale

# Color: (height, width, channels)
color_image = np.zeros((100, 200, 3))  # 100x200 RGB
```

### Loading Images

```python
from matplotlib import image
import matplotlib.pyplot as plt

# Load image as array
img = image.imread('photo.jpg')
print(img.shape)  # (height, width, 3) for RGB

# Display image
plt.imshow(img)
plt.show()
```

### Remember
- Images are numerical arrays
- Pixel values range from 0-255
- Shape: (height, width, channels)
- Computers process images as data, just like numbers

Next, practice loading and examining images!