import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/snowball-x/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // Прокси к БКС Торговому API: снимает CORS в браузере на дев-сервере.
      // Браузер ходит на same-origin /bcs/*, Vite перенаправляет на be.broker.ru.
      '/bcs': {
        target: 'https://be.broker.ru',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/bcs/, ''),
      },
    },
  },
})
