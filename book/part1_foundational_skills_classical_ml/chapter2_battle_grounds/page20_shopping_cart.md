---
title: "Kata 20: Shopping Cart"
type: "practice"
---

# Kata 20: Shopping Cart

Build a shopping cart class. This tests your understanding of classes and object-oriented programming.

## Rules

Write a `ShoppingCart` class with these methods:
- `add_item(name, price, quantity=1)` — adds an item, or increases quantity if it already exists
- `remove_item(name)` — removes an item completely (does nothing if item not found)
- `get_total()` — returns the total price (price x quantity for all items, rounded to 2 decimal places)
- `get_item_count()` — returns the total number of individual items (sum of all quantities)
- `apply_discount(percent)` — reduces each item's price by the given percentage (e.g. 10 means 10% off)

## Example

```python
cart = ShoppingCart()
cart.add_item("apple", 0.5, 3)
cart.add_item("bread", 2.0)
cart.get_total()       → 3.5
cart.get_item_count()  → 4
cart.apply_discount(10)
cart.get_total()       → 3.15
```

### Initial Code

```python
class ShoppingCart:
    def __init__(self):
        self.items = {}

    def add_item(self, name, price, quantity=1):
        if name in self.items:
            self.items[name]["quantity"] += quantity
        else:
            self.items[name] = {"price": price, "quantity": quantity}

    def remove_item(self, name):
        if name in self.items:
            del self.items[name]

    def get_total(self):
        total = sum(item["price"] * item["quantity"] for item in self.items.values())
        return round(total, 2)

    def get_item_count(self):
        return sum(item["quantity"] for item in self.items.values())

    def apply_discount(self, percent):
        for name in self.items:
            self.items[name]["price"] = round(self.items[name]["price"] * (1 - percent / 100), 10)
```

### Evaluation Code

```python
cart = ShoppingCart()
assert cart.get_total() == 0, "Empty cart total should be 0"
assert cart.get_item_count() == 0

cart.add_item("apple", 0.5, 3)
assert cart.get_total() == 1.5
assert cart.get_item_count() == 3

cart.add_item("bread", 2.0)
assert cart.get_total() == 3.5
assert cart.get_item_count() == 4

cart.add_item("apple", 0.5, 2)
assert cart.get_item_count() == 6
assert cart.get_total() == 4.5

cart.remove_item("bread")
assert cart.get_total() == 3.0
assert cart.get_item_count() == 5

cart.remove_item("milk")

cart2 = ShoppingCart()
cart2.add_item("item", 10.0, 1)
cart2.apply_discount(10)
assert cart2.get_total() == 9.0, f"10% off 10.0 = 9.0, got {cart2.get_total()}"

cart3 = ShoppingCart()
cart3.add_item("a", 100.0)
cart3.apply_discount(25)
assert cart3.get_total() == 75.0

print("All tests passed!")
```
