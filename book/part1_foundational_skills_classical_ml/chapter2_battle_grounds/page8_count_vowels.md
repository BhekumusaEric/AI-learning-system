---
title: "Kata 8: Count Vowels"
type: "practice"
---

# ⚔️ Kata 8: Count Vowels

Simple but with tricky edge cases. Count how many vowels are in a string.

## Rules

Write `count_vowels(s)` that:
- Returns the **count** of vowels in `s`
- Vowels are: `a, e, i, o, u` (and their uppercase versions)
- Count **each occurrence** — `"aaa"` has 3 vowels

## Examples

```
count_vowels("hello")         → 2  (e, o)
count_vowels("HELLO")         → 2  (E, O)
count_vowels("rhythm")        → 0
count_vowels("aeiou")         → 5
count_vowels("Hello World!")  → 3  (e, o, o)
```

### Initial Code

```python
def count_vowels(s):
    vowels = "aeiouAEIOU"
    count = 0
    for char in s:
        if :
            count += 1
    return count
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
print("✅ All tests passed!")
```
