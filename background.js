chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
    updateBlockingRules([]);
});

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "blockSite") {
        addBlockingRule(request.site, sendResponse);
    } else if (request.action === "unblockSites") {
        clearBlockingRules(sendResponse);
    }
    return true; // Required to use sendResponse asynchronously
});

// Function to add a blocking rule
function addBlockingRule(site, sendResponse) {
    chrome.storage.sync.get("blockedSites", (data) => {
        let blockedSites = data.blockedSites || [];
        if (!blockedSites.includes(site)) {
            blockedSites.push(site);
            chrome.storage.sync.set({ blockedSites: blockedSites }, () => {
                updateBlockingRules(blockedSites);
                sendResponse({ success: true, message: site + ' has been blocked.' });
            });
        } else {
            sendResponse({ success: false, message: site + ' is already blocked.' });
        }
    });
}

// Function to update the blocking rules
function updateBlockingRules(blockedSites) {
    const rules = blockedSites.map((site, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: "*://" + site + "/*" }
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1), // Clear existing rules
        addRules: rules
    });
}

// Function to clear all blocking rules
function clearBlockingRules(sendResponse) {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1)
    }, () => {
        chrome.storage.sync.set({ blockedSites: [] }, () => {
            sendResponse({ success: true, message: 'All sites have been unblocked.' });
        });
    });
}

// Load existing rules on startup
chrome.storage.sync.get("blockedSites", (data) => {
    let blockedSites = data.blockedSites || [];
    updateBlockingRules(blockedSites);
});
