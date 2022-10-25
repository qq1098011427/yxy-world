export const sendMessageToBackground = (command, message, callback, from = 'content_script') => {
  if (typeof message === 'function') {
    callback = message
    message = {}
  }
  chrome.runtime.sendMessage(
    {
      command,
      from,
      to: 'background',
      message
    },
    callback
  )
}

export function sendMessageToContentScript(command, message, callback = function () {}) {
  if (typeof message === 'function') {
    callback = message
    message = {}
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        command,
        message,
        to: 'content_script'
      },
      callback
    )
  })
}
