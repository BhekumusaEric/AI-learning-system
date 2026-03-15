---
title: "Data Loading Exploration"
type: "read"
---

# Data Loading and Initial Exploration

## Step 1: Loading the Dataset and Understanding the Data

In this first step, we'll load the customer churn dataset and perform initial exploration to understand its structure, quality, and characteristics. This foundational step is crucial for building effective machine learning models.

### Learning Objectives
- Load data from CSV files using pandas
- Examine data structure and basic information
- Understand data types and missing values
- Generate summary statistics
- Identify potential data quality issues

### Code Walkthrough

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style for consistent plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# 1. Load the dataset
print("Loading customer churn dataset...")
try:
    # In a real scenario, you'd load from a file path
    # df = pd.read_csv('customer_churn.csv')
    
    # For this example, we'll create a sample dataset
    np.random.seed(42)
    n_customers = 5000
    
    data = {
        'customerID': [f'CUST_{i:04d}' for i in range(1, n_customers + 1)],
        'gender': np.random.choice(['Male', 'Female'], n_customers),
        'SeniorCitizen': np.random.choice([0, 1], n_customers, p=[0.8, 0.2]),
        'Partner': np.random.choice(['Yes', 'No'], n_customers),
        'Dependents': np.random.choice(['Yes', 'No'], n_customers),
        'tenure': np.random.randint(1, 73, n_customers),  # months
        'PhoneService': np.random.choice(['Yes', 'No'], n_customers),
        'MultipleLines': np.random.choice(['Yes', 'No', 'No phone service'], n_customers),
        'InternetService': np.random.choice(['DSL', 'Fiber optic', 'No'], n_customers),
        'OnlineSecurity': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'OnlineBackup': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'DeviceProtection': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'TechSupport': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'StreamingTV': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'StreamingMovies': np.random.choice(['Yes', 'No', 'No internet service'], n_customers),
        'Contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n_customers),
        'PaperlessBilling': np.random.choice(['Yes', 'No'], n_customers),
        'PaymentMethod': np.random.choice(['Electronic check', 'Mailed check', 'Bank transfer (automatic)', 'Credit card (automatic)'], n_customers),
        'MonthlyCharges': np.round(np.random.uniform(18.25, 118.75, n_customers), 2),
        'TotalCharges': None,  # Will calculate this
        'Churn': np.random.choice(['Yes', 'No'], n_customers, p=[0.265, 0.735])
    }
    
    df = pd.DataFrame(data)
    
    # Calculate TotalCharges based on tenure and MonthlyCharges
    df['TotalCharges'] = (df['tenure'] * df['MonthlyCharges']).round(2)
    
    # Add some missing values randomly (simulating real data)
    for col in ['TotalCharges', 'tenure']:
        mask = np.random.choice([True, False], n_customers, p=[0.01, 0.99])
        df.loc[mask, col] = np.nan
    
    print(f"Dataset loaded successfully! Shape: {df.shape}")
    
except FileNotFoundError:
    print("Error: Dataset file not found. Please check the file path.")
    exit()
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

# 2. Basic dataset information
print("\n" + "="*50)
print("BASIC DATASET INFORMATION")
print("="*50)

print(f"Dataset shape: {df.shape}")
print(f"Number of rows: {df.shape[0]:,}")
print(f"Number of columns: {df.shape[1]}")

print("\nColumn names:")
for i, col in enumerate(df.columns, 1):
    print(f"{i:2d}. {col}")

# 3. Data types and non-null counts
print("\n" + "="*50)
print("DATA TYPES AND MISSING VALUES")
print("="*50)

print(df.info())

# 4. Summary statistics for numerical columns
print("\n" + "="*50)
print("NUMERICAL COLUMNS SUMMARY")
print("="*50)

numerical_cols = df.select_dtypes(include=[np.number]).columns
print(df[numerical_cols].describe())

# 5. Summary for categorical columns
print("\n" + "="*50)
print("CATEGORICAL COLUMNS SUMMARY")
print("="*50)

categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    print(f"\n{col}:")
    print(df[col].value_counts())
    print(f"Unique values: {df[col].nunique()}")

# 6. Check for missing values
print("\n" + "="*50)
print("MISSING VALUES ANALYSIS")
print("="*50)

missing_data = df.isnull().sum()
missing_percent = (missing_data / len(df)) * 100

missing_summary = pd.DataFrame({
    'Missing Count': missing_data,
    'Missing Percentage': missing_percent
}).sort_values('Missing Count', ascending=False)

print(missing_summary[missing_summary['Missing Count'] > 0])

# Visualize missing values
if missing_data.sum() > 0:
    plt.figure(figsize=(10, 6))
    missing_summary[missing_summary['Missing Count'] > 0].plot(
        kind='bar', y='Missing Percentage', legend=False
    )
    plt.title('Missing Values by Column')
    plt.ylabel('Percentage Missing')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# 7. Target variable analysis
print("\n" + "="*50)
print("TARGET VARIABLE ANALYSIS (Churn)")
print("="*50)

churn_counts = df['Churn'].value_counts()
churn_percentages = df['Churn'].value_counts(normalize=True) * 100

print("Churn distribution:")
for churn_status, count in churn_counts.items():
    percentage = churn_percentages[churn_status]
    print(f"{churn_status}: {count:,} customers ({percentage:.1f}%)")

# Visualize target variable
plt.figure(figsize=(8, 6))
churn_counts.plot(kind='bar', color=['#2ca02c', '#d62728'])
plt.title('Customer Churn Distribution')
plt.xlabel('Churn Status')
plt.ylabel('Number of Customers')
plt.xticks(rotation=0)

# Add percentage labels
for i, v in enumerate(churn_counts.values):
    plt.text(i, v + 50, f'{churn_percentages[i]:.1f}%', ha='center', va='bottom')

plt.tight_layout()
plt.show()

# 8. Quick data quality checks
print("\n" + "="*50)
print("DATA QUALITY CHECKS")
print("="*50)

# Check for duplicates
duplicates = df.duplicated().sum()
print(f"Duplicate rows: {duplicates}")

# Check for negative values in numerical columns
for col in numerical_cols:
    negative_count = (df[col] < 0).sum()
    if negative_count > 0:
        print(f"Negative values in {col}: {negative_count}")

# Check tenure range
if 'tenure' in df.columns:
    print(f"Tenure range: {df['tenure'].min()} - {df['tenure'].max()} months")
    
# Check monthly charges range
if 'MonthlyCharges' in df.columns:
    print(f"Monthly charges range: ${df['MonthlyCharges'].min():.2f} - ${df['MonthlyCharges'].max():.2f}")

# 9. Sample of the data
print("\n" + "="*50)
print("SAMPLE DATA")
print("="*50)

print("First 5 rows:")
print(df.head())

print("\nRandom sample of 5 rows:")
print(df.sample(5, random_state=42))

print("\nData loading and initial exploration complete!")
```

### Key Concepts Covered

**Data Loading:**
- Using `pd.read_csv()` for CSV files
- Error handling for file operations
- Creating sample data for testing

**Data Inspection:**
- `df.shape` for dimensions
- `df.info()` for data types and missing values
- `df.describe()` for numerical summaries
- `value_counts()` for categorical distributions

**Missing Values:**
- Identifying missing data with `isnull().sum()`
- Calculating percentages of missing data
- Visualizing missing data patterns

**Data Quality:**
- Checking for duplicates
- Validating value ranges
- Ensuring data consistency

### Important Observations

**Dataset Characteristics:**
- 5,000+ customer records
- Mix of categorical and numerical features
- Target variable (Churn) is imbalanced
- Some missing values present

**Data Types:**
- Binary categorical: Yes/No responses
- Multi-class categorical: Service types, payment methods
- Numerical: Tenure, charges
- Identifier: Customer ID

**Quality Issues:**
- Missing values in TotalCharges and tenure
- Potential data inconsistencies
- Need for data cleaning

### Best Practices

- Always examine data immediately after loading
- Check for missing values and data types
- Understand the target variable distribution
- Look for data quality issues early
- Document your findings for the team

### Practice Exercise

1. Load a different dataset and perform the same analysis
2. Create additional visualizations for data exploration
3. Write a function to automate the initial data inspection
4. Identify any additional data quality issues

### Next Steps

With our data loaded and initially explored, we can now move to data preprocessing. In the next step, we'll handle missing values, encode categorical variables, and prepare the data for modeling.

### Key Takeaways

- Understanding your data is the foundation of good modeling
- Always check for missing values, duplicates, and data quality issues
- The target variable distribution informs your modeling approach
- Documentation of data characteristics helps throughout the project