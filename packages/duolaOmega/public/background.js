chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        console.log(`Tab ${tabId} loaded`);
    }
});

chrome.action.onClicked.addListener(() => {
    console.log('Action clicked!');
});
