<?php

/**
 * getMorePosts.php
 * @author Elijah Carbonaro
 * 
 * Gets the next set of 15 of posts for a feed as an XML Doc
 * 
 * Parameters:
 * "feedId" - the feed's SQL id
 * "start" - the place to start loading posts, multiple of 15
 * 
 * Returns:
 * "error" - unset parameter
 * XML Doc - contains the next posts
 * 
 * XML Document Example
 * <data totalcount="number of returned posts">
 *  <entry>
 *      <id>
 *      <date>
 *      <time>
 *      <message>
 *      <file> ["nofile" if no file]
 *      <file_title> ["nofile" if no file]
 *  </entry>
 *  ...      
 * </data>
 */

if (isset($_POST['feedId']) && isset($_POST['start'])) {
    
    require('./header.inc.php');
    
    $mysqli = $GLOBALS['mysqli'];
    $feedId = $_POST['feedId'];
    $start = $_POST['start'];
    
    if (!is_numeric($feedId) || !is_numeric($start)) {
        echo("error");
        die;
    }
    
    //Get total post count
    $statement = $mysqli->prepare("SELECT * FROM `feed_$feedId`;");
    $statement->execute();
    $result = $statement->get_result();
    $totalPosts = mysqli_num_rows($result);
    $statement->close();
    
    echo('<?xml version="1.0"?>');
    echo('<data totalcount="' . $totalPosts . '">');
    
    
    //Get database content
    $statement1 = $mysqli->prepare("SELECT * FROM `feed_$feedId` ORDER BY `date` DESC LIMIT $start, 15;");
    $statement1->execute();
    $result1 = $statement1->get_result();
    
    while($row = mysqli_fetch_assoc($result1)) {
        
        $tempDate = explode(" ", $row['date']);
        
        echo('<entry>');
        echo('<id>' . $row['id'] . '</id>');
        echo('<date>' . $tempDate[0] . '</date>');
        echo('<time>' . $tempDate[1] . '</time>');
        echo('<message>' . $row['message'] . '</message>');
        if ($row['file'] == "")
            echo ('<file>nofile</file>');
        else
            echo('<file>' . $row['file'] . '</file>');
        if ($row['file_title'] == "")
            echo ('<file_title>nofile</file_title>');
        else
            echo('<file_title>' . $row['file_title'] . '</file_title>');
        echo('</entry>');
    }
    
    echo('</data>');
    exit;
    
} else {
    echo("error");
    die;
}
?>
