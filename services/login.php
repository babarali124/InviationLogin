<?php
/*
Developer:  Ehtesham Mehmood
Site:       PHPCodify.com
Script:     Angularjs Login Script using PHP MySQL and Bootstrap
File:       login.php
*/

//include database connection file
require_once 'db_config.php';

//echo '<pre>'; print_r($_POST);
// verifying user from database using PDO
$stmt = $DBcon->prepare("SELECT id, password from users WHERE email='".$_POST['email']."' && password='".$_POST['password']."'");
$stmt->execute();
$id = $stmt->fetchColumn();
$row = $stmt->rowCount();
if ($row > 0) {
    $stmt2 = $DBcon->prepare("UPDATE `users` SET `login_at` = now() WHERE id = '".$id."' ");
    $stmt2->execute();

    echo json_encode(['status' => 'success', 'id' => $id]);
} else {
    echo json_encode(['status' => 'error']);
}
