chrome.webRequest.onCompleted.addListener(function(details){
 if(details.url.indexOf('comment-list.json')>0){
 	details.p =1;
 }
},
  {urls: ["*://*.9gag.com/*"]}
 );


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "subcribeToUser"){
    	chrome.storage.sync.get('subcribeList',function (obj) {
    		if (obj && obj.subcribeList && obj.subcribeList.length) {
    			if (!contains(obj.subcribeList, request.user)) {
    				obj.subcribeList.push({'user': request.user , 'ref': request.ref, 'date': Date.now() , 'avatar':request.avatar});
    				chrome.storage.sync.set(obj);
    				}
    			}else{
    			chrome.storage.sync.set({'subcribeList' : [ {'user': request.user , 'ref': request.ref, 'date': Date.now(), 'avatar':request.avatar } ]});
    		}
		})  
    }
    else
      sendResponse({});
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