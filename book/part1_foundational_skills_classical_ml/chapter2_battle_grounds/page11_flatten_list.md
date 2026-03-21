---
title: "Kata 11: Flatten a List"
type: "practice"
---

# ⚔️ Kata 11: Flatten a List

Turn a nested list into a single flat list.

## Rules

Write `flatten(nested)` that:
- Takes a list that may contain **integers or other lists** (one level deep only)
- Returns a single flat list with all integers in order

## Examples

```
flatten([1, [2, 3], [4, 5], 6])  → [1, 2, 3, 4, 5, 6]
flatten([[1, 2], [3, 4]])         → [1, 2, 3, 4]
flatten([1, 2, 3])                → [1, 2, 3]
flatten([])                       → []
```

> **Hint:** Loop through each item. If it's a list, extend your result with it. If it's not, append it.

### Initial Code

```python
def flatten(nested):
    result = []
    for item in nested:
        if isinstance(item, list):
            # Add all elements of the inner list
            result.extend()
        else:
            result.append(item)
    return result
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
assert flatten([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1,2,3,4,5,6,7,8,9]
assert flatten([0, [0, 0], [0]]) == [0, 0, 0, 0]
assert isinstance(flatten([1, [2]]), list), "Must return a list"
print("✅ All tests passed!")
```
