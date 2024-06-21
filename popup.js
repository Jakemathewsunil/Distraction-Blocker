document.getElementById('blockBtn').addEventListener('click', function() {
    let siteUrl = document.getElementById('siteUrl').value;
    if (siteUrl) {
        chrome.storage.sync.get('blockedSites', function(data) {
            let blockedSites = data.blockedSites || [];
            blockedSites.push(siteUrl);
            chrome.storage.sync.set({ blockedSites: blockedSites }, function() {
                alert(siteUrl + ' has been blocked.');
                displayBlockedSites();
            });
        });
    }
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
