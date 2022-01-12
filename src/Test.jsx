import React from "react";
import { useEffect, useState } from "react/cjs/react.development";

export default function Test() {
  const [state, setState] = useState("hello");

  useEffect(() => {
    setState(() => {
      return "Hello there";
    });
  });

  return (
    <div>
      hello hij
      {state}
    </div>
  );
}
