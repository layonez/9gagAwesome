var s = document.createElement('script');
s.src = chrome.extension.getURL('scripts/myscript.js');
s.onload = function() {
    this.remove();
};
s.setAttribute('extensionId', chrome.runtime.id);
s.setAttribute('id', '9gagAwersome');

window.addEventListener("subcribeToUser", function(evt) {
    chrome.runtime.sendMessage(evt.detail);
}, false);

(document.head || document.documentElement).appendChild(s);
