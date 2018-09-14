<?php

require_once 'db_config.php';

//echo '<pre>'; print_r($_POST);
// verifying user from database using PDO
if ($_GET['user_id']) {
    $stmt2 = $DBcon->prepare("UPDATE `users` SET `logout_at` = now() WHERE id = '".$_GET['user_id']."' ");
    $stmt2->execute();
    echo json_encode(['status' => 'success']);
}
