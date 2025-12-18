import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  define: {
    // Permite que process.env.API_KEY seja lido corretamente do ambiente no Vercel
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});