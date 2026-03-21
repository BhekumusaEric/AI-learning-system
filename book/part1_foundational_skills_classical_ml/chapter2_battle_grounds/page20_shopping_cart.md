---
title: "Kata 20: Shopping Cart"
type: "practice"
---

# ⚔️ Kata 20: Shopping Cart

Build a simple shopping cart class. This tests your understanding of classes and object-oriented programming.

## Rules

Write a `ShoppingCart` class with:
- `add_item(name, price, quantity=1)` — adds an item (or increases quantity if it already exists)
- `remove_item(name)` — removes an item completely
- `get_total()` — returns the total price (sum of price × quantity for all items)
- `get_item_count()` — returns total number of individual items (sum of all quantities)
- `apply_discount(percent)` — applies a percentage discount to the total (e.g. 10 means 10% off)

## Example

```python
cart = ShoppingCart()
cart.add_item("apple", 0.5, 3)   # 3 apples at $0.50 each
cart.add_item("bread", 2.0)       # 1 bread at $2.00
cart.get_total()                  # → 3.50
cart.get_item_count()             # → 4
cart.apply_discount(10)           # 10% off
cart.get_total()                  # → 3.15
```

### Initial Code

```python
class ShoppingCart:
    def __init__(self):
        self.items = {}  # name → {"price": float, "quantity": int}

    def add_item(self, name, price, quantity=1):
        if name in self.items:
            self.items[name]["quantity"] += quantity
        else:
            self.items[name] = {"price": price, "quantity": quantity}

    def remove_item(self, name):
        if name in self.items:
            del self.items[name]

    def get_total(self):
        total = 0
        for item in self.items.values():
            total += 
        return round(total, 2)

    def get_item_count(self):
        return sum(item["quantity"] for item in self.items.values())

    def apply_discount(self, percent):
        for name in self.items:
            self.items[name]["price"] = 
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

# Add more of an existing item
cart.add_item("apple", 0.5, 2)
assert cart.get_item_count() == 6
assert cart.get_total() == 4.5

# Remove item
cart.remove_item("bread")
assert cart.get_total() == 3.0
assert cart.get_item_count() == 5

# Remove non-existent item should not crash
cart.remove_item("milk")

# Discount
cart2 = ShoppingCart()
cart2.add_item("item", 10.0, 1)
cart2.apply_discount(10)
assert cart2.get_total() == 9.0, f"10% off $10 = $9, got {cart2.get_total()}"

cart3 = ShoppingCart()
cart3.add_item("a", 100.0)
cart3.apply_discount(25)
assert cart3.get_total() == 75.0

print("✅ All tests passed!")
```
