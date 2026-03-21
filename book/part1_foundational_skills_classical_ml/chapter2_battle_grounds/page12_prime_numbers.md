---
title: "Kata 12: Prime Numbers"
type: "practice"
---

# Kata 12: Prime Numbers

A prime number is a number greater than 1 that is only divisible by 1 and itself.

## Rules

Write two functions:

`is_prime(n)` — returns `True` if `n` is prime, `False` otherwise.
- 0 and 1 are not prime
- 2 is prime (the only even prime)
- Negative numbers are not prime

`primes_up_to(n)` — returns a list of all prime numbers from 2 up to and including `n`.

## Examples

```
is_prime(2)      → True
is_prime(4)      → False
is_prime(17)     → True
is_prime(1)      → False
primes_up_to(10) → [2, 3, 5, 7]
primes_up_to(20) → [2, 3, 5, 7, 11, 13, 17, 19]
```

## Things to think about

- To check if `n` is prime, test whether any number from 2 up to `sqrt(n)` divides it evenly.
- You only need to check up to `sqrt(n)` because if `n` has a factor larger than its square root, it must also have one smaller.
- Use `i * i <= n` instead of importing `math.sqrt`.
- Skip even numbers after 2 to make it faster — check 3, 5, 7, 9...
- `primes_up_to` can reuse `is_prime` with a list comprehension.

### Initial Code

```python
def is_prime(n):
    # your code here
    pass

def primes_up_to(n):
    # your code here
    pass
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
