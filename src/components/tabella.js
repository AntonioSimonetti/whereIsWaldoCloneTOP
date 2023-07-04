import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";

function Tabella({ onToggleShowTabella }) {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const leaderboardRef = firestore.collection("leaderboard");
      let snapshot = await leaderboardRef.orderBy("score").limit(10).get();
      let data = snapshot.docs.map((doc) => doc.data());
      setLeaderboardData(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };

  const handleHideTabella = () => {
    onToggleShowTabella(false); // Call the callback function to update showTabella in the parent
  };

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
      <button onClick={handleHideTabella}>Back</button>
    </div>
  );
}

export default Tabella;
