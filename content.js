// Function to check if an element is visible
function isVisible(element) {
    const style = getComputedStyle(element);
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length) &&
           style.display !== 'none' &&
           style.visibility !== 'hidden' &&
           style.opacity !== '0' &&
           style.position !== 'absolute' &&
           style.visibility !== 'collapse' &&
           style.zIndex !== '-1' &&
           !element.hasAttribute('hidden') &&
           element.style.display !== 'none' &&
           element.style.visibility !== 'hidden' &&
           !element.classList.contains('exclude-element') && // Exclude elements with the class 'exclude-element'
           !element.hasAttribute('data-exclude'); // Exclude elements with the attribute 'data-exclude'
}
// Function to generate XPath for an element
function getElementXPath(element) {
    if (!element) return '';
    if (element.id && !element.classList.contains('exclude-element')) {
        return `id("${element.id}")`;
    }
    if (element === document.body) return element.tagName.toLowerCase();

    let ix = 0;
    let parent = element.parentNode;
    if (!parent) return '';
    let siblings = parent.childNodes;
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element && !element.classList.contains('exclude-element')) {
            let relativePath = getElementXPath(parent);
            if (relativePath) {
                return relativePath + '/' +
                    element.tagName.toLowerCase() + `[${ix + 1}]`;
            }
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName &&
            !sibling.classList.contains('exclude-element')) {
            ix++;
        }
    }
    return '';
}

// Function to generate XPaths for visible elements
function generateXpaths() {
    // Select all relevant elements
    let elements = Array.from(document.querySelectorAll('input, button'));
    // console.log('All elements:', elements);
    
    // Filter to include only visible elements
    let visibleElements = elements.filter(isVisible);
    // console.log('Visible elements:', visibleElements);
    
    // Generate XPaths for visible elements
    let xpaths = visibleElements.map(element => {
        let xpath = getElementXPath(element);
        if (xpath) return xpath;
    }).filter(Boolean);

    console.log('Generated XPaths:', xpaths);
    chrome.runtime.sendMessage({ xpaths: xpaths });
}

// Event listener for the Generate button click
document.getElementById('generateButton').addEventListener('click', generateXpaths);