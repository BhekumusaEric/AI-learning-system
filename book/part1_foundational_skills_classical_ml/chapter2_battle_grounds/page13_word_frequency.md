---
title: "Kata 13: Word Frequency"
type: "practice"
---

# ⚔️ Kata 13: Word Frequency

Count how many times each word appears in a sentence.

## Rules

Write `word_frequency(text)` that:
- Returns a **dictionary** mapping each word to its count
- **Ignore case** — `"The"` and `"the"` are the same word
- **Ignore punctuation** — strip `.`, `,`, `!`, `?`, `"`, `'` from words
- Words are separated by spaces

## Examples

```
word_frequency("the cat sat on the mat")
→ {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}

word_frequency("Hello hello HELLO")
→ {"hello": 3}
```

> **Hint:** Use `.lower()` and `.strip('.,!?"\\'')` on each word.

### Initial Code

```python
def word_frequency(text):
    counts = {}
    words = text.split()
    for word in words:
        # Clean: lowercase and strip punctuation
        cleaned = word.lower().strip('.,!?"\'')
        if cleaned:  # skip empty strings
            counts[cleaned] = counts.get(cleaned, 0) + 1
    return counts
```

### Evaluation Code

```python
assert word_frequency("the cat sat on the mat") == {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}
assert word_frequency("Hello hello HELLO") == {"hello": 3}, "Should ignore case"
assert word_frequency("") == {}, "Empty string"
assert word_frequency("one") == {"one": 1}
result = word_frequency("Hello, world! Hello.")
assert result.get("hello") == 2, "Should strip punctuation"
assert result.get("world") == 1
result2 = word_frequency("To be or not to be")
assert result2["to"] == 2
assert result2["be"] == 2
assert result2["or"] == 1
assert isinstance(word_frequency("test"), dict), "Must return a dict"
result3 = word_frequency("It's a test, it's only a test.")
assert result3.get("it's") == 2 or result3.get("its") == 2, "Handle apostrophes"
print("✅ All tests passed!")
```
