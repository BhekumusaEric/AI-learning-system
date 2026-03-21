---
title: "Kata 2: Palindrome Check"
type: "practice"
---

# Kata 2: Palindrome Check

A palindrome reads the same forwards and backwards.

## Rules

Write `is_palindrome(s)` that returns `True` if `s` is a palindrome, `False` otherwise.
- Ignore case — `"Racecar"` is a palindrome
- Ignore spaces — `"race car"` is a palindrome
- Ignore punctuation — only keep letters

## Examples

```
is_palindrome("racecar")                      → True
is_palindrome("hello")                        → False
is_palindrome("A man a plan a canal Panama")  → True
```

Hint: Clean the string first (lowercase, keep only letters), then compare it to its reverse with `[::-1]`.

### Initial Code

```python
def is_palindrome(s):
    # Step 1: keep only letters and make lowercase
    cleaned = ''.join(c.lower() for c in s if c.isalpha())
    # Step 2: return True if cleaned equals its reverse
    return 
```

### Evaluation Code

```python
assert is_palindrome("racecar") == True
assert is_palindrome("hello") == False
assert is_palindrome("Racecar") == True, "Should ignore case"
assert is_palindrome("race car") == True, "Should ignore spaces"
assert is_palindrome("A man a plan a canal Panama") == True
assert is_palindrome("Was it a car or a cat I saw") == True
assert is_palindrome("No lemon no melon") == True
assert is_palindrome("") == True, "Empty string is a palindrome"
assert is_palindrome("a") == True, "Single char is a palindrome"
assert is_palindrome("ab") == False
assert is_palindrome("Never odd or even") == True
print("All tests passed!")
```
