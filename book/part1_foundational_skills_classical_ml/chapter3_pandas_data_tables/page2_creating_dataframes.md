---
title: "Pandas User Guide"
type: "read"
resources:
  - title: "Pandas: DataFrame Object"
    url: "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html"
---

# Creating DataFrames

## Practice: Making DataFrames

Create DataFrames from dictionaries.

### Initial Code

```python
import pandas as pd

# 1. Create a DataFrame from this dictionary
student_data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [16, 17, 16, 17],
    'Grade': ['A', 'B', 'A', 'A']
}

students_df = 

# 2. Create another DataFrame for courses
course_data = {
    'Course': ['Math', 'Science', 'English'],
    'Credits': [3, 4, 2],
    'Difficulty': ['Hard', 'Medium', 'Easy']
}

courses_df = 

# Don't change the code below - it's for testing
def check_dataframes():
    return students_df, courses_df
```

### Hidden Tests

Test 1: students_df has 4 rows and 3 columns
Test 2: courses_df has 3 rows and 3 columns
Test 3: Column names are correct
Test 4: Data types are preserved

### Hints
- Use pd.DataFrame(dictionary)
- Dictionary keys become column names
- List values become column data