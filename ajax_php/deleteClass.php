<?php

/**
 * deleteClass.php
 * @author Elijah Carbonaro
 * 
 * Deletes a class, all its data, and files
 * 
 * Parameters:
 * "id" - class's id
 * 
 * Returns:
 * "done" - deletion successful
 * "not found" - unable to delete class because it doesn't dies
 * "error" - attempt to delete without being logged in
 * "error" - parameter not set
 */

if (isset($_POST['id'])) {
    require("./header.inc.php");
    if (isLoggedIn()) {
        $mysqli = $GLOBALS['mysqli'];
        $userId = $_SESSION['userId'];
        $classId = $_POST['id'];
        $className = "class_" . $classId;
        
        //Check valid classId
        if (!is_numeric($classId)) {
            echo("error");
            die;
        }

        //Ensure class exists, and check if user owns it
        $statement = $mysqli->prepare("SELECT * FROM `classes` WHERE `id`=? AND `owner_id`=?;");
        $statement->bind_param("ii", $classId, $userId);
        $statement->execute();
        $result = $statement->get_result();
        
        if (mysqli_num_rows($result)) {

            //Delete class's files
            $statement->close();
            $statement1 = $mysqli->prepare("SELECT * FROM `file_records` WHERE `parent_id`=?");
            $statement1->bind_param("s", $className);
            $statement1->execute();
            $result1 = $statement1->get_result();
            while ($row = mysqli_fetch_assoc($result1)) {
                $fileToDelete = $row['system_name'];
                unlink("../uploads/" . $fileToDelete);      
            }
            $statement1->close();
            
            //Clean up database
            $statement2 = $mysqli->prepare("DELETE FROM `file_records` WHERE `parent_id`=?;");
            $statement2->bind_param("s", $className);
            $statement2->execute();
            $statement2->close();
            
            $statement3 = $mysqli->prepare("DELETE FROM `classes` WHERE `id`=? AND `owner_id`=?");
            $statement3->bind_param("ii", $classId, $userId);
            $statement3->execute();
            $statement3->close();
            
            $statement4 = $mysqli->prepare("DROP TABLE `$className`");
            $statement4->execute();
            
            echo("done");
            die;
        } else {
            echo("not found");
            die;
        }
    } else {
        echo("error");
        die;
    }
} else {
    echo("error");
    die;
}