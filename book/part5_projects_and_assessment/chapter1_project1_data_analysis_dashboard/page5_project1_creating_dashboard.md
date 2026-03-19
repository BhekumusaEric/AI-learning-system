---
title: "Creating the Dashboard"
type: "read"
---

# Creating the Interactive Dashboard

## Step 4: Building a Streamlit Web Application

In this final step, we'll create an interactive web dashboard using Streamlit that brings together all our data analysis components. This will provide a user-friendly interface for exploring the data and insights.

### Learning Objectives
- Build a Streamlit web application
- Create interactive widgets and controls
- Implement data filtering and exploration
- Deploy the dashboard for sharing
- Design an intuitive user interface

### Code Walkthrough

```python
import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import plotly.express as px
import plotly.graph_objects as go

# Set page configuration
st.set_page_config(
    page_title="Sales Analytics Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for better styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 0.25rem solid #1f77b4;
    }
    .sidebar-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Load and cache data
@st.cache_data
def load_data():
    # In a real application, load from your data source
    # For this example, we'll create sample data
    np.random.seed(42)
    dates = pd.date_range(start='2023-01-01', end='2023-12-31', freq='D')
    
    data = {
        'date': dates,
        'sales': np.random.normal(1000, 200, len(dates)),
        'customers': np.random.poisson(50, len(dates)),
        'region': np.random.choice(['North', 'South', 'East', 'West'], len(dates)),
        'product_category': np.random.choice(['Electronics', 'Clothing', 'Books', 'Home'], len(dates)),
        'discount_applied': np.random.choice([True, False], len(dates), p=[0.3, 0.7])
    }
    
    df = pd.DataFrame(data)
    df['sales'] = df['sales'].clip(lower=0)  # Ensure non-negative sales
    return df

df = load_data()

# Sidebar for filters
st.sidebar.markdown('<div class="sidebar-header">📊 Dashboard Filters</div>', unsafe_allow_html=True)

# Date range filter
st.sidebar.markdown("### Date Range")
start_date = st.sidebar.date_input("Start Date", df['date'].min().date())
end_date = st.sidebar.date_input("End Date", df['date'].max().date())

# Region filter
st.sidebar.markdown("### Region")
selected_regions = st.sidebar.multiselect(
    "Select Regions",
    options=df['region'].unique(),
    default=df['region'].unique()
)

# Product category filter
st.sidebar.markdown("### Product Category")
selected_categories = st.sidebar.multiselect(
    "Select Categories",
    options=df['product_category'].unique(),
    default=df['product_category'].unique()
)

# Discount filter
st.sidebar.markdown("### Discount Applied")
discount_filter = st.sidebar.radio(
    "Discount Status",
    options=["All", "With Discount", "Without Discount"],
    index=0
)

# Apply filters
filtered_df = df.copy()
filtered_df = filtered_df[(filtered_df['date'] >= pd.to_datetime(start_date)) & 
                         (filtered_df['date'] <= pd.to_datetime(end_date))]
filtered_df = filtered_df[filtered_df['region'].isin(selected_regions)]
filtered_df = filtered_df[filtered_df['product_category'].isin(selected_categories)]

if discount_filter == "With Discount":
    filtered_df = filtered_df[filtered_df['discount_applied'] == True]
elif discount_filter == "Without Discount":
    filtered_df = filtered_df[filtered_df['discount_applied'] == False]

# Main content
st.markdown('<div class="main-header">📊 Sales Analytics Dashboard</div>', unsafe_allow_html=True)

# Key Metrics Row
col1, col2, col3, col4 = st.columns(4)

with col1:
    total_sales = filtered_df['sales'].sum()
    st.markdown(f"""
    <div class="metric-card">
        <h3>Total Sales</h3>
        <h2>${total_sales:,.0f}</h2>
    </div>
    """, unsafe_allow_html=True)

with col2:
    avg_daily_sales = filtered_df.groupby('date')['sales'].sum().mean()
    st.markdown(f"""
    <div class="metric-card">
        <h3>Avg Daily Sales</h3>
        <h2>${avg_daily_sales:,.0f}</h2>
    </div>
    """, unsafe_allow_html=True)

with col3:
    total_customers = filtered_df['customers'].sum()
    st.markdown(f"""
    <div class="metric-card">
        <h3>Total Customers</h3>
        <h2>{total_customers:,}</h2>
    </div>
    """, unsafe_allow_html=True)

with col4:
    avg_customers = filtered_df['customers'].mean()
    st.markdown(f"""
    <div class="metric-card">
        <h3>Avg Customers/Day</h3>
        <h2>{avg_customers:.1f}</h2>
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# Charts Section
col1, col2 = st.columns(2)

with col1:
    st.subheader("📈 Sales Trend")
    
    # Sales trend chart
    daily_sales = filtered_df.groupby('date')['sales'].sum().reset_index()
    
    fig_trend = px.line(daily_sales, x='date', y='sales', 
                       title="Daily Sales Trend",
                       labels={'sales': 'Sales ($)', 'date': 'Date'})
    fig_trend.update_layout(height=400)
    st.plotly_chart(fig_trend, use_container_width=True)

with col2:
    st.subheader("🏆 Sales by Region")
    
    # Sales by region chart
    region_sales = filtered_df.groupby('region')['sales'].sum().reset_index()
    
    fig_region = px.bar(region_sales, x='region', y='sales',
                       title="Sales by Region",
                       labels={'sales': 'Total Sales ($)', 'region': 'Region'},
                       color='region')
    fig_region.update_layout(height=400)
    st.plotly_chart(fig_region, use_container_width=True)

# Second row of charts
col1, col2 = st.columns(2)

with col1:
    st.subheader("📊 Sales by Product Category")
    
    # Product category chart
    category_sales = filtered_df.groupby('product_category')['sales'].sum().reset_index()
    
    fig_category = px.pie(category_sales, values='sales', names='product_category',
                         title="Sales Distribution by Category")
    fig_category.update_layout(height=400)
    st.plotly_chart(fig_category, use_container_width=True)

with col2:
    st.subheader("👥 Customers vs Sales")
    
    # Scatter plot
    fig_scatter = px.scatter(filtered_df, x='customers', y='sales',
                           title="Customers vs Sales Relationship",
                           labels={'customers': 'Number of Customers', 'sales': 'Sales ($)'},
                           color='region', size='sales', size_max=20)
    fig_scatter.update_layout(height=400)
    st.plotly_chart(fig_scatter, use_container_width=True)

# Data Table Section
st.markdown("---")
st.subheader("📋 Raw Data Preview")

# Allow user to choose number of rows to display
n_rows = st.slider("Number of rows to display", 5, 50, 10)
st.dataframe(filtered_df.head(n_rows), use_container_width=True)

# Download button
csv = filtered_df.to_csv(index=False)
st.download_button(
    label="📥 Download Filtered Data as CSV",
    data=csv,
    file_name="filtered_sales_data.csv",
    mime="text/csv",
    key="download-csv"
)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666;">
    <p>Built with ❤️ using Streamlit | Data Analysis Dashboard</p>
</div>
""", unsafe_allow_html=True)
```

### Key Features Implemented

**Interactive Filters:**
- Date range selection
- Multi-select for regions and categories
- Radio buttons for discount status

**Dynamic Metrics:**
- Real-time calculation of KPIs
- Responsive to filter changes

**Interactive Charts:**
- Line charts for trends
- Bar charts for comparisons
- Pie charts for proportions
- Scatter plots with color coding

**User Experience:**
- Professional styling with CSS
- Responsive layout
- Data download functionality
- Clear navigation and organization

### Deployment Instructions

1. **Save the code** as `dashboard.py`
2. **Install requirements:**
   ```bash
   pip install streamlit pandas numpy matplotlib seaborn plotly
   ```
3. **Run locally:**
   ```bash
   streamlit run dashboard.py
   ```
4. **Deploy to Streamlit Cloud:**
   - Push code to GitHub
   - Connect to Streamlit Cloud
   - Deploy automatically

### Best Practices for Dashboard Development

- **Performance:** Use caching for expensive operations
- **User Experience:** Clear layout and intuitive controls
- **Responsiveness:** Test on different screen sizes
- **Data Security:** Never expose sensitive data
- **Maintainability:** Modular code structure

### Project Completion

Congratulations! You've successfully built a complete data analysis dashboard. This project demonstrates:

- Data loading and cleaning
- Exploratory data analysis
- Professional visualizations
- Interactive web application development
- Real-world deployment skills

### Next Steps

1. Customize the dashboard for your specific data
2. Add more advanced analytics features
3. Implement user authentication if needed
4. Add automated data refresh capabilities
5. Consider adding predictive modeling features

This project provides a solid foundation for building more complex data applications and demonstrates the full data science workflow from raw data to interactive insights.