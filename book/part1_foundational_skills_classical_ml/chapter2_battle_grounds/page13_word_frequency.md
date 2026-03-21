---
title: "Kata 13: Word Frequency"
type: "practice"
---

# Kata 13: Word Frequency

Count how many times each word appears in a sentence.

## Rules

Write `word_frequency(text)` that returns a dictionary mapping each word to its count.
- Ignore case — "The" and "the" are the same word
- Strip punctuation from the edges of words (`.`, `,`, `!`, `?`, `"`, `'`)

## Examples

```
word_frequency("the cat sat on the mat")
→ {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}

word_frequency("Hello hello HELLO")
→ {"hello": 3}
```

### Initial Code

```python
def word_frequency(text):
    counts = {}
    words = text.split()
    for word in words:
        cleaned = word.lower().strip('.,!?"\'')
        if cleaned:
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
print("All tests passed!")
```
