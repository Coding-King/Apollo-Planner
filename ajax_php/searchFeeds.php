<?php

/**
 * searchFeeds.php
 * @author Elijah Carbonaro
 * 
 * Searches for feeds by keyword, then returns results as XML Doc
 * 
 * Parameters:
 * "search" - the string to search by
 * 
 * Returns:
 * "error" - unset parameter
 * "none" - no results for search string
 * XML Doc - XML document containing search results
 * 
 * XML Document Example
 * <data>
 *  <feed>
 *      <id>
 *      <name>
 *      <owner_name>
 *      <description> ["none" if no description available]
 *  </feed>
 * </data>
 */

if (isset($_POST['search'])) {
    require('./header.inc.php');
    
    $mysqli = $GLOBALS['mysqli'];
    $search = '%' .$_POST['search'] . '%'; // % for wildcard operator

    $statement = $mysqli->prepare("SELECT * FROM `feeds` WHERE (`name` LIKE ?) OR (`owner_name` LIKE ?) ORDER BY `name` ASC;");
    $statement->bind_param("ss", $search, $search);
    $statement->execute();
    $result = $statement->get_result();
    
    if (mysqli_num_rows($result)) {
        echo('<?xml version="1.0"?>');
        echo('<data>');
        while ($row = mysqli_fetch_assoc($result)) {

            echo('<feed>');
            echo('<id>' . $row['id'] . '</id>');
            echo('<name>' . $row['name'] . '</name>');
            echo('<owner_name>' . $row['owner_name'] . '</owner_name>');
            if ($row['description'] == "") 
                echo ('<description>none</description>');
            else
                echo('<description>' . $row['description'] . '</description>');
            echo('</feed>');
        }
        echo ('</data>');
    } else {
        echo("none");
    }
    
} else {
    echo("error");
    die;
}