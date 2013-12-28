/**
 * Manages all functions concerning student contributing system.
 */

var toggleContribute = false;
var currentViewing; // array that tracks whatever you're viewing, format changes based on feed/class
var viewHasFile = false;
var contribLoadedTo; // checks what you're loaded to
var contribTotalCount;
var contribTopTracker; // carries over the top

function contributeLoader() {
    if (!isContrib) {
        $("#more_tab").remove();
    }
}

function contributeClick() {
    if (toggleContribute) {
        toggleContribute = false;
        $("#contribute_container").animate({height: "0px"}, {queue: false, duration: 100});
        setTimeout(function() {
             $("#contribute_container").css("border", "none");
             $("#contribute_container").empty();
        }, 100);
    } else {
        toggleContribute = true;
        $("#contribute_container").css("border", "2px solid black");
        
        var height = contrib.length * 52 - 2;
        
        $("#contribute_container").animate({height: height + "px"}, {queue: false, duration: 100});
        fillContrib();
    }
}

function fillContrib() {
    var tops = 0;
    for (var i = 0; i < contrib.length; i++) {
        $("<div id='contrib_" + i + "' onclick='openContrib(" + i + ");'onmouseover='mmLight(this);' onmouseout='mmUnlight(this);' style='cursor:pointer;background-color:#837E7C;overflow:hidden;position:absolute;left:0px;top:" + tops + "px;right:0px;height:50px;'>"
                + "<div style='position:absolute;left:5px;top:-18px;right:5px;height:30px;'>"
                + "<p class='footer_font' style='font-size:20px'>" + contrib[i]['name'] + "</p></div>"
                + "<div style='position:absolute;left:5px;bottom:10px;right:5px;height:30px;white-space:nowrap;'>"
                + "<p class='footer_font' style='font-size:15px'>" + contrib[i]['owner_name'] + "</p></div></div>"
                ).appendTo("#contribute_container");
        tops += 52;
    }
}

function openContrib(indexId) {
    contributeClick();
    
    contribLoadedTo = 15;
    
    
    if (contrib[indexId]['type'] == 'class') { // this repalces "view assignments"
        //Class
        dim();
        $("#view_assignment_panel").css("left", "-610px");
        $("#view_assignment_panel").animate({left: "100px"}, {queue: false, duration: 100});
        $("#view_assignment_label").text(contrib[indexId]['name']);
        $("#assignment_holder").empty();
        $("#new_assignment_button").attr("onclick", "newAssignment(" + indexId + ", true);");
        
        //turn on loader
        $("#view_assignment_loader").css("display", "inline");
        $("#view_assignment_loader").css("opacity", ".4");

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
                    exitViewAssignments();
                } else {
                    //parse xml
                    currentViewing = new Array();
                    
                    $("#view_assignment_loader").css("display", "none");
                    $("#view_assignment_loader").css("opacity", "0");
                    
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
                        var date_from = entry[1].childNodes[0].nodeValue;
                        var date_to = entry[2].childNodes[0].nodeValue;
                        var message = entry[3].childNodes[0].nodeValue;
                        var file = entry[4].childNodes[0].nodeValue;
                        var file_title = entry[5].childNodes[0].nodeValue;
                        
                        if (file == "nofile") {
                            file = "";
                            file_title = "";
                        }

                        var date1 = date_from;
                        var date2 = date_to;

                        date1 = date1.substring(5, 7) + "/" + date1.substring(8, 11) + "/" + date1.substring(0, 4);
                        var date3 = date2.substring(5, 7) + "/" + date2.substring(8, 11) + "/" + date2.substring(0, 4);

                        var date;
                        if (date2 == "1970-01-01")
                            date = date1;
                        else
                            date = date1 + " - " + date3;
                        
                        var entry = {
                            id: id,
                            date_from: date_from,
                            date_to: date_to,
                            message: message,
                            file: file,
                            file_title: file_title
                        };
                        currentViewing.push(entry);
                        //display
                        $("<div id='view_post_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                                "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                                "<p class='create_class_labels' id='view_assignment_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + "</b></p></div>" +
                                "<div onclick='deleteAssignment(" + id + ", " + indexId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                                "<img id='post_" + id + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Assignment' /></div>" +
                                "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                                "<img id='post_" + id + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editAssignment(" + indexId + ", " + h + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Assignment' /></div>" +
                                "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                                "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                                "<p class='create_class_labels' id='file_display_slot_" + id + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + file_title + "</span>" +
                                "</p></div></div>"
                                ).appendTo("#assignment_holder");
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
        xmlhttp.open("POST", "./ajax_php/getMoreAssignments.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("classId=" + contrib[indexId]['id'] + "&start=0");

        // AJAX check for more classes
        
        $("#load_more_assignments_button").html("Loading...");
        $("#load_more_assignments_button").attr("disabled", "true");
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
                        $("#load_more_assignments_button").removeAttr("disabled");
                        $("#load_more_assignments_button").html("Get More Assignments");
                        $("#load_more_assignments_button").attr("onclick", "contribLoadMoreAssignments(" + indexId + ");");
                    } else {
                        $("#load_more_assignments_button").attr("disabled", "true");
                        $("#load_more_assignments_button").html("No More Assignments");
                    }
               }
            }
        };
        xmlhttp2.open("POST", "./ajax_php/getClassAssignmentCount.php", true);
        xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp2.send("classId=" + contrib[indexId]['id']);


    } else { // replaces 'viewfeeds()'
        //Feed 
        feedOpenContrib(indexId);
    }
}

function exitViewAssignments(shouldUndim) {
    if (shouldUndim)
        undim();
    $("#view_assignment_panel").animate({left: "810px"}, {queue: false, duration: 100});
    $("#assignment_holder").empty()
}

function newAssignment(indexId, hasNoFile) {
    exitViewAssignments(false);
    $("#new_assignment_panel").css("left", "-560px");
    $("#new_assignment_panel").animate({left: "122px"}, {queue: false, duration: 100});
    $("#new_assignment_label").text("New assignment - " + contrib[indexId]['name']);
    document.getElementById("new_assignment_form").reset();
    $("#classId").val(contrib[indexId]['id']);
    $("#message").focus();

    $("#new_assignment_submit").text("Post Assignment");
    $("#new_assignment_form").attr("action", "./ajax_php/postAssignment.php");
    if (hasNoFile) {
        $("#toggle_file_button").text("Click to add a file");
        viewHasFile = false;
    }
    else {
        $("#toggle_file_button").text("Modify/Delete File");
        viewHasFile = true;
    }
}

function newAssignmentExit() {
    undim();
    $("#new_assignment_panel").animate({left: "810px"}, {queue: false, duration: 100});
    $("#from_date").val("");
    $("#to_date").val("");
    $("#message").val("");
    $("#from_date").css("backgroundColor", "white");
    $("#to_date").css("backgroundColor", "white");
    $("#message").css("backgroundColor", "white");

    $("#postId").val("");

    $("#toggle_file_button").text("Click to add a file");
    $("#toggle_file_button").attr("onclick", "addFileSlidein();");
    $("#file_upload_div").css("opacity", "0");
    $("#file_upload_div").css("display", "none");
    $("#file_title").val("");
    $("#file_title").css("backgroundColor", "white");
    $("#file").val("");
}


//custom
function checkNewAssignment() {
var error = false;
 
    var fields = {};
    fields['from'] = $("#from_date").val();
    fields['to'] = $("#to_date").val();
    fields['message'] = $("#message").val();
 
    if (!fields['from'].match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g)) {
        error = true;
        $("#from_date").css("backgroundColor", "#F70000");
    }
    else
        $("#from_date").css("backgroundColor", "white");
 
    if (fields['message'] === "") {
        error = true;
        $("#message").css("backgroundColor", "#F70000");
    }
    else
        $("#message").css("backgroundColor", "white");
 
    var syntax = fields['to'].match(/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/g);
    var blank = fields['to'] == "";
    if (blank || syntax)
        $("#to_date").css("backgroundColor", "white");
    else {
        error = true;
        $("#to_date").css("backgroundColor", "#F70000");
    }
 
    //Check conditional file title requirements
    if ($("#file").val() != "" && $("#file_title").val() == "")
    {
        $("#file_title").css("backgroundColor", "#F70000");
        error = true;
    }
    else
        $("#file_title").css("backgroundColor", "white");
 
    if (error)
        return false;
    else
    { // AJAX make page
        $("#new_assignment_loader").css("display", "inline");
        $("#new_assignment_loader").css("opacity", ".4");
        
        if($("#postId").val() == "")
        {
            $("#new_assignment_form").ajaxSubmit({
                success: function(text) {
                    // done with creating NEW POST
                    $("#new_assignment_loader").css("display", "none");
                    $("#new_assignment_loader").css("opacity", "0");
                    
                    notify("Assignment posted", 150);
                    newAssignmentExit();
                }
            });
        }
        else  { // For editing an assignments
            $("#new_assignment_form").ajaxSubmit({
                success: function(text) {
                    // done with UPDATE
                    $("#new_assignment_loader").css("display", "none");
                    $("#new_assignment_loader").css("opacity", "0");
                    
                    notify("Assignment updated", 150);
                    newAssignmentExit();
                }
            });
        }
         
        return false;
    }
    return false;
}

function addFileSlidein() {
    
    if(viewHasFile) {
        if (!confirm("Warning: Modifing the file requires re-uploading the file. Press OK to continue."))
            return; 
    }
    $("#fileClicked").val("true");
    $("#toggle_file_button").text("Click to cancel");
    $("#toggle_file_button").attr("onclick", "removeFileSlidein();");
    $("#file_upload_div").css("display", "inline");
    $("#file_upload_div").animate({opacity: "1"}, {queue: false, duration: 200});
}

function removeFileSlidein() {
    if (viewHasFile) {
        $("#toggle_file_button").text("Modify/Delete File");
        $("#fileClicked").val("false");
    }
    else
        $("#toggle_file_button").text("Click to add a file");
    
    $("#toggle_file_button").attr("onclick", "addFileSlidein();");
    $("#file_upload_div").animate({opacity: "0"}, {queue: false, duration: 200});
    setTimeout(function() {
       $("#file_upload_div").css("display", "none");
       $("#file_title").val("");
       $("#file_title").css("backgroundColor", "white");
       $("#file").val("");
    }, 200);
}

function deleteAssignment(postId, classIndexId) {
    if (confirm("Delete this post and all its data?")) {
        //set loading screen TODO
        $("#view_assignment_loader").css("display", "inline");
        $("#view_assignment_loader").css("opacity", ".4");
        var xmlhttp2;
        if (window.XMLHttpRequest)
            xmlhttp2 = new XMLHttpRequest();
        else
            xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
            {
                var text = xmlhttp2.responseText;
                
                //remove loading TODO
                $("#view_assignment_loader").css("display", "inline");
                $("#view_assignment_loader").css("opacity", ".4");
                exitViewAssignments(true);
                
                if (text == "done") {
                    notify("Assignment Deleted.", 150);
                    
                    
                } else {
                     notify("An error occured.", 150);
                }
            }
        };
        xmlhttp2.open("POST", "./ajax_php/deleteAssignment.php", true);
        xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp2.send("post=" + postId + "&class=" + contrib[classIndexId]['id']);
    }
}

function editAssignment(classIndexId, postIndexId) {
    
    exitViewAssignments(false);
    var fromDate = currentViewing[postIndexId]['date_from'];
    var toDate = currentViewing[postIndexId]['date_to'];
    var message = currentViewing[postIndexId]['message'];

    fromDate = fromDate.substring(5, 7) + "/" + fromDate.substring(8, 11) + "/" + fromDate.substring(0, 4);
    if (toDate == "1970-01-01")
        toDate = "";
    else
        toDate = toDate.substring(5, 7) + "/" + toDate.substring(8, 11) + "/" + toDate.substring(0, 4);
    
    if (currentViewing[postIndexId]['file_title'] == "") {
        newAssignment(classIndexId, true);
    }
    else {
        newAssignment(classIndexId, false);
    }
    
    $("#new_assignment_label").text("Edit Assignment - " + contrib[classIndexId]['name']);
    $("#message").val(message);
    $("#from_date").val(fromDate);
    $("#to_date").val(toDate);
    $("#new_assignment_submit").text("Update Assignment");
    $("#new_assignment_form").attr("action", "./ajax_php/editAssignment.php");
    
    $("#postId").val(currentViewing[postIndexId]['id']);
    $("#fileClicked").val("false");
}


function contribLoadMoreAssignments(classIndexId) {
    $("#load_more_assignments_button").attr("disabled", "true");
    $("#load_more_assignments_button").text("Getting Assignments...");
    $("#load_more_animation").css("opacity", "1");
    $("#view_assignment_panel_exit").removeAttr("onclick");
    
    var xmlhttp2;
    if (window.XMLHttpRequest)
        xmlhttp2 = new XMLHttpRequest();
    else
        xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
        {
            $("#load_more_animation").css("opacity", "0");
            if (xmlhttp2.responseText == "error") {
                notify("An error occured", 150);
            }
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
            //reiterate, check if there are even more
            var x = xmlDoc.documentElement.childNodes;
            var tops = contribTopTracker;
            for (var h = 0; h < x.length; h++) {
                var entry = x[h].childNodes;
                var id = entry[0].childNodes[0].nodeValue;
                var date_from = entry[1].childNodes[0].nodeValue;
                var date_to = entry[2].childNodes[0].nodeValue;
                var message = entry[3].childNodes[0].nodeValue;
                var file = entry[4].childNodes[0].nodeValue;
                var file_title = entry[5].childNodes[0].nodeValue;

                if (file == "nofile") {
                    file = "";
                    file_title = "";
                }

                var date1 = date_from;
                var date2 = date_to;

                date1 = date1.substring(5, 7) + "/" + date1.substring(8, 11) + "/" + date1.substring(0, 4);
                var date3 = date2.substring(5, 7) + "/" + date2.substring(8, 11) + "/" + date2.substring(0, 4);

                var date;
                if (date2 == "1970-01-01")
                    date = date1;
                else
                    date = date1 + " - " + date3;

                var entry = {
                    id: id,
                    date_from: date_from,
                    date_to: date_to,
                    message: message,
                    file: file,
                    file_title: file_title
                };
                currentViewing.push(entry);

                //display
                $("<div id='view_post_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                        "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                        "<p class='create_class_labels' id='view_assignment_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + "</b></p></div>" +
                        "<div onclick='deleteAssignment(" + id + ", " + classIndexId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + id + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                        "<img id='post_" + id + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Assignment' /></div>" +
                        "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                        "<img id='post_" + id + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editAssignment(" + classIndexId + ", " + contribLoadedTo + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Assignment' /></div>" +
                        "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                        "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                        "<p class='create_class_labels' id='file_display_slot_" + id + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + file_title + "</span>" +
                        "</p></div></div>"
                        ).appendTo("#assignment_holder");
                
                contribLoadedTo ++;
                
                var oldHeight = $("#view_post_" + id).height();
                if (file == "") {
                    $("#file_display_slot_" + id).remove();
                    $("#view_post_" + id).css("paddingBottom", "0px");
                    oldHeight -= 10;
                }
                tops = tops + 21 + oldHeight;

            }
            contribTopTracker = tops;
            $("#view_assignment_panel_exit").attr("onclick", "exitViewAssignments(true);");
            
            //check for even more
            if (contribTotalCount > contribLoadedTo) {
                //There's still more
                $("#load_more_assignments_button").removeAttr("disabled");
                $("#load_more_assignments_button").html("Get More Assignments");
                $("#load_more_assignments_button").attr("onclick", "contribLoadMoreAssignments(" + classIndexId + ");");
            } else {
                $("#load_more_assignments_button").attr("disabled", "true");
                $("#load_more_assignments_button").text("No More Assignments");
            }
        }
    };
    xmlhttp2.open("POST", "./ajax_php/getMoreAssignments.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("classId=" + contrib[classIndexId]['id'] + "&start=" + contribLoadedTo);
}


