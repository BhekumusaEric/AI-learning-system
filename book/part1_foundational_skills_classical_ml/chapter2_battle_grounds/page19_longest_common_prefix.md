---
title: "Kata 19: Longest Common Prefix"
type: "practice"
---

# Kata 19: Longest Common Prefix

Find the longest string that is a prefix of every word in a list.

## Rules

Write `longest_common_prefix(words)` that:
- Returns the longest prefix shared by all words
- Returns `""` if there is no common prefix or the list is empty

## Examples

```
longest_common_prefix(["flower","flow","flight"])         → "fl"
longest_common_prefix(["dog","racecar","car"])             → ""
longest_common_prefix(["interview","interact","interface"]) → "inter"
```

Hint: Start with the first word as your candidate prefix. For each remaining word, shorten the prefix by one character from the end until the word starts with it.

### Initial Code

```python
def longest_common_prefix(words):
    if not words:
        return ""
    prefix = words[0]
    for word in words[1:]:
        while not word.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix
```

### Evaluation Code

```python
assert longest_common_prefix(["flower","flow","flight"]) == "fl"
assert longest_common_prefix(["dog","racecar","car"]) == ""
assert longest_common_prefix(["interview","interact","interface"]) == "inter"
assert longest_common_prefix(["same","same","same"]) == "same"
assert longest_common_prefix([]) == "", "Empty list"
assert longest_common_prefix(["alone"]) == "alone", "Single word"
assert longest_common_prefix(["ab","a"]) == "a"
assert longest_common_prefix(["abc","abcd","abcde"]) == "abc"
assert longest_common_prefix(["","abc"]) == "", "Empty string in list"
assert longest_common_prefix(["abc","abd","abe"]) == "ab"
print("All tests passed!")
```
