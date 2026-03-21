---
title: "Kata 9: Reverse Words"
type: "practice"
---

# ⚔️ Kata 9: Reverse Words

Reverse the order of words in a sentence — but keep each word's letters in order.

## Rules

Write `reverse_words(sentence)` that:
- Reverses the **order of words**, not the letters
- `"Hello World"` → `"World Hello"`
- Handles **multiple spaces** between words — treat them as one separator
- **Strips** leading/trailing spaces from the result

## Examples

```
reverse_words("Hello World")         → "World Hello"
reverse_words("I love Python")       → "Python love I"
reverse_words("  spaces  here  ")    → "here spaces"
reverse_words("one")                 → "one"
```

> **Hint:** `.split()` with no arguments splits on any whitespace and removes empty strings.

### Initial Code

```python
def reverse_words(sentence):
    words = sentence.split()
    # Reverse the list of words
    reversed_words = 
    return " ".join(reversed_words)
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
assert result == result.strip(), "No leading/trailing spaces in result"
print("✅ All tests passed!")
```
