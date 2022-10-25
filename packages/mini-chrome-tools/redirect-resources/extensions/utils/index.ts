export const isInChromeExtension = () => {
    // @ts-ignore
    return chrome.storage
}

export const isPortal = () => {
    return window.location.pathname === '/portal/'
}

/**
 * 1、自动给proxyUrl添加index.js
 * 2、根据protocol自定添加重定向规则
 * @param filterUrl
 * @param redirectUrl
 * @param id
 * @param resourceTypes
 * @param action
 * @constructor
 */
export const URL_FILTER_RULE = (
    filterUrl: string,
    redirectUrl: string,
    id: number,
    resourceTypes = ['script'],
    action: any = {}
) => {
    const obj = {
        id: id + 1,
        priority: 1,
        action: {
            ...{
                type: 'redirect',
                redirect: {
                    url: redirectUrl
                }
            },
            ...action
        },
        condition: {
            urlFilter: filterUrl,
            resourceTypes: resourceTypes
        }
    }
    if (filterUrl.startsWith('/') && filterUrl.endsWith('/')) {
        // @ts-ignore
        delete obj.condition.urlFilter
        // @ts-ignore
        obj.condition.regexFilter = filterUrl.substring(1, filterUrl.length - 1)
    }
    return obj
}
