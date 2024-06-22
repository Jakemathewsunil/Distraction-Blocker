chrome.storage.sync.get("blockedSites", (data) => {
  let blockedSites = data.blockedSites || {};
  let currentSite = window.location.hostname;
  let isBlocked = Object.keys(blockedSites).some(site => currentSite.includes(site) && blockedSites[site]);

  if (isBlocked) {
    document.documentElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: black;" data-blocker="true">
        <h1 style="color: white;">This site is blocked</h1>
      </div>
    `;
    document.documentElement.style.overflow = 'hidden';
  } else {
    // Clear any previously injected block screen
    let blockScreen = document.querySelector('[data-blocker="true"]');
    if (blockScreen) {
      blockScreen.remove();
    }
    document.documentElement.style.overflow = '';
  }
});
