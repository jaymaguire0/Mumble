import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // must match the *exact* repo path (case-sensitive)
  base: '/Mumble/',
  plugins: [react()],
})
