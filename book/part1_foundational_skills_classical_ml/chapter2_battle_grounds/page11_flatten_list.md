---
title: "Kata 11: Flatten a List"
type: "practice"
---

# Kata 11: Flatten a List

Turn a nested list into a single flat list.

## Rules

Write a function `flatten(nested)` that takes a list which may contain integers or other lists (one level deep only) and returns a single flat list with all integers in order.

## Examples

```
flatten([1, [2, 3], [4, 5], 6]) → [1, 2, 3, 4, 5, 6]
flatten([[1, 2], [3, 4]])        → [1, 2, 3, 4]
flatten([1, 2, 3])               → [1, 2, 3]
flatten([])                      → []
flatten([[]])                    → []
```

## Things to think about

- Loop through each item in the input list.
- Use `isinstance(item, list)` to check if an item is itself a list.
- If it is a list, use `result.extend(item)` to add all its elements to your result.
- If it is not a list, use `result.append(item)` to add it directly.
- An empty inner list `[]` should contribute nothing to the result.

### Initial Code

```python
def flatten(nested):
    # your code here
    pass
```

### Evaluation Code

```python
assert flatten([1, [2, 3], [4, 5], 6]) == [1, 2, 3, 4, 5, 6]
assert flatten([[1, 2], [3, 4]]) == [1, 2, 3, 4]
assert flatten([1, 2, 3]) == [1, 2, 3], "Already flat"
assert flatten([]) == [], "Empty list"
assert flatten([[]]) == [], "List containing empty list"
assert flatten([[1], [2], [3]]) == [1, 2, 3]
assert flatten([1, [], 2, [], 3]) == [1, 2, 3], "Empty inner lists"
assert flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 4, 5, 6, 7, 8, 9]
assert flatten([0, [0, 0], [0]]) == [0, 0, 0, 0]
assert isinstance(flatten([1, [2]]), list), "Must return a list"
print("All tests passed!")
```
