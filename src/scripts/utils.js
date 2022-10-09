export const randRange = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const randomElementFromArray = (array) => {
  console.log(array[Math.floor(Math.random() * this.length)]);
  return array[Math.floor(Math.random() * this.length)];
};
