<?php
require("./ajax_php/header.inc.php");
if (isLoggedIn())
    header("Location: ./home.php");
?>

<html>

    <head>
        <title>Apollo Planner - Login</title>
        <link rel="shortcut icon" href="images/logo.ico">
        
        <!--CSS-->
        <link rel="stylesheet" type="text/css" href="./css_styles/index_styles.css">

        <!--jQuery-->
        <script src="javascript/jquery.js"></script>
        
        <!--Javascript-->
        <script src="./javascript/index.js" type="text/javascript"></script>
        
    </head>

    <body bgcolor="#E0E0E0" onload="focus();">
        <div id="center_body">
            <!-- Main Content -->
            <div id="main_content">
                <div style="position:absolute;left:0px;top:0px;width:800px;height:500px;">
                    <img src="images/sunset_building_faded.JPG" alt="Sunset Building" width="800" />
                </div>
                <div id="intro_blurb">
                    <p class="intro_font">View assignments, subscribe to school clubs, and connect with Sunset. <b>All in one place.</b></p>
                </div>
                <div id="signup_form_div">
                    <div style="position:absolute;left:0px;top:0px;line-height:0px;">
                        <p class="plain_font"><b>Sign up for free!</b></p>
                    </div>

                    <form autocomplete="on" name="signupForm" id="signupForm" method="post" action="" onsubmit="return checkSignupForm();">
                        <div style="position:absolute;left:0px;top:40px">
                            <input style="width:170px;" type="text" name="firstName" id="firstName" placeholder="First Name">
                        </div>
                        <div style="position:absolute;left:0px;top:80px">
                            <input style="width:170px;" type="text" name="lastName" id="lastName" placeholder="Last Name">
                        </div>
                        <div style="position:absolute;left:0px;top:120px">
                            <input style="width:170px;" type="text" name="email" id="email" placeholder="Email">
                        </div>
                        <div style="position:absolute;left:0px;top:160px">
                            <input style="width:170px;" type="password" name="password" id="password" placeholder="Password">
                        </div>
                        <div style="position:absolute;left:0px;top:200px">
                            <input style="width:170px;" type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password">
                        </div>
                        <div style="position:absolute;left:0px;top:238px;line-height:0px;">
                            <p class="form_font"><b>I am a</b></p>
                        </div>
                        <div style="position:absolute;left:63px;top:240px">
                            <select id="type" name="type">
                                <option value="">Select year...</option>
                                <option value="teacher">Teacher</option>
                                <option value="freshman">Freshman</option>
                                <option value="sophomore">Sophomore</option>
                                <option value="junior">Junior</option>
                                <option value="senior">Senior</option>
                            </select>
                        </div>
                        <div style="position:absolute;left:0px;top:280px">
                            <input style="width:170px;" type="password" name="createPassword" id="createPassword" placeholder="Account Creation Password">
                        </div>
                        <div style="position:absolute;left:95px;top:290px;">
                            <p class="form_font" style="cursor:pointer;" onmouseover="underline(this);" onmouseout="de_underline(this);" onclick="whatsThisSlideIn();">
                                What's this?
                            </p>
                        </div>
                        <div style="position:absolute;left:0px;top:330px;">
                            <button type="submit" name="submitButton" id="submitButton" class="submitButton2">Create Account</button>
                        </div>
                    </form>
                </div>

                <!-- Slide out whats this panel -->
                <div id="whats_this_panel">
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="whatsThisSlideOut();">
                    </div>
                    <div style="position:absolute;left:5px;top:-8px;height:10px;right:25px">
                        <p class="footer_font" style='font-size:14px;'><b>Account Creation Passwords</b></p>
                    </div>
                    <div style="position:absolute;left:5px;top:20px;right:5px;bottom:5px">
                        <p class="footer_font" style="font-size:12px">Account creation passwords ensure that only Sunset students and staff can create an account. There are two different passwords: student and teacher. Entering a student password creates a student account, where you can subscribe to feeds and classes. Teacher accounts have permission to create classes and feeds.<br /><br /><b>Students:</b> to get a student account password, [do something]<br /><br /><b>Teachers:</b> to get a teacher password, [something else]</p>
                    </div>
                </div>

            </div>

            <!-- Top Bar -->
            <div id="top_bar">
                <div id="sunset_logo">
                    <img src="./images/sunset_logo.png" alt="Sunset Logo" width="80" height="80"/>
                </div>
            </div>

            <!-- Name -->
            <div id="apollo_name">
                <h1>
                    Apollo Planner <span style="font-size:15px;color:#ffff00">BETA</span>
                </h1>
            </div>

            <!-- Form for logging in -->
            <div id="login_div">
                <form id="loginForm" autocomplete="on" name="loginForm" method="post" action="" onsubmit="return checkLoginForm();">

                    <div style="position:absolute;left:8px;top:8px;">
                        <input type="text" name="login_email" id="login_email" placeholder="Email"/>
                    </div>
                    <div style="position:absolute;left:8px;bottom:8px;">
                        <input type="password" name="login_password" id="login_password" placeholder="Password" />
                    </div>
                    <div style="position:absolute;left:190px;top:12px;">
                        <input type="checkbox" name="remember" id="remember"/>
                    </div>
                    <div style="position:absolute;left:210px;top:8px;line-height:0px;">
                        <p class="form_font">Remember me</p>
                    </div>
                    <div style="position:absolute;left:193px;top:42px;">
                        <button type="submit" name="loginSubmitButton" id="loginSubmitButton" class="submitButton1">Login</button>
                    </div>
                </form>
            </div>


            <!-- Footer bar -->
            <div id="footer">

                <div style="position:absolute;left:5px;line-height:0px;width:200px;height:20px;top:-2px;">
                    <p class="footer_font" id="scroll_top" onclick="scrollToTop();" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Scroll to top &uarr;
                    </p>
                </div>
                <div style='position:absolute;left:390px;line-height:0px;width:200px;height:20px;top:-2px;'>
                    <p class="footer_font" id="help" onclick="document.location.href='help.php';" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Help
                    </p>
                </div>
                <div style='position:absolute;right:0px;line-height:0px;width:115px;height:20px;top:-2px;'>
                    <p class="footer_font" id="contact_webmaster" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Contact Webmaster
                    </p>
                </div>
            </div>
        </div>

        <div id="notification_panel">
            <p id="notification_text" class="plain_font"></p>
        </div>

        <div id="dimmer" style="opacity:0;display:none;position:fixed;background-color:black;left:0;top:0;height:100%;width:100%"></div>

        <div id="loader" style="opacity:0;display:none;position:fixed;background-color:black;width:100%;height:100%;left:0;top:0;padding-top:20%;text-align:center;z-index:1;">
            <img src="./images/loader.gif" width="40" height="40" style='top:50%;'/>
        </div>
    </body>

</html>