---
title: "Kata 14: Roman Numerals"
type: "practice"
---

# Kata 14: Roman Numerals

Convert an integer to its Roman numeral representation.

## Rules

Write a function `to_roman(n)` that converts an integer from 1 to 3999 into a Roman numeral string.

| Symbol | Value |
|--------|-------|
| M | 1000 |
| CM | 900 |
| D | 500 |
| CD | 400 |
| C | 100 |
| XC | 90 |
| L | 50 |
| XL | 40 |
| X | 10 |
| IX | 9 |
| V | 5 |
| IV | 4 |
| I | 1 |

## Examples

```
to_roman(4)    → "IV"
to_roman(9)    → "IX"
to_roman(58)   → "LVIII"
to_roman(1994) → "MCMXCIV"
to_roman(2024) → "MMXXIV"
```

## Things to think about

- Create a list of `(value, symbol)` pairs ordered from largest to smallest.
- Loop through the list. While `n >= value`, add the symbol to your result and subtract the value from `n`.
- The subtractive pairs like `CM`, `CD`, `XC`, `XL`, `IX`, `IV` must be in the list — they are not derived automatically.
- Keep subtracting until `n` reaches 0.

### Initial Code

```python
def to_roman(n):
    # your code here
    pass
```

### Evaluation Code

```python
assert to_roman(1) == "I"
assert to_roman(3) == "III"
assert to_roman(4) == "IV", "4 is IV not IIII"
assert to_roman(9) == "IX", "9 is IX not VIIII"
assert to_roman(14) == "XIV"
assert to_roman(40) == "XL"
assert to_roman(58) == "LVIII"
assert to_roman(90) == "XC"
assert to_roman(399) == "CCCXCIX"
assert to_roman(400) == "CD"
assert to_roman(900) == "CM"
assert to_roman(1994) == "MCMXCIV"
assert to_roman(2024) == "MMXXIV"
assert to_roman(3999) == "MMMCMXCIX"
assert isinstance(to_roman(10), str), "Must return a string"
print("All tests passed!")
```
