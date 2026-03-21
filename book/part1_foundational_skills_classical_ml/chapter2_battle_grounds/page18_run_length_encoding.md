---
title: "Kata 18: Run-Length Encoding"
type: "practice"
---

# Kata 18: Run-Length Encoding

A simple text compression technique. Consecutive repeated characters are replaced with the character and its count.

## Rules

Write two functions:

`encode(s)` — compresses a string using run-length encoding.
- `"aaa"` becomes `"3a"`, `"aabbb"` becomes `"2a3b"`
- Single characters still get a count: `"ab"` becomes `"1a1b"`

`decode(s)` — decompresses a run-length encoded string back to the original.
- `"3a"` becomes `"aaa"`, `"2a3b"` becomes `"aabbb"`

## Examples

```
encode("aabbbcccc") → "2a3b4c"
encode("abcd")      → "1a1b1c1d"
decode("2a3b4c")    → "aabbbcccc"
decode("10a")       → "aaaaaaaaaa"
```

## Things to think about

For `encode`:
- Walk through the string, counting consecutive identical characters.
- When the character changes, append the count and the character to your result, then reset the count.
- Do not forget to handle the last group after the loop ends.

For `decode`:
- Walk through the string reading digits first, then the character that follows.
- The digits may be more than one character long (e.g. `"10a"`), so keep reading while the current character is a digit.
- Repeat the character by the number you read: `char * count`.

### Initial Code

```python
def encode(s):
    # your code here
    pass

def decode(s):
    # your code here
    pass
```

### Evaluation Code

```python
assert encode("aabbbcccc") == "2a3b4c"
assert encode("abcd") == "1a1b1c1d"
assert encode("aaa") == "3a"
assert encode("a") == "1a"
assert encode("") == ""
assert encode("aaabbaaa") == "3a2b3a"
assert decode("2a3b4c") == "aabbbcccc"
assert decode("1a1b1c1d") == "abcd"
assert decode("3a") == "aaa"
assert decode("1a") == "a"
assert decode("") == ""
for s in ["hello", "aabbcc", "zzzzz", "abcde"]:
    assert decode(encode(s)) == s, f"Round-trip failed for '{s}'"
assert decode("10a") == "aaaaaaaaaa", "Handle multi-digit counts"
print("All tests passed!")
```
