import React, { useState, useEffect } from "react";
import { handleLogout, signInWithGoogle } from "../firebase";
import anonymousPic from "./images/anonymous2.svg";

function Nav({ time, gameStarted, formatTime, onTabellaButtonClick }) {
  const formattedTime = formatTime(time);
  const [pokemonPhotos, setPokemonPhotos] = useState(null);

  // Added useState for menuOpen
  const [menuOpen, setMenuOpen] = useState(false);

  // Function to handle opening and closing the menu
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLeaderboardClick = () => {
    onTabellaButtonClick(); // Call the parent component's function to update showTabella value
    setMenuOpen(false); // Close the menu after clicking the button
  };

  useEffect(() => {
    async function fetchPokemonPhotos() {
      try {
        const pokemonIds = [21, 29, 86]; // IDs of the three specific Pokémon to fetch
        const promises = pokemonIds.map((id) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then((response) => response.json())
            .then((data) => data.sprites.front_default)
        );
        const photos = await Promise.all(promises);
        setPokemonPhotos(photos);
      } catch (error) {
        console.log("Error fetching Pokémon photos:", error);
      }
    }

    fetchPokemonPhotos();
  }, [gameStarted]);

  return (
    <nav className="nav">
      {gameStarted ? (
        <>
          <div className="titleTimeContainer">
            <h1 className="title">PokèFinder</h1>
            <h2>{formattedTime}</h2>
          </div>
          <div className="itemsToFindDiv">
            <img
              className="itemsToFind"
              src={pokemonPhotos[0]}
              alt="placeholder"
            />
            <img
              className="itemsToFind"
              src={pokemonPhotos[1]}
              alt="placeholder"
            />
            <img
              className="itemsToFind"
              src={pokemonPhotos[2]}
              alt="placeholder"
            />
          </div>
          {localStorage.getItem("name") ? (
            <>
              <div className="navMenu" onClick={handleMenuToggle}>
                <div className="containerNamePhoto">
                  <h1 className="navName">{localStorage.getItem("name")}</h1>

                  <img
                    src={localStorage.getItem("profilePic")}
                    alt="user"
                    className={`userPic${menuOpen ? " opened" : ""}`}
                  />
                </div>
                {menuOpen && (
                  <div className="menuOptions">
                    <button className="menuButtons" onClick={handleLogout}>
                      Logout
                    </button>
                    <button
                      className="menuButtons"
                      onClick={handleLeaderboardClick}
                    >
                      Leaderboard
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="navMenu" onClick={handleMenuToggle}>
                <div className="containerNamePhoto">
                  <h1 className="navName">Anonymous</h1>

                  <img
                    src={anonymousPic}
                    alt="user"
                    className={`userPicA${menuOpen ? " opened" : ""}`}
                  />
                </div>
                {menuOpen && (
                  <div className="menuOptions">
                    <button className="menuButtons" onClick={signInWithGoogle}>
                      Login
                    </button>
                    <button
                      className="menuButtons"
                      onClick={handleLeaderboardClick}
                    >
                      Leaderboard
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      ) : (
        <h1>PokèFinder</h1>
      )}
    </nav>
  );
}

export default Nav;
