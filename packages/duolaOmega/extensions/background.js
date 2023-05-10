import {sendMessageTabs} from './sendMessage.js'

let activeUrl = ''
// 监听浏览器tabs变化
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    activeUrl = tab.url
    // const { rules, isProxy } = await chrome.storage.local.get()
    // if (rules?.length && isProxy) {
    //     await clearDynamicRules()
    //     hitTab(rules)
    // }
});


// 监听sendMessage过来的事件
chrome.runtime.onMessage.addListener(async (messages, sender, sendResponse) => {
    const {command} = messages
    const { rules, isProxy } = await chrome.storage.local.get()
    if (command === 'updateDynamicRules') {
        // 清空之前的规则
        await clearDynamicRules()
        const r = rules.filter(item => item && !item?.source.startsWith('#'))
        if (r?.length && isProxy) {
            hitTab(r)
        }
    }
    if (command === 'clearDynamicRules') {
        !isProxy && clearDynamicRules()
    }
})

// 命中当前tab
const hitTab = (rules) => {
    // @ 作为origin的别名
    const getPath = (source, url) => {
        if (!url) return source
        const {origin} = new URL(url)
        return source.replace(/@/g, origin)
    }
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        async (tabs) => {
            // 获取当前命中的tabs的url
            const currentTab = tabs?.[0];
            const url = currentTab?.url || activeUrl;
            await updateDynamicRules(rules.map(rule => ({
                ...rule,
                source: getPath(rule.source, url)
            })))
        }
    )
}
const createRedirectRule = (rule, index) => {
    const { source, target } = rule
    return {
        id: 1 + index,
        priority: 1,
        action: {
            type: 'redirect',
            redirect: {
                url: target
            }
        },
        condition: {
            urlFilter: source,
            resourceTypes: ['script', 'xmlhttprequest', 'image']
        }
    }
}
// 热更新相关
const createSockjsNodeRule = (rule, index) => {
    const { target } = rule
    const {protocol, hostname, port} = new URL(target);
    const targetProtocol = protocol.replace(':', '')
    if (!port) return
    return {
        id: 100 + index,
        priority: 1,
        action: {
            type: 'redirect',
            redirect: {
                transform:{
                    scheme: targetProtocol,
                    host: hostname,
                    port
                }
            }
        },
        condition: {
            urlFilter: `https://${hostname}:${port}/sockjs-node`,
            resourceTypes: ['xmlhttprequest']
        }
    }
}
const updateDynamicRules = async (rules) => {
    const addRules = rules.map((rule, index) => createRedirectRule(rule, index))
        .concat(rules.map((rule, index) => createSockjsNodeRule(rule, index)))
        .filter(item => item)
    // 注册转发规则
    await chrome.declarativeNetRequest.updateDynamicRules({addRules}, () => {
        // 通知注入脚本
        sendMessageTabs('updateDynamicRules', {rules})
        chrome.action.setIcon({path: '/icons/icon.jpg'})
    })
    // 开启静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["commonRule"]})
}
// 清理规则
const clearDynamicRules = async () => {
    const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules()
    const staticRules= await chrome.declarativeNetRequest.getEnabledRulesets()
    console.log("动态rules:", dynamicRules, '静态rules:', staticRules);
    // 禁用静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: staticRules})
    // 清空动态规则
    chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: dynamicRules.map(rule => rule.id)}, () => {
        sendMessageTabs('clearDynamicRules')
        chrome.action.setIcon({path: '/icons/icon-disabled.jpg'})
    })
}
