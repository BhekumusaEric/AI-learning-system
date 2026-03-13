# K-Means Clustering: Finding Groups

## Grouping Data by Similarity

K-Means is a simple but powerful algorithm that finds natural groups (clusters) in your data based on how similar data points are to each other.

### How K-Means Works

Imagine you have points on a map and want to group them into K cities:

1. **Choose K**: Decide how many groups you want (K=3 for 3 cities)
2. **Initialize**: Randomly place K "centroids" (city centers)
3. **Assign**: Each data point joins the nearest centroid
4. **Update**: Move centroids to the center of their assigned points
5. **Repeat**: Steps 3-4 until centroids stop moving

### Visual Example

```
Initial:     After Assignment:    After Update:
○ ○ ● ●     ○ ○ ● ●            ○ ○ ● ●
● ○ ○ ●     ● ○ ○ ●            ● ○ ○ ●
Centroid: ■ Centroid: ■        Centroid: ■
```

### The Algorithm in Detail

```python
def k_means(data, k):
    # 1. Randomly initialize K centroids
    centroids = random_points(k)
    
    while centroids_change:
        # 2. Assign each point to nearest centroid
        clusters = assign_points_to_centroids(data, centroids)
        
        # 3. Update centroids to cluster centers
        centroids = calculate_cluster_centers(clusters)
    
    return clusters, centroids
```

### Distance Measurement

K-Means uses Euclidean distance:
- 2D points: distance = √((x₁-x₂)² + (y₁-y₂)²)
- Higher dimensions: Same formula, more coordinates

### Choosing K

- **Too few K**: Groups are too broad
- **Too many K**: Over-splitting, noise as clusters
- **Elbow method**: Plot error vs K, find the "bend"

### Applications

- **Customer segmentation** by purchase behavior
- **Image compression** by grouping similar colors
- **Document clustering** by topic similarity
- **Anomaly detection** by finding outliers

### Remember
- Simple and fast algorithm
- Requires choosing K beforehand
- Sensitive to initial centroid placement
- Works best with spherical, similar-sized clusters

Next, practice implementing K-Means!