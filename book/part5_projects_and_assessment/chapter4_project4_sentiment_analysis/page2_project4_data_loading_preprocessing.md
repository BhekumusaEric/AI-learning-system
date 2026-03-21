---
title: "Data Loading and Preprocessing"
type: "practice"
colab_notebook: "notebooks/part5_projects/chapter4/page2_project4_data_loading_preprocessing.ipynb"
---

# Data Loading and Text Preprocessing

## Step 1: Loading IMDB Data and Preparing Text

In this first step, we'll load the IMDB movie reviews dataset and perform comprehensive text preprocessing. Text data requires careful cleaning and preparation before it can be used effectively in deep learning models.

### Learning Objectives
- Load the IMDB dataset
- Understand text data characteristics
- Clean and normalize text
- Tokenize text into sequences
- Handle text encoding and special characters
- Prepare data for neural network input

### Code Walkthrough

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from collections import Counter
import string

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

# Set style for plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

print("TensorFlow version:", tf.__version__)

# 1. Load the IMDB dataset
print("\n" + "="*50)
print("LOADING IMDB MOVIE REVIEWS DATASET")
print("="*50)

# Load IMDB dataset
(X_train_raw, y_train), (X_test_raw, y_test) = keras.datasets.imdb.load_data(
    num_words=10000  # Keep only top 10,000 words
)

print(f"Training data shape: {X_train_raw.shape}")
print(f"Training labels shape: {y_train.shape}")
print(f"Test data shape: {X_test_raw.shape}")
print(f"Test labels shape: {y_test.shape}")

# Get word index for decoding
word_index = keras.datasets.imdb.get_word_index()
word_index = {k: (v + 3) for k, v in word_index.items()}

# Add special tokens
word_index["<PAD>"] = 0
word_index["<START>"] = 1
word_index["<UNK>"] = 2
word_index["<UNUSED>"] = 3

# Reverse word index for decoding
reverse_word_index = dict([(value, key) for (key, value) in word_index.items()])

def decode_review(encoded_review):
    """Decode numerical review back to text"""
    return ' '.join([reverse_word_index.get(i, '?') for i in encoded_review])

# 2. Examine the data structure
print("\n" + "="*50)
print("DATA STRUCTURE ANALYSIS")
print("="*50)

print(f"Sample sizes: {len(X_train_raw)} training, {len(X_test_raw)} test")
print(f"Label distribution - Training: {np.bincount(y_train)}")
print(f"Label distribution - Test: {np.bincount(y_test)}")

# Review lengths
review_lengths = [len(review) for review in X_train_raw]
print(f"Review length statistics:")
print(f"  Mean: {np.mean(review_lengths):.1f} words")
print(f"  Median: {np.median(review_lengths):.1f} words")
print(f"  Min: {min(review_lengths)} words")
print(f"  Max: {max(review_lengths)} words")

# Plot review length distribution
plt.figure(figsize=(10, 6))
plt.hist(review_lengths, bins=50, alpha=0.7, edgecolor='black')
plt.xlabel('Review Length (words)')
plt.ylabel('Frequency')
plt.title('Distribution of Review Lengths')
plt.axvline(np.mean(review_lengths), color='red', linestyle='--', label=f'Mean: {np.mean(review_lengths):.1f}')
plt.axvline(np.median(review_lengths), color='green', linestyle='--', label=f'Median: {np.median(review_lengths):.1f}')
plt.legend()
plt.show()

# 3. Decode and examine sample reviews
print("\n" + "="*50)
print("SAMPLE REVIEWS EXAMINATION")
print("="*50)

# Decode some sample reviews
print("Sample positive review:")
positive_idx = np.where(y_train == 1)[0][0]
print(decode_review(X_train_raw[positive_idx]))
print(f"Label: {y_train[positive_idx]}")

print("\nSample negative review:")
negative_idx = np.where(y_train == 0)[0][0]
print(decode_review(X_train_raw[negative_idx]))
print(f"Label: {y_train[negative_idx]}")

# 4. Load raw text data for preprocessing
print("\n" + "="*50)
print("LOADING RAW TEXT DATA")
print("="*50)

# For more control over preprocessing, let's work with raw text
# Note: This requires downloading the dataset manually or using a different approach
# For this example, we'll simulate text preprocessing with the decoded reviews

# Get some raw text samples
sample_reviews = []
sample_labels = []

for i in range(min(1000, len(X_train_raw))):  # Use subset for demonstration
    decoded = decode_review(X_train_raw[i])
    # Remove special tokens
    decoded = decoded.replace('<START>', '').replace('<UNK>', 'UNK').strip()
    if len(decoded) > 10:  # Filter very short reviews
        sample_reviews.append(decoded)
        sample_labels.append(y_train[i])

print(f"Collected {len(sample_reviews)} sample reviews for preprocessing demonstration")

# 5. Text preprocessing functions
print("\n" + "="*50)
print("TEXT PREPROCESSING")
print("="*50)

def clean_text(text):
    """Clean and preprocess text"""
    # Convert to lowercase
    text = text.lower()
    
    # Remove HTML tags (if any)
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text

def tokenize_and_lemmatize(text, lemmatizer, stop_words):
    """Tokenize, remove stopwords, and lemmatize"""
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords and non-alphabetic tokens
    tokens = [token for token in tokens if token.isalpha() and token not in stop_words]
    
    # Lemmatize
    tokens = [lemmatizer.lemmatize(token) for token in tokens]
    
    return tokens

# Initialize preprocessing tools
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Add common movie-related words that might be important
words_to_keep = {'film', 'movie', 'story', 'character', 'acting', 'director', 'plot', 'scene'}
stop_words = stop_words - words_to_keep

# Process sample reviews
processed_reviews = []
all_tokens = []

print("Processing reviews...")
for review in sample_reviews[:100]:  # Process subset for speed
    # Clean text
    cleaned = clean_text(review)
    
    # Tokenize and lemmatize
    tokens = tokenize_and_lemmatize(cleaned, lemmatizer, stop_words)
    
    # Rejoin for storage
    processed_review = ' '.join(tokens)
    processed_reviews.append(processed_review)
    all_tokens.extend(tokens)

print(f"Processed {len(processed_reviews)} reviews")

# 6. Analyze processed text
print("\n" + "="*50)
print("PROCESSED TEXT ANALYSIS")
print("="*50)

# Vocabulary analysis
vocab = Counter(all_tokens)
print(f"Total unique words: {len(vocab)}")
print(f"Most common words:")
for word, count in vocab.most_common(20):
    print(f"  {word}: {count}")

# Review length after processing
processed_lengths = [len(review.split()) for review in processed_reviews]
print(f"\nProcessed review length statistics:")
print(f"  Mean: {np.mean(processed_lengths):.1f} words")
print(f"  Median: {np.median(processed_lengths):.1f} words")

# Plot comparison
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.hist(review_lengths[:100], bins=20, alpha=0.7, edgecolor='black')
plt.xlabel('Original Review Length')
plt.ylabel('Frequency')
plt.title('Original Review Lengths')

plt.subplot(1, 2, 2)
plt.hist(processed_lengths, bins=20, alpha=0.7, edgecolor='black', color='orange')
plt.xlabel('Processed Review Length')
plt.ylabel('Frequency')
plt.title('Processed Review Lengths')

plt.tight_layout()
plt.show()

# 7. Prepare data for neural networks
print("\n" + "="*50)
print("PREPARING DATA FOR NEURAL NETWORKS")
print("="*50)

# For the actual model training, we'll use the pre-tokenized data
# but demonstrate the preprocessing pipeline

# Set parameters
max_words = 10000  # Vocabulary size
max_len = 200      # Maximum sequence length

# Create tokenizer
tokenizer = keras.preprocessing.text.Tokenizer(num_words=max_words, oov_token='<OOV>')
tokenizer.fit_on_texts(processed_reviews)

# Convert text to sequences
sequences = tokenizer.texts_to_sequences(processed_reviews)

# Pad sequences
padded_sequences = keras.preprocessing.sequence.pad_sequences(
    sequences, 
    maxlen=max_len, 
    padding='post', 
    truncating='post'
)

print(f"Tokenizer vocabulary size: {len(tokenizer.word_index)}")
print(f"Padded sequences shape: {padded_sequences.shape}")
print(f"Sample sequence length: {len(sequences[0])}")
print(f"Padded sequence length: {len(padded_sequences[0])}")

# Convert labels to numpy array
labels = np.array(sample_labels[:len(processed_reviews)])

# 8. Create TensorFlow datasets
print("\n" + "="*50)
print("CREATING TENSORFLOW DATASETS")
print("="*50)

# Create train/validation split
from sklearn.model_selection import train_test_split

X_train, X_val, y_train_split, y_val = train_test_split(
    padded_sequences, labels, 
    test_size=0.2, 
    random_state=42,
    stratify=labels
)

# Create datasets
batch_size = 32

train_dataset = tf.data.Dataset.from_tensor_slices((X_train, y_train_split))
train_dataset = train_dataset.shuffle(buffer_size=1000).batch(batch_size).prefetch(tf.data.AUTOTUNE)

val_dataset = tf.data.Dataset.from_tensor_slices((X_val, y_val))
val_dataset = val_dataset.batch(batch_size).prefetch(tf.data.AUTOTUNE)

print("Datasets created successfully!")
print(f"Training batches: {len(train_dataset)}")
print(f"Validation batches: {len(val_dataset)}")

# 9. Final data summary
print("\n" + "="*50)
print("FINAL DATA SUMMARY")
print("="*50)

print("Data shapes:")
print(f"  X_train: {X_train.shape}")
print(f"  y_train: {y_train_split.shape}")
print(f"  X_val: {X_val.shape}")
print(f"  y_val: {y_val.shape}")

print(f"\nData types:")
print(f"  Features: {X_train.dtype}")
print(f"  Labels: {y_train_split.dtype}")

print(f"\nValue ranges:")
print(f"  Sequence values: [{X_train.min()}, {X_train.max()}]")
print(f"  Labels: [{y_train_split.min()}, {y_train_split.max()}]")

print("\nText preprocessing and data preparation complete!")
```

### Key Concepts Covered

**Text Data Loading:**
- Using Keras IMDB dataset
- Understanding encoded vs raw text
- Decoding numerical sequences back to text

**Text Preprocessing:**
- Cleaning HTML tags and special characters
- Lowercasing and punctuation removal
- Stopword removal and lemmatization
- Tokenization and sequence creation

**Data Analysis:**
- Review length distributions
- Vocabulary analysis
- Class balance verification

**Neural Network Preparation:**
- Text tokenization for ML
- Sequence padding and truncation
- Creating efficient data pipelines

### Important Technical Details

**Text Encoding:**
- IMDB dataset comes pre-encoded with word indices
- Special tokens: `<PAD>`, `<START>`, `<UNK>`, `<UNUSED>`
- Vocabulary limited to top 10,000 words

**Preprocessing Pipeline:**
- Multiple cleaning steps for robust text processing
- Lemmatization vs stemming considerations
- Stopword handling for sentiment analysis

**Sequence Processing:**
- Fixed-length sequences for batch processing
- Padding and truncation strategies
- Memory-efficient data loading

### Best Practices

- Always examine raw text data first
- Clean text systematically and consistently
- Consider domain-specific stopwords
- Use appropriate sequence lengths
- Validate preprocessing doesn't remove important information

### Practice Exercise

1. Experiment with different preprocessing steps
2. Try stemming instead of lemmatization
3. Analyze the impact of different vocabulary sizes
4. Create custom cleaning functions for specific text patterns

### Next Steps

With our text data properly preprocessed, we're ready to extract features and build word embeddings. In the next step, we'll convert text to numerical representations suitable for deep learning models.

### Key Takeaways

- Text data requires extensive preprocessing
- Understanding your text characteristics is crucial
- Tokenization and sequencing prepare text for neural networks
- Efficient data pipelines are essential for text processing
- Domain knowledge helps in preprocessing decisions