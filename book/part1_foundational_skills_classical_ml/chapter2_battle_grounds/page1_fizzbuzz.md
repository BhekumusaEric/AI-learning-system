---
title: "Kata 1: FizzBuzz"
type: "practice"
---

# ⚔️ Kata 1: FizzBuzz

The most famous coding interview question of all time. Simple rules, but you must get every edge case right.

## Rules

- For numbers **1 to n** (inclusive), return a list where:
  - Multiples of **3** → `"Fizz"`
  - Multiples of **5** → `"Buzz"`
  - Multiples of **both 3 and 5** → `"FizzBuzz"`
  - Everything else → the number as a **string**

## Example

```
fizzbuzz(15) → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

> **Watch out:** Check for multiples of both 3 AND 5 first, before checking each individually.

### Initial Code

```python
def fizzbuzz(n):
    result = []
    for i in range(1, n + 1):
        # Check FizzBuzz FIRST, then Fizz, then Buzz, then number
        pass
    return result
```

### Evaluation Code

```python
assert fizzbuzz(1) == ["1"], f"Got {fizzbuzz(1)}"
assert fizzbuzz(3) == ["1","2","Fizz"], f"Got {fizzbuzz(3)}"
assert fizzbuzz(5) == ["1","2","Fizz","4","Buzz"], f"Got {fizzbuzz(5)}"
assert fizzbuzz(15)[-1] == "FizzBuzz", f"15th element should be FizzBuzz, got {fizzbuzz(15)[-1]}"
assert fizzbuzz(15)[2] == "Fizz", f"3rd element should be Fizz"
assert fizzbuzz(15)[4] == "Buzz", f"5th element should be Buzz"
assert fizzbuzz(15) == ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"], f"Full list wrong"
assert fizzbuzz(20)[19] == "Buzz", f"20 should be Buzz"
assert fizzbuzz(30)[29] == "FizzBuzz", f"30 should be FizzBuzz"
assert all(isinstance(x, str) for x in fizzbuzz(10)), "All elements must be strings"
print("✅ All tests passed!")
```
