import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Relative asset URLs work both on GitHub Pages project URLs and later
  // when the site is attached to the custom .tr domain.
  base: './',
});
