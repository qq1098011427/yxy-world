import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    plugins: [react()],
    build: {
        watch: {},
        lib: {
            entry: path.resolve(__dirname, './src/index.ts'),
            formats: ['es'],
            name: 'yu-dnd-core',
            // the proper extensions will be added
            fileName: 'yu-dnd-core'
        },
        // watch: {
        //     exclude: 'node_modules/**',
        //     include: './src/**'
        // }
    },
})

