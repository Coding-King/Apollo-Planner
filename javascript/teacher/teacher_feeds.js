/*
 * Handles basic feed management
 */

function createFeed() {
    dim();
    $("#create_feed_panel").animate({left: "235px"}, {queue: false, duration: 200});
    document.create_feed_form.feed_name.focus();
    scrollToTop();
}

function createFeedExit() {
    $("#create_feed_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#create_feed_panel").css("left", "-350px");
            //Clear the form
            $("#feed_name").val("");
            $("#feed_add_info").val("");
            $("#feed_website").val("");
            $("#create_feed_button").text("Create Feed");
            $("#feed_name").css("backgroundColor", "white");
            $("#create_feed_form").attr('onsubmit', "checkCreateFeed(); return false;");
            $("#create_feed_label").text("New Feed");
        }});
    undim();
}

function checkCreateFeed() {
    var fields = {};
    fields['name'] = document.forms['create_feed_form']['feed_name'].value;
    fields['description'] = document.getElementById('feed_add_info').value;
    fields['website'] = document.forms['create_feed_form']['feed_website'].value;
    
    if (fields['name'] === "")
    {
        $("#feed_name").css("backgroundColor", "F70000");
        return false;
    }

    setCreateFeedLoading(true);
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            if (text === "already")
            {
                notify("This feed already exists.", 200);
            } else if (text === "error") {
                notify("An error occured while creating your feed.", 350);
            }
            else
            { // Exit and refresh page
                notify("Feed created.", 150);
                var arr = text.split(/_(.*)/);
                var newId = arr[0];

                createFeedExit();
                // add new class
                $("html, body").animate({scrollTop: $(document).height()}, {queue: false, duration: 200});
                $("#center_body").animate({height: "+=112px"}, {queue: false, duration: 200});
                $("#feeds_panel").animate({height: "+=112px"}, {queue: false, duration: 200});

                //Add the element
                var name = fields['name'];
                var description = fields['description'];
                var subscribers = "0";
                var thisId = arr[0];
                var website = arr[1];
                var toBeId = "feed_" + thisId;

                if (description == "")
                    description = "- No description -";
                
                var lowerClassName = name.toLowerCase();
                var notMoved = 0;
                for (var i = 0; i < feedData.length; i ++) {
                    var lowerCompareName = feedData[i]['name'].toLowerCase();
                    if (lowerClassName < lowerCompareName) {
                        $("#feed_" + feedData[i]['id']).animate({top: "+=112px"}, {queue: false, duration: 200});
                    } else {
                        notMoved ++;
                    }
                }
                
                var whereToAdd = (notMoved * 112) + 20;

                //String it together
                $("<div id='" + toBeId + "' onmouseover='$(&#39;#" + toBeId +
                        "&#39;).css(&#39;boxShadow&#39;, &#39;5px 5px 5px black&#39;);'"
                        + " onmouseout='$(&#39;#" + toBeId + "&#39;).css(&#39;boxShadow&#39;, &#39;none&#39;);'"
                        + " style='position:absolute;left:20px;width:740px;background-color:scrollbar;top:" + whereToAdd + "px;height:100px;'>"
                        + "<div style='position:absolute;left:5px;top:-5px;width:300px;line-height:0px;height:50px;text-align:left;white-space:nowrap;overflow:hidden;'>"
                        + "<p id='feed_name_" + thisId + "' class='class_label_font'>" + name + "</p></div>"
                        + "<div style='position:absolute;left:5px;top:35px;width:300px;height:65px;text-align:left;overflow:hidden;'>"
                        + "<p id='feed_description_" + thisId + "' style='color:black;font-family: &#39;Arial&#39;, Times, serif;font-size:14px;'>" + description + "</p></div>"
                        + "<div style='position:absolute;left:320px;top:5px;bottom:5px;width:1px;background-color:black;'></div>"
                        + "<button title='Create a new post' onclick='postPost(" + thisId + ", true);' style='position:absolute;left:330px;width:150px;height:30px;top:15px;cursor:pointer;'>New Post</button>"
                        + "<button title='View and edit old posts' onclick='viewPosts(" + thisId + ")'style='position:absolute;left:330px;width:150px;height:30px;bottom:15px;cursor:pointer;'>View Posts</button>"
                        + "<button title='Change feed information such as name and website' onclick='feedEditInfo(" + thisId + ")' style='position:absolute;left:490px;width:150px;height:30px;top:15px;cursor:pointer;'>Edit Feed Info</button>"
                        + "<button title='Edit who can contribute to this feed' onclick='contribute(&#39;feed_" + thisId + "&#39;)' style=position:absolute;left:490;width:150px;height:30px;bottom:15px;cursor:pointer;'>Manage Contributors</button>"
                        + "<a id='feed_website_" + thisId + "' href='" + website + "'><img id='feed_website_tt_" + thisId + "' src='./images/web_icon.png' width='20px' height='20px' title='Go to feed website at \n" + website + "' style='position:absolute;left:290px;top:30px;width:20px;height:20px;cursor:pointer;' /></a>"
                        + "<div title='Students subscribed to this feed' style='position:absolute;right:0px;top:15px;height:30px;width:60px;'>"
                        + "<img src='./images/subscribers_icon.png' height='20px' width='20px' style='position:absolute;top:5px;'/>"
                        + "<p id='feed_subscribers_" + thisId + "' style='color:black;font-family:&#39;Arial&#39;, Times, serif;font-size:16px;position:absolute;left:23px;text-align:left;top:-10px;'><b>" + subscribers + "</b></p></div>"
                        + "<div onmouseover='$(&#39;#feed_trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#feed_trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);' title='Delete Feed' onclick='deleteFeed(" + thisId + ");' style='position:absolute;right:0px;bottom:15px;height:30px;width:60px;overflow:hidden;cursor:pointer;'>"
                        + "<img id='feed_trash_" + thisId + "' src='./images/delete_icon.png' height='30px' width='30px' onclick='deleteFeed(" + thisId + "'style='position:absolute;left:13px;top:-5px;' /></div>"
                        + "</div>"
                        ).appendTo("#feeds_panel");

                if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
                {
                    var t = document.getElementById("feed_website_tt_" + thisId);
                    t.parentNode.removeChild(t);
                    var e = document.getElementById("feed_website_" + thisId);
                    e.parentNode.removeChild(e);
                }

                setTimeout(function() {
                    $("#" + toBeId).animate({opacity: "1"}, {queue: false, duration: 500});
                }, 200);
                globalFeedTop = globalFeedTop + 112;
                numFeeds = numFeeds + 1;
                feedsMainHeight += 112;

                //Add data to array
                var entry = {
                    id: newId,
                    name: name,
                    subscribers: 0,
                    description: fields['description'],
                    website: website,
                    posts: new Array(),
                    loaded_to: 15
                };
                feedData.push(entry);

            }
            setCreateFeedLoading(false);
        }
    };
    xmlhttp.open("POST", "./ajax_php/createFeed.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("name=" + fields['name'] + "&description=" + fields['description'] + "&website=" + fields['website']);
    
    return false; // just a safety. Required?
}

//Create class loader
var isCreateFeedLoading = false;
function setCreateFeedLoading(mode)
{
    if (mode && isCreateFeedLoading === false)
    {
        isCreateFeedLoading = true;
        $("#create_feed_loader").slideDown(1);
        $("#create_feed_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isCreateFeedLoading === true)
    {
        isCreateFeedLoading = false;
        $("#create_feed_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#create_feed_loader").slideUp(1);
        }, 100);
    }
}

function deleteFeed(feedId) {
    if (confirm("Are you sure you want to delete this feed and all its data?"))
    {
        //Delete the feed
        setLoading(true);
        var xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp = new XMLHttpRequest();
        else
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var text = xmlhttp.responseText;
                setLoading(false);
                if (text === "done") {
                    notify("Feed deleted.", 120);
                    //Animate removing the div
                    $("#feed_" + feedId).animate({opacity: "0"}, {queue: false, duration: 500});
                    setTimeout(function() {
                        //Re-sort feeds
                        for (var i = 0; i < feedData.length; i++) {
                            if (feedData[i]['name'].toLowerCase() > feedData[feedSqlToIndex(feedId)]['name'].toLowerCase()) {
                                $("#feed_" + feedData[i]['id']).animate({top: "-=112px"}, {queue: false, duration: 200});
                            }
                        }

                        globalFeedTop = globalFeedTop - 112;
                        numFeeds = numFeeds - 1;
                        feedsMainHeight -= 112;
                        $("#center_body").animate({height: "-=112px"}, {queue: false, duration: 200});
                        $("#feeds_panel").animate({height: "-=112px"}, {queue: false, duration: 200});
                        $("#feed_" + feedId).remove();
                        
                        feedData.splice(feedSqlToIndex(feedId), 1);                        
                    }, 500);
                } else if (text === "not found") {
                    notify("Feed not found.", 200);
                } else {
                    alert(text);
                }
            }
        };
        xmlhttp.open("POST", "./ajax_php/deleteFeed.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("id=" + feedId);
    }

}

function feedEditInfo(feedId)
{
    var indexId = feedSqlToIndex(feedId);
    createFeed();
    // Note: feedData not getting info
    $("#feed_name").val(feedData[indexId]['name']);
    $("#feed_add_info").val(feedData[indexId]['description']);
    $("#feed_website").val(feedData[indexId]['website']);
    if (feedData[indexId]['website'] == 'http://' || feedData[indexId]['website'] == 'ftp://' || feedData[indexId]['website'] == 'https://' || feedData[indexId]['website'] == 'ftps://')
        $("#feed_website").val("");
    $("#create_feed_button").text("Update Feed Information");
    $("#create_feed_form").attr('onsubmit', "return updateFeed(" + feedId + ");");
    $("#create_feed_label").text("Editing " + feedData[indexId]['name']);
}

function updateFeed(feedId) {
    var fields = {};
    fields['name'] = document.forms['create_feed_form']['feed_name'].value;
    fields['description'] = document.getElementById('feed_add_info').value;
    fields['website'] = document.forms['create_feed_form']['feed_website'].value;

    if (fields['name'] === "")
    {
        $("#feed_name").css("backgroundColor", "F70000");
        return false;
    }
    setCreateFeedLoading(true);
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            setCreateFeedLoading(false);
            if (text != "error")
            { //Success
                notify("Feed updated.", 150);
                createFeedExit();
                
                //Mess with the values a bit
                 //Prep info for display
               
                if (fields['description'] == "")
                    var description = "- No description -";
                else
                    var description = fields['description'];

                var website = text;
                $("#feed_website_tt_" + feedId).show();
                $("#feed_website_" + feedId).show();
                $("#feed_name_" + feedId).text(fields['name']);
                $("#feed_description_" + feedId).text(description);
                $("#feed_website_" + feedId).attr("href", website);
                $('#feed_website_tt_' + feedId).prop('title', "Go to feed website at \n" + website);
                if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
                {
                      $("#feed_website_tt_" + feedId).hide();
                      $("#feed_website_" + feedId).hide();
                }
                //Manage holding data
                var tempFeedData = feedData[feedSqlToIndex(feedId)]['posts'];
                var tempLoadedTo = feedData[feedSqlToIndex(feedId)]['loaded_to'];
                feedData.splice(feedSqlToIndex(feedId), 1);
                //Add data to array
                var entry = {
                    id: feedId,
                    name: fields['name'],
                    subscribers: $("#feed_subscribers_" + feedId).text(),
                    description: fields['description'],
                    website: website,
                    posts: tempFeedData,
                    loaded_to: tempLoadedTo
                };
                feedData.splice(feedSqlToIndex(feedSqlToIndex(feedId)), 0, entry);
                
                // below re-sorts into alphabetical order
                var count = 0;
                for (var i = 0; i < feedData.length; i ++) {
                    var otherTop = parseInt($("#feed_" + feedData[i]['id']).css("top").replace('px', '') );
                    var myTop = parseInt($("#feed_" + feedId).css("top").replace('px', ''));
                    var alphaOrder = (fields['name']).toLowerCase() < feedData[i]['name'].toLowerCase();
                    
                    //move
                    if (otherTop < myTop && alphaOrder) {
                        $("#feed_" + feedData[i]['id']).animate({top: "+=112px"}, {queue: false, duration: 200});
                    }
                    if (otherTop > myTop && !alphaOrder) {
                        $("#feed_" + feedData[i]['id']).animate({top: "-=112px"}, {queue: false, duration: 200});
                    }
                    
                    //get alpha move count
                    if (!alphaOrder)
                        count ++;
                }
                var toMoveTo = (count * 112) + 20 - 112;
                $("#feed_" + feedId).animate({top: toMoveTo + "px"}, {queue: false, duration: 200});
                //end alpha sort
            }
            else
            {
                notify("An error occured.", 150);
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/editFeed.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("sqlid=" + feedId + "&name=" + fields['name'] + "&description=" + fields['description'] + "&website=" + fields['website']);

    return false;
}

function feedSqlToIndex(feedId) {
    for (var i = 0; i < feedData.length; i++)
    {
        if (feedData[i]['id'] == feedId)
        {
            return i;
        }
    }
}
