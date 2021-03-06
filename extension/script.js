var enhelper_navigation_app = "waze";

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

function prepareDataNavigate(data) {
    var basicData = {};
    basicData["app"] = enhelper_navigation_app;
    data = data.trim();
    
    if (data.match(/^(\-?\d+(\.\d+)?),?\s*(\-?\d+(\.\d+)?)$/)) {
        if (null == data.match(/,/)) {
            data = data.replace(/\s/g, ',');
        }
        basicData["coord"] = data.replace(/\s/g, '');
        console.log(data);
    } else {
        basicData["name"] = data;
    }

    return basicData;    
}

function getDataFile() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://vps.studiosh.com/en/basic.php", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      window.enHelperData = eval("(" + xhr.responseText + ")");
    }
  }
  xhr.send();
}

function sendGcmRequest(type, data) {
    var req = new XMLHttpRequest();
    req.open("POST", "https://android.googleapis.com/gcm/send", true);

    var ids = window.enHelperData.ids;
    
    var basicData;
    switch(type) {
        case "navigate":
            basicData = prepareDataNavigate(data);
            break;
        case "open":
            basicData = {
                "app": "open",
                "url": data
            }
            break;
        case "copy":
            basicData = {
                "app": "copy",
                "clipboard": data
            }
            break;            
        case "call":
            basicData = {
                "app": "call",
                "number": data
            }
            
            ids = window.enHelperData.phone;
            
            break;
    }
        
    var data = JSON.stringify({
        "data": basicData,
        "registration_ids": ids
    });

    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", "key=AIzaSyAtlVSSkqqWCaosXFJhqz2pI4Cc-p6n7lM");
    req.send(data);

    var notification = webkitNotifications.createNotification("enicon.png", "EnHelper", "Sending request to phone...");
    notification.show();

    var timeout = setTimeout(function(){
        notification.close();
    }, '10000');
    
    req.onreadystatechange = function() 
    { 
        // If the request completed, close the extension popup
        if (req.readyState == 4)
            clearTimeout(timeout);
            notification.close();
            if (req.status == 200) {
                notification = webkitNotifications.createNotification("enicon.png", "EnHelper", "Request to phone sent.");
                notification.show();
                timeout = setTimeout(function(){
                    notification.close();
                }, '10000');
            } else {
                webkitNotifications.createNotification("enicon.png", "EnHelper", "Failed sending to phone!").show();
            }
    };

    return false;
}

// Define all menu items

// Open a remote URL on mobile
chrome.contextMenus.create({
    "title": "Reload data...", 
    "contexts":["page"],
    "onclick": function (info, tab) {
      getDataFile();
    }
});

// Open a remote URL on mobile
chrome.contextMenus.create({
    "title": "Open page on mobile...", 
    "contexts":["page", "selection", "link", "image"],
    "onclick": function (info, tab) {
        sendGcmRequest("open", info.pageUrl);
    }
});

// Open a remote image on mobile
chrome.contextMenus.create({
    "title": "Open image on Mobile...", 
    "contexts":["image"],
    "onclick": function (info, tab) {
        sendGcmRequest("open", info.srcUrl);
    }
});

// Create a parent item and two children.
chrome.contextMenus.create({
    "title": "Navigate to %s...", 
    "contexts":["selection"],
    "onclick": function(info, tab) {
        sendGcmRequest("navigate", info.selectionText);
    }
});

// Create a parent item and two children.
chrome.contextMenus.create({
    "title": "Call %s...", 
    "contexts":["selection"],
    "onclick": function(info, tab) {
        sendGcmRequest("call", info.selectionText);
    }
});

// Create a parent item and two children.
chrome.contextMenus.create({
    "title": "Copy %s to mobile...", 
    "contexts":["selection"],
    "onclick": function(info, tab) {
        sendGcmRequest("copy", info.selectionText);
    }
});


// Create a parent item and two children.
chrome.contextMenus.create({
    "title": "TinEye Image...", 
    "contexts":["image"],
    "onclick": function(info, tab) {
        chrome.tabs.create({"url": "http://www.tineye.com/search?url=" + info.srcUrl});
    }
});

// Create some radio items.
getDataFile();
function radioOnClick(info, tab) {
    console.log(info.value);
}
var app_parent = chrome.contextMenus.create({"title": "Navigate with...", "contexts": ["all", "selection"]});
var radio1 = chrome.contextMenus.create({"title": "Waze", "type": "radio", 
                                         "onclick":radioOnClick, "parentId": app_parent, "contexts": ["all"]});
var radio2 = chrome.contextMenus.create({"title": "Google Maps", "type": "radio", 
                                         "onclick":radioOnClick, "parentId": app_parent, "contexts": ["all"]});
