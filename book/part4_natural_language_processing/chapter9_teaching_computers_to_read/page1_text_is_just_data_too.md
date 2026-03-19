---
title: "Text is Just Data Too"
type: "read"
resources:
  - title: "Hugging Face: What is NLP?"
    url: "https://huggingface.co/learn/nlp-course/chapter1/2"
---

# Text is Just Data Too

## Representing Language as Numbers

Computers understand numbers, not words. Natural Language Processing (NLP) converts text into numerical representations that machines can process.

### The Challenge

Human language is:
- **Ambiguous**: Words have multiple meanings
- **Contextual**: Meaning depends on surrounding words
- **Structured**: Grammar and syntax matter
- **Creative**: New words and phrases constantly emerge

### Tokenization: Breaking Text into Pieces

First step: Split text into meaningful units (tokens).

```python
text = "Hello, how are you today?"

# Word-level tokens
tokens = ["Hello", ",", "how", "are", "you", "today", "?"]

# Subword tokens (for modern models)
subword_tokens = ["Hello", ",", "how", "are", "you", "to", "day", "?"]
```

### Word Embeddings: Meaning as Vectors

Words become vectors (lists of numbers) where similar words are close together.

Example 2D embeddings:
```
king    → [0.8, 0.6]
queen   → [0.7, 0.5]
man     → [0.2, 0.1]
woman   → [0.1, 0.0]
```

Notice: king - man + woman ≈ queen

### From Text to Numbers

1. **Raw Text** → Tokenization
2. **Tokens** → Numerical IDs (vocabulary lookup)
3. **IDs** → Embeddings (dense vectors)
4. **Vectors** → Model processing

### Applications

- **Sentiment Analysis**: Is this review positive?
- **Translation**: Convert between languages
- **Question Answering**: Answer questions from text
- **Text Generation**: Create new text (like chatbots)

### Remember
- Text must be converted to numbers for computers
- Tokenization breaks text into processable pieces
- Embeddings capture semantic meaning
- Context matters for understanding

Next, explore tokenization!