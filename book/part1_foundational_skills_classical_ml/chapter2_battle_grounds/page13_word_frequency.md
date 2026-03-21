---
title: "Kata 13: Word Frequency"
type: "practice"
---

# Kata 13: Word Frequency

Count how many times each word appears in a sentence.

## Rules

Write a function `word_frequency(text)` that returns a dictionary mapping each word to its count.
- Ignore case — `"The"` and `"the"` count as the same word
- Strip punctuation from the edges of words: `.`, `,`, `!`, `?`, `"`, `'`

## Examples

```
word_frequency("the cat sat on the mat")
→ {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}

word_frequency("Hello hello HELLO")
→ {"hello": 3}

word_frequency("To be or not to be")
→ {"to": 2, "be": 2, "or": 1, "not": 1}
```

## Things to think about

- Split the text into words using `.split()`.
- For each word, apply `.lower()` and `.strip('.,!?"\'')` to clean it.
- Skip any word that becomes empty after cleaning.
- Use a dictionary to count: `counts[word] = counts.get(word, 0) + 1`.
- Return the dictionary at the end.

### Initial Code

```python
def word_frequency(text):
    # your code here
    pass
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
