import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {devElectron} from './vitePlugin/devElectron';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [devElectron(), vue()],
})
