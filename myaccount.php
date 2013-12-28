<?php
require("./ajax_php/header.inc.php");
if (!isLoggedIn())
    header("Location: ./index.php");
else {
    $query = mysql_query("SELECT * FROM `users` WHERE `id`='" . $_SESSION['userId'] . "'");
    $result = mysql_fetch_assoc($query);
    $id = $_SESSION['userId'];
    $name = $result['name'];
    $surname = $result['surname'];
    $email = $result['email'];
}
?>

<html>

    <head>
        <title>Apollo Planner - My Account</title>
        <link rel="shortcut icon" href="images/logo.ico">

        <!--CSS-->
        <link rel="stylesheet" type="text/css" href="./css_styles/myaccount_styles.css">

        <!--jQuery-->
        <script src="javascript/jquery.js"></script>

        <!--Javascript-->
        <script src="./javascript/myaccount.js" type="text/javascript"></script>

        <script>
            var id = <?php echo json_encode($id); ?>;
            var name = <?php echo json_encode($name); ?>;
            var surname = <?php echo json_encode($surname); ?>;
            var email = <?php echo json_encode($email); ?>;
        </script>
    </head>

    <body bgcolor="#E0E0E0" onload="myAccountLoader();">
        <div id="center_body">
            <!-- Top Bar -->
            <div id="top_bar">
                <!-- Logo -->
                <div id="sunset_logo">
                    <img src="./images/sunset_logo.png" alt="Sunset Logo" width="55px" height="55px"/>
                </div>
                <!-- name -->
                <div id="apollo_name">
                    <h1>
                        Apollo Planner
                    </h1>
                </div>
                <!--Click to go home-->
                <div onclick="window.location = './home.php';" style="position:absolute;left:0px;top:0px;bottom:0px;width:280px;cursor:pointer;" title="Click to return home">

                </div>
                <div id="account_panel" onclick="toggleMenu();" onmouseover="accountHighlight();" onmouseout="accountUnlight();">

                    <div style="position:absolute;right:25px;top:14px;line-height:0px;left:5px;height:20px;text-align:right;overflow:hidden;white-space:nowrap;">
                        <p class='email_font' id="user_menu_text">someone@somewhere.com</p>
                    </div>
                    <div style="position:absolute;right:3px;top:22px;bottom:0px;text-align:center;width:20px;">
                        <img src="images/arrow.png" width="10px" height="9px"id="arrow"/>
                    </div>

                    <div id="account_menu">
                        <div id="account_setting" onclick="accountUnlight2(); window.location = './home.php';"onmouseover="menuHighlight(this);" onmouseout="menuUnlight(this);" style="position:absolute;top:0px;left:0px;right:0px;height:20px;line-height:0px;background-color:#E8E8E8;text-align:center;">
                            <p style="position:absolute;left:0px;top:-3px;height:10px;right:0px;line-height:0px" class="account_fonts">Home</p>         
                        </div> 
                        <div id="logout_setting" onclick="logout();accountUnlight2();" onmouseover="menuHighlight(this);" onmouseout="menuUnlight(this);" style="position:absolute;top:21px;left:0px;right:0px;height:20px;line-height:0px;background-color:#E8E8E8;text-align:center;">
                            <p style="position:absolute;left:0px;top:-3px;height:10px;right:0px;line-height:0px"class="account_fonts">Log out</p>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Footer bar -->
            <div id="footer">
                <div style="position:absolute;left:5px;line-height:0px;width:200px;height:20px;top:-2px;">
                    <p class="footer_font" id="scroll_top" onclick="scrollToTop();" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Scroll to top &uarr;
                    </p>
                </div>
                <div style='position:absolute;left:390px;line-height:0px;width:200px;height:20px;top:-2px;'>
                    <p class="footer_font" id="help" onmouseover="underline(this);" onclick="document.location.href='help.php';" onmouseout="de_underline(this);">
                        Help
                    </p>
                </div>
                <div style='position:absolute;right:0px;line-height:0px;width:115px;height:20px;top:-2px;'>
                    <p class="footer_font" id="contact_webmaster" onmouseover="underline(this);" onmouseout="de_underline(this);">
                        Contact Webmaster
                    </p>
                </div>
            </div>

            <!--Main content-->
            <div style="position:absolute;left:10px;top:60px;height:10px;line-height:0px;width:300px;">
                <h1 style="font-size:20px;">Edit your account details</h1>
            </div>
            <div style="position:absolute;left:10px;right:10px;top:90px;height:1px;background-color:#585858"></div>

            <!--Main form-->
            <button onclick="confirmChangesSlideIn();" title="Click to save changes" name="update_button" id="update_button" style="position:absolute;right:10px;top:57px;width:140px;height:27px;cursor:pointer;">Update Account Info</button>

            <div style="position:absolute;left:160px;top:95px;height:20px;width:100px;line-height:0px;">
                <p class="create_class_labels" style="font-size:17px">Basic Info</p>
            </div>
            <div style="position:absolute;left:85px;top:120px;width:20px;height:20px;line-height:0px;">
                <p class="create_class_small_labels">Name</p>
            </div>
            <input style="position:absolute;left:85px;top:150px;height:25px;font-size:16px;width:220px;" type="text" id="name" name="name" />

            <div style="position:absolute;left:85px;top:175px;width:20px;height:20px;line-height:0px;">
                <p class="create_class_small_labels">Surname</p>
            </div>
            <input style="position:absolute;left:85px;top:205px;height:25px;font-size:16px;width:220px;" type="text" id="surname" name="surname" />

            <div style="position:absolute;left:85px;top:230px;width:20px;height:20px;line-height:0px;">
                <p class="create_class_small_labels">Email</p>
            </div>
            <input style="position:absolute;left:85px;top:260px;height:25px;font-size:16px;width:220px;" type="text" id="email" name="email" />

            <div style="position:absolute;left:400px;top:105px;height:200px;width:1px;background-color:#585858"></div>

            <!--Password-->
            <div style="position:absolute;left:470px;top:140px;width:250px;height:120px;border-radius:5px;background-color:silver;">
                <div style="position:absolute;left:60px;top:5px;height:20px;width:200px;line-height:0px;">
                    <p class="create_class_labels" style="font-size:17px">Password Reset</p>
                </div>
                <input style="position:absolute;left:15px;top:45px;height:25px;font-size:16px;width:220px;" placeholder="New Password" type="password" id="new_password" name="new_password" />
                <input style="position:absolute;left:15px;top:80px;height:25px;font-size:16px;width:220px;" placeholder="Confirm New Password" type="password" id="confirm_password" name="confirm_password" />
            </div>

            <div style="position:absolute;left:10px;top:360px;height:10px;line-height:0px;width:300px;">
                <h1 style="font-size:20px;">Other Account Options</h1>
            </div>
            <div style="position:absolute;left:10px;right:10px;top:390px;height:1px;background-color:#585858"></div>
            <button style="position:absolute;left:20px;top:410px;height:30px;width:150px;cursor:pointer;" onclick="deleteAccountSlideIn();" title="Delete you account and all its information">Delete Account</button>

        </div>

        <div id="notification_panel">
            <p id="notification_text" class="plain_font"></p>
        </div>

        <div id="dimmer" style="opacity:0;display:none;position:fixed;background-color:black;left:0;top:0;height:100%;width:100%;z-index:1"></div>

        <div id="slidein_container">
            
             <!--Confirm Changes-->
            <div id="confirm_changes_panel">
                <div style="position:absolute;left:0px;top:-5px;height:20px;width:250px;text-align:center;">
                    <p class="create_class_labels" style="font-size:15px">Enter your password to confirm your account changes:</p>
                </div>
                <input style="position:absolute;left:10px;top:50px;height:25px;font-size:16px;width:230px;" placeholder="Password" type="password" id="password" name="password" />
                <button onclick="submitChanges();"title="Click to submit account changes" name="submit_button" id="submit_button" style="position:absolute;left:10px;top:85px;width:110px;height:27px;">OK</button>
                <button title="Cancel changes" style="position:absolute;right:10px;top:85px;width:110px;height:27px;" onclick="confirmChangesSlideAway();
                return false;">Cancel</button>
                <div id="edit_account_loader" style="opacity:.4;display:none;position:absolute;background-color:black;bottom:0px;right:0px;left:0;top:0;padding-top:15%;text-align:center;">
                    <img src="./images/loader.gif" width="40px" height="40px" style='top:30%;'/>
                </div>
            </div>

            <!--Confirm Delete-->
            <div id="confirm_delete_panel">
               
                <div style="position:absolute;left:0px;top:-5px;height:20px;right:0px;text-align:center;">
                    <p class="create_class_labels" id="warning_text" style="font-size:23px;color:#F70000;"><b>Warning!</b></p>
                </div>
                <div style="position:absolute;left:0px;top:50px;height:20px;right:0px;text-align:center;">
                    <p class="create_class_labels" style="font-size:17px"><b>You are about to delete your account and all the information associated with it. This operation is irreversible. Enter your password to confirm:</b></p>
                </div>
                <input style="position:absolute;left:15px;bottom:15px;height:25px;font-size:16px;width:215px;" placeholder="Password" type="password" id="delete_password" name="delete_password" />
                <button onclick="deleteAccount();" title="Click to permanently delete your account" name="delete_button" id="delete_button" style="position:absolute;right:15px;bottom:15px;width:140px;height:27px;">Delete Account</button>
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img src="./images/exit.png" height="20px" width="20px" onclick="deleteAccountSlideAway();">
                </div>
            </div>

        </div>

        <div id="loader" style="opacity:0;display:none;position:fixed;background-color:black;width:100%;height:100%;left:0;top:0;padding-top:20%;text-align:center;z-index:1;">
            <img src="./images/loader.gif" width="40px" height="40px" style='top:50%;'/>
        </div>
    </body>

</html>
