<?php
//Check if you're logged in, redirect if not.
require("./ajax_php/header.inc.php");
$user = isLoggedIn();
if ($user) {
    $user2 = getUser();
    if ($user2['type'] !== "teacher") {
        //Redirect to teacher page
        header("Location: ./home.php");
    }
    $email = $user2['email'];
    $type = $user2['type'];
    $id = $user2['id'];
    
    //Load all class data
    $query = mysql_query("SELECT * FROM `classes` WHERE `owner_id` = '$id' ORDER BY `name` ASC");
    $numClasses = mysql_num_rows($query);
    $allData = array();
    if ($numClasses > 0) {
        while ($row = mysql_fetch_assoc($query)) {
            $classData = array();
            $query2 = mysql_query("SELECT * FROM `class_" . $row['id'] . "` ORDER BY date_from DESC LIMIT 0 , 15");
            while ($row2 = mysql_fetch_assoc($query2)) {
                $tempArray = array(
                    "id" => $row2['id'],
                    "date_from" => $row2['date_from'],
                    "date_to" => $row2['date_to'],
                    "message" => $row2['message'],
                    "file" => $row2['file'],
                    "file_title" => $row2['file_title'],
                );
                array_push($classData, $tempArray);
            }
            
            $classArray = array(
                "id" => $row['id'],
                "owner_id" => $row['owner_id'],
                "name" => $row['name'],
                "subscribers" => $row['subscribers'],
                "description" => $row['description'],
                "periods" => $row['periods'],
                "website" => $row['website'],
                "assignments" => $classData,
                "loaded_to" => 15
            );
            array_push($allData, $classArray);
        }
    }
    else {
        $numClasses = 0;
    }
    
    //Load feed data
    $query1 = mysql_query("SELECT * FROM `feeds` WHERE `owner_id` = '$id' ORDER BY `name` ASC");
    $numFeeds = mysql_num_rows($query1);
    $feedData = array();
     if ($numFeeds > 0) {
        while ($row = mysql_fetch_assoc($query1)) {
            $feedPosts = array();
            $query2 = mysql_query("SELECT * FROM `feed_" . $row['id'] . "` ORDER BY date DESC LIMIT 0 , 15");
            while ($row2 = mysql_fetch_assoc($query2)) {
                
                $tempDate = explode(" ", $row2['date']);
                
                $tempArray = array(
                    "id" => $row2['id'],
                    "date" => $tempDate[0],
                    "time" => $tempDate[1],
                    "message" => $row2['message'],
                    "file" => $row2['file'],
                    "file_title" => $row2['file_title'],
                );
                array_push($feedPosts, $tempArray);
            }
            
            $feedArray = array(
                "id" => $row['id'],
                "owner_id" => $row['owner_id'],
                "name" => $row['name'],
                "subscribers" => $row['subscribers'],
                "description" => $row['description'],
                "website" => $row['website'],
                "posts" => $feedPosts,
                "loaded_to" => 15
            );
            array_push($feedData, $feedArray);
        }
    }
    else {
        $numFeeds = 0;
    }
    
} else {
    header("Location: ./index.php");
}

?>

<html>

    <head>
        <title>Apollo Planner - Home</title>
        <!--Icon-->
        <link rel="shortcut icon" href="images/logo.ico">
        
        <!--jQuery-->
        <script src="javascript/jquery.js"></script>
        <link href="./jqueryui/css/smoothness/jquery-ui-1.10.3.custom.css" rel="stylesheet">
	<script src="./jqueryui/js/jquery-1.9.1.js"></script>
	<script src="./jqueryui/js/jquery-ui-1.10.3.custom.js"></script>
        <script src="./javascript/jquery.form.js" type="text/javascript"></script>
        
        <!--CSS-->
        <link rel="stylesheet" type="text/css" href="./css_styles/teach_styles.css">
        
        <!--Native Script-->
        <script>
            
            var numClasses = <?php echo json_encode($numClasses); ?>;
            var numFeeds = <?php echo json_encode($numFeeds); ?>;
            var type = <?php echo json_encode($type); ?>;
            var email = <?php echo json_encode($email); ?>;
                
            //Transfer allData
            <?php
                echo "var allData = " . json_encode($allData) . ";\n";
                echo "var feedData = " . json_encode($feedData) . ";\n";
            ?>
            
        </script>
        
        <!--External JS-->
        <script type="text/javascript" src="./javascript/teacher/teacher_main_and_classes.js"></script>
        <script type="text/javascript" src="./javascript/teacher/teacher_assignments.js"></script>
        <script type="text/javascript" src="./javascript/teacher/teacher_feeds.js"></script>
        <script type="text/javascript" src="./javascript/teacher/teacher_posts.js"></script>
        <script type="text/javascript" src="./javascript/teacher/teacher_contributors.js"></script>


    </head>
    <body onload="loader();" bgcolor="#E0E0E0">
        
        <!--This corrects for changing during slide-->
        <div style="position:absolute;top:5px;width:800px;left:50%;margin-left:-400px;height:50px;background-color:Silver;border-radius:5px;z-index:0"></div>        
        
        <div id="center_body">

            <!--Main Menu Bar-->
            <div id="main_menu">
                <div id="classes_tab" onmouseover="mmLight(this);" onmouseout="mmUnlight(this);" onclick="classesClick();">
                    <div style="position:absolute;top:-5px;width:200px;left:50%;margin-left:-100px;"><p class="main_menu_fonts">Classes</p></div>
                </div>
                <div id="feeds_tab" onmouseover="mmLight(this);" onmouseout="mmUnlight(this);" onclick="feedsClick();">
                    <div style="position:absolute;top:-5px;width:200px;left:50%;margin-left:-100px;"><p class="main_menu_fonts">Feeds</p></div>
                </div>
            </div>



            <!--Content Panels--> 
            <div id="classes_panel">
                <div style="position:absolute;right:10px;left:10px;top:10px;bottom:10px;background-color:whitesmoke;overflow:hidden;">
                    <!--This is where content goes-->
                    <button id="create_class_small_button" style="position:absolute;bottom:20px;height:30px;width:300px;left:50%;margin-left:-150px;cursor:pointer;" onclick="createClass();">Create new Class</button>
                </div>
            </div>

            <div id="feeds_panel">
                <div style="position:absolute;right:10px;left:10px;top:10px;bottom:10px;background-color:whitesmoke;overflow:hidden;">
                    <!--This is where content goes-->
                    <button id="create_feed_small_button" style="position:absolute;bottom:20px;height:30px;width:300px;left:50%;margin-left:-150px;cursor:pointer;" onclick="createFeed();">Create new Feed</button>
                </div>
            </div>

            <div id="panel_indicator"></div>

            <!-- Top Bar -->
            <div id="top_bar">
                <!-- Logo -->
                <div id="sunset_logo">
                    <img src="./images/sunset_logo.png" alt="Sunset Logo" width="55" height="55"/>
                </div>
                <!-- name -->
                <div id="apollo_name">
                    <h1>
                        Apollo Planner
                    </h1>
                </div>

                <div id="account_panel" onclick="toggleMenu();" onmouseover="accountHighlight();" onmouseout="accountUnlight();">

                    <div style="position:absolute;right:25px;top:14px;line-height:0px;left:5px;height:20px;text-align:right;overflow:hidden;white-space:nowrap;">
                        <p class='email_font' id="user_menu_text">someone@somewhere.com</p>
                    </div>
                    <div style="position:absolute;right:3px;top:22px;bottom:0px;text-align:center;width:20px;">
                        <img src="images/arrow.png" width="10" height="9" id="arrow"/>
                    </div>

                    <div id="account_menu">
                        <div id="account_setting" onclick="accountUnlight2(); window.location = './myaccount.php';" onmouseover="menuHighlight(this);" onmouseout="menuUnlight(this);" style="position:absolute;top:0px;left:0px;right:0px;height:20px;line-height:0px;background-color:#E8E8E8;text-align:center;">
                            <p style="position:absolute;left:0px;top:-3px;height:10px;right:0px;line-height:0px" class="account_fonts">My Account</p>         
                        </div> 
                        <div id="logout_setting" onclick="logout();accountUnlight2();" onmouseover="menuHighlight(this);" onmouseout="menuUnlight(this);" style="position:absolute;top:21px;left:0px;right:0px;height:20px;line-height:0px;background-color:#E8E8E8;text-align:center;">
                            <p style="position:absolute;left:0px;top:-3px;height:10px;right:0px;line-height:0px" class="account_fonts">Log out</p>
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
                    <p class="footer_font" id="help" onclick="document.location.href='help.php'" onmouseover="underline(this);" onmouseout="de_underline(this);">
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


        <!--Slideins-->
        <div id="slidein_container">
            <div id="create_class_panel">
                <form name="create_class_form" id="create_class_form" action="" method="post" onsubmit="return checkCreateClass();">
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="create_class_label" style="white-space:nowrap;">New Class</p>
                    </div>
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="createClassExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:19px;height:20px;width:20px;">
                        <p class="create_class_labels">Name:</p>
                    </div>
                    <div style="position:absolute;left:70px;top:36px;">
                        <input style="font-size:16px;width:220px;" type="text" id="class_name" name="class_name" />
                    </div>
                    <div style="position:absolute;left:295px;top:17px;">
                        <p class="create_class_labels" style="color:red;"><b>*</b></p>
                    </div>
                    <div style="position:absolute;left:5px;top:60px;height:20px;width:50px;">
                        <p class="create_class_labels">Period(s):</p>
                    </div>
                    <div style="text-align:center;position:absolute;left:100px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">1</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_1" name="period_1" />
                    </div>
                    <div style="text-align:center;position:absolute;left:130px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">2</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_2" name="period_2" />
                    </div>
                    <div style="text-align:center;position:absolute;left:160px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">3</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_3" name="period_3" />
                    </div>
                    <div style="text-align:center;position:absolute;left:190px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">4</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_4" name="period_4" />
                    </div>
                    <div style="text-align:center;position:absolute;left:220px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">5</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_5" name="period_5" />
                    </div>
                    <div style="text-align:center;position:absolute;left:250px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">6</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_6" name="period_6" />
                    </div>
                    <div style="text-align:center;position:absolute;left:280px;top:67px;height:50px;width:30px;line-height:0px;">
                        <p class="create_class_small_labels">7</p>
                        <input style="position:absolute;top:25px;left:7px;" type="checkbox" id="period_7" name="period_7" />
                    </div>
                    <div style="position:absolute;left:5px;top:110px;height:20px;width:200px;line-height:0px;">
                        <p class="create_class_small_labels">Additional Information:</p>
                    </div>
                    <div style="position:absolute;left:5px;top:140px;">
                        <!--<input type="text" name="add_info" id="add_info" style="position:absolute;left:0px;top:0px;width:250px;font-size:16px;height:50px;"/>-->
                        <textarea name="add_info" id="add_info" cols="40" rows="5" class="create_class_small_labels" style="resize:none;position:absolute;left:0px;top:0px;width:300px;font-size:12px;height:50px;"></textarea>
                    </div>
                    <div style="position:absolute;top:185px;left:5px;width:200px;height:10px;">
                        <p class="create_class_small_labels" style="font-size:14px;">Website URL:</p>
                    </div>
                    <div style="position:absolute;top:194px;left:100px;width:30px;height:10px;">
                        <input style="font-size:12px;width:205px;" type="text" id="website" name="website" />
                    </div>
                    <div style="position:absolute;top:210px;left:225px;width:300px;height:1px;">
                        <p class="create_class_small_labels" style="font-size:11px;color:red;">* = required field</p>
                    </div>
                    <button type="submit" name="create_class_button" id="create_class_button" style="position:absolute;top:240px;height:30px;left:5px;width:300px;font-size:15px">Create Class</button>
                    <!--Loader-->
                    <div id="create_class_loader" style="opacity:0;display:none;position:absolute;background-color:black;bottom:0px;right:0px;left:0;top:0;padding-top:20%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40" style='top:50%;'/>
                    </div>
                </form>
            </div>
            
            <!-- Post homework Assignment Panel -->
            <div id="post_assignment_panel">
                <form name="post_assignment_form" id="post_assignment_form" action="./ajax_php/postAssignment.php" enctype="multipart/form-data" method="post" onsubmit="return checkPostAssignment();">
                    <input style="display: none;" name="classId" id="classId" type="text" />
                    <input style="display: none;" name="postId" id="postId" type="text" />
                    <input style="display: none;" name="fileClicked" id="fileClicked" type="text" />
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="postAssignmentExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:500px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="post_for_class_label" style="white-space:nowrap;"></p>
                    </div>
                    <div style="position:absolute;left:5px;top:25px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" style="font-size: 16px;white-space:nowrap;">Date</p>
                    </div>
                    <div style="position:absolute;left:43px;top:12px;">
                        <p class="create_class_labels" style="color:red;font-size:18px;"><b>*</b></p>
                    </div>
                    <div style="position:absolute;left:65px;top:56px;">
                        <p class="create_class_labels" style="color:red;font-size:18px;"><b>*</b></p>
                    </div>
                    <input style="position:absolute;left:5px;top:50px;height:25px;font-size:14px;width:140px;" type="text" placeholder="From" id="from_date" name="from_date" />
                    <div style="position:absolute;top:63px;width:10px;height:2px;background-color:black;left:160px;"></div>
                    <input style="position:absolute;left:185px;top:50px;height:25px;font-size:14px;width:140px;" type="text" placeholder="To (optional)" id="to_date" name="to_date" />
                    <div style="position:absolute;left:5px;top:70px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" style="font-size: 16px;white-space:nowrap;">Content</p>
                    </div>
                    <textarea name="message" id="message" cols="40" rows="5" class="create_class_small_labels" style=" resize:none;position:absolute;left:5px;top:100px;width:540px;font-size:15px;height:300px;"></textarea>
                    
                    <!--New File upload system-->
                    
                    <div style="position:absolute;right:5px;top:398px;">
                        <p id="toggle_file_button" class="create_class_labels" style="font-size:14px;cursor:pointer" onclick="addFileSlidein();" onmouseover="$(this).css('textDecoration', 'underline');" onmouseout="$(this).css('textDecoration', 'none');">Click to add a file</p>
                    </div>
                    
                    <div id="file_upload_div" style="position:absolute;left:5px;top:405px;background-color:Silver;width:420px;height:33px;display:none;opacity:0;">
                        <input style="position:absolute;left:5px;top:3px;font-size:14px;width:150px;" type="text" name="file_title" id="file_title" placeholder="File Title">
                        <input style="position:absolute;right:5px;top:5px;height:25px;font-size:14px;left:155px;" type="file" name="file" id="file">
                    </div>
                    <div style="position:absolute;top:70px;left:462px;width:300px;height:1px;">
                        <p class="create_class_small_labels" style="font-size:11px;color:red;">* = required field</p>
                    </div>
                    <button type="submit" name="submit" id="post_assignment_submit" style="position:absolute;left:5px;bottom:7px;right:5px;height:30px;">Post Assignment</button>
                    <!--Loader-->
                    <div id="post_assignment_loader" style="opacity:0;display:none;position:absolute;background-color:black;right:0px;bottom:0px;left:0;top:0;padding-top:40%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40"/>
                    </div>
                </form>
            </div>
            
            <!--View all assignments panel--> 
            <div id="view_assignment_panel">
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img id="view_assignment_panel_exit" src="./images/exit.png" height="20" width="20" onclick="viewAssignmentsExit(true);">
                </div>
                <div style="position:absolute;left:10px;top:-5px;height:40px;right:30px;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" id="view_assignment_label" style="white-space:nowrap;font-size:23px;">This is a jClass label</p>
                </div>
                <div id="assignment_holder" style="position:absolute;left:15px;top:40px;right:15px;bottom:60px;background-color:silver;overflow-y:scroll;border:1px solid black">
                <!--Here is where all the assignment divs are inserted-->
                </div>
                <div id="load_more_animation" style="opacity:0;position:absolute;right:200px;bottom:20px;height:20px;width:20px;">
                    <img src="./images/loader_black.gif" width="20" height="20" />
                </div>
                <button style="position:absolute;left:45px;width:150px;bottom:15px;height:30px;" id="view_post_assignment_button">Post New Assignment</button>
                <button style="position:absolute;right:45px;width:150px;bottom:15px;height:30px;" id="load_more_assignments_button"></button>
                <div id="assignment_empty_message" style='display:none;position:absolute;top:150px;left:50%;margin-left:-75px;opacity:0;height:30px;text-align:center;line-height:2px;width:150px;border-radius:20px;background-color:whitesmoke;'>
                    <p class='account_fonts'>No Assignments</p>
                </div>
                <!--Loader-->
                <div id="view_assignment_loader" style="opacity:0;display:none;position:absolute;background-color:black;width:600px;bottom:0px;left:0;top:0;padding-top:30%;text-align:center;">
                    <img src="./images/loader.gif" width="40" height="40"/>
                </div>
            </div>
            <!--Create/Edit Feed Panel-->
            <div id="create_feed_panel">
                <form name="create_feed_form" id="create_feed_form" action="" method="post" onsubmit="checkCreateFeed(); return false;">
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="create_feed_label" style="white-space:nowrap;">New Feed</p>
                    </div>
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="createFeedExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:19px;height:20px;width:20px;">
                        <p class="create_class_labels">Name:</p>
                    </div>
                    <div style="position:absolute;left:70px;top:36px;">
                        <input style="font-size:16px;width:220px;" type="text" id="feed_name" name="feed_name" />
                    </div>
                    <div style="position:absolute;left:295px;top:17px;">
                        <p class="create_class_labels" style="color:red;"><b>*</b></p>
                    </div>
                    <div style="position:absolute;left:5px;top:60px;height:20px;width:200px;line-height:0px;">
                        <p class="create_class_small_labels">Additional Information:</p>
                    </div>
                    <div style="position:absolute;left:5px;top:90px;">
                        <textarea name="feed_add_info" id="feed_add_info" cols="40" rows="5" class="create_class_small_labels" style="resize:none;position:absolute;left:0px;top:0px;width:300px;font-size:12px;height:100px;"></textarea>
                    </div>
                    <div style="position:absolute;top:185px;left:5px;width:200px;height:10px;">
                        <p class="create_class_small_labels" style="font-size:14px;">Website URL:</p>
                    </div>
                    <div style="position:absolute;top:194px;left:100px;width:30px;height:10px;">
                        <input style="font-size:12px;width:205px;" type="text" id="feed_website" name="feed_website" />
                    </div>
                    <div style="position:absolute;top:210px;left:225px;width:300px;height:1px;">
                        <p class="create_class_small_labels" style="font-size:11px;color:red;">* = required field</p>
                    </div>
                    <button type="submit" name="create_feed_button" id="create_feed_button" style="position:absolute;top:240px;height:30px;left:5px;width:300px;font-size:15px">Create Feed</button>
                    <!--Loader-->
                    <div id="create_feed_loader" style="opacity:0;display:none;position:absolute;background-color:black;bottom:0px;right:0px;left:0;top:0;padding-top:20%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40" style='top:50%;'/>
                    </div>
                </form>
            </div>
            <!--Feed Post Panel-->
            <div id="post_post_panel">
                <form name="post_post_form" id="post_post_form" action="./ajax_php/postPost.php" enctype="multipart/form-data" method="post" onsubmit="checkPostPost(); return false;">
                    <input style="display: none;" name="feedId" id="feedId" type="text" />
                    <input style="display: none;" name="feedPostId" id="feedPostId" type="text" />
                    <input style="display: none;" name="feedFileClicked" id="feedFileClicked" type="text" />
                    
                    <div id="update_time_div" style="position:absolute;right:5px;top:30px;width:175px;height:30px;background-color:silver;border-radius:5px;">
                        <div style="position:absolute;line-height:0px;left:10px;top:1px;height:10px;right:0px;">
                            <p class="create_class_labels" style="font-size:14px;">Update date and time</p>
                        </div>
                        <input style="position:absolute;top:6px;right:6px;" type="checkbox" id="update_time" value="value" name="update_time" />
                    </div>
                    
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="postPostExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:510px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="post_for_feed_label" style="white-space:nowrap;"></p>
                    </div>
                    
                    <!--Date div-->
                    <div style="position:absolute;left:5px;top:30px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p id="post_post_date_label" class="create_class_labels" style="font-size: 16px;white-space:nowrap;">Date</p>
                    </div>
                    
                    <textarea name="feed_message" id="feed_message" cols="40" rows="5" class="create_class_small_labels" style="resize:none;position:absolute;left:5px;top:70px;width:540px;font-size:15px;height:300px;"></textarea>
                    <!--New File upload system-->
                    <div style="position:absolute;right:5px;top:374px;">
                        <p id="feed_toggle_file_button" class="create_class_labels" style="font-size:14px;cursor:pointer" onclick="postAddFileSlidein();" onmouseover="$(this).css('textDecoration', 'underline');" onmouseout="$(this).css('textDecoration', 'none');">Click to add a file</p>
                    </div>
                    
                    <div id="feed_file_upload_div" style="position:absolute;left:5px;top:382px;background-color:Silver;width:420px;height:33px;display:none;opacity:0;">
                        <input style="position:absolute;left:5px;top:3px;font-size:14px;width:150px;" type="text" name="feed_file_title" id="feed_file_title" placeholder="File Title">
                        <input style="position:absolute;right:5px;top:5px;height:25px;font-size:14px;left:155px;" type="file" name="feed_file" id="feed_file">
                    </div>
                    <button type="submit" name="submit" id="post_post_submit" style="position:absolute;left:5px;bottom:7px;right:5px;height:30px;">Publish Post</button>
                    <!--Loader-->
                    <div id="post_post_loader" style="opacity:0;display:none;position:absolute;background-color:black;right:0px;bottom:0px;left:0;top:0;padding-top:40%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40"/>
                    </div>
                </form>
            </div>
            <!--View all posts panel--> 
            <div id="view_posts_panel">
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img id="view_posts_panel_exit" src="./images/exit.png" height="20" width="20" onclick="viewPostsExit(true);">
                </div>
                <div style="position:absolute;left:10px;top:-5px;height:40px;right:30px;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" id="view_posts_label" style="white-space:nowrap;font-size:23px;">Well, this means an error...</p>
                </div>
                <div id="post_holder" style="position:absolute;left:15px;top:40px;right:15px;bottom:60px;background-color:silver;overflow-y:scroll;border:1px solid black">
                <!--Here is where all the assignment divs are inserted-->
                </div>
                <div id="feed_load_more_animation" style="opacity:0;position:absolute;right:200px;bottom:20px;height:20px;width:20px;">
                    <img src="./images/loader_black.gif" width="20" height="20" />
                </div>
                <button style="position:absolute;left:45px;width:150px;bottom:15px;height:30px;" id="view_post_post_button">New Posts</button>
                <button style="position:absolute;right:45px;width:150px;bottom:15px;height:30px;" id="load_more_posts_button"></button>
                <div id="posts_empty_message" style='display:none;position:absolute;top:150px;left:50%;margin-left:-75px;opacity:0;height:30px;text-align:center;line-height:2px;width:150px;border-radius:20px;background-color:whitesmoke;'>
                    <p class='account_fonts'>No Posts</p>
                </div>
                <!--Loader-->
                <div id="view_posts_loader" style="opacity:0;display:none;position:absolute;background-color:black;width:600px;bottom:0px;left:0;top:0;padding-top:30%;text-align:center;">
                    <img src="./images/loader.gif" width="40" height="40"/>
                </div>
            </div>
            
            
            <!--Contributing system-->
            <div id="contribute_panel">
                <div style="position:absolute;left:5px;top:-5px;height:40px;width:500px;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" id="contribute_for_label" style="white-space:nowrap;"></p>
                </div>
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img src="./images/exit.png" height="20" width="20" onclick="exitContribute();">
                </div>
                <div style="position:absolute;left:10px;right:10px;top:30px;height:1px;background-color:black"></div>
                <form id="search_form" name="search_form" action="" method="post" onsubmit="searchStudents(); return false;">
                    <input style="position:absolute;left:10px;top:45px;width:225px;height:22px;" type="text" placeholder="Search for students" id="search_query" name="search_query" />
                    <button type="submit" style="position:absolute;left:245px;top:43px;width:100px;height:25px;cursor:pointer;">Search</button>
                </form>
                <button style="position:absolute;right:10px;top:38px;height:30px;width:150px;" onclick="saveContribute();">Save</button>
                <div style="position:absolute;left:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Available Students</p>
                </div>
                <div style="position:absolute;right:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Contributors</p>
                </div>
                <div id="left_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;left:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                    
                </div>
                <div id="right_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;right:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                    
                </div>             
                <!--Loader-->
                <div id="left_loader" style="display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <img src="images/loader.gif" height="30" width="30">
                    <p class='create_class_labels' style='font-size:13px;'>Searching students...</p>
                </div>
                <!--Basic Display-->
                <div id="left_message" style="z-index:0;display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <p id="left_message_text" class='create_class_labels' style='font-size:13px;'></p>
                </div>
                <!--Right Display-->
                <div id="right_message" style="z-index:0;display:none;position:absolute;right:10px;width:335px;text-align:center;top:200px;">
                    <p id="right_message_text" class='create_class_labels' style='font-size:13px;'></p>
                </div>
                
                <!--Main loader-->
                <div id="contribute_dimmer" style="background-color:black;text-align:center;position:absolute;left:0px;top:0px;bottom:0px;right:0px;display:none;opacity:0"></div>
                <div id="contribute_loader" style="z-index:0;display:none;opacity:0;text-align:center;position:absolute;left:250px;right:250px;top:200px;height:90px;background-color:black;border-radius:10px;">
                    <img style="position:absolute;left:80px;top:10px;" src="images/loader.gif" width="40" height="40">
                    <p class="create_class_labels" id="contribute_loading_text" style="color:white;padding-top:45px;font-size:16px;"></p>
                </div>
            </div>
        </div>

        <!-- Dimmer -->
        <div id="dimmer" style="z-index:2;opacity:0;display:none;position:fixed;background-color:black;left:0;top:0;height:100%;width:100%"></div>

        <!--Loader-->
        <div id="loader" style="z-index:2;opacity:0;display:none;position:fixed;background-color:black;width:100%;height:100%;left:0;top:0;padding-top:20%;text-align:center;">
            <img src="./images/loader.gif" width="40" height="40" style='top:50%;'/>
        </div>

        <!--Notification Pop up-->
        <div id="notification_panel">
            <p id="notification_text" class="plain_font"></p>
        </div>

    </body>
</html>