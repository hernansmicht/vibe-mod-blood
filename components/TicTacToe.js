'use client'

import { useState, useEffect } from 'react'
import Cell from './Cell'
import styles from './TicTacToe.module.css'

export default function TicTacToe() {
  // Game state
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameStatus, setGameStatus] = useState('playing') // 'playing', 'player_won', 'computer_won', 'draw'

  // Check for win or draw
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

  // Computer move logic
  const computerMove = (currentBoard) => {
    // If game is over, do nothing
    if (gameStatus !== 'playing') return;
    
    // Create a copy of the current board
    const newBoard = [...currentBoard];
    
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

  // Handle player move
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
    
    // Trigger computer move after a short delay, passing the updated board
    setTimeout(() => {
      computerMove(newBoard);
    }, 500);
  };

  // Reset game
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
  };

  // Render game board
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
      
      {/* Game status display */}
      <div className={styles.status}>
        {gameStatus === 'playing' && (
          isPlayerTurn ? 'Your turn (X)' : 'Computer thinking... (O)'
        )}
        {gameStatus === 'player_won' && 'You won! 🎉'}
        {gameStatus === 'computer_won' && 'Computer won! 😢'}
        {gameStatus === 'draw' && 'Game ended in a draw! 🤝'}
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