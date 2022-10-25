import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

const pathSrc = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': pathSrc
        }
    },
    plugins: [vue()],
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                index: './index.html'
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
