---
title: "Handling Missing Data"
type: "practice"
resources:
  - title: "Pandas: Working with Missing Data"
    url: "https://pandas.pydata.org/docs/user_guide/missing_data.html"
---

# Handling Missing Data

In the real world, data is rarely perfect. Sensors fail, users skip questions in forms, and data gets lost. In Pandas, these missing values are represented as **`NaN`** (Not a Number).

As a Data Scientist, you have three main strategies for missing data:

### 1. Detection
Find out where the gaps are:
```python
df.isnull().sum() # Shows count of missing values per column
```

### 2. Removal (The "Strict" Strategy)
If a row has missing data, just delete it:
```python
df.dropna() # Drops any row with at least one NaN
```

### 3. Imputation (The "Smart" Strategy)
Fill the gap with a reasonable estimate, like the mean or median:
```python
# Fill missing age with the average age
df['Age'] = df['Age'].fillna(df['Age'].mean())
```

---

## Practice: Cleaning the Student Registry

You have a student registry where some emails are missing and some ages aren't filled in. Clean the dataset!

### Initial Code

```python
import pandas as pd
import numpy as np

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'],
    'Age': [20, np.nan, 22, np.nan, 21],
    'Email': ['a@school.com', 'b@school.com', np.nan, 'd@school.com', np.nan]
}

df = pd.DataFrame(data)

# 1. Fill the missing 'Age' values with the median age of the group
# Store in: df['Age']
median_age = df['Age'].median()
df['Age'] = 

# 2. For 'Email', we can't guess them, so delete any rows 
# where 'Email' is missing.
# Store in: df
df = 

# Don't change below
def check_cleaning():
    return df
```

### Hints
- Use `df['Age'].fillna(median_age)`.
- Use `df.dropna(subset=['Email'])` to target specific columns for deletion.
