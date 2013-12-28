<?php

/**
 * deleteAssignment.php
 * @author Elijah Carbonaro
 * 
 * Deletes a posted assignment from a class, as well as its file and records
 * 
 * Parameters:
 * "class" - the class ID to delete from
 * "post" - the post ID to delete
 * 
 * Returns:
 * "done" - deletion was successful
 * "error" - some variable not set
 */

if (isset($_POST['class']) && isset($_POST['post'])) {

    require './header.inc.php';
    
    $mysqli = $GLOBALS['mysqli'];
    $class = "class_" . $_POST['class'];
    $post = $_POST['post'];
    
    //Check valid id's
    if (!is_numeric($_POST['class']) || $is_numeric($post)) {
        echo("error");
        die;
    }
    
    //Check for file to delete
    $statement = $mysqli->prepare("SELECT * FROM `$class` WHERE `id`=?");
    $statement->bind_param("i", $post);
    $statement->execute();
    $result = $statement->get_result();
    $data = mysqli_fetch_assoc($result);
    $file = $data['file'];
    $statement->close();
    if ($file != "") {
        @unlink("../uploads/" . $file);
        $statement1 = $mysqli->prepare("DELETE FROM `file_records` WHERE `system_name`=?;");
        $statement1->bind_param("s", $file);
        $statement1->execute();
        $statement1->close();
    }

    //Delete post
    $statement2 = $mysqli->prepare("DELETE FROM `$class` WHERE `id`=?;");
    $statement2->bind_param("i", $post);
    $statement2->execute();
    $statement2->close();

    echo("done");
    die;
} else {
    echo("error");
    die;
}