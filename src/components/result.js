import React, { useState, useEffect } from "react";

const ResultComponent = ({ result }) => {
  const [animationKey, setAnimationKey] = useState(0);

  // Use effect to trigger animation when the "result" prop changes
  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [result]);

  return (
    <div key={animationKey} className="resultDiv slide-in">
      <h1>{result}</h1>
    </div>
  );
};

export default ResultComponent;
