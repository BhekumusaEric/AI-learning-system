---
title: "String Methods Practice"
type: "practice"
---

# String Methods Practice

## Task

Write a function `clean_and_count(text)` that:
1. Strips leading/trailing whitespace
2. Converts to lowercase
3. Returns a dictionary with:
   - `"cleaned"` — the cleaned string
   - `"word_count"` — number of words
   - `"char_count"` — number of characters (after cleaning, excluding spaces)

## Examples

```
clean_and_count("  Hello World  ")
→ {"cleaned": "hello world", "word_count": 2, "char_count": 10}

clean_and_count("  The Cat Sat  ")
→ {"cleaned": "the cat sat", "word_count": 3, "char_count": 9}
```

## Things to think about

- Strip first, then lowercase — order matters for `char_count`
- `char_count` counts only non-space characters: `"hello world"` → 10 (`h,e,l,l,o,w,o,r,l,d`)
- `split()` with no argument handles multiple spaces correctly
- `replace(" ", "")` removes all spaces for counting

### Initial Code

```python
def clean_and_count(text):
    pass
```

### Evaluation Code

```python
r1 = clean_and_count("  Hello World  ")
assert r1["cleaned"] == "hello world", f"Got {r1['cleaned']}"
assert r1["word_count"] == 2, f"Got {r1['word_count']}"
assert r1["char_count"] == 10, f"Got {r1['char_count']}"

r2 = clean_and_count("  The Cat Sat  ")
assert r2["cleaned"] == "the cat sat", f"Got {r2['cleaned']}"
assert r2["word_count"] == 3, f"Got {r2['word_count']}"
assert r2["char_count"] == 9, f"Got {r2['char_count']}"

r3 = clean_and_count("PYTHON")
assert r3["cleaned"] == "python", f"Got {r3['cleaned']}"
assert r3["word_count"] == 1, f"Got {r3['word_count']}"
assert r3["char_count"] == 6, f"Got {r3['char_count']}"

r4 = clean_and_count("  a b c  ")
assert r4["word_count"] == 3, f"Got {r4['word_count']}"
assert r4["char_count"] == 3, f"Got {r4['char_count']}"

assert set(clean_and_count("test").keys()) == {"cleaned", "word_count", "char_count"}, "Must return dict with 3 keys"
print("All tests passed!")
```
