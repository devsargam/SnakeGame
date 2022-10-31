export const randRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const directionEnum = {
  UP: { x: 0, y: -1 },
  LEFT: { x: -1, y: 0 },
  DOWN: { x: 0, y: 1 },
  RIGHT: { x: 1, y: 0 },
};

export const direction = {
  UP: "UP",
  LEFT: "LEFT",
  DOWN: "DOWN",
  RIGHT: "RIGHT",
};
