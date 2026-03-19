---
title: "Tokenization: Splitting Text into Pieces"
type: "read"
resources:
  - title: "Hugging Face: Tokenizers"
    url: "https://huggingface.co/learn/nlp-course/chapter2/4"
---

# Tokenization: Splitting Text into Pieces

## Practice: Breaking Text into Tokens

Split text into meaningful units (tokens) for NLP processing.

### Initial Code

```python
import re

def simple_tokenize(text):
    """Simple tokenization: split on whitespace and punctuation"""
    # Convert to lowercase
    text = text.lower()
    # Split on whitespace
    tokens = re.split(r'\s+', text)
    # Remove empty tokens
    tokens = [token for token in tokens if token]
    return tokens

def word_tokenize(text):
    """Word-level tokenization with punctuation handling"""
    # Convert to lowercase
    text = text.lower()
    # Split on whitespace and punctuation
    tokens = re.findall(r'\b\w+\b', text)
    return tokens

# Test texts
text1 = "Hello, world! How are you today?"
text2 = "I'm learning NLP. It's fascinating!"

# 1. Tokenize text1 with simple tokenization
simple_tokens1 = simple_tokenize(text1)

# 2. Tokenize text1 with word tokenization
word_tokens1 = word_tokenize(text1)

# 3. Tokenize text2 with word tokenization
word_tokens2 = word_tokenize(text2)

# 4. Count total tokens in both texts
total_tokens = len(word_tokens1) + len(word_tokens2)

# 5. Find unique words across both texts
all_words = word_tokens1 + word_tokens2
unique_words = list(set(all_words))
vocab_size = len(unique_words)

# Don't change the code below - it's for testing
def check_tokenization():
    return len(simple_tokens1) > 0, len(word_tokens1) > 0, total_tokens > 0, vocab_size > 0
```

### Hidden Tests

Test 1: Simple tokenization produces tokens
Test 2: Word tokenization produces tokens
Test 3: Total token count is reasonable
Test 4: Vocabulary size is calculated

### Hints
- Use re.split() for simple splitting
- re.findall(r'\b\w+\b', text) finds word tokens
- set() removes duplicates for unique words
- Lowercase text for consistency