import {defineConfig} from 'vite'

// https://vitejs.dev/config/
console.log(process.env.VITE_INPUT, '--process.env.VITE_INPUT--');
export default defineConfig({
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: JSON.parse(process.env.VITE_INPUT),
            output: {
                inlineDynamicImports: false,
                dir: 'dist',
                entryFileNames: '[name].js',
                format: 'commonjs'
            },
        }
    }
})
