---
resources:
  - title: "Hugging Face NLP Course"
    url: "https://huggingface.co/learn/nlp-course/chapter1/1"
  - title: "The Illustrated Transformer (Jay Alammar)"
    url: "https://jalammar.github.io/illustrated-transformer/"
---

# BERT: Understanding Context

## Bidirectional Encoder Representations from Transformers

BERT revolutionized NLP by considering context from both directions when understanding word meaning, unlike previous models that only looked left-to-right.

### The Context Problem

Previous language models were unidirectional:
- **Forward-only**: "The bank ___" → predict next word
- **Limited context**: Couldn't use future words to understand past ones

### BERT's Bidirectional Approach

BERT reads the entire sentence and understands each word using:
- **Left context**: Words before the target word
- **Right context**: Words after the target word

Example: "I deposited money in the bank"
- Forward-only: bank = financial institution
- BERT: Considers "deposited money" → bank = financial institution
- But "I fished by the bank" → bank = river edge

### How BERT Works

**Pre-training Tasks:**

1. **Masked Language Modeling (MLM):**
   - Randomly mask 15% of words
   - Predict masked words using context
   - Example: "The [MASK] sat on the mat" → predict "cat"

2. **Next Sentence Prediction (NSP):**
   - Predict if two sentences are consecutive
   - Teaches relationship between sentences

### Architecture

**Transformer Encoder:**
- Multi-head self-attention mechanism
- Processes all words simultaneously (parallel)
- Captures long-range dependencies
- Stack of 12-24 transformer layers

### Contextual Embeddings

Each word gets a different vector based on context:

```
Word: "bank"
Context 1: "money in the bank" → [0.2, 0.8, -0.1, ...] (financial)
Context 2: "river bank" → [0.5, -0.3, 0.7, ...] (geographical)
```

### Fine-tuning for Tasks

Pre-trained BERT adapted for specific tasks:
- **Classification**: Add classification head
- **Question Answering**: Predict answer span
- **Named Entity Recognition**: Label each token

### BERT Variants

**BERT-base:** 12 layers, 110M parameters
**BERT-large:** 24 layers, 340M parameters
**DistilBERT:** Smaller, faster version
**RoBERTa:** Optimized training procedure

### Impact on NLP

- **State-of-the-art** on many benchmarks
- **Few-shot learning**: Works with little task-specific data
- **Transfer learning**: Knowledge transfers across tasks
- **Foundation** for modern language models (GPT, T5)

### Remember
- Bidirectional: Uses context from both directions
- Pre-trained on massive text corpora
- Fine-tuned for specific tasks
- Contextual embeddings: Same word, different meanings
- Transformer-based architecture

Next, use BERT for text classification!