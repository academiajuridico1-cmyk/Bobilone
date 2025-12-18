import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Garante que o process.env não quebre o código que usa Gemini API
    'process.env': {}
  },
  server: {
    port: 3000,
    host: true
  }
});