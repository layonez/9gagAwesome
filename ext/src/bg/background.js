// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
debugger;

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.webRequest.onCompleted.addListener(function(details){
 if(details.url.indexOf('comment-list.json')>0){
 	details.p =1;
 }
},
  {urls: ["*://*.9gag.com/*"]}
  //, ["responseHeaders"]
 );


