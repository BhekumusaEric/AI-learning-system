---
title: "Kata 16: Number to Words"
type: "practice"
---

# Kata 16: Number to Words

Convert a number from 0 to 99 into its English word representation.

## Rules

Write a function `number_to_words(n)` that converts an integer to its English word string.
- 0 to 19 each have a unique name
- 20, 30, 40... 90 are "twenty", "thirty"... "ninety"
- Numbers 21 to 99 that are not multiples of 10 use a hyphen: "twenty-one", "forty-two", "ninety-nine"

## Examples

```
number_to_words(0)  → "zero"
number_to_words(13) → "thirteen"
number_to_words(20) → "twenty"
number_to_words(42) → "forty-two"
number_to_words(99) → "ninety-nine"
```

## Things to think about

- Define two lookup lists: one for 0-19, one for the tens (20, 30... 90).
- For numbers less than 20, return directly from the ones list.
- For exact multiples of 10 (20, 30...), return from the tens list.
- For everything else, combine the tens word, a hyphen, and the ones word.
- `n // 10` gives the tens digit, `n % 10` gives the ones digit.

### Initial Code

```python
def number_to_words(n):
    # your code here
    pass
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
