function getTextAgo(a){var b=Date.UTC(a.getFullYear(),a.getMonth(),a.getDate()),c=new Date,d=Date.UTC(c.getFullYear(),c.getMonth(),c.getDate()),e=Math.floor((d-b)/_MS_PER_DAY);return e<1?"Today":e<2?"Yesterday":e+" days ago"}var _MS_PER_DAY=864e5,find=function(a,b){for(var c=!1,d=0;d<a.length;d++)if(a[d].user==b){c=a[d];break}return c},removeNewPosts=function(a){chrome.storage.local.get(a,function(b){var c=Object.keys(b),d=b[c[0]];if(d&&d.user){d.newPosts=[];var e={};e[a]=d,chrome.storage.local.set(e)}})};window.onload=function(){var a=document.getElementById("subscriptionsList"),b=document.getElementById("total"),c=document.getElementById("filter");for(c.onkeyup=function(){for(var a=this.value.toUpperCase(),b=document.getElementsByTagName("li"),c=0;c<b.length;c++){var d=b[c].id;d.toUpperCase().indexOf(a)!=-1?b[c].style.display="list-item":b[c].style.display="none"}};a.firstChild;)a.removeChild(a.firstChild);chrome.storage.local.get(null,function(c){var d=Object.keys(c);b.text=d.length-1;for(var e=d.length-1;e>=0;e--){var f=c[d[e]];f.user=d[e];var g=document.createElement("li");g.id=f.user,g.className="item",item=document.createElement("a"),item.className="itemRef",item.href=f.ref,f.newPosts&&f.newPosts.length?(item.newPosts=f.newPosts,item.user=f.user,g.className+=" haveNewPosts",g.className+=" np"+(f.newPosts.length>9?10:f.newPosts.length),item.onclick=function(a){removeNewPosts(this.user),this.newPosts.forEach(function(a){chrome.tabs.create({active:!0,url:"http://9gag.com/gag/"+a})})}):item.onclick=function(a){chrome.tabs.create({active:!0,url:a.target.closest(".itemRef").href+"/posts"})},g.appendChild(item);var h=document.createElement("div");h.className="itemContent",item.appendChild(h);var i=document.createElement("div");i.className="user",h.appendChild(i);var j=document.createElement("img");j.className="avatar",j.src=f.avatar,i.appendChild(j);var k=document.createElement("div");k.className="date",h.appendChild(k);var l=document.createElement("a");l.text=getTextAgo(new Date(f.date)),k.appendChild(l);var m=document.createElement("a");m.className="remove",m.onclick=function(a){var b=a.target.parentElement.id;chrome.storage.local.remove(b),a.target.parentElement.remove();var c=document.getElementById("total"),d=parseInt(c.text);c.text=d-1},g.appendChild(m);var n=document.createElement("a");n.text=f.user,n.className="userName",i.appendChild(n),f.newPosts&&f.newPosts.length&&a.firstChild?a.insertBefore(g,a.firstChild):a.appendChild(g)}})};