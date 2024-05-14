/// <reference types="vitest" />
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/bitmap_editor/',
  plugins: [react()],
  resolve: {
    alias: {
      '~bootstrap': path.resolve(__dirname, './node_modules/bootstrap'),
      '~bootstrap-icons': path.resolve(__dirname, './node_modules/bootstrap-icons'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    // globals: true, // Remove `cleanup()` from `setupTests.ts` if `globals: true`
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    pool: 'threads',
    poolOptions: {
      threads: {
        useAtomics: true,
        isolate: true,
      },
    },
    // clearMocks: true,
    // restoreMocks: true,
    // mockReset: true,
    // cache: false,
    watch: false,
    update: false,
    css: false,
    coverage: {
      clean: true,
      include: ['src/**'],
      extension: ['.ts', '.tsx'],
      exclude: [
        'src/test-utils',
        'src/pages/ImportFromImage/ImportForm/createCanvas.ts',
        'src/components/BitmapEditor/components/BitmapView/getCanvas.ts',
        'src/**/__mocks__',
        'src/App.tsx',
        'src/main.tsx',
        'src/router.tsx',
      ],
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      watermarks: {
        statements: [80, 90],
        branches: [80, 90],
        functions: [80, 90],
        lines: [80, 90],
      },
    },
  },
});
