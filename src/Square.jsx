import React from "react";

export default function Square({ snake }) {
  return (
    <div
      className="square"
      style={{
        height: "20px",
        width: "20px",
        border: "1px solid black",
        backgroundColor: snake == "apple" ? "red" : snake ? "black" : "pink",
        margin: 0,
        padding: 0,
      }}
    ></div>
  );
}
