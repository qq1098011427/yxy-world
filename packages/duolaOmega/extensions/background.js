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
            resourceTypes: ['script']
        }
    }
}
// 转发规则
const updateDynamicRules = async (rules) => {
    const addRules = rules.map((rule, index) => createRedirectRule(rule, index))
    console.log('addRules====', addRules)
    // 开启静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["commonRule"]})
    // 注册转发规则
    await chrome.declarativeNetRequest.updateDynamicRules({addRules});
    chrome.action.setIcon({path: '/icons/icon.jpg'})
}
// 清理规则
const clearDynamicRules = async () => {
    const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules()
    const staticRules= await chrome.declarativeNetRequest.getEnabledRulesets()
    console.log("动态rules:", dynamicRules, '静态rules:', staticRules);
    // 禁用静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: staticRules})
    // 清空动态规则
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: dynamicRules.map(rule => rule.id)});
    chrome.action.setIcon({path: '/icons/icon-disabled.jpg'})
}