---
title: "Kata 2: Palindrome Check"
type: "practice"
---

# Kata 2: Palindrome Check

A palindrome reads the same forwards and backwards.

## Rules

Write a function `is_palindrome(s)` that returns `True` if `s` is a palindrome, `False` otherwise.
- Ignore case — `"Racecar"` is a palindrome
- Ignore spaces — `"race car"` is a palindrome
- Only consider letters, ignore everything else

## Examples

```
is_palindrome("racecar")                     → True
is_palindrome("hello")                       → False
is_palindrome("A man a plan a canal Panama") → True
is_palindrome("Was it a car or a cat I saw") → True
```

## Things to think about

- Clean the string first: make it lowercase and remove all non-letter characters.
- A string can be compared to its reverse using `[::-1]`.
- `char.isalpha()` returns `True` if a character is a letter.
- An empty string after cleaning is considered a palindrome.

### Initial Code

```python
def is_palindrome(s):
    # your code here
    pass
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
