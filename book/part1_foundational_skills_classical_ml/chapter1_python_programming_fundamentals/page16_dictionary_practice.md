---
title: "Dictionary Practice"
type: "practice"
---

# Dictionary Practice

## Task

Write a function `build_profile(name, age, score)` that:
- Creates and returns a dictionary with keys `"name"`, `"age"`, `"score"`, and `"grade"`
- The `"grade"` value is determined by the score:
  - 90 and above → `"A"`
  - 80 to 89 → `"B"`
  - 70 to 79 → `"C"`
  - Below 70 → `"F"`

## Examples

```
build_profile("Alice", 17, 95) → {"name": "Alice", "age": 17, "score": 95, "grade": "A"}
build_profile("Bob", 16, 82)   → {"name": "Bob", "age": 16, "score": 82, "grade": "B"}
build_profile("Sam", 15, 65)   → {"name": "Sam", "age": 15, "score": 65, "grade": "F"}
```

## Things to think about

- Build the dictionary first, then figure out the grade with if/elif/else
- The dictionary must have exactly 4 keys: `"name"`, `"age"`, `"score"`, `"grade"`
- Return the whole dictionary

### Initial Code

```python
def build_profile(name, age, score):
    pass
```

### Evaluation Code

```python
r1 = build_profile("Alice", 17, 95)
assert r1["name"] == "Alice", f"Got {r1['name']}"
assert r1["age"] == 17, f"Got {r1['age']}"
assert r1["score"] == 95, f"Got {r1['score']}"
assert r1["grade"] == "A", f"Got {r1['grade']}"

r2 = build_profile("Bob", 16, 82)
assert r2["grade"] == "B", f"Got {r2['grade']}"

r3 = build_profile("Sam", 15, 75)
assert r3["grade"] == "C", f"Got {r3['grade']}"

r4 = build_profile("Dan", 14, 65)
assert r4["grade"] == "F", f"Got {r4['grade']}"

assert build_profile("X", 1, 90)["grade"] == "A", "Score of 90 should be grade A"
assert build_profile("X", 1, 89)["grade"] == "B", "Score of 89 should be grade B"
assert build_profile("X", 1, 70)["grade"] == "C", "Score of 70 should be grade C"
assert build_profile("X", 1, 69)["grade"] == "F", "Score of 69 should be grade F"
assert set(build_profile("X", 1, 80).keys()) == {"name", "age", "score", "grade"}, "Dictionary must have exactly 4 keys"
print("All tests passed!")
```
