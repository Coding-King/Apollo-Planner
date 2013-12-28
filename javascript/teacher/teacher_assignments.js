/**
 * Responsible for managing class homework
 */

var viewHasFile = false;

function postAssignment(sqlid, hasNoFile) {
    dim();
    $("#post_assignment_panel").animate({left: "122px"}, {queue: false, duration: 200});
    $("#post_for_class_label").text("New Assignment - " + allData[sqlToIndex(sqlid)]['name']);
    $("#classId").val(sqlid);
    $("#message").focus();
    $("#post_assignment_submit").text("Post Assignment");
    $("#post_assignment_form").attr("action", "./ajax_php/postAssignment.php");
    if (hasNoFile) {
        $("#toggle_file_button").text("Click to add a file");
        viewHasFile = false;
    }
    else {
        $("#toggle_file_button").text("Modify/Delete File");
        viewHasFile = true;
    }
    scrollToTop();
}

function postAssignmentExit() {
    $("#post_assignment_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#post_assignment_panel").css("left", "-560px");
            //Clear the form
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
        }});
    undim();
}

function checkPostAssignment() {
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
         
        //For Creating post
        if($("#postId").val() == "")
        {
            setPostAssignmentLoading(true);
            $("#post_assignment_form").ajaxSubmit({
                success: function(text) {
                    if (text == "error") {
                        notify("An error occured.", 150);
                        setPostAssignmentLoading(false);
                    } else {
                         
                        //Note: text = inserted assignment
                        notify("Assignment posted.", 150);
                        var getFile = "";
                        var newId = "";
 
 
                        //HERE
                        if (text.indexOf("_") == -1) {
                            newId = text;
                            getFile = "";
                        } else {
                            var arr = text.split(/_(.*)/);
                            newId = arr[0];
                            getFile = arr[1];
                        }
 
                        //Change date sytax to match from Database
                        var newDateFrom = fields['from'].substring(6, 11) + "-" + fields['from'].substring(0, 2) + "-" + fields['from'].substring(3, 5);
                        var newDateTo;
                        if (fields['to'] == "")
                            newDateTo = "1970-01-01";
                        else
                            newDateTo = fields['to'].substring(6, 11) + "-" + fields['to'].substring(0, 2) + "-" + fields['to'].substring(3, 5);
 
                        var entry = {
                            id: newId,
                            date_from: newDateFrom,
                            date_to: newDateTo,
                            message: fields['message'],
                            file: getFile,
                            file_title: $("#file_title").val()
                        };
                        if (allData[sqlToIndex($("#classId").val())]['assignments'].length != 0)
                        {
                            for (var i = 0; i < allData[sqlToIndex($("#classId").val())]['assignments'].length; i++)
                            {
                                var checkDate = allData[sqlToIndex($("#classId").val())]['assignments'][i]['date_from'];
                                if (fields['from'].substring(0, 2) >= checkDate.substring(5, 7) && fields['from'].substring(3, 5) >= checkDate.substring(8, 11) && fields['from'].substring(6, 10) >= checkDate.substring(0, 4)) {
                                    allData[sqlToIndex($("#classId").val())]['assignments'].splice(i, 0, entry);
                                    break;
                                }
                                else if (i == allData[sqlToIndex($("#classId").val())]['assignments'].length - 1) {
                                    allData[sqlToIndex($("#classId").val())]['assignments'].push(entry);
                                    break;
                                }
                            }
                        }
                        else //First assignment, just add it
                        {
                            allData[sqlToIndex($("#classId").val())]['assignments'].push(entry);
                        }
                        setPostAssignmentLoading(false);
                        postAssignmentExit();
                    }
                }
            });
        }
        else  { // For editing an assignments
            setPostAssignmentLoading(true);
            $("#post_assignment_form").ajaxSubmit({
                success: function(text) {
                     
                    if (text == "error") {
                        notify("An error occured.", 200);
                        setPostAssignmentLoading(false);
                    }
                    else if (text == "done") //Successfully updated assignment
                    {
                        notify("Assignment updated.", 150);
 
                        //Change date sytax to match from Database
                        var newDateFrom = fields['from'].substring(6, 11) + "-" + fields['from'].substring(0, 2) + "-" + fields['from'].substring(3, 5);
                        var newDateTo;
                        if (fields['to'] == "")
                            newDateTo = "1970-01-01";
                        else
                            newDateTo = fields['to'].substring(6, 11) + "-" + fields['to'].substring(0, 2) + "-" + fields['to'].substring(3, 5);
 
                        if ($("#fileClicked").val() == "false") {
                            var entry = {
                                id: $("#postId").val(),
                                date_from: newDateFrom,
                                date_to: newDateTo,
                                message: fields['message'],
                                file: allData[sqlToIndex($("#classId").val())]['assignments'][postSqlToIndex($("#postId").val(), $("#classId").val())]['file'],
                                file_title: allData[sqlToIndex($("#classId").val())]['assignments'][postSqlToIndex($("#postId").val(), $("#classId").val())]['file_title']
                            };
                        }
                        else
                            var entry = {
                                id: $("#postId").val(),
                                date_from: newDateFrom,
                                date_to: newDateTo,
                                message: fields['message'],
                                file: $("#file").val(),
                                file_title: $("#file_title").val()
                            };
                         
                        allData[sqlToIndex($("#classId").val())]['assignments'].splice(postSqlToIndex($("#postId").val(), $("#classId").val()), 1);
                         
                        if (allData[sqlToIndex($("#classId").val())]['assignments'].length != 0)
                        {
                            for (var i = 0; i < allData[sqlToIndex($("#classId").val())]['assignments'].length; i++)
                            {
                                var checkDate = allData[sqlToIndex($("#classId").val())]['assignments'][i]['date_from'];
                                if (fields['from'].substring(0, 2) >= checkDate.substring(5, 7) && fields['from'].substring(3, 5) >= checkDate.substring(8, 11) && fields['from'].substring(6, 10) >= checkDate.substring(0, 4)) {
                                    allData[sqlToIndex($("#classId").val())]['assignments'].splice(i, 0, entry);
                                    break;
                                }
                                else if (i == allData[sqlToIndex($("#classId").val())]['assignments'].length - 1) {
                                    allData[sqlToIndex($("#classId").val())]['assignments'].push(entry);
                                    break;
                                }
                            }
                        }
                        else //only assignment, just add it
                        {
                            allData[sqlToIndex($("#classId").val())]['assignments'].push(entry);
                        }
                         
                        postAssignmentExit();
                        setPostAssignmentLoading(false);
                    } else {
                        setPostAssignmentLoading(false);
                        alert(text);
                    }
                }
            });
        }
         
        return false;
    }
    return false;
}

var isPostAssignmentLoading = false;
function setPostAssignmentLoading(mode)
{
    if (mode && isPostAssignmentLoading === false)
    {
        isPostAssignmentLoading = true;
        $("#post_assignment_loader").slideDown(1);
        $("#post_assignment_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isPostAssignmentLoading === true)
    {
        isPostAssignmentLoading = false;
        $("#post_assignment_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#post_assignment_loader").slideUp(1);
        }, 100);
    }
}

// File system 2.0 (more like 1.1, but 2.0 sounds better)
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

function viewAssignments(classId) {
    dim();
    
    //Get index id
    var indexId = sqlToIndex(classId);
    
    $("#view_assignment_label").text("All Assignments - " + allData[indexId]['name']);
    $("#view_post_assignment_button").attr("onclick", "viewPostAssignment(" + classId + ");");
    
    
    //Fill with assignments
    var tops = 0;
    if (allData[sqlToIndex(classId)]['assignments'].length == 0) {
        setTimeout(function() {
            $("#assignment_empty_message").css("display", "inline");
            $("#assignment_empty_message").animate({opacity: "1"}, {queue: false, duration: 200});
        }, 200);
    }
    else
    {
        for (var i = 0; i < allData[sqlToIndex(classId)]['assignments'].length; i++) {

            var postId = allData[indexId]['assignments'][i]['id'];
            var date1 = allData[indexId]['assignments'][i]['date_from'];
            var date2 = allData[indexId]['assignments'][i]['date_to'];

            date1 = date1.substring(5, 7) + "/" + date1.substring(8, 11) + "/" + date1.substring(0, 4);
            var date3 = date2.substring(5, 7) + "/" + date2.substring(8, 11) + "/" + date2.substring(0, 4);

            var date;
            if (date2 == "1970-01-01")
                date = date1;
            else
                date = date1 + " - " + date3;
            
            var message = allData[indexId]['assignments'][i]['message'];
            var file = allData[indexId]['assignments'][i]['file'];
            var fileTitle = allData[indexId]['assignments'][i]['file_title'];
            $("<div id='post_" + postId + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                    "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                    "<p class='create_class_labels' id='view_assignment_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + "</b></p></div>" +
                    "<div onclick='deleteAssignment(" + postId + ", " + classId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                    "<img id='post_" + postId + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Assignment' /></div>" +
                    "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                    "<img id='post_" + postId + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editAssignment(" + classId + ", " + postId + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Assignment' /></div>" +
                    "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                    "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                    "<p class='create_class_labels' id='file_display_slot_" + postId + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span>" +
                    "</p></div></div>"
                    ).appendTo("#assignment_holder");
            var oldHeight = $("#post_" + postId).height();
            if (file == "") {
                $("#file_display_slot_" + postId).remove();
                $("#post_" + postId).css("paddingBottom", "0px");
                oldHeight -= 10;
            }
            tops = tops + 21 + oldHeight;
        }
    }
    $("#view_assignment_panel").animate({left: "100px"}, {queue: false, duration: 200});
    $("#load_more_animation").css("opacity", "1");
    $("#load_more_assignments_button").attr("disabled", "true");
    $("#load_more_assignments_button").html("More Assignments...");
    $("#load_more_assignments_button").removeAttr("onclick");
    $("#view_assignment_panel_exit").removeAttr("onclick");
    
    //AJAX load if you have more classes
    var xmlhttp2;
    if (window.XMLHttpRequest)
        xmlhttp2 = new XMLHttpRequest();
    else
        xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp2.onreadystatechange = function() {
        if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
        {
           $("#load_more_animation").css("opacity", "0");
           var text = xmlhttp2.responseText;
           if (text == "error")
               alert("Warning: a pretty bad error occured. You shouldn't be seeing this.");
           else {
                if (text > allData[sqlToIndex(classId)]['loaded_to']) {
                    $("#load_more_assignments_button").removeAttr("disabled");
                    $("#load_more_assignments_button").attr("onclick", "loadMoreAssignments(" + classId + ");");
                } else {
                    $("#load_more_assignments_button").html("No More Assignments");
                }
           }
           $("#view_assignment_panel_exit").attr("onclick", "viewAssignmentsExit(true);");
        }
    }
    xmlhttp2.open("POST", "./ajax_php/getClassAssignmentCount.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("classId=" + classId);

}

function viewAssignmentsExit(shouldDim) {
    $("#view_assignment_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#view_assignment_panel").css("left", "-610px");
            $("#assignment_holder").empty();
            $("#assignment_empty_message").css("display", "none");
            $("#assignment_empty_message").css("opacity", "0");
        }});
    if (shouldDim)
        undim();
}

function deleteAssignment(postId, classId) {
    if (confirm("Delete this post and all its data?")) {
        //Delete the class
        setViewAssignmentLoading(true);
        var xmlhttp2;
        if (window.XMLHttpRequest)
            xmlhttp2 = new XMLHttpRequest();
        else
            xmlhttp2 = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttp2.onreadystatechange = function() {
            if (xmlhttp2.readyState == 4 && xmlhttp2.status == 200)
            {
                var text = xmlhttp2.responseText;
                setViewAssignmentLoading(false);
                if (text == "done") {
                    notify("Assignment Deleted.", 150);
                    
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
                        for (var i = postSqlToIndex(postId, classId); i < allData[sqlToIndex(classId)]['assignments'].length; i++)
                        {
                            $("#post_" + allData[sqlToIndex(classId)]['assignments'][i]['id']).animate({top: "-=" + height + "px"}, {queue: false, duration: 100});
                        }
                        allData[sqlToIndex(classId)]['assignments'].splice(postSqlToIndex(postId, classId), 1);

                        if (allData[sqlToIndex(classId)]['assignments'].length == 0) {
                            $("#assignment_empty_message").css("display", "inline");
                            $("#assignment_empty_message").animate({opacity: "1"}, {queue: false, duration: 200});
                        }
                    }, 500);
                } else {
                    alert(text);
                    notify("An error occured.", 150);
                }
            }
        };
        xmlhttp2.open("POST", "./ajax_php/deleteAssignment.php", true);
        xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp2.send("post=" + postId + "&class=" + classId);
    }
}

//Loader
var isViewAssignmentLoading = false;
//Loading dimmer
function setViewAssignmentLoading(mode)
{
    if (mode && isViewAssignmentLoading === false)
    {
        isViewAssignmentLoading = true;
        $("#view_assignment_loader").slideDown(1);
        $("#view_assignment_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isViewAssignmentLoading === true)
    {
        isViewAssignmentLoading = false;
        $("#view_assignment_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#view_assignment_loader").slideUp(1);
        }, 100);
    }
}

function postSqlToIndex(postId, classId) {
    for (var i = 0; i < allData[sqlToIndex(classId)]['assignments'].length; i ++) {
        if (postId == allData[sqlToIndex(classId)]['assignments'][i]['id'])
            return i;
    }
    return -1;
}

function viewPostAssignment(classId) {
    viewAssignmentsExit(false);
    postAssignment(classId, true);
}

var isFileForEdit = false;

function editAssignment(classId, postId) {
    viewAssignmentsExit(false);
    
    var fromDate = allData[sqlToIndex(classId)]['assignments'][postSqlToIndex(postId, classId)]['date_from'];
    var toDate = allData[sqlToIndex(classId)]['assignments'][postSqlToIndex(postId, classId)]['date_to'];
    var message = allData[sqlToIndex(classId)]['assignments'][postSqlToIndex(postId, classId)]['message'];

    fromDate = fromDate.substring(5, 7) + "/" + fromDate.substring(8, 11) + "/" + fromDate.substring(0, 4);
    if (toDate == "1970-01-01")
        toDate = "";
    else
        toDate = toDate.substring(5, 7) + "/" + toDate.substring(8, 11) + "/" + toDate.substring(0, 4);
    
    if (allData[sqlToIndex(classId)]['assignments'][postSqlToIndex(postId, classId)]['file_title'] == "") {
        postAssignment(classId, true);
    }
    else {
        postAssignment(classId, false);
    }
    
    $("#post_for_class_label").text("Edit Assignment - " + allData[sqlToIndex(classId)]['name']);
    $("#message").val(message);
    $("#from_date").val(fromDate);
    $("#to_date").val(toDate);
    $("#post_assignment_submit").text("Update Assignment");
    $("#post_assignment_form").attr("action", "./ajax_php/editAssignment.php");
    
    $("#postId").val(postId);
    $("#fileClicked").val("false");
}

function loadMoreAssignments(classId) {
    $("#load_more_assignments_button").attr("disabled", "true");
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
                var dateFrom = entry[1].childNodes[0].nodeValue;
                var dateTo = entry[2].childNodes[0].nodeValue;
                var message = entry[3].childNodes[0].nodeValue;
                var file = entry[4].childNodes[0].nodeValue;
                if (file == "nofile")
                    file = "";
                var file_title = entry[5].childNodes[0].nodeValue;
                if (file_title == "nofile")
                    file_title = "";
               
                
                // Insert into loaded array
                var dataEntry = {
                    id: postId,
                    date_from: dateFrom,
                    date_to: dateTo,
                    message: message,
                    file: file,
                    file_title: file_title
                };
                
                var indexId = sqlToIndex(classId);
                
                //Check if post has already been loaded
                for (var k = 0; k < allData[indexId]['assignments'].length; k ++) {
                    if (allData[indexId]['assignments']['id'] == postId)
                        continue outer;
                }
                
                if (allData[indexId]['assignments'].length != 0)
                {
                    for (var i = 0; i < allData[indexId]['assignments'].length; i++)
                    {
                        var checkDate = allData[indexId]['assignments'][i]['date_from'];
                        if (dateFrom.substring(5, 7) >= checkDate.substring(5, 7) && dateFrom.substring(8, 11) >= checkDate.substring(8, 11) && dateFrom.substring(0, 4) >= checkDate.substring(0, 4)) {
                            allData[indexId]['assignments'].splice(i, 0, dataEntry);
                            break;
                        }
                        else if (i == allData[indexId]['assignments'].length - 1) {
                            allData[indexId]['assignments'].push(dataEntry);
                            break;
                        }
                    }
                } else {
                     allData[indexId]['assignments'].push(dataEntry);
                }
            }
            
            //Check for more
            allData[indexId]['loaded_to'] = allData[indexId]['loaded_to'] + 15;
            
            $("#load_more_animation").css("opacity", "0");
            if (totalPostCount > allData[indexId]['loaded_to']) {
                $("#load_more_assignments_button").removeAttr("disabled");
                $("#load_more_assignments_button").html("More Assignments...");
            } else {
                $("#load_more_assignments_button").html("No More Assignments");
            }
            
            $("#view_assignment_panel_exit").attr("onclick", "viewAssignmentsExit(true);");
            
            //Now, re-draw the data in the appropriete div
            $("#assignment_holder").empty();

            //Fill with assignments
            var tops = 0;


            for (var i = 0; i < allData[indexId]['assignments'].length; i++) {

                var postId = allData[indexId]['assignments'][i]['id'];
                
                
                if ($("#post_" + postId).length > 0) { // Check if element exists already for repeats
                    allData[indexId]['assignments'].splice(i, 1);
                    i--;
                    continue;
                }
                
                var date1 = allData[indexId]['assignments'][i]['date_from'];
                var date2 = allData[indexId]['assignments'][i]['date_to'];

                date1 = date1.substring(5, 7) + "/" + date1.substring(8, 11) + "/" + date1.substring(0, 4);
                var date3 = date2.substring(5, 7) + "/" + date2.substring(8, 11) + "/" + date2.substring(0, 4);

                var date;
                if (date2 == "1970-01-01")
                    date = date1;
                else
                    date = date1 + " - " + date3;
                var message = allData[indexId]['assignments'][i]['message'];
                var file = allData[indexId]['assignments'][i]['file'];
                var fileTitle = allData[indexId]['assignments'][i]['file_title'];

                $("<div id='post_" + postId + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;background-color:whitesmoke;padding:10px'>" +
                        "<div style='position:absolute;left:5px;top:0px;right:0px;height:15px;'>" +
                        "<p class='create_class_labels' id='view_assignment_label' style='white-space:nowrap;font-size:17px;line-height:0px'><b>" + date + "</b></p></div>" +
                        "<div onclick='deleteAssignment(" + postId + ", " + classId + ");' style='position:absolute;right:0px;top:0px;height:25px;width:25px;cursor:pointer;' onmouseover='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#post_" + postId + "_delete&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);'>" +
                        "<img id='post_" + postId + "_delete' src='./images/delete_icon.png' height='25px' width='25px' title='Delete Assignment' /></div>" +
                        "<div style='position:absolute;right:30px;top:0px;width:25px;height:25px;cursor:pointer;'>" +
                        "<img id='post_" + postId + "_edit' style='position:absolute;left:2px;top:2px;' onclick='editAssignment(" + classId + ", " + postId + ")' src='./images/edit_icon.png' height='20px' width='20px' title='Edit Assignment' /></div>" +
                        "<p class='create_class_labels' style='font-size:16px'>" + message + "</p>" +
                        "<div style='position:absolute;left:0px;bottom:0px;right:0px;white-space:nowrap;height:25px;line-height:0px;padding-left:10px;'>" +
                        "<p class='create_class_labels' id='file_display_slot_" + postId + "' style='font-size:14px;'>Attached file: <span style='cursor:pointer' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span>" +
                        "</p></div></div>"
                        ).appendTo("#assignment_holder");

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
    xmlhttp2.open("POST", "./ajax_php/getMoreAssignments.php", true);
    xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp2.send("classId=" + classId + "&start=" + allData[sqlToIndex(classId)]['loaded_to']);
}