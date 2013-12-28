<?php

/**
 * postPost.php
 * @author Elijah Carbonaro
 * 
 * Posts a new announcement to a feed
 * 
 * Parameters:
 * "message" - post content
 * "feedId" - the feed's id
 * file - upload a file
 * "file_title" - uploaded file's name
 * 
 * Returns:
 * "error" - unset parameter
 * id - posts id
 * id_fileStoragename - the post's id and file system name for file, delimited by _
 * 
 */

if (isset($_POST['feed_message']) && isset($_POST['feedId']))
{
    $UploadDirectory	= '../uploads/';
    require("./header.inc.php");
    error_reporting(E_ALL ^ E_NOTICE); // needed for some file uploading reasons
    
    $mysqli = $GLOBALS['mysqli'];
    $userId = $_SESSION['userId'];
    $feedTable = "feed_" . $_POST['feedId'];
    $feedId = $_POST['feedId'];
    
    $message = $_POST['feed_message'];
    
    $wasFile = false;
    
    //Check for file
    if (is_uploaded_file($_FILES['feed_file']['tmp_name'])) {
        $wasFile = true;
        $fileName = $_POST['feed_file_title'];
        $fileSize = $_FILES['feed_file']['size'];
        $path = $_FILES['feed_file']['name'];
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $RandNumber = rand(0, 9999999999); 
        $fileStorageName = $_SESSION['userId'] . "_" . $fileName . "_" . $RandNumber . "." . $ext;
        move_uploaded_file($_FILES['feed_file']['tmp_name'], $UploadDirectory . $fileStorageName);

        //Put into file records
        $statement = $mysqli->prepare("INSERT INTO file_records (owner_id, parent_id, system_name, friendly_name, size) VALUES (?, ?, ?, ?, ?);");
        $statement->bind_param("isssi", $userId, $feedTable, $fileStorageName, $fileName, $fileSize);
        $statement->execute();
        $statement->close();
    }
    else
    {
        $fileStorageName = "";
        $fileName = "";
    }
    
    //Get time/day
    date_default_timezone_set("America/Los_Angeles");
    $myDate = date('Y-m-d H:i:s');
    
    //Add post into feed table  
    $statement1 = $mysqli->prepare("INSERT INTO `$feedTable` (`date`, `feed_id`, `message`, `file_title`, `file`) VALUES (?, ?, ?, ?, ?);");
    $statement1->bind_param("sisss", $myDate, $feedId, $message, $fileName, $fileStorageName);
    $statement1->execute();
    
    //Echo back insert id and file name, if applicable
    if ($wasFile) {
        echo(mysqli_insert_id($mysqli) . "_" . $fileStorageName);
    } else {
        echo(mysqli_insert_id($mysqli));
    }
    
    die;
} else {
    echo('error');
    die;
}