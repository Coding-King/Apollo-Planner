<?php

/**
 * getContributors.php
 * @author Elijah Carbonaro
 * 
 * Gets the contributors of a feed or class as an XML Doc
 * 
 * Parameters:
 * "typeId" - the SQL id of the class or feed
 * "type" - "class" or "feed", according to the desired type
 * 
 * Returns:
 * "error" - unset variable
 * "none" - no contributors are assigned for this class/feed
 * XML Doc - an XML document containing the contributors
 * 
 * XML Document Example:
 * <data>
 *  <student>
 *      <id>
 *      <name>
 *  </student>
 *  ...
 * </data>
 */

if (isset($_POST['id']) && isset($_POST['type'])) {
    require('./header.inc.php');
    
    $mysqli = $GLOBALS['mysqli'];
    $type = $_POST['type'] . "_" . $_POST['id'];
    
    $statement = $mysqli->prepare("SELECT * FROM `contributors` WHERE `type_id`=?;");
    $statement->bind_param("s", $type);
    $statement->execute();
    $result = $statement->get_result();
    
    if (mysqli_num_rows($result)) {
        echo('<?xml version="1.0"?>');
        echo('<data>');
        
        while ($row = mysqli_fetch_assoc($result)) {
            echo('<student>');
            echo('<id>' . $row['student_id'] . '</id>');
            echo('<name>' . $row['student_name'] . '</name>');
            echo('</student>');
        }
        
        echo('</data>');
        die;
        
    } else {
        echo('none');
        die;
    }
    
} else {
    echo('error');
    die;
}