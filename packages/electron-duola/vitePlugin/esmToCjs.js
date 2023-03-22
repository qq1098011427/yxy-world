import path from 'path'
import fs from 'fs'

const DIR = '.vite-electron-dev-rely-pkg';
const EXT = '.js';
// 在vue中（渲染进程）使用electron与nodejs的模块,是不支持 esm 的, 所以需要将 esm 转为 cjs, 通过cjs中转，用到resolve.alias实现
export const esmToCjs = (entries, options = {}) => {
    if (typeof options.dir === 'undefined') options.dir = DIR;
    let root = process.cwd();
    return {
        name: 'esmToCjs',
        async config(config) {
            if (config.root) root = path.resolve(config.root);
            if (!path.isAbsolute(options.dir)) options.dir = path.join(node_modules(root), options.dir);
            if (!fs.existsSync(options.dir)) fs.mkdirSync(options.dir, { recursive: true });
            // optimizeDeps 是 Vite 中的一个配置选项，用于优化项目的依赖项
            if (!config.optimizeDeps) config.optimizeDeps = {};
            // include需要打包的依赖 / exclude不需要被打包的依赖
            if (!config.optimizeDeps.include) config.optimizeDeps.include = [];
            if (!config.optimizeDeps.exclude) config.optimizeDeps.exclude = [];
            // 兼容别名不存在的情况
            if (!config.resolve) config.resolve = {};
            if (!config.resolve.alias) config.resolve.alias = [];
            if (Object.prototype.toString.call(config.resolve.alias) === '[object Object]') {
                config.resolve.alias = Object
                    .entries(config.resolve.alias)
                    .reduce((memo, [find, replacement]) => memo.concat({ find, replacement }), []);
            }
            // 如果模块已经在 optimizeDeps.include 中，则应该将其过滤掉
            const include = config.optimizeDeps.include;
            if (include.length) {
                const keys = Object.keys(entries).filter(key => !include.includes(key));
                entries = Object
                    .entries(entries)
                    .filter(([key]) => keys.includes(key))
                    .reduce((memo, [key, val]) => Object.assign(memo, { [key]: val }), {});
            }
            // 预构建模块
            const generateRecords = await generateModule(entries, options);
            for (const record of generateRecords) {
                config.optimizeDeps.exclude.push(record.module);
                config.resolve.alias.push({
                    find: record.module,
                    replacement: record.filename,
                    ...record.alias,
                });
            }
        }
    }
}
const generateModule = async(entries, options) => {
    const dir = options.dir; // 必须是绝对路径
    const generateRecords = [];
    for (const [module, variableType] of Object.entries(entries)) {
        if (!variableType) continue;
        // `/project/node_modules/.vite-electron-dev-rely-pkg/${module}.js`
        let filename = path.join(dir, module) + EXT;
        if (options.resolveId) {
            const tmp = options.resolveId(filename);
            if (tmp) filename = tmp;
        }
        let moduleContent = null;
        let record = { module, filename };
        // 兼容传入的参数类型
        if (typeof variableType === 'function') {
            // dir 是存放处的绝对路径
            const tmp = await variableType({ dir });
            if (!tmp) continue;
            if (typeof tmp === 'object') {
                tmp.code && (moduleContent = tmp.code);
                tmp.alias && (record.alias = tmp.alias);
            } else {
                moduleContent = tmp; // string
            }
        } else if (typeof variableType === 'object') {
            variableType.code && (moduleContent = variableType.code);
            variableType.alias && (record.alias = variableType.alias);
        } else {
            moduleContent = variableType; // string
        }
        if (moduleContent) {
            // Support nest moduleId '@scope/name'
            ensureDir(path.join(filename, '..'));
            fs.writeFileSync(filename, moduleContent);
        }
        if (moduleContent || record.alias) {
            generateRecords.push(record);
        }
    }
    return generateRecords;
}
const ensureDir = (dir) => {
    if (!(fs.existsSync(dir) && fs.statSync(dir).isDirectory())) {
        fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
}
// 递归查找路径
const node_modules = (root, count = 0) => {
    if (node_modules.p) {
        return node_modules.p;
    }
    const p = path.join(root, 'node_modules');
    if (fs.existsSync(p)) {
        return node_modules.p = p;
    }
    if (count >= 19) {
        throw new Error('Can not found node_modules directory.');
    }
    return node_modules(path.join(root, '..'), count + 1);
}

export const getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result = {};
    for (let item of externalModels) {
        result[item] = () => ({
            find: new RegExp(`^${item}$`),
            code: `const ${item} = require('${item}');export { ${item} as default }`,
        });
    }
    result["electron"] = () => {
        let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
        return {
            find: new RegExp(`^electron$`),
            code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
        };
    };
    return result;
};
