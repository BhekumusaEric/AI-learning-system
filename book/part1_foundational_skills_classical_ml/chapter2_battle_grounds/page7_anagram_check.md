---
title: "Kata 7: Anagram Check"
type: "practice"
---

# Kata 7: Anagram Check

Two words are anagrams if they use the exact same letters rearranged. "listen" and "silent" are anagrams.

## Rules

Write `is_anagram(s1, s2)` that returns `True` if the two strings are anagrams.
- Ignore case
- Ignore spaces

## Examples

```
is_anagram("listen", "silent")          → True
is_anagram("hello", "world")            → False
is_anagram("Astronomer", "Moon starer") → True
```

Hint: Clean both strings (lowercase, remove spaces), sort the characters, and compare.

### Initial Code

```python
def is_anagram(s1, s2):
    clean1 = sorted(s1.lower().replace(" ", ""))
    clean2 = sorted(s2.lower().replace(" ", ""))
    return 
```

### Evaluation Code

```python
assert is_anagram("listen", "silent") == True
assert is_anagram("hello", "world") == False
assert is_anagram("Astronomer", "Moon starer") == True
assert is_anagram("Listen", "Silent") == True, "Should ignore case"
assert is_anagram("abc", "cba") == True
assert is_anagram("abc", "abcd") == False, "Different lengths"
assert is_anagram("rat", "car") == False
assert is_anagram("Dormitory", "Dirty room") == True
assert is_anagram("The eyes", "They see") == True
assert is_anagram("a", "a") == True
assert is_anagram("a", "b") == False
assert is_anagram("", "") == True, "Empty strings are anagrams"
print("All tests passed!")
```
