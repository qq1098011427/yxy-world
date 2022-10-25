import { MessageChrome } from './utils/common.js'
import { URL_FILTER_RULE } from './utils'
import { sendMessageToBackground, sendMessageToContentScript } from './utils/contentMessage.js'
import { MODE } from './constants'

console.log('yxy 12bg.js')
const buildProxyConfiguration = async (app: any, index: number, env) => {
  if (app.mode !== MODE.CUSTOM) {
    if (!app.proxyUrl) return null

    if (app.extra) {
      const { protocol, domain } = env
      const jsPathBaseUrl = `${protocol}//${domain}/`
      app.jsPath =
        activeMode === MODE.ADMIN
          ? `${jsPathBaseUrl}${app.jsPath}`
          : `${jsPathBaseUrl}portal/${app.jsPath}`
    }

    let { protocol } = new URL(app.jsPath)

    const redirectBaseUrl = `//localhost:${app.proxyUrl}/index.js`
    let redirectUrl = redirectBaseUrl
    let scriptContent = ''
    let realProtocol = protocol
    try {
      redirectUrl = 'https:' + redirectBaseUrl
      realProtocol = 'https:'
      scriptContent = await fetch(redirectUrl, {
        mode: 'no-cors'
      }).then(res => res.text())
    } catch (e) {
      try {
        redirectUrl = 'http:' + redirectBaseUrl
        realProtocol = 'http:'
        scriptContent = await fetch(redirectUrl, {
          mode: 'no-cors'
        }).then(res => res.text())
      } catch (e) {
        sendMessageToBackground('errorMessage', {
          errorMessage: `${app.name} 应用请求失败，请等待加载完毕！`,
          duration: 3000
        })
      }
    }

    let res = [
      realProtocol !== protocol && {
        id: 100 + index,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            transform: {
              host: 'localhost',
              port: app.proxyUrl,
              scheme: realProtocol.split(':')[0]
            }
          }
        },
        condition: {
          urlFilter: `${protocol}//localhost:${app.proxyUrl}/sockjs-node`,
          resourceTypes: ['xmlhttprequest']
        }
      }
    ]

    const reg = new RegExp(`var ${app.globalVar}`)

    if (!reg.test(scriptContent)) {
      sendMessageToBackground('errorMessage', {
        errorMessage: `${
          app.name
        } 应用请求失败！请查看package.json是否正确填写为：${app.globalVar.replace(
          /([a-z]+)([A-z])/,
          (a, b, c) => {
            return b + '-' + c.toLowerCase()
          }
        )}`,
        duration: 3000
      })

      // return null
    }

    res.push(URL_FILTER_RULE(app.jsPath, redirectUrl, index))

    return res
  } else {
    if (app.enabled) {
      return [
        URL_FILTER_RULE(app.url, app.redirect, index, [
          'script',
          'xmlhttprequest',
          'websocket',
          'image',
          'stylesheet',
          'main_frame',
          'sub_frame',
          'object',
          'other'
        ])
      ]
    } else return null
  }
}

let activeMode = ''
let xapp_tools_proxy_apps_temp = {}

chrome.storage.sync.get('xapp_tools_proxy_apps', async data => {
  const { xapp_tools_proxy_apps = {} } = data
  xapp_tools_proxy_apps_temp = xapp_tools_proxy_apps
})

/**
 * 修改重定向规则
 */
const handleUpdateDynamicRules = async () => {
  const apps = Object.keys(xapp_tools_proxy_apps_temp)
    .map(key =>
      Object.values(xapp_tools_proxy_apps_temp[key]).map(app => {
        // @ts-ignore
        app.mode = key
        return app
      })
    )
    .flat(1)

  await clearRules()

  const { xapp_tools_env } = await chrome.storage.sync.get('xapp_tools_env')

  if (apps.length) {
    try {
      // @ts-ignore
      const addRules = await Promise.all(
        apps.map((app, index) => buildProxyConfiguration(app, index, xapp_tools_env))
      )
      await chrome.declarativeNetRequest.updateDynamicRules({
        // @ts-ignore
        addRules: [
          ...addRules.flat(Infinity).filter(Boolean),
          ...['hot-update.json'].map((urlFilter, i) =>
            URL_FILTER_RULE(urlFilter, '', 1000 + i, ['xmlhttprequest'], {
              type: 'modifyHeaders',
              responseHeaders: [
                {
                  header: 'Access-Control-Allow-Headers',
                  operation: 'set',
                  value: '*'
                },
                {
                  header: 'Access-Control-Allow-Origin',
                  operation: 'set',
                  value: '*'
                },
                {
                  header: 'Access-Control-Allow-Methods',
                  operation: 'set',
                  value: '*'
                }
              ]
            })
          )
        ]
      })
      sendMessageToContentScript('loadScript', {
        // @ts-ignore
        apps: apps.filter(app => app.extra)
      })
    } catch (e) {
      sendMessageToBackground('errorMessage', {
        errorMessage: e.toString(),
        duration: 3000
      })
    }
  }
}

new MessageChrome({
  /**
   * 监听切换开关消息
   */
  switch: async ({ message }: any, sender, callback) => {
    const { mode, totalSwitch } = message
    if (totalSwitch) {
      activeMode = mode
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true
        },
        async tabs => {
          if (totalSwitch) {
            sendMessageToContentScript('switch', message)
            chrome.action.setIcon({
              path: '/resources/images/icon.png'
            })
            const rules = (await chrome.declarativeNetRequest.getDynamicRules()) || []
            if (rules.length) return
            await handleUpdateDynamicRules()
          }
        }
      )
    } else {
      chrome.action.setIcon({
        path: '/resources/images/icon-disabled.png'
      })
      await clearRules()
    }

    callback && callback()
  },
  xapp_tools_proxy_apps: async ({ message }) => {
    xapp_tools_proxy_apps_temp = message
    await handleUpdateDynamicRules()
    sendMessageToContentScript('refreshPage', {})
  }
})

const clearRules = async () => {
  const rules = await chrome.declarativeNetRequest.getDynamicRules()
  if (rules.length) {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(rule => rule.id)
    })
  }
}
