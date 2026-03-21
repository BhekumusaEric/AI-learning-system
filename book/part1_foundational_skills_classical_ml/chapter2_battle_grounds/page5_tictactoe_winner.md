---
title: "Kata 5: Tic-Tac-Toe Winner"
type: "practice"
---

# Kata 5: Tic-Tac-Toe Winner

Given a Tic-Tac-Toe board, determine the result.

## Rules

Write `tictactoe_winner(board)` that takes a 3x3 board (list of 3 lists).
Each cell is `"X"`, `"O"`, or `" "` (space means empty).

Return:
- `"X"` if X has three in a row
- `"O"` if O has three in a row
- `"Draw"` if the board is full with no winner
- `"Ongoing"` if the game is still in progress

## Example

```python
board = [["X","X","X"],["O","O"," "],[" "," "," "]]
tictactoe_winner(board)  → "X"
```

Check all 3 rows, all 3 columns, and both diagonals — 8 lines total.

### Initial Code

```python
def tictactoe_winner(board):
    lines = []
    for row in board:
        lines.append(row)
    for col in range(3):
        lines.append([board[row][col] for row in range(3)])
    lines.append([board[i][i] for i in range(3)])
    lines.append([board[i][2 - i] for i in range(3)])

    for line in lines:
        if line[0] == line[1] == line[2] and line[0] != " ":
            return line[0]

    flat = [cell for row in board for cell in row]
    if " " in flat:
        return "Ongoing"
    return 
```

### Evaluation Code

```python
assert tictactoe_winner([["X","X","X"],["O","O"," "],[" "," "," "]]) == "X", "X wins top row"
assert tictactoe_winner([["X"," ","X"],["O","O","O"],[" ","X"," "]]) == "O", "O wins middle row"
assert tictactoe_winner([["X","O","O"],["X","O"," "],["X"," "," "]]) == "X", "X wins left column"
assert tictactoe_winner([["X","X","O"],["X"," ","O"],[" "," ","O"]]) == "O", "O wins right column"
assert tictactoe_winner([["X","O","O"],[" ","X"," "],["O"," ","X"]]) == "X", "X wins main diagonal"
assert tictactoe_winner([["X","X","O"],["X","O"," "],["O"," "," "]]) == "O", "O wins anti-diagonal"
assert tictactoe_winner([["X","O","X"],["X","X","O"],["O","X","O"]]) == "Draw"
assert tictactoe_winner([[" "," "," "],[" "," "," "],[" "," "," "]]) == "Ongoing"
assert tictactoe_winner([["X"," "," "],[" ","O"," "],[" "," "," "]]) == "Ongoing"
print("All tests passed!")
```
