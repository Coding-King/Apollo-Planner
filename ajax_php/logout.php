<?php

/**
 * logout.php
 * @author Elijah Carbonaro
 * 
 * Logs the user out of the system
 * 
 */

require './header.inc.php';

$mysqli = $GLOBALS['mysqli'];

//Clear auto login cookie
$statement = $mysqli->prepare("UPDATE `users` SET `auto_login`='' WHERE `id`=? LIMIT 1;");
$statement->bind_param("i", $_SESSION['userId']);
$statement->execute();
$statement->close();

//Unset session ID key
unset($_SESSION['userId']);

//Remove user cookies
setcookie("USR", "", time() - 3600, "/");
setcookie("PSD", "", time() - 3600, "/");
