import {defineConfig} from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        emptyOutDir: false,
        rollupOptions: {
            // @ts-ignore
            input: JSON.parse(process.env.VITE_INPUT),
            output: {
                inlineDynamicImports: false,
                dir: 'dist',
                entryFileNames: '[name].js',
                format: 'commonjs'
            }
        }
    }
})
