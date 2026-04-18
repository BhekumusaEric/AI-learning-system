---
title: "Advanced Filtering with Logic"
type: "practice"
resources:
  - title: "Pandas User Guide: Boolean Indexing"
    url: "https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing"
---

# Advanced Filtering with Logic

In the previous page, we did basic filtering. But what if you want to find students who are **over 16 AND have a score above 90**? Or customers who are **either from New York OR spent more than $500**?

Pandas uses specific symbols for these logical "gates":

| Logic | Symbol | Example |
|---|---|---|
| **AND** | `&` | `df[(df['Age'] > 16) & (df['Score'] > 90)]` |
| **OR** | `|` | `df[(df['City'] == 'NY') | (df['Spent'] > 500)]` |
| **NOT** | `~` | `df[~(df['City'] == 'London')]` (Not from London) |

> [!IMPORTANT]
> **Parentheses are mandatory!** You must wrap each condition in `()` or Pandas will get confused about the order of operations.

### Example: The "VIP" Filter
Imagine you have a sales dataset. You want to find "VIP" sales:
```python
# Sales greater than 1000 AND in the 'Electronics' category
vips = df[(df['Amount'] > 1000) & (df['Category'] == 'Electronics')]
```

---

## Practice: The Supermarket Filter

We have a dataset of supermarket transactions. Your task is to filter the data based on multiple conditions.

### Initial Code

```python
import pandas as pd

data = {
    'Item': ['Laptop', 'Bread', 'Phone', 'Milk', 'TV', 'Eggs'],
    'Category': ['Tech', 'Food', 'Tech', 'Food', 'Tech', 'Food'],
    'Price': [1200, 2.5, 800, 1.8, 1500, 3.0],
    'In_Stock': [True, True, False, True, True, False]
}

df = pd.DataFrame(data)

# 1. Filter for Tech items that are currently in stock
# Store in: tech_available
tech_available = 

# 2. Filter for items that are EITHER Tech OR Price > 1000
# Store in: tech_or_expensive
tech_or_expensive = 

# 3. Filter for Food items that are NOT in stock
# Store in: food_out_of_stock
food_out_of_stock = 

# Don't change below
def check_filters():
    return tech_available, tech_or_expensive, food_out_of_stock
```

### Hints
- Use `&` for Question 1.
- Use `|` for Question 2.
- Use `&` combined with `~` (or `== False`) for Question 3.
- Remember those `(brackets)`!
