---
title: "Slicing Challenge"
type: "practice"
resources:
  - title: "NumPy: Indexing"
    url: "https://numpy.org/doc/stable/user/basics.indexing.html"
---

# Slicing Challenge

## Practice: Extract Parts of Arrays

### Initial Code

```python
import numpy as np

grid = np.array([
    [1,  2,  3,  4],
    [5,  6,  7,  8],
    [9,  10, 11, 12],
    [13, 14, 15, 16]
])

# 1. Get the element at row 2, column 3 (should be 12)
element = 

# 2. Get the entire second row (index 1) as a 1D array
second_row = 

# 3. Get the entire third column (index 2) as a 1D array
third_col = 

# 4. Get the top-left 2x2 subarray: [[1,2],[5,6]]
top_left = 

# 5. Get the last two elements of the last row: [15, 16]
last_two = 

# Don't change the code below - it's for testing
def check_slicing():
    return element, second_row, third_col, top_left, last_two
```

### Hidden Tests

Test 1: element == 12
Test 2: second_row == [5, 6, 7, 8]
Test 3: third_col == [3, 7, 11, 15]
Test 4: top_left == [[1,2],[5,6]]
Test 5: last_two == [15, 16]

### Evaluation Code
```python
assert element == 12, "element should be grid[2, 3] = 12"
assert np.array_equal(second_row, [5, 6, 7, 8]), "second_row should be row at index 1"
assert np.array_equal(third_col, [3, 7, 11, 15]), "third_col should be column at index 2"
assert np.array_equal(top_left, [[1,2],[5,6]]), "top_left should be grid[0:2, 0:2]"
assert np.array_equal(last_two, [15, 16]), "last_two should be the last 2 elements of the last row"
```

### Hints
- `grid[row, col]` for a single element
- `grid[1, :]` for an entire row
- `grid[:, 2]` for an entire column
- `grid[0:2, 0:2]` for a subarray
- `grid[-1, -2:]` for the last two of the last row
