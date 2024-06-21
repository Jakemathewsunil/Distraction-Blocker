document.getElementById('blockBtn').addEventListener('click', function() {
    let siteUrl = document.getElementById('siteUrl').value;
    if (siteUrl) {
        chrome.runtime.sendMessage({ action: "blockSite", site: siteUrl }, function(response) {
            alert(response.message);
            displayBlockedSites();
        });
    }
});

document.getElementById('unblockBtn').addEventListener('click', function() {
    chrome.runtime.sendMessage({ action: "unblockSites" }, function(response) {
        alert(response.message);
        displayBlockedSites();
    });
});

function displayBlockedSites() {
    chrome.storage.sync.get('blockedSites', function(data) {
        let blockedSites = data.blockedSites || [];
        let blockedSitesList = document.getElementById('blockedSites');
        blockedSitesList.innerHTML = '';
        for (let site of blockedSites) {
            let li = document.createElement('li');
            li.textContent = site;
            blockedSitesList.appendChild(li);
        }
    });
}

document.addEventListener('DOMContentLoaded', displayBlockedSites);
