<?php

//Allows for session variables
session_start();

//Database setup
$HOST_NAME = "localhost";
$USER_NAME = "root";
$DATABASE_PASSWORD = "";
$DATABASE_NAME = "apollo_planner";

//Connect to database
$mysqli = new mysqli($HOST_NAME, $USER_NAME, $DATABASE_PASSWORD, $DATABASE_NAME);
mysql_connect($HOST_NAME, $USER_NAME, $DATABASE_PASSWORD);
mysql_select_db($DATABASE_NAME);

/**
 * Checks if the user is logged in. Changes "PSD" cookie each time you check
 */
function isLoggedIn() {
    
    $mysqli = $GLOBALS['mysqli'];
    
    if (isset($_SESSION['userId'])) {
        return true;
    } else {
        //Check auto-login cookies
        /**
         * Cookie types:
         * 
         * USR - a hash of the user's email
         * PSD - a randomly generated number used as login key, changes each time it's checked
         * 
         */
        if (isset($_COOKIE['USR']) && strlen($_COOKIE['USR']) > 0 && isset($_COOKIE['PSD']) && strlen($_COOKIE['PSD'])) {
            $usr = mysql_real_escape_string($_COOKIE['USR']);
            $psd = mysql_real_escape_string($_COOKIE['PSD']);
            
            $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `auto_login`=? LIMIT 1");
            $statement->bind_param("s", $psd);
            $statement->execute();
            $result = $statement->get_result();
            if (mysqli_num_rows($result) != 0) {
                //Has set cookie, auto-login
                $row = $result->fetch_assoc();
                if(hash("sha512", $row['email']) == $usr) {
                    
                    //login
                    $_SESSION['userId'] = $row['id'];
                    
                    //Re-hash random cookie
                    $hash = mysql_real_escape_string(hash("sha512", session_id() . rand() . $_SESSION['userId']));
                    $statement = $mysqli->prepare("UPDATE `users` SET `auto_login`=? WHERE `id` =? LIMIT 1;");
                    $statement->bind_param("ss", $hash, $_SESSION['userId']);
                    $statement->execute();
                    $statement->close();
                    setcookie("PSD", $hash, time() + 60 * 60 * 24 * 21, "/");
                    return true;
                }
                
            } else {
                return false;
            }
        } else {
            return false;
        }
    } 
}

/**
 * Gets the user as a associative array, or returns false if not logged in
 * 
 * @return boolean
 */
function getUser() {
    
    $user = $_SESSION['userId'];
    if (isLoggedIn()) {
        $mysqli = $GLOBALS['mysqli'];
        $statement = $mysqli->prepare("SELECT * FROM `users` WHERE `id`=?;");
        $statement->bind_param("i", $user);
        $statement->execute();
        $result = $statement->get_result();
        if (mysqli_num_rows($result)) {
            return $result->fetch_assoc();
        } else {
            return false;
        }
        
    } else {
        return false;
    }
}

/**
 * Redirects the user to home.php (or teach.php) if they are already logged in
 */
function checkHomeRedirect() {
    $user = isLoggedIn();
    if ($user) {
        header("Location: ../home.php");
    }
}

/**
 * Sets up the auto-login database actions and cookies
 */
function startAutoLogin($newUserEmail) {
    $hash = mysql_real_escape_string(hash("sha512", session_id() . rand() . $_SESSION['userId']));
    $hash2 = mysql_real_escape_string(hash("sha512", $newUserEmail));
    $mysqli = $GLOBALS['mysqli'];
    $statement = $mysqli->prepare("UPDATE `users` SET `auto_login`=? WHERE `id`=? LIMIT 1");
    $statement->bind_param("ss", $hash, $_SESSION['userId']);
    $statement->execute();
    setcookie("PSD", $hash, time() + 60 * 60 * 24 * 21, "/");
    setcookie("USR", $hash2, time() + 60 * 60 * 24 * 21, "/");
}

/**
 * Modified URLS to add "http://" if it isn't present in URL.
 * 
 * @param string $url
 * 
 * @return modified URL
 */
function addhttp($url) {
    if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
        $url = "http://" . $url;
    }
    return $url;
}