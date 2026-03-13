---
resources:
  - title: "NumPy Quickstart Guide"
    url: "https://numpy.org/doc/stable/user/quickstart.html"
  - title: "W3Schools: NumPy Tutorial"
    url: "https://www.w3schools.com/python/numpy/default.asp"
---

# Array Math

## Mathematical Operations on Arrays

NumPy allows you to perform mathematical operations on entire arrays at once, without needing loops. This is called "vectorization" and makes your code faster and cleaner.

### Element-wise Operations

```python
import numpy as np

arr1 = np.array([1, 2, 3])
arr2 = np.array([4, 5, 6])

# Addition
result_add = arr1 + arr2  # [5, 7, 9]

# Subtraction
result_sub = arr1 - arr2  # [-3, -3, -3]

# Multiplication
result_mul = arr1 * arr2  # [4, 10, 18]

# Division
result_div = arr2 / arr1  # [4.0, 2.5, 2.0]

# Power
result_pow = arr1 ** 2   # [1, 4, 9]
```

### Operations with Scalars

```python
arr = np.array([1, 2, 3, 4])

# Add 10 to each element
added = arr + 10  # [11, 12, 13, 14]

# Multiply each by 3
multiplied = arr * 3  # [3, 6, 9, 12]

# Square each element
squared = arr ** 2  # [1, 4, 9, 16]
```

### Mathematical Functions

```python
arr = np.array([1, 4, 9, 16])

# Square root
sqrt_arr = np.sqrt(arr)  # [1, 2, 3, 4]

# Trigonometric functions
sin_arr = np.sin(arr)
cos_arr = np.cos(arr)

# Exponential and logarithm
exp_arr = np.exp(arr)
log_arr = np.log(arr)
```

### Aggregation Functions

```python
arr = np.array([1, 2, 3, 4, 5])

print(np.sum(arr))    # 15
print(np.mean(arr))   # 3.0
print(np.max(arr))    # 5
print(np.min(arr))    # 1
print(np.std(arr))    # Standard deviation
```

### Remember
- Operations are element-wise by default
- Broadcasting allows operations between different shaped arrays
- NumPy functions work on entire arrays
- No loops needed for basic math!

Next, practice array operations!