---
title: "Kata 15: Balanced Brackets"
type: "practice"
---

# Kata 15: Balanced Brackets

Check if every opening bracket has a matching closing bracket in the correct order.

## Rules

Write a function `is_balanced(s)` that returns `True` if all brackets are properly balanced and nested, `False` otherwise.
- Bracket pairs: `()`, `[]`, `{}`
- Ignore all non-bracket characters

## Examples

```
is_balanced("()")        → True
is_balanced("()[]{}")    → True
is_balanced("([])")      → True
is_balanced("(]")        → False
is_balanced("([)]")      → False
is_balanced("{")         → False
is_balanced("")          → True
```

## Things to think about

- Use a stack — a list where you push and pop from the end.
- When you see an opening bracket `(`, `[`, or `{`, push it onto the stack.
- When you see a closing bracket `)`, `]`, or `}`, check if the top of the stack is the matching opener.
- If the stack is empty when you need to pop, or the top does not match, return `False`.
- At the end, the stack must be empty — any leftover openers mean unmatched brackets.
- Use a dictionary to map each closer to its opener: `{')': '(', ']': '[', '}': '{'}`.

### Initial Code

```python
def is_balanced(s):
    # your code here
    pass
```

### Evaluation Code

```python
assert is_balanced("()") == True
assert is_balanced("()[]{}") == True
assert is_balanced("([])") == True
assert is_balanced("{[]}") == True
assert is_balanced("(]") == False, "Mismatched types"
assert is_balanced("([)]") == False, "Wrong nesting order"
assert is_balanced("{") == False, "Unclosed bracket"
assert is_balanced(")") == False, "Closing without opening"
assert is_balanced("") == True, "Empty string is balanced"
assert is_balanced("hello (world)") == True, "Ignore non-brackets"
assert is_balanced("a(b[c{d}e]f)g") == True
assert is_balanced("(((())))") == True
assert is_balanced("(((())") == False, "More openers than closers"
assert is_balanced("((()))[]{}") == True
print("All tests passed!")
```
