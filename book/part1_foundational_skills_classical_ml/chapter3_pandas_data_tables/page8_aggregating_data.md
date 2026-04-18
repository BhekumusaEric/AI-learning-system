---
title: "Aggregating Data with GroupBy"
type: "practice"
resources:
  - title: "Pandas: Group By: split-apply-combine"
    url: "https://pandas.pydata.org/docs/user_guide/groupby.html"
---

# Aggregating Data with GroupBy

How do you find the average salary **per department**? Or the total sales **per month**? 

Pandas uses a powerful pattern called **Split-Apply-Combine**:
1.  **Split** the data into groups (e.g., by Department).
2.  **Apply** a function to each group (e.g., calculate Mean).
3.  **Combine** the results back into a new table.

### The Syntax
```python
# Group by 'Department' and find the mean of 'Salary'
report = df.groupby('Department')['Salary'].mean()
```

Common functions you can use after `groupby`:
- `.sum()` — Total
- `.mean()` — Average
- `.count()` — Number of items
- `.max()` / `.min()` — Largest / Smallest

---

## Practice: Regional Sales Report

You have a dataset of branch sales across different regions. Generate a summary report for the manager.

### Initial Code

```python
import pandas as pd

data = {
    'Region': ['North', 'South', 'North', 'West', 'South', 'North'],
    'Store': ['N1', 'S1', 'N2', 'W1', 'S2', 'N3'],
    'Sales': [10000, 15000, 12000, 8000, 20000, 9000],
    'Employees': [5, 8, 4, 3, 10, 5]
}

df = pd.DataFrame(data)

# 1. Group the data by 'Region' and calculate the TOTAL Sales for each
# Store in: regional_totals
regional_totals = 

# 2. Group the data by 'Region' and calculate the AVERAGE Sales for each
# Store in: regional_averages
regional_averages = 

# 3. Use groupby to find the total number of Stores in each region
# Store in: store_counts
store_counts = 

# Don't change below
def check_agg():
    return regional_totals, regional_averages, store_counts
```

### Hints
- Use `df.groupby('Region')['Sales'].sum()`.
- Use `df.groupby('Region')['Sales'].mean()`.
- For counting, use `df.groupby('Region')['Store'].count()`.
