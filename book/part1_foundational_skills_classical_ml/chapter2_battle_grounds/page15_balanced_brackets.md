---
title: "Kata 15: Balanced Brackets"
type: "practice"
---

# ⚔️ Kata 15: Balanced Brackets

A classic stack problem. Check if brackets in a string are properly balanced and nested.

## Rules

Write `is_balanced(s)` that:
- Returns `True` if every opening bracket has a matching closing bracket in the right order
- Brackets: `()`, `[]`, `{}`
- Ignore all non-bracket characters

## Examples

```
is_balanced("()")          → True
is_balanced("()[]{}")      → True
is_balanced("([])")        → True
is_balanced("(]")          → False
is_balanced("([)]")        → False
is_balanced("{[]}")        → True
```

> **Hint:** Use a **stack** (a list). Push opening brackets. When you see a closing bracket, check if the top of the stack is the matching opener.

### Initial Code

```python
def is_balanced(s):
    stack = []
    matching = {')': '(', ']': '[', '}': '{'}
    for char in s:
        if char in '([{':
            stack.append(char)
        elif char in ')]}':
            if not stack or stack[-1] != matching[char]:
                return False
            stack.pop()
    # Valid only if stack is empty at the end
    return 
```

### Evaluation Code

```python
assert is_balanced("()") == True
assert is_balanced("()[]{}") == True
assert is_balanced("([])") == True
assert is_balanced("{[]}") == True
assert is_balanced("(]") == False, "Mismatched types"
assert is_balanced("([)]") == False, "Wrong order"
assert is_balanced("{") == False, "Unclosed bracket"
assert is_balanced(")") == False, "Closing without opening"
assert is_balanced("") == True, "Empty string is balanced"
assert is_balanced("hello (world)") == True, "Ignore non-brackets"
assert is_balanced("a(b[c{d}e]f)g") == True
assert is_balanced("(((())))") == True
assert is_balanced("(((())") == False, "More openers than closers"
assert is_balanced("((()))[]{}") == True
print("✅ All tests passed!")
```
