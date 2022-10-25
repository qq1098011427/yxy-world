export class Message {
  constructor(events, { prefix = '', callback = '@@callback', isPermission = () => true } = {}) {
    this.events = {}
    this.prefix = prefix
    this.CALLBACKS = []
    this.isPermission = isPermission
    Object.entries(events).forEach(([event, fn]) => this.message(event, fn))
    this.message(callback, ({ callbackId, ...data }) => {
      console.log(this.CALLBACKS, this.CALLBACKS[prefix + callbackId])
      this.CALLBACKS[prefix + callbackId] && this.CALLBACKS[prefix + callbackId](data)
    })
  }

  flush(data) {
    this.events[data.action] && this.events[data.action].forEach(fn => fn(data))
  }

  message(event, fn) {
    this.events[event] ? this.events[event].push(fn) : (this.events[event] = [fn])
  }
}

export class MessageChrome extends Message {
  constructor(events, options) {
    super(events, options)
    this.addEventListener()
  }

  flush(data, sender, callback) {
    this.events[data.command] && this.events[data.command].forEach(fn => fn(data, sender, callback))
  }

  addEventListener() {
    chrome.runtime.onMessage.addListener((request, sender, callback) => {
      if (this.isPermission(request)) {
        this.flush(request, sender, callback)
      }
    })
  }

  send(command, message, callback) {
    chrome.runtime.sendMessage(
      {
        command,
        from: 'content_script',
        message
      },
      callback
    )
  }
}

export class MessagePostMessage extends Message {
  constructor(events, options) {
    super(events, options)
    this.id = 0
    this.addEventListener()
  }

  addEventListener() {
    window.addEventListener(
      'message',
      e => {
        if (this.isPermission(e)) {
          this.flush(e.data)
        }
      },
      false
    )
  }

  send(action, data = {}, callback) {
    if (typeof data === 'function') {
      callback = data
      data = {}
    }
    this.id++
    this.CALLBACKS[this.prefix + this.id.toString()] = callback
    window.postMessage(
      {
        action,
        data,
        callbackId: this.id.toString(),
        from: 'content_script'
      },
      window.location.origin
    )
  }
}
