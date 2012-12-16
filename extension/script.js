var enhelper_navigation_app = "waze";

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

var openUrl = chrome.contextMenus.create({
    "title": "Open URL on Mobile...", 
    "contexts":["page", "selection", "link", "image"],
    "onclick": genericOnClick
});

function sendGcmRequest(data) {
    var req = new XMLHttpRequest();
    req.open("POST", "https://android.googleapis.com/gcm/send", true);

    var basicData = {
        "app": enhelper_navigation_app
    };
    
    if (data.match("^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$")) {
        basicData["coord"] = data;
    } else {
        basicData["name"] = data;
    }

    var data = JSON.stringify({
        "data": basicData,
        "registration_ids": [
            "APA91bHg0SuPElQnRhia0S1zztFLr322L2hfyC5xbTMXRPKrKUQ0b9ExwhTlnhoif24ibJLtKcz-Tp-rAlsXdXjoWDMutTmBcPxCrXhJOzWpSOtVQmLsXrMj9mtQv-F0_GoQYC8stLFnUiwsLAhQ9Ih-Z-hLNYfNpQ"
        ]
    });

    req.setRequestHeader("Content-type", "application/json");
    req.setRequestHeader("Authorization", "key=AIzaSyAtlVSSkqqWCaosXFJhqz2pI4Cc-p6n7lM");
    req.send(data);

    
    req.onreadystatechange = function() 
    { 
        // If the request completed, close the extension popup
        if (req.readyState == 4)
            if (req.status != 200) alert("Failed sending!");
    };

    return false;
}

function navigateOnClick(info, tab) {
    sendGcmRequest(info.selectionText);
}

// Create a parent item and two children.
var parent = chrome.contextMenus.create({
    "title": "Navigate to %s...", 
    "contexts":["selection"],
    "onclick": navigateOnClick
});
/* var child1 = chrome.contextMenus.create(
  {"title": "Coordinates", "parentId": parent, "onclick": genericOnClick, "contexts": ["selection"]});
var child2 = chrome.contextMenus.create(
  {"title": "Name", "parentId": parent, "onclick": genericOnClick, "contexts": ["selection"]}); */

// Create some radio items.
function radioOnClick(info, tab) {
    console.log(info.value);
}
var app_parent = chrome.contextMenus.create({"title": "Navigate with...", "contexts": ["all", "selection"]});
var radio1 = chrome.contextMenus.create({"title": "Waze", "type": "radio", 
                                         "onclick":radioOnClick, "parentId": app_parent, "contexts": ["all"]});
var radio2 = chrome.contextMenus.create({"title": "Google Maps", "type": "radio", 
                                         "onclick":radioOnClick, "parentId": app_parent, "contexts": ["all"]});
