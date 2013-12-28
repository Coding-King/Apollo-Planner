<?php

/**
 * searchStudents.php
 * @author Elijah Carbonaro
 * 
 * Searches for students by keyword, then returns results as XML document
 * 
 * Parameters:
 * "query" - the string to search by
 * 
 * Returns:
 * "error" - unset parameter
 * "none" - no results for search string
 * XML Doc - XML document containing search results
 * 
 * XML Document Example
 * <data>
 *  <student>
 *      <id>
 *      <name> [includes both name and surname, delimited by " "]
 *  </student>
 * </data>
 * 
 */

if (isset($_POST['query'])) {
    require('./header.inc.php');

    $mysqli = $GLOBALS['mysqli'];
    $search = '%' . $_POST['query'] . '%';
    
    $statement = $mysqli->prepare("SELECT * FROM `users` WHERE (`name` LIKE ?) OR (`surname` LIKE ?) ORDER BY `surname` ASC;");
    $statement->bind_param("ss", $search, $search);
    $statement->execute();
    $result = $statement->get_result();
    
    if (mysqli_num_rows($result)) {
        echo('<?xml version="1.0"?>');
        echo('<data>');
        while ($row = mysqli_fetch_assoc($result)) {
            if ($row['type'] == "teacher") {
                continue;
            }
            echo('<student>');
                echo('<id>' . $row['id'] . '</id>');
                echo('<name>' . $row['name'] . " " . $row['surname'] . '</name>');
            echo('</student>');
        }
        echo ('</data>');
    } else {
        echo("none");
    }
    
} else {
    echo("error");
    die;
}