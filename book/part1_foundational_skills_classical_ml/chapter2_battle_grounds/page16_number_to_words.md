---
title: "Kata 16: Number to Words"
type: "practice"
---

# Kata 16: Number to Words

Convert a number (0 to 99) into its English word representation.

## Rules

Write `number_to_words(n)` that converts integers 0 to 99 to English words.
- 0 to 19 have unique names
- 20, 30, 40... 90 are "twenty", "thirty"... "ninety"
- 21 to 99 (excluding multiples of 10) use a hyphen: "twenty-one", "forty-two"

## Examples

```
number_to_words(0)  → "zero"
number_to_words(13) → "thirteen"
number_to_words(42) → "forty-two"
number_to_words(99) → "ninety-nine"
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
        return tens[n // 10] + "-" + ones[n % 10]
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
print("All tests passed!")
```
