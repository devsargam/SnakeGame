import React from "react";

export default function Square({ snake }) {
  return (
    <div
      className="square"
      style={{
        backgroundColor: snake == "apple" ? "red" : snake ? "black" : "pink",
      }}
    ></div>
  );
}
