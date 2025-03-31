import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
//   server: {
//     proxy: {
//         '/api': {
//             target: 'http://localhost:3000',
//             changeOrigin: true,
//         },
//     },
// },
  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
        // eslint-disable-next-line no-undef
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
