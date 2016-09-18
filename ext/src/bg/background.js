chrome.webRequest.onCompleted.addListener(function(details){
 if(details.url.indexOf('notif.9gag.com')>0){
 	alert('notif');
 }
},
  {urls: ["*://*.9gag.com/*"]}
 );


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "subcribeToUser"){
    	chrome.storage.sync.get('subcribeList',function (obj) {
    		if (obj && obj.subcribeList && obj.subcribeList.length) {
    			if (!contains(obj.subcribeList, request.user)) {
    				
    				var xhr = new XMLHttpRequest(); 
					xhr.open('GET', 'http://9gag.com/u/' + request.user + '/posts');
					xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
    				xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
    				xhr.send();

    				xhr.onload = function() {
    					if (xhr.status === 200) {
        					obj.subcribeList.push({'user': request.user , 'ref': request.ref, 'date': Date.now() , 'avatar':request.avatar, 'posts': JSON.parse(xhr.response).ids});
    						chrome.storage.sync.set(obj);
    					}
    					else {
        					alert('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
    					}
					};    				
    				}
    			}else{
    				var xhr = new XMLHttpRequest(); 
					xhr.open('GET', 'http://9gag.com/u/' + request.user + '/posts');
					xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
    				xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');    				xhr.send();

    				xhr.onload = function() {
    					if (xhr.status === 200) {
    						chrome.storage.sync.set({'subcribeList' : [ {'user': request.user , 'ref': request.ref, 'date': Date.now(), 'avatar':request.avatar, 'posts': JSON.parse(xhr.response).ids } ]});
        				}
    					else {
        					alert('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
    					}
					};    	
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

var alarmClock = {

        onHandler : function(e) {
            chrome.alarms.create("myAlarm", {delayInMinutes: 0.1, periodInMinutes: 0.2} );
                    window.close();
        },

        offHandler : function(e) {
            chrome.alarms.clear("myAlarm");
                    window.close();
        },

        setup: function() {
            var a = document.getElementById('findOP');
            a.addEventListener('click',  alarmClock.onHandler );
            var a = document.getElementById('findOP');
            a.addEventListener('click',  alarmClock.offHandler );
        }
};

document.addEventListener('DOMContentLoaded', function () {
    alarmClock.setup();
});