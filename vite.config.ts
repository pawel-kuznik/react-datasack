import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  server: { watch: { usePolling: true }},
  plugins: [
    react(),
    dts({
      include: ["lib"],
      copyDtsFiles: true,
      outDir: "dist",
      tsconfigPath: "./tsconfig-build.json"
    }),
  ],
  build: {
    copyPublicDir: false,
    rollupOptions:{
      external: ['react', 'react/jsx-runtime']
    },
    sourcemap: true,
    
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: [ "es" ],
      fileName: "main"
    }
  }
})
