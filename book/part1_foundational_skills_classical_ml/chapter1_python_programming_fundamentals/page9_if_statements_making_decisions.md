---
title: "Python Official Documentation"
type: "read"
resources:
  - title: "Python Control Flow: if statements"
    url: "https://docs.python.org/3/tutorial/controlflow.html#if-statements"
---

# If Statements: Making Decisions

## Conditional Statements

If statements let your code make decisions. Based on whether something is true or false, the code can take different paths.

### Basic If Statement

```python
age = 16

if age >= 16:
    print("You can drive!")
```

### If-Else Statement

```python
temperature = 25

if temperature > 20:
    print("It's warm outside")
else:
    print("It's cool outside")
```

### If-Elif-Else Statement

```python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
else:
    print("F")
```

### Comparison Operators
- `==` equal to
- `!=` not equal to
- `>` greater than
- `<` less than
- `>=` greater than or equal
- `<=` less than or equal

### Logical Operators
- `and` - both conditions must be true
- `or` - at least one condition must be true
- `not` - reverses the condition

### Remember
- Conditions evaluate to True or False
- Code blocks are indented
- elif is short for "else if"
- Only one branch executes

Next, practice making decisions with if statements!