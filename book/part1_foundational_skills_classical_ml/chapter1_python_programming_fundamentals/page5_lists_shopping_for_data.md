---
title: "Lists: Shopping for Data"
type: "read"
resources:
  - title: "Python Data Structures: Lists"
    url: "https://docs.python.org/3/tutorial/datastructures.html"
---

# Lists: Shopping for Data

## Lists in Python

Lists are like shopping lists for your code. They store multiple items in a specific order. Each item can be accessed by its position (index).

### Creating Lists

```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, True, 3.14]
```

### Accessing Items

```python
first_fruit = fruits[0]  # "apple" (indices start at 0)
second_fruit = fruits[1] # "banana"
```

### Modifying Lists

```python
fruits.append("orange")  # Add to end
fruits[0] = "grape"      # Change first item
fruits.remove("banana")  # Remove specific item
```

### List Operations
- `len(list)` - Get number of items
- `list.append(item)` - Add item to end
- `list.insert(index, item)` - Insert at specific position
- `list.remove(item)` - Remove first occurrence
- `list.pop(index)` - Remove and return item at index

### Remember
- Lists are ordered (position matters)
- Lists can contain different data types
- Use square brackets `[]` to create lists
- Indices start at 0, not 1

Next, practice working with lists!