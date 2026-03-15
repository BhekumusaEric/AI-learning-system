---
title: "Building Visualizations"
type: "read"
---

# Building Visualizations

## Step 3: Creating Compelling Data Visualizations

In this step, we'll create a variety of professional visualizations that effectively communicate our data insights. We'll focus on clarity, aesthetics, and storytelling.

### Learning Objectives
- Create different types of charts (bar, line, pie, scatter)
- Use color and styling effectively
- Add proper labels and titles
- Create subplots for multiple views
- Design for readability and impact

### Code Walkthrough

```python
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

# Set style for professional look
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

# Assuming df is our DataFrame

# 1. Sales by Region (Bar Chart)
plt.figure(figsize=(10, 6))
region_sales = df.groupby('region')['sales'].sum().sort_values(ascending=False)
bars = plt.bar(region_sales.index, region_sales.values, 
               color=['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'])

plt.title('Total Sales by Region', fontsize=16, fontweight='bold')
plt.xlabel('Region', fontsize=12)
plt.ylabel('Total Sales ($)', fontsize=12)
plt.grid(axis='y', alpha=0.3)

# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height + 500,
             f'${height:,.0f}', ha='center', va='bottom', fontsize=10)

plt.tight_layout()
plt.show()

# 2. Sales Trend Over Time (Line Chart)
plt.figure(figsize=(12, 6))
daily_sales = df.groupby('date')['sales'].sum()
plt.plot(daily_sales.index, daily_sales.values, linewidth=2, marker='o', markersize=3)

plt.title('Daily Sales Trend', fontsize=16, fontweight='bold')
plt.xlabel('Date', fontsize=12)
plt.ylabel('Sales Amount ($)', fontsize=12)
plt.grid(True, alpha=0.3)
plt.xticks(rotation=45)

# Add rolling average
rolling_avg = daily_sales.rolling(window=7).mean()
plt.plot(rolling_avg.index, rolling_avg.values, 
         color='red', linewidth=2, label='7-day Rolling Average')
plt.legend()

plt.tight_layout()
plt.show()

# 3. Product Category Performance (Pie Chart)
plt.figure(figsize=(8, 8))
category_sales = df.groupby('product_category')['sales'].sum()
colors = ['#ff9999','#66b3ff','#99ff99','#ffcc99']

plt.pie(category_sales.values, labels=category_sales.index, 
        colors=colors, autopct='%1.1f%%', startangle=90,
        wedgeprops={'edgecolor': 'white', 'linewidth': 2})

plt.title('Sales Distribution by Product Category', fontsize=16, fontweight='bold')
plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
plt.show()

# 4. Customer vs Sales Scatter Plot with Categories
plt.figure(figsize=(10, 6))
categories = df['product_category'].unique()
colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728']

for i, category in enumerate(categories):
    subset = df[df['product_category'] == category]
    plt.scatter(subset['customers'], subset['sales'], 
                color=colors[i], label=category, alpha=0.7, s=50)

plt.title('Sales vs Customer Count by Product Category', fontsize=16, fontweight='bold')
plt.xlabel('Number of Customers', fontsize=12)
plt.ylabel('Sales Amount ($)', fontsize=12)
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# 5. Heatmap of Correlations
plt.figure(figsize=(8, 6))
# Add more numerical columns if available
numerical_data = df.select_dtypes(include=[np.number])
correlation_matrix = numerical_data.corr()

sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', 
            center=0, square=True, linewidths=0.5)

plt.title('Correlation Heatmap', fontsize=16, fontweight='bold')
plt.tight_layout()
plt.show()

# 6. Summary Dashboard (Multiple subplots)
fig, axes = plt.subplots(2, 2, figsize=(15, 10))
fig.suptitle('Sales Dashboard Summary', fontsize=18, fontweight='bold')

# Top-left: Sales by region
region_sales.plot(kind='bar', ax=axes[0,0], color='#1f77b4')
axes[0,0].set_title('Sales by Region')
axes[0,0].set_ylabel('Total Sales ($)')

# Top-right: Sales trend
daily_sales.plot(ax=axes[0,1], color='#ff7f0e')
axes[0,1].set_title('Sales Trend')
axes[0,1].set_ylabel('Daily Sales ($)')

# Bottom-left: Product categories
category_sales.plot(kind='pie', ax=axes[1,0], autopct='%1.1f%%')
axes[1,0].set_title('Sales by Category')

# Bottom-right: Customer vs Sales
axes[1,1].scatter(df['customers'], df['sales'], alpha=0.6, color='#2ca02c')
axes[1,1].set_title('Customers vs Sales')
axes[1,1].set_xlabel('Customers')
axes[1,1].set_ylabel('Sales ($)')

plt.tight_layout()
plt.show()
```

### Key Concepts Covered

**Chart Types:**
- Bar charts for comparisons
- Line charts for trends
- Pie charts for proportions
- Scatter plots for relationships
- Heatmaps for correlations

**Design Principles:**
- Clear titles and labels
- Consistent color schemes
- Appropriate chart types
- Readable fonts and sizes

**Advanced Techniques:**
- Subplots for dashboards
- Annotations and value labels
- Rolling averages and trends
- Color coding by categories

### Best Practices

- Choose the right chart type for your data
- Use colors purposefully (not just for decoration)
- Include data labels and legends
- Ensure readability on different screen sizes
- Tell a story with your visualizations

### Practice Exercise

1. Create a custom visualization not covered here
2. Experiment with different color palettes
3. Add more detailed annotations to your charts
4. Create a visualization for a specific insight you discovered

### Next Steps

With our visualizations ready, we can now build an interactive dashboard. In the final step, we'll use Streamlit to create a web application that brings all these elements together.