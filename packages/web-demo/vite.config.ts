import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname, '../..');

export default defineConfig({
  resolve: {
    alias: {
      '@kdog3682/node-canvas-experiment': resolve(root, 'packages/measure/index.ts'),
    },
  },
  server: {
    fs: {
      allow: [root],
    },
  },
});
