# Selecting Columns and Rows

## Practice: Data Selection

Select specific columns and filter rows from a DataFrame.

### Initial Code

```python
import pandas as pd

# Sample dataset
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [16, 17, 16, 18],
    'Score': [95, 87, 92, 88],
    'Passed': [True, True, True, False]
}

df = pd.DataFrame(data)

# 1. Select only the 'Name' and 'Score' columns
name_score = 

# 2. Filter rows where Age > 16
older_students = 

# 3. Filter rows where Passed is True
passed_students = 

# Don't change the code below - it's for testing
def check_selections():
    return name_score, older_students, passed_students
```

### Hidden Tests

Test 1: name_score has only Name and Score columns
Test 2: older_students has 2 rows (Bob and Diana)
Test 3: passed_students has 3 rows
Test 4: Correct filtering applied

### Hints
- Use df[['col1', 'col2']] for multiple columns
- Use df[df['column'] > value] for filtering
- Use df[df['column'] == value] for exact matches