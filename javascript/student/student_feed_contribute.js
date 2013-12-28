/**
 * Takes care of the feed-specific contribute aspects
 */

function feedOpenContrib(indexId) {
    //Class
    dim();
    $("#view_posts_panel").css("left", "-610px");
    $("#view_posts_panel").animate({left: "100px"}, {queue: false, duration: 100});
    $("#view_posts_label").text(contrib[indexId]['name']);
    $("#post_holder").empty();
    $("#new_post_button").attr("onclick", "newPost(" + indexId + ", true);");

    //turn on loader
    $("#view_posts_loader").css("display", "inline");
    $("#view_posts_loader").css("opacity", ".4");

    //XML get posts
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
                exitViewPosts(true);
            } else {
                //parse xml
                currentViewing = new Array();

                $("#view_posts_loader").css("display", "none");
                $("#view_posts_loader").css("opacity", "0");

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
                    var date = entry[1].childNodes[0].nodeValue;
                    var time = entry[2].childNodes[0].nodeValue;
                    var message = entry[3].childNodes[0].nodeValue;
                    var file = entry[4].childNodes[0].nodeValue;
                    var file_title = entry[5].childNodes[0].nodeValue;

                    if (file == "nofile") {
                        file = "";
                        file_title = "";
                    }

                    var entry = {
                        id: id,
                        date: date,
                        time: time,
                        message: message,
                        file: file,
                        file_title: file_title
                    };
                    
                    currentViewing.push(entry);
                    
                    date = date.substring(5, 7) + "/" + date.substring(8, 11) + "/" + date.substring(0, 4);

                    //Time conversion
                    var comps = time.split(":");
                    var sign = "am";
                    var hours = comps[0];
                    var minutes = comps[1];
                    if (hours >= 12) {
                        hours = hours - 12;
                        sign = "pm";
                    }
                    if (hours == 0) {
                        hours = 12;
                    }

                    var time = hours + ":" + minutes + " " + sign;

                    $("<div id='view_post_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                            "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                            "<p class='create_class_labels' id='view_post_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + " </b> <span style='font-size:14px;'> " + time + "</span></p></div>" +
                            "<div onclick='deletePost(" + id + ", " + indexId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                            "<img id='post_" + id + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Post' /></div>" +
                            "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                            "<img id='post_" + id + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editPost(" + indexId + ", " + h + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Post' /></div>" +
                            "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                            "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                            "<p class='create_class_labels' id='file_display_slot_" + id + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + file_title + "</span>" +
                            "</p></div></div>"
                            ).appendTo("#post_holder");
                    var oldHeight = $("#view_post_" + id).height();
                    if (file == "") {
                        $("#file_display_slot_" + id).remove();
                        $("#view_post_" + id).css("paddingBottom", "0px");
                        oldHeight -= 10;
                    }
                    tops = tops + 21 + oldHeight;
                }
                contribTopTracker = tops;
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/getMorePosts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("feedId=" + contrib[indexId]['id'] + "&start=0");

    // AJAX check for more posts
    contribLoadedTo = 15;

    $("#load_more_posts_button").html("Loading...");
    $("#load_more_posts_button").attr("disabled", "true");
    
    var xmlhttp2;
    if (window.XMLHttpRequest)
        xmlhttp2 = new XMLHttpRequest();
    else
        xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
        {
            var text = xmlhttp2.responseText;
            if (text == "error")
                alert("Warning: a pretty bad error occured. You shouldn't be seeing this.");
            else {
                contribTotalCount = text;
                if (text > 15) {
                    $("#load_more_posts_button").removeAttr("disabled");
                    $("#load_more_posts_button").html("Get More Posts");
                    $("#load_more_posts_button").attr("onclick", "contribLoadMorePosts(" + indexId + ");");
                } else {
                    $("#load_more_posts_button").attr("disabled", "true");
                    $("#load_more_posts_button").html("No More Posts");
                }
            }
        }
    };
    xmlhttp2.open("POST", "./ajax_php/getFeedPostCount.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("feedId=" + contrib[indexId]['id']);
}

function exitViewPosts(shouldUndim) {
    if (shouldUndim)
        undim();
    $("#view_posts_panel").animate({left: "810px"}, {queue: false, duration: 100});
    $("#post_holder").empty();
}

function newPost(feedIndexId, hasNoFile) {
    exitViewPosts(false);
    $("#new_post_panel").css("left", "-560px");
    $("#new_post_panel").animate({left: "100px"}, {queue: false, duration: 100});
    $("#new_post_label").text("New post - " + contrib[feedIndexId]['name']);
    document.getElementById("new_post_form").reset();
    $("#feedId").val(contrib[feedIndexId]['id']);
    $("#feed_message").focus();
    
    $("#new_post_form").attr("action", "./ajax_php/postPost.php");

    $("#new_post_submit").text("Publish Post");
    if (hasNoFile) {
        $("#feed_toggle_file_button").text("Click to add a file");
        viewHasFile = false;
    }
    else {
        $("#feed_toggle_file_button").text("Modify/Delete File");
        viewHasFile = true;
    }
    
    //different from class
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
    
    var today = new Date(); 
    var day = today.getDate(); 
    var month = today.getMonth()+1;//January is 0! 
    var year = today.getFullYear(); 
    if (day < 10)
        day = '0' + day; 
    if (month < 10)
        month = '0' + month;
    var date = month + "/" + day + "/" + year;
    var todaysDate = date;
    
    $("#new_post_date_label").html(todaysDate + " <span style='font-size:14px;'> " + time + "</span>");
    $("#update_time_div").css("display", "none");
}

function newPostExit() {
    undim();
    $("#new_post_panel").animate({left: "810px"}, {queue: false, duration: 100});
    $("#feed_message").val("");
    $("#feed_message").css("backgroundColor", "white");

    $("#feedPostId").val("");

    $("#feed_toggle_file_button").text("Click to add a file");
    $("#feed_toggle_file_button").attr("onclick", "postaddFileSlidein();");
    $("#feed_file_upload_div").css("opacity", "0");
    $("#feed_file_upload_div").css("display", "none");
    $("#feed_file_title").val("");
    $("#feed_file_title").css("backgroundColor", "white");
    $("#feed_file").val("");
}

function postAddFileSlidein() {
    
    if(viewHasFile) {
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
    if (viewHasFile) {
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

function checkNewPost() {
    var error = false;
 
    var message = $("#feed_message").val();
 
    if (message === "") {
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
 
    if (error) {
        return;
    } else {
        
        if($("#feedPostId").val() == "") //*************************NEW POST
        {
            //TODO turn on loader
            $("#new_post_loader").css("display", "inline");
            $("#new_post_loader").css("opacity", ".4");
            $("#new_post_form").ajaxSubmit({
                success: function(text) {
                    $("#new_post_loader").css("display", "none");
                    $("#new_post_loader").css("opacity", "0");
                    if (text == "error") {
                        notify("An error occured.", 150);
                    } else {
                        notify("Post published.", 150);
                        newPostExit();
                    }
                }
            });
        } else { //************************************************EDIT POST
            $("#new_post_loader").css("display", "inline");
            $("#new_post_loader").css("opacity", ".4");
            $("#new_post_form").ajaxSubmit({
                success: function(text) {
                    $("#new_post_loader").css("display", "none");
                    $("#new_post_loader").css("opacity", "0");
                    if (text == "error") {
                        notify("An error occured.", 150);
                    } else {
                        notify("Post Updated.", 150);
                        newPostExit();
                    }
                }
            });
        }
    }
}

function deletePost(postId, feedIndexId) {
    if (confirm("Delete this post and all its data?")) {
        $("#view_posts_loader").css("display", "inline");
        $("#view_posts_loader").css("opacity", ".4");
        var xmlhttp;
        if (window.XMLHttpRequest)
            xmlhttp = new XMLHttpRequest();
        else
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
            {
                var text = xmlhttp.responseText;
                $("#view_posts_loader").css("display", "inline");
                $("#view_posts_loader").css("opacity", ".4");
                exitViewPosts(true);
                
                if (text == "done") {
                    notify("Post Deleted.", 100);
                } else {
                     notify("An error occured.", 150);
                }
            }
        };
        xmlhttp.open("POST", "./ajax_php/deletePost.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("post=" + postId + "&feed=" + contrib[feedIndexId]['id']);
    }
}

function editPost(feedIndexId, postIndexId) {
    exitViewPosts(false);
    
    var message = currentViewing[postIndexId]['message'];
    $("#feedId").val(contrib[feedIndexId]['id']);
    
    if (currentViewing[postIndexId]['file'] == "") {
        newPost(feedIndexId, true);
    } else {
        newPost(feedIndexId, false);
    }
    
    //Change date label
    $("#new_post_label").text("Edit Post - " + contrib[feedIndexId]['name']);
    
    var getDate = currentViewing[feedIndexId]['date'];
    var getTime = currentViewing[feedIndexId]['time'];
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
    
    $("#new_post_date_label").html("Last updated " + date + " <span style='font-size:14px;'> " + time + "</span>");
    $("#update_time_div").css("display", "inline");
    
    $("#feed_message").val(message);
    $("#new_post_submit").text("Update Post");
    
    $("#new_post_form").attr("action", "./ajax_php/editPost.php");
    
    $("#feedPostId").val(currentViewing[postIndexId]['id']);
    $("#feedFileClicked").val("false");
    
    document.getElementById("update_time").checked=true;
}

function contribLoadMorePosts(feedIndexId) {
    $("#load_more_posts_button").attr("disabled", "true");
    $("#load_more_posts_button").text("Getting Posts...");
    $("#feed_load_more_animation").css("opacity", "1");
    $("#view_posts_panel_exit").removeAttr("onclick");
    
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            $("#feed_load_more_animation").css("opacity", "0");
            if (xmlhttp.responseText == "error") {
                notify("An error occured", 150);
            } else {
                //Get response text as XML document
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
                //reiterate, check if there are even more
                var x = xmlDoc.documentElement.childNodes;
                var tops = contribTopTracker;
                for (var h = 0; h < x.length; h++) {
                    var entry = x[h].childNodes;
                    var id = entry[0].childNodes[0].nodeValue;
                    var date = entry[1].childNodes[0].nodeValue;
                    var time = entry[2].childNodes[0].nodeValue;
                    var message = entry[3].childNodes[0].nodeValue;
                    var file = entry[4].childNodes[0].nodeValue;
                    var file_title = entry[5].childNodes[0].nodeValue;
                    if (file == "nofile") {
                        file = "";
                        file_title = "";
                    }

                    var entry = {
                        id: id,
                        date_from: date,
                        time: time,
                        message: message,
                        file: file,
                        file_title: file_title
                    };
                    currentViewing.push(entry);

                    date = date.substring(5, 7) + "/" + date.substring(8, 11) + "/" + date.substring(0, 4);
                    //Time conversion
                    var comps = time.split(":");
                    var sign = "am";
                    var hours = comps[0];
                    var minutes = comps[1];
                    if (hours >= 12) {
                        hours = hours - 12;
                        sign = "pm";
                    }
                    if (hours == 0) {
                        hours = 12;
                    }

                    var time = hours + ":" + minutes + " " + sign;

                    $("<div id='view_post_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                            "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                            "<p class='create_class_labels' id='view_post_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + " </b> <span style='font-size:14px;'> " + time + "</span></p></div>" +
                            "<div onclick='deletePost(" + id + ", " + feedIndexId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                            "<img id='post_" + id + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Post' /></div>" +
                            "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                            "<img id='post_" + id + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editPost(" + feedIndexId + ", " + contribLoadedTo + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Post' /></div>" +
                            "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                            "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                            "<p class='create_class_labels' id='file_display_slot_" + id + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + file_title + "</span>" +
                            "</p></div></div>"
                            ).appendTo("#post_holder");

                    contribLoadedTo++;

                    var oldHeight = $("#view_post_" + id).height();
                    if (file == "") {
                        $("#file_display_slot_" + id).remove();
                        $("#view_post_" + id).css("paddingBottom", "0px");
                        oldHeight -= 10;
                    }
                    tops = tops + 21 + oldHeight;

                }
                contribTopTracker = tops;
                $("#view_posts_panel_exit").attr("onclick", "exitViewPosts(true);");

                //check for even more
                if (contribTotalCount > contribLoadedTo) {
                    //There's still more
                    $("#load_more_posts_button").removeAttr("disabled");
                    $("#load_more_posts_button").html("Get More Assignments");
                    $("#load_more_posts_button").attr("onclick", "contribLoadMorePosts(" + feedIndexId + ");");
                } else {
                    $("#load_more_posts_button").attr("disabled", "true");
                    $("#load_more_posts_button").text("No More Posts");
                }
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/getMorePosts.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("feedId=" + contrib[feedIndexId]['id'] + "&start=" + contribLoadedTo);   
}