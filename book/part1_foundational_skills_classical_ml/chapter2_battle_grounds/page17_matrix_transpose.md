---
title: "Kata 17: Matrix Transpose"
type: "practice"
---

# ⚔️ Kata 17: Matrix Transpose

Transposing a matrix flips it over its diagonal — rows become columns and columns become rows.

## Rules

Write `transpose(matrix)` that:
- Takes a 2D list (list of lists) representing a matrix
- Returns its transpose
- Works for any size matrix (not just square)

## Examples

```
transpose([[1,2,3],[4,5,6]])
→ [[1,4],[2,5],[3,6]]

transpose([[1,2],[3,4],[5,6]])
→ [[1,3,5],[2,4,6]]

transpose([[1,2,3],[4,5,6],[7,8,9]])
→ [[1,4,7],[2,5,8],[3,6,9]]
```

> **Hint:** The element at `[i][j]` in the original becomes `[j][i]` in the transpose. You can use `zip(*matrix)`.

### Initial Code

```python
def transpose(matrix):
    if not matrix or not matrix[0]:
        return []
    rows = len(matrix)
    cols = len(matrix[0])
    # Create a new matrix with swapped dimensions
    result = [[0] * rows for _ in range(cols)]
    for i in range(rows):
        for j in range(cols):
            result[j][i] = 
    return result
```

### Evaluation Code

```python
assert transpose([[1,2,3],[4,5,6]]) == [[1,4],[2,5],[3,6]]
assert transpose([[1,2],[3,4],[5,6]]) == [[1,3,5],[2,4,6]]
assert transpose([[1,2,3],[4,5,6],[7,8,9]]) == [[1,4,7],[2,5,8],[3,6,9]]
assert transpose([[1]]) == [[1]], "1x1 matrix"
assert transpose([[1,2,3]]) == [[1],[2],[3]], "1 row → 1 column each"
assert transpose([]) == [], "Empty matrix"
# Verify dimensions are swapped
m = [[1,2,3,4],[5,6,7,8]]
t = transpose(m)
assert len(t) == 4, "Transposed rows should equal original cols"
assert len(t[0]) == 2, "Transposed cols should equal original rows"
# Transpose of transpose = original
original = [[1,2],[3,4],[5,6]]
assert transpose(transpose(original)) == original, "Transpose of transpose = original"
print("✅ All tests passed!")
```
