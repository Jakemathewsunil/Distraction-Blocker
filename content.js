document.body.innerHTML = `
    <div id="blocker-message" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 24px;
        font-family: Arial, sans-serif;
    ">
        This site is blocked
    </div>
`;
document.body.style.overflow = 'hidden';
document.body.style.pointerEvents = 'none';
