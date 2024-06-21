chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
    updateBlockingRules([]);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "blockSite") {
        addBlockingRule(request.site, sendResponse);
    } else if (request.action === "unblockSites") {
        clearBlockingRules(sendResponse);
    }
    return true; // Required to use sendResponse asynchronously
});

function addBlockingRule(site, sendResponse) {
    chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || [];
        if (!blockedSites.includes(site)) {
            blockedSites.push(site);
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                sendResponse({ success: true, message: site + ' has been blocked.' });
            });
        } else {
            sendResponse({ success: false, message: site + ' is already blocked.' });
        }
    });
}

function clearBlockingRules(sendResponse) {
    chrome.storage.sync.set({ blockedSites: [] }, () => {
        sendResponse({ success: true, message: 'All sites have been unblocked.' });
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'loading') {
        chrome.storage.sync.get("blockedSites", (data) => {
            let blockedSites = data.blockedSites || [];
            let url = new URL(tab.url);
            if (blockedSites.includes(url.hostname)) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ['content.js']
                });
            }
        });
    }
});
