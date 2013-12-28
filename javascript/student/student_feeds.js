/**
 * 
 * Todo: translate into feeds language
 * @type String
 */
var editFeeds;
var foundFeeds;
var feedChanges;

function feedLoader() {
    if (numFeeds > 0) {
        $("<div id='all_feeds' onclick='showFeeds(0);' style='position:absolute;left:0px;top:0px;right:0px;height:50px;background-color:whitesmoke;text-align:center;cursor:pointer;'>"
                + "<div style='position:absolute;top:5px;line-height:0px;left:10px;height:50px;'>"
                + "<p class='create_class_labels'>All Feeds</p></div></div>"
                ).appendTo("#feed_container");

        var topTracker = 52;
        for (var i = 0; i < numFeeds; i++) {
            var sqlId = feedData[i]['id'];
            var feedName = feedData[i]['name'];
            var teacherName = feedData[i]['owner_name'];
            var website = feedData[i]['website'];

            $("<div class='left_feeds' id='feed_" + sqlId + "' onclick='showFeeds(" + sqlId + ");' style='cursor:pointer;position:absolute;left:0px;top:" + topTracker + "px;height:50px;right:0px;background-color:whitesmoke;'>"
                    + "<div style='position:absolute;left:5px;top:-5px;right:30px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:20px;'>" + feedName + "</p></div>"
                    + "<div style='position:absolute;left:5px;top:20px;right:5px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:14px;'>" + teacherName + "</p></div>"
                    + "<a id='feedlink_" + i + "' href='" + website + "'><img id='feedimg_" + i + "' src ='./images/web_icon.png' width='20px' height='20px' title='Click to visit feed website' style='position:absolute;top:5px;right:5px;width:20px;height:20px;cursor:pointer;'/></a></div>"
                    ).appendTo("#feed_container");
                        
                        if (website == "http://") {
                            $("#feedlink_" + i).remove();
                            $("#feedimg_" + i).remove();
                        }

                    topTracker += 52;           
        }
        showFeeds(0);          
    }
}

function showFeeds(feedId) {
    //Clear stuffs
    $("#post_container").empty();
    $("#all_feeds").css("backgroundColor", "whitesmoke");
    for (var i = 0; i < numFeeds; i ++) {
        $("#feed_" + feedData[i]['id']).css("backgroundColor", "whitesmoke");
    }
    
    if (feedId == 0) {
        //Load most rescent post from each feed
        //Header
        $("<div style='position:absolute;left:0px;top:0px;right:0px;height:30px;background-color:whitesmoke;'>"
                + "<div style='position:absolute;left:5px;top:-5px;height:25px;right:0px;line-height:0px;'>"
                + "<p class='create_class_labels' style='left:10px;font-size:20px;'>Most Recent Posts</p></div>"
                + "<div style='position:absolute;left:190px;right:10px;top:14px;height:1px;background-color:black;'></div></div>"
                ).appendTo("#post_container");
        var toggleTop = 32;
        //Add most recent assignment of all classes
        for (var i = 0; i < allFeedsData['posts'].length; i ++) {
            var otherFeedId = allFeedsData['posts'][i]['feed_id'];
            var name = feedData[feedSQLtoIndex(otherFeedId)]['name'];
            var message = allFeedsData['posts'][i]['message'];
            var date = allFeedsData['posts'][i]['date'];
            var fileName = allFeedsData['posts'][i]['file_title'];
            var file = allFeedsData['posts'][i]['file'];
            var newDate = getDateFormat(date.substring(5, 7) + "/" + date.substring(8, 11));
            //Time conversion
            var comps = date.split(" ")[1].split(":");
            var sign = "am";
            var hours = comps[0];
            var minutes = comps[1];
            if (hours > 12) {
                hours = hours - 12;
                sign = "pm";
            } else if (hours == 0) {
                hours = 12;
            } else if (parseInt(hours) < 10) {
                hours = hours.substring(1,2);
            }
            var time = hours + ":" + minutes + " " + sign;
            
            $("<div id='post_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                    + "<div style='position:absolute;left:5px;top:-3px;height:30px;width:220px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:16px;'><b>" + name + "</b></p></div>"
                    + "<div style='position:absolute;right:5px;top:-3px;height:30px;width:220px;line-height:0px;text-align:right;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:16px;'>" + newDate + " <span style='font-size:12px'> " + time + "</span></p></div>"
                    + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                    + "<div id = 'post_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileName + "</span></p></div></div>"
                    ).appendTo("#post_container");
            toggleTop += $("#post_" + i).height() + 22;
            
            if (file == "") {
                $("#post_file_" + i).empty();
                $("#post_" + i).css("paddingBottom", "0px");
                toggleTop -= 10;
            }
        }
        
        $("#all_feeds").css("backgroundColor", highlightColor);
        //Traslado
    } else {
        //Header
        var indexId = feedSQLtoIndex(feedId);
        //var indexId = classId;
        $("<div style='position:absolute;left:0px;top:0px;right:0px;height:30px;background-color:whitesmoke;'>"
                + "<div id='header_title' style='position:absolute;left:5px;top:-5px;height:25px;line-height:0px;'>"
                + "<p class='create_class_labels' style='left:10px;font-size:20px;'>" + feedData[indexId]['name'] + "</p></div>"
                + "<div id='header_line' style='position:absolute;left:240px;right:10px;top:14px;height:1px;background-color:black;'></div></div>"
                ).appendTo("#post_container");
        $("#header_line").css("left", $("#header_title").css("width"));
        $("#header_line").css("left", "+=20px");
        var toggleTop = 32;
        //Check no assignments
        if (feedData[indexId]['posts'].length == 0) {
            $("<div id='no_posts_sign' style='text-align:center;position:absolute;left:130px;right:130px;line-height:0px;top:200px;height:30px;background-color:white;opacity:0;border-radius:10px;'>"
                    + "<p style='font-size:15px' class='create_class_labels'>No Posts</p></div>").appendTo("#post_container");
            setTimeout(function() {
                $("#no_posts_sign").animate({opacity: ".7"}, {queue: false, duration: 300});
            }, 100);
        } else {
            for (var i = 0; i < feedData[indexId]['posts'].length; i ++) {
                var message = feedData[indexId]['posts'][i]['message'];
                var date = feedData[indexId]['posts'][i]['date'];
                var fileName = feedData[indexId]['posts'][i]['file_title'];
                var file = feedData[indexId]['posts'][i]['file'];
                var newDate = getDateFormat(date.substring(5, 7) + "/" + date.substring(8, 11));
                //Time conversion
                var comps = date.split(" ")[1].split(":");
                var sign = "am";
                var hours = comps[0];
                var minutes = comps[1];
                if (hours > 12) {
                    hours = hours - 12;
                    sign = "pm";
                } else if (hours == 0) {
                    hours = 12;
                } else if (hours < 10) {
                    hours = hours.substring(1,2);
                }
                var time = hours + ":" + minutes + " " + sign;

                $("<div id='post_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                        + "<div style='position:absolute;left:5px;top:-3px;height:30px;width:220px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                        + "<p class='create_class_labels' style='font-size:16px;'><b>" + newDate + "</b> <span style='font-size:12px'> " + time + "</span></p></div>"
                        + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                        + "<div id = 'post_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                        + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileName + "</span></p></div></div>"
                        ).appendTo("#post_container");

                toggleTop += $("#post_" + i).height() + 22;

                if (file == "") {
                    $("#post_file_" + i).empty();
                    $("#post_" + i).css("paddingBottom", "0px");
                    toggleTop -= 10;
                }

            }
            
            //Check if there's more posts available
            if (feedData[indexId]['loaded_to'] < feedData[indexId]['num_posts']) {
                $("<div title='Click to load older posts' id='more_feeds_" + indexId + "' onclick='feedLoadMorePosts(" + indexId + ");' onmouseover='$(this).css(&#39;backgroundColor&#39;, &#39;837E7C&#39;);' onmouseout='$(this).css(&#39;backgroundColor&#39;, &#39;silver&#39;);' style='cursor:pointer;background-color:silver;position:absolute;left:0px;right:0px;top:"
                        + toggleTop + ";line-height:0px;text-align:center;height:30px;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>Load more posts</p></div>").appendTo("#post_container");
            }
        }
        
        $("#feed_" + feedId).css("backgroundColor", highlightColor);
    }
}

function functionEditFeeds() {
    feedChanges = false;
    $("#feed_selector_left_panel").empty();
    $("#feed_selector_right_panel").empty();
    $("#feed_selector_dimmer").css("zIndex", "0");
    $("#feed_selector_load_indicator").css("zIndex", "0");
    
    $("#feed_selector").css("left", "-710px");
    $("#feed_search_query").val("");
    $("#feed_selector").animate({left: "50px"}, {queue: false, duration: 200});
    dim();
    
    $("#feed_left_message").css("display", "inline");
    
    var tops = 0;
    editFeeds = new Array();
    foundFeeds = new Array();
    
    for (var i = 0; i < numFeeds; i ++) {
        var id = feedData[i]['id'];
        var name = feedData[i]['name'];
        var ownerName = feedData[i]['owner_name'];
        var description = feedData[i]['description'];

        var entry = {
            id: id,
            name: name
        };
        editFeeds.push(entry);
        
        if (description === "")
            description = "- No description -";

        $("<div id='edit_feed_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;height:100px;background-color:whitesmoke'>"
                + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
                + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + name + "</p></div>"
                + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
                + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + ownerName + "</p></div>"
                + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>" + description + "</p></div>"
                + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
                + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='feedUnsubscribe(" + id + ");' style='font-size:11px;'><b>Unsubscribe</b></p></div></div>"
                ).appendTo("#feed_selector_right_panel");

        // Post-creation edits
        if (description == "- No description -") {
            $("#edit_feed_" + id).css("height", "70px");
            tops -= 30;
        }
        tops += 102;
    }
}

function exitEditFeeds() {
    if (feedChanges && !confirm("Exit without saving changes?"))
        return;
    
    $("#feed_selector").animate({left: "810px"}, {queue: false, duration: 200});
    editFeeds.length = 0;
    foundFeeds.length = 0;
    undim();        
}

function searchFeeds() {
    
    var value = $("#feed_search_query").val();
    
    if (value == "") {
        $("#feed_search_query").css("backgroundColor", "red");
        setTimeout(function() {
            $("#feed_search_query").css("backgroundColor", "white");
            setTimeout(function() {
                $("#feed_search_query").css("backgroundColor", "red");
                setTimeout(function() {
                    $("#feed_search_query").css("backgroundColor", "white");
                }, 150);
            }, 150);
        }, 150);
        return;
    }
    
    $("#feed_left_message").css("display", "none");
    $("#feed_left_loader").css("display", "inline");
    $("#feed_selector_left_panel").empty();
    
    foundFeeds.length = 0;
    
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            if (text == "error") {
                 notify("An error occured.", 150);
                $("#feed_left_loader").css("display", "none");
                $("#feed_left_message").css("display", "inline");
                $("#feed_left_message_text").html("An error occured");
            }
            else if (text == "none") { // no classes found
                $("#feed_left_loader").css("display", "none");
                $("#feed_left_message").css("display", "inline");
                $("#feed_left_message_text").html("No feeds found");
            } else {
                //Parse the XML
                $("#feed_left_loader").css("display", "none");
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlhttp.responseText);
                }
                var x = xmlDoc.documentElement.childNodes;
                var tops = 0;
                for (var h = 0; h < x.length; h++) {

                    var entry = x[h].childNodes;
                    var id = entry[0].childNodes[0].nodeValue;
                    
                    if (feedArrayContains(editFeeds, id)) 
                        continue;
                    
                    var name = entry[1].childNodes[0].nodeValue;
                    var ownerName = entry[2].childNodes[0].nodeValue;
                    var description = entry[3].childNodes[0].nodeValue;
                    if (description == "none")
                        description = "";
                    
                    //Add to foundClasses
                    var entry = {
                        id: id,
                        name: name,
                        owner_name: ownerName,
                        description: description,
                    };
                    foundFeeds.push(entry);
                    
                    if (description === "")
                        description = "- No description -";

                    $("<div id='new_feed_" + id + "' style='position:absolute;z-index:1;left:0px;top:" + tops + "px;right:0px;height:100px;background-color:whitesmoke'>"
                            + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
                            + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + name + "</p></div>"
                            + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
                            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + ownerName + "</p></div>"
                            + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
                            + "<p class='create_class_labels' style='font-size:13px;'>" + description + "</p></div>"
                            + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
                            + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='feedSubscribe(" + id + ");' style='font-size:11px;'><b>Subscribe</b></p></div></div>"
                            ).appendTo("#feed_selector_left_panel");

                    // Post-creation edits
                    if (description == "- No description -") {
                        $("#new_feed_" + id).css("height", "70px");
                        tops -= 30;
                    }
                    tops += 102;
                }
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/searchFeeds.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("search=" + value);
}

function feedUnsubscribe(id) {
    feedChanges = true;
    var indexId = editFeedsSQLtoIndex(id);
    var heightChange = $("#edit_feed_" + id).css("height");
    $("#edit_feed_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#edit_feed_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < editFeeds.length; i++) {
        if (i == indexId)
            continue;
        $("#edit_feed_" + editFeeds[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#edit_feed_" + editFeeds[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    
    setTimeout(function() {
        $("#edit_feed_" + id).remove();
    }, 200);
    
    
    //Remove from editClasses
    for (var i = 0; i < editFeeds.length; i ++) {
        if (editFeeds[i]['id'] == id)
            editFeeds.splice(i, 1);
    }
}

function feedSubscribe(id) {
    feedChanges = true;
    var indexId = foundFeedsSQLtoIndex(id);
    
    //Get data
    var addId = foundFeeds[indexId]['id'];
    var addName = foundFeeds[indexId]['name'];
    var addOwnerName = foundFeeds[indexId]['owner_name'];
    var addDescription = foundFeeds[indexId]['description'];
    
    var className = addName.toLowerCase();
    var idAfter = -1;
    for (var i = 0; i < editFeeds.length; i ++) {
        var newName = editFeeds[i]['name'].toLowerCase();
        if (className > newName) {
            idAfter = editFeeds[i]['id'];
        }
    }
    
    
    //Animate remove
    var heightChange = $("#new_feed_" + id).css("height");
    $("#new_feed_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#new_feed_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < foundFeeds.length; i++) {
        $("#new_feed_" + foundFeeds[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#new_feed_" + foundFeeds[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    
    setTimeout(function() {
        $("#new_feed_" + id).remove();
    }, 100);
    
    var entry = {
        id: addId,
        name: addName
    };


    //Add to editClasses
    if (idAfter == -1)
        editFeeds.splice(0, 0, entry);
    else
        editFeeds.splice(editFeedsSQLtoIndex(idAfter) + 1, 0, entry);

    //Remove from foundClasses
    for (var i = 0; i < foundFeeds.length; i ++) {
        if (foundFeeds[i]['id'] == addId)
            foundFeeds.splice(i, 1);
    }
    
    //Animate the classes making room for new one
    if (idAfter == -1) {
        //First new class, slide up all classes
        for (var i = 0; i < editFeeds.length; i ++) {
            $("#edit_feed_" + editFeeds[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_feed_" + editFeeds[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    } else {
        var index = editFeedsSQLtoIndex(idAfter) + 1; // Plus one for after
        for (var i = index; i < editFeeds.length; i ++) {
            $("#edit_feed_" + editFeeds[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_feed_" + editFeeds[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    }

    if (addDescription === "")
        addDescription = "- No description -";

    $("<div id='edit_feed_" + addId + "' style='position:absolute;left:0px;top:0px;right:0px;height:100px;background-color:whitesmoke'>"
            + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
            + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + addName + "</p></div>"
            + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + addOwnerName + "</p></div>"
            + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
            + "<p class='create_class_labels' style='font-size:13px;'>" + addDescription + "</p></div>"
            + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
            + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='feedUnsubscribe(" + addId + ");' style='font-size:11px;'><b>Unsubscribe</b></p></div></div>"
            ).appendTo("#feed_selector_right_panel");

    // Post-creation edits
    if (addDescription == "- No description -")
        $("#edit_feed_" + addId).css("height", "70px");

    if (idAfter != -1) {
        var top1 = parseInt($("#edit_feed_" + idAfter).css("height").replace("px", ""));
        var top2 = parseInt($("#edit_feed_" + idAfter).css("top").replace("px", ""));
        var top3 = top1 + top2 + 2;//2 for border
        $("#edit_feed_" + addId).css("top", top3 + "px");
    }
   
    //Animate new div
    $("#edit_feed_" + addId).css("right", "+=335px");
    $("#edit_feed_" + addId).css("opacity", "0");
    $("#edit_feed_" + addId).animate({right: "0px"}, {queue: false, duration: 200});
    $("#edit_feed_" + addId).animate({opacity: "1"}, {queue: false, duration: 200});
    
}

function saveFeedChanges() {
    $("#feed_selector_dimmer").css("display", "inline");
    $("#feed_selector_dimmer").css("zIndex", "2");
    $("#feed_selector_dimmer").animate({opacity: ".4"}, {queue: false, duration: 200});
    $("#feed_selector_load_indicator").css("display", "inline");
    $("#feed_selector_load_indicator").css("zIndex", "2");
    $("#feed_selector_load_indicator").animate({opacity: "1"}, {queue: false, duration: 200});
    
    //Get all classes as string
    var feedsString = "";
    for (var i = 0; i < editFeeds.length; i ++) {
        feedsString += editFeeds[i]['id'] + "_";
    }
    
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            $("#feed_selector_dimmer").css("display", "none");
            $("#feed_selector_dimmer").css("display", "none");
            $("#feed_selector_load_indicator").css("opacity", "0");
            $("#feed_selector_load_indicator").css("opacity", "0");
            
            //For first class subscriptions
            $("#no_feed_indicator").css("display", "none");
            $("#no_feed_indicator").css("opacity", "0");

            var text = xmlhttp.responseText;
            
            if (text == "none") {
                feedChanges = false;
                
                feedData.length = 0;
                allFeedsData.length = 0;
                
                exitEditFeeds();
                notify("Feeds updated.", 200);
                
                $(".left_feeds").remove();
                $("#post_container").empty();
                $("#all_feeds").remove();
                
                setTimeout(function() {
                    $("#no_feed_indicator").css("display", "inline");
                    $("#no_feed_indicator").animate({opacity: ".7"}, {queue: false, duration: 200});
                }, 200);
            } else if (text == "error") {
                notify("An error occured.", 200);
            } else {
                //Parse XML
                feedChanges = false;
                exitEditFeeds();
                notify("Feeds updated.", 200);
                $(".left_feeds").remove();
                $("#post_container").empty();
                $("#all_feeds").remove();
                //BEGIN PARSE
                feedData.length = 0;
                allFeedsData.length = 0;
                
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlhttp.responseText);
                }
                
                var x = xmlDoc.documentElement.childNodes;
                var main = x[0].childNodes;
                var summary = x[1].childNodes;
                
                //Get the main feeds
                numFeeds = main.length;
                for (var h = 0; h < main.length; h++) {
                    var feed = main[h].childNodes;
                    var feedId = feed[0].childNodes[0].nodeValue;
                    var name = feed[1].childNodes[0].nodeValue;
                    var ownerName = feed[2].childNodes[0].nodeValue;
                    var description = feed[3].childNodes[0].nodeValue;
                    var website = feed[4].childNodes[0].nodeValue;
                    var numPosts = feed[5].childNodes[0].nodeValue;
                    var posts = feed[6].childNodes[0].nodeValue;
                    //Specials
                    if (description == "none")
                        description = "";
                    var postArray = new Array();
                    
                    if (posts == "none") {
                        //do nothing?
                    } else {
                        //Parse posts
                        var assignments = feed[6].childNodes;
                        for (var i = 0; i < assignments.length; i ++) {
                            var post = assignments[i].childNodes;
                            var postId = post[0].childNodes[0].nodeValue;
                            var date = post[1].childNodes[0].nodeValue;
                            var message = post[2].childNodes[0].nodeValue;
                            var file = post[3].childNodes[0].nodeValue;
                            var fileTitle = post[4].childNodes[0].nodeValue;

                            //Specials
                            if (file == "nofile")
                                file = "";
                            if (fileTitle == "nofile")
                                fileTitle = "";

                            var postEntry = {
                                id: postId,
                                date: date,
                                message: message,
                                file: file,
                                file_title: fileTitle
                            };
                            postArray.push(postEntry);
                        }
                    }
                    // Insert into loaded array
                    var dataEntry = {
                        id: feedId,
                        name: name,
                        owner_name: ownerName,
                        description: description,
                        website: website,
                        posts: postArray,
                        loaded_to: 15,
                        num_posts: numPosts
                    };
                    feedData.push(dataEntry);
                }
 
                var sumPostsArray = new Array();
                
                //Now do the sort of same for summary
                for (var h = 0; h < summary.length; h++) {
                    var feed = summary[h].childNodes;
                    var id = feed[0].childNodes[0].nodeValue;
                    var feedId = feed[1].childNodes[0].nodeValue;
                    var date = feed[2].childNodes[0].nodeValue;
                    var message = feed[3].childNodes[0].nodeValue;
                    var file = feed[4].childNodes[0].nodeValue;
                    var file_title = feed[5].childNodes[0].nodeValue;
                    if (file == "nofile") {
                        file = "";
                        file_title = "";
                    }
                    
                    var entry = {
                        id: id,
                        feed_id: feedId,
                        date: date,
                        message: message,
                        file: file,
                        file_title: file_title
                    };
                    
                    sumPostsArray.push(entry);
                }
                
                allFeedsData['loaded_to'] = 15;
                allFeedsData['num_posts'] = summary.length;
                allFeedsData['posts'] = sumPostsArray;

                //Call loader to refresh to the new feeds
                feedLoader();
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/feedSubscriptions.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("feeds=" + feedsString);
}

function feedLoadMorePosts(indexId) {
    var top = $("#more_feeds_" + indexId).css("top");
    $("#more_feeds_" + indexId).remove();
    
    $("<div id='more_feeds_" + indexId + "' style='cursor:pointer;background-color:#837E7C;position:absolute;left:0px;right:0px;top:"
          + top + ";text-align:center;height:30px;'><img src='images/loader.gif' height='25px' width='25px'></div>").appendTo("#post_container");
        
    //AJAX to get more as XML
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            if (text == "error") {
                //handle error
                notify("An error occured.", 250);
            } else {
                //Parse as XML
                $("#more_feeds_" + indexId).remove();
                if (window.DOMParser)
                {
                    parser = new DOMParser();
                    xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
                }
                else // Internet Explorer
                {
                    xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlhttp.responseText);
                }
                var x = xmlDoc.documentElement.childNodes;
                
                feedData[indexId]['loaded_to'] += x.length;
                
                var toggleTop = parseInt(top.replace("px", ""));
                var oldLength = feedData[indexId]['posts'].length;
                
                
                //HERE 
                //Reset class count
                for (var h = 0; h < x.length; h++) {
                    var entry = x[h].childNodes;
                    var id = entry[0].childNodes[0].nodeValue;
                    var date = entry[1].childNodes[0].nodeValue;
                    var time = entry[2].childNodes[0].nodeValue;
                    var message = entry[3].childNodes[0].nodeValue;
                    var file = entry[4].childNodes[0].nodeValue;
                    var fileTitle = entry[5].childNodes[0].nodeValue;
                    if (file == "nofile")
                        file = "";
                    if (fileTitle == "nofile")
                        file = "";
                    var postEntry = {
                        id: id,
                        date: date + " " + time,
                        message: message,
                        file: file,
                        file_title: fileTitle
                    };
                    feedData[indexId]['posts'].push(postEntry);
                    var newDate = getDateFormat(date.substring(5, 7) + "/" + date.substring(8, 11));
                    var comps = time.split(":");
                    var sign = "am";
                    var hours = comps[0];
                    var minutes = comps[1];
                    if (hours > 12) {
                        hours = hours - 12;
                        sign = "pm";
                    } else if (hours == 0) {
                        hours = 12;
                    } else if (hours < 10) {
                        hours = hours.substring(1, 2);
                    }
                    time = hours + ":" + minutes + " " + sign;
                    var i = h + oldLength;
                    $("<div id='post_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                            + "<div style='position:absolute;left:5px;top:-3px;height:30px;width:220px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels' style='font-size:16px;'><b>" + newDate + "</b> <span style='font-size:12px'> " + time + "</span></p></div>"
                            + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                            + "<div id = 'post_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span></p></div></div>"
                     ).appendTo("#post_container");
                     toggleTop += $("#post_" + i).height() + 22;
                    
                    if (file == "") {
                        $("#post_file_" + i).empty();
                        $("#post_" + i).css("paddingBottom", "0px");
                        toggleTop -= 10;
                    }
                }
                //Check for more and place loader if true
                if (feedData[indexId]['loaded_to'] < feedData[indexId]['num_posts']) {
                $("<div title='Click to load older post' id='more_feeds_" + indexId + "' onclick='loadMorePosts(" + indexId + ");' onmouseover='$(this).css(&#39;backgroundColor&#39;, &#39;837E7C&#39;);' onmouseout='$(this).css(&#39;backgroundColor&#39;, &#39;silver&#39;);' style='cursor:pointer;background-color:silver;position:absolute;left:0px;right:0px;top:"
                        + toggleTop + ";line-height:0px;text-align:center;height:30px;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>Load more assignments</p></div>").appendTo("#post_container");
                }
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/getMorePosts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("feedId=" + feedData[indexId]['id'] + "&start=" + feedData[indexId]['loaded_to']);
}

function feedSQLtoIndex(SQLid) {
    for (var i = 0; i < feedData.length; i++)
    {
        if (feedData[i]['id'] == SQLid)
        {
            return i;
        }
    }
    alert("error" + SQLid);
}

function foundFeedsSQLtoIndex(SQLid) {
    for (var i = 0; i < foundFeeds.length; i++)
    {
        if (foundFeeds[i]['id'] == SQLid)
        {
            return i;
        }
    }
}

function editFeedsSQLtoIndex(SQLid) {
    for (var i = 0; i < editFeeds.length; i++)
    {
        if (editFeeds[i]['id'] == SQLid)
        {
            return i;
        }
    }
}
// Not for general use, use only with edit feeds
function feedArrayContains(array, value) {
    if (array.length === 0)
        return false;
    else {
        for (var i = 0; i < array.length; i ++) {
            if (array[i]['id'] == value)
                return true;
        }
    }
    return false;
}
