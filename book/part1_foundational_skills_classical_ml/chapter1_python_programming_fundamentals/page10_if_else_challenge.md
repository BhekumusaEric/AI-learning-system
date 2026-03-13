# If/Else Challenge

## Practice: Conditional Logic

Write code that takes a number and classifies it as positive, negative, or zero.

### Initial Code

```python
# Classify a number

def classify_number(num):
    # Write your if-elif-else logic here
    # Return "positive", "negative", or "zero"
    
    return "unknown"  # Replace this

# Test your function
result = classify_number(5)
print(result)  # Should print "positive"
```

### Hidden Tests

Test 1: classify_number(5) returns "positive"
Test 2: classify_number(-3) returns "negative"
Test 3: classify_number(0) returns "zero"
Test 4: classify_number(100) returns "positive"

### Hints
- Use if num > 0 for positive
- Use elif num < 0 for negative
- Use else for zero
- Return the string, don't print it