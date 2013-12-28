<?php

/**
 * mobile/update.php
 * @author Elijah Carbonaro
 * 
 * This is a new version of the original update.php, but uses exclusively server-based
 * timing checks, to prevent all the screw ups with timing that were happening
 * 
 * Parameters:
 * "email" - users's email
 * "password" - unencrypted users's password
 * 
 * Returns:
 * "error" - unset parameter
 * "unknown" - username or password incorrect
 * "none" - You're all up to speed
 * XML Doc - an XML document containing all the info you need.
 * 
 * Sample XML Document format
 * 
 * <data>
 *  <post>
 *      <name>Programming Club</name>
 *      <message>There's club today! Horay!</message>
 *      <date>2013-11-28 10:48:00</date>
 *  </post>
 *  ...
 * </data>
 */

if (isset($_GET['email']) && isset($_GET['password'])) {
    require("../ajax_php/header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $email = $_GET['email'];
    $password = hash("sha512", $_GET['password']);
    
    //Check for existance, get id
    $statement = $mysqli->prepare("SELECT `id` FROM `users` WHERE `email`=? AND `password`=?");
    $statement->bind_param("ss", $email, $password);
    $statement->execute();
    $result = $statement->get_result();
    $statement->close();
    if (!mysqli_num_rows($result)) {
        echo("unknown");
    }
    $data = mysqli_fetch_assoc($result);
    $id = $data['id'];
    
    //Check for first time use
    $statement1 = $mysqli->prepare("SELECT * FROM `mobile` WHERE `student_id`=?");
    $statement1->bind_param("i", $id);
    $statement1->execute();
    $result1 = $statement1->get_result();
    $statement1->close();
    
    if (!mysqli_num_rows($result1)) {
        //Its your first time, echo nothing and insert current time
        $statement2 = $mysqli->prepare("INSERT INTO `mobile` (`student_id`, `newest_date`) VALUES (?, ?);");
        date_default_timezone_set("America/Los_Angeles");
        $myDate = date('Y-m-d H:i:s');
        $statement2->bind_param("is", $id, $myDate);
        $statement2->execute();
        echo("none");
        die;
    }
    
    //Get newest date
    $dateData = mysqli_fetch_assoc($result1);
    $latestDate = $dateData['newest_date'];
    
    //Query all feeds
    $allTables = "";
    $statement3 = $mysqli->prepare("SELECT `feed_id` FROM `subscriptions_feeds` WHERE `student_id`=?;");
    $statement3->bind_param("i", $id);
    $statement3->execute();
    $result3 = $statement3->get_result();
    $statement3->close();
    while ($allFeedTables = mysqli_fetch_assoc($result3)) {
        $allTables .= "SELECT * FROM `feed_" . $allFeedTables['feed_id'] . "` WHERE `date` > '$latestDate' UNION ALL ";
    }
    $allTables = substr($allTables, 0, -11);
    $allQuery = $allTables . " ORDER BY `date` DESC LIMIT 0, 15;";
    
    $statement4 = $mysqli->prepare($allQuery);
    $statement4->execute();
    $result4 = $statement4->get_result();
    $statement4->close();
    
    //Check for no new updates
    if (!mysqli_num_rows($result4)) {
        echo("none");
        die;
    }
    
    $first = true;
    $updateDate = "";
    
    echo('<?xml version="1.0"?>');
    echo('<data>');
    
    $currentFeedId = 0;
    $statement5 = $mysqli->prepare("SELECT `name` FROM `feeds` WHERE `id`=?;");
    $statement5->bind_param("i", $currentFeedId);
    while ($row = mysqli_fetch_assoc($result4)) {
        $currentFeedId = $row['feed_id'];
        $statement5->execute();
        $result3 = $statement5->get_result();
        $statement5->close();
        $feedInfo = mysqli_fetch_assoc($result3);        
        echo('<post>');
        echo('<name>' . $feedInfo['name'] . '</name>');
        echo('<message>' . $row['message'] . '</message>');
        echo('<date>' . $row['date'] . '</date>');
        echo('</post>');
        
        //Update latest date for first post
        if ($first) {
            $first = false;
            $updateDate = $row['date'];
        }
    }
    
    //Update date
    $statement6 = $mysqli->prepare("UPDATE `mobile` SET `newest_date`=? WHERE `student_id`=?;");
    $statement6->bind_param("si", $updateDate, $id);
    $statement6->execute();
    
    echo('</data>');
} else {
    echo("error");
    die;
}