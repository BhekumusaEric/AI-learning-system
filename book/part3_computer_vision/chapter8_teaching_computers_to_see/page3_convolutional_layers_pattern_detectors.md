# Convolutional Layers: Pattern Detectors

## Finding Patterns in Images

Convolutional layers use small filters (kernels) that slide across images to detect important patterns like edges, textures, and shapes.

### The Convolution Operation

A convolution applies a small filter to every part of the image:

```
Image (5x5):              Filter (3x3):          Output (3x3):
┌─────┬─────┬─────┐       ┌─────┬─────┬─────┐    ┌─────┬─────┬─────┐
│ 1   │ 0   │ 1   │       │-1   │ 0   │ 1   │    │ 0   │ 2   │ 0   │
├─────┼─────┼─────┤       ├─────┼─────┼─────┤    ├─────┼─────┼─────┤
│ 0   │ 1   │ 0   │   ×   │-1   │ 0   │ 1   │ =  │-2   │ 0   │ 2   │
├─────┼─────┼─────┤       ├─────┼─────┼─────┤    ├─────┼─────┼─────┤
│ 1   │ 0   │ 1   │       │-1   │ 0   │ 1   │    │ 0   │-2   │ 0   │
└─────┴─────┴─────┘       └─────┴─────┴─────┘    └─────┴─────┴─────┘
```

### Common Filters

**Edge Detection (Horizontal):**
```
[-1, -1, -1]
[ 0,  0,  0]
[ 1,  1,  1]
```

**Edge Detection (Vertical):**
```
[-1,  0,  1]
[-1,  0,  1]
[-1,  0,  1]
```

**Sharpen:**
```
[ 0, -1,  0]
[-1,  5, -1]
[ 0, -1,  0]
```

### How CNNs Learn

Instead of hand-designed filters, CNNs learn optimal filters during training:

1. **Random initialization**: Start with random filter weights
2. **Forward pass**: Apply filters to input images
3. **Backpropagation**: Adjust filter weights to reduce error
4. **Gradient descent**: Update weights to improve performance

### Multiple Filters

CNNs use many filters simultaneously:
- Each filter detects different patterns
- Output becomes a stack of feature maps
- Deeper layers detect complex patterns

### Stride and Padding

**Stride**: How many pixels to move the filter each time
- Stride=1: Dense output, more computation
- Stride=2: Smaller output, faster

**Padding**: Add zeros around image border
- "Same" padding: Output same size as input
- "Valid" padding: Output smaller than input

### Feature Hierarchy

CNN layers learn increasingly complex features:
- **Layer 1**: Edges, lines, basic shapes
- **Layer 2**: Textures, patterns, simple objects
- **Layer 3**: Complex objects, faces, scenes

### Remember
- Convolution: Sliding filter across image
- Detects local patterns (edges, textures)
- Multiple filters learn different features
- Hierarchical: Simple → Complex features
- Translation invariant: Finds patterns anywhere

Next, visualize convolution in action!