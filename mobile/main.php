<?php

/**
 * mobile/main.php
 * @author Elijah Carbonaro
 * 
 * This file is the primary interface iOS and Android will use to communicate with the server.
 * To get the appropriete data, pass the folowing parameters:
 * 
 * Parameters:
 * "email" - the user's email address
 * "password" - the non-encrypted user's password
 * 
 * Returns:
 * "error" - email or password unset
 * "teacher" - a teacher has attempted to log on
 * "unknown" - email/password are incorrect
 * XML Doc - An XML document containing all necessary mobile info
 * 
 * The following error messages may occur:
 * 
 * Format the XML will be echoed back in []'s indicate comments
 * 
 * <data>
 *  <user>
 *      <id>69</id>
 *      <first>Elijah</first>
 *      <last>Carbonaro</last>
 *  </user>
 *  <classes>
 *      [WILL JUST SAY "none" IF YOU AREN'T SUBSCRIBED TO ANY CLASSES]
 *      <class>
 *          <id>2</id> [the SQL id]
 *          <name>Calc</name>
 *          <owner_name>Arizpe</owner_name>
 *          <website>math.com</website> [OR "none" IF THERE IS NO WEBSITE ON FILE]
 *          <num_posts>332</num_posts>
 *          <posts>
 *              <post> [OR "none" IF THERE ARE NO POSTS]
 *                  <date_from>2013-11-20</date_from>
 *                  <date_to>1970-01-01</date_to>
 *                  <message>Do math!</message>
 *                  <file>82499725_system32picture.png</file> [OR "nofile" IF NO FILE IS ATTACHED]
 *                  <file_title>System 32 Picture!</file_title> [OR "nofile" IF NO FILE IS ATTACHED]
 *              </post>
 *              ...
 *          </posts>
 *      </class>
 *      ...
 *  </classes>
 *  <feeds>
 *      [WILL JUST SAY "none" IF YOU AREN'T SUBSCRIBED TO ANY FEEDS]
 *      <feed>
 *          <id>2</id> [the SQL id]
 *          <name>Calc</name>
 *          <owner_name>Arizpe</owner_name>
 *          <website>math.com</website> [OR "none" IF THERE IS NO WEBSITE ON FILE]
 *          <num_posts>29</num_posts>
 *          <posts>
 *              <post> [OR "none" IF THERE ARE NO POSTS]
 *                  <date>2013-11-01 11:29:00</date>
 *                  <message>Do math!</message>
 *                  <file>82499725_system32picture.png</file> [OR "nofile" IF NO FILE IS ATTACHED]
 *                  <file_title>System 32 Picture!</file_title> [OR "nofile" IF NO FILE IS ATTACHED]
 *              </post>
 *              ...
 *          </posts>
 *      </feed>
 *      ...
 *  </feeds>
 *  <feed_summary>
 *      [WILL JUST SAY "none" IF YOU AREN'T SUBSCRIBED TO ANY FEEDS]
 *      <post>
 *          <feed_id>7</feed_id> [SQL id, that is]
 *         <feed_name>Something</feed_name>
 *          <date>2013-11-01 11:29:00</date>
 *          <message>We have club today!</message>
 *          <file>nofile</file> [OR "nofile" IF NO FILE IS ATTACHED]
 *          <file_title>nofile</file_title> [OR "nofile" IF NO FILE IS ATTACHED]
 *      <post>
 *      ...
 *  </feed_summery>
 * </data>
 * 
 * 
 */
if (isset($_GET['email']) && isset($_GET['password'])) {
    require('../ajax_php/header.inc.php');

    $mysqli = $GLOBALS['mysqli'];
    $email = $_GET['email'];
    $password = hash("sha512", $_GET['password']);

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

    $data = mysqli_fetch_assoc($result);

    // Check teacher account
    if ($data['type'] == "teacher") {
        echo('teacher');
        die;
    }

    $id = $data['id'];

    //Begin XML generation
    echo('<?xml version="1.0"?>');
    echo('<data>');

    //User info
    echo('<user>');
    echo('<id>' . $id . '</id>');
    echo('<first>' . $data['name'] . '</first>');
    echo('<last>' . $data['surname'] . '</last>');
    echo('</user>');

    //Classes
    echo('<classes>');
    $statement1 = $mysqli->prepare("SELECT `class_id` FROM `subscriptions_classes` WHERE `student_id`=?;");
    $statement1->bind_param("i", $id);
    $statement1->execute();
    $result1 = $statement1->get_result();
    $statement1->close();
    if (!mysqli_num_rows($result1)) {
        echo('none'); // no subscribed classes
    } else {
        while ($classIdData = mysqli_fetch_assoc($result1)) {

            $statement2 = $mysqli->prepare("SELECT * FROM `classes` WHERE `id`=?;");
            $statement2->bind_param("i", $classIdData['class_id']);
            $statement2->execute();
            $result2 = $statement2->get_result();
            $statement2->close();
            $classData = mysqli_fetch_assoc($result2);
            $classId = $classData['id'];
            echo('<class>');
            //Basic class info
            echo('<id>' . $classId . '</id>');
            echo('<name>' . $classData['name'] . '</name>');
            echo('<owner_name>' . $classData['owner_name'] . '</owner_name>');
            if ($classData['website'] == "http://") {
                echo('<website>none</website>');
            } else {
                echo('<website>' . $classData['website'] . '</website>');
            }
            //Get total number of assignments
            $statement3 = $mysqli->prepare("SELECT `id` FROM `class_$classId`;");
            $statement3->execute();
            $result3 = $statement3->get_result();
            $statement3->close();
            echo('<num_posts>' . mysqli_num_rows($result3) . '</num_posts>');
            //Get posts
            echo('<posts>');
            $statement4 = $mysqli->prepare("SELECT * FROM `class_$classId` ORDER BY `date_from` DESC LIMIT 0 , 15;");
            $statement4->execute();
            $result4 = $statement4->get_result();
            $statement4->close();
            if (!mysqli_num_rows($result4)) {
                echo('none');
            } else {
                while ($row = mysqli_fetch_assoc($result4)) {
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
            }
            echo('</posts>');
            echo('</class>');
        }
    }
    echo('</classes>');

    //Feeds
    echo('<feeds>');
    $isFeeds = true; // check for feed summary
    
    $statement5 = $mysqli->prepare("SELECT `feed_id` FROM `subscriptions_feeds` WHERE `student_id`=?;");
    $statement5->bind_param("i", $id);
    $statement5->execute();
    $result5 = $statement5->get_result();
    $statement5->close();
    if (!mysqli_num_rows($result5)) {
        //No subscribed feeds
        echo('none');
        $isFeeds = false;
    } else {
        while ($feedIdData = mysqli_fetch_assoc($result5)) {
            
            $statement6 = $mysqli->prepare("SELECT * FROM `feeds` WHERE `id`=?;");
            $statement6->bind_param("i", $feedIdData['feed_id']);
            $statement6->execute();
            $result6 = $statement6->get_result();
            $statement6->close();
            $feedData = mysqli_fetch_assoc($result6);
            $feedId = $feedData['id'];
            //Basic feed info
            echo('<feed>');
            echo('<id>' . $feedId . '</id>');
            echo('<name>' . $feedData['name'] . '</name>');
            echo('<owner_name>' . $feedData['owner_name'] . '</owner_name>');
            if ($feedData['website'] == "http://") {
                echo('<website>none</website>');
            } else {
                echo('<website>' . $feedData['website'] . '</website>');
            }
            //Get total post count
            $statement7 = $mysqli->prepare("SELECT `id` FROM `feed_$feedId`;");
            $statement7->execute();
            $result7 = $statement7->get_result();
            $statement7->close();
            echo('<num_posts>' . mysqli_num_rows($result7) . '</num_posts>');
            //Get posts
            echo('<posts>');
            $statement8 = $mysqli->prepare("SELECT * FROM `feed_$feedId` ORDER BY `date` DESC LIMIT 0 , 15;");
            $statement8->execute();
            $result8 = $statement8->get_result();
            $statement8->close();
            if (!mysqli_num_rows($result8)) {
                echo('none');
            } else {
                while ($row = mysqli_fetch_assoc($result8)) {
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
            }
            echo('</posts>');
            echo('</feed>');
        }
    }
    echo('</feeds>');

    //Feed summary
    echo('<feed_summary>');
    if (!$isFeeds) {
        //No subscribed feeds, so no feed summary
        echo('none');
    } else {
        //Write custom UNION ALL query
        $allTables = "";
        $statement9 = $mysqli->prepare("SELECT `feed_id` FROM `subscriptions_feeds` WHERE `student_id`=?;");
        $statement9->bind_param("i", $id);
        $statement9->execute();
        $result9 = $statement9->get_result();
        $statement9->close();
        while ($allFeedTables = mysqli_fetch_assoc($result9)) {
            $allTables = $allTables . "SELECT * FROM `feed_" . $allFeedTables['feed_id'] . "` UNION ALL ";
        }
        $allTables = substr($allTables, 0, -11);

        $statement10 = $mysqli->prepare("$allTables ORDER BY `date` DESC LIMIT 0 , 15;");
        $statement10->execute();
        $result10 = $statement10->get_result();
        $statement10->close();
        while ($data = mysqli_fetch_assoc($result10)) {
            echo('<post>');
            echo('<feed_id>' . $data['feed_id'] . '</feed_id>');
            //Get feed's name
            $statement11 = $mysqli->prepare("SELECT `name` FROM `feeds` WHERE `id`=?;");
            $statement11->bind_param("i", $data['feed_id']);
            $statement11->execute();
            $result11 = $statement11->get_result();
            $statement11->close();
            $nameData = mysqli_fetch_assoc($result11);
            echo('<feed_name>' . $nameData['name'] . '</feed_name>');
            echo('<date>' . $data['date'] . '</date>');
            echo('<message>' . $data['message'] . '</message>');
            if ($data['file'] == "") {
                echo ('<file>nofile</file>');
            } else {
                echo('<file>' . $data['file'] . '</file>');
            }
            if ($data['file_title'] == "") {
                echo ('<file_title>nofile</file_title>');
            } else {
                echo('<file_title>' . $data['file_title'] . '</file_title>');
            }
            echo('</post>');
        }
    }
    echo('</feed_summary>');

    echo('</data>');
} else {
    echo('error');
    die;
}