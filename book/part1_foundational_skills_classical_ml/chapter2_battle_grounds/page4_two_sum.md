---
title: "Kata 4: Two Sum"
type: "practice"
---

# Kata 4: Two Sum

One of the most common coding interview questions at top tech companies.

## Rules

Write a function `two_sum(nums, target)` that:
- Returns the indices of the two numbers that add up to `target`
- Return them as a list `[i, j]` where `i < j`
- Exactly one solution always exists
- You cannot use the same element twice

## Examples

```
two_sum([2, 7, 11, 15], 9) → [0, 1]   (nums[0] + nums[1] = 2 + 7 = 9)
two_sum([3, 2, 4], 6)      → [1, 2]   (nums[1] + nums[2] = 2 + 4 = 6)
two_sum([3, 3], 6)          → [0, 1]
```

## Things to think about

- Loop through every pair of indices `(i, j)` where `j > i`.
- For each pair, check if `nums[i] + nums[j] == target`.
- `range(i + 1, len(nums))` gives you all indices after `i`.
- Return the two indices as a list the moment you find the pair.
- The result must always have the smaller index first.

### Initial Code

```python
def two_sum(nums, target):
    # your code here
    pass
```

### Evaluation Code

```python
assert two_sum([2, 7, 11, 15], 9) == [0, 1], f"Got {two_sum([2,7,11,15],9)}"
assert two_sum([3, 2, 4], 6) == [1, 2], f"Got {two_sum([3,2,4],6)}"
assert two_sum([3, 3], 6) == [0, 1], f"Got {two_sum([3,3],6)}"
assert two_sum([1, 2, 3, 4, 5], 9) == [3, 4], f"Got {two_sum([1,2,3,4,5],9)}"
assert two_sum([0, 4, 3, 0], 0) == [0, 3], f"Got {two_sum([0,4,3,0],0)}"
assert two_sum([-1, -2, -3, -4, -5], -8) == [2, 4], f"Got {two_sum([-1,-2,-3,-4,-5],-8)}"
assert two_sum([1, 5, 3, 7, 2], 10) == [1, 3], f"Got {two_sum([1,5,3,7,2],10)}"
result = two_sum([2, 7, 11, 15], 9)
assert isinstance(result, list) and len(result) == 2, "Must return a list of 2 indices"
assert result[0] < result[1], "First index must be smaller than second"
print("All tests passed!")
```
