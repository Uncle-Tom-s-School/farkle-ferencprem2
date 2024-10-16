import React, { useState } from 'react';
import './styles/App.css'

function App() {
  const [dice, setDice] = useState(Array(6).fill(1));
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [turnScore, setTurnScore] = useState(0);
  const [selectedDice, setSelectedDice] = useState([]);
  const [gameMessage, setGameMessage] = useState("Start your turn by rolling all dice!");
  const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
  const [round, setRound] = useState(1);

  // Roll all dice or remaining dice
  const rollDice = () => {
    const newDice = dice.map((die, index) =>
      selectedDice.includes(index) ? die : Math.floor(Math.random() * 6) + 1
    );
    setDice(newDice);
    calculateScore(newDice);
  };

  // Select and set aside scoring dice
  const selectDie = (index) => {
    if (!selectedDice.includes(index)) {
      setSelectedDice([...selectedDice, index]);
    }
  };

  // End the turn and add the turn score to the current player's total score
  const endTurn = () => {
    if (isPlayer1Turn) {
      setPlayer1Score(player1Score + turnScore);
    } else {
      setPlayer2Score(player2Score + turnScore);
    }
    setTurnScore(0);
    setSelectedDice([]);
    setDice(Array(6).fill(1));
    setGameMessage("Turn ended. Next player's turn!");
    setIsPlayer1Turn(!isPlayer1Turn);
    setRound(round + 1);
  };

  // Calculate the score for the current roll
  const calculateScore = (currentDice) => {
    let counts = Array(6).fill(0);
    currentDice.forEach((die, index) => {
      if (!selectedDice.includes(index)) {
        counts[die - 1]++;
      }
    });

    let tempScore = 0;
    // Scoring for 1s and 5s
    tempScore += counts[0] * 100;
    tempScore += counts[4] * 50;

    // Scoring for three or more of a kind
    for (let i = 0; i < 6; i++) {
      if (counts[i] >= 3) {
        tempScore += (i === 0 ? 1000 : (i + 1) * 100) * Math.pow(2, counts[i] - 3);
      }
    }

    if (tempScore === 0) {
      setGameMessage("Farkle! You lost your turn score.");
      setTurnScore(0);
      setSelectedDice([]);
      return;
    }

    setTurnScore(turnScore + tempScore);
    setGameMessage("You scored " + tempScore + " points. Keep rolling or end your turn!");
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Farkle Game</h1>
        <div className="player-info opponent-info">
          <p>Total: <span className="total-score">{player2Score}</span> / <span className="target-score red">5000</span></p>
          <p>Current: {isPlayer1Turn ? 0 : turnScore}</p>
          <p className="info-row">
            Round: <span className="red">{round}</span>
            <span className="selected-dice">Selected: <span className="red">{selectedDice.length}</span></span>
          </p>
        </div>
        <div className="player-info player1-info">
          <p>Total: <span className="total-score">{player1Score}</span> / <span className="target-score red">5000</span></p>
          <p>Current: {isPlayer1Turn ? turnScore : 0}</p>
          <p className="info-row">
            Round: <span className="red">{round}</span>
            <span className="selected-dice">Selected: <span className="red">{selectedDice.length}</span></span>
          </p>
        </div>
      </header>
      <main className="main-container">
        <div className="dice-container">
          {dice.map((die, index) => (
            <div
              key={index}
              className={`die ${selectedDice.includes(index) ? 'selected' : ''}`}
              onClick={() => selectDie(index)}
            >
              {die}
            </div>
          ))}
        </div>
        <div className="buttons-container">
          <button className="roll-button" onClick={rollDice}>Roll Dice (F)</button>
          <button className="end-button" onClick={endTurn}>End Turn (Q)</button>
        </div>
      </main>
      <footer className="footer">
        <p>Use "E" to select dice, "F" to roll, and "Q" to end your turn.</p>
      </footer>
    </div>
  );
}

export default App;