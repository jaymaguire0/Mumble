import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use env-based base path so this works for any repo name without edits.
// The workflow sets VITE_BASE_PATH to "/<repo-name>/" automatically.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
});
