<?php

/**
 * classSubscriptions.php
 * @author Elijah Carbonaro
 * 
 * Updates a student's class subscriptions, then returns an XML doc containing
 * the new class info and first 15 assignments
 * 
 * Parameters:
 * "classes" - List of class id's to subscribe to, delimited by _'s
 * 
 * Returns:
 * "error" - classes variable not set
 * "none" - you unsubscribed from all your classes, no XML to return
 * XML Doc - contians class info and first 15 posts.
 * 
 * XML Document Example:
 * <data totalcount="total class count">
 *  <class>
 *      <id>
 *      <name>
 *      <owner_name>
 *      <description>
 *      <periods>
 *      <website>
 *      <num_posts>
 *      <assignments>
 *          <entry>
 *              <id>
 *              <date_from>
 *              <date_to>
 *              <message>
 *              <file>
 *              <file_title>
 *          </entry>
 *          ...
 *      </assignments>
 *  </class>
 *  ...
 * </data>
 */

if (isset($_POST['classes'])) {
    
    require('./header.inc.php');
    $mysqli = $GLOBALS['mysqli'];
    $user = $_SESSION['userId'];
    $classes = explode("_", $_POST['classes']);
    
    //Remove all old subscriptions
    $statement = $mysqli->prepare("DELETE FROM `subscriptions_classes` WHERE `student_id`=?;");
    $statement->bind_param("i", $user);
    $statement->execute();
    $statement->close();
    
    //Add new subscriptions
    $statement2 = $mysqli->prepare("INSERT INTO `subscriptions_classes` (`student_id`, `class_id`) VALUES(?, ?);");
    $class = 0;
    $statement2->bind_param("ii", $user, $class);
    foreach ($classes as $class) {
        if ($class != "") {
            $statement2->execute();
        }
    }
    $statement2->close();
    
    //Echo back XML results
    $statement3 = $mysqli->prepare("SELECT * FROM `subscriptions_classes` WHERE `student_id`=?;");
    $statement3->bind_param("i", $user);
    $statement3->execute();
    $result = $statement3->get_result();
    if (mysqli_num_rows($result)) {
        echo('<?xml version="1.0"?>');
        echo('<data totalcount="' . mysqli_num_rows($result) . '">');
        
        while($row = mysqli_fetch_assoc($result)) {
            echo('<class>');
            
            //Get class info
            $classId = $row['class_id'];
            $statement4 = $mysqli->prepare("SELECT * FROM `classes` WHERE `id`=?;");
            $statement4->bind_param("i", $classId);
            $statement4->execute();
            $result1 = $statement4->get_result();
            $classData = mysqli_fetch_assoc($result1);
            echo('<id>' . $classData['id'] . '</id>');
            echo('<name>' . $classData['name'] . '</name>');
            echo('<owner_name>' . $classData['owner_name'] . '</owner_name>');
            if ($classData['description'] != "") {
                echo('<description>' . $classData['description'] . '</description>');
            } else {
                echo('<description>none</description>');
            }
            echo('<periods>' . $classData['periods'] . '</periods>');
            echo('<website>' . $classData['website'] . '</website>');
            $statement4->close();
            
            //Get total number of posts
            $classTableName = "class_" . $classId;
            $statement5 = $mysqli->prepare("SELECT * FROM `$classTableName`;");
            $statement5->execute();
            $result2 = $statement5->get_result();
            $numPosts = mysqli_num_rows($result2);
            echo('<num_posts>' . $numPosts . '</num_posts>');
            $statement5->close();
            
            //Get assignments
            $statement6 = $mysqli->prepare("SELECT * FROM `$classTableName` ORDER BY `date_from` DESC LIMIT 0, 15;");
            $statement6->execute();
            $result3 = $statement6->get_result();
            
            if (mysqli_num_rows($result3)) {
                //Loop through assignments
                echo('<assignments>');
                while($row = mysqli_fetch_assoc($result3)) {
                    echo('<entry>');
                    echo('<id>' . $row['id'] . '</id>');
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
                    echo('</entry>');
                }
                echo('</assignments>');
            } else {
                echo('<assignments>none</assignments>');
            }
            echo('</class>');
        }
        echo('</data>');
        die;
    } else {
        //You unsubscribed from all your classes
        echo("none");
        die;
    }
    
} else {
    echo("error");
    die;
}
?>