---
title: "Trends: Gaming Stats"
type: "practice"
resources:
  - title: "Line Plots in Matplotlib"
    url: "https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.plot.html"
---

# 🎮 Trends: Gaming Stats

Line plots are the GOAT for showing how things change over time. In the world of tech and gaming, we use them to track **performance**.

### Scenario: The Lag Spike Case
Imagine you are playing a heavy game (like Cyberpunk or a modded Minecraft). Your **FPS (Frames Per Second)** tells you how smooth the game is. If it drops suddenly, that's a "lag spike."

- **High FPS (60+)**: Smooth like butter.
- **Low FPS (<30)**: Choppy and hard to play.

---

## Practice: Analyze the Session

You recorded your FPS every 10 minutes during a 1-hour gaming session. Your goal is to plot this data so you can see when the lag happened.

### Initial Code

```python
import matplotlib.pyplot as plt

# Time in minutes
time = [0, 10, 20, 30, 40, 50, 60]
# Frames Per Second (FPS) recorded
fps = [60, 58, 55, 15, 62, 59, 60]

# 1. Create a line plot
# - Use 'cyan' for the line
# - Add circles ('o') at each marker
plt.plot(time, fps, color='cyan', marker='o')

# 2. Add the Labels
plt.title('Gaming Performance Test')
plt.xlabel('Time (Minutes)')
plt.ylabel('FPS')

# 3. Add a horizontal line at 30 FPS to show the "Lag Zone"
# Hint: use plt.axhline(y=30, color='red', linestyle='--', label='Unplayable')
plt.axhline(y=30, color='red', linestyle='--', label='Unplayable')

plt.legend()
plt.show()

# Don't change below
def check_fps():
    return plt.gca().get_lines()[0]
```

### Discovery Question
Based on your plot, at exactly what minute did the massive lag spike occur? 
*(Check the graph you just made!)*
