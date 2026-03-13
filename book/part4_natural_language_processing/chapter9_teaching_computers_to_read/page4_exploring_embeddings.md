---
title: "Hugging Face NLP Course"
type: "read"
resources:
  - title: "PyTorch: nn.Embedding"
    url: "https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html"
---

# Exploring Embeddings

## Practice: Working with Word Vectors

Explore how word embeddings capture semantic relationships and similarities.

### Initial Code

```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Simple word embeddings (normally from pre-trained models)
# Each word represented as a 4-dimensional vector
embeddings = {
    'king': np.array([0.8, 0.6, 0.2, 0.1]),
    'queen': np.array([0.7, 0.5, 0.3, 0.2]),
    'man': np.array([0.4, 0.3, 0.1, 0.0]),
    'woman': np.array([0.3, 0.2, 0.2, 0.1]),
    'apple': np.array([0.1, 0.8, 0.6, 0.4]),
    'banana': np.array([0.2, 0.7, 0.5, 0.3]),
    'car': np.array([0.9, 0.1, 0.8, 0.7]),
    'truck': np.array([0.8, 0.2, 0.9, 0.6])
}

def cosine_sim(vec1, vec2):
    """Calculate cosine similarity between two vectors"""
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

# 1. Calculate similarity between related words
king_queen_sim = cosine_sim(embeddings['king'], embeddings['queen'])
man_woman_sim = cosine_sim(embeddings['man'], embeddings['woman'])

# 2. Calculate similarity between unrelated words
king_car_sim = cosine_sim(embeddings['king'], embeddings['car'])
apple_car_sim = cosine_sim(embeddings['apple'], embeddings['car'])

# 3. Test the famous "king - man + woman ≈ queen" analogy
# king - man + woman should be close to queen
analogy_vector = embeddings['king'] - embeddings['man'] + embeddings['woman']
analogy_sim_to_queen = cosine_sim(analogy_vector, embeddings['queen'])
analogy_sim_to_king = cosine_sim(analogy_vector, embeddings['king'])

# 4. Find most similar words to "apple"
apple_sims = {}
for word, vec in embeddings.items():
    if word != 'apple':
        apple_sims[word] = cosine_sim(embeddings['apple'], vec)

most_similar_to_apple = max(apple_sims, key=apple_sims.get)

# Don't change the code below - it's for testing
def check_embeddings():
    return king_queen_sim > king_car_sim, analogy_sim_to_queen > analogy_sim_to_king, most_similar_to_apple == 'banana'
```

### Hidden Tests

Test 1: Related words more similar than unrelated
Test 2: Analogy works (king - man + woman closer to queen than king)
Test 3: Apple most similar to banana

### Hints
- Cosine similarity measures angle between vectors
- Similar words should have high similarity
- Analogy: king - man + woman should ≈ queen
- Fruits should be similar to each other