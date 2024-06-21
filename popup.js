document.getElementById('blockButton').addEventListener('click', function() {
    const url = document.getElementById('url').value;
    const duration = parseInt(document.getElementById('duration').value);
  
    if (url && duration) {
      chrome.storage.local.set({ blockedUrl: url, blockDuration: duration }, function() {
        chrome.runtime.sendMessage({ action: "blockUrl", url: url, duration: duration });
      });
    }
  });
  