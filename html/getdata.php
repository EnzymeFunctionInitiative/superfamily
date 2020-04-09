<?php

require_once(__DIR__ . "/includes/main.inc.php");

$db = functions::get_database();

// Available actions:
//   cluster    get cluster data
//   kegg       get kegg ids
//
$action = filter_input(INPUT_GET, "a", FILTER_SANITIZE_STRING);
$cluster_id = filter_input(INPUT_GET, "cid", FILTER_SANITIZE_STRING);

if (!superfamily::validate_action($action) || ($cluster_id && !superfamily::validate_cluster_id($db, $cluster_id))) {
    echo json_encode(array("valid" => false, "message" => "Invalid request."));
    exit(0);
}



$data = array("valid" => true, "message" => "");

if ($action == "kegg") {
    $kegg = superfamily::get_kegg($db, $cluster_id);
    if ($kegg === false) {
        $data["valid"] = false;
        $data["message"] = "KEGG error.";
    } else {
        $data["kegg"] = $kegg;
    }
} else if ($action == "cluster") {
    $cluster = superfamily::get_cluster($db, $cluster_id);
    if ($cluster === false) {
        $data["valid"] = false;
        $data["message"] = "Cluster error.";
    } else {
        $data["cluster"] = $cluster;
        $data["network_map"] = superfamily::get_all_network_names($db);
        $data["sfld_map"] = superfamily::get_sfld_map($db);
        $data["sfld_desc"] = superfamily::get_sfld_desc($db);
        $data["enzymecodes"] = superfamily::get_enzyme_codes($db);
    }
} else if ($action == "tax") {
    //TODO:
} else if ($action == "netinfo") {
    $data["network_map"] = superfamily::get_all_network_names($db);
} 


echo json_encode($data);







