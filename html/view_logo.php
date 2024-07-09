<?php 
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/settings.class.inc.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/database.class.inc.php");
require_once(__LIB_DIR__ . "/cluster_file.class.inc.php");


$version = functions::validate_version();

$db = new database($version);

$cluster_id = filter_input(INPUT_GET, "cid", FILTER_SANITIZE_STRING);
$ascore = filter_input(INPUT_GET, "as", FILTER_SANITIZE_NUMBER_INT);

if (!$cluster_id || !functions::validate_cluster_id($db, $cluster_id)) {
    echo json_encode(array("valid" => false, "message" => "Invalid request."));
    exit(0);
}

$basepath = functions::get_data_dir_path2($db, $version, $ascore, $cluster_id);

$files = cluster_file::get_files($basepath);
if (isset($files["hmm.json"])) {
    $cluster_file = new cluster_file($basepath, "hmm.json");
    $json = stream_get_contents($cluster_file->get_handle());
} else {
    echo json_encode(array("valid" => false, "message" => "Invalid data."));
    exit(0);
}

$title = isset($_GET["title"]) ? $_GET["title"] : "";

?>

<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" type="text/css" href="css/hmm_logo.min.css">
<script src="vendor/components/jquery/jquery.min.js" type="text/javascript"></script>
<script src="js/hmm_logo.js" type="text/javascript"></script>
    <title>Logo</title>
</head>
<body>

<div><big><b><?php echo $title; ?></b></big></div>


<div id="logo" class="logo" data-logo='<?php echo $json; ?>'></div>

<script>
$(document).ready(function () {
    $("#logo").hmm_logo({height_toggle: true}).toggle_scale("obs");
});
</script>

</body>
</html>

