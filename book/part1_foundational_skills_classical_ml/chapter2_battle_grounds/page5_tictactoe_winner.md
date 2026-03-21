---
title: "Kata 5: Tic-Tac-Toe Winner"
type: "practice"
---

# Kata 5: Tic-Tac-Toe Winner

Given a Tic-Tac-Toe board, determine the result of the game.

## Rules

Write a function `tictactoe_winner(board)` that takes a 3x3 board represented as a list of 3 lists. Each cell contains `"X"`, `"O"`, or `" "` (a space means the cell is empty).

Return:
- `"X"` if X has three in a row
- `"O"` if O has three in a row
- `"Draw"` if the board is full and there is no winner
- `"Ongoing"` if the game is still in progress

## Example

```python
board = [["X","X","X"],["O","O"," "],[" "," "," "]]
tictactoe_winner(board)  → "X"
```

## Things to think about

- There are 8 possible winning lines: 3 rows, 3 columns, and 2 diagonals.
- For each line, check if all 3 cells are the same and not empty.
- To check columns, `board[row][col]` where `col` is fixed and `row` varies.
- The main diagonal is `board[0][0]`, `board[1][1]`, `board[2][2]`.
- The anti-diagonal is `board[0][2]`, `board[1][1]`, `board[2][0]`.
- If no winner and no empty cells remain, it is a draw.
- If no winner and at least one empty cell exists, the game is ongoing.

### Initial Code

```python
def tictactoe_winner(board):
    # your code here
    pass
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
