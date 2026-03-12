import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dash-edn6/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        compradores: resolve(__dirname, 'compradores.html'),
        unificado: resolve(__dirname, 'unificado.html')
      }
    }
  }
})
