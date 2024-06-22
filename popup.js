document.addEventListener('DOMContentLoaded', () => {
    const siteInput = document.getElementById('siteInput');
    const addSiteButton = document.getElementById('addSiteButton');
    const blockedSitesDiv = document.getElementById('blockedSites');
  
    function updateBlockedSites() {
      chrome.storage.sync.get('blockedSites', (data) => {
        const blockedSites = data.blockedSites || {};
        blockedSitesDiv.innerHTML = '';
        for (const site in blockedSites) {
          const siteDiv = document.createElement('div');
          siteDiv.className = 'site';
          const siteName = document.createElement('span');
          siteName.textContent = site;
          const toggle = document.createElement('input');
          toggle.type = 'checkbox';
          toggle.className = 'toggle';
          toggle.checked = blockedSites[site];
          toggle.addEventListener('change', () => {
            chrome.runtime.sendMessage({
              action: 'toggleBlock',
              site: site,
              block: toggle.checked
            }, (response) => {
              alert(response.message);
            });
          });
          const removeButton = document.createElement('button');
          removeButton.textContent = 'Remove';
          removeButton.addEventListener('click', () => {
            chrome.runtime.sendMessage({ action: 'removeSite', site: site }, (response) => {
              alert(response.message);
              updateBlockedSites();
            });
          });
          siteDiv.appendChild(siteName);
          siteDiv.appendChild(toggle);
          siteDiv.appendChild(removeButton);
          blockedSitesDiv.appendChild(siteDiv);
        }
      });
    }
  
    addSiteButton.addEventListener('click', () => {
      const site = siteInput.value.trim();
      if (site) {
        chrome.runtime.sendMessage({ action: 'addSite', site: site }, (response) => {
          alert(response.message);
          if (response.success) {
            updateBlockedSites();
          }
        });
      }
    });
  
    updateBlockedSites();
  });
  