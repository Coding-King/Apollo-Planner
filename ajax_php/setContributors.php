<?php

/**
 * setContributors.php
 * @author Elijah Carbonaro
 * 
 * Sets the contributors for a class or feed
 * 
 * Parameters:
 * "students" - list of student id's delimited by _'s
 * "type_id" - type and id of class/feed, delimited by _, ie "feed_36"
 * 
 * Returns:
 * "done" - operation successfull
 * "error" - unset parameter
 * 
 */

if (isset($_POST['students']) && isset($_POST['type_id'])) {
    require('./header.inc.php');

    $mysqli = $GLOBALS['mysqli'];
    $students = explode("_", $_POST['students']);
    $type_id = $_POST['type_id'];
    
    // Clear current contributors
    $statement = $mysqli->prepare("DELETE FROM `contributors` WHERE `type_id`=?;");
    $statement->bind_param("s", $type_id);
    $statement->execute();
    $statement->close();
    
    // Prepare statements
    $student = "";
    $studentName = "";
    $statement1 = $mysqli->prepare("SELECT * FROM `users` WHERE `id`=?;");
    $statement2 = $mysqli->prepare("INSERT INTO `contributors` (`type_id`, `student_id`, `student_name`) VALUES (?, ?, ?);");
    $statement1->bind_param("i", $student);
    $statement2->bind_param("sis", $type_id, $student, $studentName);
    
    // Add each new student
    foreach ($students as $student) {
        if ($student != "") {
            $statement1->execute();
            $result = $statement1->get_result();
            $data = mysqli_fetch_assoc($result);
            $studentName = $data['name'] . " " . $data['surname'];
            $statement2->execute();
        }
    }
    echo("done");
    die;
} else {
    echo("error");
    die;
}