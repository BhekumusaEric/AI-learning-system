---
title: "Creating Arrays"
type: "read"
resources:
  - title: "NumPy: Array Creation"
    url: "https://numpy.org/doc/stable/user/quickstart.html#array-creation"
---

# Creating Arrays

## Practice: Making NumPy Arrays

Create NumPy arrays from Python lists.

### Initial Code

```python
import numpy as np

# 1. Create an array from the list [1, 2, 3, 4, 5]
numbers_array = 

# 2. Create an array from the list [10, 20, 30]
tens_array = 

# 3. Create an array from the list ["apple", "banana", "cherry"]
fruits_array = 

# Don't change the code below - it's for testing
def check_arrays():
    return numbers_array, tens_array, fruits_array
```

### Hidden Tests

Test 1: numbers_array contains [1, 2, 3, 4, 5]
Test 2: tens_array contains [10, 20, 30]
Test 3: fruits_array contains the fruit strings
Test 4: All are NumPy arrays (not lists)

### Hints
- Use `np.array(list)` to convert
- Import numpy as np first
- Arrays can contain numbers or strings