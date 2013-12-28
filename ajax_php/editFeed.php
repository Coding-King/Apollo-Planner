<?php

/**
 * editFeed.php
 * @author Elijah Carbonaro
 * 
 * Edits a feeds's information like name, website, and description
 * 
 * Parameters:
 * "sqlid" - SQL id of the class
 * "name" - class's new name
 * "description" - new description
 * "website" - new website
 * 
 * Returns:
 * website - returns the syntaxed updated website
 * "error" - class doesn't exits
 * "error" - unset variable
 */

if (isset($_POST['sqlid']) && isset($_POST['name']) && isset($_POST['description']) && isset($_POST['website'])) {
    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];    
    $sqlid = $_POST['sqlid'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $website = addhttp($_POST['website']);

    //Check feed exists
    $statement = $mysqli->prepare("SELECT `id` FROM `feeds` WHERE `id`=?;");
    $statement->bind_param("i", $sqlid);
    $statement->execute();
    $result = $statement->get_result();
    if (mysqli_num_rows($result)) {
        $statement->close();
        $statement1 = $mysqli->prepare("UPDATE `feeds` SET `name`=?, `description`=?, `website`=? WHERE `id`=?");
        $statement1->bind_param("sssi", $name, $description, $website, $sqlid);
        $statement1->execute();
        echo($website);
        die;
    } else {
        echo("error");
        die;
    }
} else {
    echo("error");
    die;
}