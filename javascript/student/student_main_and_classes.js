var highlightColor = "9A2EFE";
var editClasses;
var foundClasses;
var changes;

function loader() {
    
    //Date picker initializers
    $("#from_date").datepicker();
    $("#to_date").datepicker();
    
    $("#user_menu_text").text(email);
    if (numClasses > 0) {
        $("<div id='all_classes' onclick='showClasses(0);' style='position:absolute;left:0px;top:0px;right:0px;height:50px;background-color:whitesmoke;text-align:center;cursor:pointer;'>"
                + "<div style='position:absolute;top:5px;line-height:0px;left:10px;height:50px;'>"
                + "<p class='create_class_labels'>All Classes</p></div></div>"
                ).appendTo("#class_container");

        var topTracker = 52;
        for (var i = 0; i < numClasses; i++) {
            var sqlId = classData[i]['id'];
            var className = classData[i]['name'];
            var teacherName = classData[i]['owner_name'];
            var website = classData[i]['website'];

            $("<div class='left_classes' id='class_" + sqlId + "' onclick='showClasses(" + sqlId + ");' style='cursor:pointer;position:absolute;left:0px;top:" + topTracker + "px;height:50px;right:0px;background-color:whitesmoke;'>"
                    + "<div style='position:absolute;left:5px;top:-5px;right:30px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:20px;'>" + className + "</p></div>"
                    + "<div style='position:absolute;left:5px;top:20px;right:5px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:14px;'>" + teacherName + "</p></div>"
                    + "<a id='classlink_" + i + "' href='" + website + "'><img id='classimg_" + i + "' src ='./images/web_icon.png' width='20px' height='20px' title='Click to visit class website' style='position:absolute;top:5px;right:5px;width:20px;height:20px;cursor:pointer;'/></a></div>"
                    ).appendTo("#class_container");
                        
                        if (website == "http://") {
                            $("#classlink_" + i).remove();
                            $("#classimg_" + i).remove();
                        }

                    topTracker += 52;
                    
        }
        
        showClasses(0);
                    
    }
    else {
        setTimeout(function() {
            $("#no_class_indicator").css("display", "inline");
        $("#no_class_indicator").animate({opacity: ".7"}, {queue: false, duration: 200});
        }, 200);
    }
}

function showClasses(classId) {
    //Clear stuffs
    $("#assignment_container").empty();
    $("#all_classes").css("backgroundColor", "whitesmoke");
    for (var i = 0; i < numClasses; i ++) {
        $("#class_" + classData[i]['id']).css("backgroundColor", "whitesmoke");
    }
    
    if (classId == 0) {
        //Load most rescent post from each class
        //Header
        $("<div style='position:absolute;left:0px;top:0px;right:0px;height:30px;background-color:whitesmoke;'>"
                + "<div style='position:absolute;left:5px;top:-5px;height:25px;right:0px;line-height:0px;'>"
                + "<p class='create_class_labels' style='left:10px;font-size:20px;'>Most Recent Assignments</p></div>"
                + "<div style='position:absolute;left:250px;right:10px;top:14px;height:1px;background-color:black;'></div></div>"
                ).appendTo("#assignment_container");
        var toggleTop = 32;
        //Add most recent assignment of all classes
        for (var i = 0; i < numClasses; i ++) {
            if (classData[i]['assignments'].length == 0)
                continue;
            var name = classData[i]['name'];
            var message = classData[i]['assignments'][0]['message'];
            var dateFrom = classData[i]['assignments'][0]['date_from'];
            var dateTo = classData[i]['assignments'][0]['date_to'];
            var fileName = classData[i]['assignments'][0]['file_title'];
            var file = classData[i]['assignments'][0]['file'];

            var newDate = dateFrom.substring(5, 7) + "/" + dateFrom.substring(8, 11);
            if (dateTo != "1970-01-01")
                newDate = getBigDateFormat(newDate + " - " + dateTo.substring(5, 7) + "/" + dateTo.substring(8, 11));
            else
                newDate = getDateFormat(newDate);
            
            $("<div id='assignment_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                    + "<div style='position:absolute;left:5px;top:-3px;height:30px;width:220px;line-height:0px;text-align:left;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:16px;'><b>" + name + "</b></p></div>"
                    + "<div style='position:absolute;right:5px;top:-3px;height:30px;width:220px;line-height:0px;text-align:right;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:16px;'><b>" + newDate + "</b></p></div>"
                    + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                    + "<div id = 'assignment_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                    + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileName + "</span></p></div></div>"
                    ).appendTo("#assignment_container");
            
            toggleTop += $("#assignment_" + i).height() + 22;
            
            if (file == "") {
                $("#assignment_file_" + i).empty();
                $("#assignment_" + i).css("paddingBottom", "0px");
                toggleTop -= 10;
            }
            
        }
        
        $("#all_classes").css("backgroundColor", highlightColor);
    } else {
        //Header
        var indexId = classSQLtoIndex(classId);
        
        //var indexId = classId;
        $("<div style='position:absolute;left:0px;top:0px;right:0px;height:30px;background-color:whitesmoke;'>"
                + "<div id='header_title' style='position:absolute;left:5px;top:-5px;height:25px;line-height:0px;'>"
                + "<p class='create_class_labels' style='left:10px;font-size:20px;'>" + classData[indexId]['name'] + "</p></div>"
                + "<div id='header_line' style='position:absolute;left:240px;right:10px;top:14px;height:1px;background-color:black;'></div></div>"
                ).appendTo("#assignment_container");
        $("#header_line").css("left", $("#header_title").css("width"));
        $("#header_line").css("left", "+=20px");
        var toggleTop = 32;
        
        //Check no assignments
        if (classData[indexId]['assignments'].length == 0) {
            $("<div id='no_assignments_sign' style='text-align:center;position:absolute;left:130px;right:130px;line-height:0px;top:200px;height:30px;background-color:white;opacity:0;border-radius:10px;'>"
                    + "<p style='font-size:15px' class='create_class_labels'>No assignments posted</p></div>").appendTo("#assignment_container");
            setTimeout(function() {
                $("#no_assignments_sign").animate({opacity: ".7"}, {queue: false, duration: 300});
            }, 100);
        }
        else {
            for (var i = 0; i < classData[indexId]['assignments'].length; i ++) {
                var message = classData[indexId]['assignments'][i]['message'];
                var dateFrom = classData[indexId]['assignments'][i]['date_from'];
                var dateTo = classData[indexId]['assignments'][i]['date_to'];
                var fileName = classData[indexId]['assignments'][i]['file_title'];
                var file = classData[indexId]['assignments'][i]['file'];

                var newDate = dateFrom.substring(5, 7) + "/" + dateFrom.substring(8, 11);
            if (dateTo != "1970-01-01")
                newDate = getBigDateFormat(newDate + " - " + dateTo.substring(5, 7) + "/" + dateTo.substring(8, 11));
            else
                newDate = getDateFormat(newDate);

                $("<div id='assignment_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                        + "<div style='position:absolute;left:5px;top:-3px;height:30px;right:5px;right:5px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                        + "<p class='create_class_labels' style='font-size:16px;'><b>" + newDate + "</b></p></div>"
                        + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                        + "<div id = 'assignment_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                        + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileName + "</span></p></div></div>"
                        ).appendTo("#assignment_container");

                toggleTop += $("#assignment_" + i).height() + 22;

                if (file == "") {
                    $("#assignment_file_" + i).empty();
                    $("#assignment_" + i).css("paddingBottom", "0px");
                    toggleTop -= 10;
                }

            }
            
            //Check if there's more posts available
            if (classData[indexId]['loaded_to'] < classData[indexId]['num_posts']) {
                $("<div title='Click to load older assignments' id='more_classes_" + indexId + "' onclick='loadMoreAssignments(" + indexId + ");' onmouseover='$(this).css(&#39;backgroundColor&#39;, &#39;837E7C&#39;);' onmouseout='$(this).css(&#39;backgroundColor&#39;, &#39;silver&#39;);' style='cursor:pointer;background-color:silver;position:absolute;left:0px;right:0px;top:"
                        + toggleTop + ";line-height:0px;text-align:center;height:30px;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>Load more assignments</p></div>").appendTo("#assignment_container");
            }
        }
        
        $("#class_" + classId).css("backgroundColor", highlightColor);
    }
}

function logout() {
    setLoading(true);
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            window.location = "./index.php";
        }
    }
    xmlhttp.open("POST", "./ajax_php/logout.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
    return false;
}

//Account menu stuff
var isAccountMenu = false;
function toggleMenu()
{
    if (isAccountMenu)
    {
        isAccountMenu = false;
        $("#account_menu").slideUp(100);
        $("#arrow").stop().animate(
                {rotation: 0},
        {
            duration: 100,
            step: function(now, fx) {
                $(this).css({"transform": "rotate(" + now + "deg)"});
            }
        }
        );
    }
    else
    {
        //Inflate menu, spin arrow
        isAccountMenu = true;

        $("#account_menu").slideDown(100);
        $("#arrow").stop().animate(
                {rotation: 180},
        {
            duration: 100,
            step: function(now, fx) {
                $(this).css({"transform": "rotate(" + now + "deg)"});
            }
        }
        );
    }
}
function accountHighlight()
{
    $("#account_panel").css("backgroundColor", "#E5E4E2");
}
function accountUnlight()
{
    if (!isAccountMenu)
        $("#account_panel").css("backgroundColor", "Silver");
}
function accountUnlight2()
{
    $("#account_panel").css("backgroundColor", "Silver");
}
function menuHighlight(item)
{
    $(item).css("backgroundColor", "white");
}
function menuUnlight(item)
{
    $(item).css("backgroundColor", "#E8E8E8");
}

//Dimmer
var isDimmed = false;
function dim()
{
    if (!isDimmed)
    {
        $("#dimmer").slideDown(1);
        $("#dimmer").animate({opacity: ".4"}, {queue: false, duration: 200});
        isDimmed = true;
    }
}

function undim()
{
    if (isDimmed)
    {
        $("#dimmer").animate({opacity: "0"}, {queue: false, duration: 200});
        setTimeout(function() {
            $("#dimmer").slideUp(1);
        }, 200);
        isDimmed = false;
    }
}

//Loader
var isLoading = false;
//Loading dimmer
function setLoading(mode)
{
    if (mode && isLoading === false)
    {
        isLoading = true;
        $("#loader").slideDown(1);
        $("#loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isLoading === true)
    {
        isLoading = false;
        $("#loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#loader").slideUp(1);
        }, 100);
    }
}

//scroll back to top
function scrollToTop()
{
    $("html, body").animate({scrollTop: 0}, 200);
    return false;
}

function functionEditClasses() {
    changes = false;
    $("#selector_left_panel").empty();
    $("#selector_right_panel").empty();
    $("#class_selector_dimmer").css("zIndex", "0");
    $("#class_selector_load_indicator").css("zIndex", "0");
    
    $("#class_selector").css("left", "-710px");
    $("#search_query").val("");
    $("#class_selector").animate({left: "50px"}, {queue: false, duration: 200});
    dim();
    
    $("#left_message").css("display", "inline");
    
    var tops = 0;
    editClasses = new Array();
    foundClasses = new Array();
    
    for (var i = 0; i < numClasses; i ++) {
        var id = classData[i]['id'];
        var name = classData[i]['name'];
        var ownerName = classData[i]['owner_name'];
        var periods = classData[i]['periods'];
        var description = classData[i]['description'];

        var entry = {
            id: id,
            name: name
        };
        editClasses.push(entry);
        
        var periodsf;
        if (periods.length === 1) // Only 1 period
        {
            //Only one period
            if (periods[0] == 0)
                periodsf = "- no period info -";
            else if (periods[0] == 1)
                periodsf = "1st Period";
            else if (periods[0] == 2)
                periodsf = "2nd Period";
            else if (periods[0] == 3)
                periodsf = "3rd Period";
            else
                periodsf = "" + periods[0] + "th Period";
        }
        else //Multiple periods
        {
            periodsf = "Periods: ";
            for (var j = 0; j < periods.length; j++)
            {
                periodsf = periodsf + periods[j];
                if (j != (periods.length - 1))
                    periodsf = periodsf + ", ";
            }
        }
        if (description === "")
            description = "- No description -";

        $("<div id='edit_class_" + id + "' style='position:absolute;left:0px;top:" + tops + "px;right:0px;height:100px;background-color:whitesmoke'>"
                + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
                + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + name + "</p></div>"
                + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
                + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + ownerName + "</p></div>"
                + "<div style='position:absolute;width:150px;text-align:right;right:5px;top:15px;height:25px;line-height:0px;'>"
                + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + periodsf + "</p></div>"
                + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>" + description + "</p></div>"
                + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
                + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='unsubscribe(" + id + ");' style='font-size:11px;'><b>Unsubscribe</b></p></div></div>"
                ).appendTo("#selector_right_panel");

        // Post-creation edits
        if (description == "- No description -") {
            $("#edit_class_" + id).css("height", "70px");
            tops -= 30;
        }
        tops += 102;
    }
}

function exitEditClasses() {
    if (changes && !confirm("Exit without saving changes?"))
        return;
    
    $("#class_selector").animate({left: "810px"}, {queue: false, duration: 200});
    editClasses.length = 0;
    foundClasses.length = 0;
    undim();        
}

function searchClasses() {
    
    var value = $("#search_query").val();
    
    if (value == "") {
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
    
    $("#left_message").css("display", "none");
    $("#left_loader").css("display", "inline");
    $("#selector_left_panel").empty();
    
    foundClasses.length = 0;
    
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
                $("#left_loader").css("display", "none");
                $("#left_message").css("display", "inline");
                $("#left_message_text").html("An error occured");
            }
            else if (text == "none") { // no classes found
                $("#left_loader").css("display", "none");
                $("#left_message").css("display", "inline");
                $("#left_message_text").html("No classes found");
            } else {
                //Parse the XML
                $("#left_loader").css("display", "none");
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
                    
                    if (arrayContains(editClasses, id))
                        continue;
                    var name = entry[1].childNodes[0].nodeValue;
                    var ownerName = entry[2].childNodes[0].nodeValue;
                    var periods = entry[3].childNodes[0].nodeValue;
                    var description = entry[4].childNodes[0].nodeValue;
                    if (description == "none")
                        description = "";
                    var periodsf;
                    
                    //Add to foundClasses
                    var entry = {
                        id: id,
                        name: name,
                        owner_name: ownerName,
                        description: description,
                        periods: periods
                    };
                    foundClasses.push(entry);
                    
                    if (periods.length === 1) // Only 1 period
                    {
                        //Only one period
                        if (periods[0] == 0)
                            periodsf = "- no period info -";
                        else if (periods[0] == 1)
                            periodsf = "1st Period";
                        else if (periods[0] == 2)
                            periodsf = "2nd Period";
                        else if (periods[0] == 3)
                            periodsf = "3rd Period";
                        else
                            periodsf = "" + periods[0] + "th Period";
                    }
                    else //Multiple periods
                    {
                        periodsf = "Periods: ";
                        for (var j = 0; j < periods.length; j++)
                        {
                            periodsf = periodsf + periods[j];
                            if (j != (periods.length - 1))
                                periodsf = periodsf + ", ";
                        }
                    }
                    if (description === "")
                        description = "- No description -";
                    
                    $("<div id='new_class_" + id + "' style='z-index:1;position:absolute;left:0px;top:" + tops + "px;right:0px;height:100px;background-color:whitesmoke'>"
                            + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
                            + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + name + "</p></div>"
                            + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
                            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + ownerName + "</p></div>"
                            + "<div style='position:absolute;width:150px;text-align:right;right:5px;top:15px;height:25px;line-height:0px;'>"
                            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + periodsf + "</p></div>"
                            + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
                            + "<p class='create_class_labels' style='font-size:13px;'>" + description + "</p></div>"
                            + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
                            + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='subscribe(" + id + ");' style='font-size:11px;'><b>Subscribe</b></p></div></div>"
                            ).appendTo("#selector_left_panel");

                    // Post-creation edits
                    if (description == "- No description -") {
                        $("#new_class_" + id).css("height", "70px");
                        tops -= 30;
                    }
                    tops += 102;
                }
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/searchClasses.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("search=" + value);
}

function unsubscribe(id) {
    changes = true;
    var indexId = editClassesSQLtoIndex(id);
    var heightChange = $("#edit_class_" + id).css("height");
    $("#edit_class_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#edit_class_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < editClasses.length; i++) {
        if (i == indexId)
            continue;
        $("#edit_class_" + editClasses[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#edit_class_" + editClasses[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    
    setTimeout(function() {
        $("#edit_class_" + id).remove();
    }, 200);
    
    
    //Remove from editClasses
    for (var i = 0; i < editClasses.length; i ++) {
        if (editClasses[i]['id'] == id)
            editClasses.splice(i, 1);
    }
    
}

function subscribe(id) {
    changes = true;
    var indexId = foundClassesSQLtoIndex(id);
    
    //Get data
    var addId = foundClasses[indexId]['id'];
    var addName = foundClasses[indexId]['name'];
    var addOwnerName = foundClasses[indexId]['owner_name'];
    var addPeriods = foundClasses[indexId]['periods'];
    var addDescription = foundClasses[indexId]['description'];
    
    var className = addName.toLowerCase();
    var idAfter = -1;
    for (var i = 0; i < editClasses.length; i ++) {
        var newName = editClasses[i]['name'].toLowerCase();
        if (className > newName) {
            idAfter = editClasses[i]['id'];
        }
    }
    
    
    //Animate remove
    var heightChange = $("#new_class_" + id).css("height");
    $("#new_class_" + id).animate({left: "+=335px"}, {queue: false, duration: 200});
    $("#new_class_" + id).animate({opacity: "0"}, {queue: false, duration: 200});
    
    for (var i = indexId; i < foundClasses.length; i++) {
        $("#new_class_" + foundClasses[i]['id']).animate({top: "-=" + heightChange}, {queue: true, duration: 200});
        $("#new_class_" + foundClasses[i]['id']).animate({top: "-=2px"}, {queue: true, duration: 10});
    }
    
    setTimeout(function() {
        $("#new_class_" + id).remove();
    }, 100);
    
    var entry = {
        id: addId,
        name: addName
    };


    //Add to editClasses
    if (idAfter == -1)
        editClasses.splice(0, 0, entry);
    else
        editClasses.splice(editClassesSQLtoIndex(idAfter) + 1, 0, entry);

    //Remove from foundClasses
    for (var i = 0; i < foundClasses.length; i ++) {
        if (foundClasses[i]['id'] == addId)
            foundClasses.splice(i, 1);
    }
    
    //Animate the classes making room for new one
    if (idAfter == -1) {
        //First new class, slide up all classes
        for (var i = 0; i < editClasses.length; i ++) {
            $("#edit_class_" + editClasses[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_class_" + editClasses[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    } else {
        var index = editClassesSQLtoIndex(idAfter) + 1; // Plus one for after
        for (var i = index; i < editClasses.length; i ++) {
            $("#edit_class_" + editClasses[i]['id']).animate({top: "+=" + heightChange}, {queue: true, duration: 200});
            $("#edit_class_" + editClasses[i]['id']).animate({top: "+=2px"}, {queue: true, duration: 10});
        }
    }
    

    //Add as div
    var periodsf;
    if (addPeriods.length === 1) // Only 1 period
    {
        //Only one period
        if (addPeriods[0] == 0)
            periodsf = "- no period info -";
        else if (addPeriods[0] == 1)
            periodsf = "1st Period";
        else if (addPeriods[0] == 2)
            periodsf = "2nd Period";
        else if (addPeriods[0] == 3)
            periodsf = "3rd Period";
        else
            periodsf = "" + addPeriods[0] + "th Period";
    }
    else //Multiple periods
    {
        periodsf = "Periods: ";
        for (var j = 0; j < addPeriods.length; j++)
        {
            periodsf = periodsf + addPeriods[j];
            if (j != (addPeriods.length - 1))
                periodsf = periodsf + ", ";
        }
    }
    if (addDescription === "")
        addDescription = "- No description -";

    $("<div id='edit_class_" + addId + "' style='position:absolute;left:0px;top:0px;right:0px;height:100px;background-color:whitesmoke'>"
            + "<div style='position:absolute;left:5px;top:-5px;line-height:0px;height:30px;right:5px;overflow:hidden;'>"
            + "<p class='create_class_labels' style='font-size:18px;white-space:nowrap;'>" + addName + "</p></div>"
            + "<div style='position:absolute;width:150px;left:5px;top:15px;height:25px;line-height:0px;'>"
            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + addOwnerName + "</p></div>"
            + "<div style='position:absolute;width:150px;text-align:right;right:5px;top:15px;height:25px;line-height:0px;'>"
            + "<p class='create_class_labels' style='font-size:15px;white-space:nowrap;'>" + periodsf + "</p></div>"
            + "<div style='position:absolute;left:5px;right:5px;bottom:14px;top:25px;overflow:hidden;'>"
            + "<p class='create_class_labels' style='font-size:13px;'>" + addDescription + "</p></div>"
            + "<div style='position:absolute;right:0px;bottom:0px;height:20px;line-height:0px;text-align:right;cursor:pointer;'>"
            + "<p class='class_label_font' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='unsubscribe(" + addId + ");' style='font-size:11px;'><b>Unsubscribe</b></p></div></div>"
            ).appendTo("#selector_right_panel");

    // Post-creation edits
    if (addDescription == "- No description -")
        $("#edit_class_" + addId).css("height", "70px");

    if (idAfter != -1) {
        var top1 = parseInt($("#edit_class_" + idAfter).css("height").replace("px", ""));
        var top2 = parseInt($("#edit_class_" + idAfter).css("top").replace("px", ""));
        var top3 = top1 + top2 + 2;//2 for border
        $("#edit_class_" + addId).css("top", top3 + "px");
    }
   
    //Animate new div
    $("#edit_class_" + addId).css("right", "+=335px");
    $("#edit_class_" + addId).css("opacity", "0");
    $("#edit_class_" + addId).animate({right: "0px"}, {queue: false, duration: 200});
    $("#edit_class_" + addId).animate({opacity: "1"}, {queue: false, duration: 200});
    
}

var isFeeds = false;
var isClasses = true;
// Insert fading "no X" sign on change
function feedsClick() {
    if (!isFeeds)
    {
        //move slides
        $("#no_class_indicator").css("display", "none");
        $("#no_class_indicator").css("opacity", "0");
        
        $("#class_container").animate({left: "-=250px"}, {queue: false, duration: 200});
        $("#feed_container").animate({left: "-=250px"}, {queue: false, duration: 200});
        setTimeout(function() {
            $("#assignment_container").animate({left: "-=470px"}, {queue: false, duration: 200});
            $("#post_container").animate({left: "-=470px"}, {queue: false, duration: 200});
        }, 100);
        
        //Change button
        $("#edit_subs_button").html("Edit Feeds");
        $("#edit_subs_button").attr("onclick", "functionEditFeeds();");
        
        isClasses = false;
        isFeeds = true;
        $("#panel_indicator").animate({left: "380px"}, {queue: false, duration: 200});
        
        if (feedData.length == 0) {
            $("#no_feed_indicator").css("display", "inline");
            setTimeout(function() {
                $("#no_feed_indicator").animate({opacity: ".7"}, {queue: false, duration: 400});
            }, 200);
        }
    }
}

function classesClick() {
    if (!isClasses)
    {
        //move slides
        $("#no_feed_indicator").css("display", "none");
        $("#no_feed_indicator").css("opacity", "0");
        
        $("#class_container").animate({left: "+=250px"}, {queue: false, duration: 200});
        $("#feed_container").animate({left: "+=250px"}, {queue: false, duration: 200});
        setTimeout(function() {
        $("#assignment_container").animate({left: "+=470px"}, {queue: false, duration: 200});
        $("#post_container").animate({left: "+=470px"}, {queue: false, duration: 200});
        }, 100);
        
        //Change button
        $("#edit_subs_button").html("Edit Classes");
         $("#edit_subs_button").attr("onclick", "functionEditClasses();");
        
        isFeeds = false;
        isClasses = true;
        $("#panel_indicator").animate({left: "120px"}, {queue: false, duration: 200});
        
        if (classData.length == 0) {
            $("#no_class_indicator").css("display", "inline");
            setTimeout(function() {
                $("#no_class_indicator").animate({opacity: ".7"}, {queue: false, duration: 400});
            }, 200);
        }
    }
}

function saveClassChanges() {
    $("#class_selector_dimmer").css("display", "inline");
    $("#class_selector_load_indicator").css("zIndex", "2");
    $("#class_selector_dimmer").animate({opacity: ".4"}, {queue: false, duration: 200});
    $("#class_selector_load_indicator").css("display", "inline");
    $("#class_selector_load_indicator").animate({opacity: "1"}, {queue: false, duration: 200});
    $("#class_selector_dimmer").css("zIndex", "2");

    
    //Get all classes as string
    var classesString = "";
    for (var i = 0; i < editClasses.length; i ++) {
        classesString += editClasses[i]['id'] + "_";
    }
    
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            $("#class_selector_dimmer").css("display", "none");
            $("#class_selector_load_indicator").css("zIndex", "0");
            $("#class_selector_dimmer").css("display", "none");
            $("#class_selector_load_indicator").css("opacity", "0");
            
            //For first class subscriptions
            $("#no_class_indicator").css("display", "none");
            $("#no_class_indicator").css("opacity", "0");
            
            var text = xmlhttp.responseText;
            if (text == "none") {
                changes = false;
                
                classData.length = 0;
                
                exitEditClasses();
                notify("Classes updated.", 200);
                
                $(".left_classes").remove();
                $("#assignment_container").empty();
                $("#all_classes").remove();
                
                setTimeout(function() {
                    $("#no_class_indicator").css("display", "inline");
                    $("#no_class_indicator").animate({opacity: ".7"}, {queue: false, duration: 200});
                }, 200);
            } else if (text == "error") {
                notify("An error occured.", 200);
            } else {
                //Parse XML
                changes = false;
                exitEditClasses();
                notify("Classes updated.", 200);
                $(".left_classes").remove();
                $("#assignment_container").empty();
                $("#all_classes").remove();

                //BEGIN PARSE

                classData.length = 0;

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
                var newClassCount = xmlDoc.documentElement.getAttribute("totalcount");
                //Reset class count
                numClasses = newClassCount;

                for (var h = 0; h < x.length; h++) {
                    var entry = x[h].childNodes;
                    var classId = entry[0].childNodes[0].nodeValue;
                    var name = entry[1].childNodes[0].nodeValue;
                    var ownerName = entry[2].childNodes[0].nodeValue;
                    var description = entry[3].childNodes[0].nodeValue;
                    var periods = entry[4].childNodes[0].nodeValue;
                    var website = entry[5].childNodes[0].nodeValue;
                    var numPosts = entry[6].childNodes[0].nodeValue;
                    var checkAssignments = entry[7].childNodes[0].nodeValue;
                    
                    //Specials
                    if (description == "none")
                        description = "";
                    
                    var assignmentArray = new Array();
                    
                    if (checkAssignments == "none") {
                        //do nothing?
                    } else {
                        //Parse posts
                        var assignments = entry[7].childNodes;
                        for (var i = 0; i < assignments.length; i ++) {
                            var post = assignments[i].childNodes;
                            var postId = post[0].childNodes[0].nodeValue;
                            var dateFrom = post[1].childNodes[0].nodeValue;
                            var dateTo = post[2].childNodes[0].nodeValue;
                            var message = post[3].childNodes[0].nodeValue;
                            var file = post[4].childNodes[0].nodeValue;
                            var fileTitle = post[5].childNodes[0].nodeValue;

                            //Specials
                            if (file == "nofile")
                                file = "";
                            if (fileTitle == "nofile")
                                fileTitle = "";

                            var assignmentEntry = {
                                id: postId,
                                date_from: dateFrom,
                                date_to: dateTo,
                                message: message,
                                file: file,
                                file_title: fileTitle
                            }
                            assignmentArray.push(assignmentEntry);
                        }
                    }
                    // Insert into loaded array
                    var dataEntry = {
                        id: classId,
                        name: name,
                        owner_name: ownerName,
                        description: description,
                        periods: periods,
                        website: website,
                        assignments: assignmentArray,
                        loaded_to: 15,
                        num_posts: numPosts
                    };
                    
                    
                    classData.push(dataEntry);
                }
                //Call loader to refresh to the new classes
                loader();
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/classSubscriptions.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("classes=" + classesString);
}

function loadMoreAssignments(indexId) {
    var top = $("#more_classes_" + indexId).css("top");
    $("#more_classes_" + indexId).remove();
    
    $("<div id='more_classes_" + indexId + "' style='cursor:pointer;background-color:#837E7C;position:absolute;left:0px;right:0px;top:"
          + top + ";text-align:center;height:30px;'><img src='images/loader.gif' height='25px' width='25px'></div>").appendTo("#assignment_container");
        
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
                $("#more_classes_" + indexId).remove();
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
                
                classData[indexId]['loaded_to'] += x.length;
                
                var toggleTop = parseInt(top.replace("px", ""));
                var oldLength = classData[indexId]['assignments'].length;
                
                //Reset class count
                for (var h = 0; h < x.length; h++) {
                    var entry = x[h].childNodes;
                    var id = entry[0].childNodes[0].nodeValue;
                    var dateFrom = entry[1].childNodes[0].nodeValue;
                    var dateTo = entry[2].childNodes[0].nodeValue;
                    var message = entry[3].childNodes[0].nodeValue;
                    var file = entry[4].childNodes[0].nodeValue;
                    var fileTitle = entry[5].childNodes[0].nodeValue;
                    if (file == "nofile")
                        file = "";
                    if (fileTitle == "nofile")
                        file = "";
                    
                    var assignmentEntry = {
                        id: id,
                        date_from: dateFrom,
                        date_to: dateTo,
                        message: message,
                        file: file,
                        file_title: fileTitle
                    };
                    classData[indexId]['assignments'].push(assignmentEntry);
                    //And finally, display in place
                    
                    var newDate = dateFrom.substring(5, 7) + "/" + dateFrom.substring(8, 11);
                    if (dateTo != "1970-01-01")
                        newDate = getBigDateFormat(newDate + " - " + dateTo.substring(5, 7) + "/" + dateTo.substring(8, 11));
                    else
                        newDate = getDateFormat(newDate);
                    
                    var i = h + oldLength;
                    $("<div id='assignment_" + i + "' style='position:absolute;left:0px;top:" + toggleTop + "px;right:0px;background-color:whitesmoke;padding:10px;overflow:hidden;'>"
                            + "<div style='position:absolute;left:5px;top:-3px;height:30px;right:5px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels' style='font-size:16px;'><b>" + newDate + "</b></p></div>"
                            + "<p class='create_class_labels' style='font-size:14px;'>" + message + "</p>"
                            + "<div id = 'assignment_file_" + i + "' style='position:absolute;left:5px;right:5px;bottom:3px;height:20px;line-height:0px;overflow:hidden;white-space:nowrap;'>"
                            + "<p class='create_class_labels' style='font-size:12px;'>Attached file: <span style='cursor:pointer;' onmouseover='$(this).css(&#39;textDecoration&#39;, &#39;underline&#39;);' onmouseout='$(this).css(&#39;textDecoration&#39;, &#39;none&#39;);' onclick='window.location.href=&#39;./uploads/" + file + "&#39;'>" + fileTitle + "</span></p></div></div>"
                            ).appendTo("#assignment_container");
                    toggleTop += $("#assignment_" + i).height() + 22;

                    if (file == "") {
                        $("#assignment_file_" + i).empty();
                        $("#assignment_" + i).css("paddingBottom", "0px");
                        toggleTop -= 10;
                    }
                }
                //Check for more and place loader if true
                if (classData[indexId]['loaded_to'] < classData[indexId]['num_posts']) {
                $("<div title='Click to load older assignments' id='more_classes_" + indexId + "' onclick='loadMoreAssignments(" + indexId + ");' onmouseover='$(this).css(&#39;backgroundColor&#39;, &#39;837E7C&#39;);' onmouseout='$(this).css(&#39;backgroundColor&#39;, &#39;silver&#39;);' style='cursor:pointer;background-color:silver;position:absolute;left:0px;right:0px;top:"
                        + toggleTop + ";line-height:0px;text-align:center;height:30px;'>"
                + "<p class='create_class_labels' style='font-size:13px;'>Load more assignments</p></div>").appendTo("#assignment_container");
                }
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/getMoreAssignments.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("classId=" + classData[indexId]['id'] + "&start=" + classData[indexId]['loaded_to']);
}

function classSQLtoIndex(SQLid) {
    for (var i = 0; i < classData.length; i++)
    {
        if (classData[i]['id'] == SQLid)
        {
            return i;
        }
    }
}

function foundClassesSQLtoIndex(SQLid) {
    for (var i = 0; i < foundClasses.length; i++)
    {
        if (foundClasses[i]['id'] == SQLid)
        {
            return i;
        }
    }
}

function editClassesSQLtoIndex(SQLid) {
    for (var i = 0; i < editClasses.length; i++)
    {
        if (editClasses[i]['id'] == SQLid)
        {
            return i;
        }
    }
}

// Not for general use, use only with edit classes
function arrayContains(array, value) {
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

//Slide down notification 
function notify(text, width)
{
    $("#notification_text").text(text);
    $("#notification_panel").css("width", width);
    $("#notification_panel").css("marginLeft", -(width / 2));
    $("#notification_panel").animate({top: "20px"}, {queue: false, duration: 200});
    setTimeout(function() {
        $("#notification_panel").animate({top: "-60px"}, {queue: false, duration: 200});
    }, 3000);
}

//Accepts 10/04 as October 4
function getDateFormat(input) {
    var monthday = input.split("/");
    var month = monthday[0];
    var day = monthday[1];
    if (day < 10)
        day = day.substring(1, 2);
    var monthString = "";
    switch (month) {
        case "01":
            monthString = "January";
            break;
        case "02":
            monthString = "February";
            break;
        case "03":
            monthString = "March";
            break;
        case "04":
            monthString = "April";
            break;
        case "05":
            monthString = "May";
            break;
        case "06":
            monthString = "June";
            break;
        case "07":
            monthString = "July";
            break;
        case "08":
            monthString = "August";
            break;
        case "09":
            monthString = "September";
            break;
        case "10":
            monthString = "October";
            break;
        case "11":
            monthString = "November";
            break;
        case "12":
            monthString = "December";
            break;
    }
    return monthString + " " + day;
}

//Accepts 10/09 - 10/11 OR 10/09 - 11/09

function getBigDateFormat(input) {
    var splits = input.split(" - ");
    var firstDate = (splits[0]).split("/");
    var secondDate = (splits[1]).split("/");
    
    if (firstDate[0] == secondDate[0]) {
        //same month
        if (secondDate[1] < 10)
            secondDate[1] = secondDate[1].substring(1, 2);
        return getDateFormat(splits[0]) + " - " + secondDate[1];
    } else {
        return getDateFormat(splits[0]) + " - " + getDateFormat(splits[1]);
    }
}

//Main Menu lights
function mmLight(item)
{
    $(item).css("backgroundColor", "Silver");
}

function mmUnlight(item)
{
    $(item).css("backgroundColor", "#837E7C");
}

//Underlining
function underline(item) {
    $(item).css("textDecoration", "underline");
}

function de_underline(item) {
    $(item).css("textDecoration", "none");
}