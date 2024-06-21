<?php
require_once(__DIR__ . "/../init.php");
require_once(__DIR__ . "/../libs/settings.class.inc.php");
require_once(__DIR__ . "/../libs/functions.class.inc.php");
require_once(__DIR__ . "/../libs/search.class.inc.php");


// Design output structure to handle errors, etc

$type = filter_input(INPUT_GET, "t", FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_STRING);
$num_hmm_results = 0;
if ($type == "tax-auto" || $type == "tax-prefetch") {
    $query = filter_input(INPUT_GET, "query", FILTER_SANITIZE_STRING);
} else {
    $type = filter_input(INPUT_POST, "t", FILTER_SANITIZE_STRING);
    $id = filter_input(INPUT_POST, "id", FILTER_SANITIZE_STRING);
    if (!$type) {
        print json_encode(array("status" => false, "message" => "Invalid request"));
        exit(0);
    }
    $query = filter_input(INPUT_POST, "query", FILTER_SANITIZE_STRING);
    $num_hmm_results = filter_input(INPUT_POST, "num_hmm_res", FILTER_SANITIZE_NUMBER_INT);
}
if (!$query && !$id && $type != "tax-prefetch") {
    print json_encode(array("status" => false, "message" => "Invalid input"));
    exit(0);
}
$version = functions::validate_version(isset($_POST["v"]) ? $_POST["v"] : "");


if (($type == "seq" || $type == "id" || $type == "tax") && ($id && preg_match("/^[A-Za-z0-9]+$/", $id))) {
    $out_dir = settings::get_tmpdir_path() . "/" . $id;
    $cache_file = functions::get_cache_file($out_dir);
    $json = file_get_contents($cache_file);
    print $json;
    exit(0);
}


$search_util = new search($query, $version, $num_hmm_results);


if ($type == "seq") {
    $job_id = make_id();
    $out_dir = make_out_dir($job_id);

    //$search_util->add_hmmsearch_job($job_id, $out_dir);
    $data = $search_util->hmm_search($id, $out_dir);

    if (is_array($data)) {
        $data["status"] = true;
        $data["id"] = $job_id;
    } else {
        $data["status"] = false;
        $data["message"] = "Sequenence search failed due to internal error";
    }

    $json = json_encode($data);
    $cache_file = functions::get_cache_file($out_dir);
    file_put_contents($cache_file, $json);

    print $json;

} else if ($type == "id") {
    $job_id = make_id();
    $out_dir = make_out_dir($job_id);

    $data = $search_util->id_search();

    if (is_array($data)) {
        $data["status"] = true;
        $data["id"] = $job_id;
    } else {
        $data = array("status" => false, "id" => $job_id);
        $data["status"] = false;
        $data["message"] = "Invalid ID";
    }

    $json = json_encode($data);
    $cache_file = functions::get_cache_file($out_dir);
    file_put_contents($cache_file, $json);
    
    print $json;

} else if ($type == "tax") {
    $job_id = make_id();
    $out_dir = make_out_dir($job_id);
    
    $tax_type = filter_input(INPUT_POST, "type", FILTER_SANITIZE_STRING);

    $data = $search_util->taxonomy_search($tax_type);
    
    if (is_array($data)) {
        $data["status"] = true;
        $data["id"] = $job_id;
    } else {
        $data = array("status" => false, "id" => $job_id);
        $data["status"] = false;
    }

    $json = json_encode($data);
    $cache_file = functions::get_cache_file($out_dir);
    file_put_contents($cache_file, $json);

    print $json;

// Prefetch the first 1000 sequences to help with performance.
} else if ($type == "tax-prefetch") {
    $data = $search_util->taxonomy_species_prefetch();
    print json_encode($data);

// Dynamic search for species (e.g. show options as user is typing)
} else if ($type == "tax-auto") {
    $data = $search_util->taxonomy_species_query();
    print json_encode($data);
}





function make_id() {
    $job_id = functions::get_id();
    return $job_id;
}
function make_out_dir($job_id) {
    $out_dir = functions::get_output_dir($job_id);
    $cache_file = functions::get_cache_file($out_dir);
    mkdir($out_dir);
    return $out_dir;
}
    




