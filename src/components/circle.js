import React, { useEffect, useRef, useState } from "react";
import imageGame from "./images/pokemonGame.png";

const PokemonComponent = () => {
  const [pokemonCoordinates, setPokemonCoordinates] = useState([
    { id: 1, x: 20, y: 40 },
    { id: 2, x: 60, y: 30 },
    { id: 3, x: 40, y: 70 },
    // ... aggiungi altre coordinate per altri Pokemon
  ]);

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setImageSize({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const minSize = 20; // Valore minimo per la dimensione dei div dei Pokemon
  const maxSize = 100; // Valore massimo per la dimensione dei div dei Pokemon

  const handleContainerClick = (event) => {
    const containerRect = containerRef.current.getBoundingClientRect();
    const x =
      ((event.clientX - containerRect.left) / containerRect.width) * 100;
    const y =
      ((event.clientY - containerRect.top) / containerRect.height) * 100;

    const newPokemon = {
      id: pokemonCoordinates.length + 1,
      x,
      y,
    };

    setPokemonCoordinates((prevCoordinates) => [
      ...prevCoordinates,
      newPokemon,
    ]);
  };

  const renderPokemonDivs = () => {
    if (!imageSize.width) return null;

    const imageRatio = imageSize.width / imageSize.height;

    return pokemonCoordinates.map((pokemon) => {
      const x = (pokemon.x / 100) * imageSize.width;
      const y = (pokemon.y / 100) * imageSize.height;
      const scale = imageSize.width * 0.001;
      const scaledSize = Math.max(minSize, Math.min(maxSize, scale * 100));

      return (
        <div
          key={pokemon.id}
          style={{
            position: "absolute",
            left: `${x}px`,
            top: `${y}px`,
            width: `${scaledSize}px`,
            height: `${scaledSize}px`,
            background: "red",
            borderRadius: "50%",
            transform: `translate(-50%, -50%) scale(${scale})`,
          }}
        />
      );
    });
  };

  return (
    <div
      style={{ position: "relative" }}
      ref={containerRef}
      onClick={handleContainerClick}
    >
      <img
        src={imageGame}
        alt="Pokemon"
        style={{ width: "100%", height: "auto" }}
        onLoad={() => {
          const { width, height } =
            containerRef.current.getBoundingClientRect();
          setImageSize({ width, height });
        }}
      />
      {renderPokemonDivs()}
    </div>
  );
};

export default PokemonComponent;
