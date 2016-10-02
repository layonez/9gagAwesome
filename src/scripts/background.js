/* jshint loopfunc:true */
document.addEventListener('DOMContentLoaded', function() {
    if (Notification.permission !== "granted")
        Notification.requestPermission();
});

var subcribeList;
var reqCount;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "subcribeToUser") {

        chrome.storage.local.get(request.user, function(obj) {
            if (!obj.ref) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', 'http://9gag.com/u/' + request.user + '/posts');
                xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
                xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                xhr.send();

                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var subscription = {};
                        subscription[request.user] = {
                            'ref': request.ref,
                            'date': Date.now(),
                            'avatar': request.avatar,
                            'posts': JSON.parse(xhr.response).ids
                        };
                        chrome.storage.local.set(subscription);
                    } else {
                        console.log('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
                    }
                };

            }

        });
    } else
        sendResponse({});
});

var notify = function(id, newPosts) {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification('User ' + id + ' post some new awesomness', {
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
};

checkServer = function() {
    chrome.storage.local.get(null, function(items) {
        var allKeys = Object.keys(items);


        for (var i = allKeys.length - 1; i >= 0; i--) {
            var item = items[allKeys[i]];
            item.user = allKeys[i];

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://9gag.com/u/' + item.user + '/posts');
            xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
            xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
            xhr.send();

            xhr.item = item;

            xhr.onload = function() {
                if (this.status === 200) {
                    var item = this.item;
                    var newIds = JSON.parse(this.response).ids;
                    var newPosts = newIds.filter(function(id) {
                        return item.posts.indexOf(id) === -1;
                    });

                    if (newPosts.length > 0) {
                        notify(item.user, newPosts);
                    }

                    if (item.newPosts) {
                        item.newPosts = item.newPosts.concat(newPosts);
                    } else {
                        item.newPosts = newPosts;
                    }
                    item.posts = newIds;

                    var subscription = {};
                    subscription[item.user] = item;
                    chrome.storage.local.set(subscription);

                } else {
                    console.log('Something went wrong :(.  9GAG Returned status of ' + this.status + ' awesomeIndex ' + awesomeIndex);
                }
            };
        }
    });
};

chrome.alarms.create("checkServer", {
    delayInMinutes: 0.1,
    periodInMinutes: 5
});

chrome.alarms.onAlarm.addListener(function(alarm) {
    if (alarm.name === "checkServer") {
        checkServer();
    }
});
