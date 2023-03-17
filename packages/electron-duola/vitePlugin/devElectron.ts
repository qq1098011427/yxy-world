import {ViteDevServer} from 'vite'
const esbuild = require('esbuild')
const {spawn} = require('child_process')

export const devElectron = () => {
    return {
        name: 'dev-electron',
        configureServer(server: ViteDevServer) {
            esbuild.buildSync({
                entryPoints: ['./src/main/mainEntry.ts'],
                outfile: './dist/mainEntry.js',
                external: ['electron'],
                bundle: true,
                platform: 'node',
            })
            server.httpServer.once('listening', () => {
                let addressInfo= server.httpServer?.address() as {address: string, port: number}
                let url = `http://${addressInfo?.address}:${addressInfo?.port}`
                let electronProcess = spawn('electron', ['./dist/mainEntry.js', url], {
                    cwd: process.cwd(),
                    stdio: 'inherit'
                })
                electronProcess.on('close', () => {
                    server.close()
                    process.exit()
                })
            })
        }
    }
}