---
title: "Modifying DataFrames"
type: "practice"
resources:
  - title: "Pandas: Working with Columns"
    url: "https://pandas.pydata.org/docs/getting_started/intro_tutorials/05_add_columns.html"
---

# Modifying DataFrames

Data science isn't just about reading data; it's about transforming it into something useful. This is called **Feature Engineering**.

### 1. Adding New Columns
You can create a new column by simply assigning values to it. Usually, we calculate it from other columns:
```python
# Create a 'Total_Cost' column
df['Total_Cost'] = df['Price'] * df['Quantity']
```

### 2. Dropping Columns
If a column is useless (like a unique ID), you can remove it:
```python
# axis=1 means 'drop the column'
df = df.drop('Useless_ID', axis=1)
```

### 3. Renaming Columns
Clean up messy headers:
```python
df = df.rename(columns={'old_name': 'New Name'})
```

---

## Practice: The Profit Calculator

You are analyzing a small e-commerce dataset for a boutique. You need to calculate the profits and clean up the table.

### Initial Code

```python
import pandas as pd

data = {
    'Product': ['Candle', 'Matches', 'Vase', 'Blanket'],
    'Cost_Price': [5.0, 1.0, 15.0, 20.0],
    'Sale_Price': [12.0, 3.0, 45.0, 35.0],
    'Internal_Code': ['A1', 'B2', 'C1', 'D4']
}

df = pd.DataFrame(data)

# 1. Create a new column 'Profit' which is Sales_Price minus Cost_Price
# Store in: df['Profit']
df['Profit'] = 

# 2. Drop the 'Internal_Code' column from the DataFrame
# Remember to assign it back or use axis=1
df = 

# 3. Rename 'Product' to 'Item_Name'
# Store in: df
df = 

# Don't change below
def check_mods():
    return df
```

### Hints
- Use `df['A'] - df['B']` for math between columns.
- `df.drop('ColName', axis=1)` removes a column.
- Use `df.rename(columns={'Product': 'Item_Name'})`.
