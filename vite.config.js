import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), {
    name: 'invitation-entry',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/' || req.url?.startsWith('/?') || req.url === '/index.html') {
          req.url = req.url.replace(/^\/(?:index\.html)?/, '/app.html');
        }
        next();
      });
    },
  }],
  build: { rollupOptions: { input: 'app.html' } },
  server: { proxy: { '/api': 'http://localhost:3000' } },
});
