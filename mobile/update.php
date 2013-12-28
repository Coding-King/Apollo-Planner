<?php

/*
 * WARNING:
 * do not use this file! use update2.php instead, it's much better
 */

/**
 * mobile/update.php
 * @author Elijah Carbonaro
 * 
 * Checks to see if there are any unviewed posts since last check for mobile apps
 * 
 * Parameters:
 * "email" - users's email
 * "password" - unencrypted users's password
 * "date" - time to get all posts later than, in format 2013-11-28_10:45:00.
 * 
 * Keep in mind the date syntax is wierd. 00:00:00 corresponds to 12:00 am, delimit by _
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

if (isset($_GET['email']) && isset($_GET['password']) && isset($_GET['date'])) {
    require('../ajax_php/header.inc.php');

    $mysqli = $GLOBALS['mysqli'];
    $email = $_GET['email'];
    $password = hash("sha512", $_GET['password']);
    $date = str_replace("_", " ", $_GET['date']);

    // Check incorrect email or password
    $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `email`=? AND `password`=?;");
    $statement->bind_param("ss", $email, $password);
    $statement->execute();
    $result = $statement->get_result();
    $statement->close();
    if (!mysqli_num_rows($result)) {
        echo('unknown');
        die;
    }
    
    $data = mysqli_fetch_assoc($result);
    $id = $data['id'];
    
    // Check for feed subscriptions
    $statement1 = $mysqli->prepare("SELECT * FROM `subscriptions_feeds` WHERE `student_id`=?;");
    $statement1->bind_param("i", $id);
    $statement1->execute();
    $result1 = $statement1->get_result();
    $statement1->close();
    if (!mysqli_num_rows($result1)) {
        echo('none');
        die;
    }
    
    // Prepare the "Grand Query"
    $allQuery = "";
    while ($row = mysqli_fetch_assoc($result1)) {
        $allQuery = $allQuery . "SELECT * FROM `feed_" . $row['feed_id'] . "` WHERE `date` > '$date' UNION ALL ";
    }
    $allQuery = substr($allQuery, 0, -11);
    $statement2 = $mysqli->prepare($allQuery);
    $statement2->execute();
    $result2 = $statement2->get_result();
    $statement2->close();
    
    if (!mysqli_num_rows($result2)) {
        // No new updates, just quit
        echo('none');
        die;
    }
    
    //XML back new updates
    echo('<?xml version="1.0"?>');
    echo('<data>');
    $currentFeedId = 0;
    $statement3 = $mysqli->prepare("SELECT `name` FROM `feeds` WHERE `id`=?;");
    $statement3->bind_param("i", $currentFeedId);
    while ($row = mysqli_fetch_assoc($result2)) {
        $currentFeedId = $row['feed_id'];
        $statement3->execute();
        $result3 = $statement3->get_result();
        $feedInfo = mysqli_fetch_assoc($result3);        
        echo('<post>');
        echo('<name>' . $feedInfo['name'] . '</name>');
        echo('<message>' . $row['message'] . '</message>');
        echo('<date>' . $row['date'] . '</date>');
        echo('</post>');
    }
    echo('</data>');
} else {
    echo("error");
    die;
}