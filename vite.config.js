import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Relative paths work locally and under /anipulse/ on GitHub Pages.
  base: "./"
});
