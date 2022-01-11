import React, { useEffect, useState } from "react";
import Square from "./Square";
import "./App.css";

const Game = () => {
  const [squares, setSquares] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 900; i++) {
      arr.push(0);
    }
    arr[50] = true;
    arr[51] = true;
    arr[52] = true;
    arr[53] = true;
    arr[54] = true;
    arr[55] = true;
    arr[100] = "apple";
    setSquares(arr);
  }, []);

  return (
    <div className="app">
      <h1>Snake Game</h1>
      <div className="canvas">
        {squares.map((item, index) => {
          return <Square snake={item} />;
        })}
      </div>
    </div>
  );
};

export default Game;
