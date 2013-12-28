<?php

/**
 * createFeed.php
 * @author Elijah Carbonaro
 * 
 * Creates a feed, adds it to the `feeds` table, and initializes the `feed_ID` table
 * 
 * Parameters:
 * "name" - name of the feed
 * "description" - the blurb about the feed
 * "website" - the feed's native website
 * 
 * Returns:
 * "already" - feed with this owner and name already exists
 * id - returns the new ID of the feed
 * "error" - some variable not set
 */
if (isset($_POST['name']) && isset($_POST['description']) && isset($_POST['website'])) {
    require("./header.inc.php");

    $mysqli = $GLOBALS['mysqli'];
    $feedName = $_POST['name'];
    $description = $_POST['description'];
    $website = addhttp($_POST['website']);
    $id = $_SESSION['userId'];

    //Check for repeats
    $statement = $mysqli->prepare("SELECT `id` FROM `feeds` WHERE `name`=? AND `owner_id`=?;");
    $statement->bind_param("si", $feedName, $id);
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

    //Create feed record
    $statement2 = $mysqli->prepare("INSERT INTO `feeds` (`name`, `owner_id`, `owner_name`, `subscribers`, `description`, `website`) VALUES (?, ?, ?, '0', ?, ?);");
    $statement2->bind_param("sisss", $feedName, $id, $name, $description, $website);
    $statement2->execute();
    $statement2->close();
    
    //Get feed's new id
    $insertId = mysqli_insert_id($mysqli);

    //Generate feed table
    $statement3 = $mysqli->prepare("CREATE TABLE feed_$insertId ( id INT NOT NULL AUTO_INCREMENT, feed_id int NOT NULL, date datetime NOT NULL, message VARCHAR(1000) NOT NULL, file_title VARCHAR(1000) NOT NULL, file VARCHAR(1000) NOT NULL, PRIMARY KEY ( id ));");
    $statement3->execute();

    //Echo back new id & website, delimited by _
    echo($insertId . "_" . $website);
    die;
} else {
    echo("error");
    die;
}
?>
