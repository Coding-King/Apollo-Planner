<?php

/**
 * feedSubscriptions.php
 * @author Elijah Carbonaro
 * 
 * Updates a student's feed subscriptions, then returns an XML doc containing
 * the new feed info and first 15 assignments, and feed sumary
 * 
 * Parameters:
 * "feeds" - List of feed id's to subscribe to, delimited by _'s
 * 
 * Returns:
 * "error" - classes variable not set
 * "none" - you unsubscribed from all your classes, no XML to return
 * XML Doc - contians class info and first 15 posts.
 * 
 * XML Document Example:
 * <data totalcount="total feed count">
 *  <main>
 *    <feed>
 *      <id>
 *      <name>
 *      <owner_name>
 *      <description>
 *      <website>
 *      <num_posts>
 *      <posts>
 *          <entry>
 *              <id>
 *              <date>
 *              <message>
 *              <file>
 *              <file_title>
 *          </entry>
 *          ...
 *      </posts>
 *      </feed>
 *      ...
 *  </main>
 *  <summary>
 *      <entry>
 *          <id>
 *          <feed_id>
 *          <date>
 *          <message>
 *          <file>
 *          <file_title>
 *      </entry>
 *      ...
 *  </summary>
 * </data>
 */

if (isset($_POST['feeds'])) {
    
    require('./header.inc.php');
    $mysqli = $GLOBALS['mysqli'];    
    $user = $_SESSION['userId'];
    $feeds = explode("_", $_POST['feeds']);
    
    //Remove all old subscriptions
    $statement = $mysqli->prepare("DELETE FROM `subscriptions_feeds` WHERE `student_id`=?;");
    $statement->bind_param("i", $user);
    $statement->execute();
    $statement->close();
    
    //Add new subscriptions
    $statement2 = $mysqli->prepare("INSERT INTO `subscriptions_feeds` (`student_id`, `feed_id`) VALUES(?, ?);");
    $feed = 0;
    $statement2->bind_param("ii", $user, $feed);
    foreach ($feeds as $feed) {
        if ($feed != "") {
            $statement2->execute();
        }
    }
    $statement2->close();
    
    //Echo back XML results
    $statement3 = $mysqli->prepare("SELECT * FROM `subscriptions_feeds` WHERE `student_id`=?;");
    $statement3->bind_param("i", $user);
    $statement3->execute();
    $result = $statement3->get_result();
    
    if(mysqli_num_rows($result)) {
        echo('<?xml version="1.0"?>');
        echo('<data totalcount="' . mysqli_num_rows($result) . '">');
        echo('<main>');
        while($row = mysqli_fetch_assoc($result)) {
            echo('<feed>');
            
            //Get class info
            $feedId = $row['feed_id'];
            $statement4 = $mysqli->prepare("SELECT * FROM `feeds` WHERE `id`=?;");
            $statement4->bind_param("i", $feedId);
            $statement4->execute();
            $result1 = $statement4->get_result();
            $feedData = mysqli_fetch_assoc($result1);
            echo('<id>' . $feedData['id'] . '</id>');
            echo('<name>' . $feedData['name'] . '</name>');
            echo('<owner_name>' . $feedData['owner_name'] . '</owner_name>');
            if ($feedData['description'] != "") {
                echo('<description>' . $feedData['description'] . '</description>');
            } else {
                echo('<description>none</description>');
            }
            echo('<website>' . $feedData['website'] . '</website>');
            $statement4->close();
            
            //Get total number of posts
            $feedTableName = "feed_" . $feedId;
            $statement5 = $mysqli->prepare("SELECT * FROM `$feedTableName`;");
            $statement5->execute();
            $result2 = $statement5->get_result();
            $numPosts = mysqli_num_rows($result2);
            echo('<num_posts>' . $numPosts . '</num_posts>');
            $statement5->close();
            
            //Get posts
            $statement6 = $mysqli->prepare("SELECT * FROM `$feedTableName` ORDER BY `date` DESC LIMIT 0, 15;");
            $statement6->execute();
            $result3 = $statement6->get_result();
            
            if (mysqli_num_rows($result3)) {
                //Loop through posts
                echo('<posts>');
                while($row = mysqli_fetch_assoc($result3)) {
                    echo('<entry>');
                    echo('<id>' . $row['id'] . '</id>');
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
                    echo('</entry>');
                }
                echo('</posts>');
            } else {
                echo('<posts>none</posts>');
            }
            echo('</feed>');
        }
        echo('</main>');
        
        //Feed summary
        echo("<summary>");
        $allTables = "";
        $statement7 = $mysqli->prepare("SELECT `feed_id` FROM `subscriptions_feeds` WHERE `student_id`=?;");
        $statement7->bind_param("i", $user);
        $statement7->execute();
        $result4 = $statement7->get_result();
        while ($allFeedTables = mysqli_fetch_assoc($result4)) {
            $allTables .= "SELECT * FROM `feed_" . $allFeedTables['feed_id'] . "` UNION ALL ";
        }
        $allTables = substr($allTables, 0, -11);
        $allQuery = $allTables . " ORDER BY `date` DESC LIMIT 0, 15;";
        
        $statement8 = $mysqli->prepare($allQuery);
        $statement8->execute();
        $result5 = $statement8->get_result();

        while ($data = mysqli_fetch_assoc($result5)) {
            echo('<entry>');
            echo('<id>' . $data['id'] . '</id>');
            echo('<feed_id>' . $data['feed_id'] . '</feed_id>');
            echo('<date>' . $data['date'] . '</date>');
            echo('<message>' . $data['message'] . '</message>');
            if ($data['file'] == "")
                echo ('<file>nofile</file>');
            else
                echo('<file>' . $data['file'] . '</file>');
            if ($data['file_title'] == "")
                echo ('<file_title>nofile</file_title>');
            else
                echo('<file_title>' . $data['file_title'] . '</file_title>');

            echo('</entry>');
        }
        
        echo("</summary>");
        echo("</data>");
        die;
    } else {
        //You unsubscribed from all your feeds
        echo("none");
        die;
    }
} else {
    echo("error");
    die;
}