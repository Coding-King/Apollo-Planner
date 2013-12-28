<?php

/**
 * editAssignment.php
 * @author Elijah Carbonaro
 * 
 * Edits a class's posted homework assignment
 * 
 * Parameters:
 * "from_date" - date from
 * "to_date" - no required, date to
 * "message" - assignment content
 * "classId" - class's id
 * "postId" - assignment's id
 * "fileClicked" - controls updating/removing/changing file
 * 
 * Returns:
 * "done" - changes successful
 * "error" - unset variable
 */

if (isset($_POST['from_date']) && isset($_POST['message']) && isset($_POST['classId']) && isset($_POST['postId']) && isset($_POST['fileClicked']))
{
    error_reporting(E_ALL ^ E_NOTICE); // in case of non-there file
    $UploadDirectory	= '../uploads/';
    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $userId = $_SESSION['userId'];
    $classTable = "class_" . $_POST['classId'];
    $postId = $_POST['postId'];
    $fromDate = date("Y-m-d", strtotime($_POST['from_date']));
    $toDate = date("Y-m-d", strtotime($_POST['to_date']));
    $message = $_POST['message'];
    
    if (!is_numeric($_POST['classId']) || !is_numeric($postId)) {
        echo("error");
        die;
    }
    
    //Check file modification
    if ($_POST['fileClicked'] == "false") {
        // No file modification, get old file data to update
        $statement = $mysqli->prepare("SELECT * FROM `$classTable` WHERE `id`=?;");
        $statement->bind_param("i", $postId);
        $statement->execute();
        $result = $statement->get_result();
        $row = mysqli_fetch_assoc($result);
        $oldFile = $row['file'];
        $oldFileTitle = $row['file_title'];
        $statement->close();
        
        //Update the assignment with the values
        $statement1 = $mysqli->prepare("UPDATE `$classTable` SET `date_from`=?, `date_to`=?, `message`=?, `file_title`=?, `file`=? WHERE `id`=?");
        $statement1->bind_param("sssssi", $fromDate, $toDate, $message, $oldFileTitle, $oldFile, $postId);
        $statement1->execute();
        echo("done");
        die;
    } else {
        //File has been modified, check if delete or edit
        if ($_POST['file_title'] == "") { //Delete file
            
            //Delete old file
            $statement = $mysqli->prepare("SELECT * FROM `$classTable` WHERE `id`=?;");
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
            
            //Update the assignment with the values
            $statement2 = $mysqli->prepare("UPDATE `$classTable` SET `date_from`=?, `date_to`=?, `message`=?, `file_title`='', `file`='' WHERE `id`=?");
            $statement2->bind_param("sssi", $fromDate, $toDate, $message, $postId);
            $statement2->execute();
            echo("done");
            die;
        } else { //Edit file
             
            // Delete old file
            $statement = $mysqli->prepare("SELECT * FROM `$classTable` WHERE `id`=?;");
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
            $statement2->bind_param("isssi", $userId, $classTable, $fileStorageName, $fileName, $fileSize);
            $statement2->execute();
            $statement2->close();
            
            //Update the assignment with new values
            $statement3 = $mysqli->prepare("UPDATE `$classTable` SET `date_from`=?, `date_to`=?, `message`=?, `file_title`=?, `file`=? WHERE `id`=?");
            $statement3->bind_param("sssssi", $fromDate, $toDate, $message, $fileName, $fileStorageName, $postId);
            $statement3->execute();
            echo("done");
            die;
        }
    }
    
} else {
    echo("error");
    die;
}