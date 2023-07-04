import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";

function Leaderboard({ elapsedTime }) {
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [submitted, playerName]);

  const fetchLeaderboardData = async () => {
    try {
      const leaderboardRef = firestore.collection("leaderboard");
      let snapshot = await leaderboardRef.orderBy("score").limit(10).get();
      let data = snapshot.docs.map((doc) => doc.data());

      if (submitted && playerName !== "") {
        const playerData = { name: playerName, score: elapsedTime };
        data.push(playerData);
      }

      console.log("Data from Firestore:", data); // Aggiunta della console.log

      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const handleSubmit = async () => {
    if (playerName.trim() === "") {
      return;
    }

    try {
      const leaderboardRef = firestore.collection("leaderboard");
      await leaderboardRef.add({
        name: playerName,
        score: elapsedTime,
      });
      setSubmitted(true);
      setPlayerName(""); // Reset player name input
    } catch (error) {
      console.error("Error adding player to leaderboard:", error);
    }
  };

  const handleHomepageClick = () => {
    window.location.reload();
  };

  if (!submitted) {
    return (
      <div className="endGameDiv">
        <p>{elapsedTime}</p>
        <div className="endGameInputAndButtonDiv">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboardDiv">
      <h2 className="leaderboardHeader">Leaderboard</h2>
      {leaderboardData.map((player, index) => (
        <div className="playerScores">
          <p classname="playerNames" key={index}>
            {player.name}:
          </p>
          <p classname="playerSingleScores" key={index}>
            {player.score}
          </p>
        </div>
      ))}
      <button onClick={handleHomepageClick}>Homepage</button>
    </div>
  );
}

export default Leaderboard;
