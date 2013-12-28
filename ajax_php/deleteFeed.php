<?php

/**
 * deleteFeed.php
 * @author Elijah Carbonaro
 * 
 * Deletes a feed, all its data, and files
 * 
 * Parameters:
 * "id" - feed's id
 * 
 * Returns:
 * "done" - deletion successful
 * "not found" - unable to delete feed because it doesn't exits
 * "error" - attempt to delete without being logged in
 * "error" - parameter not set
 */
if (isset($_POST['id'])) {
    require("./header.inc.php");
    if (isLoggedIn()) {
        $mysqli = $GLOBALS['mysqli'];
        $userId = $_SESSION['userId'];
        $feedId = $_POST['id'];
        $feedName = "feed_" . $feedId;

        //Check valid feedId
        if (!is_numeric($feedId)) {
            echo("error");
            die;
        }

        //Ensure feed exists, and check if user owns it
        $statement = $mysqli->prepare("SELECT * FROM `feeds` WHERE `id`=? AND `owner_id`=?;");
        $statement->bind_param("ii", $feedId, $userId);
        $statement->execute();
        $result = $statement->get_result();

        if (mysqli_num_rows($result)) {

            //Delete class's files
            $statement->close();
            $statement1 = $mysqli->prepare("SELECT * FROM `file_records` WHERE `parent_id`=?");
            $statement1->bind_param("s", $feedName);
            $statement1->execute();
            $result1 = $statement1->get_result();
            while ($row = mysqli_fetch_assoc($result1)) {
                $fileToDelete = $row['system_name'];
                unlink("../uploads/" . $fileToDelete);
            }
            $statement1->close();

            //Clean up database
            $statement2 = $mysqli->prepare("DELETE FROM `file_records` WHERE `parent_id`=?;");
            $statement2->bind_param("s", $feedName);
            $statement2->execute();
            $statement2->close();

            $statement3 = $mysqli->prepare("DELETE FROM `feeds` WHERE `id`=? AND `owner_id`=?");
            $statement3->bind_param("ii", $feedId, $userId);
            $statement3->execute();
            $statement3->close();

            $statement4 = $mysqli->prepare("DROP TABLE `$feedName`");
            $statement4->execute();

            echo("done");
            die;
        } else {
            echo("not found");
            die;
        }
    } else {
        echo("error");
        die;
    }
} else {
    echo("error");
    die;
}