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
        updateBlockingRules(blockedSites);
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
  const rulesToAdd = [];
  const rulesToRemove = [];

  Object.keys(blockedSites).forEach((site, index) => {
    const ruleId = index + 1;
    if (blockedSites[site]) {
      rulesToAdd.push({
        id: ruleId,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: "*://" + site + "/*" }
      });
    } else {
      rulesToRemove.push(ruleId);
    }
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rulesToRemove,
    addRules: rulesToAdd
  }, () => {
    console.log('Blocking rules updated', { rulesToAdd, rulesToRemove });
  });

  // Set up content script injection
  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    const conditions = Object.keys(blockedSites).filter(site => blockedSites[site]).map(site => new chrome.declarativeContent.PageStateMatcher({
      pageUrl: { urlContains: site }
    }));
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: conditions,
      actions: [new chrome.declarativeContent.RequestContentScript({ js: ["content.js"] })]
    }]);
  });
}
