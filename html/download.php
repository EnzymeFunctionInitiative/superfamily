<?php
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/settings.class.inc.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/database.class.inc.php");

$type = filter_input(INPUT_GET, "t", FILTER_SANITIZE_STRING);
$cluster_id = filter_input(INPUT_GET, "c", FILTER_SANITIZE_STRING);
$version = filter_input(INPUT_GET, "v", FILTER_SANITIZE_STRING);
$ascore = filter_input(INPUT_GET, "as", FILTER_SANITIZE_NUMBER_INT);

$type = filter_type($type);
if (!is_array($type)) {
    die("Error; input is not valid [1]");
}
if (!preg_match("/^[cluster0-9\-]+$/", $cluster_id)) {
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
$fpath = "";
$fname = "";
$ascore_prefix = $ascore ? "AS${ascore}_" : "";


$options = array("");
foreach ($options as $prefix) {
    foreach ($type as $suffix) {
        $fname = "${prefix}${suffix}";
        $file = "$basepath/$fname";
        if (file_exists($file)) {
            $fpath = $file;
            $fname = "${cluster_id}_${ascore_prefix}$suffix";
            break;
        } else if ($ascore) {
            $parent_cluster_id = functions::get_dicing_parent($db, $cluster_id, $ascore);
            if ($parent_cluster_id) {
                $parent_path = functions::get_data_dir_path2($db, $version, $ascore, $parent_cluster_id);
                $file = "$parent_path/$fname";
                if (file_exists($file)) {
                    $fpath = $file;
                    $fname = "${parent_cluster_id}_${ascore_prefix}$suffix";
                    break;
                }
            }
        }
    }
    if ($fpath)
        break;
}


if (!$fpath) {
    die("Invalid input [4]");
}

$filesize = filesize($fpath);


functions::send_headers($fname, $filesize);
functions::send_file($fpath);
exit();







function filter_type($type) {
    $RES = "";
    if (startsWith($type, "cr")) {
        $RES = strtoupper(substr($type, 4, 1)) . "_";
        $type = substr($type, 0, 4);
    }
    $types = array(
        "net" => array("ssn_lg.png"),
        "hmm" => array("hmm.hmm", "hmm.zip"),
        "hmmpng" => array("hmm.png", "hmm.zip"),
        "hist" => array("length_histogram_lg.png", "length_histogram_uniprot.zip", "length_histogram_uniprot_lg.png"),
        "hist_filt" => array("length_histogram_filtered_lg.png"),
        "hist_up" => array("length_histogram_uniprot.zip"),
        "hist_ur50" => array("length_histogram_uniref50_lg.png", "length_histogram_uniref50.zip"),
        "msa" => array("msa.afa", "msa.zip"),
        "uniprot_id" => array("uniprot.txt", "uniprot_ids.zip"),
        "uniref50_id" => array("uniref50.txt", "uniref50_ids.zip"),
        "uniref90_id" => array("uniref90.txt", "uniref90_ids.zip"),
        "uniprot_fasta" => array("uniprot.fasta", "uniprot_fasta.zip"),
        "uniref50_fasta" => array("uniref50.fasta", "uniref50_fasta.zip"),
        "uniref90_fasta" => array("uniref90.fasta", "uniref90_fasta.zip"),
        "weblogo" => array("weblogo.png", "weblogo.zip"),
        "crpo" => array("consensus_residue_${RES}position.txt"),
        "crpe" => array("consensus_residue_${RES}percentage.txt"),
        "crid" => array("consensus_residue_${RES}all.zip"),
        "swissprot" => array("swissprot.txt"),
        "ssn" => array("ssn.zip", "ssn.xgmml"));
    if (isset($types[$type]))
        return $types[$type];
    else
        return false;
}

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}
