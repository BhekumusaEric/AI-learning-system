---
title: "Bar Charts and Histograms"
type: "practice"
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

flavors = ['Vanilla', 'Chocolate', 'Strawberry', 'Mint']
votes = [12, 8, 6, 4]

# 1. Create a bar chart of flavors vs votes


# 2. Label the x-axis 'Ice Cream Flavors'


# 3. Label the y-axis 'Number of Votes'


# 4. Add a title 'Favorite Ice Cream Flavors'


# 5. Show the plot

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