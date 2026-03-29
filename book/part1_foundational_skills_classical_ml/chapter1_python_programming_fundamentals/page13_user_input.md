---
title: "User Input: Talking to Your Program"
type: "read"
video: "https://www.youtube.com/watch?v=mD07T_F20Kk"
---

# User Input: Talking to Your Program

## Getting Input from the User

The `input()` function pauses your program and waits for the user to type something. Whatever they type is returned as a **string**.

```python
name = input("What is your name? ")
print(f"Hello, {name}!")
```

## Input is Always a String

This is the most important thing to remember. Even if the user types a number, `input()` gives you a string:

```python
age = input("How old are you? ")
print(type(age))  # <class 'str'>
```

To use it as a number, you must **convert** it:

```python
age = int(input("How old are you? "))
print(age + 1)  # Now you can do math
```

## Converting Input Types

| You want | Use |
|----------|-----|
| Whole number | `int(input(...))` |
| Decimal number | `float(input(...))` |
| Text (default) | `input(...)` |

## Example: Simple Calculator

```python
a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
print(f"Sum: {a + b}")
```

## Remember
- `input()` always returns a string
- Wrap with `int()` or `float()` to convert to a number
- The text inside `input("...")` is the prompt shown to the user
- In automated tests, `input()` is simulated — your function receives values directly as parameters instead
