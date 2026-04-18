---
title: "Styling Your Vibe"
type: "practice"
resources:
  - title: "Matplotlib: Styling with Cycler"
    url: "https://matplotlib.org/stable/tutorials/intermediate/color_cycle.html"
---

# 🌈 Styling Your Vibe

A default blue line is okay, but we want our charts to have **aesthetic**. Matplotlib lets you customize almost everything using simple text codes.

### 1. Colors (`color`)
You can use basic colors like `'red'`, `'green'`, or even Hex codes like `'#FF5733'`.
```python
plt.plot(x, y, color='purple')
```

### 2. Markers (`marker`)
Markers are the "dots" at each data point.
- `'o'` — Circle
- `'s'` — Square
- `'*'` — Star
- `'D'` — Diamond

### 3. Line Styles (`linestyle`)
- `'-'` — Solid (Default)
- `'--'` — Dashed
- `':'` — Dotted

---

### The Power Combo ⚡
You can combine these into a "short code" in one string:
```python
plt.plot(x, y, 'r--*') # 'r' (red), '--' (dashed), '*' (star markers)
```

---

## Practice: The Neon Aesthetic

Create a plot that looks like a neon sign. 

### Initial Code

```python
import matplotlib.pyplot as plt

# Data for a "V" shape
x = [1, 2, 3, 4, 5]
y = [10, 5, 2, 5, 10]

# 1. Plot the data with these specs:
# - Color: 'magenta'
# - Line Style: Dotted (':')
# - Marker: Diamond ('D')
# - Marker Size: 10
plt.plot(x, y, color='magenta', linestyle=':', marker='D', markersize=10)

# 2. Add a Title: "Neon Vibe Analytics"
plt.title("Neon Vibe Analytics")

# 3. Add a legend that says "Signal"
# Hint: You need to add label='Signal' to plt.plot above first!
plt.legend(['Signal'])

# Don't change below
def check_style():
    return plt.gca().get_lines()[0]
```

### Hints
- Use `plt.plot(x, y, color='...', linestyle='...', marker='...', label='...')`.
- Don't forget `plt.legend()` to actually show the label!
