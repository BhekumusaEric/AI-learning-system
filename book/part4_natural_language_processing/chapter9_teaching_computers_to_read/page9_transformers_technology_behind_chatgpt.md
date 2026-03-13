---
title: "Hugging Face NLP Course"
type: "read"
resources:
  - title: "Jay Alammar: The Illustrated Transformer"
    url: "https://jalammar.github.io/illustrated-transformer/"
---

# Transformers: The Technology Behind ChatGPT

## The Architecture That Changed NLP

Transformers are the foundation of modern language models like GPT and BERT. They use attention mechanisms to process all words in a sentence at once.

### Why Transformers Beat RNNs

Older models (RNNs, LSTMs) processed words one at a time, which made it hard to learn long-range dependencies.

Transformers:
- Process all words in parallel
- Use attention to focus on important words
- Scale better to large datasets

### Self-Attention: The Core Idea

Each word (token) attends to every other token to decide what to focus on.

For each token:
1. Create **query**, **key**, and **value** vectors
2. Compute attention scores (query · key)
3. Normalize scores with softmax
4. Multiply scores by value vectors

This creates a new representation that mixes information from the entire sentence.

### Transformer Structure

A transformer has:
- **Encoder**: Reads input and builds representations (used by BERT)
- **Decoder**: Generates output one token at a time (used by GPT)
- **Encoder-decoder**: For translation (e.g., T5)

Each layer includes:
- Multi-head self-attention
- Feed-forward neural network
- Layer normalization
- Residual connections (skip connections)

### Multi-Head Attention

Instead of one attention mechanism, transformers use many heads:
- Each head learns different types of relationships
- Outputs are concatenated and projected

### Positional Encoding

Since transformers process tokens in parallel, they need a way to know token order.
- Positional encodings add information about token position
- Usually sine/cosine functions or learned embeddings

### Why Transformers Scale Well

- Parallel computation (no sequential dependence)
- Efficient use of GPUs/TPUs
- Works well with massive datasets

### Remember
- Transformers use self-attention to mix token information
- Process text in parallel, not sequentially
- Multi-head attention captures multiple relationships
- Basis for GPT, BERT, T5, and many other models

Next: Learn how to fine-tune a large language model on your own task.