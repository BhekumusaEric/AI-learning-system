---
title: "Kata 5: Tic-Tac-Toe Winner"
type: "practice"
---

# ⚔️ Kata 5: Tic-Tac-Toe Winner

Given a Tic-Tac-Toe board, determine who won (if anyone).

## Rules

Write `tictactoe_winner(board)` that:
- Takes a 3×3 board as a list of 3 lists
- Each cell is `"X"`, `"O"`, or `" "` (space = empty)
- Returns `"X"` if X wins, `"O"` if O wins, `"Draw"` if board is full with no winner, `"Ongoing"` if game is still in progress

## Examples

```python
board = [
    ["X", "X", "X"],
    ["O", "O", " "],
    [" ", " ", " "]
]
tictactoe_winner(board) → "X"
```

> **Hint:** Check all 3 rows, all 3 columns, and both diagonals. That's 8 lines total.

### Initial Code

```python
def tictactoe_winner(board):
    # Build all 8 lines to check
    lines = []
    # 3 rows
    for row in board:
        lines.append(row)
    # 3 columns
    for col in range(3):
        lines.append([board[row][col] for row in range(3)])
    # 2 diagonals
    lines.append([board[i][i] for i in range(3)])
    lines.append([board[i][2 - i] for i in range(3)])

    # Check each line for a winner
    for line in lines:
        if line[0] == line[1] == line[2] and line[0] != " ":
            return 

    # Check for draw or ongoing
    flat = [cell for row in board for cell in row]
    if " " in flat:
        return 
    return 
```

### Evaluation Code

```python
# X wins via top row
assert tictactoe_winner([["X","X","X"],["O","O"," "],[" "," "," "]]) == "X"
# O wins via middle row
assert tictactoe_winner([["X"," ","X"],["O","O","O"],[" ","X"," "]]) == "O"
# X wins via left column
assert tictactoe_winner([["X","O","O"],["X","O"," "],["X"," "," "]]) == "X"
# O wins via right column
assert tictactoe_winner([["X","X","O"],["X"," ","O"],[" "," ","O"]]) == "O"
# X wins via main diagonal
assert tictactoe_winner([["X","O","O"],[" ","X"," "],["O"," ","X"]]) == "X"
# O wins via anti-diagonal
assert tictactoe_winner([["X","X","O"],["X","O"," "],["O"," "," "]]) == "O"
# Draw
assert tictactoe_winner([["X","O","X"],["X","X","O"],["O","X","O"]]) == "Draw"
# Ongoing
assert tictactoe_winner([[" "," "," "],[" "," "," "],[" "," "," "]]) == "Ongoing"
assert tictactoe_winner([["X"," "," "],[" ","O"," "],[" "," "," "]]) == "Ongoing"
print("✅ All tests passed!")
```
