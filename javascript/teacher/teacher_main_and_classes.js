/**
 * Handles creating, deleting, and editing class info
 * 
 * As well as some universal functions including pane switching and basic feed
 * management
 * 
 */

//For the top alignment of class divs
var globalTop;
var globalFeedTop;

//For the height of entire page with changing Classes and Feeds
var classesMainHeight;
var feedsMainHeight;

var todaysDate;

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

function loader()
{
    
    // Get date for date display
    var today = new Date(); 
    var day = today.getDate(); 
    var month = today.getMonth()+1;//January is 0! 
    var year = today.getFullYear(); 
    if (day < 10)
        day = '0' + day; 
    if (month < 10)
        month = '0' + month;
    var date = month + "/" + day + "/" + year;
    todaysDate = date;

    //Date picker initializers
    $("#from_date").datepicker();
    $("#to_date").datepicker();
    
    $("#user_menu_text").text(email);
    
    //Feed management
    if (numFeeds == 0)
    {
        
        var feedTop = 20;
        //Reconstruct site dimensions to match length
        globalFeedTop = feedTop;
        $("#feeds_panel").css("height", "" + (feedTop + 70) + "px");
        feedsMainHeight = feedTop + 230;
    }
    else
    {
        var feedTop = 20;
        for (var i = 0; i < feedData.length; i++)
        {
            var name = feedData[i]['name'];
            var description = feedData[i]['description'];
            var website = feedData[i]['website'];
            var subscribers = feedData[i]['subscribers'];
            var thisId = feedData[i]['id'];
            var toBeId = "feed_" + thisId;

            if (description == "")
                description = "- No description -";

            //String it together
            $("<div id='" + toBeId + "' onmouseover='$(&#39;#" + toBeId +
                    "&#39;).css(&#39;boxShadow&#39;, &#39;5px 5px 5px black&#39;);'"
                    + " onmouseout='$(&#39;#" + toBeId + "&#39;).css(&#39;boxShadow&#39;, &#39;none&#39;);'"
                    + " style='position:absolute;left:20px;width:740px;background-color:scrollbar;top:" + feedTop + "px;height:100px;'>"
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
                    + "<p id='feed_subscribers_"+ thisId + "' style='color:black;font-family:&#39;Arial&#39;, Times, serif;font-size:16px;position:absolute;left:23px;text-align:left;top:-10px;'><b>" + subscribers + "</b></p></div>"
                    + "<div onmouseover='$(&#39;#feed_trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#feed_trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);' title='Delete Feed' onclick='deleteFeed(" + thisId + ");' style='position:absolute;right:0px;bottom:15px;height:30px;width:60px;overflow:hidden;cursor:pointer;'>"
                    + "<img id='feed_trash_" + thisId + "' src='./images/delete_icon.png' height='30px' width='30px' onclick='deleteFeed(" + thisId + "'style='position:absolute;left:13px;top:-5px;' /></div>"
                    + "</div>"
                    ).appendTo("#feeds_panel");

            if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
            {
                $("#feed_website_tt" + thisId).hide();
                $("#feed_website_" + thisId).hide();
            }

            feedTop = feedTop + 112;
        }

        $("#feeds_panel").css("height", "" + (feedTop + 70) + "px");
        globalFeedTop = feedTop;
        feedsMainHeight = feedTop + 230;
    }
    
    
    
    if (numClasses == 0)
    {
        var top = 20;
        //Reconstruct site dimensions to match length
        $("#classes_panel").css("height", "" + (top + 70) + "px");
        globalTop = top;
        classesMainHeight = top + 230;
        $("#center_body").css("height", classesMainHeight);
    }
    else
    {
        var top = 20;
        // How to access: alert(allData[1]['name']);
        for (var i = 0; i < allData.length; i++)
        {
            var name = allData[i]['name'];
            var description = allData[i]['description'];
            var website = allData[i]['website'];
            var periods = allData[i]['periods'].split("");
            var subscribers = allData[i]['subscribers'];
            var thisId = allData[i]['id'];
            var toBeId = "class_" + thisId;


            //Prep info for display
            var periodsf;
            if (periods.length === 1) // Only 1 period
            {
                //Only one period
                if (periods[0] == 0)
                    periodsf = "- No Period Information -";
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
            if (description == "")
                description = "- No description -";

            //String it together
            $("<div id='" + toBeId + "' onmouseover='$(&#39;#" + toBeId +
                    "&#39;).css(&#39;boxShadow&#39;, &#39;5px 5px 5px black&#39;);'"
                    + " onmouseout='$(&#39;#" + toBeId + "&#39;).css(&#39;boxShadow&#39;, &#39;none&#39;);'"
                    + " style='position:absolute;left:20px;width:740px;background-color:scrollbar;top:" + top + "px;height:100px;'>"
                    + "<div style='position:absolute;left:5px;top:-5px;width:300px;line-height:0px;height:50px;text-align:left;white-space:nowrap;overflow:hidden;'>"
                    + "<p id='name_" + thisId + "' class='class_label_font'>" + name + "</p></div>"
                    + "<div style='position:absolute;left:5px;top:25px;width:300px;line-height:0px;height:30px;text-align:left;'>"
                    + "<p id='periods_" + thisId + "' style='color:black;font-family: &#39;Arial&#39;, Times, serif;font-size:14px;'>" + periodsf + "</p></div>"
                    + "<div style='position:absolute;left:5px;top:35px;width:300px;height:65px;text-align:left;overflow:hidden;'>"
                    + "<p id='description_" + thisId + "' style='color:black;font-family: &#39;Arial&#39;, Times, serif;font-size:14px;'>" + description + "</p></div>"
                    + "<div style='position:absolute;left:320px;top:5px;bottom:5px;width:1px;background-color:black;'></div>"
                    + "<button title='Create and post a new homework assignment' onclick='postAssignment(" + thisId + ", true);' style='position:absolute;left:330px;width:150px;height:30px;top:15px;cursor:pointer;'>Post Homework</button>"
                    + "<button title='View and edit old homework assignments' onclick='viewAssignments(" + thisId + ")'style='position:absolute;left:330px;width:150px;height:30px;bottom:15px;cursor:pointer;'>View Assignments</button>"
                    + "<button title='Edit who can contribute to this class' onclick='contribute(&#39;class_" + thisId + "&#39;)' style=position:absolute;left:490;width:150px;height:30px;bottom:15px;cursor:pointer;'>Manage Contributors</button>"
                    + "<button title='Change class information such as name and website' onclick='editInfo(" + thisId + ")' style='position:absolute;left:490px;width:150px;height:30px;top:15px;cursor:pointer;'>Edit Class Info</button>"
                    + "<a id='website_" + thisId + "' href='" + website + "'><img id='website_tt_" + thisId + "' src='./images/web_icon.png' width='20px' height='20px' title='Go to class website at \n" + website + "' style='position:absolute;left:290px;top:30px;width:20px;height:20px;cursor:pointer;' /></a>"
                    + "<div title='Students subscribed to this class' style='position:absolute;right:0px;top:15px;height:30px;width:60px;'>"
                    + "<img src='./images/subscribers_icon.png' height='20px' width='20px' style='position:absolute;top:5px;'/>"
                    + "<p id='subscribers_"+ thisId + "' style='color:black;font-family:&#39;Arial&#39;, Times, serif;font-size:16px;position:absolute;left:23px;text-align:left;top:-10px;'><b>" + subscribers + "</b></p></div>"
                    + "<div onmouseover='$(&#39;#trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);' title='Delete Class' onclick='deleteClass(" + thisId + ");' style='position:absolute;right:0px;bottom:15px;height:30px;width:60px;overflow:hidden;cursor:pointer;'>"
                    + "<img id='trash_" + thisId + "' src='./images/delete_icon.png' height='30px' width='30px' onclick='deleteClass(" + thisId + "'style='position:absolute;left:13px;top:-5px;' /></div>"
                    + "</div>"
                    ).appendTo("#classes_panel");

            if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
            {
                $("#website_tt" + thisId).hide();
                $("#website_" + thisId).hide();
            }

            top = top + 112;
        }

        //Reconstruct site dimensions to match length
        $("#classes_panel").css("height", "" + (top + 70) + "px");
        globalTop = top;
        classesMainHeight = top + 230;
        $("#center_body").css("height", classesMainHeight);
    }
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


//Main Menu lights
function mmLight(item)
{
    $(item).css("backgroundColor", "Silver");
}

function mmUnlight(item)
{
    $(item).css("backgroundColor", "#837E7C");
}


//scroll back to top
function scrollToTop()
{
    $("html, body").animate({scrollTop: 0}, 200);
    return false;
}



//Swapping the content panels
var isClasses = true;
var isFeeds = false;

function feedsClick() {
    if (!isFeeds)
    {

        $("#classes_panel").slideUp(200);
        setTimeout(function() {
            $("#feeds_panel").slideDown(200);
        }, 200);
        isClasses = false;

        isFeeds = true;
        $("#panel_indicator").animate({left: "380px"}, {queue: false, duration: 200});
        $("#center_body").animate({height: (feedsMainHeight + "px")}, {queue: false, duration: 200});
    }
}

function classesClick() {
    if (!isClasses)
    {

        $("#feeds_panel").slideUp(200);
        setTimeout(function() {
            $("#classes_panel").slideDown(200);
        }, 200);
        isFeeds = false;

        isClasses = true;
        $("#panel_indicator").animate({left: "120px"}, {queue: false, duration: 200});
        $("#center_body").animate({height: (classesMainHeight + "px")}, {queue: false, duration: 200});
    }
}


function createClass() {
    dim();
    $("#create_class_panel").animate({left: "235px"}, {queue: false, duration: 200});
    document.create_class_form.class_name.focus();
    scrollToTop();
}

function createClassExit() {
    $("#create_class_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
            $("#create_class_panel").css("left", "-350px");
            //Clear the form
            $("#class_name").val("");
            for (var i = 1; i < 8; i++)
                $("#period_" + i).prop("checked", false);
            $("#add_info").val("");
            $("#website").val("");
            $("#create_class_button").text("Create Class");
            $("#class_name").css("backgroundColor", "white");
            $("#create_class_form").attr('onsubmit', "checkCreateClass(); return false;");
            $("#create_class_label").text("New Class");
        }});
    undim();
}

function checkCreateClass() {
    var fields = {};
    fields['name'] = document.forms['create_class_form']['class_name'].value;
    fields['description'] = document.getElementById('add_info').value;
    fields['website'] = document.forms['create_class_form']['website'].value;
    fields['periods'] = "";

    for (var i = 1; i < 8; i++)
    {
        if (document.getElementById("period_" + i).checked)
            fields['periods'] = fields['periods'] + "" + i;

    }

    if (fields['name'] === "")
    {
        $("#class_name").css("backgroundColor", "F70000");
        return false;
    }
    setCreateClassLoading(true);
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
                notify("This class already exists.", 200);
            } else if (text === "error") {
                notify("An error occured while creating your class.", 350);
            }
            else
            { // Exit and refresh page
                notify("Class created.", 150);
                var arr = text.split(/_(.*)/);
                var newId = arr[0];

                createClassExit();
                // add new class
                $("html, body").animate({scrollTop: $(document).height()}, {queue: false, duration: 200});
                $("#center_body").animate({height: "+=112px"}, {queue: false, duration: 200});
                $("#classes_panel").animate({height: "+=112px"}, {queue: false, duration: 200});

                //Add the element
                var name = fields['name'];
                var description = fields['description'];
                if (fields['periods'] == "")
                    fields['periods'] = "0";
                var periods = fields['periods'].split("");
                var subscribers = "0";
                var thisId = arr[0];
                var website = arr[1];
                var toBeId = "class_" + thisId;

                //Prep info for display
                var periodsf;
                if (periods.length === 1) // Only 1 period
                {
                    //Only one period
                    if (periods[0] == 0)
                        periodsf = "- No Period Information -";
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
                if (description == "")
                    description = "- No description -";
                
                
                var lowerClassName = name.toLowerCase();
                var notMoved = 0;
                for (var i = 0; i < allData.length; i ++) {
                    var lowerCompareName = allData[i]['name'].toLowerCase();
                    if (lowerClassName < lowerCompareName) {
                        $("#class_" + allData[i]['id']).animate({top: "+=112px"}, {queue: false, duration: 200});
                    } else {
                        notMoved ++;
                    }
                }
                
                var whereToAdd = (notMoved * 112) + 20;

                //String it together
                $("<div id='" + toBeId + "' onmouseover='$(&#39;#" + toBeId +
                        "&#39;).css(&#39;boxShadow&#39;, &#39;5px 5px 5px black&#39;);'"
                        + " onmouseout='$(&#39;#" + toBeId + "&#39;).css(&#39;boxShadow&#39;, &#39;none&#39;);'"
                        + " style='opacity:0;position:absolute;left:20px;width:740px;background-color:scrollbar;top:" + whereToAdd + "px;height:100px;'>"
                        + "<div style='position:absolute;left:5px;top:-5px;width:300px;line-height:0px;height:50px;text-align:left;white-space:nowrap;overflow:hidden;'>"
                        + "<p id='name_" + thisId + "' class='class_label_font'>" + name + "</p></div>"
                        + "<div style='position:absolute;left:5px;top:25px;width:300px;line-height:0px;height:30px;text-align:left;'>"
                        + "<p id='periods_" + thisId + "' style='color:black;font-family: &#39;Arial&#39;, Times, serif;font-size:14px;'>" + periodsf + "</p></div>"
                        + "<div style='position:absolute;left:5px;top:35px;width:300px;height:65px;text-align:left;overflow:hidden;'>"
                        + "<p id='description_" + thisId + "' style='color:black;font-family: &#39;Arial&#39;, Times, serif;font-size:14px;'>" + description + "</p></div>"
                        + "<div style='position:absolute;left:320px;top:5px;bottom:5px;width:1px;background-color:black;'></div>"
                        + "<button title='Create and post a new homework assignment' onclick='postAssignment(" + thisId + ", true);' style='position:absolute;left:330px;width:150px;height:30px;top:15px;cursor:pointer;'>Post Homework</button>"
                        + "<button title='View and edit old homework assignments' onclick='viewAssignments(" + thisId + ")'style='position:absolute;left:330px;width:150px;height:30px;bottom:15px;cursor:pointer;'>View Assignments</button>"
                        + "<button title='Edit who can contribute to this class' onclick='contribute(&#39;class_" + thisId + "&#39;)' style=position:absolute;left:490;width:150px;height:30px;bottom:15px;cursor:pointer;'>Manage Contributors</button>"
                        + "<button title='Change class information such as name and website' onclick='editInfo(" + thisId + ")' style='position:absolute;left:490px;width:150px;height:30px;top:15px;cursor:pointer;'>Edit Class Info</button>"
                        + "<a id='website_" + thisId + "' href='" + website + "'><img src='./images/web_icon.png' id='website_tt_" + thisId + "' width='20px' height='20px' title='Go to class website at \n" + website + "' style='position:absolute;left:290px;top:30px;width:20px;height:20px;cursor:pointer;' /></a>"
                        + "<div title='Students subscribed to this class' style='position:absolute;right:0px;top:15px;height:30px;width:60px;'>"
                        + "<img src='./images/subscribers_icon.png' height='20px' width='20px' style='position:absolute;top:5px;'/>"
                        + "<p id='subscribers_"+ thisId + "'style='color:black;font-family:&#39;Arial&#39;, Times, serif;font-size:16px;position:absolute;left:23px;text-align:left;top:-10px;'><b>" + subscribers + "</b></p></div>"
                        + "<div onmouseover='$(&#39;#trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon_red.png&#39;);' onmouseout='$(&#39;#trash_" + thisId + "&#39;).attr(&#39;src&#39;, &#39;./images/delete_icon.png&#39;);' onclick='deleteClass(" + newId + ");' title='Delete Class' style='position:absolute;right:0px;bottom:15px;height:30px;width:60px;overflow:hidden;cursor:pointer;'>"
                        + "<img id='trash_" + thisId + "' src='./images/delete_icon.png' height='30px' width='30px' onclick='deleteClass(" + thisId + "'style='position:absolute;left:13px;top:-5px;' /></div>"
                        + "</div>"
                        ).appendTo("#classes_panel");

                if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
                {
                    var t = document.getElementById("website_tt_" + thisId);
                    t.parentNode.removeChild(t);
                    var e = document.getElementById("website_" + thisId);
                    e.parentNode.removeChild(e);
                }

                setTimeout(function() {
                    $("#" + toBeId).animate({opacity: "1"}, {queue: false, duration: 500});
                }, 200);
                globalTop = globalTop + 112;
                numClasses = numClasses + 1;
                classesMainHeight += 112;

                //Add data to array
                var entry = {
                    id: newId,
                    name: name,
                    subscribers: 0,
                    description: fields['description'],
                    periods: fields['periods'],
                    website: website,
                    assignments: new Array(),
                    loaded_to: 15
                };
                allData.push(entry);
            }
            setCreateClassLoading(false);
        }
    };
    xmlhttp.open("POST", "./ajax_php/createClass.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("name=" + fields['name'] + "&description=" + fields['description'] + "&website=" + fields['website'] + "&periods=" + fields['periods']);
    
    return false; // just a safety. Required?
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

//Create class loader
var isCreateClassLoading = false;
function setCreateClassLoading(mode)
{
    if (mode && isCreateClassLoading === false)
    {
        isCreateClassLoading = true;
        $("#create_class_loader").slideDown(1);
        $("#create_class_loader").animate({opacity: ".4"}, {queue: false, duration: 100});
    }
    else if (mode === false && isCreateClassLoading === true)
    {
        isCreateClassLoading = false;
        $("#create_class_loader").animate({opacity: "0"}, {queue: false, duration: 100});
        setTimeout(function() {
            $("#create_class_loader").slideUp(1);
        }, 100);
    }
}

//Delete class
function deleteClass(classId)
{
    if (confirm("Are you sure you want to delete this class and all its data?"))
    {
        //Delete the class
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
                    notify("Class deleted.", 120);
                    //Animate removing the div
                    $("#class_" + classId).animate({opacity: "0"}, {queue: false, duration: 500});
                    setTimeout(function() {
                        //Re-sort classes
                        for (var i = 0; i < allData.length; i++) {
                            if (allData[i]['name'].toLowerCase() > allData[sqlToIndex(classId)]['name'].toLowerCase()) {
                                $("#class_" + allData[i]['id']).animate({top: "-=112px"}, {queue: false, duration: 200});
                            }
                        }

                        globalTop = globalTop - 112;
                        numClasses = numClasses - 1;
                        classesMainHeight -= 112;
                        $("#center_body").animate({height: "-=112px"}, {queue: false, duration: 200});
                        $("#classes_panel").animate({height: "-=112px"}, {queue: false, duration: 200});
                        $("#class_" + classId).remove();
                        
                        allData.splice(sqlToIndex(classId), 1);
                    }, 500);
                } else if (text === "not found") {
                    notify("Class not found.", 200);
                } else {
                    alert(text);
                }
            }
        };
        xmlhttp.open("POST", "./ajax_php/deleteClass.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send("id=" + classId);
    }
}

//Triggered to open the create class and customize to to be in edit mode
function editInfo(classId)
{
    var indexId = sqlToIndex(classId);
    createClass();
    $("#class_name").val(allData[indexId]['name']);
    var periods = allData[indexId]['periods'].split("");
    for (var i = 0; i < periods.length; i++)
    {
        $("#period_" + periods[i]).prop('checked', true);
    }
    $("#add_info").val(allData[indexId]['description']);
    $("#website").val(allData[indexId]['website']);
    if (allData[indexId]['website'] == 'http://' || allData[indexId]['website'] == 'ftp://' || allData[indexId]['website'] == 'https://' || allData[indexId]['website'] == 'ftps://')
        $("#website").val("");
    $("#create_class_button").text("Update Class Information");
    $("#create_class_form").attr('onsubmit', "return updateClass(" + classId + ");");
    $("#create_class_label").text("Editing " + allData[indexId]['name']);
}

//Triggered on submit with modified create class form. communicates with actual server
function updateClass(classId)
{
    var fields = {};
    fields['name'] = document.forms['create_class_form']['class_name'].value;
    fields['description'] = document.getElementById('add_info').value;
    fields['website'] = document.forms['create_class_form']['website'].value;
    fields['periods'] = "";

    for (var i = 1; i < 8; i++)
    {
        if (document.getElementById("period_" + i).checked)
            fields['periods'] = fields['periods'] + "" + i;

    }

    if (fields['name'] === "")
    {
        $("#class_name").css("backgroundColor", "F70000");
        return false;
    }
    setCreateClassLoading(true);
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            var text = xmlhttp.responseText;
            setCreateClassLoading(false);
            if (text != "error")
            { //Success
                notify("Class updated.", 150);
                createClassExit();
                
                //Mess with the values a bit
                 //Prep info for display
                var periodsf;
                var periods = fields['periods'];
                if (periods.length === 0)
                    periodsf = "- No Period Information -";
                else if (periods.length === 1) // Only 1 period
                {
                    //Only one period
                    if (periods[0] == 0)
                        periodsf = "- No Period Information -";
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
                if (fields['description'] == "")
                    var description = "- No description -";
                else
                    var description = fields['description'];

                var website = text;

                $("#website_tt_" + classId).show();
                $("#website_" + classId).show();

                $("#name_" + classId).text(fields['name']);
                $("#periods_" + classId).text(periodsf);
                $("#description_" + classId).text(description);
                $("#website_" + classId).attr("href", website);
                $('#website_tt_' + classId).prop('title', "Go to class website at \n" + website);

                if (website == 'http://' || website == 'ftp://' || website == 'https://' || website == 'ftps://')
                {
                      $("#website_tt_" + classId).hide();
                      $("#website_" + classId).hide();
                }

                //Manage holding data
                var tempClassData = allData[sqlToIndex(classId)]['assignments'];
                var tempLoadedTo = allData[sqlToIndex(classId)]['loaded_to'];
                allData.splice(sqlToIndex(classId), 1);
                //Add data to array
                var entry = {
                    id: classId,
                    name: fields['name'],
                    subscribers: $("#subscribers_" + classId).text(),
                    description: fields['description'],
                    periods: fields['periods'],
                    website: website,
                    assignments: tempClassData,
                    loaded_to: tempLoadedTo
                };
                allData.splice(sqlToIndex(sqlToIndex(classId)), 0, entry);

                // below re-sorts into alphabetical order
                var count = 0;
                for (var i = 0; i < allData.length; i ++) {
                    var otherTop = parseInt($("#class_" + allData[i]['id']).css("top").replace('px', '') );
                    var myTop = parseInt($("#class_" + classId).css("top").replace('px', ''));
                    var alphaOrder = (fields['name']).toLowerCase() < allData[i]['name'].toLowerCase();
                    
                    //move
                    if (otherTop < myTop && alphaOrder) {
                        $("#class_" + allData[i]['id']).animate({top: "+=112px"}, {queue: false, duration: 200});
                    }
                    if (otherTop > myTop && !alphaOrder) {
                        $("#class_" + allData[i]['id']).animate({top: "-=112px"}, {queue: false, duration: 200});
                    }
                    
                    //get alpha move count
                    if (!alphaOrder)
                        count ++;
                }
                var toMoveTo = (count * 112) + 20 - 112;
                $("#class_" + classId).animate({top: toMoveTo + "px"}, {queue: false, duration: 200});
                //end alpha sort
            }
            else
            {
                notify("An error occured.", 150);
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/editClass.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("sqlid=" + classId + "&name=" + fields['name'] + "&description=" + fields['description'] + "&website=" + fields['website'] + "&periods=" + fields['periods']);

    return false;
}

function sqlToIndex(classId)
{
    for (var i = 0; i < allData.length; i++)
    {
        if (allData[i]['id'] == classId)
        {
            return i;
        }
    }
}
//Underlining
function underline(item) {
    $(item).css("textDecoration", "underline");
}

function de_underline(item) {
    $(item).css("textDecoration", "none");
}
