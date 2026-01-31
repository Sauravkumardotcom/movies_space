import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
            tailwindcss(),
  ],
  build: {
    // Optimize chunk size and code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query': ['@tanstack/react-query'],
          'framer': ['framer-motion'],
          // Split page components
          'pages': [
            './src/pages/SearchPage.jsx',
            './src/pages/GenrePage.jsx',
            './src/pages/TrendingPage.jsx',
            './src/pages/ShortsPage.jsx',
          ],
        },
      },
    },
    // Increase chunk size warning threshold
    chunkSizeWarningLimit: 600,
  },
})
