---
title: "User Input Practice"
type: "practice"
---

# User Input Practice

Since automated tests can't type at a keyboard, your functions receive values as **parameters** instead of calling `input()` directly. This is exactly how real programs work too — the logic is separated from the input.

## Task

Write a function `greet_user(name, age)` that:
- Takes a name (string) and age (integer) as parameters
- Returns a greeting string in this exact format:

```
Hello, Alice! You are 17 years old.
```

## Examples

```
greet_user("Alice", 17)  → "Hello, Alice! You are 17 years old."
greet_user("Bob", 14)    → "Hello, Bob! You are 14 years old."
```

## Things to think about

- Use an f-string to build the return string
- The age comes in as an integer — f-strings handle that automatically
- Match the format exactly: comma after name, exclamation mark, "You are X years old."

### Initial Code

```python
def greet_user(name, age):
    pass
```

### Evaluation Code

```python
assert greet_user("Alice", 17) == "Hello, Alice! You are 17 years old.", f"Got {greet_user('Alice', 17)}"
assert greet_user("Bob", 14) == "Hello, Bob! You are 14 years old.", f"Got {greet_user('Bob', 14)}"
assert greet_user("Sam", 18) == "Hello, Sam! You are 18 years old.", f"Got {greet_user('Sam', 18)}"
assert greet_user("SAAIO", 1) == "Hello, SAAIO! You are 1 years old.", f"Got {greet_user('SAAIO', 1)}"
assert isinstance(greet_user("Alice", 17), str), "Return value must be a string"
print("All tests passed!")
```
