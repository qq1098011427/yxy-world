import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                index: './index.html'
            },
            output: {
                inlineDynamicImports: false,
                dir: 'public',
                entryFileNames: '[name].js',
                format: 'commonjs'
            }
        }
    }
})
