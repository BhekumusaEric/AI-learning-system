---
title: "Kata 16: Number to Words"
type: "practice"
---

# ⚔️ Kata 16: Number to Words

Convert a number (0–99) into its English word representation.

## Rules

Write `number_to_words(n)` that:
- Converts integers 0–99 to their English words
- `0` → `"zero"`, `1` → `"one"`, ..., `19` → `"nineteen"`
- `20` → `"twenty"`, `21` → `"twenty-one"`, ..., `99` → `"ninety-nine"`
- Use a **hyphen** for compound numbers (21–99 except multiples of 10)

## Examples

```
number_to_words(0)   → "zero"
number_to_words(13)  → "thirteen"
number_to_words(20)  → "twenty"
number_to_words(42)  → "forty-two"
number_to_words(99)  → "ninety-nine"
```

### Initial Code

```python
def number_to_words(n):
    ones = ["zero","one","two","three","four","five","six","seven","eight","nine",
            "ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen",
            "seventeen","eighteen","nineteen"]
    tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"]

    if n < 20:
        return ones[n]
    elif n % 10 == 0:
        return tens[n // 10]
    else:
        return 
```

### Evaluation Code

```python
assert number_to_words(0) == "zero"
assert number_to_words(1) == "one"
assert number_to_words(13) == "thirteen"
assert number_to_words(19) == "nineteen"
assert number_to_words(20) == "twenty"
assert number_to_words(21) == "twenty-one"
assert number_to_words(30) == "thirty"
assert number_to_words(42) == "forty-two"
assert number_to_words(50) == "fifty"
assert number_to_words(55) == "fifty-five"
assert number_to_words(99) == "ninety-nine"
assert number_to_words(80) == "eighty"
assert number_to_words(11) == "eleven"
assert number_to_words(15) == "fifteen"
assert "-" in number_to_words(21), "Compound numbers need a hyphen"
print("✅ All tests passed!")
```
