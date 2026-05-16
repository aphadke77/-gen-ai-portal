import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/-gen-ai-portal/',
  plugins: [react()],
})

