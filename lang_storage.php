<?php

ini_set("display_errors", 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");


$postdata = file_get_contents("php://input");

$request = json_decode($postdata);
$file_name = "../lang_results/" . $request->filename_post;
$subject_results = $request->results_post;

$outcome = file_put_contents($file_name, $subject_results, FILE_APPEND);

if ($outcome > 500 AND substr($file_name, -4) === ".txt") {
    echo "written: " . $outcome;
} else {
    if (is_file($file_name) === FALSE) {
        echo "Failed to save file " . $file_name . "! (" . $outcome . ")";
    } else {
        echo "Failed to properly save file " . $file_name . "! (" . $outcome . ")";
    }
}

?>