import {sendMessageTabs} from './sendMessage.js'

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
    chrome.tabs.query(
        {
            active: true,
            currentWindow: true
        },
        async (tabs) => {
            await updateDynamicRules(rules)
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
    const {hostname, port} = new URL(target);
    if (!port) return
    return {
        id: 100 + index,
        priority: 1,
        action: {
            type: 'redirect',
            redirect: {
                transform:{
                    scheme: 'http',
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
