---
title: "Kata 3: Caesar Cipher"
type: "practice"
---

# Kata 3: Caesar Cipher

Julius Caesar encrypted messages by shifting each letter a fixed number of positions in the alphabet.

## Rules

Write `caesar_cipher(text, shift)` that:
- Shifts each letter by `shift` positions
- Wraps around — shifting `'z'` by 1 gives `'a'`
- Preserves case — uppercase stays uppercase
- Leaves non-letters unchanged (spaces, numbers, punctuation)

## Examples

```
caesar_cipher("abc", 1)           → "bcd"
caesar_cipher("xyz", 3)           → "abc"
caesar_cipher("Hello, World!", 3) → "Khoor, Zruog!"
```

Hint: Use `ord()` to get a character's number and `chr()` to convert back. `'a'` is 97, `'A'` is 65. Use `% 26` to wrap around.

### Initial Code

```python
def caesar_cipher(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = 65 if char.isupper() else 97
            shifted = chr((ord(char) - base + shift) % 26 + base)
            result += shifted
        else:
            result += char
    return result
```

### Evaluation Code

```python
assert caesar_cipher("abc", 1) == "bcd", f"Got {caesar_cipher('abc', 1)}"
assert caesar_cipher("xyz", 3) == "abc", "Should wrap around"
assert caesar_cipher("Hello, World!", 3) == "Khoor, Zruog!", f"Got {caesar_cipher('Hello, World!', 3)}"
assert caesar_cipher("Hello", 0) == "Hello", "Shift 0 should not change anything"
assert caesar_cipher("ABC", 1) == "BCD", "Should preserve uppercase"
assert caesar_cipher("XYZ", 3) == "ABC", "Uppercase should wrap"
assert caesar_cipher("Hello World", 13) == "Uryyb Jbeyq", "ROT13 test"
assert caesar_cipher("Uryyb Jbeyq", 13) == "Hello World", "ROT13 is its own inverse"
assert caesar_cipher("a1b2c3", 1) == "b1c2d3", "Numbers should be unchanged"
assert caesar_cipher("", 5) == "", "Empty string"
assert caesar_cipher("z", 1) == "a", "z wraps to a"
assert caesar_cipher("Z", 1) == "A", "Z wraps to A"
print("All tests passed!")
```
