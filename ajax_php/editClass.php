<?php

/**
 * editClass.php
 * @author Elijah Carbonaro
 * 
 * Edits a class's information like name, website, and description
 * 
 * Parameters:
 * "sqlid" - SQL id of the class
 * "name" - class's new name
 * "description" - new description
 * "website" - new website
 * "periods" - new periods
 * 
 * Returns:
 * website - returns the syntaxed updated website
 * "error" - class doesn't exits
 * "error" - unset variable
 */

if (isset($_POST['sqlid']) && isset($_POST['name']) && isset($_POST['description']) && isset($_POST['website']) && isset($_POST['periods'])) {
    require("./header.inc.php");
    
    $mysqli = $GLOBALS['mysqli'];
    $sqlid = $_POST['sqlid'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $website = addhttp($_POST['website']);
    $periods =$_POST['periods'];

    //Check class exists
    $statement = $mysqli->prepare("SELECT `id` FROM `classes` WHERE `id`=?;");
    $statement->bind_param("i", $sqlid);
    $statement->execute();
    $result = $statement->get_result();
    if (mysqli_num_rows($result)) {
        $statement->close();
        $statement1 = $mysqli->prepare("UPDATE `classes` SET `name`=?, `description`=?, `website`=?, `periods`=? WHERE `id`=?");
        $statement1->bind_param("sssii", $name, $description, $website, $periods, $sqlid);
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
?>
