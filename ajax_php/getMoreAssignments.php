<?php

/**
 * getMoreAssignments.php
 * @author Elijah Carbonaro
 * 
 * Gets the next set of 15 of assignments for a class as an XML Doc
 * 
 * Parameters:
 * "classId" - the class's SQL id
 * "start" - the place to start loading assignments, multiple of 15
 * 
 * Returns:
 * "error" - unset parameter
 * XML Doc - contains the next posts
 * 
 * XML Document Example
 * <data totalcount="total number of assignments">
 *  <entry>
 *      <id>
 *      <date_from>
 *      <date_to>
 *      <message>
 *      <file> ["nofile" if no file]
 *      <file_title> ["nofile" if no file]
 *  </entry>
 *  ...      
 * </data>
 */

if (isset($_POST['classId']) && isset($_POST['start'])) {
    
    require('./header.inc.php');
    
    $mysqli = $GLOBALS['mysqli'];
    $classId = $_POST['classId'];
    $start = $_POST['start'];
    
    if (!is_numeric($classId) || !is_numeric($start)) {
        echo("error");
        die;
    }
    
    //Get total post count
    $statement = $mysqli->prepare("SELECT * FROM `class_$classId`;");
    $statement->execute();
    $result = $statement->get_result();
    $totalPosts = mysqli_num_rows($result);
    $statement->close();
    
    echo('<?xml version="1.0"?>');
    echo('<data totalcount="' . $totalPosts . '">');
    
    //Get database content
    $statement1 = $mysqli->prepare("SELECT * FROM `class_$classId` ORDER BY `date_from` DESC LIMIT $start, 15;");
    $statement1->execute();
    $result1 = $statement1->get_result();
    
    while($row = mysqli_fetch_assoc($result1)) {
        
        echo('<entry>');
        echo('<id>' . $row['id'] . '</id>');
        echo('<date_from>' . $row['date_from'] . '</date_from>');
        echo('<date_to>' . $row['date_to'] . '</date_to>');
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
