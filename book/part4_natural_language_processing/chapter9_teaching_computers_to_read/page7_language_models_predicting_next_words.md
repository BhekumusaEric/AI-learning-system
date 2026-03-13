# Language Models: Predicting Next Words

## How Models Generate Text

Language models learn the probability of a word given the words before it. They can then predict the next word in a sentence.

### Next-Word Prediction

Given a prompt: "The cat sat on the", the model predicts the next word (e.g., "mat").

### Types of Language Models

- **Unidirectional (left-to-right):** Predicts next word using previous words
- **Bidirectional (like BERT):** Uses both left and right context (not for generation)
- **Autoregressive (like GPT):** Generates text one token at a time

### Basic Generation Loop

1. Provide a prompt
2. Tokenize the prompt
3. Predict next token probabilities
4. Choose a token (greedy, sampling, beam search)
5. Append token and repeat

### Sampling Strategies

- **Greedy**: Pick the highest probability token
- **Top-k sampling**: Choose from the top k tokens
- **Top-p (nucleus)**: Pick from smallest set of tokens summing to p probability

### Example (Pseudo-code)

```
prompt = "The weather today is"
tokens = tokenize(prompt)
for i in range(20):
    logits = model(tokens)
    next_token = sample_from_logits(logits)
    tokens.append(next_token)

generated_text = detokenize(tokens)
```

### Use Cases

- Autocomplete
- Chatbots
- Story generation
- Code generation

### Remember
- Language models predict one token at a time
- Autoregressive models generate text sequentially
- Sampling strategies affect creativity vs accuracy
- Large models can generate surprisingly coherent text

Next: Practice prompting and getting responses from a model.