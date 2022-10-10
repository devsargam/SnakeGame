export const randRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const randomElementFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const directionEnum = {
  UP: { x: 0, y: -1 },
  LEFT: { x: -1, y: 0 },
  DOWN: { x: 0, y: 1 },
  RIGHT: { x: 1, y: 0 },
};
