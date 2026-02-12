import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [puzzleType, setPuzzleType] = useState('sudoku');

  return (
    <div className="App">
      <header className="app-header">
        <h1>Daily Logic Puzzle</h1>
        <div className="controls-bar">
          <label>
            Date:
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
          </label>
          <label>
            Type:
            <select value={puzzleType} onChange={(e) => setPuzzleType(e.target.value)}>
              <option value="sudoku">Sudoku</option>
              <option value="sequence" disabled>Sequence (Coming Soon)</option>

              <option value="pattern" disabled>Pattern (Coming Soon)</option>
            </select>
          </label>
        </div>
      </header>

      <main>
        <GameBoard dateString={currentDate} puzzleType={puzzleType} />
      </main>
    </div>
  );
}

export default App;
