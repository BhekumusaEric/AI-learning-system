---
title: "Kata 8: Count Vowels"
type: "practice"
---

# Kata 8: Count Vowels

Count how many vowels appear in a string.

## Rules

Write a function `count_vowels(s)` that returns the total number of vowels in `s`.
- Vowels are: a, e, i, o, u and their uppercase versions A, E, I, O, U
- Count every occurrence — `"aaa"` has 3 vowels

## Examples

```
count_vowels("hello")        → 2   (e, o)
count_vowels("HELLO")        → 2   (E, O)
count_vowels("rhythm")       → 0
count_vowels("aeiou")        → 5
count_vowels("Hello World!") → 3   (e, o, o)
```

## Things to think about

- Loop through each character in the string.
- Check if the character is in the string `"aeiouAEIOU"`.
- Keep a running count and return it at the end.
- An empty string should return 0.
- The return value must be an integer.

### Initial Code

```python
def count_vowels(s):
    # your code here
    pass
```

### Evaluation Code

```python
assert count_vowels("hello") == 2, f"Got {count_vowels('hello')}"
assert count_vowels("HELLO") == 2, f"Got {count_vowels('HELLO')}"
assert count_vowels("rhythm") == 0, "No vowels in rhythm"
assert count_vowels("aeiou") == 5
assert count_vowels("AEIOU") == 5
assert count_vowels("Hello World!") == 3
assert count_vowels("") == 0, "Empty string"
assert count_vowels("bcdfg") == 0, "No vowels"
assert count_vowels("aaa") == 3, "Count each occurrence"
assert count_vowels("The quick brown fox") == 5
assert count_vowels("Python Programming") == 5
assert isinstance(count_vowels("test"), int), "Must return an integer"
print("All tests passed!")
```
