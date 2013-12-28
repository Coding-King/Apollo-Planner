var feedViewHasFile = false;

function postPost(sqlid, hasNoFile) {
    dim();
    $("#post_post_panel").animate({left: "122px"}, {queue: false, duration: 200});
    $("#post_for_feed_label").text("New Post - " + feedData[feedSqlToIndex(sqlid)]['name']);
    $("#feedId").val(sqlid);
   
    $("#post_post_submit").text("Publish Post");
    $("#post_post_form").attr("action", "./ajax_php/postPost.php");
    
    var day = new Date();
    var hours = day.getHours();
    var minutes = day.getMinutes();
    
    var sign = "am";
    if (hours >= 12) {
        hours = hours-12;
        sign = "pm";
    }
    if (hours == 0) {
        hours = 12;
    }
    if (minutes < 10)
        minutes = "0" + minutes;
    
    var time = hours + ":" + minutes + " " + sign;
    
    
    $("#post_post_date_label").html(todaysDate + " <span style='font-size:14px;'> " + time + "</span>");
    $("#update_time_div").css("display", "none");
    
    if (hasNoFile) {
        $("#post_toggle_file_button").text("Click to add a file");
        feedViewHasFile = false;
        
    }
    else {
        $("#post_toggle_file_button").text("Modify/Delete File");
        feedViewHasFile = true;
       
    }
    scrollToTop();
    $("#feed_message").focus();
}

function postPostExit() {
    $("#post_post_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#post_post_panel").css("left", "-560px");
            //Clear the form
            $("#feed_message").val("");
            $("#feed_message").css("backgroundColor", "white");

            $("#feedPostId").val("");
            
            $("#feed_toggle_file_button").text("Click to add a file");
            $("#feed_toggle_file_button").attr("onclick", "postAddFileSlidein();");
            $("#feed_file_upload_div").css("opacity", "0");
            $("#feed_file_upload_div").css("display", "none");
            $("#feed_file_title").val("");
            $("#feed_file_title").css("backgroundColor", "white");
            $("#feed_file").val("");
        }});
    undim();
}

// File system 2.0 (more like 1.1, but 2.0 sounds better)
function postAddFileSlidein() {
    
    if(feedViewHasFile) {
        if (!confirm("Warning: Modifing the file requires re-uploading the file. Press OK to continue."))
            return; 
    }
    $("#feedFileClicked").val("true");
    $("#feed_toggle_file_button").text("Click to cancel");
    $("#feed_toggle_file_button").attr("onclick", "postRemoveFileSlidein();");
    $("#feed_file_upload_div").css("display", "inline");
    $("#feed_file_upload_div").animate({opacity: "1"}, {queue: false, duration: 200});
}

function postRemoveFileSlidein() {
    if (feedViewHasFile) {
        $("#feed_toggle_file_button").text("Modify/Delete File");
        $("#feedFileClicked").val("false");
    }
    else
        $("#feed_toggle_file_button").text("Click to add a file");
    
    $("#feed_toggle_file_button").attr("onclick", "postAddFileSlidein();");
    $("#feed_file_upload_div").animate({opacity: "0"}, {queue: false, duration: 200});
    setTimeout(function() {
       $("#feed_file_upload_div").css("display", "none");
       $("#feed_file_title").val("");
       $("#feed_file_title").css("backgroundColor", "white");
       $("#feed_file").val("");
    }, 200);
}

function checkPostPost() {
    var error = false;
 
    var fields = {};
    fields['date'] = todaysDate;
    fields['message'] = $("#feed_message").val();
 
    if (fields['message'] === "") {
        error = true;
        $("#feed_message").css("backgroundColor", "#F70000");
    }
    else
        $("#feed_message").css("backgroundColor", "white");
 
    //Check conditional file title requirements
    if ($("#feed_file").val() != "" && $("#feed_file_title").val() == "")
    {
        $("#feed_file_title").css("backgroundColor", "#F70000");
        error = true;
    }
    else
        $("#feed_file_title").css("backgroundColor", "white");
 
    if (error)
        return;
    else
    { // AJAX make page
         
        //For Creating post
        if($("#feedPostId").val() == "")
        {
            setPostPostLoading(true);
            $("#post_post_form").ajaxSubmit({
                success: function(text) {
                    if (text == "error") {
                        notify("An error occured.", 150);
                        setPostAssignmentLoading(false);
                    } else {
                         
                        //Note: text = inserted assignment
                        notify("Post published.", 150);
                        
                        var getFile = "";
                        var newId = "";
                        
                        
                        if (text.indexOf("_") == -1) {
                            newId = text;
                            getFile = "";
                        } else {
                            var arr = text.split(/_(.*)/);
                            newId = arr[0];
                            getFile = arr[1];
                        }
                        //Change date sytax to match from Database
                        
                        //Get right date format
                        var newDate = todaysDate.substring(6, 11) + "-" + todaysDate.substring(0, 2) + "-" + todaysDate.substring(3, 5);
                        
                        var day = new Date();
                        var hours = day.getHours();
                        var minutes = day.getMinutes();
                        var seconds = day.getSeconds();
                        
                        var entry = {
                            id: text,
                            date: newDate,
                            time: hours + ":" + minutes + seconds,
                            message: fields['message'],
                            file: getFile,
                            file_title: $("#feed_file_title").val()
                        };
                        if (feedData[feedSqlToIndex($("#feedId").val())]['posts'].length != 0)
                        {
                            for (var i = 0; i < feedData[feedSqlToIndex($("#feedId").val())]['posts'].length; i++)
                            {
                                var checkDate = feedData[feedSqlToIndex($("#feedId").val())]['posts'][i]['date'];
                                if (todaysDate.substring(0, 2) >= checkDate.substring(5, 7) && todaysDate.substring(3, 5) >= checkDate.substring(8, 11) && todaysDate.substring(6, 10) >= checkDate.substring(0, 4)) {
                                    feedData[feedSqlToIndex($("#feedId").val())]['posts'].splice(i, 0, entry);
                                    break;
                                }
                                else if (i == feedData[feedSqlToIndex($("#feedId").val())]['posts'].length - 1) {
                                    feedData[sqlToIndex($("#feedId").val())]['posts'].push(entry);
                                    break;
                                }
                            }
                        }
                        else //First assignment, just add it
                        {
                            feedData[feedSqlToIndex($("#feedId").val())]['posts'].push(entry);
                        }
                        setPostPostLoading(false);
                        postPostExit();
                    }
                }
            });
        }
        else  { // For editing a post
            setPostPostLoading(true);
            $("#post_post_form").ajaxSubmit({
                success: function(text) {
                     
                    if (text == "error") {
                        notify("An error occured.", 200);
                        setPostPostLoading(false);
                    }
                    else if (text == "done") //Successfully updated assignment
                    {
                        notify("Post updated.", 150);
                        
                        var indexId = feedSqlToIndex($("#feedId").val());
                        var postIndexId = feedPostSqlToIndex($("#feedPostId").val(), $("#feedId").val());
 
                        //Update date if requested
                        if (document.getElementById('update_time').checked) {
                            var newDate = todaysDate.substring(6, 11) + "-" + todaysDate.substring(0, 2) + "-" + todaysDate.substring(3, 5);
                            var day = new Date();
                            var newTime = day.getHours() + ":" + day.getMinutes() + day.getSeconds();
                        } else {
                            var newDate = feedData[indexId]['posts'][postIndexId]['date'];
                            var newTime = feedData[indexId]['posts'][postIndexId]['time'];
                        }
                        
                        if ($("#feedFileClicked").val() == "false") {
                            var entry = {
                                id: $("#feedId").val(),
                                date: newDate,
                                time: newTime,
                                message: fields['message'],
                                file: feedData[indexId]['posts'][postIndexId]['file'],
                                file_title: feedData[indexId]['posts'][postIndexId]['file_title']
                            };
                        }
                        else {
                            var entry = {
                                id: $("#feedPostId").val(),
                                date: newDate,
                                time: newTime,
                                message: fields['message'],
                                file: $("#feed_file").val(),
                                file_title: $("#feed_file_title").val()
                            };
                        }
                        feedData[indexId]['posts'].splice(postIndexId, 1);
                        if (feedData[indexId]['posts'].length != 0)
                        {
                            for (var i = 0; i < feedData[indexId]['posts'].length; i++)
                            {
                                var checkDate = feedData[indexId]['posts'][i]['date'];
                                if (fields['date'].substring(0, 2) >= checkDate.substring(5, 7) && fields['date'].substring(3, 5) >= checkDate.substring(8, 11) && fields['date'].substring(6, 10) >= checkDate.substring(0, 4)) {
                                    feedData[indexId]['posts'].splice(i, 0, entry);
                                    break;
                                }
                                else if (i == feedData[indexId]['posts'].length - 1) {
                                    feedData[indexId]['posts'].push(entry);
                                    break;
                                }
                            }
                        }
                        else //only assignment, just add it
                        {
                            feedData[indexId]['posts'].push(entry);
                        }
                        postPostExit();
                        setPostPostLoading(false);
                    } else {
                        setPostPostLoading(false);
                    }
                }
            });
        }
    }
}

function feedPostSqlToIndex(postId, feedId) {
    
    var indexId = feedSqlToIndex(feedId);
    
    for (var i = 0; i < feedData[indexId]['posts'].length; i ++) {
        if (postId == feedData[indexId]['posts'][i]['id'])
            return i;
    }
    return -1;
}


var isPostPostLoading = false;
function setPostPostLoading(mode)
{
    if (mode && isPostPostLoading === false)
    {
        isPostPostLoading = true;
        $("#post_post_loader").slideDown(1);
        $("#post_post_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isPostPostLoading === true)
    {
        isPostPostLoading = false;
        $("#post_post_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#post_post_loader").slideUp(1);
        }, 100);
    }
}

function viewPosts(feedId) {
    dim();
    
    //Get index id
    var indexId = feedSqlToIndex(feedId);
    $("#view_posts_label").text("All Posts - " + feedData[indexId]['name']);
    $("#view_post_post_button").attr("onclick", "viewPostPost(" + feedId + ");");
    //Fill with posts
    var tops = 0;
    if (feedData[indexId]['posts'].length == 0) {
            setTimeout(function() {
            $("#posts_empty_message").css("display", "inline");
            $("#posts_empty_message").animate({opacity: "1"}, {queue: false, duration: 200});
        }, 200);
    }
    else
    {
        for (var i = 0; i < feedData[indexId]['posts'].length; i++) {

            var postId = feedData[indexId]['posts'][i]['id'];
            var date = feedData[indexId]['posts'][i]['date'];
            var getTime = feedData[indexId]['posts'][i]['time'];
            date = date.substring(5, 7) + "/" + date.substring(8, 11) + "/" + date.substring(0, 4);
            var message = feedData[indexId]['posts'][i]['message'];
            var file = feedData[indexId]['posts'][i]['file'];
            var fileTitle = feedData[indexId]['posts'][i]['file_title'];
            
            //Time conversion
            var comps = getTime.split(":");
            var sign = "am";
            var hours = comps[0];
            var minutes = comps[1];
            if (hours >= 12) {
                hours = hours - 12;
                sign = "pm";
            } if (hours == 0) {
                hours = 12;
            }

            var time = hours + ":" + minutes + " " + sign;
            
            $("<div id='post_" + postId + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                    "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                    "<p class='create_class_labels' id='view_post_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + " </b> <span style='font-size:14px;'> " + time + "</span></p></div>" +
                    "<div onclick='deletePost(" + postId + ", " + feedId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                    "<img id='post_" + postId + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Post' /></div>" +
                    "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                    "<img id='post_" + postId + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editPost(" + feedId + ", " + postId + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Post' /></div>" +
                    "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                    "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                    "<p class='create_class_labels' id='file_display_slot_" + postId + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span>" +
                    "</p></div></div>"
                    ).appendTo("#post_holder");
            var oldHeight = $("#post_" + postId).height();
            if (file == "") {
                $("#file_display_slot_" + postId).remove();
                $("#post_" + postId).css("paddingBottom", "0px");
                oldHeight -= 10;
            }
            tops = tops + 21 + oldHeight;
        }
    }
    $("#view_posts_panel").animate({left: "100px"}, {queue: false, duration: 200});
    $("#feed_load_more_animation").css("opacity", "1");
    $("#load_more_posts_button").attr("disabled", "true");
    $("#load_more_posts_button").html("Older Posts...");
    $("#load_more_posts_button").removeAttr("onclick");
    $("#view_posts_panel_exit").removeAttr("onclick");
    
    //AJAX load if you have more classes
    var xmlhttp2;
    if (window.XMLHttpRequest)
        xmlhttp2 = new XMLHttpRequest();
    else
        xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
        {
           $("#feed_load_more_animation").css("opacity", "0");
           var text = xmlhttp2.responseText;
           if (text == "error")
               alert("An error occured.");
           else {
                if (text > feedData[indexId]['loaded_to']) {
                    $("#load_more_posts_button").removeAttr("disabled");
                    $("#load_more_posts_button").attr("onclick", "loadMorePosts(" + feedId + ");");
                } else {
                    $("#load_more_posts_button").html("No More Posts");
                }
           }
           $("#view_posts_panel_exit").attr("onclick", "viewPostsExit(true);");
        }
    }
    xmlhttp2.open("POST", "./ajax_php/getFeedPostCount.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("feedId=" + feedId);
}

function viewPostsExit(shouldDim) {
    $("#view_posts_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#view_posts_panel").css("left", "-610px");
            $("#post_holder").empty();
            $("#posts_empty_message").css("display", "none");
            $("#posts_empty_message").css("opacity", "0");
        }});
    if (shouldDim)
        undim();
}

function viewPostPost(feedId) {
    viewPostsExit(false);
    postPost(feedId, true);
}


var isFileForEdit = false;

function editPost(feedId, postId) {
    viewPostsExit(false);
    
    var indexId = feedSqlToIndex(feedId);
    var postIndexId = feedPostSqlToIndex(postId, feedId);
    
    var message = feedData[indexId]['posts'][postIndexId]['message'];
    
    if (feedData[indexId]['posts'][postIndexId]['file_title'] == "") {
        postPost(feedId, true);
    }
    else {
        postPost(feedId, false);
    }
    
    //Change date label
    $("#post_for_feed_label").text("Edit Post - " + feedData[indexId]['name']);
    
    var getDate = feedData[indexId]['posts'][postIndexId]['date'];
    var getTime = feedData[indexId]['posts'][postIndexId]['time'];
    var comps = getTime.split(":");
    var sign = "am";
    var hours = comps[0];
    var minutes = comps[1];
    if (hours >= 12) {
        hours = hours - 12;
        sign = "pm";
    } if (hours == 0) {
        hours = 12;
    }
    
    var time = hours + ":" + minutes + " " + sign;
    
    var date = getDate.substring(5, 7) + "/" + getDate.substring(8, 11) + "/" + getDate.substring(0, 4);
    
    $("#post_post_date_label").html("Last updated " + date + " <span style='font-size:14px;'> " + time + "</span>");
    $("#update_time_div").css("display", "inline");
    
    $("#feed_message").val(message);
    $("#post_post_submit").text("Update Post");
    
    $("#post_post_form").attr("action", "./ajax_php/editPost.php");
    
    $("#feedPostId").val(postId);
    $("#feedFileClicked").val("false");
    
    document.getElementById("update_time").checked=true;
}

function deletePost(postId, feedId) {
    if (confirm("Delete this post and all its data?")) {
        //Delete the class
        setViewPostsLoading(true);
        var xmlhttp2;
        if (window.XMLHttpRequest)
            xmlhttp2 = new XMLHttpRequest();
        else
            xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
            {
                var text = xmlhttp2.responseText;
                setViewPostsLoading(false);
                if (text == "done") {
                    notify("Posts Deleted.", 150);
                    
                    //Animate removing the div
                    $("#post_" + postId).animate({opacity: "0"}, {queue: false, duration: 500});
                    setTimeout(function() {
                        var e = document.getElementById("post_" + postId);
                        var toAdd = 11;
                        if ($("#file_display_slot_" + postId).length) {
                            toAdd += 10;
                        }
                        var height = $("#post_" + postId).height() + toAdd;
                        e.parentNode.removeChild(e);                        
                        for (var i = feedPostSqlToIndex(postId, feedId); i < feedData[feedSqlToIndex(feedId)]['posts'].length; i++)
                        {
                            $("#post_" + feedData[feedSqlToIndex(feedId)]['posts'][i]['id']).animate({top: "-=" + height + "px"}, {queue: false, duration: 100});
                        }
                        feedData[feedSqlToIndex(feedId)]['posts'].splice(feedPostSqlToIndex(postId, feedId), 1);

                        if (feedData[feedSqlToIndex(feedId)]['posts'].length == 0) {
                            $("#posts_empty_message").css("display", "inline");
                            $("#posts_empty_message").animate({opacity: "1"}, {queue: false, duration: 200});
                        }
                    }, 500);
                } else if (text == "error"){
                    notify("An error occured.", 150);
                } else {
                    //something else
                }
            }
        };
        xmlhttp2.open("POST", "./ajax_php/deletePost.php", true);
        xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp2.send("post=" + postId + "&feed=" + feedId);
    }
}

//Loader
var isViewPostsLoading = false;
//Loading dimmer
function setViewPostsLoading(mode)
{
    if (mode && isViewPostsLoading === false)
    {
        isViewPostsLoading = true;
        $("#view_posts_loader").slideDown(1);
        $("#view_posts_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isViewPostsLoading === true)
    {
        isViewPoststLoading = false;
        $("#view_posts_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#view_posts_loader").slideUp(1);
        }, 100);
    }
}

function loadMorePosts(feedId) {
    $("#load_more_posts_button").attr("disabled", "true");
    $("#feed_load_more_animation").css("opacity", "1");
    $("#view_posts_panel_exit").removeAttr("onclick");
    
    var xmlhttp2;
    if (window.XMLHttpRequest)
        xmlhttp2 = new XMLHttpRequest();
    else
        xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
        {
            //Get response text as XML document
            if (window.DOMParser)
            {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlhttp2.responseText, "text/xml");
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(xmlhttp2.responseText);
            }
            var x = xmlDoc.documentElement.childNodes;
            var totalPostCount = xmlDoc.documentElement.getAttribute("totalcount");
            outer:
            for (var h = 0; h < x.length; h ++) {
        
                var entry = x[h].childNodes;
                var postId = entry[0].childNodes[0].nodeValue;
                var date = entry[1].childNodes[0].nodeValue;
                var time = entry[2].childNodes[0].nodeValue;
                var message = entry[3].childNodes[0].nodeValue;
                var file = entry[4].childNodes[0].nodeValue;
                if (file == "nofile")
                    file = "";
                var file_title = entry[4].childNodes[0].nodeValue;
                if (file_title == "nofile")
                    file_title = "";
                
                // Insert into loaded array
                var dataEntry = {
                    id: postId,
                    date: date,
                    time: time,
                    message: message,
                    file: file,
                    file_title: file_title
                };
                
               
                
                var indexId = feedSqlToIndex(feedId);
                
                //Check if post has already been loaded
                for (var k = 0; k < feedData[indexId]['posts'].length; k ++) {
                    if (feedData[indexId]['posts']['id'] == postId)
                        continue outer;
                }
                
                
                if (feedData[indexId]['posts'].length != 0)
                {
                    for (var i = 0; i < feedData[indexId]['posts'].length; i++)
                    {
                        var checkDate = feedData[indexId]['posts'][i]['date'];
                        if (date.substring(5, 7) >= checkDate.substring(5, 7) && date.substring(8, 11) >= checkDate.substring(8, 11) && date.substring(0, 4) >= checkDate.substring(0, 4)) {
                            feedData[indexId]['posts'].splice(i, 0, dataEntry);
                            break;
                        }
                        else if (i == feedData[indexId]['posts'].length - 1) {
                            feedData[indexId]['posts'].push(dataEntry);
                            break;
                        }
                    }
                } else {
                     feedData[indexId]['posts'].push(dataEntry);
                }
            }
            //Check for more
            feedData[indexId]['loaded_to'] = feedData[indexId]['loaded_to'] + 15;
            
            $("#feed_load_more_animation").css("opacity", "0");
            if (totalPostCount > feedData[indexId]['loaded_to']) {
                $("#load_more_posts_button").removeAttr("disabled");
                $("#load_more_posts_button").html("Older Posts...");
            } else {
                $("#load_more_posts_button").html("No More Posts");
            }
            
            $("#view_posts_panel_exit").attr("onclick", "viewPostsExit(true);");
            
            //Now, re-draw the data in the appropriete div
            $("#post_holder").empty();

            //Fill with assignments
            var tops = 0;


            for (var i = 0; i < feedData[indexId]['posts'].length; i++) {
                var postId = feedData[indexId]['posts'][i]['id'];
                var date = feedData[indexId]['posts'][i]['date'];
                date = date.substring(5, 7) + "/" + date.substring(8, 11) + "/" + date.substring(0, 4);
                var message = feedData[indexId]['posts'][i]['message'];
                var file = feedData[indexId]['posts'][i]['file'];
                var fileTitle = feedData[indexId]['posts'][i]['file_title'];

                $("<div id='post_" + postId + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                        "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                        "<p class='create_class_labels' id='view_post_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + "</b></p></div>" +
                        "<div onclick='deletePost(" + postId + ", " + feedId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                        "<img id='post_" + postId + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Post' /></div>" +
                        "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                        "<img id='post_" + postId + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editPost(" + feedId + ", " + postId + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Post' /></div>" +
                        "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                        "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                        "<p class='create_class_labels' id='file_display_slot_" + postId + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span>" +
                        "</p></div></div>"
                        ).appendTo("#post_holder");
                var oldHeight = $("#post_" + postId).height();
                if (file == "") {
                    $("#file_display_slot_" + postId).remove();
                    $("#post_" + postId).css("paddingBottom", "0px");
                    oldHeight -= 10;
                }
            tops = tops + 21 + oldHeight;
            }
        }
    }
    xmlhttp2.open("POST", "./ajax_php/getMorePosts.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("feedId=" + feedId + "&start=" + feedData[feedSqlToIndex(feedId)]['loaded_to']);
}