---
title: "Matplotlib Tutorials"
type: "read"
resources:
  - title: "Matplotlib: Pyplot tutorial"
    url: "https://matplotlib.org/stable/tutorials/introductory/pyplot.html"
---

# Your First Plot

## Practice: Basic Line Plot

Create a simple line plot showing the relationship between x and y values.

### Initial Code

```python
import matplotlib.pyplot as plt

# Data
x = [1, 2, 3, 4, 5]
y = [1, 4, 9, 16, 25]  # y = x squared

# Create a line plot
plt.plot(x, y)

# Add labels and title
plt.xlabel('X Values')
plt.ylabel('Y Values')
plt.title('My First Plot')

# Show the plot
plt.show()
```

### Hidden Tests

Test 1: Plot created with correct x and y values
Test 2: X-axis labeled
Test 3: Y-axis labeled
Test 4: Title added

### Hints
- Use plt.plot(x, y) to create the line
- plt.xlabel() and plt.ylabel() for axis labels
- plt.title() for the chart title
- plt.show() displays the plot