import React, { useEffect, useState } from "react";
import Square from "./Square";
import "./App.css";

const Game = () => {
  const [squares, setSquares] = useState([]);
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 900; i++) {
      arr.push(i);
    }
    setSquares(arr);
  }, []);

  return (
    <div className="canvas">
      {squares.map((item, index) => {
        console.log(squares);
        return (
          <h1 key={index}>
            <Square />
          </h1>
        );
      })}
    </div>
  );
};

export default Game;
