---
title: "Kata 7: Anagram Check"
type: "practice"
---

# ⚔️ Kata 7: Anagram Check

Two words are anagrams if they use the exact same letters, just rearranged. "listen" and "silent" are anagrams.

## Rules

Write `is_anagram(s1, s2)` that:
- Returns `True` if `s1` and `s2` are anagrams, `False` otherwise
- **Ignore case** — `"Listen"` and `"Silent"` are anagrams
- **Ignore spaces** — `"Astronomer"` and `"Moon starer"` are anagrams
- A word is **not** an anagram of itself... wait, actually it is — same letters!

## Examples

```
is_anagram("listen", "silent")     → True
is_anagram("hello", "world")       → False
is_anagram("Astronomer", "Moon starer") → True
```

> **Hint:** Sort both strings and compare. If the sorted versions are equal, they're anagrams.

### Initial Code

```python
def is_anagram(s1, s2):
    # Clean both strings: lowercase, remove spaces
    clean1 = 
    clean2 = 
    # Sort and compare
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
print("✅ All tests passed!")
```
