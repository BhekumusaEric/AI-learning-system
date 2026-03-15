---
title: "Data Loading Preprocessing"
type: "read"
---

# Data Loading and Preprocessing

## Step 1: Loading Customer Data and Preparing for Clustering

In this first step, we'll load the customer dataset and perform comprehensive preprocessing suitable for clustering algorithms. Proper data preparation is crucial for effective unsupervised learning.

### Learning Objectives
- Load and examine customer data
- Handle missing values and data quality issues
- Encode categorical variables appropriately
- Scale numerical features for clustering
- Prepare data for multiple clustering algorithms

### Code Walkthrough

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler, MinMaxScaler, LabelEncoder, OneHotEncoder
from sklearn.impute import SimpleImputer, KNNImputer
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
import warnings

warnings.filterwarnings('ignore')

# Set random seeds for reproducibility
np.random.seed(42)

# Set style for plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# 1. Load the customer dataset
print("="*50)
print("LOADING CUSTOMER DATASET")
print("="*50)

# Create a comprehensive customer dataset
np.random.seed(42)
n_customers = 2000

# Generate synthetic customer data
data = {
    'customer_id': [f'CUST_{i:04d}' for i in range(1, n_customers + 1)],
    'age': np.random.normal(35, 12, n_customers).clip(18, 80).astype(int),
    'gender': np.random.choice(['Male', 'Female'], n_customers, p=[0.48, 0.52]),
    'income': np.random.lognormal(10.5, 0.8, n_customers).clip(20000, 200000).astype(int),
    'education': np.random.choice(['High School', 'Bachelor', 'Master', 'PhD'], 
                                 n_customers, p=[0.3, 0.4, 0.2, 0.1]),
    'marital_status': np.random.choice(['Single', 'Married', 'Divorced'], 
                                      n_customers, p=[0.4, 0.5, 0.1]),
    'total_spent': np.random.lognormal(7, 1.2, n_customers).clip(50, 50000),
    'purchase_frequency': np.random.poisson(12, n_customers).clip(1, 50),
    'recency_days': np.random.exponential(30, n_customers).clip(1, 365).astype(int),
    'avg_order_value': None,  # Will calculate
    'preferred_category': np.random.choice(['Electronics', 'Clothing', 'Home', 'Books', 'Sports'], 
                                          n_customers),
    'loyalty_score': np.random.uniform(1, 10, n_customers),
    'location': np.random.choice(['Urban', 'Suburban', 'Rural'], n_customers, p=[0.6, 0.3, 0.1]),
    'channel_preference': np.random.choice(['Online', 'In-store', 'Mobile'], 
                                          n_customers, p=[0.5, 0.3, 0.2]),
    'response_rate': np.random.beta(2, 5, n_customers),  # Beta distribution for 0-1 range
    'return_rate': np.random.beta(1, 10, n_customers)   # Low return rates
}

df = pd.DataFrame(data)

# Calculate derived features
df['avg_order_value'] = df['total_spent'] / df['purchase_frequency']
df['customer_lifetime_value'] = df['total_spent'] * df['loyalty_score'] / 10

# Add some missing values randomly
for col in ['income', 'total_spent', 'recency_days']:
    mask = np.random.choice([True, False], n_customers, p=[0.03, 0.97])
    df.loc[mask, col] = np.nan

print(f"Dataset loaded successfully! Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")

# 2. Initial data exploration
print("\n" + "="*50)
print("INITIAL DATA EXPLORATION")
print("="*50)

print(f"Dataset shape: {df.shape}")
print(f"Data types:\n{df.dtypes}")

# Summary statistics
print(f"\nNumerical columns summary:")
numerical_cols = df.select_dtypes(include=[np.number]).columns
print(df[numerical_cols].describe())

print(f"\nCategorical columns summary:")
categorical_cols = df.select_dtypes(include=['object']).columns
for col in categorical_cols:
    print(f"\n{col}:")
    print(df[col].value_counts())

# 3. Missing values analysis
print("\n" + "="*50)
print("MISSING VALUES ANALYSIS")
print("="*50)

missing_data = df.isnull().sum()
missing_percent = (missing_data / len(df)) * 100

missing_summary = pd.DataFrame({
    'Missing Count': missing_data,
    'Missing Percentage': missing_percent
}).sort_values('Missing Count', ascending=False)

print("Missing values by column:")
print(missing_summary[missing_summary['Missing Count'] > 0])

# Visualize missing values
if missing_data.sum() > 0:
    plt.figure(figsize=(10, 6))
    missing_summary[missing_summary['Missing Count'] > 0]['Missing Percentage'].plot(
        kind='bar', color='skyblue'
    )
    plt.title('Missing Values by Column')
    plt.ylabel('Percentage Missing')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

# 4. Handle missing values
print("\n" + "="*50)
print("HANDLING MISSING VALUES")
print("="*50)

# For numerical columns, use different imputation strategies
numerical_imputers = {
    'income': 'median',  # Use median for income (robust to outliers)
    'total_spent': 'median',  # Use median for spending
    'recency_days': 'mean'  # Use mean for recency
}

for col, strategy in numerical_imputers.items():
    if df[col].isnull().sum() > 0:
        imputer = SimpleImputer(strategy=strategy)
        df[col] = imputer.fit_transform(df[[col]]).ravel()
        print(f"Imputed {col} using {strategy} strategy")

print(f"\nRemaining missing values: {df.isnull().sum().sum()}")

# 5. Outlier detection and treatment
print("\n" + "="*50)
print("OUTLIER DETECTION AND TREATMENT")
print("="*50)

def detect_outliers_iqr(data, column):
    """Detect outliers using IQR method"""
    Q1 = data[column].quantile(0.25)
    Q3 = data[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    outliers = data[(data[column] < lower_bound) | (data[column] > upper_bound)]
    return outliers, lower_bound, upper_bound

# Check for outliers in key numerical columns
outlier_cols = ['income', 'total_spent', 'avg_order_value', 'customer_lifetime_value']

for col in outlier_cols:
    outliers, lower, upper = detect_outliers_iqr(df, col)
    print(f"{col}: {len(outliers)} outliers detected")
    print(".2f")
    
    # Cap outliers at bounds
    df[col] = df[col].clip(lower=lower, upper=upper)

print("Outliers have been capped at IQR bounds")

# 6. Encode categorical variables
print("\n" + "="*50)
print("CATEGORICAL VARIABLE ENCODING")
print("="*50)

# Identify categorical columns
categorical_cols = df.select_dtypes(include=['object']).columns
categorical_cols = [col for col in categorical_cols if col != 'customer_id']  # Exclude ID

print(f"Categorical columns to encode: {list(categorical_cols)}")

# Create encoding mappings for ordinal variables
ordinal_mappings = {
    'education': {'High School': 1, 'Bachelor': 2, 'Master': 3, 'PhD': 4},
    'location': {'Rural': 1, 'Suburban': 2, 'Urban': 3}
}

# Apply ordinal encoding
for col, mapping in ordinal_mappings.items():
    df[f'{col}_encoded'] = df[col].map(mapping)
    print(f"Ordinal encoding applied to {col}")

# One-hot encode nominal variables
nominal_cols = ['gender', 'marital_status', 'preferred_category', 'channel_preference']
df_encoded = pd.get_dummies(df, columns=nominal_cols, prefix=nominal_cols, drop_first=True)

print(f"After encoding: {df_encoded.shape[1]} columns")
print(f"New columns added: {df_encoded.shape[1] - df.shape[1]}")

# 7. Feature scaling
print("\n" + "="*50)
print("FEATURE SCALING")
print("="*50)

# Identify numerical columns for scaling
numerical_cols = [
    'age', 'income', 'total_spent', 'purchase_frequency', 'recency_days',
    'avg_order_value', 'loyalty_score', 'customer_lifetime_value',
    'response_rate', 'return_rate', 'education_encoded', 'location_encoded'
]

# Add one-hot encoded columns
one_hot_cols = [col for col in df_encoded.columns if any(prefix in col for prefix in nominal_cols)]
numerical_cols.extend(one_hot_cols)

print(f"Numerical columns to scale: {len(numerical_cols)}")

# Compare different scaling methods
scaler_standard = StandardScaler()
scaler_minmax = MinMaxScaler()

# Standard scaling (Z-score normalization)
df_standard = df_encoded.copy()
df_standard[numerical_cols] = scaler_standard.fit_transform(df_encoded[numerical_cols])

# Min-Max scaling
df_minmax = df_encoded.copy()
df_minmax[numerical_cols] = scaler_minmax.fit_transform(df_encoded[numerical_cols])

print("Applied StandardScaler and MinMaxScaler")

# Visualize scaling effects
fig, axes = plt.subplots(1, 3, figsize=(15, 5))

# Original distribution
axes[0].hist(df_encoded['income'], bins=30, alpha=0.7, color='blue')
axes[0].set_title('Original Income Distribution')
axes[0].set_xlabel('Income')

# Standard scaled
axes[1].hist(df_standard['income'], bins=30, alpha=0.7, color='green')
axes[1].set_title('Standard Scaled Income')
axes[1].set_xlabel('Scaled Income')

# Min-Max scaled
axes[2].hist(df_minmax['income'], bins=30, alpha=0.7, color='red')
axes[2].set_title('Min-Max Scaled Income')
axes[2].set_xlabel('Scaled Income')

plt.tight_layout()
plt.show()

# 8. Feature engineering
print("\n" + "="*50)
print("FEATURE ENGINEERING")
print("="*50)

# Create additional features
df_features = df_encoded.copy()

# Recency score (lower recency = higher score)
df_features['recency_score'] = 1 / (df_features['recency_days'] + 1)  # Add 1 to avoid division by zero

# Frequency score (higher frequency = higher score)
df_features['frequency_score'] = df_features['purchase_frequency'] / df_features['purchase_frequency'].max()

# Monetary score (higher spending = higher score)
df_features['monetary_score'] = df_features['total_spent'] / df_features['total_spent'].max()

# RFM score (Recency + Frequency + Monetary)
df_features['rfm_score'] = (df_features['recency_score'] + 
                           df_features['frequency_score'] + 
                           df_features['monetary_score']) / 3

print("Created RFM (Recency, Frequency, Monetary) features")

# 9. Final dataset preparation
print("\n" + "="*50)
print("FINAL DATASET PREPARATION")
print("="*50)

# Select features for clustering (exclude customer_id and original categorical columns)
clustering_features = [
    'age', 'income', 'total_spent', 'purchase_frequency', 'recency_days',
    'avg_order_value', 'loyalty_score', 'customer_lifetime_value',
    'response_rate', 'return_rate', 'education_encoded', 'location_encoded',
    'recency_score', 'frequency_score', 'monetary_score', 'rfm_score'
]

# Add one-hot encoded columns
clustering_features.extend(one_hot_cols)

# Create final dataset for clustering
df_clustering = df_features[clustering_features].copy()

print(f"Final clustering dataset shape: {df_clustering.shape}")
print(f"Features for clustering: {len(clustering_features)}")

# Apply standard scaling to final dataset
scaler_final = StandardScaler()
df_clustering_scaled = pd.DataFrame(
    scaler_final.fit_transform(df_clustering),
    columns=df_clustering.columns,
    index=df_clustering.index
)

print(f"Scaled clustering dataset shape: {df_clustering_scaled.shape}")

# 10. Save preprocessing objects
print("\n" + "="*50)
print("SAVING PREPROCESSING OBJECTS")
print("="*50)

import joblib

# Save scaler for later use
joblib.dump(scaler_final, 'customer_scaler.pkl')
print("Scaler saved as 'customer_scaler.pkl'")

# Save feature names
with open('clustering_features.txt', 'w') as f:
    for feature in clustering_features:
        f.write(f"{feature}\n")
print("Feature names saved as 'clustering_features.txt'")

# 11. Final summary
print("\n" + "="*50)
print("PREPROCESSING SUMMARY")
print("="*50)

print("Original dataset:")
print(f"  Shape: {df.shape}")
print(f"  Columns: {df.shape[1]}")

print("\nAfter preprocessing:")
print(f"  Shape: {df_clustering_scaled.shape}")
print(f"  Numerical features: {len(clustering_features)}")
print(f"  Scaling method: StandardScaler")

print("\nData quality:")
print(f"  Missing values: {df_clustering_scaled.isnull().sum().sum()}")
print(f"  Data types: All numerical (scaled)")

print("\nPreprocessing complete! Ready for clustering analysis.")
```

### Key Concepts Covered

**Data Loading:**
- Creating comprehensive synthetic datasets
- Understanding customer data characteristics
- Initial data exploration and validation

**Missing Value Handling:**
- Different imputation strategies for different data types
- Analysis of missing data patterns
- Choosing appropriate imputation methods

**Outlier Treatment:**
- IQR method for outlier detection
- Capping vs removing outliers
- Impact on clustering algorithms

**Categorical Encoding:**
- Ordinal vs nominal variables
- Label encoding for ordinal data
- One-hot encoding for nominal data

**Feature Scaling:**
- StandardScaler vs MinMaxScaler
- When to use each scaling method
- Impact on distance-based algorithms

**Feature Engineering:**
- RFM (Recency, Frequency, Monetary) analysis
- Creating derived features
- Domain-specific feature creation

### Important Technical Details

**Scaling Choice:**
- StandardScaler for most clustering algorithms
- Preserves relationships between variables
- Handles outliers better than MinMaxScaler

**Encoding Strategy:**
- Ordinal encoding for ordered categories
- One-hot encoding to avoid artificial ordering
- Careful handling of high-cardinality categories

**Feature Selection:**
- Domain knowledge in feature engineering
- Creating meaningful derived features
- Balancing feature quantity and quality

### Best Practices

- Always explore data before preprocessing
- Choose imputation methods based on data characteristics
- Consider the impact of scaling on your algorithms
- Create domain-relevant features
- Save preprocessing objects for consistent transformations

### Practice Exercise

1. Try different imputation strategies and compare results
2. Experiment with different outlier detection methods
3. Create additional domain-specific features
4. Compare the effects of different scaling methods on clustering

### Next Steps

With our data properly preprocessed, we're ready to perform exploratory data analysis. In the next step, we'll analyze feature distributions, correlations, and create customer profiles.

### Key Takeaways

- Data preprocessing is critical for clustering success
- Choose appropriate methods for your data characteristics
- Feature engineering can significantly improve clustering results
- Save preprocessing steps for consistent application
- Understand how preprocessing affects different algorithms