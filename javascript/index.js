function checkSignupForm()
{
    var error = false;
    var fields = {};
    fields['firstName'] = document.forms["signupForm"]["firstName"].value;
    fields['lastName'] = document.forms["signupForm"]["lastName"].value;
    fields['email'] = document.forms["signupForm"]["email"].value;
    fields['password'] = document.forms["signupForm"]["password"].value;
    fields['confirmPassword'] = document.forms["signupForm"]["confirmPassword"].value;
    fields['type'] = document.forms["signupForm"]["type"].value;
    fields['createPassword'] = document.forms["signupForm"]["createPassword"].value;

    Object.keys(fields).forEach(function(key) {
        var value = fields[key];
        if (value === "")
        {
            wrongField("#" + key, true);
            error = true;
        }
        else
            wrongField("#" + key, false);
    });

    //Email syntax
    var atPosition = fields['email'].indexOf("@");
    var dotPosition = fields['email'].lastIndexOf(".");

    if (error)
    {
        notify("You must fill out all fields.", 200);
        return false;
    } else if (fields['password'] !== fields['confirmPassword']) {
        notify("Your passwords do not match.", 200);
        wrongField("#password", true);
        wrongField("#confirmPassword", true);
        return false;
    } else if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition + 2 >= fields['email'].length) {
        notify("Please enter a valid email address.", 250);
        wrongField("#email", true);
        return false;
    }

    //Wait cursor for ajax
    setLoading(true);

    //Check the passwords with AJAX
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
            // Go
            var text = xmlhttp.responseText;
            setLoading(false);
            if (text === "already")
            {
                notify("You already have an account with this email.", 300);
            } else if (text === "wrong pass")
            {
                notify("The account creation password incorrect.", 250);
            } else if (text === "success") {
                notify("Account created!", 150);
                //Sign them in
                window.location = "./home.php";
            } else if (text === "student not teacher") {
                notify("You are a student, not a teacher. Please enter a valid year.", 350);
            } else {
                notify("An error occured while creating your account.", 350);
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/createAccount.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("email=" + fields['email'] + "&actpass=" + fields['createPassword'] + "&name=" + fields['firstName'] + "&surname=" + fields['lastName'] + "&pass=" + fields['password'] + "&type=" + fields['type']);

    //Probably always return false
    return false;
}

function checkLoginForm()
{
    var error = false;
    var fields = {};
    fields['login_email'] = document.forms["loginForm"]["login_email"].value;
    fields['login_password'] = document.forms["loginForm"]["login_password"].value;
    if (document.getElementById("remember").checked)
        {
        fields['remember'] = "true";
        }
    else
        {
        fields['remember'] = "false";
        }

    Object.keys(fields).forEach(function(key) {
        var value = fields[key];
        if (value === "") {
            wrongField("#" + key, true);
            error = true;
        }
        else
            wrongField("#" + key, false);
    });

    if (error)
    {
        notify("You must fill out all fields.", 200);
        return false;
    }

    setLoading(true);
    //Check the passwords with AJAX
    var xmlhttp;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Check for login
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            // Go
            var text = xmlhttp.responseText;

            if (text === "wrong")
            {
                setLoading(false);
                notify("Incorrect email or password.", 200);
            }
            if (text === "correct")
            {
                window.location = "./home.php";
            }
        }
    }
    xmlhttp.open("POST", "./ajax_php/login.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("email=" + fields['login_email'] + "&password=" + fields['login_password'] + "&remember=" + fields['remember']);

    return false;
}


function wrongField(field, yesno)
{
    if (yesno)
        $(field).css("backgroundColor", "F70000");
    else
        $(field).css("backgroundColor", "white");
}

//Underlining
function underline(item) {
    $(item).css("textDecoration", "underline");
}

function de_underline(item) {
    $(item).css("textDecoration", "none");
}

//scroll back to top
function scrollToTop()
{
    $("html, body").animate({scrollTop: 0}, 200);
    return false;
}


//Whats this slider
var isWhatsThis = false;
function whatsThisSlideIn()
{
    $("#whats_this_panel").animate({left: "250px"}, {queue: false, duration: 200});
    $("#dimmer").slideDown(1);
    $("#dimmer").animate({opacity: ".4"}, {queue: false, duration: 200});
    isWhatsThis = true;
}
function whatsThisSlideOut()
{
    if (isWhatsThis)
    {
        $("#whats_this_panel").animate({left: "810px"}, {queue: true, duration: 200, complete: function() {
                $("#whats_this_panel").css("left", "-314px");
            }});
        $("#dimmer").animate({opacity: "0"}, {queue: false, duration: 200});
        setTimeout(function() {
            $("#dimmer").slideUp(1);
        }, 200);
        isWhatsThis = false;
    }
    //Other sliders, if any
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

function focus() {
    document.getElementById("login_email").focus();
}