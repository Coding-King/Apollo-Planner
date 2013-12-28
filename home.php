<?php
//Check if you're logged in, redirect if not.
require("./ajax_php/header.inc.php");
$user = getUser();
if ($user != false) {
    if ($user['type'] === "teacher")
    {
        //Redirect to teacher page
        header("Location: ./teach.php");
    }
    $type = $user['type'];
    $id = $user['id'];
    $email = $user['email'];
    
    //*************************************Get class data
    $query = mysql_query("SELECT `class_id` from `subscriptions_classes` WHERE `student_id`='$id'");
    $numClasses = mysql_num_rows($query);
    $classData = array();
    if ($numClasses > 0) {
        while ($classIdData = mysql_fetch_assoc($query)) {
            $classId = $classIdData['class_id'];
            $query2 = mysql_query("SELECT * FROM `class_$classId` ORDER BY date_from DESC LIMIT 0 , 15");
            //Get total number of posts
            $checkQuery = mysql_query("SELECT * FROM `class_$classId`");
            $numPosts = mysql_num_rows($checkQuery);
            $classAssignments = array();
            while ($row = mysql_fetch_assoc($query2)) {
                $tempArray = array(
                    "id" => $row['id'],
                    "date_from" => $row['date_from'],
                    "date_to" => $row['date_to'],
                    "message" => $row['message'],
                    "file" => $row['file'],
                    "file_title" => $row['file_title'],
                );
                array_push($classAssignments, $tempArray);
            }
            $query3 = mysql_query("SELECT * FROM `classes` WHERE `id` = '$classId'");
            $row = mysql_fetch_assoc($query3);
            $classArray = array(
                "id" => $row['id'],
                "name" => $row['name'],
                "owner_name" => $row['owner_name'],
                "description" => $row['description'],
                "periods" => $row['periods'],
                "website" => $row['website'],
                "assignments" => $classAssignments,
                "loaded_to" => 15,
                "num_posts" => $numPosts
            );
            array_push($classData, $classArray);   
        }
    }
    
    //*************************************Get feed data
    $feedQuery = mysql_query("SELECT `feed_id` from `subscriptions_feeds` WHERE `student_id`='$id'");
    $numFeeds = mysql_num_rows($feedQuery);
    $feedData = array();
    if ($numFeeds > 0) {
        while ($feedIdData = mysql_fetch_assoc($feedQuery)) {
            $feedId = $feedIdData['feed_id'];
            $feedQuery2 = mysql_query("SELECT * FROM `feed_$feedId` ORDER BY date DESC LIMIT 0 , 15");
            //Get total number of posts
            $feedCheckQuery = mysql_query("SELECT * FROM `feed_$feedId`");
            $feedNumPosts = mysql_num_rows($feedCheckQuery);
            $feedPosts = array();
            while ($feedRow2 = mysql_fetch_assoc($feedQuery2)) {
                $feedTempArray = array(
                    "id" => $feedRow2['id'],
                    "date" => $feedRow2['date'],
                    "message" => $feedRow2['message'],
                    "file" => $feedRow2['file'],
                    "file_title" => $feedRow2['file_title'],
                );
                array_push($feedPosts, $feedTempArray);
            }
            $feedQuery3 = mysql_query("SELECT * FROM `feeds` WHERE `id` = '$feedId'");
            $feedRow = mysql_fetch_assoc($feedQuery3);
            $feedArray = array(
                "id" => $feedRow['id'],
                "name" => $feedRow['name'],
                "owner_name" => $feedRow['owner_name'],
                "description" => $feedRow['description'],
                "website" => $feedRow['website'],
                "posts" => $feedPosts,
                "loaded_to" => 15,
                "num_posts" => $feedNumPosts
            );
            array_push($feedData, $feedArray);   
        }

        //Feed summary
        $allTables = "";
        $feedQuery2 = mysql_query("SELECT `feed_id` from `subscriptions_feeds` WHERE `student_id`='$id'");
        while ($allFeedTables = mysql_fetch_assoc($feedQuery2)) {
            $allTables = $allTables . "SELECT * FROM `feed_" . $allFeedTables['feed_id'] . "` UNION ALL ";
        }
        $allTables = substr($allTables, 0, -11);

        $allQuery = mysql_query("$allTables ORDER BY `date` DESC LIMIT 0 , 15");
        $numAllPosts = mysql_num_rows($allQuery);
        $allPosts = array();
        while ($data = mysql_fetch_assoc($allQuery)) {
        $feedTempArray = array(
                "id" => $data['id'],
                "feed_id" => $data['feed_id'],
                "date" => $data['date'],
                "message" => $data['message'],
                "file" => $data['file'],
                "file_title" => $data['file_title'],
            );
            array_push($allPosts, $feedTempArray);
        }
        $allFeedsData = array(
            "loaded_to" => 15,
            "num_posts" => $numAllPosts,
            "posts" => $allPosts
        );
    }
    
    //******************************************Get Contributing permissions
    $contribQuery = mysql_query("SELECT * FROM `contributors` WHERE `student_id` = '$id'");
    $isContrib = false;
    if (mysql_num_rows($contribQuery)) {
        $isContrib = true;
        $contrib = array();
        while ($row = mysql_fetch_assoc($contribQuery)) {
             $type_id = explode("_", $row['type_id']);
             $type = $type_id[0];
             $sqlId = $type_id[1];
             if ($type == "class") {
                 $table = "classes";
             } else {
                 $table = "feeds";
             }
             $query = mysql_query("SELECT * FROM `$table` WHERE `id`='$sqlId'");
             $typeData = mysql_fetch_assoc($query);
             $entry = array(
                 "type" => $type,
                 "id" => $sqlId,
                 "name" => $typeData['name'],
                 "owner_name" => $typeData['owner_name']
             );
             array_push($contrib, $entry);
        }
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
        <link rel="stylesheet" type="text/css" href="./css_styles/home_styles.css">
        
        <!--Native Script-->
        <script>
            var id = <?php echo json_encode($id); ?>;
            var type = <?php echo json_encode($type); ?>;
            var email = <?php echo json_encode($email); ?>;
            var numClasses = <?php echo json_encode($numClasses); ?>;
            var numFeeds = <?php echo json_encode($numFeeds); ?>;
            var isContrib = <?php echo json_encode($isContrib); ?>;
            
            //Transfer classData and feedData
            <?php
            if ($numClasses != 0) {
                $js_array = json_encode($classData);
                echo "var classData = " . $js_array . ";\n";
            } else {
                $classData = array();
                $js_array = json_encode($classData);
                echo "var classData = " . $js_array . ";\n";
            }

            if ($numFeeds != 0) {
                $js_array = json_encode($feedData);
                echo "var feedData = " . $js_array . ";\n";
                
                $js_array2 = json_encode($allFeedsData);
                echo "var allFeedsData = " . $js_array2 . ";\n";
            } else {
                $feedData = array();
                $js_array = json_encode($feedData);
                echo "var feedData = " . $js_array . ";\n";
                
                $allFeedsData = array();
                $js_array2 = json_encode($allFeedsData);
                echo "var allFeedsData = " . $js_array2 . ";\n";
            }
            
            if ($isContrib == false) {
                $contrib = array();
            }
            echo "var contrib = " . json_encode($contrib) . ";\n";
            ?>
                
        </script>
        
        <!--External JS-->
        <script type="text/javascript" src="./javascript/student/student_main_and_classes.js"></script>
        <script type="text/javascript" src="./javascript/student/student_feeds.js"></script>
        <script type="text/javascript" src="./javascript/student/student_contribute.js"></script>
        <script type="text/javascript" src="./javascript/student/student_feed_contribute.js"></script>

    </head>
    <body onload="loader(); feedLoader(); contributeLoader();" bgcolor="#E0E0E0">
        <div id="center_body">

            <!--Here goes the main content-->
            <!--Main Menu Bar-->
            <div id="main_menu">
                <div id="classes_tab" onmouseover="mmLight(this);" onmouseout="mmUnlight(this);" onclick="classesClick();">
                    <div style="position:absolute;top:-5px;width:200px;left:50%;margin-left:-100px;"><p class="main_menu_fonts">Classes</p></div>
                </div>
                <div id="feeds_tab" onmouseover="mmLight(this);" onmouseout="mmUnlight(this);" onclick="feedsClick();">
                    <div style="position:absolute;top:-5px;width:200px;left:50%;margin-left:-100px;"><p class="main_menu_fonts">Feeds</p></div>
                </div>
                <div id="more_tab" onmouseover="mmLight(this);" onmouseout="mmUnlight(this);" onclick="contributeClick();">
                    <div style="position:absolute;top:-5px;width:200px;left:50%;margin-left:-100px;"><p class="main_menu_fonts">Manage posts</p></div>
                </div>
            </div>
            
            
            
            <div id="panel_indicator"></div>
            
            <div id="main_window">
                
                <div id="left_panel">
                    <div id="class_container">
                        <div id="no_class_indicator" style="display:none;opacity:0;line-height:0px;text-align:center;position:absolute;left:50px;right:50px;top:200px;height:30px;background-color:whitesmoke;border-radius:15px;">
                            <p class="email_font" style="font-size:15px;">No Classes</p>
                        </div>
                    </div>
                    <div id="feed_container">
                        <div id="no_feed_indicator" style="display:none;opacity:0;line-height:0px;text-align:center;position:absolute;left:50px;right:50px;top:200px;height:30px;background-color:whitesmoke;border-radius:15px;">
                            <p class="email_font" style="font-size:15px;">No Feeds</p>
                        </div>
                    </div>
                </div>
                
                <div id="right_panel">
                    <div id="assignment_container">
                        
                    </div>
                    <div id="post_container">
                        
                    </div>
                </div>
                
                <button id="edit_subs_button" style="position:absolute;left:60px;bottom:20px;height:25px;width:150px;cursor:pointer" onclick="functionEditClasses();">Edit Classes</button>
                
            </div>
            
            <div id="contribute_container" style="overflow:hidden;position:absolute;right:18px;width:240px;height:0px;top:100px;background-color:black;">
            </div>
            
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
                    <p class="footer_font" id="help" onmouseover="underline(this);" onclick="document.location.href='help.php'" onmouseout="de_underline(this);">
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
            <!--Any slide ins go here-->
            <div id="class_selector">
                <div style="position:absolute;left:5px;top:-5px;height:40px;width:500px;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" id="post_for_class_label" style="white-space:nowrap;">Edit Class Subscriptions</p>
                </div>
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img src="./images/exit.png" height="20" width="20" onclick="exitEditClasses();">
                </div>
                <div style="position:absolute;left:10px;right:10px;top:30px;height:1px;background-color:black"></div>
                <form id="class_search_form" name="class_search_form" action="" method="post" onsubmit="searchClasses(); return false;">
                    <input style="position:absolute;left:10px;top:45px;width:225px;height:22px;" type="text" placeholder="Search by class name or teacher" id="search_query" name="search_query" />
                    <button type="submit" style="position:absolute;left:245px;top:43px;width:100px;height:25px;cursor:pointer;">Search</button>
                </form>
                <button style="position:absolute;right:10px;top:38px;height:30px;width:150px;" onclick="saveClassChanges();">Save</button>
                <div style="position:absolute;left:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Available Classes</p>
                </div>
                <div style="position:absolute;right:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Your Classes</p>
                </div>
                <div id="selector_left_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;left:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                    
                </div>
                <!--Loader-->
                <div id="left_loader" style="display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <img src="images/loader.gif" height="30" width="30">
                    <p class='create_class_labels' style='font-size:13px;'>Getting classes...</p>
                </div>
                <!--Basic Display-->
                <div id="left_message" style="z-index:0;display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <p id="left_message_text" class='create_class_labels' style='font-size:13px;'>Enter a search query</p>
                </div>
                <div id="selector_right_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;right:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                </div>
                <!--Main loader-->
                <div id="class_selector_dimmer" style="background-color:black;text-align:center;position:absolute;left:0px;top:0px;bottom:0px;right:0px;display:none;opacity:0"></div>
                <div id="class_selector_load_indicator" style="z-index:0;display:none;opacity:0;text-align:center;position:absolute;left:250px;right:250px;top:200px;height:90px;background-color:black;border-radius:10px;">
                    <img style="position:absolute;left:80px;top:10px;" src="images/loader.gif" width="40" height="40">
                    <p class="create_class_labels" style="color:white;padding-top:45px;font-size:16px;">Updating Classes...</p>
                </div>
            </div>
            <div id="feed_selector">
                <div style="position:absolute;left:5px;top:-5px;height:40px;width:500px;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" id="post_for_class_label" style="white-space:nowrap;">Edit Feed Subscriptions</p>
                </div>
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img src="./images/exit.png" height="20" width="20" onclick="exitEditFeeds();">
                </div>
                <div style="position:absolute;left:10px;right:10px;top:30px;height:1px;background-color:black"></div>
                <form id="feed_search_form" name="feed_search_form" action="" method="post" onsubmit="searchFeeds(); return false;">
                    <input style="position:absolute;left:10px;top:45px;width:225px;height:22px;" type="text" placeholder="Search by feed name or teacher" id="feed_search_query" name="feed_search_query" />
                    <button type="submit" style="position:absolute;left:245px;top:43px;width:100px;height:25px;cursor:pointer;">Search</button>
                </form>
                <button style="position:absolute;right:10px;top:38px;height:30px;width:150px;" onclick="saveFeedChanges();">Save</button>
                <div style="position:absolute;left:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Available Feeds</p>
                </div>
                <div style="position:absolute;right:5px;top:70px;height:30px;width:340px;text-align:center;line-height:0px;overflow:hidden;">
                    <p class="create_class_labels" style="font-size:16px;white-space:nowrap;">Your Feeds</p>
                </div>
                <div id="feed_selector_left_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;left:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                    
                </div>
                <!--Loader-->
                <div id="feed_left_loader" style="display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <img src="images/loader.gif" height="30" width="30">
                    <p class='create_class_labels' style='font-size:13px;'>Getting feeds...</p>
                </div>
                <!--Basic Display-->
                <div id="feed_left_message" style="z-index:0;display:none;position:absolute;left:10px;width:335px;text-align:center;top:200px;">
                    <p id="feed_left_message_text" class='create_class_labels' style='font-size:13px;'>Enter a search query</p>
                </div>
                <div id="feed_selector_right_panel" style="overflow-x:hidden;overflow-y:scroll;position:absolute;right:10px;top:100px;bottom:10px;width:335px;background-color:silver;">
                </div>
                <!--Main loader-->
                <div id="feed_selector_dimmer" style="background-color:black;text-align:center;position:absolute;left:0px;top:0px;bottom:0px;right:0px;display:none;opacity:0"></div>
                <div id="feed_selector_load_indicator" style="z-index:0;display:none;opacity:0;text-align:center;position:absolute;left:250px;right:250px;top:200px;height:90px;background-color:black;border-radius:10px;">
                    <img style="position:absolute;left:80px;top:10px;" src="images/loader.gif" width="40" height="40">
                    <p class="create_class_labels" style="color:white;padding-top:45px;font-size:16px;">Updating Feeds...</p>
                </div>
            </div>
            
            <!--Contributor system: view assignments-->
            <div id="view_assignment_panel">
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img id="view_assignment_panel_exit" src="./images/exit.png" height="20" width="20" onclick="exitViewAssignments(true);">
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
                <button style="position:absolute;left:45px;width:150px;bottom:15px;height:30px;" id="new_assignment_button">Post New Assignment</button>
                <button style="position:absolute;right:45px;width:150px;bottom:15px;height:30px;" id="load_more_assignments_button" disabled></button>
                <div id="assignment_empty_message" style='display:none;position:absolute;top:150px;left:50%;margin-left:-75px;opacity:0;height:30px;text-align:center;line-height:2px;width:150px;border-radius:20px;background-color:whitesmoke;'>
                    <p class='account_fonts'>No Assignments</p>
                </div>
                <!--Loader-->
                <div id="view_assignment_loader" style="opacity:0;display:none;position:absolute;background-color:black;width:600px;bottom:0px;left:0;top:0;padding-top:30%;text-align:center;">
                    <img src="./images/loader.gif" width="40" height="40"/>
                </div>
            </div>
            
            <!--Post new assignment-->
            <div id="new_assignment_panel">
                <form name="new_assignment_form" id="new_assignment_form" action="./ajax_php/postAssignment.php" enctype="multipart/form-data" method="post" onsubmit="return checkNewAssignment();">
                    <input style="display: none;" name="classId" id="classId" type="text" />
                    <input style="display: none;" name="postId" id="postId" type="text" />
                    <input style="display: none;" name="fileClicked" id="fileClicked" type="text" />
                    <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                        <img src="./images/exit.png" height="20" width="20" onclick="newAssignmentExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:500px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="new_assignment_label" style="white-space:nowrap;"></p>
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
                    <button type="submit" name="submit" id="new_assignment_submit" style="position:absolute;left:5px;bottom:7px;right:5px;height:30px;">Post Assignment</button>
                    <!--Loader-->
                    <div id="new_assignment_loader" style="opacity:0;display:none;position:absolute;background-color:black;right:0px;bottom:0px;left:0;top:0;padding-top:40%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40"/>
                    </div>
                </form>
            </div>
            
            <!--View all posts panel--> 
            <div id="view_posts_panel">
                <div style="cursor:pointer;position:absolute;right:0px;top:0px;width:20px;height:20px;">
                    <img id="view_posts_panel_exit" src="./images/exit.png" height="20" width="20" onclick="exitViewPosts(true);">
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
                <button style="position:absolute;left:45px;width:150px;bottom:15px;height:30px;" id="new_post_button">New Post</button>
                <button style="position:absolute;right:45px;width:150px;bottom:15px;height:30px;" id="load_more_posts_button"  disabled></button>
                <div id="posts_empty_message" style='display:none;position:absolute;top:150px;left:50%;margin-left:-75px;opacity:0;height:30px;text-align:center;line-height:2px;width:150px;border-radius:20px;background-color:whitesmoke;'>
                    <p class='account_fonts'>No Posts</p>
                </div>
                <!--Loader-->
                <div id="view_posts_loader" style="opacity:0;display:none;position:absolute;background-color:black;width:600px;bottom:0px;left:0;top:0;padding-top:30%;text-align:center;">
                    <img src="./images/loader.gif" width="40" height="40"/>
                </div>
            </div>
            
            <!--New Post Panel-->
            <div id="new_post_panel">
                <form name="new_post_form" id="new_post_form" action="./ajax_php/postPost.php" enctype="multipart/form-data" method="post" onsubmit="checkNewPost(); return false;">
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
                        <img src="./images/exit.png" height="20" width="20" onclick="newPostExit();">
                    </div>
                    <div style="position:absolute;left:5px;top:-5px;height:40px;width:510px;line-height:0px;overflow:hidden;">
                        <p class="create_class_labels" id="new_post_label" style="white-space:nowrap;"></p>
                    </div>
                    
                    <!--Date div-->
                    <div style="position:absolute;left:5px;top:30px;height:40px;width:300px;line-height:0px;overflow:hidden;">
                        <p id="new_post_date_label" class="create_class_labels" style="font-size: 16px;white-space:nowrap;">Date</p>
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
                    <button type="submit" name="submit" id="new_post_submit" style="position:absolute;left:5px;bottom:7px;right:5px;height:30px;">Publish Post</button>
                    <!--Loader-->
                    <div id="new_post_loader" style="opacity:0;display:none;position:absolute;background-color:black;right:0px;bottom:0px;left:0;top:0;padding-top:40%;text-align:center;">
                        <img src="./images/loader.gif" width="40" height="40"/>
                    </div>
                </form>
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