---
title: "Kata 12: Prime Numbers"
type: "practice"
---

# Kata 12: Prime Numbers

A prime number is only divisible by 1 and itself: 2, 3, 5, 7, 11, 13...

## Rules

Write `is_prime(n)` that returns `True` if `n` is prime, `False` otherwise.
- 1 is not prime
- 2 is prime (the only even prime)
- Negative numbers and 0 are not prime

Then write `primes_up_to(n)` that returns a list of all primes from 2 up to and including `n`.

## Examples

```
is_prime(7)         → True
is_prime(4)         → False
primes_up_to(10)    → [2, 3, 5, 7]
```

Hint: To check if `n` is prime, test divisors from 2 up to `sqrt(n)`. If any divide evenly, it is not prime.

### Initial Code

```python
def is_prime(n):
    if n < 2:
        return False
    if n == 2:
        return True
    if n % 2 == 0:
        return False
    i = 3
    while i * i <= n:
        if n % i == 0:
            return False
        i += 2
    return True

def primes_up_to(n):
    return [x for x in range(2, n + 1) if is_prime(x)]
```

### Evaluation Code

```python
assert is_prime(2) == True, "2 is prime"
assert is_prime(3) == True
assert is_prime(4) == False, "4 = 2x2"
assert is_prime(1) == False, "1 is not prime"
assert is_prime(0) == False
assert is_prime(-5) == False
assert is_prime(17) == True
assert is_prime(18) == False
assert is_prime(97) == True
assert is_prime(100) == False
assert primes_up_to(10) == [2, 3, 5, 7], f"Got {primes_up_to(10)}"
assert primes_up_to(20) == [2, 3, 5, 7, 11, 13, 17, 19]
assert primes_up_to(2) == [2]
assert primes_up_to(1) == []
assert len(primes_up_to(100)) == 25, "There are 25 primes up to 100"
print("All tests passed!")
```
