import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
const { peerDependencies, dependencies } = require('./package.json')

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
            name: 'yu-dnd-html5-backend',
            fileName: 'yu-dnd-html5-backend'
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                ...Object.keys(dependencies).filter(x => x.startsWith('yu-')),
                ...Object.keys(peerDependencies)
            ],
            output: {}
        }
    },

})

