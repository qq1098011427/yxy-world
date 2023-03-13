import {sendMessageTabs} from './sendMessage.js'

chrome.runtime.onMessage.addListener(async (messages, sender, sendResponse) => {
    const {command} = messages
    const { rules, isProxy } = await chrome.storage.local.get()
    if (command === 'updateDynamicRules') {
        const r = rules.filter(item => item.source && item.target)
        console.log(r, 'r====')
        isProxy && hitTab(r)
    }
    if (command === 'clearDynamicRules') {
        !isProxy && clearDynamicRules()
    }
})

const redirectRule = {
    id: 1,
    priority: 1,
    action: {
        type: 'redirect',
        redirect: {
            url: 'http://localhost:8080/index.js'
        }
    },
    condition: {
        urlFilter: 'https://om-version-test-1.uban360.com:21207/statics/entadmin2/contact-admin/0.0.1/index.js',
        resourceTypes: ['script']
    }
}

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
// 转发规则
const updateDynamicRules = async (rules) => {
    // 清空之前的规则
    await clearDynamicRules()
    // 开启静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({enableRulesetIds: ["commonRule"]})
    // 注册转发规则
    await chrome.declarativeNetRequest.updateDynamicRules({addRules: [redirectRule]});
    chrome.action.setIcon({path: '/icons/icon.jpg'})
}
// 清理规则
const clearDynamicRules = async () => {
    const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules()
    const staticRules= await chrome.declarativeNetRequest.getEnabledRulesets()
    console.log(dynamicRules, '清理 rules====', staticRules);
    // 禁用静态规则
    await chrome.declarativeNetRequest.updateEnabledRulesets({disableRulesetIds: staticRules})
    // 清空动态规则
    await chrome.declarativeNetRequest.updateDynamicRules({removeRuleIds: dynamicRules.map(rule => rule.id)});
    chrome.action.setIcon({path: '/icons/icon-disabled.jpg'})
}