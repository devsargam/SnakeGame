import React, { useEffect, useState } from "react";
import Square from "./Square";
import "./App.css";

const Game = () => {
  const [squares, setSquares] = useState([]);
  const [key, setKey] = useState("");
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
    window.addEventListener("keydown", (e) => {
      handleClick(e.key);
    });
  }, []);

  const handleClick = (key) => {
    switch (key) {
      case "w":
      case "ArrowUp":
        console.log("UP");
        setKey("UP");
        break;
      case "ArrowLeft":
      case "a":
        console.log("LEFT");
        setKey("LEFT");
        break;
      case "ArrowDown":
      case "s":
        console.log("DOWN");
        setKey("DOWN");
        break;
      case "d":
      case "ArrowRight":
        console.log("RIGHT");
        setKey("RIGHT");
        break;
      default:
        console.log(key);
        break;
    }
  };

  return (
    <div className="app">
      <h1>Snake Game</h1>
      <div className="canvas">
        {squares.map((item, index) => {
          return <Square snake={item} />;
        })}
      </div>
      <h1>You pressed {key}</h1>
    </div>
  );
};

export default Game;
