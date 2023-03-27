export const createDialog = (url: string, config: any): Promise<Window> => {
    return new Promise((resolve, reject) => {
        const windowProxy = window.open(url, '_blank', JSON.stringify(config)) as any
        const readyHandler = (e: any) => {
            const msg = e.data
            if (msg['msgName'] === '__dialogReady') {
                window.removeEventListener('message', readyHandler)
                resolve(windowProxy)
            }
        }
        window.addEventListener('message', readyHandler)
    })
}
export const dialogReady = () => {
    const msg = { msgName: '__dialogReady' }
    window.opener.postMessage(msg)
}
