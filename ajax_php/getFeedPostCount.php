<?php

/**
 * getFeedPostCount.php
 * @author Elijah Carbonaro
 * 
 * Gets the total number of posts for a certain feed
 * 
 * Parameters:
 * "feedId" - the feed's id
 * 
 * Returns:
 * numRows - number of posts for the feed
 * "error" - unset parameter
 */

if(isset($_POST['feedId'])) {
    
    require("./header.inc.php");
    $mysqli = $GLOBALS['mysqli'];
    $feedId = $_POST['feedId'];

    if (!is_numeric($feedId)) {
        echo("error");
        die;
    }
    
    $statement = $mysqli->prepare("SELECT `id` FROM `feed_$feedId`;");
    $statement->execute();
    $result = $statement->get_result();
    echo(mysqli_num_rows($result));
    die;
    
} else {
    echo ("error");
    die;
}