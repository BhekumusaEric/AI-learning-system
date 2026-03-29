---
title: "Dictionaries: Labels for Your Data"
type: "read"
video: "https://www.youtube.com/watch?v=MZZSMaEAC2g"
---

# Dictionaries: Labels for Your Data

## What is a Dictionary?

A dictionary stores data as **key-value pairs** — like a real dictionary where you look up a word (key) to find its definition (value).

```python
student = {
    "name": "Alice",
    "age": 17,
    "score": 95.5
}
```

## Accessing Values

Use the key in square brackets to get a value:

```python
print(student["name"])   # Alice
print(student["score"])  # 95.5
```

## Adding and Updating

```python
student["grade"] = "A"       # Add new key
student["score"] = 98.0      # Update existing key
```

## Removing

```python
del student["age"]           # Remove a key
```

## Useful Methods

```python
student.keys()    # All keys:   dict_keys(["name", "score", "grade"])
student.values()  # All values: dict_values(["Alice", 98.0, "A"])
student.items()   # Both:       [("name", "Alice"), ("score", 98.0), ...]
```

## Looping Over a Dictionary

```python
for key, value in student.items():
    print(f"{key}: {value}")
```

## Why Dictionaries Matter in ML

In machine learning you'll use dictionaries constantly:

```python
# Label maps
label_map = {0: "cat", 1: "dog", 2: "bird"}

# Model results
results = {"accuracy": 0.94, "loss": 0.12, "epochs": 10}

# Word counts (NLP)
word_freq = {"the": 120, "cat": 5, "sat": 3}
```

## Remember
- Keys must be unique — setting the same key twice overwrites the first value
- Keys are usually strings or numbers
- Values can be anything: numbers, strings, lists, even other dictionaries
- Use `.get("key", default)` to safely access a key that might not exist
