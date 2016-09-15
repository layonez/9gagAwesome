debugger;

var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.extension.getURL('src/myscript.js');
s.onload = function() {
    this.remove();
};
s.setAttribute('extensionId', chrome.runtime.id);
s.setAttribute('id', '9gagAwersome');

// Content script
//Listen for the event
window.addEventListener("subcribeToUser", function(evt) {
  chrome.runtime.sendMessage(evt.detail);
}, false);

(document.head || document.documentElement).appendChild(s);

