---
title: "Hello, World! Challenge"
type: "read"
resources:
  - title: "W3Schools: Python Syntax"
    url: "https://www.w3schools.com/python/python_syntax.asp"
---

# Hello, World! Challenge

## Practice: Your First Program

Now it's your turn! Write a Python program that prints "Hello, IOAI!" to the screen.

Use the `print()` function we just learned.

### Initial Code

```python
# Your first Python program
# Print "Hello, IOAI!" to the screen

# Write your code here

```

### Hidden Tests

Test 1: Program prints "Hello, IOAI!" (exact text)
Test 2: No syntax errors
Test 3: Uses print() function

### Evaluation Code
```python
import sys
output = sys.stdout.getvalue().strip()
assert "Hello, IOAI!" in output, 'Expected exact text "Hello, IOAI!" to be printed out'
```

### Hints
- Remember to put text in quotes
- The print() function needs parentheses
- Check your spelling and capitalization