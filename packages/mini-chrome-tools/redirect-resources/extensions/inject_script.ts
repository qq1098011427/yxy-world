import { MessagePostMessage } from './utils/common.js'
import { MODE } from './constants'
import { isPortal } from './utils'

console.log('yxy23 inject.js')
const WINDOW = window as any
if (WINDOW._APP_CONFIG) {
  const { protocol } = window.location
  const { staticHost, domain } = WINDOW._APP_CONFIG
  let { BAAS_ENTADMIN_CONFIG, WEB_COMMON } = WINDOW

  const loadExtraApps = (apps, raw) => {
    if (!apps || !apps.length) return
    let appsRaw = WINDOW[raw]
    //获取WEB_COMMON中最大的id
    let maxId = 0
    for (let i = 0; i < appsRaw.length; i++) {
      const item = appsRaw[i]
      if (item.id > maxId) {
        maxId = item.id
      }
    }

    appsRaw = appsRaw.concat(
      apps.map((app, index) => {
        const { path, name, jsPath, globalVar } = app
        return {
          id: index + 1 + maxId,
          path,
          name,
          jsPath,
          globalVar
        }
      })
    )

    WINDOW[raw] = appsRaw
  }

  const getEnabledApp = apps => {
    return apps.filter(app => app.proxy)
  }

  const postMessage = new MessagePostMessage({
    switch: () => {
      sendMessage()
    },
    refreshPage: () => {
      window.location.reload()
    },
    loadScript: ({ data }) => {
      const { apps } = data
      Object.keys(apps).forEach(mode => {
        loadExtraApps(apps[mode], mode === MODE.ADMIN ? 'BAAS_ENTADMIN_CONFIG' : 'WEB_COMMON')
      })

      const path = `${WINDOW.location.origin}${WINDOW.location.pathname}#/`

      if (isPortal()) {
        if (getEnabledApp(apps[MODE.PORTAL]).length)
          window.location.href = `${path}portal/${getEnabledApp(apps[MODE.PORTAL])[0].path}`
      } else {
        if (getEnabledApp(apps[MODE.ADMIN]).length)
          window.location.href = `${path}${getEnabledApp(apps[MODE.ADMIN])[0].path}`
      }
    }
  })

  const sendMessage = (): void => {
    postMessage.send('updateRules', {
      staticHost,
      domain,
      protocol,
      WEB_COMMON,
      BAAS_ENTADMIN_CONFIG
    })

    postMessage.send('injectScriptLoaded', {})
  }

  sendMessage()
}
