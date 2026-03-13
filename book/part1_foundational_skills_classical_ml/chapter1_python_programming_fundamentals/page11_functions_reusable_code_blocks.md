---
title: "Python Official Documentation"
type: "read"
resources:
  - title: "Defining Functions in Python"
    url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions"
---

# Functions: Reusable Code Blocks

## Functions in Python

Functions are like mini-programs within your code. They package instructions that you can reuse whenever you need them.

### Defining a Function

```python
def greet(name):
    message = f"Hello, {name}!"
    return message
```

### Calling a Function

```python
result = greet("Alice")
print(result)  # Prints: Hello, Alice!
```

### Function with Multiple Parameters

```python
def add_numbers(a, b):
    return a + b

sum_result = add_numbers(3, 5)  # Returns 8
```

### Function without Return

```python
def print_greeting(name):
    print(f"Hello, {name}!")

print_greeting("Bob")  # Prints directly
```

### Remember
- `def function_name(parameters):` defines the function
- Parameters are inputs to the function
- `return` sends a value back (optional)
- Functions make code organized and reusable
- Call functions by name with parentheses

Next, practice writing your own functions!