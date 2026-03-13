---
title: "NumPy Quickstart Guide"
type: "read"
resources:
  - title: "NumPy Quickstart: The Basics"
    url: "https://numpy.org/doc/stable/user/quickstart.html#the-basics"
---

# Arrays vs. Lists

## NumPy Arrays

NumPy arrays are like Python lists, but they're designed specifically for mathematical operations and data analysis. They're faster, more memory-efficient, and come with powerful built-in functions.

### Python Lists vs NumPy Arrays

```python
# Python list
python_list = [1, 2, 3, 4, 5]

# NumPy array
import numpy as np
numpy_array = np.array([1, 2, 3, 4, 5])
```

### Key Differences

1. **Speed**: NumPy operations are much faster for large datasets
2. **Memory**: Arrays use less memory
3. **Functionality**: Arrays support element-wise operations
4. **Data Types**: Arrays have fixed data types for better performance

### Array Operations

```python
arr = np.array([1, 2, 3, 4, 5])

# Element-wise operations
doubled = arr * 2      # [2, 4, 6, 8, 10]
squared = arr ** 2     # [1, 4, 9, 16, 25]
added = arr + 10       # [11, 12, 13, 14, 15]

# Mathematical functions
mean_val = np.mean(arr)    # 3.0
sum_val = np.sum(arr)      # 15
max_val = np.max(arr)      # 5
```

### When to Use Arrays
- Mathematical computations
- Large datasets
- Scientific computing
- Machine learning data

### Remember
- Import NumPy: `import numpy as np`
- Create arrays with `np.array()`
- Arrays support vectorized operations (no loops needed!)
- All elements in an array have the same data type

Next, practice creating your first NumPy arrays!