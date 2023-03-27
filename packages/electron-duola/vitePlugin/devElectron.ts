import {ViteDevServer} from 'vite'
// @ts-ignore
import esbuild from 'esbuild'
const {spawn} = require('child_process')

const devElectron = () => {
    return {
        name: 'dev-electron',
        configureServer(server: ViteDevServer) {
            esbuild.buildSync({
                entryPoints: ['./src/main/mainEntry.ts'],
                outfile: './dist/mainEntry.js',
                external: ['electron'], // esbuild will not bundle electron
                bundle: true,
                platform: 'node',
            });
            (server.httpServer).once('listening', () => {
                let electronProcess: any
                const exitProcess = () => {
                    if (electronProcess) {
                        electronProcess.kill()
                        electronProcess.removeAllListeners();
                        electronProcess = null
                        process.exit()
                    }
                }
                let addressInfo= server.httpServer?.address() as {address: string, port: number}
                let url = `http://${addressInfo?.address}:${addressInfo?.port}`
                exitProcess() // kill previous process
                electronProcess = spawn('electron', ['./dist/mainEntry.js', url], {
                    cwd: process.cwd(),
                    stdio: 'inherit'
                })
                electronProcess.once('exit', () => {
                    exitProcess()
                })
            })
        }
    }
}
export default devElectron