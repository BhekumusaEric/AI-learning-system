---
title: "Kata 15: Balanced Brackets"
type: "practice"
---

# Kata 15: Balanced Brackets

Check if every opening bracket has a matching closing bracket in the correct order.

## Rules

Write `is_balanced(s)` that returns `True` if all brackets are properly balanced and nested.
- Bracket pairs: `()`, `[]`, `{}`
- Ignore all non-bracket characters

## Examples

```
is_balanced("()")       → True
is_balanced("()[]{}")   → True
is_balanced("([])")     → True
is_balanced("(]")       → False
is_balanced("([)]")     → False
```

Hint: Use a stack (a list). Push opening brackets onto it. When you see a closing bracket, check if the top of the stack is the matching opener. If not, return False. At the end, the stack must be empty.

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
    return len(stack) == 0
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
