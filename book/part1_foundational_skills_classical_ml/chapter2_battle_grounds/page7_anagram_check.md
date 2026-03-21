---
title: "Kata 7: Anagram Check"
type: "practice"
---

# Kata 7: Anagram Check

Two words are anagrams if they use the exact same letters rearranged. "listen" and "silent" are anagrams.

## Rules

Write a function `is_anagram(s1, s2)` that returns `True` if the two strings are anagrams of each other, `False` otherwise.
- Ignore case
- Ignore spaces

## Examples

```
is_anagram("listen", "silent")          → True
is_anagram("hello", "world")            → False
is_anagram("Astronomer", "Moon starer") → True
is_anagram("Dormitory", "Dirty room")   → True
is_anagram("The eyes", "They see")      → True
```

## Things to think about

- Clean both strings: convert to lowercase and remove all spaces.
- Two strings are anagrams if their sorted characters are identical.
- `sorted("abc")` returns `['a', 'b', 'c']` — you can compare two sorted lists directly.
- Different lengths after cleaning means they cannot be anagrams.

### Initial Code

```python
def is_anagram(s1, s2):
    # your code here
    pass
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
