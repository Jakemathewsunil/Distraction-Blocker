chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
});

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return { cancel: true };
    },
    { urls: ["*://*.example.com/*"], types: ["main_frame"] },
    ["blocking"]
);

chrome.storage.sync.get("blockedSites", function(data) {
    let blockedSites = data.blockedSites || [];
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
            for (let site of blockedSites) {
                if (details.url.includes(site)) {
                    return { cancel: true };
                }
            }
            return { cancel: false };
        },
        { urls: ["<all_urls>"], types: ["main_frame"] },
        ["blocking"]
    );
});
