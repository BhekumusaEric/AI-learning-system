---
title: "Pandas Mini-Project: E-commerce Analysis"
type: "lab"
resources:
  - title: "Pandas Documentation"
    url: "https://pandas.pydata.org/docs/"
---

# Pandas Mini-Project: E-commerce Analysis

Welcome to your first end-to-end data analysis project! You've been hired as a Junior Data Analyst for **"Fresh Bites Café"**. The manager has given you a raw export of transactions, but it's messy and needs analysis.

### Your Objectives:
1.  **Clean**: Some items have missing prices.
2.  **Transform**: Create a "Tax" column (15% of price).
3.  **Analyze**: Find out which Category (Drink vs Food) brings in the most revenue.

---

## 🚀 Let's Analyze!

### Initial Code

```python
import pandas as pd
import numpy as np

# The raw transaction data
data = {
    'Order_ID': [101, 102, 103, 104, 105, 106, 107, 108],
    'Category': ['Food', 'Drink', 'Food', 'Food', 'Drink', 'Drink', 'Food', 'Drink'],
    'Price': [15.50, 4.00, np.nan, 12.00, 5.50, np.nan, 20.00, 3.50],
    'Quantity': [1, 2, 1, 3, 1, 2, 1, 4]
}

df = pd.DataFrame(data)

# --- STEP 1: CLEANING ---
# Fill missing 'Price' values with the average (mean) price of all items
# Store back into: df['Price']
df['Price'] = 

# --- STEP 2: TRANSFORMING ---
# Create a 'Revenue' column (Price * Quantity)
df['Revenue'] = 

# Create a 'Tax' column (15% of Revenue) - Revenue * 0.15
df['Tax'] = 

# --- STEP 3: ANALYZING ---
# Group by 'Category' and find the TOTAL Revenue for each
# Store in: category_performance
category_performance = 

# --- STEP 4: FILTERING ---
# Create a new DataFrame containing only the orders where Revenue > 15
# Store in: high_value_orders
high_value_orders = 

# Don't change below
def check_project():
    return df, category_performance, high_value_orders
```

### Final Checklist
- [ ] Is the data clean?
- [ ] Are the calculations correct?
- [ ] Is the manager going to be impressed?
