---
title: "Indexing and Slicing"
type: "read"
resources:
  - title: "NumPy: Indexing"
    url: "https://numpy.org/doc/stable/user/basics.indexing.html"
---

# Indexing and Slicing

## Grabbing Specific Parts of an Array

Just like slicing a pizza, you can grab specific rows, columns, or sub-sections of a NumPy array.

### 1D Slicing

```python
arr = np.array([10, 20, 30, 40, 50])

arr[0]      # → 10  (first element)
arr[-1]     # → 50  (last element)
arr[1:4]    # → [20, 30, 40]  (index 1 up to but not including 4)
arr[:3]     # → [10, 20, 30]  (first 3)
arr[2:]     # → [30, 40, 50]  (from index 2 to end)
```

### 2D Indexing

```python
grid = np.array([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
])

grid[0, 1]    # → 2   (row 0, column 1)
grid[1, :]    # → [4, 5, 6]  (entire row 1)
grid[:, 2]    # → [3, 6, 9]  (entire column 2)
grid[0:2, 1:] # → [[2, 3], [5, 6]]  (rows 0-1, columns 1-2)
```

### Remember

- Indexing starts at **0**
- Slicing is `start:stop` — stop is **not included**
- Use `:` alone to mean "all"
- Negative indices count from the end: `arr[-1]` is the last element
