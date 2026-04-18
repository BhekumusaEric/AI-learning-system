---
title: "Pizza Math: Pie Charts"
type: "practice"
resources:
  - title: "Matplotlib: Pie Charts"
    url: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.pie.html"
---

# 🍕 Pizza Math: Pie Charts

When you want to see how a "whole" thing is split up into pieces, you use a **Pie Chart**. 

Think of it like a pizza:
- The whole pizza is **100%** of your data.
- Each slice is a **Category**.
- Bigger slices mean that category has **more data**.

### Pro-Tip: The "Explode" Effect 💥
You can make one slice stand out by "exploding" it out of the pie.
```python
# The 3rd slice will move out by 0.1
explode = [0, 0, 0.1, 0] 
plt.pie(data, explode=explode)
```

---

## Practice: Favorite Game Genres

Survey results are in! We asked 100 gamers what their favorite genre is. Plot the results as a pie chart.

### Initial Code

```python
import matplotlib.pyplot as plt

# Data
genres = ['FPS', 'RPG', 'Sports', 'Survival']
votes = [45, 25, 15, 15]
colors = ['#ff9999','#66b3ff','#99ff99','#ffcc99']

# 1. Create the Pie Chart
# - Use the votes for sizing
# - Use the genres for labels
# - Use the colors list provided
# - Add percentages using autopct='%1.1f%%'
plt.pie(votes, labels=genres, colors=colors, autopct='%1.1f%%')

# 2. Add a Title
plt.title('Top Gaming Genres 2024')

# 3. Make the circle look like a perfect circle
plt.axis('equal') 

plt.show()

# Don't change below
def check_pie():
    return len(plt.gca().patches)
```

### Challenges to Try
- Try changing the `colors` list to your favorite Hex codes.
- Use the `explode` technique to highlight the 'RPG' slice!
