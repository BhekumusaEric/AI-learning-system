---
title: "Python Official Documentation"
type: "read"
resources:
  - title: "Python Control Flow: for statements"
    url: "https://docs.python.org/3/tutorial/controlflow.html#for-statements"
---

# For Loops: Doing Things Repeatedly

## Loops in Python

For loops let you repeat code for each item in a collection (like a list). Instead of writing the same code multiple times, you write it once and let the loop handle the repetition.

### Basic For Loop

```python
fruits = ["apple", "banana", "cherry"]

for fruit in fruits:
    print(fruit)
```

This will print:
```
apple
banana
cherry
```

### Loop with Numbers

```python
for i in range(5):
    print(f"Count: {i}")
```

This prints numbers 0 through 4.

### Loop with Index

```python
for i in range(len(fruits)):
    print(f"{i}: {fruits[i]}")
```

### Remember
- `for item in collection:` - loops through each item
- `range(n)` - creates numbers from 0 to n-1
- Indentation matters - code inside the loop must be indented
- Loops save time and reduce errors

Next, practice writing your own loops!