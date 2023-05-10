 ## 打包流程
    // 这是打包vue项目的
    "build:watch": "pnpm run build -w",
    // 这是打包chrome插件的
    "batchScript": "node batchScript.js",
    // 这是打包子命令，在batchScript脚本中起子进程调用
    "build:script": "vue-tsc && vite build --config vite.config.script.ts",