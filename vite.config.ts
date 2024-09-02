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
        'src/components/SuspenseFallback',
        'src/**/__mocks__',
        'src/**/*.test.tsx',
        'src/**/*.test.ts',
        'src/App.tsx',
        'src/main.tsx',
        'src/router.tsx',
        'src/service-worker-register.ts',
        'src/service-worker.ts',
      ],
      provider: 'v8',
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
      watermarks: {
        statements: [90, 95],
        branches: [90, 95],
        functions: [90, 95],
        lines: [90, 95],
      },
    },
  },
});
