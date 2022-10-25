import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: {
        content_script: './extensions/content_script.ts'
      },
      output: {
        inlineDynamicImports: false,
        dir: 'dist',
        entryFileNames: '[name].js',
        format: 'commonjs'
      }
    }
  }
})
