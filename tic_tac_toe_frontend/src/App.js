import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Modern, light-themed interactive Tic Tac Toe Game
 * Features:
 * - Centered grid
 * - Status at top
 * - Controls below grid
 * - Responsive layout
 * - Start/Restart
 * - Theming/color variables (uses CSS variables)
 */

// PUBLIC_INTERFACE
function App() {
  // --- GAME LOGIC STATE ---
  const emptyBoard = Array(9).fill(null);

  // "X" always starts first on new game
  const [board, setBoard] = useState(emptyBoard);
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("in_progress"); // "in_progress", "won", "draw"
  const [winner, setWinner] = useState(null);

  // --- THEME STATE ---
  const [theme, setTheme] = useState("light");

  // Effect to apply theme (light only, but keep for future extensibility)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setBoard(emptyBoard);
    setIsXNext(true);
    setStatus("in_progress");
    setWinner(null);
  };

  // Calculate winner logic (only if game is in progress)
  useEffect(() => {
    const w = calculateWinner(board);
    if (w) {
      setStatus("won");
      setWinner(w);
    } else if (board.every((cell) => cell !== null)) {
      setStatus("draw");
      setWinner(null);
    } else {
      setStatus("in_progress");
      setWinner(null);
    }
  }, [board]);

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (board[idx] || status !== "in_progress") return;

    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function getStatusMessage() {
    if (status === "won") {
      return (
        <span data-testid="winner">
          <b
            style={{
              color: "var(--primary-color)",
            }}
          >
            {winner}
          </b>{" "}
          wins!
        </span>
      );
    }
    if (status === "draw") return "It's a draw!";
    if (status === "in_progress")
      return `Turn: ${isXNext ? "X" : "O"}`;
    return "";
  }

  // PUBLIC_INTERFACE
  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  // --- RENDER ---------------------
  return (
    <div className="App" data-testid="tic-tac-toe-app">
      <header className="game-header">
        <h1 className="brand-title">
          Tic Tac Toe
        </h1>
        <div className="game-status" aria-live="polite">
          {getStatusMessage()}
        </div>
      </header>

      <div className="game-container">
        <Board
          board={board}
          onSquareClick={handleSquareClick}
          status={status}
        />
      </div>

      <div className="game-controls">
        <button
          className="btn-primary"
          onClick={handleRestart}
          aria-label="Restart"
        >
          {status === "in_progress" ? "Restart" : "Start New Game"}
        </button>
      </div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        style={{
          position: "fixed",
          top: 20,
          right: 20,
        }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <footer className="game-footer">
        <span>
          <span style={{ color: "var(--primary-color)" }}>X</span> &nbsp;|&nbsp;{" "}
          <span style={{ color: "var(--accent-color)" }}>O</span>
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onSquareClick, status }) {
  return (
    <div
      className={`ttt-board ${
        status !== "in_progress" ? "ttt-board--ended" : ""
      }`}
      data-testid="ttt-board"
    >
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          onClick={() => onSquareClick(idx)}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick }) {
  return (
    <button
      className="ttt-square"
      onClick={onClick}
      aria-label={value ? `Played: ${value}` : "Empty square"}
      disabled={Boolean(value)}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;
