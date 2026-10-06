import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  // GitHub Pages fix.
  // Allows the app to work inside:
  // https://username.github.io/repository-name/
  base: "./",

  server: {
    host: true,
    port: 5173
  },

  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false
  }
});