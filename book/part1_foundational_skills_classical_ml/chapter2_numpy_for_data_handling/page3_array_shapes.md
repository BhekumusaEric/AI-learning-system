---
resources:
  - title: "NumPy Quickstart Guide"
    url: "https://numpy.org/doc/stable/user/quickstart.html"
  - title: "W3Schools: NumPy Tutorial"
    url: "https://www.w3schools.com/python/numpy/default.asp"
---

# Array Shapes

## Understanding Array Dimensions

NumPy arrays can have different shapes (dimensions). The shape tells you how many elements are in each dimension.

### 1D Arrays (Vectors)

```python
arr_1d = np.array([1, 2, 3, 4, 5])
print(arr_1d.shape)  # (5,) - 5 elements in one dimension
```

### 2D Arrays (Matrices)

```python
arr_2d = np.array([[1, 2, 3], 
                   [4, 5, 6]])
print(arr_2d.shape)  # (2, 3) - 2 rows, 3 columns
```

### 3D Arrays

```python
arr_3d = np.array([[[1, 2], [3, 4]], 
                   [[5, 6], [7, 8]]])
print(arr_3d.shape)  # (2, 2, 2) - 2 layers, 2 rows, 2 columns
```

### Shape Operations

```python
arr = np.array([[1, 2, 3], [4, 5, 6]])

print(arr.shape)     # (2, 3)
print(arr.size)      # 6 (total elements)
print(arr.ndim)      # 2 (number of dimensions)
```

### Reshaping Arrays

```python
arr = np.array([1, 2, 3, 4, 5, 6])
reshaped = arr.reshape(2, 3)  # Becomes [[1, 2, 3], [4, 5, 6]]
```

### Remember
- Shape is a tuple: (rows, columns) for 2D
- `arr.shape` returns the shape
- `arr.reshape(new_shape)` changes shape without changing data
- Total elements stay the same when reshaping

Next, practice checking and creating arrays with different shapes!