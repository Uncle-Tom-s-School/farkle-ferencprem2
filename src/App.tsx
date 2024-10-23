import React, { useState } from 'react';
import Dice from './components/Dice';
import './styles/App.css'

const FarkleGame: React.FC = () => {
  const targetScore = 5000;
  const [dice, setDice] = useState<number[]>(Array(6).fill(1));
  const [selectedDice, setSelectedDice] = useState<boolean[]>(Array(6).fill(false));
  const [currentTurnScore, setCurrentTurnScore] = useState<number>(0);
  const [remainingDice, setRemainingDice] = useState<number[]>(dice);
  const [playerTurn, setPlayerTurn] = useState<number>(1);
  const [playerScores, setPlayerScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [farkle, setFarkle] = useState<boolean>(false);

  const rollDice = () => {
    const rolledDice = remainingDice.map(() => Math.floor(Math.random() * 6) + 1);
    setRemainingDice(rolledDice);
    setSelectedDice(Array(6).fill(false)); 
  
    calculateScore(rolledDice);
  };

  const toggleSelectDice = (index: number) => {
    setSelectedDice((prev) => prev.map((sel, i) => (i === index ? !sel : sel)));
  };


  const calculateScore = (rolledDice: number[]) => {
    let tempScore = 0;
    const diceCount = Array(6).fill(0);
  
    rolledDice.forEach((die) => {
      diceCount[die - 1]++;
    });
  
  
    tempScore += diceCount[0] * 100; 
    tempScore += diceCount[4] * 50;  
  
  
    for (let i = 1; i < 6; i++) {
      if (diceCount[i] >= 3) {
        tempScore += (i + 1) * 100; 
        if (diceCount[i] >= 4) {
          tempScore += (i + 1) * 100;
        }
      }
    }
  

    if (diceCount[0] >= 3) {
      tempScore += 1000 - (3 * 100); 
    }
  
    
    if (tempScore === 0) {
      setFarkle(true);
    } else {
      setCurrentTurnScore((prev) => prev + tempScore);
    }
  };

  
  const endTurn = () => {
    if (farkle) {
      alert("Farkle! No points this round.");
      setCurrentTurnScore(0); 
      setFarkle(false);
    } else {
      
      setPlayerScores((prevScores) => {
        const updatedScores = { ...prevScores };
        if (playerTurn === 1) {
          updatedScores.player1 += currentTurnScore;
        } else {
          updatedScores.player2 += currentTurnScore;
        }
        return updatedScores;
      });
    }

    checkEndGame(); 
    setCurrentTurnScore(0); 
    setPlayerTurn(playerTurn === 1 ? 2 : 1); 
  };

  const quitTurn = () => {
    endTurn();
  };

  const checkEndGame = () => {
    if (playerScores.player1 >= targetScore || playerScores.player2 >= targetScore) {
      if (playerScores.player1 >= targetScore) {
        setWinner('Player 1');
      } else if (playerScores.player2 >= targetScore) {
        setWinner('Player 2');
      }
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setDice(Array(6).fill(1));
    setSelectedDice(Array(6).fill(false));
    setCurrentTurnScore(0);
    setPlayerTurn(1);
    setPlayerScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setWinner(null);
    setFarkle(false);
  };

  return (
    <div className="farkle-game">
      <h1>Farkle Game</h1>
      {gameOver ? (
        <div className="game-over">
          <h2>{winner} Wins!</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <>
          
          <div className="scoreboard player-2-scoreboard">
            <h2>Opponent’s Tab</h2>
            <p>Total: {playerScores.player2}</p>
            <p>Round: {playerTurn === 2 ? currentTurnScore : 0}</p>
          </div>

          
          <div className="scoreboard player-1-scoreboard">
            <h2>Your Tab</h2>
            <p>Total: {playerScores.player1}</p>
            <p>Round: {playerTurn === 1 ? currentTurnScore : 0}</p>
          </div>

          <div className="dice-container">
            {remainingDice.map((die, index) => (
              <Dice
                key={index}
                value={die}
                selected={selectedDice[index]}
                onSelect={() => toggleSelectDice(index)}
              />
            ))}
          </div>

          <div>
            <button onClick={rollDice}>Roll Dice</button>
            <button onClick={endTurn}>End Turn</button>
            <button onClick={quitTurn}>Quit Turn</button>
          </div>
        </>
      )}
    </div>
  );
};

export default FarkleGame;
