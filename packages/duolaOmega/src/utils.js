export const getChromeStorage = async () => {
    console.log(process.env.NODE_ENV, 'process.env.NODE_ENV')
    if (process.env.NODE_ENV === 'development') {
        return {
            isProxy: true,
            rules: [
                {
                    "source": "#https://om-version-test-1.uban360.com:21207/statics/entadmin2/contact-admin/0.0.1/index.js",
                    "target": "http://localhost:8080/index.js"
                }
            ]
        }
    }
    return await chrome.storage.local.get()
}
