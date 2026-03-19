---
title: "Data Loading and Cleaning"
type: "read"
---

# Data Loading and Cleaning

## Step 1: Getting Your Data Ready

The foundation of any data analysis project is clean, well-structured data. In this step, we'll load our dataset, explore its structure, and perform necessary cleaning operations.

### Learning Objectives
- Load data from various sources (CSV, Excel, APIs)
- Understand data types and missing values
- Perform data cleaning operations
- Handle common data quality issues

### Code Walkthrough

```python
import pandas as pd
import numpy as np

# 1. Load the dataset
# For this project, we'll use a sample dataset. In real projects, you might load from:
# - CSV: pd.read_csv('data.csv')
# - Excel: pd.read_excel('data.xlsx')
# - API: requests.get('api_url').json()

# Sample data creation (replace with real data loading)
data = {
    'date': pd.date_range('2020-01-01', periods=100, freq='D'),
    'sales': np.random.randint(100, 1000, 100),
    'customers': np.random.randint(10, 50, 100),
    'region': np.random.choice(['North', 'South', 'East', 'West'], 100),
    'product_category': np.random.choice(['Electronics', 'Clothing', 'Books', 'Home'], 100)
}

df = pd.DataFrame(data)

# 2. Initial exploration
print("Dataset shape:", df.shape)
print("\nFirst 5 rows:")
print(df.head())
print("\nData types:")
print(df.dtypes)
print("\nMissing values:")
print(df.isnull().sum())

# 3. Data cleaning
# Handle missing values
df = df.dropna()  # Simple approach - drop rows with missing values

# Convert data types if needed
df['date'] = pd.to_datetime(df['date'])

# Remove duplicates
df = df.drop_duplicates()

# 4. Basic data validation
print("\nCleaned dataset info:")
print(df.info())
print("\nSummary statistics:")
print(df.describe())
```

### Key Concepts Covered

**Data Loading:**
- Different file formats and sources
- API integration basics
- Error handling for data loading

**Data Exploration:**
- `df.head()`, `df.info()`, `df.describe()`
- Understanding data types
- Identifying missing values

**Data Cleaning:**
- Handling missing data (drop, fill, interpolate)
- Data type conversion
- Duplicate removal
- Outlier detection

### Common Issues and Solutions

- **Encoding errors**: Specify encoding when loading (e.g., `encoding='utf-8'`)
- **Date parsing**: Use `pd.to_datetime()` with format specification
- **Memory issues**: For large datasets, use `chunksize` parameter
- **Inconsistent data**: Standardize formats (e.g., lowercase strings)

### Practice Exercise

1. Load a different dataset (try a CSV from Kaggle or your own data)
2. Identify and handle missing values appropriately
3. Convert any date columns to datetime format
4. Remove any duplicate rows
5. Print summary statistics for numerical columns

### Next Steps

With clean data in hand, we're ready to explore it in depth. In the next step, we'll perform exploratory data analysis to uncover patterns and insights.