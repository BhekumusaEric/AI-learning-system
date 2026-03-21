---
title: "Kata 19: Longest Common Prefix"
type: "practice"
---

# Kata 19: Longest Common Prefix

Find the longest string that is a prefix of every word in a list.

## Rules

Write a function `longest_common_prefix(words)` that:
- Returns the longest prefix shared by all words in the list
- Returns `""` if there is no common prefix or the list is empty

## Examples

```
longest_common_prefix(["flower","flow","flight"])          → "fl"
longest_common_prefix(["dog","racecar","car"])              → ""
longest_common_prefix(["interview","interact","interface"]) → "inter"
longest_common_prefix(["same","same","same"])               → "same"
longest_common_prefix(["alone"])                            → "alone"
```

## Things to think about

- Start with the first word as your candidate prefix.
- For each remaining word, check if it starts with the current prefix using `.startswith(prefix)`.
- If it does not, shorten the prefix by one character from the end: `prefix = prefix[:-1]`.
- Keep shortening until the word starts with the prefix, or the prefix becomes empty.
- If the prefix becomes empty at any point, return `""` immediately.
- An empty input list should return `""`.

### Initial Code

```python
def longest_common_prefix(words):
    # your code here
    pass
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
