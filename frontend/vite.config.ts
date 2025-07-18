import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: "/book-reader",
  build: {
    outDir: './dist',
    // emptyOutDir: true
  }
})
