---
title: "String Methods: Cleaning Text"
type: "read"
---

# String Methods: Cleaning Text

## Why String Methods Matter

Raw text data is messy — extra spaces, mixed capitalisation, unwanted characters. Before any NLP or data analysis, you need to **clean** your strings. Python has built-in methods for all of this.

## The Most Useful Methods

### Case

```python
text = "Hello World"
text.lower()   # "hello world"
text.upper()   # "HELLO WORLD"
```

### Stripping Whitespace

```python
text = "  hello  "
text.strip()   # "hello"       — removes both ends
text.lstrip()  # "hello  "     — removes left only
text.rstrip()  # "  hello"     — removes right only
```

### Splitting and Joining

```python
sentence = "the cat sat on the mat"
words = sentence.split()         # ["the", "cat", "sat", "on", "the", "mat"]
words = sentence.split(",")      # split on a specific character

" | ".join(["a", "b", "c"])      # "a | b | c"
```

### Replacing

```python
text = "I love cats"
text.replace("cats", "dogs")     # "I love dogs"
```

### Checking Content

```python
"hello".startswith("he")   # True
"hello".endswith("lo")     # True
"hello".contains("ell")    # AttributeError! Use 'in' instead:
"ell" in "hello"           # True
```

### Finding and Counting

```python
"banana".count("a")        # 3
"banana".find("n")         # 2  (index of first match, -1 if not found)
```

## Chaining Methods

Methods can be chained together:

```python
"  Hello, World!  ".strip().lower().replace(",", "")
# "hello world!"
```

## Remember
- Strings are **immutable** — methods return a new string, they don't change the original
- `split()` with no argument splits on any whitespace and removes empty strings
- These methods are the foundation of all text preprocessing in NLP
