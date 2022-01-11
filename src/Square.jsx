import React from "react";

const Square = ({ snake, index }) => {
  return (
    <div
      className="square"
      style={{
        backgroundColor: snake == "apple" ? "red" : snake ? "black" : "pink",
        fontSize: "10px",
      }}
    >
      {index}
    </div>
  );
};

export default Square;
