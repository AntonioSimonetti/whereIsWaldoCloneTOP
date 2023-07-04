import "./App.css";
import React, { useState, useEffect } from "react";
import Nav from "./components/nav";
import GameControls from "./components/gameControls";
import ResultComponent from "./components/result";
import Alternate from "./components/homepage";
import Leaderboard from "./components/leaderboard";
import Tabella from "./components/tabella";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [receivedResult, setReceivedResult] = useState("");
  const [allPokemonFound, setAllPokemonFound] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTabella, setShowTabella] = useState(false);

  const handleTabellaButtonClick = () => {
    setShowTabella(true);
  };

  const handleTabellaToggle = (value) => {
    setShowTabella(value);
  };

  const handlePokemonFound = () => {
    setAllPokemonFound(true);
  };

  function handleStart() {
    setGameStarted(true);
  }

  useEffect(() => {
    if (gameStarted) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [gameStarted]);

  const handleStop = () => {
    setGameStarted(false);
    setElapsedTime(formatTime(time));
    console.log(elapsedTime);
  };

  function formatTime(time) {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }

  const receiveData = (dati) => {
    setReceivedResult(dati);
    console.log(receivedResult);
  };

  return (
    <div className="App">
      <Nav
        time={time}
        formatTime={formatTime}
        gameStarted={gameStarted}
        onTabellaButtonClick={handleTabellaButtonClick}
      />
      <ResultComponent result={receivedResult} />
      {showTabella ? (
        <Tabella onToggleShowTabella={handleTabellaToggle} />
      ) : allPokemonFound ? (
        <Leaderboard elapsedTime={elapsedTime} />
      ) : gameStarted ? (
        <GameControls
          receiveData={receiveData}
          handlePokemonFound={handlePokemonFound}
          handleStop={handleStop}
        />
      ) : (
        <Alternate onStart={handleStart} />
      )}
    </div>
  );
}

export default App;

//targeting box when clicked
//targeting box that stays in place when correct position
//validation for the name
