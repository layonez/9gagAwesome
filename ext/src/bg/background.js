// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


chrome.webRequest.onCompleted.addListener(function(details){
 if(details.url.indexOf('comment-list.json')>0){
 	details.p =1;
 }
},
  {urls: ["*://*.9gag.com/*"]}
  //, ["responseHeaders"]
 );


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	debugger;
    if (request.method == "subcribeToUser"){
    	chrome.storage.sync.get('subcribeList',function (obj) {
    		if (obj && obj.subcribeList && obj.subcribeList.length) {
    			if (!contains(obj.subcribeList, request.user)) {
    				obj.subcribeList.push({'user': request.user , 'ref': request.ref });
    				chrome.storage.sync.set(obj);
    				}
    			}else{
    			chrome.storage.sync.set({'subcribeList' : [ {'user': request.user , 'ref': request.ref } ]});
    		}
		})
    	//chrome.storage.sync.set({'user': request.user , 'ref': request.userRef });    
    }
    else
      sendResponse({}); // snub them.
});

var contains = function(array, val){
	var found = false;
for(var i = 0; i < array.length; i++) {
    if (array[i].user == val) {
        found = true;
        break;
    }
}
return found;
};

    
