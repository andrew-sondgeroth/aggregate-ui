import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/widget/index.tsx',
      name: 'AggregateWidget',
      formats: ['iife'],
      fileName: () => 'aggregate-widget.js',
    },
    outDir: 'dist-widget',
    cssCodeSplit: false,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
