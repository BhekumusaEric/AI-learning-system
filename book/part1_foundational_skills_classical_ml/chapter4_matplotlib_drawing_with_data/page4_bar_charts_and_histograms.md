---
title: "Bar Charts and Histograms"
type: "read"
resources:
  - title: "Matplotlib: matplotlib.pyplot.bar"
    url: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.bar.html"
---

# Bar Charts and Histograms

## Practice: Bar Chart

Create a bar chart showing favorite ice cream flavors.

### Initial Code

```python
import matplotlib.pyplot as plt

# Ice cream data
flavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint']
votes = [12, 8, 6, 4]

# Create a bar chart
plt.bar(flavors, votes)

# Add labels and title
plt.xlabel('Ice Cream Flavors')
plt.ylabel('Number of Votes')
plt.title('Favorite Ice Cream Flavors')

# Show the plot
plt.show()
```

### Hidden Tests

Test 1: Bar chart created with correct data
Test 2: Flavors on x-axis
Test 3: Votes on y-axis
Test 4: Appropriate title

### Hints
- Use plt.bar(x_categories, y_values)
- X should be the categories (flavors)
- Y should be the values (votes)