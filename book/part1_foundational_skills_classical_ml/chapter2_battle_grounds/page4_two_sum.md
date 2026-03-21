---
title: "Kata 4: Two Sum"
type: "practice"
---

# ⚔️ Kata 4: Two Sum

One of the most common coding interview questions at top tech companies.

## Rules

Write `two_sum(nums, target)` that:
- Given a list of integers `nums` and an integer `target`
- Returns the **indices** of the two numbers that add up to `target`
- Return them as a **list** `[i, j]` where `i < j`
- You may assume **exactly one solution** exists
- You **cannot** use the same element twice

## Examples

```
two_sum([2, 7, 11, 15], 9)  → [0, 1]   (2 + 7 = 9)
two_sum([3, 2, 4], 6)       → [1, 2]   (2 + 4 = 6)
two_sum([3, 3], 6)           → [0, 1]
```

> **Hint:** For each number, check if `target - number` exists in the list at a different index.

### Initial Code

```python
def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if :  # check if nums[i] + nums[j] equals target
                return 
    return []
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
assert result[0] < result[1], "First index must be smaller"
print("✅ All tests passed!")
```
