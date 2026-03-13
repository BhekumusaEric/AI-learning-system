---
title: "Python Official Documentation"
type: "read"
resources:
  - title: "Python Types and Variables"
    url: "https://docs.python.org/3/tutorial/introduction.html#using-python-as-a-calculator"
---

# Variable Practice

## Practice: Creating Variables

Create variables of different data types: a string, an integer, a float, and a boolean.

### Initial Code

```python
# Create variables of different types

# 1. Create a string variable called 'my_name' with your name
my_name = 

# 2. Create an integer variable called 'my_age' with your age
my_age = 

# 3. Create a float variable called 'pi_approx' with approximately 3.14
pi_approx = 

# 4. Create a boolean variable called 'is_fun' with True
is_fun = 

# Don't change the code below - it's for testing
def check_variables():
    return my_name, my_age, pi_approx, is_fun
```

### Hidden Tests

Test 1: my_name is a string
Test 2: my_age is an integer
Test 3: pi_approx is a float approximately 3.14
Test 4: is_fun is True

### Evaluation Code
```python
# Evaluate variable types and values
assert type(my_name) == str, "Expected 'my_name' to be a string"
assert len(my_name) > 0, "Expected 'my_name' string to not be empty"

assert type(my_age) == int, "Expected 'my_age' to be an integer"
assert my_age > 0, "'my_age' should be a realistic positive number"

assert type(pi_approx) == float, "Expected 'pi_approx' to be a float"
assert abs(pi_approx - 3.14) < 0.01, "'pi_approx' value is incorrect (expected closely 3.14)"

assert type(is_fun) == bool, "Expected 'is_fun' to be a boolean"
assert is_fun == True, "Expected 'is_fun' to be True"
```

### Hints
- Strings need quotes around them
- Integers have no decimal point
- Floats have decimal points
- Booleans are True or False (capitalized)