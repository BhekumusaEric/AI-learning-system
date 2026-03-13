# Function Writing Practice

## Practice: Writing Functions

Write a function that converts temperature from Celsius to Fahrenheit.

Formula: F = C × 9/5 + 32

### Initial Code

```python
# Write a temperature conversion function

def celsius_to_fahrenheit(celsius):
    # Convert Celsius to Fahrenheit
    # Formula: F = C * 9/5 + 32
    # Return the Fahrenheit value
    
    return 0  # Replace this with your calculation

# Test your function
fahrenheit = celsius_to_fahrenheit(20)
print(fahrenheit)  # Should be 68.0
```

### Hidden Tests

Test 1: celsius_to_fahrenheit(0) returns 32.0
Test 2: celsius_to_fahrenheit(20) returns 68.0
Test 3: celsius_to_fahrenheit(100) returns 212.0
Test 4: Returns a float

### Hints
- Use the formula: celsius * 9/5 + 32
- Make sure to use floating point division (9/5, not 9//5)
- Return the calculated value

## Solution

Below is one possible correct implementation for the practice exercise.

```python
# Write a temperature conversion function

def celsius_to_fahrenheit(celsius):
    # Convert Celsius to Fahrenheit
    # Formula: F = C * 9/5 + 32
    # Return the Fahrenheit value
    
    return 0  # Replace this with your calculation

# Test your function
fahrenheit = celsius_to_fahrenheit(20)
print(fahrenheit)  # Should be 68.0
```
