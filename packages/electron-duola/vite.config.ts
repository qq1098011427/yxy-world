import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {devElectron, esmToCjs, getReplacer, buildPlugin} from './vitePlugin';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [esmToCjs(getReplacer()), devElectron(), vue({
        template: {
            compilerOptions: {
                isCustomElement: tag => tag.startsWith('iconpark-')
            }
        }
    })],
    build: {
        rollupOptions: {
            plugins: [buildPlugin()],
        }
    }
})
