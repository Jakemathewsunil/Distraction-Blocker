(function() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999999';
    overlay.style.pointerEvents = 'all';
  
    const message = document.createElement('div');
    message.innerText = 'This site is blocked';
    message.style.color = 'white';
    message.style.fontSize = '24px';
    message.style.fontFamily = 'Arial, sans-serif';
  
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  })();
  