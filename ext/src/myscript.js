var opId;
var currOPRef;
var opIsSetted = false;
var currOPdiv;
var searchDiv;
var currOP;
var currHref;
var opPostToScrollCount = 0;

var subcribeBtn = document.createElement("a");
subcribeBtn.className = 'reply subcribe';
subcribeBtn.text = 'Subcribe';

var extensionId = document.getElementById('9gagAwersome').getAttribute("extensionId");

(function() {
    var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function(method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function(postData) {
        this.addEventListener('load', function() {

            if (!opId && this.responseURL.indexOf('comment-cdn.9gag.com') > 0) {
                var resp = JSON.parse(this.responseText);
                opId = resp.payload.opUserId;
                if (!opId) {
                    opId = 'Admin post'
                    var op = document.getElementById('op');
                    if (!op) {
                        var pan = $('.badge-entry-info.post-afterbar-meta>p');
                        op = document.createElement("a");
                        pan.append(op);
                        op.id = 'op';
                    }
                    op.text = opId;
                    var pan = $('.badge-entry-info.post-afterbar-meta>p');
                    pan.append(op);
                }
            }
        });
        return send.apply(this, arguments);
    };
})();

var loadAllComments = function(e) {
    if (!currOPdiv) {
        var loadButtons = $('.collapsed-comment>span');
        if (loadButtons.length > 0) {
            loadButtons.click();
            setTimeout(function() { loadAllComments(); }, 200);
        }
        var badgeLoadMore = $('.badge-load-more-trigger>span');
        if (badgeLoadMore.length > 0) {
            badgeLoadMore.click();
            setTimeout(function() { loadAllComments(); }, 200);
        }
    }
};

var subcribeToUser = function(e) {
    var t = $(e.target);
    var userElement = $('.username', t.parent().parent());

    var user = userElement.text();
    var userRef = userElement.attr('href');

    // Page context
    var message = { method: "subcribeToUser", 'user': user, 'ref': userRef, 'avatar': $('img', userElement.parent().parent().parent().parent())[0].src };
    var event = new CustomEvent("subcribeToUser", { detail: message });
    window.dispatchEvent(event);
};

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
};

var scrollToOP = function() {
    if (currOPdiv) {
        currOP = currOPdiv.text;
        currOPdiv.scrollIntoView(true);
        window.scrollBy(0, -100);

        var opPosts = document.getElementsByClassName('role-op');
        //;
        if (opPosts.length > opPostToScrollCount) {
            currOPdiv = opPosts[opPostToScrollCount].parentElement.parentElement.getElementsByClassName('username')[0];
            opPostToScrollCount++;
        } else {
            opPostToScrollCount = 0;
            currOPdiv = opPosts[opPostToScrollCount].parentElement.parentElement.getElementsByClassName('username')[0];
        }
    } else {
        loadAllComments();
    }
};

var findOP = function() {
    if (!currHref) {
        currHref = window.location.href;
    } else if (currHref !== window.location.href) {
        currHref = window.location.href;
        currOPdiv = null;
        opId = null;
        currOP = null;
        opIsSetted = false;
        if ($(searchDiv).hasClass('haveOP')) {
            $(searchDiv).removeClass('haveOP');
            searchDiv.className += " noOP";
            searchDiv.title = "No OP";
        }
    }
    if (!currOPdiv) {
        var opDiv = document.getElementsByClassName('role-op')[0];
        if (opDiv) {
            currOPdiv = opDiv.parentElement.parentElement.getElementsByClassName('username')[0];
            currOP = currOPdiv.text;
            currOPRef = currOPdiv.href;
            removeClass(searchDiv, 'noOP');
            searchDiv.className += " haveOP";
            searchDiv.title = "Scroll to OP";
        }
    }
};

var addButtons = function() {
    var actionPannels = $('.action.badge-action:not(.subscribable)');

    $.each(actionPannels, function(index, pan) {
        var node = subcribeBtn.cloneNode(true);
        node.onclick = subcribeToUser;
        pan.insertBefore(node, pan.childNodes[0]);
        pan.className += ' subscribable';
    });
    var op = document.getElementById('op');
    if (op && opIsSetted && currOP && op.text !== currOP) {
        op.text = currOP;
        op.href = currOPRef;
    } else if (!opIsSetted && currOP) {
        if (!op) {
            var pan = $('.badge-entry-info.post-afterbar-meta>p');
            op = document.createElement("a");
            pan.append(op);
            op.id = 'op';
        }
        op.text = currOP;
        op.href = currOPRef;
        opIsSetted = true;
    } else if (!opIsSetted && opId) {
        if (!op) {
            var pan = $('.badge-entry-info.post-afterbar-meta>p');
            op = document.createElement("a");
            pan.append(op);
            op.id = 'op';
        }
        op.text = opId;
        pan.append(op);
        opIsSetted = true;
    }
};

var highliteOP = function() {
    setTimeout(function() {
        findOP();
        addButtons();
        $('span:has(span.role-op)').closest('div.payload').css('background-color', 'rgba(0, 178, 130, 0.06)');
        highliteOP();
    }, 2000);
};

if (window.location.href.indexOf('http://9gag.com/gag') !== -1) {
    window.onload = function() {
        debugger;
        searchDiv = document.createElement("div");
        searchDiv.id = "findOP";
        searchDiv.onclick = scrollToOP;
        searchDiv.title = "Can't find OP";
        searchDiv.className += " noOP";
        document.body.insertBefore(searchDiv, document.body.childNodes[0]);

        var dickbutt = document.createElement("img");
        dickbutt.className = 'dickbutt';
        dickbutt.src = 'chrome-extension://' + extensionId + '/icons/dbutt.gif';
        searchDiv.appendChild(dickbutt);

        var travolta = document.createElement("img");
        travolta.className = 'travolta';
        travolta.src = 'chrome-extension://' + extensionId + '/icons/where.gif';
        searchDiv.appendChild(travolta);


        var textDiv = document.createElement("div");
        textDiv.id = "searchTooltip";
        textDiv.text = 'Load all comments!'
        searchDiv.appendChild(textDiv);

        findOP();
        highliteOP();
        addButtons();
    }
}
