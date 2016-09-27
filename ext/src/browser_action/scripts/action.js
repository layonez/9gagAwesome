var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function getTextAgo(a) {
    // Discard the time and time-zone information.
    var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    var b = new Date();
    var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    var days = Math.floor((utc2 - utc1) / _MS_PER_DAY);

    if (days < 1) {
        return 'Today';
    } else if (days < 2) {
        return 'Yesterday';
    } else {
        return days + ' days ago';
    }
}

var find = function(array, val) {
    var found = false;
    for (var i = 0; i < array.length; i++) {
        if (array[i].user == val) {
            found = array[i];
            break;
        }
    }
    return found;
};

var removeNewPosts = function(user){
        chrome.storage.sync.get(user, function(obj) {
        if (obj && obj.user) {
            obj.newPosts = [];

            var subscription = {};
            subscription[user] = obj;
            chrome.storage.sync.set(subscription);
        }
    })
}

window.onload = function() {
    var ul = document.getElementById('subscriptionsList');
    var total = document.getElementById('total');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    chrome.storage.sync.get(null, function(items) {
        var allKeys = Object.keys(items);
        total.text = allKeys.length - 1;


        for (var i = allKeys.length - 1; i >= 0; i--) {
            var userItem = items[allKeys[i]];
            userItem.user = allKeys[i];

                var listItem = document.createElement("li");
                listItem.id = userItem.user;
                listItem.className = 'item';

                item = document.createElement("a");
                item.className = 'itemRef';
                item.href = userItem.ref;

                if (userItem.newPosts && userItem.newPosts.length) {

                    item.newPosts = userItem.newPosts;
                    item.user = userItem.user;
                    listItem.className += ' haveNewPosts'
                    listItem.className += ' np' + userItem.newPosts.length;
                    item.onclick = function(e) {

                        removeNewPosts(this.user);

                        this.newPosts.forEach(function(postId) {
                            chrome.tabs.create({
                                active: true,
                                url: 'http://9gag.com/gag/' + postId
                            });
                        });
                    };
                } else {
                    item.onclick = function(e) {
                        chrome.tabs.create({
                            active: true,
                            url: e.target.closest('.itemRef').href + '/posts'
                        });
                    };
                }

                listItem.appendChild(item);

                var itemContent = document.createElement("div");
                itemContent.className = 'itemContent';
                item.appendChild(itemContent);

                var user = document.createElement("div");
                user.className = 'user';
                itemContent.appendChild(user);

                var img = document.createElement("img");
                img.className = 'avatar';
                img.src = userItem.avatar;
                user.appendChild(img);

                var date = document.createElement("div");
                date.className = 'date';
                itemContent.appendChild(date);

                var dateA = document.createElement("a");
                dateA.text = getTextAgo(new Date(userItem.date));
                date.appendChild(dateA);

                var remove = document.createElement("a");
                remove.className = 'remove';

                remove.onclick = function(e) {
                    var id = e.target.parentElement.id;
                    chrome.storage.sync.remove(id);
                    e.target.parentElement.remove();
                    var total = document.getElementById('total');
                    var count = parseInt(total.text);        
                                total.text= count -1;
                }
                listItem.appendChild(remove);

                var a = document.createElement("a");
                a.text = userItem.user;
                user.appendChild(a);

                if (userItem.newPosts && userItem.newPosts.length && ul.firstChild) {
                    ul.insertBefore(listItem, ul.firstChild);
                } else {
                    ul.appendChild(listItem);
                }
            }        
    });
}