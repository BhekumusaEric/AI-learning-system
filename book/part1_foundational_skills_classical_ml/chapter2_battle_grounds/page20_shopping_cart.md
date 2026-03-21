---
title: "Kata 20: Shopping Cart"
type: "practice"
---

# Kata 20: Shopping Cart

Build a shopping cart using a class. This kata tests your understanding of object-oriented programming.

## Rules

Write a class `ShoppingCart` with the following methods:

- `add_item(name, price, quantity=1)` — adds an item to the cart. If the item already exists, increase its quantity by the given amount.
- `remove_item(name)` — removes an item completely. Does nothing if the item is not in the cart.
- `get_total()` — returns the total price as a float rounded to 2 decimal places. Total is the sum of `price * quantity` for all items.
- `get_item_count()` — returns the total number of individual items (the sum of all quantities).
- `apply_discount(percent)` — reduces each item's price by the given percentage. For example, `10` means 10% off.

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

## Things to think about

- Store items in a dictionary: `self.items = {}` where each key is the item name and the value holds the price and quantity.
- `{"price": price, "quantity": quantity}` is a good structure for each item.
- For `get_total`, multiply price by quantity for each item and sum them all up.
- For `apply_discount`, multiply each item's price by `(1 - percent / 100)`.
- An empty cart should have a total of 0 and an item count of 0.

### Initial Code

```python
class ShoppingCart:
    def __init__(self):
        # your code here
        pass

    def add_item(self, name, price, quantity=1):
        # your code here
        pass

    def remove_item(self, name):
        # your code here
        pass

    def get_total(self):
        # your code here
        pass

    def get_item_count(self):
        # your code here
        pass

    def apply_discount(self, percent):
        # your code here
        pass
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
