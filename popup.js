document.getElementById('addSiteBtn').addEventListener('click', function() {
    let siteUrl = document.getElementById('siteUrl').value;
    if (siteUrl) {
        chrome.runtime.sendMessage({ action: "addSite", site: siteUrl }, function(response) {
            alert(response.message);
            displayBlockedSites();
        });
    }
});

function displayBlockedSites() {
    chrome.storage.sync.get('blockedSites', function(data) {
        let blockedSites = data.blockedSites || {};
        let blockedSitesList = document.getElementById('blockedSites');
        blockedSitesList.innerHTML = '';
        for (let site in blockedSites) {
            let li = document.createElement('li');
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${blockedSites[site] ? 'checked' : ''} data-site="${site}">
                    ${site}
                </label>
                <button data-site="${site}" class="removeSiteBtn">Remove</button>
            `;
            blockedSitesList.appendChild(li);
        }

        // Add event listeners for toggles and remove buttons
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                let site = this.getAttribute('data-site');
                let block = this.checked;
                chrome.runtime.sendMessage({ action: "toggleBlock", site: site, block: block }, function(response) {
                    alert(response.message);
                });
            });
        });

        document.querySelectorAll('.removeSiteBtn').forEach(button => {
            button.addEventListener('click', function() {
                let site = this.getAttribute('data-site');
                chrome.runtime.sendMessage({ action: "removeSite", site: site }, function(response) {
                    alert(response.message);
                    displayBlockedSites();
                });
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', displayBlockedSites);
