---
title: "Kata 9: Reverse Words"
type: "practice"
---

# Kata 9: Reverse Words

Reverse the order of words in a sentence, keeping each word's letters intact.

## Rules

Write a function `reverse_words(sentence)` that:
- Reverses the order of words, not the letters within each word
- Handles multiple spaces between words — treat them as one separator
- Returns no leading or trailing spaces

## Examples

```
reverse_words("Hello World")      → "World Hello"
reverse_words("I love Python")    → "Python love I"
reverse_words("  spaces  here  ") → "here spaces"
reverse_words("one")              → "one"
reverse_words("")                 → ""
```

## Things to think about

- `sentence.split()` with no arguments splits on any whitespace and automatically removes empty strings from extra spaces.
- After splitting, you have a list of words. Reverse that list.
- `list[::-1]` reverses a list.
- Join the reversed list back into a string with `" ".join(...)`.

### Initial Code

```python
def reverse_words(sentence):
    # your code here
    pass
```

### Evaluation Code

```python
assert reverse_words("Hello World") == "World Hello"
assert reverse_words("I love Python") == "Python love I"
assert reverse_words("one") == "one"
assert reverse_words("  spaces  here  ") == "here spaces", "Should handle extra spaces"
assert reverse_words("a b c d e") == "e d c b a"
assert reverse_words("The quick brown fox") == "fox brown quick The"
assert reverse_words("") == "", "Empty string"
assert reverse_words("   ") == "", "Only spaces"
assert reverse_words("Hello  World") == "World Hello", "Multiple spaces between words"
result = reverse_words("Hello World")
assert result == result.strip(), "No leading or trailing spaces in result"
print("All tests passed!")
```
