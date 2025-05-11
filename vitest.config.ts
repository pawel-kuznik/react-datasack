// vitest.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // allows us to use vitest library methods in unit test without explicit imports
  },
});