var flashing = true;

function myAccountLoader() {
    $('#name').val(name);
    $('#surname').val(surname);
    $('#email').val(email);
    
    $("#user_menu_text").html(email);
    
    window.setInterval(function() {
        if (flashing) {
            $("#confirm_delete_panel").css("backgroundColor", "F70000");
            $("#warning_text").css("color", "white");
            flashing = false;
        } else {
            $("#warning_text").css("color", "F70000");
            $("#confirm_delete_panel").css("backgroundColor", "white");
            flashing = true;
        }
    }, 300);
}

function confirmChangesSlideIn() {
    
    $("#name").css("backgroundColor", "white");
    $("#surname").css("backgroundColor", "white");
    $("#email").css("backgroundColor", "white");
    $("#new_password").css("backgroundColor", "white");
    $("#confirm_password").css("backgroundColor", "white");
    
    //Do checking
    if ($("#name").val() == "" || $("#surname").val() == "" || $("#email").val() == "") {
        notify("Fields cannot be empty", 200);
        
        if ($("#name").val() == "")
            $("#name").css("backgroundColor", "F70000");
        if ($("#email").val() == "")
            $("#email").css("backgroundColor", "F70000");
        if ($("#surname").val() == "")
            $("#surname").css("backgroundColor", "F70000");
        return false;
    }
    if ($("#new_password").val() != $("#confirm_password").val()) {
        notify("New passwords do not match", 200);
        $("#new_password").css("backgroundColor", "F70000");
        $("#confirm_password").css("backgroundColor", "F70000");
        return false;
    }
    var atPosition = $("#email").val().indexOf("@");
    var dotPosition = $("#email").val().lastIndexOf(".");
    if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition + 2 >= $("#email").val().length) {
        notify("Please enter a valid email address.", 250);
        $("#email").css("backgroundColor", "F70000");   
        return false;
    }
    
    
    dim();
    $("#confirm_changes_panel").css("left", "-260px");
    $("#confirm_changes_panel").animate({left: "275px"}, {queue: false, duration: 200});
    setTimeout(function(){
        $("#password").focus();
    }, 200);
    
    
    return false;
}

function confirmChangesSlideAway() {
    undim();
    $("#confirm_changes_panel").animate({left: "810px"}, {queue: false, duration: 200});
    setTimeout(function() {
        $("#password").val("");
    }, 200);
   
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


function deleteAccountSlideIn() {
    dim();
    $("#confirm_delete_panel").css("left", "-410px");
    $("#confirm_delete_panel").animate({left: "200px"}, {queue: false, duration: 200});
    setTimeout(function(){
        $("#delete_password").focus();
    }, 200);
}

function deleteAccountSlideAway() {
    undim();
    $("#confirm_delete_panel").animate({left: "810px"}, {queue: false, duration: 200});
    setTimeout(function(){
        $("#delete_password").val("");
    }, 200);
}

//scroll back to top
function scrollToTop()
{
    $("html, body").animate({scrollTop: 0}, 200);
    return false;
}


function submitChanges() {
    //AJAX load if you have more classes
    
    var changeName = $("#name").val();
    var changeSurname= $("#surname").val();
    var changeEmail = $("#email").val();
    var password = $("#password").val();
    var newPassword = $("#new_password").val();
    var confirmPassword = $("#confirm_password").val();
        
    $("#edit_account_loader").css("display", "inline");
    var xmlhttp;
    if (window.XMLHttpRequest)
        xmlhttp = new XMLHttpRequest();
    else
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
           $("#edit_account_loader").css("display", "none");
           var text = xmlhttp.responseText;
           if (text == "error")
               notify("An error occured.", 150);
           else if (text == "bad pass")
               notify("Incorrect password.", 150);
           else if (text == "done") {
               notify("Account information changed.", 200);
               $("#user_menu_text").html(changeEmail);
               confirmChangesSlideAway();
           } else alert(text);
        }
    }
    xmlhttp.open("POST", "./ajax_php/editAccount.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("name=" + changeName + "&surname=" + changeSurname + "&email=" + changeEmail + "&password=" + password + "&newPassword=" + newPassword);
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
//Underlining
function underline(item) {
    $(item).css("textDecoration", "underline");
}

function de_underline(item) {
    $(item).css("textDecoration", "none");
}