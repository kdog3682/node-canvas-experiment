import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname, '../..');

export default defineConfig({
  resolve: {
    alias: {
      '@node-canvas-experiment/measure': resolve(root, 'packages/measure/src/measure.ts'),
    },
  },
  server: {
    fs: {
      allow: [root],
    },
  },
});
