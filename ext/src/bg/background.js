// request permission on page load
document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

var subcribeList;
var reqCount;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "subcribeToUser") {
        chrome.storage.sync.get('subcribeList', function(obj) {
            if (obj && obj.subcribeList && obj.subcribeList.length) {
                if (!contains(obj.subcribeList, request.user)) {

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', 'http://9gag.com/u/' + request.user + '/posts');
                    xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
                    xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                    xhr.send();

                    xhr.onload = function() {
                        if (xhr.status === 200) {
                            obj.subcribeList.push({
                                'user': request.user,
                                'ref': request.ref,
                                'date': Date.now(),
                                'avatar': request.avatar,
                                'posts': JSON.parse(xhr.response).ids
                            });
                            chrome.storage.sync.set(obj);
                        } else {
                            console.log('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
                        }
                    };
                }
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://9gag.com/u/' + request.user + '/posts');
                xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
                xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                xhr.send();

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        chrome.storage.sync.set({
                            'subcribeList': [{
                                'user': request.user,
                                'ref': request.ref,
                                'date': Date.now(),
                                'avatar': request.avatar,
                                'posts': JSON.parse(xhr.response).ids
                            }]
                        });
                    } else {
                        console.log('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
                    }
                };
            }
        })
    } else
        sendResponse({});
});

var contains = function(array, val) {
    var found = null;
    for (var i = 0; i < array.length; i++) {
        if (array[i].user == val) {
            found = array[i];
            break;
        }
    }
    return found;
};

var save = function() {
    chrome.storage.sync.set({ 'subcribeList': subcribeList });
};
var notify = function(id, newPosts) {    
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var notification = new Notification('User '+id+' post some new awesomness', {
                icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/9GAG_new_logo.svg/340px-9GAG_new_logo.svg.png',
                body: "Check it out!",
            });
            notification.onclick = function() {
            	newPosts.forEach(function(postId) {
                            chrome.tabs.create({
                                active: true,
                                url: 'http://9gag.com/gag/' + postId
                            });
                        });
            	this.close();
            };
        }    
}
checkServer = function() {
    chrome.storage.sync.get('subcribeList', function(obj) {
        if (obj && obj.subcribeList && obj.subcribeList.length) {
            subcribeList = obj.subcribeList;
            reqCount = subcribeList.length;

            for (var i = subcribeList.length - 1; i >= 0; i--) {
                var item = subcribeList[i];

                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://9gag.com/u/' + item.user + '/posts');
                xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
                xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                xhr.send();

                xhr.awesomeIndex = i;

                xhr.onload = function() {
                    if (this.status === 200) {
                        var newIds = JSON.parse(this.response).ids;
                        var item = subcribeList[this.awesomeIndex];
                        var newPosts = newIds.filter(function(id) {
                            return item.posts.indexOf(id) === -1;
                        });

                        if (newPosts.length > 0) {
                        	notify(subcribeList[this.awesomeIndex].user,newPosts);
                        }

                        if (item.newPosts) {
                            item.newPosts = item.newPosts.concat(newPosts);                      
                        } else {
                            item.newPosts = newPosts
                        }
                        item.posts = newIds;
                    } else {
                        console.log('Something went wrong :(.  9GAG Returned status of ' + this.status + ' awesomeIndex ' + awesomeIndex);
                    }
                    reqCount--;

                    if (reqCount === 0) {
                        save();
                    }
                };
            }
        }
    })

}

chrome.alarms.create("checkServer", {
    delayInMinutes: 0.1,
    periodInMinutes: 2
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "checkServer") {
        checkServer();
    }
});
