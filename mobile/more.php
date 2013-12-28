<?php

/**
 * mobile/more.php
 * @author Elijah Carbonaro
 * 
 * Gets the next 15 posts/assignments for mobile applications, use if the
 * num_posts XML number in main.php > 15 to load more
 * 
 * Parameters:
 * "email" - users' emails
 * "password" - unencrypted password
 * "type" - either 'class' or 'feed'
 * "id" - the SQL id of the class or feed
 * "start" - the number of posts already loaded. i.e. '15' will get posts 16-30
 * 
 * Returns:
 * "error" - unset parameter
 * "unknown" - email or password incorrect
 * "none" - you ran off the end of the available posts. You shouldn't be calling
 * this PHP file in this case, you should be done. Be sure to calibrate your num_posts
 * with each class/feed for when there are more to load :)
 * 
 * XML Doc contianing all the needed info
 * 
 * XML sample for a class:
 * 
 * <data>
 *  <post>
 *      <date_from>2013-11-28</date_from>
 *      <date_to>1970-01-01</date_to> [this date means there is no to date]
 *      <message>Hi there</message>
 *      <file>nofile</file>
 *      <file_title>nofile</file_title> ['nofile' means there is no file attached]
 *  </post>
 *  ...
 * </data>
 * 
 * XML sample for a feed:
 * 
 * <data>
 *  <post>
 *      <date>2013-11-28 12:49:00</date>
 *      <message>Hello again</message>
 *      <file>nofile</file_title>
 *      <file_title>nofile</file_title>
 *  </post>
 *  ...
 * </data>
 */

if (isset($_GET['email']) && isset($_GET['password']) && isset($_GET['type']) && isset($_GET['id']) && isset($_GET['start'])) {
    require('../ajax_php/header.inc.php');
    
    $mysqli = $GLOBALS['mysqli'];
    $email = $_GET['email'];
    $password = hash("sha512", $_GET['password']);
    $type = $_GET['type'];
    $SQLid = $_GET['id'];
    $start = $_GET['start'];
    
    //Check valid params
    if (!is_numeric($SQLid) || !is_numeric($start)) {
        echo('error');
        die;
    }
    
    $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `email`=? AND `password`=?;");
    $statement->bind_param("ss", $email, $password);
    $statement->execute();
    $result = $statement->get_result();
    $statement->close();

    // Check incorrect email or password
    if (!mysqli_num_rows($result)) {
        echo('unknown');
        die;
    }
    
    // Check for loading class or feed
    if ($type == 'class') {
        $statement1 = $mysqli->prepare("SELECT * FROM `class_$SQLid` ORDER BY `date_from` DESC LIMIT ? , 15;");
        $statement1->bind_param("i", $start);
        $statement1->execute();
        $result1 = $statement1->get_result();
        $statement1->close();
        if (mysqli_num_rows($result1)) {
            echo('<?xml version="1.0"?>');
            echo('<data>');
            while ($row = mysqli_fetch_assoc($result1)) {
                echo('<post>');
                echo('<date_from>' . $row['date_from'] . '</date_from>');
                echo('<date_to>' . $row['date_to'] . '</date_to>');
                echo('<message>' . $row['message'] . '</message>');
                if ($row['file'] == "") {
                    echo ('<file>nofile</file>');
                } else {
                    echo('<file>' . $row['file'] . '</file>');
                }
                if ($row['file_title'] == "") {
                    echo ('<file_title>nofile</file_title>');
                } else {
                    echo('<file_title>' . $row['file_title'] . '</file_title>');
                }
                echo('</post>');
            }
            echo('</data>');
            die;
        } else {
            echo('none'); // This really shouldn't happen
            die;
        }
    }
    
    if ($type == 'feed') {
        $statement2 = $mysqli->prepare("SELECT * FROM `feed_$SQLid` ORDER BY `date` DESC LIMIT ? , 15;");
        $statement2->bind_param("i", $start);
        $statement2->execute();
        $result2 = $statement2->get_result();
        $statement2->close();
        if (mysqli_num_rows($result2)) {
            echo('<?xml version="1.0"?>');
            echo('<data>');
            while ($row = mysqli_fetch_assoc($result2)) {
                echo('<post>');
                echo('<date>' . $row['date'] . '</date>');
                echo('<message>' . $row['message'] . '</message>');
                if ($row['file'] == "") {
                    echo ('<file>nofile</file>');
                } else {
                    echo('<file>' . $row['file'] . '</file>');
                }
                if ($row['file_title'] == "") {
                    echo ('<file_title>nofile</file_title>');
                } else {
                    echo('<file_title>' . $row['file_title'] . '</file_title>');
                }
                echo('</post>');
            }
            echo('</data>');
            die;
        } else {
            echo('none');
            die;
        }
    }
} else {
    echo('error');
    die;
}