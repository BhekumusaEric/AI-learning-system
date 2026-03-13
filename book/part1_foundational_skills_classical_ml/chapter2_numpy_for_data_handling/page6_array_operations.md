# Array Operations

## Practice: Mathematical Operations

Perform element-wise operations on arrays and calculate aggregations.

### Initial Code

```python
import numpy as np

# Given arrays
arr1 = np.array([1, 2, 3, 4])
arr2 = np.array([5, 6, 7, 8])

# 1. Multiply arr1 and arr2 element-wise
product = 

# 2. Add 10 to each element of arr1
added = 

# 3. Calculate the sum of all elements in arr2
total_sum = 

# 4. Calculate the mean of arr1
average = 

# Don't change the code below - it's for testing
def check_operations():
    return product, added, total_sum, average
```

### Hidden Tests

Test 1: product is [5, 12, 21, 32]
Test 2: added is [11, 12, 13, 14]
Test 3: total_sum is 26
Test 4: average is 2.5

### Hints
- Use * for element-wise multiplication
- Use + for element-wise addition
- Use np.sum() for total
- Use np.mean() for average