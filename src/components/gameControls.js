import React, { useState, useEffect, useRef } from "react";
import gamePhoto from "./images/pokemonGame.png";
import { fetchCoordinates } from "../firebase";

function GameControls({ receiveData, handlePokemonFound, handleStop }) {
  const [foundPokemon, setFoundPokemon] = useState([]); // Variable to alternate a phrase in the message
  const [alternatePhrase, setAlternatePhrase] = useState(false); //Toggle between two phrases when wrong Pokémon is selected
  const [coordinates, setCoordinates] = useState([]); //Stores the coordinates fetched from the DB
  const [calculatedCoordinates, setCalculatedCoordinates] = useState([]); //Stores the transformed coordinates based on the image sizes
  const [clickCoordinates, setClickCoordinates] = useState(null); //Stores user's click coordinates for game interaction
  const [ShowTargetingBox, setShowTargetingBox] = useState(true); //Display or hide the targeting box
  const [showSpearow, setShowSpearow] = useState(false); //Show Spearow's position on the image
  const [showNidoran, setShowNidoran] = useState(false); //Show Nidoran's position on the image
  const [showSeel, setShowSeel] = useState(false); //Show Seel's position on the image
  const [buttonVisibility, setButtonVisibility] = useState(true); //Show or hide the pokemon buttons menu

  //Fetches the winning positions from the DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCoordinates = await fetchCoordinates();
        setCoordinates(fetchedCoordinates);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchData();
  }, []);

  // Transforms the points from the database based on image size and position and stores into calculatedCoordinates
  const transformCoordinates = () => {
    const image = document.getElementById("image");
    const imageRect = image.getBoundingClientRect();

    const newCoordinates = coordinates.map((point) => {
      return {
        x: calculateX(point.x, imageRect.width),
        y: calculateY(point.y, imageRect.height),
      };
    });

    setCalculatedCoordinates(newCoordinates);
  };

  // triggers when the image is resized to update the coordinates
  useEffect(() => {
    const handleResize = () => {
      transformCoordinates();
    };

    const image = document.getElementById("image");
    image.addEventListener("load", transformCoordinates);
    window.addEventListener("resize", handleResize);

    transformCoordinates(); // Initial calculation

    return () => {
      image.removeEventListener("load", transformCoordinates);
      window.removeEventListener("resize", handleResize);
    };
  }, [coordinates]);

  const calculateX = (entityX, imageWidth) => {
    const newX = (entityX / 100) * imageWidth;
    return newX;
  };

  const calculateY = (entityY, imageHeight) => {
    const newY = (entityY / 100) * imageHeight;
    return newY;
  };

  //Capture the user's click position and stores it. Open the pokemon menu.
  const handleClick = (event) => {
    const image = document.getElementById("image");
    const imageRect = image.getBoundingClientRect();
    const clickX = event.clientX - imageRect.left;
    const clickY = event.clientY - imageRect.top;

    setClickCoordinates({ x: clickX, y: clickY });
    setButtonVisibility(true);
  };

  //check if user has find all the pokemon
  useEffect(() => {
    const totalPokemonCount = 3;

    if (foundPokemon.length === totalPokemonCount) {
      receiveData("You have found all the Pokémon!");
      handlePokemonFound();
      handleStop();
    }
  }, [foundPokemon]);

  //Check if the user has find the pokemon Spearow
  function findSpearow() {
    const clickX = clickCoordinates.x;
    const clickY = clickCoordinates.y;

    const pokemonNames = "Spearow";
    let tolerance = 25;
    let foundPokemonIndex = -1;

    const { x, y } = calculatedCoordinates[2];
    const isWithinRangeX = Math.abs(clickX - x) <= tolerance;
    const isWithinRangeY = Math.abs(clickY - y) <= tolerance;

    if (isWithinRangeX && isWithinRangeY) {
      if (!foundPokemon.includes(pokemonNames)) {
        receiveData(`You find ${pokemonNames}!`);
        setFoundPokemon((prevFoundPokemon) => [
          ...prevFoundPokemon,
          pokemonNames,
        ]);

        setShowSpearow(true); //Show the pokemon position on the image
      } else {
        receiveData(`You have already found the Pokémon ${pokemonNames}!`);
      }
      foundPokemonIndex = 2;
    }
    if (foundPokemonIndex === -1) {
      if (alternatePhrase) {
        receiveData("It's not the right Pokémon. Please try again...");
      } else {
        receiveData("No Pokémon found. Please try again...");
      }
      setAlternatePhrase(!alternatePhrase);
    }
    setShowTargetingBox(false); //Remove the targeting box
    setButtonVisibility(false); //Close the pokemon menu
  }

  //Check if the user has find the pokemon Nidoran
  function findNidoran() {
    const clickX = clickCoordinates.x;
    const clickY = clickCoordinates.y;

    const pokemonNames = "Nidoran";
    let tolerance = 25;
    let foundPokemonIndex = -1;

    const { x, y } = calculatedCoordinates[0];
    const isWithinRangeX = Math.abs(clickX - x) <= tolerance;
    const isWithinRangeY = Math.abs(clickY - y) <= tolerance;

    if (isWithinRangeX && isWithinRangeY) {
      if (!foundPokemon.includes(pokemonNames)) {
        receiveData(`You find ${pokemonNames}!`);
        setFoundPokemon((prevFoundPokemon) => [
          ...prevFoundPokemon,
          pokemonNames,
        ]);
        setShowNidoran(true);
      } else {
        receiveData(`You have already found the Pokémon ${pokemonNames}!`);
      }
      foundPokemonIndex = 0;
    }
    if (foundPokemonIndex === -1) {
      if (alternatePhrase) {
        receiveData("It's not the right Pokémon. Please try again...");
      } else {
        receiveData("No Pokémon found. Please try again...");
      }
      setAlternatePhrase(!alternatePhrase);
    }
    setShowTargetingBox(false); //Remove the targeting box
    setButtonVisibility(false); //Close the pokemon menu
  }

  //Check if the user has find the pokemon Nidoran
  function findSeel() {
    const clickX = clickCoordinates.x;
    const clickY = clickCoordinates.y;

    const pokemonNames = "Seel";
    let tolerance = 25;
    let foundPokemonIndex = -1;

    const { x, y } = calculatedCoordinates[1];
    const isWithinRangeX = Math.abs(clickX - x) <= tolerance;
    const isWithinRangeY = Math.abs(clickY - y) <= tolerance;

    if (isWithinRangeX && isWithinRangeY) {
      if (!foundPokemon.includes(pokemonNames)) {
        receiveData(`You find ${pokemonNames}!`);
        setFoundPokemon((prevFoundPokemon) => [
          ...prevFoundPokemon,
          pokemonNames,
        ]);
        setShowSeel(true);
      } else {
        receiveData(`You have already found the Pokémon ${pokemonNames}!`);
      }
      foundPokemonIndex = 1;
    }
    if (foundPokemonIndex === -1) {
      if (alternatePhrase) {
        receiveData("It's not the right Pokémon. Please try again...");
      } else {
        receiveData("No Pokémon found. Please try again...");
      }
      setAlternatePhrase(!alternatePhrase);
    }
    setShowTargetingBox(false); //Remove the targeting box
    setButtonVisibility(false); //Close the pokemon menu
  }

  //Render the pokemon buttons menu based on user's click
  const menuButtons = () => {
    const divMenu = {
      position: "absolute",
      width: "2.5rem",
      height: "2.5rem",
      left: clickCoordinates?.x,
      top: clickCoordinates?.y,
      display: buttonVisibility ? "block" : "none",
      gap: "1rem",
    };

    return (
      <div className="pokemonButtonMenu" style={divMenu}>
        <button className="selectButton" onClick={findSpearow}>
          <p>Spearow</p>
        </button>
        <button className="selectButton" onClick={findNidoran}>
          <p>Nidoran♀</p>
        </button>
        <button className="selectButton" onClick={findSeel}>
          <p>Seel</p>
        </button>
      </div>
    );
  };

  const [targetingBoxCoordinates, setTargetingBoxCoordinates] = useState([]); //Stores the targetingBox Coordinates
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 }); //Stores the current dimensions of the image element within the container
  const containerRef = useRef(null);

  //triggers when the image is resized to update the image sizes
  useEffect(() => {
    const handleResizeDUAL = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setImageSize({ width, height });
      }
    };

    window.addEventListener("resize", handleResizeDUAL);
    handleResizeDUAL();

    return () => {
      window.removeEventListener("resize", handleResizeDUAL);
    };
  }, []);

  const minSize = 20; // Valore minimo per la dimensione del targeting box
  const maxSize = 80; // Valore massimo per la dimensione del targeting box

  //Capture the user's click position to create the targeting box and the winning boxes
  const handleContainerClick = (event) => {
    if (event.target.tagName !== "BUTTON" && event.target.tagName !== "P") {
      setShowTargetingBox(true);
      const containerRect = containerRef.current.getBoundingClientRect();
      const x =
        ((event.clientX - containerRect.left) / containerRect.width) * 100;
      const y =
        ((event.clientY - containerRect.top) / containerRect.height) * 100;

      const newPokemon = {
        id: targetingBoxCoordinates.length + 1,
        x,
        y,
      };
      setTargetingBoxCoordinates(() => [newPokemon]);
    }
  };

  //render the targeting box
  const renderTargetingBox = () => {
    if (
      !imageSize.width ||
      !ShowTargetingBox ||
      targetingBoxCoordinates.length === 0
    )
      return null;

    const pokemon = targetingBoxCoordinates[0];
    const x = (pokemon.x / 100) * imageSize.width;
    const y = (pokemon.y / 100) * imageSize.height;
    const scale = imageSize.width * 0.001;
    const scaledSize = Math.max(minSize, Math.min(maxSize, scale * 100));

    return (
      <div
        key={10}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
          background: "rgba(255, 0, 0, 0.5)",
          borderRadius: "50%",
          border: "black 2px dashed",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    );
  };

  //Stores the pokemon's winningbox coordinates on the image
  const [spearowCircleX, setSpearowCircleX] = useState(null);
  const [spearowCircleY, setSpearowCircleY] = useState(null);
  const [nidoranCircleX, setNidoranCircleX] = useState(null);
  const [nidoranCircleY, setNidoranCircleY] = useState(null);
  const [seelCircleX, setSeelCircleX] = useState(null);
  const [seelCircleY, setSeelCircleY] = useState(null);

  if (showSpearow && spearowCircleX === null && spearowCircleY === null) {
    setSpearowCircleX(targetingBoxCoordinates[0].x);
    setSpearowCircleY(targetingBoxCoordinates[0].y);
  }

  if (showNidoran && nidoranCircleX === null && nidoranCircleY === null) {
    setNidoranCircleX(targetingBoxCoordinates[0].x);
    setNidoranCircleY(targetingBoxCoordinates[0].y);
  }

  if (showSeel && seelCircleX === null && seelCircleY === null) {
    setSeelCircleX(targetingBoxCoordinates[0].x);
    setSeelCircleY(targetingBoxCoordinates[0].y);
  }

  //Render the pokemon winningbox on the image
  const renderSpearowCircle = (targetingBoxCoordinates) => {
    if (!showSpearow) return null;

    const x = (spearowCircleX / 100) * imageSize.width;
    const y = (spearowCircleY / 100) * imageSize.height;
    const scale = imageSize.width * 0.001;
    const scaledSize = Math.max(minSize, Math.min(maxSize, scale * 100));

    return (
      <div
        key={0}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
          background: "rgba(0, 128, 0, 0.5)",
          borderRadius: "50%",
          border: "black 2px solid",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    );
  };

  //Render the pokemon winningbox on the image
  const renderNidoranCircle = (targetingBoxCoordinates) => {
    if (!showNidoran) return null;

    const x = (nidoranCircleX / 100) * imageSize.width;
    const y = (nidoranCircleY / 100) * imageSize.height;
    const scale = imageSize.width * 0.001;
    const scaledSize = Math.max(minSize, Math.min(maxSize, scale * 100));

    return (
      <div
        key={1}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
          background: "rgba(0, 128, 0, 0.5)",
          borderRadius: "50%",
          border: "black 2px solid",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    );
  };

  //Render the pokemon winningbox on the image
  const renderSeelCircle = (targetingBoxCoordinates) => {
    if (!showSeel) return null;

    const x = (seelCircleX / 100) * imageSize.width;
    const y = (seelCircleY / 100) * imageSize.height;
    const scale = imageSize.width * 0.001;
    const scaledSize = Math.max(minSize, Math.min(maxSize, scale * 100));

    return (
      <div
        key={2}
        style={{
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
          width: `${scaledSize}px`,
          height: `${scaledSize}px`,
          background: "rgba(0, 128, 0, 0.5)",
          borderRadius: "50%",
          border: "black 2px solid",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      />
    );
  };

  ///////////////////////////////

  return (
    <div
      className="image-wrapper"
      style={{ position: "relative" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <img
        src={gamePhoto}
        id="image"
        alt="gamePic"
        onClick={handleClick}
        style={{ width: "100%", height: "auto" }}
        onLoad={() => {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          setImageSize({ width, height });
        }}
      />
      {showSpearow && renderSpearowCircle(targetingBoxCoordinates)}
      {showNidoran && renderNidoranCircle(targetingBoxCoordinates)}
      {showSeel && renderSeelCircle(targetingBoxCoordinates)}
      {renderTargetingBox()}
      <div>{menuButtons()}</div>
    </div>
  );
}

export default GameControls;
