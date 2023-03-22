import path from 'path';
import fs from 'fs';
const esbuild = require('esbuild')
// electron-builder 必须是 commonjs 模块
const builder = require('electron-builder');

const buildPlugin = () => {
    return {
        name: 'build-plugin',
        closeBundle() {
            buildMain('./src/main/mainEntry.ts');
            preparePkg();
            builderElectron();
        }
    }
}

// 打包主进程
const buildMain = (mainPath: string) => {
    esbuild.buildSync({
        entryPoints: [mainPath],
        outfile: './dist/mainEntry.js',
        external: ['electron'],
        bundle: true,
        platform: 'node',
        minify: true
    })
}
// 为生产环境提供package.json
const preparePkg = () => {
    let pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    // electron . will use the main field in package.json
    pkg.main = 'mainEntry.js';
    const electronVersion = pkg.devDependencies.electron.replace('^', '').replace('~', '');
    delete pkg.scripts;
    delete pkg.devDependencies;
    pkg.devDependencies = { electron: electronVersion }
    const targetPkgPath = path.join(process.cwd(), 'dist/package.json');
    fs.writeFileSync(targetPkgPath, JSON.stringify(pkg));
    // 阻止 electron-builder 的一些默认行为
    const targetNodeModulesPath = path.join(process.cwd(), 'dist/node_modules');
    fs.mkdirSync(targetNodeModulesPath);
}
// 使用electron-builder制作安装包
const builderElectron = () => {
    let options: any = {
        config: {
            directories: {
                output: path.join(process.cwd(), 'release'),
                app: path.join(process.cwd(), 'dist')
            },
            files: ['**'],
            extends: null,
            productName: 'duola',
            appId: 'duola.desktop',
            asar: true,
            nsis: {
                oneClick: true,
                perMachine: true,
                allowToChangeInstallationDirectory: false,
                createDesktopShortcut: true,
                createStartMenuShortcut: true,
                shortcutName: 'duolaDesktop'
            },
            publish: [{ provider: 'generic', url: 'http://localhost:5500/' }]
        },
        project: process.cwd()
    }
    return builder.build(options)
}

export default buildPlugin;
