# Exploring Your Data

## Practice: DataFrame Exploration

Use pandas methods to explore a dataset.

### Initial Code

```python
import pandas as pd

# Sample dataset
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'Age': [16, 17, 16, 17, 18],
    'Score': [95, 87, 92, 88, 96],
    'Subject': ['Math', 'Science', 'Math', 'English', 'Science']
}

df = pd.DataFrame(data)

# 1. Get the first 3 rows
first_three = 

# 2. Get information about the DataFrame
info = 

# 3. Get summary statistics for numeric columns
summary = 

# Don't change the code below - it's for testing
def check_exploration():
    return first_three, info, summary
```

### Hidden Tests

Test 1: first_three has 3 rows
Test 2: info contains column information
Test 3: summary includes mean, min, max for numeric columns
Test 4: Methods called correctly

### Hints
- Use df.head(n) for first n rows
- Use df.info() for data types and non-null counts
- Use df.describe() for statistics