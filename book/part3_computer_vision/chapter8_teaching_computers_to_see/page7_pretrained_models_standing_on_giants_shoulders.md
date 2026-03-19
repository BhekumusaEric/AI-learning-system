---
title: "Pre-trained Models: Standing on Giants' Shoulders"
type: "read"
resources:
  - title: "PyTorch: Torchvision Models"
    url: "https://pytorch.org/vision/stable/models.html"
---

# Pre-trained Models: Standing on Giants' Shoulders

## Leverage Models Trained on Massive Data

Pre-trained models are neural networks that have already been trained on large datasets (like ImageNet). They provide a powerful starting point for new tasks without training from scratch.

### Why Pre-trained Models Help

- **Save time**: Training from scratch can take days or weeks
- **Save compute**: Avoid heavy GPU/TPU usage
- **Better results**: Benefit from large-scale learning and tuning
- **Transferable features**: Early layers learn general patterns (edges, textures)

### Common Pre-trained Models

- **ResNet** (Residual Networks): Deep networks with skip connections
- **VGG**: Simple, deep architecture with small filters
- **MobileNet**: Efficient, designed for mobile devices
- **EfficientNet**: Balances accuracy and efficiency

### How to Use a Pre-trained Model

1. **Load the model** with pre-trained weights
2. **Freeze** most layers (optional)
3. **Replace the final layer** for your task (e.g., new number of classes)
4. **Fine-tune** the model on your dataset

### Transfer Learning Workflow

1. Load base model (e.g., ResNet50)
2. Add a new classification head
3. Train head first (freeze base)
4. Optionally unfreeze some base layers and fine-tune

### When to Use Pre-trained Models

- Small datasets where training from scratch would overfit
- Tasks similar to the original dataset (e.g., general objects)
- When you need strong baseline performance quickly

### Remember
- Pre-trained models are a powerful shortcut
- Early layers learn general features; later layers learn task-specific features
- Fine-tuning adapts the model to your data
- You can often achieve state-of-the-art results with limited data

Next: Practice transfer learning by fine-tuning a model on a new dataset.