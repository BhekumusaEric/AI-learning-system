# Prompting Practice

## Practice: Get Good Responses from a Language Model

A prompt is the input you give to a language model. The better the prompt, the more useful the response.

### Prompting Strategies

- **Be specific**: Clearly state what you want
- **Provide context**: Give background information
- **Show examples**: Provide input/output examples
- **Set constraints**: Length, format, tone

### Prompt Examples

**Poor prompt:**
```
Write about AI.
```

**Better prompt:**
```
Write a short paragraph (3-4 sentences) explaining what machine learning is, aimed at a high school student.
```

**Example prompt with format requirement:**
```
List three benefits of Python as bullet points.
```

### Practice: Prompt Refinement

Start with a simple prompt, then improve it to get a clearer answer.

### Initial Code (Simulated Model)

In this exercise, we simulate the model response with a simple function.

```python
# Simple simulated model (for practice)

def simulated_model(prompt):
    # This is a placeholder for a real model
    # It returns a canned response based on prompt keywords
    if "machine learning" in prompt.lower():
        return "Machine learning lets computers learn from data to make predictions."
    if "python" in prompt.lower():
        return "Python is easy to read, has many libraries, and is great for data science."
    return "I'm not sure how to answer that."

# 1. Provide a prompt about machine learning
prompt1 = "Explain machine learning in one sentence for a high school student."
response1 = simulated_model(prompt1)

# 2. Provide a prompt about Python benefits
prompt2 = "List three benefits of Python as a bullet list."
response2 = simulated_model(prompt2)

# 3. Evaluate whether responses look helpful
good_response1 = "learn" in response1.lower()
good_response2 = "python" in response2.lower() or "libraries" in response2.lower()

# Don't change the code below - it's for testing
def check_prompting():
    return good_response1, good_response2
```

### Hidden Tests

Test 1: First response mentions learning
Test 2: Second response mentions Python or libraries

### Hints
- Be explicit in your prompt (format, audience, length)
- Provide examples if you want structured output
- Try different wording to see how the response changes

## Solution

Below is one possible correct implementation for the practice exercise.

```python
# No initial code block found.
```
