<?php

/**
 * editAccount.php
 * @author Elijah Carbonaro
 * 
 * Edits a user's info like name, email, and password
 * 
 * Parameters:
 * "name" - first name
 * "surname" - last name
 * "email" - email
 * "password" - unhashed password
 * "confirmPassowrd" - unhashed old password to check authorization
 * 
 * Returns:
 * "bad pass" - incorrect old password
 * "done" - changes successful
 * "error" - unset variable
 * 
 */

if (isset($_POST['name']) && isset($_POST['surname']) && isset($_POST['email']) && isset($_POST['password']) && isset($_POST['newPassword'])) {
    
    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $id = $_SESSION['userId'];
    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $email = $_POST['email'];
    $password = hash("sha512", $_POST['password']);
    $newPassword = hash("sha512", $_POST['newPassword']);
    
    //Check password
    $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `id`=? AND `password`=?;");
    $statement->bind_param("is", $id, $password);
    $statement->execute();
    $result = $statement->get_result();
    
    if (mysqli_num_rows($result)) {
        $statement->close();
        if ($_POST['newPassword'] == "") {
            //No password reset
            $statement1 = $mysqli->prepare("UPDATE `users` SET `name`=?, `surname`=?, `email`=? WHERE `id`=?;");
            $statement1->bind_param("sssi", $name, $surname, $email, $id);
            $statement1->execute();
            $statement1->close();
        }
        else {
            //Yes password reset
            $statement1 = $mysqli->prepare("UPDATE `users` SET `name`=?, `surname`=?, `email`=?, `password`=? WHERE `id`=?;");
            $statement1->bind_param("ssssi", $name, $surname, $email, $newPassword, $id);
            $statement1->execute();
            $statement1->close();
        }
        
        //Change name for class and feed info
        $allName = $name . " " . $surname;
        
        $statement2 = $mysqli->prepare("UPDATE `classes` SET `owner_name`=? WHERE `owner_id`=?");
        $statement2->bind_param("si", $allName, $id);
        $statement2->execute();
        $statement2->close();
        
        $statement3 = $mysqli->prepare("UPDATE `feeds` SET `owner_name`=? WHERE `owner_id`=?");
        $statement3->bind_param("si", $allName, $id);
        $statement3->execute();
        $statement3->close();        
        
        echo("done");
        die;
    } else {
        //Wrong password
        echo("bad pass");
        die;
    }
    
} else {
    echo("error");
    die;
}