import { defineConfig } from "vite";



export default defineConfig(({ command, mode }) => {
  return {
    publicDir: "./assets/",
    root: "./src",
    build: {
      outDir: "../dist",
    },
  };
});
