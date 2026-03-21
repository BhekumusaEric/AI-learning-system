---
title: "Kata 17: Matrix Transpose"
type: "practice"
---

# Kata 17: Matrix Transpose

Transposing a matrix flips it over its diagonal — rows become columns and columns become rows.

## Rules

Write a function `transpose(matrix)` that takes a 2D list and returns its transpose. It must work for any size matrix, not just square ones.

## Examples

```
transpose([[1,2,3],[4,5,6]])
→ [[1,4],[2,5],[3,6]]

transpose([[1,2],[3,4],[5,6]])
→ [[1,3,5],[2,4,6]]

transpose([[1,2,3],[4,5,6],[7,8,9]])
→ [[1,4,7],[2,5,8],[3,6,9]]
```

## Things to think about

- The element at position `[i][j]` in the original goes to position `[j][i]` in the transpose.
- If the original matrix has `rows` rows and `cols` columns, the transposed matrix has `cols` rows and `rows` columns.
- Create the result matrix first with the correct dimensions, then fill it in.
- `[[0] * rows for _ in range(cols)]` creates a matrix of zeros with the right shape.
- Handle the empty matrix case: if `matrix` is empty or `matrix[0]` is empty, return `[]`.

### Initial Code

```python
def transpose(matrix):
    # your code here
    pass
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
