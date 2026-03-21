---
title: "Kata 3: Caesar Cipher"
type: "practice"
---

# Kata 3: Caesar Cipher

Julius Caesar encrypted messages by shifting each letter a fixed number of positions in the alphabet.

## Rules

Write a function `caesar_cipher(text, shift)` that:
- Shifts each letter by `shift` positions forward in the alphabet
- Wraps around — shifting `'z'` by 1 gives `'a'`
- Preserves case — uppercase letters stay uppercase, lowercase stay lowercase
- Leaves non-letter characters unchanged (spaces, numbers, punctuation stay as-is)

## Examples

```
caesar_cipher("abc", 1)           → "bcd"
caesar_cipher("xyz", 3)           → "abc"
caesar_cipher("Hello, World!", 3) → "Khoor, Zruog!"
caesar_cipher("Hello", 0)         → "Hello"
```

## Things to think about

- `ord(char)` gives the ASCII number of a character. `chr(number)` converts back to a character.
- `'a'` is 97, `'A'` is 65. Use these as your base depending on the case.
- Use `% 26` to wrap around the alphabet.
- The formula is: `chr((ord(char) - base + shift) % 26 + base)`
- Check `char.isalpha()` before shifting. If it is not a letter, keep it unchanged.

### Initial Code

```python
def caesar_cipher(text, shift):
    # your code here
    pass
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
