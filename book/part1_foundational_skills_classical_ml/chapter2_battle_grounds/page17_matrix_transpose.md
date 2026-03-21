---
title: "Kata 17: Matrix Transpose"
type: "practice"
---

# Kata 17: Matrix Transpose

Transposing a matrix flips it over its diagonal — rows become columns and columns become rows.

## Rules

Write `transpose(matrix)` that takes a 2D list and returns its transpose. Works for any size matrix.

## Examples

```
transpose([[1,2,3],[4,5,6]])
→ [[1,4],[2,5],[3,6]]

transpose([[1,2,3],[4,5,6],[7,8,9]])
→ [[1,4,7],[2,5,8],[3,6,9]]
```

Hint: The element at position `[i][j]` in the original goes to position `[j][i]` in the transpose. Create a new matrix with swapped dimensions first.

### Initial Code

```python
def transpose(matrix):
    if not matrix or not matrix[0]:
        return []
    rows = len(matrix)
    cols = len(matrix[0])
    result = [[0] * rows for _ in range(cols)]
    for i in range(rows):
        for j in range(cols):
            result[j][i] = matrix[i][j]
    return result
```

### Evaluation Code

```python
assert transpose([[1,2,3],[4,5,6]]) == [[1,4],[2,5],[3,6]]
assert transpose([[1,2],[3,4],[5,6]]) == [[1,3,5],[2,4,6]]
assert transpose([[1,2,3],[4,5,6],[7,8,9]]) == [[1,4,7],[2,5,8],[3,6,9]]
assert transpose([[1]]) == [[1]], "1x1 matrix"
assert transpose([[1,2,3]]) == [[1],[2],[3]], "Single row becomes single columns"
assert transpose([]) == [], "Empty matrix"
m = [[1,2,3,4],[5,6,7,8]]
t = transpose(m)
assert len(t) == 4, "Transposed rows should equal original cols"
assert len(t[0]) == 2, "Transposed cols should equal original rows"
original = [[1,2],[3,4],[5,6]]
assert transpose(transpose(original)) == original, "Transpose of transpose equals original"
print("All tests passed!")
```
