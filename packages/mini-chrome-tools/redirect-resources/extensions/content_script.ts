import { MessageChrome, MessagePostMessage } from './utils/common'

console.log('yxy23 content.js')
const run = () => {
  const messageChrome = new MessageChrome({
    switch: ({ command, message }: any, sender: any, response: any) => {
      messagePostMessage.send('switch', message)
      response && response()
    },
    refreshPage: () => {
      messagePostMessage.send('refreshPage', {})
    },
    loadScript: ({ message }: any, sender: any, response: any) => {
      messagePostMessage.send('loadScript', message)
      response && response()
    }
  })

  const messagePostMessage = new MessagePostMessage({
    updateRules: (res: any, sender: any, response: any) => {
      const { action, data } = res
      messageChrome.send(action, data, () => {})

      response && response()
    },

    injectScriptLoaded: () => {
      chrome.storage.sync.get('xapp_tools_extra_apps', async data => {
        const { xapp_tools_extra_apps } = data

        if (xapp_tools_extra_apps) {
          messagePostMessage.send('loadScript', {
            apps: xapp_tools_extra_apps
          })
        }
      })
    }
  })

  const handleInjectScript = async () => {
    if (!document.querySelectorAll('#xapp_tools_inject_script').length) {
      const script = document.createElement('script')
      script.id = 'xapp_tools_inject_script'
      script.type = 'text/javascript'
      script.src = chrome.runtime.getURL('inject_script.js')
      document.head.appendChild(script)
    }
  }

  handleInjectScript()
}

run()
