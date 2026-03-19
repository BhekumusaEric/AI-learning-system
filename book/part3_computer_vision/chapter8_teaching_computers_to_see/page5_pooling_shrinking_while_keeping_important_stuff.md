---
title: "Pooling: Shrinking While Keeping Important Stuff"
type: "read"
resources:
  - title: "PyTorch: nn.MaxPool2d"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.MaxPool2d.html"
---

# Pooling: Shrinking While Keeping Important Stuff

## Reduce Size Without Losing Meaning

Pooling is a technique used in convolutional neural networks (CNNs) to shrink feature maps while preserving the most important information.

### Why Pooling?

- Reduces the number of parameters and computation
- Makes the model more robust to small shifts and distortions
- Helps avoid overfitting by summarizing features

### Common Pooling Types

**Max Pooling:**
- Takes the maximum value in each window
- Keeps the strongest signal (most activated feature)

**Average Pooling:**
- Takes the average value in each window
- Smooths the feature map

### Example (2×2 Window)

Input:
```
[[1, 3, 2, 4],
 [5, 6, 1, 2],
 [1, 2, 0, 3],
 [4, 1, 2, 1]]
```
Max pooling (2×2, stride=2) output:
```
[[6, 4],
 [4, 3]]
```

### Pooling Parameters

- **Window size** (pool size): how big the pooling region is (e.g., 2×2)
- **Stride**: how far the window moves each step
- **Padding**: usually not used for pooling ("valid" pooling)

### Where Pooling Fits

In CNNs, pooling layers typically appear after convolutional layers:
```
Conv → ReLU → Pool → Conv → ReLU → Pool → Dense
```

### When to Use Pooling

- Useful for reducing spatial dimensions
- Works well for images and feature maps
- Can be replaced by strided convolutions in some architectures

### Remember
- Pooling summarizes local regions
- Max pooling keeps the strongest signal
- Pooling reduces computation and helps generalization

Next: Learn about using pre-trained models to jumpstart your computer vision projects.