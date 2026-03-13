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

### Hints
- Use `for item in list:`
- Indent the print statement
- The loop variable can be any name you like