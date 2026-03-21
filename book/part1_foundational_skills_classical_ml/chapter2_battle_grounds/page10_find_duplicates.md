---
title: "Kata 10: Find Duplicates"
type: "practice"
---

# Kata 10: Find Duplicates

Find all elements that appear more than once in a list.

## Rules

Write `find_duplicates(nums)` that:
- Returns a sorted list of all numbers that appear more than once
- Each duplicate appears only once in the result
- Returns an empty list if there are no duplicates

## Examples

```
find_duplicates([1, 2, 3, 2, 4, 3]) → [2, 3]
find_duplicates([1, 2, 3])           → []
find_duplicates([1, 1, 1, 1])        → [1]
```

Hint: Use a dictionary to count occurrences. Then collect keys where the count is greater than 1.

### Initial Code

```python
def find_duplicates(nums):
    counts = {}
    for num in nums:
        counts[num] = counts.get(num, 0) + 1
    duplicates = [num for num, count in counts.items() if count > 1]
    return sorted(duplicates)
```

### Evaluation Code

```python
assert find_duplicates([1, 2, 3, 2, 4, 3]) == [2, 3], f"Got {find_duplicates([1,2,3,2,4,3])}"
assert find_duplicates([1, 2, 3]) == [], "No duplicates"
assert find_duplicates([1, 1, 1, 1]) == [1], "Same element many times appears once in result"
assert find_duplicates([]) == [], "Empty list"
assert find_duplicates([5, 5, 5, 3, 3, 1]) == [3, 5], "Should be sorted"
assert find_duplicates([4, 3, 2, 1]) == [], "All unique"
assert find_duplicates([1, 2, 1, 3, 2, 4, 3]) == [1, 2, 3]
assert find_duplicates([-1, -1, 2, 3]) == [-1], "Works with negatives"
result = find_duplicates([3, 1, 2, 1, 3])
assert result == sorted(result), "Result must be sorted"
print("All tests passed!")
```
