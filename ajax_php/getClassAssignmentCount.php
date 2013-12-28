<?php

/**
 * getClassAssignmentCount.php
 * @author Elijah Carbonaro
 * 
 * Gets the total number of posts for a certain class
 * 
 * Parameters:
 * "classId" - the class's id
 * 
 * Returns:
 * numRows - number of posts for the class
 * "error" - unset parameter
 * 
 */

if(isset($_POST['classId'])) {
    
    require("./header.inc.php");
    $mysqli = $GLOBALS['mysqli'];
    $classId = $_POST['classId'];
    
    if (!is_numeric($classId)) {
        echo("error");
        die;
    }
    
    $statement = $mysqli->prepare("SELECT `id` FROM `class_$classId`;");
    $statement->execute();
    $result = $statement->get_result();
    echo(mysqli_num_rows($result));
    die;
    
} else {
    echo ("error");
    die;
}