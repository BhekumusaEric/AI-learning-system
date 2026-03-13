---
title: "NumPy Quickstart Guide"
type: "read"
resources:
  - title: "NumPy: Changing the shape of an array"
    url: "https://numpy.org/doc/stable/user/quickstart.html#changing-the-shape-of-an-array"
---

# Shape Practice

## Practice: Array Shapes

Create arrays with specific shapes and check their dimensions.

### Initial Code

```python
import numpy as np

# 1. Create a 1D array with 5 elements: [1, 2, 3, 4, 5]
array_1d = 

# 2. Create a 2D array (2 rows, 3 columns) with numbers 1-6
array_2d = 

# 3. Check the shape of array_1d
shape_1d = 

# 4. Check the shape of array_2d
shape_2d = 

# Don't change the code below - it's for testing
def check_shapes():
    return array_1d, array_2d, shape_1d, shape_2d
```

### Hidden Tests

Test 1: array_1d has shape (5,)
Test 2: array_2d has shape (2, 3)
Test 3: shape_1d is (5,)
Test 4: shape_2d is (2, 3)

### Hints
- Use np.array() for 1D
- Use nested lists for 2D: [[1, 2, 3], [4, 5, 6]]
- Use .shape attribute to get shape