// background/popup
export const sendMessage = (command, message, callback = () => {}, from = 'content_script') => {
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

export const sendMessageTabs = (command, message, callback = () => {}) => {
    if (typeof message === 'function') {
        callback = message
        message = {}
    }
    chrome.tabs.query({ active: true, currentWindow: true },  (tabs) => {
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
