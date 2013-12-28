<?php

/**
 * editPost.php
 * @author Elijah Carbonaro
 * 
 * Edits a feed's posted announcement
 * 
 * Parameters:
 * "message" - post content
 * "feedId" - feed's id
 * "feedPostId" - post's id
 * "feedFileClicked" - controls updating/removing/changing file
 * 
 * Returns:
 * "done" - changes successful
 * "error" - unset variable
 */

if (isset($_POST['feed_message']) && isset($_POST['feedId']) && isset($_POST['feedPostId']) && isset($_POST['feedFileClicked']))
{

    error_reporting(E_ALL ^ E_NOTICE); // in case of non-there file    
    $UploadDirectory	= '../uploads/';
    date_default_timezone_set("America/Los_Angeles");
    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $userId = $_SESSION['userId'];
    $feedTable = "feed_" . $_POST['feedId'];
    $postId = $_POST['feedPostId'];
    $date = date("Y-m-d H:m:s");
    $message = $_POST['feed_message'];
    
    if (!is_numeric($_POST['feedId']) || !is_numeric($postId)) {
        echo("error");
        die;
    }
    
    //Check file modification
    if ($_POST['feedFileClicked'] == "false") {
        // No file modification, get old file data to update
        $statement = $mysqli->prepare("SELECT * FROM `$feedTable` WHERE `id`=?;");
        $statement->bind_param("i", $postId);
        $statement->execute();
        $result = $statement->get_result();
        $row = mysqli_fetch_assoc($result);
        $oldFile = $row['file'];
        $oldFileTitle = $row['file_title'];
        $statement->close();
        
        if (isset($_POST['update_time'])) {
            //Update the time/day
            $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `date`=?, `message`=?, `file_title`=?, `file`=? WHERE `id`=?;");
            $statement1->bind_param("ssssi", $date, $message, $oldFileTitle, $oldFile, $postId);
            $statement1->execute();
        } else {
            //Do not update the time/day
            $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `message`=?, `file_title`=?, `file`=? WHERE `id`=?;");
            $statement1->bind_param("sssi", $message, $oldFileTitle, $oldFile, $postId);
            $statement1->execute();
        }
        echo("done");
        die;
    } else {
        //File has been modified, check if delete or edit
        if ($_POST['feed_file_title'] == "") { //Delete file
            
            //Delete old file
            $statement = $mysqli->prepare("SELECT * FROM `$feedTable` WHERE `id`=?;");
            $statement->bind_param("i", $postId);
            $statement->execute();
            $result = $statement->get_result();
            $row = mysqli_fetch_assoc($result);
            @unlink("../uploads/" . $row['file']); 
            $statement->close();
            
            //Remove file records
            $statement1 = $mysqli->prepare("DELETE FROM `file_records` WHERE `system_name`=?;");
            $statement1->bind_param("s", $row['file']);
            $statement1->execute();
            $statement1->close();
            
            //Update post with new values
            if (isset($_POST['update_time'])) {
                //Update the time/day
                $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `date`=?, `message`=?, `file_title`='', `file`='' WHERE `id`=?;");
                $statement1->bind_param("ssi", $date, $message, $postId);
                $statement1->execute();
            } else {
                //Do not update the time/day
                $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `message`=?, `file_title`='', `file`='' WHERE `id`=?;");
                $statement1->bind_param("si", $message, $postId);
                $statement1->execute();
            }
            echo("done");
            die;
        } else { //Edit file
             
            // Delete old file
            $statement = $mysqli->prepare("SELECT * FROM `$feedTable` WHERE `id`=?;");
            $statement->bind_param("i", $postId);
            $statement->execute();
            $result = $statement->get_result();
            $row = mysqli_fetch_assoc($result);
            @unlink("../uploads/" . $row['file']); 
            $statement->close();
            
            //Remove file records
            $statement1 = $mysqli->prepare("DELETE FROM `file_records` WHERE `system_name`=?;");
            $statement1->bind_param("s", $row['file']);
            $statement1->execute();
            $statement1->close();
            
            //Manage new file
            $fileName = $_POST['file_title'];
            $fileSize = $_FILES['file']['size'];
            $path = $_FILES['file']['name'];
            $ext = pathinfo($path, PATHINFO_EXTENSION);
            $RandNumber = rand(0, 9999999999); 
            $fileStorageName = $_SESSION['userId'] . "_" . $fileName . "_" . $RandNumber . "." . $ext;
            move_uploaded_file($_FILES['file']['tmp_name'], $UploadDirectory . $fileStorageName);
        
            //Add to file records
            $statement2 = $mysqli->prepare("INSERT INTO `file_records` (`owner_id`, `parent_id`, `system_name`, `friendly_name`, `size`) VALUES (?, ?, ?, ?, ?);");
            $statement2->bind_param("isssi", $userId, $feedTable, $fileStorageName, $fileName, $fileSize);
            $statement2->execute();
            $statement2->close();
            
            //Update the post with new values
            if (isset($_POST['update_time'])) {
                //Update the time/day
                $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `date`=?, `message`=?, `file_title`=?, `file`=? WHERE `id`=?;");
                $statement1->bind_param("ssssi", $date, $message, $fileName, $fileStorageName, $postId);
                $statement1->execute();
            } else {
                //Do not update the time/day
                $statement1 = $mysqli->prepare("UPDATE `$feedTable` SET `message`=?, `file_title`=?, `file`=? WHERE `id`=?;");
                $statement1->bind_param("sssi", $message, $fileName, $fileStorageName, $postId);
                $statement1->execute();
            }
            echo("done");
            die;
        }
    }
    echo("done");
    die;
} else {
    echo("error");
    die;
}