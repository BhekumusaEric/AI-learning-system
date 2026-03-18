---
title: "List Challenge"
type: "read"
resources:
  - title: "W3Schools: Python Lists"
    url: "https://www.w3schools.com/python/python_lists.asp"
---

# List Challenge

## Practice: Working with Lists

Create a list of your favorite foods, access specific items, and modify the list.

### Initial Code

```python
# Create and modify a list

# 1. Create a list called 'favorite_foods' with 3 foods
favorite_foods = 

# 2. Access the second item (index 1) and store it in 'second_food'
second_food = 

# 3. Change the first item to "pizza"
# (Modify favorite_foods[0])

# 4. Add "ice cream" to the end of the list

# Don't change the code below - it's for testing
def check_list():
    return favorite_foods, second_food
```

### Hidden Tests

Test 1: favorite_foods has 4 items (original 3 + ice cream)
Test 2: second_food is the original second item
Test 3: First item changed to "pizza"
Test 4: "ice cream" added to the end

### Evaluation Code
```python
# Evaluate lists
assert type(favorite_foods) == list, "Expected 'favorite_foods' to be a list"
assert len(favorite_foods) == 4, "Expected 'favorite_foods' to have exactly 4 items at the end"
assert favorite_foods[0] == "pizza", "Expected the first item in 'favorite_foods' to be changed to 'pizza'"
assert favorite_foods[-1] == "ice cream", "Expected 'ice cream' to be the last item in 'favorite_foods'"
assert type(second_food) == str and len(second_food) > 0, "Expected 'second_food' to be a valid string from your original list"
```

### Hints
- Use square brackets to create lists
- Indices start at 0
- Use append() to add items
- Direct assignment changes items