<?php

/**
 * createClass.php
 * @author Elijah Carbonaro
 * 
 * Creates a class, adds it to the `classes` table, and initializes the `class_ID` table
 * 
 * Parameters:
 * "name" - name of the class
 * "description" - the blurb about the class
 * "website" - the class's native website
 * "periods" - integer representing class's periods
 * 
 * Returns:
 * "already" - class with this owner and name already exists
 * id - returns the new ID of the class
 * "error" - some variable not set
 */
if (isset($_POST['name']) && isset($_POST['description']) && isset($_POST['website']) && isset($_POST['periods'])) {
    require("./header.inc.php");

    $mysqli = $GLOBALS['mysqli'];
    $className = $_POST['name'];
    $description = $_POST['description'];
    $website = addhttp($_POST['website']);
    $periods = $_POST['periods'];
    $id = $_SESSION['userId'];

    //Check for repeats
    $statement = $mysqli->prepare("SELECT `id` FROM `classes` WHERE `name`=? AND `owner_id`=?;");
    $statement->bind_param("si", $className, $id);
    $statement->execute();
    $result = $statement->get_result();
    if (mysqli_num_rows($result)) {
        echo("already");
        exit;
    }
    $statement->close();

    //Get user's name
    $statement1 = $mysqli->prepare("SELECT * FROM `users` WHERE `id`=?");
    $statement1->bind_param("i", $id);
    $statement1->execute();
    $result1 = $statement1->get_result();
    $data = mysqli_fetch_assoc($result1);
    $name = $data['name'] . " " . $data['surname'];

    //Create class record
    $statement2 = $mysqli->prepare("INSERT INTO `classes` (`name`, `owner_id`, `owner_name`, `subscribers`, `description`, `website`, `periods`) VALUES (?, ?, ?, '0', ?, ?, ?);");
    $statement2->bind_param("sisssi", $className, $id, $name, $description, $website, $periods);
    $statement2->execute();
    $statement2->close();

    //Get class's new id
    $insertId = mysqli_insert_id($mysqli);

    //Generate class table
    $statement3 = $mysqli->prepare("CREATE TABLE class_$insertId ( id INT NOT NULL AUTO_INCREMENT, date_from date NOT NULL, date_to date, message VARCHAR(1000) NOT NULL, file_title VARCHAR(1000) NOT NULL, file VARCHAR(1000) NOT NULL, PRIMARY KEY ( id ));");
    $statement3->execute();

    //Echo back new id & website, delimited by _
    echo($insertId . "_" . $website);
    die;
} else {
    echo("error");
    die;
}
?>
