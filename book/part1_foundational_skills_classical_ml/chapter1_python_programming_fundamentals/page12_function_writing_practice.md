---
title: "Function Writing Practice"
type: "practice"
resources:
  - title: "W3Schools: Python Functions"
    url: "https://www.w3schools.com/python/python_functions.asp"
---

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
    # Return the result
    pass

# Don't change the code below - it's for testing
def check_celsius():
    return celsius_to_fahrenheit
```

### Hidden Tests

Test 1: celsius_to_fahrenheit(0) returns 32.0
Test 2: celsius_to_fahrenheit(20) returns 68.0
Test 3: celsius_to_fahrenheit(100) returns 212.0
Test 4: Returns a float

### Evaluation Code
```python
assert abs(celsius_to_fahrenheit(0) - 32.0) < 1e-6, "Expected 0 Celsius to be 32.0 Fahrenheit"
assert abs(celsius_to_fahrenheit(20) - 68.0) < 1e-6, "Expected 20 Celsius to be 68.0 Fahrenheit"
assert abs(celsius_to_fahrenheit(100) - 212.0) < 1e-6, "Expected 100 Celsius to be 212.0 Fahrenheit"
assert isinstance(celsius_to_fahrenheit(0), float), "Expected the return value to be a float"
```

### Hints
- Use the formula: celsius * 9/5 + 32
- Make sure to use floating point division (9/5, not 9//5)
- Return the calculated value