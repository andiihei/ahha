import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(import.meta.dirname, "src/index.ts"),
        button: resolve(import.meta.dirname, "src/components/button.ts"),
        toggle: resolve(import.meta.dirname, "src/components/toggle.ts"),
        "selector-button": resolve(import.meta.dirname, "src/components/selector-button.ts")
      },
      formats: ["es"]
    },
    rollupOptions: {
      external: [/^lit/],
      output: {
        entryFileNames: "[name].js"
      }
    }
  }
});
