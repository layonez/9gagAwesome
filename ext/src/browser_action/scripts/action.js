var _MS_PER_DAY = 1000 * 60 * 60 * 24;

function getTextAgo(a) {
  // Discard the time and time-zone information.
  var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  var b = new Date();
  var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  var days = Math.floor((utc2 - utc1) / _MS_PER_DAY);

  if (days < 1) {
    return 'Today';
  }else if (days < 2) {
    return 'Yesterday';
  }else{
    return days +' days ago';
  }
}


window.onload = function() {
    var ul = document.getElementById('subscriptionsList');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    chrome.storage.sync.get('subcribeList',function (obj) {
            if (obj && obj.subcribeList && obj.subcribeList.length) {
                for(var i = 0; i < obj.subcribeList.length; i++) {
                    
                        var listItem = document.createElement("li");
                        listItem.id = obj.subcribeList[i].user;
                        listItem.className = 'item';
                        
                        var item = document.createElement("a");
                        item.className = 'itemRef';
                        item.href = obj.subcribeList[i].ref;

                        var location = item.href + '/posts';
                        item.onclick = function () {
                                chrome.tabs.create({active: true, url: location});
                        };

                        listItem.appendChild(item);

                        var itemContent = document.createElement("div");
                        itemContent.className = 'itemContent';
                        item.appendChild(itemContent);

                        var user = document.createElement("div");
                        user.className = 'user';
                        itemContent.appendChild(user);

                        var img = document.createElement("img");
                        img.className = 'avatar';
                        img.src = obj.subcribeList[i].avatar;
                        user.appendChild(img);

                        var date = document.createElement("div");
                        date.className = 'date';
                        itemContent.appendChild(date);

                        var dateA = document.createElement("a");
                        dateA.text = getTextAgo(new Date(obj.subcribeList[i].date));
                        date.appendChild(dateA);

                        var a = document.createElement("a");
                        a.text = obj.subcribeList[i].user;
                        user.appendChild(a);
                        
                        ul.appendChild(listItem);                   
                }
        }});
}






