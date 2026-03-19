---
title: "BERT for Classification"
type: "read"
resources:
  - title: "Hugging Face: Sequence Classification"
    url: "https://huggingface.co/docs/transformers/tasks/sequence_classification"
---

# BERT for Classification

## Practice: Fine-Tune BERT for Sentiment Analysis

Use a pre-trained BERT model to classify movie reviews as positive or negative.

### Initial Code

```python
from transformers import BertTokenizer, TFBertForSequenceClassification
import tensorflow as tf

# Sample data (tiny set for practice)
texts = [
    "I loved this movie! It was amazing.",
    "This was the worst film I have ever seen.",
    "An enjoyable experience with great acting.",
    "Awful plot and bad dialogue."
]
labels = [1, 0, 1, 0]  # 1 = positive, 0 = negative

# Load tokenizer and model
model_name = 'bert-base-uncased'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = TFBertForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Tokenize inputs
encodings = tokenizer(texts, truncation=True, padding=True, max_length=32, return_tensors='tf')

dataset = tf.data.Dataset.from_tensor_slices((dict(encodings), labels)).batch(2)

# Compile model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=2e-5),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])

# Fine-tune for 1 epoch
history = model.fit(dataset, epochs=1)

# Evaluate on same tiny dataset
loss, accuracy = model.evaluate(dataset, verbose=0)

# Don't change the code below - it's for testing
def check_bert_classification():
    return accuracy > 0.5, loss > 0, len(history.history['loss']) == 1
```

### Hidden Tests

Test 1: Model achieves >50% accuracy on the sample data
Test 2: Loss is a positive number
Test 3: Training ran for 1 epoch

### Hints
- Use a small dataset for quick results
- Tokenizer converts text to token IDs
- Model outputs logits; use SparseCategoricalCrossentropy with from_logits=True