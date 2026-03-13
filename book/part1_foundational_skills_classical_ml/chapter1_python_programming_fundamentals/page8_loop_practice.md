---
title: "Python Official Documentation"
type: "read"
resources:
  - title: "W3Schools: Python For Loops"
    url: "https://www.w3schools.com/python/python_for_loops.asp"
---

# Loop Practice

## Practice: Writing Loops

Write a for loop that prints each item in the given list.

### Initial Code

```python
# Write a loop to print each color

colors = ["red", "blue", "green", "yellow"]

# Write your loop here
# It should print each color on a separate line

# Don't change the code below - it's for testing

def check_loop():
    output_lines = _stdout.strip().splitlines()
    expected = ["red", "blue", "green", "yellow"]
    return output_lines == expected

```

### Hidden Tests

Test 1: All colors printed in order
Test 2: Each color on separate line
Test 3: Uses for loop syntax
Test 4: No syntax errors

### Evaluation Code
```python
import sys
output = sys.stdout.getvalue().strip()
lines = output.split('\n')
# We have 4 colors
assert len(lines) >= 4, "Expected the output to have at least 4 printed lines for the colors"
assert "red" in output, "Expected 'red' to be printed"
assert "blue" in output, "Expected 'blue' to be printed"
assert "green" in output, "Expected 'green' to be printed"
assert "yellow" in output, "Expected 'yellow' to be printed"
```

### Hints
- Use `for item in list:`
- Indent the print statement
- The loop variable can be any name you like