/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import { resolve } from "path";
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
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
  },
  test: {
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});