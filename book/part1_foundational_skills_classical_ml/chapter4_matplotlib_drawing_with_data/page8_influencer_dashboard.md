---
title: "Project: Influencer Dashboard"
type: "lab"
resources:
  - title: "Matplotlib Gallery"
    url: "https://matplotlib.org/stable/gallery/index.html"
---

# 🚀 Project: Influencer Dashboard

You've been asked to help a rising TikTok star, **@DataDynamo**, understand their growth. They want to see their "Likes" growth over the last 5 videos to decide when to post next.

### Your Mission
1.  **Visualize** the likes.
2.  **Style** the chart to match their "Cyberpunk" brand.
3.  **Evaluate**: Find the peak performance.

---

## 🚀 The Build Lab

### Initial Code

```python
import matplotlib.pyplot as plt

# Data: Video Number vs Likes
videos = [1, 2, 3, 4, 5]
likes = [1200, 1800, 1500, 2900, 3100]

# --- STEP 1: STYLE ---
# Set the background to dark (Optional pro-tip!)
plt.style.use('dark_background')

# --- STEP 2: PLOT ---
# Create a line plot:
# - Line color: 'springgreen'
# - Line style: 'dashed'
# - Marker: Star ('*')
# - Marker size: 12
plt.plot(videos, likes, color='springgreen', linestyle='--', marker='*', markersize=12)

# --- STEP 3: ANATOMY ---
# Add these details:
# - Title: "@DataDynamo Viral Growth"
# - X Label: "Video Upload Number"
# - Y Label: "Total Likes"
# - Legend: Add a legend called "Engagement"
plt.title("@DataDynamo Viral Growth")
plt.xlabel("Video Upload Number")
plt.ylabel("Total Likes")
plt.legend(["Engagement"])

# --- STEP 4: HIGHLIGHT ---
# Add a horizontal line at the 3,000 likes mark 
# because that's when a video goes "Viral"!
# - Color: 'gold', Style: solid
plt.axhline(y=3000, color='gold', label='Viral Goal')

plt.show()

# Don't change below
def check_dashboard():
    return plt.gca().get_lines()[0]
```

### Pro-Challenge
Can you change the plot type from `plt.plot` to `plt.bar` to see it as a bar chart instead? Which one looks cooler for influencer stats?
