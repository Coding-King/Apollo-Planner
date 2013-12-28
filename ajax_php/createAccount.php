<?php

/**
 * createAccount.php
 * @author Elijah Carbonaro
 * 
 * Creates a new user account
 * 
 * Parameters:
 * "email" -  email of the new account
 * "pass" - password (unhashed)
 * "name" - first name
 * "surname" - last name
 * "actpass" - account password
 * "type" - freshman, sophomore, junior, senior, or teacher
 * 
 * Returns:
 * "already" - the email is already registered in the system
 * "success" - a new account was created
 * "student not teacher" - student passsword given with "teacher" as year
 * "wrong pass" - account creation password was incorrect
 * "error" - a variable wasn't set
 */
if (isset($_POST['email']) && isset($_POST['pass']) && isset($_POST['name']) && isset($_POST['surname']) && isset($_POST['actpass']) && isset($_POST['type'])) {

    require('./header.inc.php');

    $name = $_POST['name'];
    $surname = $_POST['surname'];
    $password = hash("sha512", $_POST['pass']);
    $type = $_POST['type'];
    $email = $_POST['email'];
    $actpass = hash("sha512", $_POST['actpass']);
    $mysqli = $GLOBALS['mysqli'];

    $statement = $mysqli->prepare("SELECT * FROM `account_creation_passwords` WHERE `password`=? LIMIT 1;");
    $statement->bind_param("s", $actpass);
    $statement->execute();
    $result = $statement->get_result();

    if (mysqli_num_rows($result)) {
        // Account creation password was correct
        $statement->close();
        $data = mysqli_fetch_assoc($result);
            
        //Check for student password with teacher type
        if ($data['type'] == "student" && $type == "teacher") {
            echo("student not teacher");
            die;
        }
        //Check teacher entering non-teacher type
        if ($data['type'] == "teacher") {
            $type = "teacher";
        }

        //Create new account
        $statement1 = $mysqli->prepare("SELECT * FROM `users` WHERE `email`=?;");
        $statement1->bind_param("s", $email);
        $statement1->execute();
        $result1 = $statement1->get_result();
        if (mysqli_num_rows($result1)) {
            //An account with that email already exists
            echo("already");
            die;
        } else {
            //Create Account
            $statement1->close();
            $statement2 = $mysqli->prepare("INSERT INTO `users` (`name`, `surname`, `email`, `password`, `type`) VALUES (?, ?, ?, ?, ?);");
            $statement2->bind_param("sssss", $name, $surname, $email, $password, $type);
            $statement2->execute();
            $statement2->close();
            echo("success");

            //Get new user id
            $statement3 = $mysqli->prepare("SELECT `id` FROM `users` WHERE `email`=? AND `password`=? LIMIT 1;");
            $statement3->bind_param("ss", $email, $password);
            $statement3->execute();
            $result2 = $statement3->get_result();
            $userData = mysqli_fetch_assoc($result2);

            //Log in
            $_SESSION['userId'] = $userData['id'];
            die;
        }
    } else {
        // bad account creation password
        echo("wrong pass");
        die;
    }
} else {
    die("error");
    die;
}