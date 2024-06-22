document.addEventListener('DOMContentLoaded', function () {
  const blockButton = document.getElementById('blockButton');
  const unblockButton = document.getElementById('unblockButton');
  const siteInput = document.getElementById('siteInput');
  const siteList = document.getElementById('siteList');

  blockButton.addEventListener('click', function () {
    const site = siteInput.value.trim();
    if (site) {
      chrome.runtime.sendMessage({ action: 'addSite', site: site }, response => {
        if (response.success) {
          addSiteToList(site);
        }
        alert(response.message);
      });
    }
  });

  unblockButton.addEventListener('click', function () {
    const site = siteInput.value.trim();
    if (site) {
      chrome.runtime.sendMessage({ action: 'removeSite', site: site }, response => {
        if (response.success) {
          removeSiteFromList(site);
        }
        alert(response.message);
      });
    }
  });

  function addSiteToList(site) {
    const li = document.createElement('li');
    li.textContent = site;

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = false;
    toggle.addEventListener('change', function () {
      chrome.runtime.sendMessage({ action: 'toggleBlock', site: site, block: toggle.checked });
    });

    li.appendChild(toggle);
    siteList.appendChild(li);
  }

  function removeSiteFromList(site) {
    const items = siteList.getElementsByTagName('li');
    for (let i = 0; i < items.length; i++) {
      if (items[i].textContent.includes(site)) {
        siteList.removeChild(items[i]);
        break;
      }
    }
  }

  // Load existing blocked sites
  chrome.storage.sync.get('blockedSites', data => {
    const blockedSites = data.blockedSites || {};
    for (let site in blockedSites) {
      if (blockedSites.hasOwnProperty(site)) {
        addSiteToList(site);
      }
    }
  });
});
