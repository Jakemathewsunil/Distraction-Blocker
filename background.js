chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: {} });
    updateBlockingRules({});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addSite") {
        addSite(request.site, sendResponse);
    } else if (request.action === "removeSite") {
        removeSite(request.site, sendResponse);
    } else if (request.action === "toggleBlock") {
        toggleBlockSite(request.site, request.block, sendResponse);
    }
    return true;
});

function addSite(site, sendResponse) {
    chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || {};
        if (!blockedSites.hasOwnProperty(site)) {
            blockedSites[site] = false; // Initially not blocked
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                sendResponse({ success: true, message: site + ' has been added to the block list.' });
            });
        } else {
            sendResponse({ success: false, message: site + ' is already in the block list.' });
        }
    });
}

function removeSite(site, sendResponse) {
    chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || {};
        if (blockedSites.hasOwnProperty(site)) {
            delete blockedSites[site];
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                sendResponse({ success: true, message: site + ' has been removed from the block list.' });
            });
        } else {
            sendResponse({ success: false, message: site + ' is not in the block list.' });
        }
    });
}

function toggleBlockSite(site, block, sendResponse) {
    chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || {};
        if (blockedSites.hasOwnProperty(site)) {
            blockedSites[site] = block;
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                updateBlockingRules(blockedSites);
                sendResponse({ success: true, message: site + (block ? ' has been blocked.' : ' has been unblocked.') });
            });
        } else {
            sendResponse({ success: false, message: site + ' is not in the block list.' });
        }
    });
}

function updateBlockingRules(blockedSites) {
    const rules = Object.keys(blockedSites).map((site, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: "*://" + site + "/*" }
    })).filter(rule => blockedSites[rule.condition.urlFilter.slice(4, -2)]);

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1), // Clear existing rules
        addRules: rules
    });
}
