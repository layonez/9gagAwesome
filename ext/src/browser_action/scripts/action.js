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

var find = function(array, val){
    var found = false;
    for(var i = 0; i < array.length; i++) {
        if (array[i].user == val) {
           found = array[i];
            break;
        }
    }
    return found;
};


window.onload = function() {
    var ul = document.getElementById('subscriptionsList');
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    chrome.storage.sync.get('subcribeList',function (obj) {
            if (obj && obj.subcribeList && obj.subcribeList.length) {
                for(var i = 0; i < obj.subcribeList.length; i++) {

                        userItem = obj.subcribeList[i]; 

                        xhr = new XMLHttpRequest(); 
                        xhr.open('GET', 'http://9gag.com/u/' + obj.subcribeList[i].user + '/posts');
                        xhr.setRequestHeader("Accept", 'application/json, text/javascript, */*; q=0.01');
                        xhr.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
                        xhr.send();

                        var listItem = document.createElement("li");
                        listItem.id = obj.subcribeList[i].user;
                        listItem.className = 'item';
                        
                        item = document.createElement("a");
                        item.className = 'itemRef';
                        item.href = obj.subcribeList[i].ref;

                        item.onclick = function (e) {
                            chrome.tabs.create({active: true, url: e.target.closest('.itemRef').href+'/posts'});
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

                        var remove = document.createElement("a");
                        remove.className = 'remove';

                        remove.onclick = function(e){
                            var id = e.target.parentElement.id;
                            e.target.parentElement.remove();

                            chrome.storage.sync.get('subcribeList',function (obj) {            
                                var user = find(obj.subcribeList, id);
                                obj.subcribeList.splice(obj.subcribeList.indexOf(user),1);
                                chrome.storage.sync.set({'subcribeList' : obj.subcribeList}); 
                            });
                        }
                        listItem.appendChild(remove);

                        var a = document.createElement("a");
                        a.text = obj.subcribeList[i].user;
                        user.appendChild(a);
                        
                        ul.appendChild(listItem);                   

                        xhr.onload = function() {
                            debugger;
                            setTimeout(function(){
    if (xhr.status === 200) {

                                ids = JSON.parse(xhr.response).ids;

                                item.onclick = function (e) {
                                    for (var j = ids.length - 1; j >= 0; j--) {
                                    if (userItem.posts.indexOf(ids[j]) === -1) {
                                        chrome.tabs.create({active: true, url: 'http://9gag.com/gag/' + ids[j]});
                                        }                                    
                                    }
                                }
                           }
                          else {
                            console.log(xhr)
                             // alert('Something went wrong :(.  9GAG Returned status of ' + xhr.status);
                           }
}, 2000);
                            
                        };              
                    
                        
                }
        }});
}






