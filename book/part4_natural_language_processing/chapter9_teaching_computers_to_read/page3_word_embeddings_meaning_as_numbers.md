---
title: "Hugging Face NLP Course"
type: "read"
resources:
  - title: "Jay Alammar: The Illustrated Word2vec"
    url: "https://jalammar.github.io/illustrated-word2vec/"
---

# Word Embeddings: Meaning as Numbers

## Capturing Word Meaning in Vectors

Word embeddings represent words as dense vectors where semantically similar words are located close together in vector space.

### The Problem with One-Hot Encoding

Traditional approach: Each word is a sparse vector with one 1 and many 0s:

```
Vocabulary: [cat, dog, car, truck, apple, banana]

cat  → [1, 0, 0, 0, 0, 0]
dog  → [0, 1, 0, 0, 0, 0]
car  → [0, 0, 1, 0, 0, 0]
```

**Problems:**
- No semantic relationships captured
- High dimensionality (10,000+ dimensions common)
- Doesn't handle unknown words

### Word Embeddings Solution

Dense vectors that capture meaning:

```
cat  → [0.2, -0.5, 0.8, 0.1, -0.3]
dog  → [0.3, -0.4, 0.7, 0.2, -0.2]
car  → [-0.1, 0.8, -0.2, 0.9, 0.5]
```

Notice: cat and dog are close (both animals), far from car.

### How Embeddings Are Learned

**Word2Vec (Skip-gram):**
- Predict context words from target word
- "The cat sat on the ___" → learns relationships

**Training objective:**
- Maximize probability of actual context words
- Minimize probability of random words

### Vector Arithmetic

Embeddings capture semantic relationships:

```
king - man + woman ≈ queen
Paris - France + Italy ≈ Rome
```

### Dimensionality

- **Typical sizes**: 50-300 dimensions
- **Trade-off**: Higher dimensions capture more nuance but require more data
- **Compression**: Can reduce to 2D for visualization (t-SNE)

### Pre-trained Embeddings

**GloVe:** Global Vectors from co-occurrence statistics
**Word2Vec:** CBOW and Skip-gram architectures
**FastText:** Character n-grams for morphological awareness

### Contextual Embeddings

Modern embeddings consider context:
- **ELMo:** Different vectors for same word in different contexts
- **BERT:** Contextual embeddings based on transformers
- **GPT:** Generates embeddings considering full context

### Applications

- **Semantic similarity**: Find related words
- **Analogy solving**: king:queen :: man:?
- **Text classification**: Average word vectors
- **Machine translation**: Map between languages

### Remember
- Dense vectors capture semantic meaning
- Similar words have similar vectors
- Learned from large text corpora
- Enable mathematical operations on meaning
- Foundation for modern NLP

Next, explore word embeddings interactively!