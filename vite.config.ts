// ./vite.config.ts
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Import: @types/node
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      name: "CoolStrokes",
      fileName: (format) => `cool-strokes.${format === "es" ? "js" : "cjs"}`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [dts()],
});
