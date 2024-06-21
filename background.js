chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "blockUrl") {
      const url = request.url;
      const duration = request.duration;
      const blockRule = {
        id: 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: url, resourceTypes: ["main_frame"] }
      };
  
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [blockRule],
        removeRuleIds: [1]
      });
  
      setTimeout(function() {
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: [1]
        });
      }, duration * 60000);
    }
  });
  