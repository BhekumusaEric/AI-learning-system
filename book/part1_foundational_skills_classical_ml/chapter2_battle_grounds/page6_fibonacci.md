---
title: "Kata 6: Fibonacci Sequence"
type: "practice"
---

# Kata 6: Fibonacci Sequence

Each number in the Fibonacci sequence is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13...

## Rules

Write `fibonacci(n)` that returns a list of the first `n` Fibonacci numbers.
- Starts with `[0, 1, ...]`
- `fibonacci(1)` → `[0]`
- `fibonacci(2)` → `[0, 1]`

## Examples

```
fibonacci(5) → [0, 1, 1, 2, 3]
fibonacci(8) → [0, 1, 1, 2, 3, 5, 8, 13]
```

Hint: Start with `[0, 1]` and keep appending the sum of the last two elements until the list has `n` items.

### Initial Code

```python
def fibonacci(n):
    if n <= 0:
        return []
    if n == 1:
        return [0]
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return 
```

### Evaluation Code

```python
assert fibonacci(1) == [0], f"Got {fibonacci(1)}"
assert fibonacci(2) == [0, 1], f"Got {fibonacci(2)}"
assert fibonacci(5) == [0, 1, 1, 2, 3], f"Got {fibonacci(5)}"
assert fibonacci(8) == [0, 1, 1, 2, 3, 5, 8, 13], f"Got {fibonacci(8)}"
assert fibonacci(10) == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], f"Got {fibonacci(10)}"
assert len(fibonacci(20)) == 20, "Length must equal n"
assert fibonacci(0) == [], "fibonacci(0) should return empty list"
seq = fibonacci(15)
for i in range(2, len(seq)):
    assert seq[i] == seq[i-1] + seq[i-2], f"Element {i} is wrong: {seq[i]} != {seq[i-1]}+{seq[i-2]}"
print("All tests passed!")
```
