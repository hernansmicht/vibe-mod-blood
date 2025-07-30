# Tic Tac Toe Implementation Plan

## Overview
This document outlines the implementation plan for a single-player Tic Tac Toe game against a computer opponent with basic AI. The game will replace the current content on the main page of the Next.js application.

## Component Structure

### 1. TicTacToe Component
The main component that manages the game state and renders the board.

**File:** `components/TicTacToe.js`

```jsx
'use client'

import { useState, useEffect } from 'react'
import Cell from './Cell'
import styles from './TicTacToe.module.css'

export default function TicTacToe() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'player_won', 'computer_won', 'draw'

  // Handle player move
  const handleCellClick = (index) => {
    // Logic for player move
  }

  // Computer move logic
  const computerMove = () => {
    // AI logic for computer move
  }

  // Check for win or draw
  const checkGameStatus = (board, player) => {
    // Logic to check for win or draw
  }

  // Reset game
  const resetGame = () => {
    // Logic to reset the game
  }

  // Render game board
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
      
      {/* Game status display */}
      <div className={styles.status}>
        {/* Display game status (whose turn, winner, draw) */}
      </div>
      
      {/* Game board */}
      <div className={styles.board}>
        {board.map((value, index) => (
          <Cell 
            key={index} 
            value={value} 
            onClick={() => handleCellClick(index)} 
            disabled={!isPlayerTurn || gameStatus !== 'playing' || value !== null}
          />
        ))}
      </div>
      
      {/* Reset button */}
      <button className={styles.resetButton} onClick={resetGame}>
        Reset Game
      </button>
    </div>
  )
}
```

### 2. Cell Component
Renders an individual cell of the game board.

**File:** `components/Cell.js`

```jsx
import styles from './Cell.module.css'

export default function Cell({ value, onClick, disabled }) {
  return (
    <button 
      className={styles.cell} 
      onClick={onClick} 
      disabled={disabled}
    >
      {value}
    </button>
  )
}
```

## CSS Modules

### 1. TicTacToe.module.css
Styling for the main game component.

**File:** `components/TicTacToe.module.css`

```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 500px;
  margin: 0 auto;
}

.title {
  font-size: 2rem;
  margin-bottom: 20px;
}

.status {
  font-size: 1.2rem;
  margin-bottom: 20px;
  height: 30px;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  margin-bottom: 20px;
}

.resetButton {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #0076ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.resetButton:hover {
  background-color: rgba(0, 118, 255, 0.8);
}
```

### 2. Cell.module.css
Styling for the individual cell component.

**File:** `components/Cell.module.css`

```css
.cell {
  width: 100px;
  height: 100px;
  font-size: 3rem;
  font-weight: bold;
  background-color: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.cell:hover:not(:disabled) {
  background-color: #e9ecef;
}

.cell:disabled {
  cursor: default;
}
```

## Game Logic Implementation

### 1. Player Move Logic
Handle player clicks on cells.

```jsx
const handleCellClick = (index) => {
  // If cell is already filled or it's not player's turn or game is over, do nothing
  if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;
  
  // Create a new board with player's move
  const newBoard = [...board];
  newBoard[index] = 'X';
  setBoard(newBoard);
  
  // Check if player won or game is draw
  const result = checkGameStatus(newBoard, 'X');
  if (result === 'win') {
    setGameStatus('player_won');
    return;
  } else if (result === 'draw') {
    setGameStatus('draw');
    return;
  }
  
  // Switch turn to computer
  setIsPlayerTurn(false);
  
  // Trigger computer move after a short delay
  setTimeout(() => {
    computerMove();
  }, 500);
};
```

### 2. Computer Move Logic (AI)
Implement basic AI for computer opponent.

```jsx
const computerMove = () => {
  // Create a copy of the board
  const newBoard = [...board];
  
  // If game is over, do nothing
  if (gameStatus !== 'playing') return;
  
  // AI logic to determine the best move
  const bestMove = findBestMove(newBoard);
  
  // Make the move
  newBoard[bestMove] = 'O';
  setBoard(newBoard);
  
  // Check if computer won or game is draw
  const result = checkGameStatus(newBoard, 'O');
  if (result === 'win') {
    setGameStatus('computer_won');
    return;
  } else if (result === 'draw') {
    setGameStatus('draw');
    return;
  }
  
  // Switch turn back to player
  setIsPlayerTurn(true);
};

// Helper function to find the best move for the computer
const findBestMove = (board) => {
  // Check if computer can win in the next move
  const winningMove = findWinningMove(board, 'O');
  if (winningMove !== -1) return winningMove;
  
  // Check if player can win in the next move and block it
  const blockingMove = findWinningMove(board, 'X');
  if (blockingMove !== -1) return blockingMove;
  
  // Take center if available
  if (board[4] === null) return 4;
  
  // Take corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(corner => board[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Take any available cell
  const availableCells = board.map((cell, index) => cell === null ? index : null).filter(cell => cell !== null);
  return availableCells[Math.floor(Math.random() * availableCells.length)];
};

// Helper function to find a winning move
const findWinningMove = (board, player) => {
  // Define winning combinations (rows, columns, diagonals)
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  
  // Check each winning combination
  for (const combination of winCombinations) {
    const [a, b, c] = combination;
    // Check if two cells have the player's symbol and the third is empty
    if (board[a] === player && board[b] === player && board[c] === null) return c;
    if (board[a] === player && board[c] === player && board[b] === null) return b;
    if (board[b] === player && board[c] === player && board[a] === null) return a;
  }
  
  return -1; // No winning move found
};
```

### 3. Win/Draw Detection Logic
Check for win or draw conditions.

```jsx
const checkGameStatus = (board, player) => {
  // Define winning combinations (rows, columns, diagonals)
  const winCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  
  // Check for win
  for (const combination of winCombinations) {
    const [a, b, c] = combination;
    if (board[a] === player && board[b] === player && board[c] === player) {
      return 'win';
    }
  }
  
  // Check for draw (all cells filled)
  if (!board.includes(null)) {
    return 'draw';
  }
  
  // Game continues
  return 'playing';
};
```

### 4. Reset Game Logic
Reset the game state.

```jsx
const resetGame = () => {
  setBoard(Array(9).fill(null));
  setIsPlayerTurn(true);
  setGameStatus('playing');
};
```

### 5. Game Status Display
Display the current game status.

```jsx
{/* Game status display */}
<div className={styles.status}>
  {gameStatus === 'playing' && (
    isPlayerTurn ? 'Your turn (X)' : 'Computer thinking... (O)'
  )}
  {gameStatus === 'player_won' && 'You won! 🎉'}
  {gameStatus === 'computer_won' && 'Computer won! 😢'}
  {gameStatus === 'draw' && 'Game ended in a draw! 🤝'}
</div>
```

## Main Page Update
Update the main page to use the TicTacToe component.

**File:** `app/page.tsx`

```jsx
'use client'

import TicTacToe from '../components/TicTacToe'
import styles from '../styles/home.module.css'

export default () => {
  return (
    <main className={styles.main}>
      <TicTacToe />
    </main>
  );
}
```

## Implementation Steps

1. Create the Cell component and its CSS module
2. Create the TicTacToe component and its CSS module
3. Implement the game logic functions
4. Update the main page to use the TicTacToe component
5. Test the game functionality