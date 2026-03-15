---
title: "Exploratory Data Analysis"
type: "read"
---

# Exploratory Data Analysis

## Step 2: Uncovering Insights in Your Data

Exploratory Data Analysis (EDA) is the process of analyzing and visualizing data to understand its main characteristics. This step helps you discover patterns, spot anomalies, and formulate hypotheses.

### Learning Objectives
- Perform univariate and bivariate analysis
- Create various types of plots
- Identify correlations and relationships
- Detect outliers and anomalies
- Generate insights from data

### Code Walkthrough

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Assuming df is our cleaned DataFrame from Step 1

# 1. Univariate Analysis
# Distribution of numerical variables
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Sales distribution
axes[0,0].hist(df['sales'], bins=30, edgecolor='black')
axes[0,0].set_title('Sales Distribution')
axes[0,0].set_xlabel('Sales Amount')
axes[0,0].set_ylabel('Frequency')

# Customers distribution
axes[0,1].hist(df['customers'], bins=20, edgecolor='black')
axes[0,1].set_title('Customers Distribution')
axes[0,1].set_xlabel('Number of Customers')
axes[0,1].set_ylabel('Frequency')

# Categorical variables
region_counts = df['region'].value_counts()
axes[1,0].bar(region_counts.index, region_counts.values)
axes[1,0].set_title('Sales by Region')
axes[1,0].set_xlabel('Region')
axes[1,0].set_ylabel('Count')
axes[1,0].tick_params(axis='x', rotation=45)

product_counts = df['product_category'].value_counts()
axes[1,1].bar(product_counts.index, product_counts.values)
axes[1,1].set_title('Sales by Product Category')
axes[1,1].set_xlabel('Category')
axes[1,1].set_ylabel('Count')
axes[1,1].tick_params(axis='x', rotation=45)

plt.tight_layout()
plt.show()

# 2. Bivariate Analysis
# Correlation matrix
numerical_cols = ['sales', 'customers']
correlation_matrix = df[numerical_cols].corr()
print("Correlation Matrix:")
print(correlation_matrix)

# Scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(df['customers'], df['sales'], alpha=0.6)
plt.title('Sales vs Number of Customers')
plt.xlabel('Number of Customers')
plt.ylabel('Sales Amount')
plt.grid(True, alpha=0.3)
plt.show()

# 3. Time series analysis (if applicable)
if 'date' in df.columns:
    df_time = df.set_index('date').resample('W').sum()
    plt.figure(figsize=(12, 6))
    plt.plot(df_time.index, df_time['sales'])
    plt.title('Weekly Sales Trend')
    plt.xlabel('Date')
    plt.ylabel('Sales Amount')
    plt.grid(True, alpha=0.3)
    plt.show()

# 4. Outlier detection
# Box plots
plt.figure(figsize=(10, 6))
plt.subplot(1, 2, 1)
plt.boxplot(df['sales'])
plt.title('Sales Box Plot')
plt.ylabel('Sales Amount')

plt.subplot(1, 2, 2)
plt.boxplot(df['customers'])
plt.title('Customers Box Plot')
plt.ylabel('Number of Customers')
plt.show()

# 5. Key insights
print("\nKey Insights:")
print(f"Total sales: ${df['sales'].sum():,.0f}")
print(f"Average sale: ${df['sales'].mean():.2f}")
print(f"Most popular region: {df['region'].mode().iloc[0]}")
print(f"Best selling category: {df['product_category'].mode().iloc[0]}")
print(f"Correlation between sales and customers: {correlation_matrix.loc['sales', 'customers']:.3f}")
```

### Key Concepts Covered

**Univariate Analysis:**
- Histograms for distribution
- Bar charts for categorical data
- Summary statistics

**Bivariate Analysis:**
- Scatter plots for relationships
- Correlation matrices
- Cross-tabulations

**Time Series Analysis:**
- Trend identification
- Seasonal patterns
- Resampling techniques

**Outlier Detection:**
- Box plots
- Statistical methods (IQR, Z-score)

### Best Practices

- Always start with EDA before modeling
- Use multiple visualization types
- Look for unexpected patterns
- Document your findings
- Consider the business context

### Practice Exercise

1. Create additional visualizations (e.g., heatmaps, violin plots)
2. Analyze relationships between categorical variables
3. Identify any seasonal patterns in your data
4. Calculate and interpret additional statistics

### Next Steps

With insights from EDA, we can now create more targeted visualizations. In the next step, we'll build a comprehensive set of charts for our dashboard.