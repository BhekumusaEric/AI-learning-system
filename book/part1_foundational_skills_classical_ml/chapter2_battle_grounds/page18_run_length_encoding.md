---
title: "Kata 18: Run-Length Encoding"
type: "practice"
---

# ⚔️ Kata 18: Run-Length Encoding

A simple compression technique. Consecutive repeated characters are replaced with the character and its count.

## Rules

Write `encode(s)` that:
- Compresses a string using run-length encoding
- `"aaa"` → `"3a"`, `"ab"` → `"1a1b"`, `"aabbb"` → `"2a3b"`

Write `decode(s)` that:
- Decompresses a run-length encoded string back to the original
- `"3a"` → `"aaa"`, `"2a3b"` → `"aabbb"`

## Examples

```
encode("aabbbcccc")  → "2a3b4c"
encode("abcd")       → "1a1b1c1d"
decode("2a3b4c")     → "aabbbcccc"
decode("1a1b1c1d")   → "abcd"
```

### Initial Code

```python
def encode(s):
    if not s:
        return ""
    result = ""
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            result += str(count) + s[i - 1]
            count = 1
    result += str(count) + s[-1]
    return result

def decode(s):
    result = ""
    i = 0
    while i < len(s):
        # Read the number (may be multiple digits)
        num_str = ""
        while i < len(s) and s[i].isdigit():
            num_str += s[i]
            i += 1
        # Read the character
        if i < len(s):
            result += 
            i += 1
    return result
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
# Encode then decode should give original
for s in ["hello", "aabbcc", "zzzzz", "abcde"]:
    assert decode(encode(s)) == s, f"Round-trip failed for '{s}'"
assert decode("10a") == "aaaaaaaaaa", "Handle multi-digit counts"
print("✅ All tests passed!")
```
