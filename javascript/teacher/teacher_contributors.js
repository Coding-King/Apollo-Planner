/**
 * Slide over the contributor pane
 * 
 * @param {type} typeAndId
 * @returns {undefined}
 */

var foundStudents;
var selectedStudents;
var globTypeAndId;

function contribute(typeAndId) {
    
    foundStudents = new Array();
    selectedStudents = new Array();
    globTypeAndId = typeAndId;
    
    dim();
    $("#contribute_panel").css("left", "-710px");
    $("#contribute_panel").animate({left: "50px"}, {queue: false, duration: 200});
    var split = typeAndId.split("_");
    var type = split[0];
    var SQLid = split[1];
    
    if (type == "class") {
        $("#contribute_for_label").text("Manage contributors for " + allData[sqlToIndex(SQLid)]['name']);
    } else {
        $("#contribute_for_label").text("Manage contributors for " + feedData[feedSqlToIndex(SQLid)]['name']);
    }
    
    $("#contribute_dimmer").css("opacity", ".4");
    $("#contribute_dimmer").css("display", "inline");
    $("#contribute_loader").css("display", "inline");
    $("#contribute_loader").css("opacity", "1");
    $("#contribute_loading_text").text("Fetching contributors...");
    
    //XML get contributors
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            
            //undo loading
            $("#contribute_dimmer").css("opacity", "0");
            $("#contribute_dimmer").css("display", "none");
            $("#contribute_loader").css("display", "none");
            $("#contribute_loader").css("opacity", "0");
            
            if (text == "none") {
                // no current contributors
                $("#left_message").css("display", "inline");
                $("#left_message_text").html("Enter a search query to find students");
                $("#right_message").css("display", "inline");
                $("#right_message_text").html("No current contributors");
            } else if (text == "error") {
                notify("An error occured.", 150);
            } else {
                $("#left_message").css("display", "inline");
                $("#left_message_text").html("Enter a search query to find students");
                //parse xml
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
                    
                    if (selectedStudentsContains(selectedStudents, id)) 
                        continue;
                    
                    var name = entry[1].childNodes[0].nodeValue;
                    var entry = {
                        id: id,
                        name: name
                    };
                    selectedStudents.push(entry);
                    
                    //add to display
                    $("<div id='edit_student_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;height:50px;background-color:whitesmoke;'>"
                            + "<div style='position:absolute;left:5px;top:-15px;right:5px;bottom:5px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels'>" + name + "</p></div>"
                            + "<div style='position:absolute;left:5px;right:5px;text-align:right;bottom:0px;top:15px;'>"
                            + "<p id='asdf2' onclick='removeContributor(" + id + "); 'onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);'"
                            + "onmouseout ='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' class='create_class_labels' style='font-size:14px;cursor:pointer;'>Remove</p></div></div>"
                            ).appendTo("#right_panel");
                    tops += 52;
                }
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/getContributors.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("type=" + type + "&id=" + SQLid);
}

function searchStudents() {
    
    var query = $("#search_query").val();
    
    if (query == "") {
        $("#search_query").css("backgroundColor", "red");
        setTimeout(function() {
            $("#search_query").css("backgroundColor", "white");
            setTimeout(function() {
                $("#search_query").css("backgroundColor", "red");
                setTimeout(function() {
                    $("#search_query").css("backgroundColor", "white");
                }, 150);
            }, 150);
        }, 150);
        return;
    }
    
    foundStudents.length = 0;
    $("#left_panel").empty();
    $("#left_message").css("display", "none");
    
    $("#contribute_dimmer").css("opacity", ".4");
    $("#contribute_dimmer").css("display", "inline");
    $("#contribute_loader").css("display", "inline");
    $("#contribute_loader").css("opacity", "1");
    $("#contribute_loading_text").text("Searching for Students...");
    
    //XML get contributors
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            
            $("#contribute_dimmer").css("opacity", "0");
            $("#contribute_dimmer").css("display", "none");
            $("#contribute_loader").css("display", "none");
            $("#contribute_loader").css("opacity", "0");
            
            if (text == "error") {
                notify("An error occurred.", 150);
            } else if (text == "none") {
                //None found$("#feed_left_loader").css("display", "none");
                $("#left_message").css("display", "inline");
                $("#left_message_text").html("No students found");
                
            } else {
                //xml parse
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
                    
                    if (selectedStudentsContains(selectedStudents, id)) 
                        continue;
                    
                    var name = entry[1].childNodes[0].nodeValue;
                    var entry = {
                        id: id,
                        name: name
                    };
                    foundStudents.push(entry);
                    
                    //add to display
                    $("<div id='found_student_" + id + "' style='overflow:hidden;position:absolute;left:0px;top:" + tops + "px;right:0px;height:50px;background-color:whitesmoke;'>"
                            + "<div style='position:absolute;left:5px;top:-15px;right:5px;bottom:5px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels'>" + name + "</p></div>"
                            + "<div style='cursor:pointer;position:absolute;left:230px;right:5px;text-align:right;bottom:0px;top:15px;' onclick='addContributor(" + id + ");' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);'"
                            + " onmouseout ='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);'><p class='create_class_labels' style='font-size:14px;'>Add</p></div></div>"
                            ).appendTo("#left_panel");
                     tops += 52;
                }
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/searchStudents.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("query=" + query);
    
    return false;
}

function removeContributor(id) {
    var indexId = selectedStudentsSQLtoIndex(id);
    var heightChange = $("#edit_student_" + id).css("height");
    
    $("#edit_student_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#edit_student_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < selectedStudents.length; i++) {
        if (i == indexId)
            continue;
        $("#edit_student_" + selectedStudents[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#edit_student_" + selectedStudents[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    setTimeout(function() {
        $("#edit_student_" + id).remove();
        if (selectedStudents.length == 0) {
            $("#right_message").css("display", "inline");
            $("#right_message_text").html("No current contributors");
        }
    }, 200);
    //Remove from editClasses
    for (var i = 0; i < selectedStudents.length; i ++) {
        if (selectedStudents[i]['id'] == id)
            selectedStudents.splice(i, 1);
    }
}

function addContributor(id) {
    
    $("#right_message").css("display", "none");
    
    var indexId = foundStudentsSQLtoIndex(id);
    
    //Get data
    var addId = foundStudents[indexId]['id'];
    var addName = foundStudents[indexId]['name'];
    
    var studentName = addName.toLowerCase();
    var idAfter = -1;
    for (var i = 0; i < selectedStudents.length; i ++) {
        var newName = selectedStudents[i]['name'].toLowerCase();
        if (studentName > newName) {
            idAfter = selectedStudents[i]['id'];
        }
    }
    
    
    //Animate remove
    var heightChange = $("#found_student_" + id).css("height");
    $("#found_student_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#found_student_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < foundStudents.length; i++) {
        $("#found_student_" + foundStudents[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#found_student_" + foundStudents[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    
    setTimeout(function() {
        $("#found_student_" + id).remove();
    }, 100);
    
    var entry = {
        id: addId,
        name: addName
    };

//    Add to selected students
    if (idAfter == -1)
        selectedStudents.splice(0, 0, entry);
    else
        selectedStudents.splice(selectedStudentsSQLtoIndex(idAfter) + 1, 0, entry);

    //Remove from found students
    for (var i = 0; i < foundStudents.length; i ++) {
        if (foundStudents[i]['id'] == addId)
            foundStudents.splice(i, 1);
    }
    
    //Animate the students making room for new one
    if (idAfter == -1) {
        for (var i = 0; i < selectedStudents.length; i ++) {
            $("#edit_student_" + selectedStudents[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_student_" + selectedStudents[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    } else {
        var index = selectedStudentsSQLtoIndex(idAfter) + 1; // Plus one for after
        for (var i = index; i < selectedStudents.length; i ++) {
            $("#edit_student_" + selectedStudents[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_student_" + selectedStudents[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    }
    
    
    //add to display
    $("<div id='edit_student_" + addId + "' style='overflow:hidden;position:absolute;left:0px;top:0px;right:0px;height:50px;background-color:whitesmoke;'>"
            + "<div style='position:absolute;left:5px;top:-15px;right:5px;bottom:5px;overflow:hidden;white-space:nowrap;'>"
            + "<p class='create_class_labels'>" + addName + "</p></div>"
            + "<div style='cursor:pointer;position:absolute;left:230px;right:5px;text-align:right;bottom:0px;top:15px;' onclick='removeContributor(" + addId + "); 'onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout ='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);'>"
            + "<p class='create_class_labels' style='font-size:14px;'>Remove</p></div></div>"
            ).appendTo("#right_panel");


    if (idAfter != -1) {
        var top1 = parseInt($("#edit_student_" + idAfter).css("height").replace("px", ""));
        var top2 = parseInt($("#edit_student_" + idAfter).css("top").replace("px", ""));
        var top3 = top1 + top2 + 2;//2 for border
        $("#edit_student_" + addId).css("top", top3 + "px");
    }
   
    //Animate new div
    $("#edit_student_" + addId).css("right", "+=335px");
    $("#edit_student_" + addId).css("opacity", "0");
    $("#edit_student_" + addId).animate({right: "0px"}, {queue: false, duration: 200});
    $("#edit_student_" + addId).animate({opacity: "1"}, {queue: false, duration: 200});
}

function saveContribute() {
    $("#contribute_dimmer").css("display", "inline");
    $("#contribute_dimmer").animate({opacity: ".4"}, {queue: false, duration: 200});
    $("#contribute_loader").css("display", "inline");
    $("#contribute_loader").animate({opacity: "1"}, {queue: false, duration: 200});
    $("#contribute_loading_text").text("Saving...");
    
    //Get all classes as string
    var studentsString = "";
    for (var i = 0; i < selectedStudents.length; i ++) {
        studentsString += selectedStudents[i]['id'] + "_";
    }
    
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            $("#contribute_dimmer").css("display", "none");
            $("#contribute_dimmer").css("display", "none");
            $("#contribute_loader").css("opacity", "0");
            $("#contribute_loader").css("opacity", "0");
            
            var text = xmlhttp.responseText;
            
            if (text == "error") {
                notify("An error occured.", 150);
            } else if (text == "done") {
                exitContribute();
                notify("Contributors updated.", 150);
            } else {
                alert(text);
            }
        }
    };
    xmlhttp.open("POST", "./ajax_php/setContributors.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("students=" + studentsString + "&type_id=" + globTypeAndId);
}

function exitContribute() {
    $("#contribute_panel").animate({left: "810px"}, {queue: false, duration: 200});
    $("#contribute_for_label").text("");
    $("#right_message").css("display", "none");
    $("#left_message").css("display", "none");
    selectedStudents.length = 0;
    foundStudents.length = 0;
    $("#search_query").val("");
    $("#left_panel").empty();
    $("#right_panel").empty();
    undim();
}

// Not for general use, use only with selectedStudents
function selectedStudentsContains(array, value) {
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

function foundStudentsSQLtoIndex(SQLid) {
    for (var i = 0; i < foundStudents.length; i++)
    {
        if (foundStudents[i]['id'] == SQLid)
        {
            return i;
        }
    }
}

function selectedStudentsSQLtoIndex(SQLid) {
    for (var i = 0; i < selectedStudents.length; i++)
    {
        if (selectedStudents[i]['id'] == SQLid)
        {
            return i;
        }
    }
}