// ./vite.demo.config.ts

import { defineConfig } from "vite";

export default defineConfig({
  base: "/cool-strokes/",
  build: {
    outDir: "dist-demo",
    emptyOutDir: true,
  },
});
