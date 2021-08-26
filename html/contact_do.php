<?php
require_once(__DIR__ . "/../init.php");
require_once(__DIR__ . "/../libs/settings.class.inc.php");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    die("Invalid request");
}

$to = settings::get_submit_email();

$inputName = filter_input(INPUT_POST, "inputName", FILTER_SANITIZE_STRING);
$inputEmail = filter_input(INPUT_POST, "inputEmail", FILTER_SANITIZE_EMAIL);
$inputInstitution = filter_input(INPUT_POST, "inputInstitution", FILTER_SANITIZE_STRING);
$inputComments = filter_input(INPUT_POST, "inputComments", FILTER_SANITIZE_STRING);

$valid = true;
$message = array();
if (!$inputName) {
    array_push($message, "Invalid name input.");
    $valid = false;
}
if (!filter_var($inputEmail, FILTER_VALIDATE_EMAIL)) {
    array_push($message, "Invalid email input.");
    $valid = false;
}
if (!$inputInstitution) {
    array_push($message, "Invalid institution.");
    $valid = false;
}
if (!$inputComments) {
    array_push($message, "Require comments.");
    $valid = false;
}

$result = array("message" => $message, "valid" => $valid);


//TODO: twigify email

if (!$valid) {
    echo json_encode($result);
    exit(0);
}


$smtp_host = settings::get_smtp_host();
$smtp_port = settings::get_smtp_port();
$smtp_user = settings::get_smtp_user();
$smtp_pass = settings::get_smtp_password();
$from_email = settings::get_from_email();
$to_email = settings::get_to_email();
$email = new \IGBIllinois\email($smtp_host, $smtp_port, $smtp_user, $smtp_pass);

$message = <<<MAIL
<html>
<head>
<style>
body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"; }
td { padding: 5px;  padding-left: 30px; }
.out-label { font-weight: bold; }
</style>
<body>
<p>Feedback was submitted.</p>
<table border="0">
    <tr><td class="out-label">Name</td><td>$inputName</td></tr>
    <tr><td class="out-label">Email</td><td>$inputEmail</td></tr>
    <tr><td class="out-label">Institution</td><td>$inputInstitution</td></tr>
    <tr><td class="out-label">Comments</td><td>$inputComments</td></tr>
</table>
</body>
</html>
MAIL;

$text_message = <<<MAIL
Feedback was submitted.

Name: $inputName
Email: $inputEmail
Institution: $inputInstitution
Comments: $inputComments

MAIL;


$subject = "RadicalSAM.org Feedback Submission";
$email->set_to_emails($to_email);
$email->send_email($from_email, $subject, $text_message, $message);

echo json_encode($result);


