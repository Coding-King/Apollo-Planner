<?php

/**
 * login.php
 * @author Elijah Carbonaro
 * 
 * Logs the user into Apollo Planner
 * 
 * Parameters:
 * "email" - user's email
 * "password" - unhashed password
 * "remember" - whether or not to start auto-login
 * 
 * Return:
 * "correct" - successful login
 * "wrong" - incorrect email or password
 * "error" - unset parameter
 * 
 */

if (isset($_POST['email']) && isset($_POST['password']) && isset($_POST['remember'])) {

    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $email = $_POST['email'];
    $password = hash("sha512", $_POST['password']);

    //Search database for email password combo
    $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `email`=? AND `password`=? LIMIT 1;");
    $statement->bind_param("ss", $email, $password);
    $statement->execute();
    $result = $statement->get_result();
    
    //Check if found
    if (mysqli_num_rows($result)) {
        $userData = mysqli_fetch_assoc($result);
        $email = $userData['email'];
        echo("correct");
    } else {
        echo("wrong");
        die;
    }

    //Set session ID number for login and other important stuffs
    $_SESSION['userId'] = $userData['id'];

    //Check auto login
    if ($_POST['remember'] === "true")
        startAutoLogin($email);
    
} else {
    echo("error");
    die;
}
