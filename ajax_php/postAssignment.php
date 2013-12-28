<?php

/**
 * postAssignment.php
 * @author Elijah Carbonaro
 * 
 * Posts a new assignment to a class
 * 
 * Parameters:
 * "from_date" - required from date
 * "message" - post content
 * "classId" - the class's id
 * "to_date" - not required, date to
 * file - upload a file
 * "file_title" - uploaded file's name
 * 
 * Returns:
 * "error" - unset parameter
 * id - posts id
 * id_fileStoragename - the post's id and file system name for file, delimited by _
 * 
 */

if (isset($_POST['from_date']) && isset($_POST['message']) && isset($_POST['classId']))
{
    $UploadDirectory	= '../uploads/';
    require("./header.inc.php");
    error_reporting(E_ALL ^ E_NOTICE); // needed for some file uploading reasons
    
    $mysqli = $GLOBALS['mysqli'];
    $userId = $_SESSION['userId'];
    $classTable = "class_" . $_POST['classId'];
    
    $fromDate = date("Y-m-d", strtotime($_POST['from_date']));
    $toDate = date("Y-m-d", strtotime($_POST['to_date']));
    $message = $_POST['message'];
    
    $wasFile = false;
    
    //Check for uploaded file
    if (is_uploaded_file($_FILES['file']['tmp_name'])) {
        $wasFile = true;
        $fileName = $_POST['file_title'];
        $fileSize = $_FILES['file']['size'];
        $path = $_FILES['file']['name'];
        $ext = pathinfo($path, PATHINFO_EXTENSION);
        $RandNumber = rand(0, 9999999999); 
        $fileStorageName = $_SESSION['userId'] . "_" . $fileName . "_" . $RandNumber . "." . $ext;
        move_uploaded_file($_FILES['file']['tmp_name'], $UploadDirectory . $fileStorageName);
        
        //Put into file records
        $statement = $mysqli->prepare("INSERT INTO file_records (owner_id, parent_id, system_name, friendly_name, size) VALUES (?, ?, ?, ?, ?);");
        $statement->bind_param("isssi", $userId, $classTable, $fileStorageName, $fileName, $fileSize);
        $statement->execute();
        $statement->close();
    }
    else
    {
        $fileStorageName = "";
        $fileName = "";
    }
    
    //Add assignment into class table
    $statement1 = $mysqli->prepare("INSERT INTO `$classTable` (`date_from`, `date_to`, `message`, `file_title`, `file`) VALUES (?, ?, ?, ?, ?);");
    $statement1->bind_param("sssss", $fromDate, $toDate, $message, $fileName, $fileStorageName);
    $statement1->execute();
    
    //Echo back insert id and file name, if applicable
    if ($wasFile) {
        echo(mysqli_insert_id($mysqli) . "_" . $fileStorageName);
    } else {
        echo(mysqli_insert_id($mysqli));
    }
    
    die;
} else {
    echo("error");
    die;
}