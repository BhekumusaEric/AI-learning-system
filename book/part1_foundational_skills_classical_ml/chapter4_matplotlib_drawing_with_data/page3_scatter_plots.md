# Scatter Plots

## Practice: Scatter Plot

Create a scatter plot to visualize the relationship between study hours and test scores.

### Initial Code

```python
import matplotlib.pyplot as plt

# Student data
study_hours = [2, 3, 1, 4, 5, 2, 3, 4]
test_scores = [65, 75, 55, 85, 95, 70, 80, 90]

# Create a scatter plot
plt.scatter(study_hours, test_scores)

# Add labels and title
plt.xlabel('Study Hours')
plt.ylabel('Test Score')
plt.title('Study Hours vs Test Scores')

# Show the plot
plt.show()
```

### Hidden Tests

Test 1: Scatter plot created with correct data
Test 2: X-axis labeled 'Study Hours'
Test 3: Y-axis labeled 'Test Score'
Test 4: Title includes 'Study Hours vs Test Scores'

### Hints
- Use plt.scatter(x, y) instead of plt.plot()
- Scatter plots show individual points
- Good for seeing correlations between variables