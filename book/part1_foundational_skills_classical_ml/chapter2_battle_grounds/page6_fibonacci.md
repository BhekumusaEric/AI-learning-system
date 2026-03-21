---
title: "Kata 6: Fibonacci Sequence"
type: "practice"
---

# Kata 6: Fibonacci Sequence

Each number in the Fibonacci sequence is the sum of the two numbers before it.

## Rules

Write a function `fibonacci(n)` that returns a list of the first `n` Fibonacci numbers.
- The sequence always starts with `[0, 1, ...]`
- `fibonacci(1)` returns `[0]`
- `fibonacci(2)` returns `[0, 1]`
- `fibonacci(0)` returns `[]`

## Examples

```
fibonacci(5)  → [0, 1, 1, 2, 3]
fibonacci(8)  → [0, 1, 1, 2, 3, 5, 8, 13]
fibonacci(10) → [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

## Things to think about

- Handle the edge cases for `n <= 0` and `n == 1` first.
- Start with `[0, 1]` and keep adding the sum of the last two elements until the list has `n` items.
- `seq[-1]` gives the last element, `seq[-2]` gives the second to last.
- The length of the returned list must always equal `n`.

### Initial Code

```python
def fibonacci(n):
    # your code here
    pass
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
