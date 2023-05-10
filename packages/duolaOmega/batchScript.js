const { spawn } = require('child_process')

const scripts = {
  background: './extensions/background.js',
  contentScript: './extensions/contentScript.js',
}

const runSpawn = (cmd, args, options = {}) => {
  return new Promise((resolve, reject) => {
    const handle = spawn(cmd, args, {
      ...options,
      stdio: 'inherit'
    })
    handle.on('error', reject)
    handle.on('close', resolve)
  })
}

async function run() {
  const keys = Object.keys(scripts)

  for (const key of keys) {
    await runSpawn('pnpm', ['build:script'], {
      env: {
        ...process.env,
          // 存在环境变量VITE_INPUT中，可以在vite.config.script.ts中使用
        VITE_INPUT: JSON.stringify({ [key]: scripts[key] })
      }
    })
  }
    console.log(process.env.VITE_INPUT, '===VITE_INPUT===')
}

run()
