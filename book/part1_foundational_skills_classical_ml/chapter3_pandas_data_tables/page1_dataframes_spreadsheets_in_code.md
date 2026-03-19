---
title: "DataFrames: Spreadsheets in Code"
type: "read"
resources:
  - title: "Pandas: Intro to Data Structures"
    url: "https://pandas.pydata.org/docs/user_guide/dsintro.html"
---

# DataFrames: Spreadsheets in Code

## Pandas DataFrames

Pandas DataFrames are like spreadsheets or database tables in Python. They allow you to store and manipulate tabular data with rows and columns.

### Creating a DataFrame

```python
import pandas as pd

# From a dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [25, 30, 35],
    'City': ['New York', 'London', 'Tokyo']
}

df = pd.DataFrame(data)
print(df)
```

Output:
```
      Name  Age      City
0    Alice   25  New York
1      Bob   30    London
2  Charlie   35     Tokyo
```

### DataFrame Structure
- **Rows**: Each row represents a record (indexed from 0)
- **Columns**: Each column has a name and contains data of the same type
- **Index**: Row labels (usually numbers starting from 0)

### Key Features
- Handle missing data gracefully
- Powerful data manipulation tools
- Easy to read from CSV, Excel, databases
- Built-in plotting capabilities
- Fast operations on large datasets

### Common Operations

```python
# View first 5 rows
df.head()

# Get basic info
df.info()

# Summary statistics
df.describe()

# Select a column
names = df['Name']

# Filter rows
adults = df[df['Age'] > 25]
```

### Remember
- Import as: `import pandas as pd`
- DataFrames are mutable (can be changed)
- Columns can have different data types
- Perfect for data analysis and machine learning

Next, practice creating your own DataFrames!