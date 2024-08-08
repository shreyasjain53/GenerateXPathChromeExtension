document.getElementById('generate').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: generateXpaths
        });
    });
});

function generateXpaths() {
    function getElementXPath(element) {
        if (!element) return '';
        if (element.id) return 'id("' + element.id + '")';
        if (element === document.body) return element.tagName.toLowerCase();

        let ix = 0;
        let parent = element.parentNode;
        if (!parent) return '';
        let siblings = parent.childNodes;
        for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === element) {
                return getElementXPath(parent) + '/' +
                    element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
        return '';
    }

    let xpaths = Array.from(document.querySelectorAll('*:not(script):not(style)')).map(getElementXPath);
    chrome.runtime.sendMessage({xpaths: xpaths});
}

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.xpaths) {
        let output = document.getElementById('xpaths');
        if (output) {
            output.innerHTML = request.xpaths.join('<br>');
        } else {
            console.error('Output element not found');
        }
    }
});


document.getElementById('generate').addEventListener('click', () => {
    console.log('Generate button clicked');
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        console.log('Active tab:', tabs[0]);
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: generateXpaths
        });
    });
});

