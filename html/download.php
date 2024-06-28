<?php
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/settings.class.inc.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/database.class.inc.php");
require_once(__LIB_DIR__ . "/cluster_file.class.inc.php");

$type = filter_input(INPUT_GET, "t", FILTER_SANITIZE_STRING);
$cluster_id = filter_input(INPUT_GET, "c", FILTER_SANITIZE_STRING);
$version = filter_input(INPUT_GET, "v", FILTER_SANITIZE_STRING);
$ascore = filter_input(INPUT_GET, "as", FILTER_SANITIZE_NUMBER_INT);

$type_data = filter_type($type);
if (!is_array($type_data)) {
    die("Error; input is not valid [1]");
}
if (!preg_match("/^[cluster0-9\-]+$/", $cluster_id) && $cluster_id != "fullnetwork") {
    //TODO: error
    die("Error; input is not valid [2]");
}
$db = new database($version);
if (!functions::validate_cluster_id($db, $cluster_id)) {
    //TODO: error
    die("Error; input is not valid [3]");
}
$version = functions::validate_version($version);

$basepath = functions::get_data_dir_path2($db, $version, $ascore, $cluster_id);
$file_data = null;
$download_name = "";
$ascore_prefix = $ascore ? "AS${ascore}_" : "";


$download_type = $type_data[0];
foreach ($type_data[1] as $file) {
    if (cluster_file::exists($basepath, $file)) {
        $file_data = new cluster_file($basepath, $file);
        $download_name = "${cluster_id}_${ascore_prefix}$file";
        break;
    } else if ($ascore) {
        $parent_cluster_id = functions::get_dicing_parent($db, $cluster_id, $ascore);
        if ($parent_cluster_id) {
            $parent_path = functions::get_data_dir_path2($db, $version, $ascore, $parent_cluster_id);
            if (cluster_file::exists($parent_path, $file)) {
                $file_data = new cluster_file($parent_path, $file);
                $download_name = "${parent_cluster_id}_${ascore_prefix}$file";
                break;
            }
        }
    }
}


if (!$file_data) {
    die("Invalid input [4]");
}

$file_size = $file_data->get_size();


functions::send_headers($download_name, $file_size);
functions::send_file_handle($file_data->get_handle());
exit();




function filter_type($type) {
    $RES = "";
    if (startsWith($type, "cr")) {
        $RES = strtoupper(substr($type, 4, 1)) . "_";
        $type = substr($type, 0, 4);
    }
    // The first value in the returned array is the download type; i=direct download (e.g. images), p=packed download (i.e. extract from packed tar file)
    $types = array(
        "net" => array("i", array("ssn_lg.png")),
        "hmm" => array("p", array("hmm.hmm")),
        "hmmpng" => array("i", array("hmm.png")),
        "hist" => array("i", array("length_histogram_lg.png", "length_histogram_uniprot.zip", "length_histogram_uniprot_lg.png")),
        "hist_filt" => array("i", array("length_histogram_filtered_lg.png")),
        "hist_up" => array("i", array("length_histogram_uniprot.zip")),
        "hist_ur50" => array("i", array("length_histogram_uniref50_lg.png", "length_histogram_uniref50.zip")),
        "msa" => array("p", array("msa.afa")),
        "uniprot_id" => array("p", array("uniprot.txt")),
        "uniref50_id" => array("p", array("uniref50.txt")),
        "uniref90_id" => array("p", array("uniref90.txt")),
        "uniprot_fasta" => array("p", array("uniprot_fasta.zip")),
        "uniref50_fasta" => array("p", array("uniref50_fasta.zip")),
        "uniref90_fasta" => array("p", array("uniref90_fasta.zip")),
        "weblogo" => array("i", array("weblogo.png")),
        "crpo" => array("p", array("consensus_residue_${RES}position.txt")),
        "crpe" => array("p", array("consensus_residue_${RES}percentage.txt")),
        "crid" => array("p", array("consensus_residue_${RES}all.zip")),
        "swissprot" => array("p", array("swissprot.txt")),
        "ssn" => array("i", array("ssn.zip", "ssn.xgmml")));
    if (isset($types[$type]))
        return $types[$type];
    else
        return false;
}

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

