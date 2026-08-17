import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'firebase/auth': fileURLToPath(new URL('./src/lib/firebase-compat.ts', import.meta.url)),
    },
  },
  // Relative asset URLs work both on GitHub Pages project URLs and later
  // when the site is attached to the custom .tr domain.
  base: './',
});
