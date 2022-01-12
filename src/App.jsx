import React, { useEffect, useState } from "react";
import Square from "./Square";
import "./App.css";

const getRandomSpot = () => {
  return Math.floor(Math.random() * (895 - 5) + 10);
};

const Game = () => {
  const [squares, setSquares] = useState([]);
  const [key, setKey] = useState("");
  const [snake, setSnake] = useState(getRandomSpot());
  const [apple, setApple] = useState(getRandomSpot());

  useEffect(() => {
    console.log(squares.filter((el) => !(el === 0)));
    // Do something actually
    // Yes yes I agree
  }, [snake]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 30 ** 2; i++) {
      arr.push(0);
    }
    arr[snake] = true;
    arr[apple] = "apple";
    setSquares(arr);
    window.addEventListener("keydown", (e) => {
      handleClick(e.key);
    });
    const gameTimer = setInterval(() => {
      // setSnake(snake + 1);
      // console.log(snake);
    }, 1000 / 60);
    return () => clearInterval(gameTimer);
  }, []);

  const handleClick = (key) => {
    switch (key) {
      case "w":
      case "ArrowUp":
        console.log("UP");
        setSnake(key);
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
          return <Square snake={item} index={index} />;
        })}
      </div>
      <h1>You pressed {key}</h1>
    </div>
  );
};

export default Game;
