---
title: "Kata 1: FizzBuzz"
type: "practice"
---

# Kata 1: FizzBuzz

The most famous coding challenge of all time. Simple rules, but you must handle every case correctly.

## Rules

Write a function `fizzbuzz(n)` that returns a list of strings for numbers 1 to n:
- Multiples of 3 return `"Fizz"`
- Multiples of 5 return `"Buzz"`
- Multiples of both 3 and 5 return `"FizzBuzz"`
- Everything else returns the number as a string, e.g. `"1"`, `"2"`

## Examples

```
fizzbuzz(5)  → ["1", "2", "Fizz", "4", "Buzz"]
fizzbuzz(15) → ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
```

## Things to think about

- The check for both 3 and 5 must come before the individual checks, otherwise it will never be reached.
- Every element in the returned list must be a string, including the numbers.
- Use the modulo operator `%` to check divisibility. `n % 3 == 0` means n is divisible by 3.

### Initial Code

```python
def fizzbuzz(n):
    # your code here
    pass
```

### Evaluation Code

```python
assert fizzbuzz(1) == ["1"], f"Got {fizzbuzz(1)}"
assert fizzbuzz(3) == ["1", "2", "Fizz"], f"Got {fizzbuzz(3)}"
assert fizzbuzz(5) == ["1", "2", "Fizz", "4", "Buzz"], f"Got {fizzbuzz(5)}"
assert fizzbuzz(15)[14] == "FizzBuzz", f"15th element should be FizzBuzz, got {fizzbuzz(15)[14]}"
assert fizzbuzz(15)[2] == "Fizz", "3rd element should be Fizz"
assert fizzbuzz(15)[4] == "Buzz", "5th element should be Buzz"
assert fizzbuzz(15) == ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]
assert fizzbuzz(20)[19] == "Buzz", "20 should be Buzz"
assert fizzbuzz(30)[29] == "FizzBuzz", "30 should be FizzBuzz"
assert all(isinstance(x, str) for x in fizzbuzz(10)), "All elements must be strings"
print("All tests passed!")
```
