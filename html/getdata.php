<?php
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/settings.class.inc.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/tax_data.class.inc.php");


//$version = filter_input(INPUT_GET, "v", FILTER_SANITIZE_NUMBER_INT);
$version = functions::validate_version();
$qversion = (isset($_GET["qv"]) && is_numeric($_GET["qv"])) ? $_GET["qv"] : 0;

$db = functions::get_database($version);

// Available actions:
//   cluster    get cluster data
//   kegg       get kegg ids
//
$action = filter_input(INPUT_GET, "a", FILTER_SANITIZE_STRING);
$cluster_id = filter_input(INPUT_GET, "cid", FILTER_SANITIZE_STRING);
$ascore = filter_input(INPUT_GET, "as", FILTER_SANITIZE_NUMBER_INT);

if (!validate_action($action) || ($cluster_id && !functions::validate_cluster_id($db, $cluster_id))) {
    echo json_encode(array("valid" => false, "message" => "Invalid request #0 $cluster_id."));
    exit(0);
}

$data = array("valid" => true, "message" => "");

if ($action == "kegg") {
    $kegg = get_kegg($db, $cluster_id, $ascore, $qversion);
    if ($kegg === false) {
        $data["valid"] = false;
        $data["message"] = "KEGG error.";
    } else {
        $data["kegg"] = $kegg;
    }
} else if ($action == "cluster") {
    $timings = array();
    $all_start = microtime(true);
    $cluster = get_cluster($db, $cluster_id, $ascore, $version, $qversion, $timings);
    if ($cluster === false) {
        $data["valid"] = false;
        $data["message"] = "Cluster error.";
    } else {
        $data["cluster"] = $cluster;
        if (count($cluster["regions"]) || count($cluster["children"]) || count($cluster["dicing"]["children"])) {
            $data["network_map"] = get_all_network_names($db);
            $data["sfld_desc"] = get_sfld_desc($db);
            $data["enzymecodes"] = get_enzyme_codes($db);
        } else {
            $data["network_map"] = get_breadcrumb_network_names($db, $cluster_id);
            $data["sfld_map"] = array();
            $data["sfld_desc"] = array();
            $data["enzymecodes"] = array();
        }

        $data["gnd_key"] = functions::get_gnd_key($version);
    }
    $total_time = microtime(true) - $all_start;
    $timings["total"] = $total_time;
    $data["timing"] = $timings;
} else if ($action == "tax") {
    $tax = tax_data::get_tax_data($db, $cluster_id, $ascore, $qversion);
    if ($tax  === false) {
        $data["valid"] = false;
        $data["message"] = "Retrieval error.";
    } else {
        $data = $tax;
        //$data["tax"] = $tax;
    }
} else if ($action == "netinfo") {
    $data["network_map"] = get_all_network_names($db);
} else if ($action == "dnav") {
    $dnav = array();
    $forward = true;
    $dnav["backward"] = get_diced_nav($db, $cluster_id, $ascore, !$forward);
    $dnav["forward"] = get_diced_nav($db, $cluster_id, $ascore, $forward);
    $data["dnav"] = $dnav;
}


echo json_encode($data);










function get_diced_nav($db, $cluster_id, $ascore, $forward, $qversion, $parent_id = "") {
//    if (!$parent_id)
//        $parent_cluster = functions::get_dicing_parent($db, $cluster_id, $ascore);
//    else
//        $parent_cluster = $parent_id;
    $order = "";
    $dir = ">";
    if (!$forward) {
        $order = "DESC";
        $dir = "<";
    }
    $next_sql = "SELECT ascore FROM diced_network WHERE cluster_id = '$cluster_id' AND CAST(ascore AS INTEGER) $dir :as ORDER BY CAST(ascore AS INTEGER) $order LIMIT 1";
    $sth = $db->prepare($next_sql);
    $sth->bindValue("as", $ascore);
    $sth->execute();
    $row = $sth->fetch();
    if (!$row)
        return array();
    $next_ascore = $row["ascore"];

    $data = array();

    $sql = "SELECT DISTINCT(T2.cluster_id) AS cid, T2.ascore AS ascore FROM diced_id_mapping AS T1 LEFT JOIN diced_id_mapping AS T2 ON T1.uniprot_id = T2.uniprot_id WHERE T1.cluster_id = :id AND T1.ascore = :as AND T2.ascore = $next_ascore ORDER BY T2.ascore, T2.cluster_id";
    $sth = $db->prepare($sql);
    $sth->bindValue("id", $cluster_id);
    $sth->bindValue("as", $ascore);
    $sth->execute();

    while ($row = $sth->fetch()) {
        array_push($data, array("cluster_id" => $row["cid"], "ascore" => $next_ascore));
    }

    for ($i = 0; $i < count($data); $i++) {
        $xcid = $data[$i]["cluster_id"];
        $xascore = $data[$i]["ascore"];
        $sql = "SELECT uniref90 FROM diced_size WHERE cluster_id = '$xcid' AND ascore = $xascore";
        $sth = $db->prepare($sql);
        $sth->execute();
        $row = $sth->fetch();
        if ($row) {
            $data[$i]["num_nodes"] = $row["uniref90"];
            $sp = get_swissprot($db, $xcid, $xascore, $qversion);
            $data[$i]["sp"] = $sp;
            $anno = get_annotations($db, $xcid, $xascore, $qversion);
            $data[$i]["anno"] = $anno;
        }

        $sql = "SELECT conv_ratio FROM diced_conv_ratio WHERE cluster_id = '$xcid' AND ascore = $xascore";
        $sth = $db->prepare($sql);
        $sth->execute();
        $row = $sth->fetch();
        if ($row)
            $data[$i]["cr"] = $row["conv_ratio"];
    }

    $sort_fn = function($a, $b) {
        if ($a["num_nodes"] > $b["num_nodes"]) return -1;
        if ($a["num_nodes"] < $b["num_nodes"]) return 1;
        return 0;
    };

    usort($data, $sort_fn);

    return $data;
}


function get_cluster($db, $cluster_id, $ascore, $version, $qversion, &$timings) {
    $data = array(
        "size" => array(
            "uniprot" => 0,
            "uniref90" => 0,
            "uniref50" => 0,
        ),
        "alignment_score" => "",
        "default_alignment_score" => "",
        "name" => "",
        "desc" => "",
        "image" => "",
        "title" => "",
        "display" => array(),
        "download" => array(),
        "regions" => array(),
        "public" => array(
            "has_kegg" => false,
            "swissprot" => array(),
            "anno" => array(),
            "pdb" => array(),
        ),
        "anno" => array(),
        "pubs" => array(),
        "families" => array(
            "tigr" => array(),
        ),
        "dicing" => array(
            "parent" => "",
            "default_subcluster" => "",
            "parent_image" => "",
            "children" => array(),
            "dnav" => array(
                "backward" => array(),
                "forward" => array(),
            ),
        ),
        "alt_ssn" => array(),
        "cons_res" => array(),
        "dir" => "",
    );

    $parent_cluster_id = functions::get_dicing_parent($db, $cluster_id, $ascore);

$start = microtime(true);
    $data["alt_ssn"] = get_alt_ssns($db, $cluster_id);
$timings["get_alt_ssns"] = microtime(true) - $start;

    $parent_ascore = "";
    $parent_ascore_cluster_id = "";
    $parent_ascore_row = get_parent_ascore($db, $parent_cluster_id ? $parent_cluster_id : $cluster_id);
    if (count($parent_ascore_row)) {
        if ($parent_ascore_row[0][0] && $parent_ascore_row[0][1]) {
            $parent_ascore = $parent_ascore_row[0][0];
            $parent_ascore_cluster_id = $parent_ascore_row[0][1];
        }
    }

    $data["dicing"]["parent"] = $parent_cluster_id;
    if ($parent_cluster_id && $parent_ascore_cluster_id) {
        $data["dicing"]["default_subcluster"] = $parent_ascore_cluster_id;
    }

    $data["dicing"]["children"] = array();
    if ($ascore) {
        $data["dicing"]["children"] = get_dicing_children($db, $cluster_id, $ascore);
    }
    if ($parent_cluster_id || count($data["dicing"]["children"])) {
        if ($parent_cluster_id) {
            $ascores = get_alt_ssns($db, $parent_cluster_id);
            $data["dicing"]["parent_ascores"] = $ascores;
            $data["dicing"]["siblings"] = get_siblings($db, $cluster_id, $ascore);

            $dnav = array();
            $forward = true;
            $dnav["forward"] = get_diced_nav($db, $cluster_id, $ascore, $forward, $qversion, $parent_cluster_id);
            $dnav["backward"] = get_diced_nav($db, $cluster_id, $ascore, !$forward, $qversion, $parent_cluster_id);
            $data["dicing"]["dnav"] = $dnav;
        } else {
            $ascores = get_alt_ssns($db, $cluster_id);
            //TODO: redirect to requested ascore
            //$redir_ascore = $ascores[0][0];
            $redir_ascore = $ascore;
            if (isset($ascores[0][0])) {
                $data["REDIRECT"]["as"] = $redir_ascore;
                $data["REDIRECT"]["cluster_id"] = $cluster_id . "-" . $data["dicing"]["children"][0];
            }
        }
    }
    $child_cluster_id = "";
    $is_child = $parent_cluster_id ? true : false;
    if ($is_child) {
        $child_cluster_id = $cluster_id;
    } else {
        $parent_cluster_id = $cluster_id;
    }

    $info = get_network_info($db, $cluster_id, $is_child, $parent_cluster_id);
    $data["name"] = $info["name"];
    $data["title"] = $info["title"];
    $data["desc"] = $info["desc"];
    $data["sfld_desc"] = $info["sfld_desc"];

    $orig_ascore = $ascore;
    if (!$is_child && $parent_ascore && $parent_ascore_cluster_id && !$ascore)
        $ascore = $parent_ascore;

    $rel_dir = functions::get_rel_data_dir_path($parent_cluster_id, $version, $orig_ascore, $child_cluster_id);
    $data["dir"] = $rel_dir;

    $child_dir_id = $is_child ? $child_cluster_id : "";
    $full_dir = functions::get_data_dir_path($parent_cluster_id, $version, $ascore, $child_dir_id);
    if (file_exists("$full_dir/${cluster_id}_merge_lg.png"))
        $data["image"] = $cluster_id . "_merge";
    else if (file_exists("$full_dir/${cluster_id}_lg.png"))
        $data["image"] = $cluster_id;
    else
        $data["image"] = "ssn";
    if ($parent_cluster_id && $parent_ascore_cluster_id) {
        $parent_full_dir = functions::get_data_dir_path($parent_cluster_id, $version, $parent_ascore, $child_dir_id);
        $full_image_path = "$parent_full_dir/${child_dir_id}_lg.png";
        if (file_exists("$parent_full_dir/${child_dir_id}_lg.png"))
            $image = "$child_dir_id";
        else
            $image = "ssn";
        $data["image"] = $image;
        $data["dicing"]["parent_image"] = $image;
        #if (!$is_child) {
        #    $data["image"] = "$parent_ascore_cluster_id/ssn";
        #    //$data["image"] = "dicing-$parent_ascore/$parent_ascore_cluster_id/ssn";
        #} else {
        #    $data["image"] = "dicing-$parent_ascore/$parent_ascore_cluster_id/ssn";
        #}
    }

$start = microtime(true);
    $data["public"]["has_kegg"] = get_kegg($db, $cluster_id, $ascore, true, $qversion);
$timings["get_kegg"] = microtime(true) - $start;

    $data["size"] = get_sizes($db, $cluster_id, $ascore, $is_child);

    $data["conv_ratio"] = get_conv_ratio($db, $cluster_id, $ascore, $is_child);

$start = microtime(true);
    $data["public"]["swissprot"] = get_swissprot($db, $cluster_id, $ascore, $qversion);
$timings["get_swissprot"] = microtime(true) - $start;

$start = microtime(true);
    $data["public"]["pdb"] = get_pdb($db, $cluster_id, $ascore, $qversion);
$timings["get_pdb"] = microtime(true) - $start;

$start = microtime(true);
    $data["families"]["tigr"] = get_tigr($db, $cluster_id, $ascore, $qversion);
$timings["get_tigr"] = microtime(true) - $start;

    $data["public"]["anno"] = get_annotations($db, $cluster_id, $ascore, $qversion);

    $data["display"] = get_display($db, $parent_cluster_id, $version, $ascore, $child_cluster_id);

    $data["download"] = get_download($db, $parent_cluster_id, $version, $ascore, $child_cluster_id);

    $data["regions"] = get_regions($db, $cluster_id);

    $data["children"] = get_children($db, $cluster_id);

    $data["cons_res_files"] = get_consensus_residues_files($db, $parent_cluster_id, $version, $ascore, $child_cluster_id);

    $data["cons_res"] = get_consensus_residues($db, $cluster_id, $ascore, $is_child);

    if ($orig_ascore)
        $data["alignment_score"] = $orig_ascore;
//    $data["dir"] = settings::get_data_dir($version) . "/$cluster_id";
//    if ($ascore) {
        $full_dir = functions::get_data_dir_path($cluster_id, $version, $ascore);
//        $data["alignment_score"] = $ascore;
//        $ascore_dir = $data["dir"] . "/dicing-$ascore";
//        $full_dir = dirname(__FILE__) . "/$ascore_dir"; 
//        if (file_exists($full_dir))
//            $data["dir"] = $ascore_dir;
//    }

    return $data;
}






function get_network_info_sfld_sql($extra_cols = "", $extra_join = "") {
    if ($extra_cols)
        $extra_cols = ", $extra_cols";
    //$sql = "SELECT network.cluster_id AS cluster_id, network.title AS title, network.name AS name, network.desc AS desc, sfld_map.sfld_id AS sfld_id, sfld_desc.sfld_desc AS sfld_desc "
    $sql = "SELECT network.cluster_id AS cluster_id, network.title AS title, network.name AS name, network.desc AS desc"
        . $extra_cols 
        . " FROM network"
//        . " LEFT JOIN sfld_map ON network.cluster_id = sfld_map.cluster_id"
//        . " LEFT JOIN sfld_desc ON sfld_map.sfld_id = sfld_desc.sfld_id"
        . " " . $extra_join
        ;
    return $sql;
}
function get_network_info_title($row, $sfld_only = false, $child_cluster_id = "") {
    $title = !$sfld_only ? $row["name"] : "";
    if ($child_cluster_id)
        $title .= ' / Mega' . $child_cluster_id;
    if ($row["title"] && isset($row["sfld_id"])) {
        $sfld_id_repl = "";
        if ($sfld_only) {
            $sfld_id_repl = " [" . $row["sfld_id"] . "]";
            $title .= $row["title"]; 
        } else {
            $sfld_id_repl = " / ";
            $title .= ": SFLD Subgroup " . $row["sfld_id"];
            $title .= " / " . $row["title"];
        }
        if (preg_match("/<SFLD>/", $title)) {
            $title = preg_replace("/<SFLD>/", $row["sfld_desc"] . $sfld_id_repl, $title);
        }
    } elseif (isset($row["sfld_id"])) {
        if (!$sfld_only)
            $title .= ": SFLD Subgroup " . $row["sfld_id"] . " / ";
        $title .= $row["sfld_desc"];
    } elseif ($row["title"]) {
        $title .= (!$sfld_only ? ": " : "") . $row["title"];
    }
    return $title;
}
function get_network_info($db, $cluster_id, $is_child, $parent_cluster_id) {
    $sql = get_network_info_sfld_sql() . " WHERE network.cluster_id = :id";
    $sth = $db->prepare($sql);
    if ($is_child)
        $sth->bindValue("id", $parent_cluster_id);
    else
        $sth->bindValue("id", $cluster_id);
    $sth->execute();
    $row = $sth->fetch();
    if ($row) {
        $child_cluster_id = $is_child ? $cluster_id : "";
        $title = get_network_info_title($row, false, $child_cluster_id);
        return array("cluster_id" => $row["cluster_id"], "name" => $row["name"], "title" => $title, "desc" => $row["desc"], "sfld_id" => $row["sfld_id"], "sfld_desc" => $row["title"]);
    } else {
        return array("cluster_id" => $cluster_id, "name" => "", "title" => "", "desc" => "", "sfld_id" => "", "sfld_desc" => "");
    }
}
function get_all_network_names($db) {
    $sql = get_network_info_sfld_sql("uniprot, uniref50, uniref90", "LEFT JOIN size ON network.cluster_id = size.cluster_id");
    //$sql = "SELECT network.cluster_id, name, uniprot, uniref50, uniref90 FROM network LEFT JOIN size on network.cluster_id = size.cluster_id";
    $sth = $db->prepare($sql);
    $sth->execute();
    $data = array();
    $sfld_only = true;
    while ($row = $sth->fetch()) {
        $sfld_title = get_network_info_title($row, $sfld_only);
        $data[$row["cluster_id"]] = array("name" => $row["name"], "sfld_title" => $sfld_title, "size" => array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]));
    }
    return $data;
}
function get_breadcrumb_network_names($db, $cluster_id) {
    $data = array();
    $sfld_only = true;
    $prim_sql = get_network_info_sfld_sql("uniprot, uniref50, uniref90", "LEFT JOIN size ON network.cluster_id = size.cluster_id");
    $parts = explode("-", $cluster_id);
    for ($i = count($parts)-2; $i > 0; $i--) {
        $cid = implode("-", array_slice($parts, 0, $i+1));
        $sql = "$prim_sql WHERE network.cluster_id = '$cid'";
        $sth = $db->prepare($sql);
        $sth->execute();
        $row = $sth->fetch();
        $sfld_title = get_network_info_title($row, $sfld_only);
        $data[$row["cluster_id"]] = array("name" => $row["name"], "sfld_title" => $sfld_title, "size" => array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]));
    }
    return $data;
}

function get_sfld_desc($db) {
    $sql = "SELECT * FROM sfld_desc";
    $sth = $db->prepare($sql);
    $sth->execute();
    $data = array();
    while ($row = $sth->fetch()) {
        $data[$row["sfld_id"]] = array("desc" => $row["sfld_desc"], "color" => $row["sfld_color"]);
    }
    return $data;
}

function get_display($db, $cluster_id, $version = "", $ascore = "", $child_id = "") {
    $cpath = functions::get_data_dir_path($cluster_id, $version, $ascore, $child_id);
    //$cpath = "$basepath/$cluster_id";

    $feat = array();
    $hist = array();
    if (file_exists("$cpath/weblogo.png"))
        $feat["weblogo"] = 1;

    $has_proper = false;
    if (file_exists("$cpath/length_histogram_uniprot_lg.png")) {
        array_push($hist, "uniprot");
        $has_proper = true;
    }
    if (file_exists("$cpath/length_histogram_lg.png") && !$has_proper)
        array_push($hist, "uniprot_leg");

    if (file_exists("$cpath/length_histogram_uniref90_lg.png"))
        array_push($hist, "uniref90");
    if (file_exists("$cpath/length_histogram_uniref50_lg.png"))
        array_push($hist, "uniref50");
    $feat["length_histogram"] = $hist;

    //TODO: does it actually exist?
    $feat["gnd"] = 1;

    $feat["tax"] = 1;

    return $feat;
}

function get_consensus_residues_files($db, $cluster_id, $version = "", $ascore = "", $child_id = "") {
    $cpath = functions::get_data_dir_path($cluster_id, $version, $ascore, $child_id);
    $files = glob("$cpath/consensus_residue_*_position.txt");
    $res = array();
    foreach ($files as $file) {
        preg_match("/^.*consensus_residue_([A-Z])_.*$/", $file, $matches);
        if (isset($matches[1]))
            array_push($res, $matches[1]);
    }
    return $res;
}
function get_consensus_residues($db, $cluster_id, $ascore = "", $is_child = false) {
    $table = $is_child ? "diced_cons_res" : "cons_res";
    $sql = "SELECT * FROM $table WHERE cluster_id = :id";
    if ($ascore && $is_child)
        $sql .= " AND ascore = '$ascore'";
    $row_fn = function($row) {
        return array("num_res" => $row["num_res"], "percent" => $row["percent"]);
    };
    $result = get_generic_fetch($db, $cluster_id, $sql, $row_fn);
    return $result;
    //return (count($result) > 0 ? $result[0] : 0);
}

function get_download($db, $cluster_id, $version = "", $ascore = "", $child_id = "") {
    $cpath = functions::get_data_dir_path($cluster_id, $version, $ascore, $child_id);
    if ($ascore && $child_id)
        $parent_path = functions::get_data_dir_path2($db, $version, $ascore, $cluster_id);
    //$cpath = "$basepath/$cluster_id";

    $feat = array();
    $id_fasta = array();

    $show_child_feat = $ascore && !$child_id;

    $ssn = functions::get_ssn_path($db, $cluster_id);
    if ($ssn)
        $feat["ssn"] = 1;
    if (file_exists("$cpath/weblogo.png") || $show_child_feat)
        $feat["weblogo"] = 1;
    if (file_exists("$cpath/msa.afa") || $show_child_feat)
        $feat["msa"] = 1;
    if (file_exists("$cpath/hmm.hmm") || $show_child_feat)
        $feat["hmm"] = 1;
//    if (file_exists("$cpath/gnd.sqlite"))
//        array_push($feat, "gnd");
    if (file_exists("$cpath/ssn.zip") || file_exists("$cpath/ssn.xgmml") || $show_child_feat)
        $feat["ssn"] = 1;
    else if ($parent_path && (file_exists("$parent_path/ssn.zip") || $show_child_feat))
        $feat["ssn"] = 1;
    if (file_exists("$cpath/uniprot.txt") || $show_child_feat)
        $id_fasta["uniprot"] = 1;
    if (file_exists("$cpath/uniref50.txt") || $show_child_feat)
        $id_fasta["uniref50"] = 1;
    if (file_exists("$cpath/uniref90.txt") || $show_child_feat)
        $id_fasta["uniref90"] = 1;
    if (file_exists("$cpath/swissprot.txt") || $show_child_feat)
        $feat["misc"] = 1;
    $cons_res_files = glob("$cpath/consensus_residue_*_position.txt");
    if (count($cons_res_files) > 0 || $show_child_feat)
        $feat["cons_res"] = 1;

    $feat["id_fasta"] = $id_fasta;

    return $feat;
    //return array("ssn", "weblogo", "msa", "hmm", "id_fasta", "misc");
}

function get_generic_fetch($db, $cluster_id, $sql, $handle_row_fn, $check_only = false) {
    return functions::get_generic_fetch($db, $cluster_id, $sql, $handle_row_fn, $check_only);
    //$sth = $db->prepare($sql);
    //if (!$sth)
    //    return $check_only ? 0 : array();
    //$sth->bindValue("id", $cluster_id);
    //$sth->execute();
    //$data = array();
    //while ($row = $sth->fetch()) {
    //    if ($check_only)
    //        return $handle_row_fn($row);
    //    array_push($data, $handle_row_fn($row));
    //}
    //return $check_only ? 0 : $data;
}

function get_generic_join_sql($qversion, $table, $parm, $extra_where = "", $ascore = "", $check_only = false, $extra_join = "") {
    return functions::get_generic_join_sql($qversion, $table, $parm, $extra_where, $ascore, $check_only, $extra_join);
}

function get_kegg($db, $cluster_id, $ascore = "", $check_only = false, $qversion = 0) {
    $sql = get_generic_join_sql($qversion, "kegg", "kegg", "", $ascore, $check_only);
    $row_fn = function($row) { return $row["kegg"]; };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn, $check_only);
}

function get_swissprot($db, $cluster_id, $ascore = "", $check_only = false, $qversion = 0) {
    $sql = get_generic_join_sql($qversion, "swissprot", "function, GROUP_CONCAT(swissprot.uniprot_id) AS ids", "AND function IS NOT NULL AND function != \"\" GROUP BY function ORDER BY function", $ascore, $check_only);
    $row_fn = function($row) { return ($row["function"] && $row["ids"]) ? array($row["function"], $row["ids"]) : false; };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}

function get_annotations($db, $cluster_id, $ascore = "", $check_only = false, $qversion = 0) {
    $sql = get_generic_join_sql($qversion, "annotations", "annotations.uniprot_id, doi", "AND doi IS NOT NULL AND doi != \"\"", $ascore, $check_only);
    $row_fn = function($row) {
        if (!$row["doi"] || !$row["uniprot_id"])
            return false;
        $parts = explode("`", $row["doi"]);
        return array($row["uniprot_id"], $parts);
    };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}

function get_pdb($db, $cluster_id, $ascore = "", $check_only = false, $qversion = 0) {
    $sql = get_generic_join_sql($qversion, "pdb", "pdb, pdb.uniprot_id", "AND pdb IS NOT NULL AND pdb != \"\"", $ascore, $check_only);
    $row_fn = function($row) { return array($row["pdb"], $row["uniprot_id"]); };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}

function get_tigr($db, $cluster_id, $ascore = "", $check_only = false, $qversion = 0) {
    $sql = get_generic_join_sql($qversion, "tigr", "tigr, GROUP_CONCAT(tigr.uniprot_id) AS ids", "AND tigr IS NOT NULL AND tigr != \"\" GROUP BY tigr ORDER BY tigr", $ascore, $check_only);
    $row_fn = function($row) { return array($row["tigr"], ""); };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}

function get_enzyme_codes($db) {
    $sql = "SELECT * FROM enzymecode";
    $sth = $db->prepare($sql);
    $sth->execute();
    $data = array();
    while ($row = $sth->fetch()) {
        $data[$row["code_id"]] = $row["desc"];
    }
    return $data;
}

function get_children($db, $cluster_id) {
    //$sql = functions::get_generic_sql("network", "*", "ORDER BY cluster_id");
    $sql = "SELECT cluster_id, name FROM network WHERE parent_id = :id ORDER BY cluster_id";
    //cluster_id TEXT, region_id TEXT, region_index INT, name TEXT, number TEXT, coords TEXT
    $row_fn = function($row) {
        $data = array();
        $data["id"] = $row["cluster_id"];
        $data["name"] = $row["name"];
        return $data;
    };
    $rows = get_generic_fetch($db, $cluster_id, $sql, $row_fn);
    $sortFn = function($a, $b) {
        $aa = explode("-", $a["id"]);
        $bb = explode("-", $b["id"]);
        for ($i = 0; $i < count($aa); $i++) {
            if (is_numeric($aa[$i])) {
                if ($aa[$i] < $bb[$i])
                    return -1;
                else if ($aa[$i] > $bb[$i])
                    return 1;
            }
        }
        return 0;
    };
    usort($rows, $sortFn);
    return $rows;
}

function get_regions($db, $cluster_id) {
    $sql = functions::get_generic_sql("region", "*", "ORDER BY region_index");
    //cluster_id TEXT, region_id TEXT, region_index INT, name TEXT, number TEXT, coords TEXT
    $row_fn = function($row) {
        $data = array();
        $data["id"] = $row["region_id"];
        $data["name"] = $row["name"];
        $data["number"] = $row["number"];
        $data["coords"] = array_map(function($c) { return floatval($c); }, explode(",", $row["coords"]));
        return $data;
    };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}


function get_dicing_children($db, $cluster_id, $ascore = "") {
    $sql = "SELECT diced_network.cluster_id AS cluster_id FROM diced_network WHERE diced_network.parent_id = :id";
    $sth = $db->prepare($sql);
    if (!$sth)
        return array();
    $row_fn = function($row) {
        $parts = explode("-", $row["cluster_id"]);
        return $parts[count($parts)-1];
    };

    $sth->bindValue("id", $cluster_id);
    $sth->execute();
    $data = array();
    while ($row = $sth->fetch()) {
        array_push($data, $row_fn($row));
    }

    return $data;
}


//function get_dicing_children($db, $cluster_id, $ascore = "") {
//    $sql = "SELECT diced_network.cluster_id AS cluster_id, diced_size.uniprot AS uniprot, diced_size.uniref90 AS uniref90, diced_size.uniref50 AS uniref50 FROM diced_network LEFT JOIN diced_size ON diced_network.cluster_id = diced_size.cluster_id WHERE parent_id = :id";
//    if ($ascore)
//        $sql .= " AND diced_network.ascore = :ascore";
//    $sth = $db->prepare($sql);
//    if (!$sth)
//        return array();
//    
//    $row_fn = function($row) {
//        return array("id" => $row["cluster_id"],
//            "size" => array("uniprot" => $row["uniprot"], "uniref50" => $row["uniref50"], "uniref90" => $row["uniref90"]));
//    };
//
//    $sth->bindValue("id", $cluster_id);
//    if ($ascore)
//        $sth->bindValue("ascore", $ascore);
//    $sth->execute();
//    $data = array();
//    while ($row = $sth->fetch()) {
//        array_push($data, $row_fn($row));
//    }
//
//    return $data;
//}


function get_siblings($db, $cluster_id, $ascore) {
    $parts = explode("-", $cluster_id);
    $num = $parts[count($parts)-1];
    $sibs["prev"] = $num > 1 ? $num - 1 : 0;
    $sibs["next"] = $num + 1;
    
    $parent_id = implode("-", array_slice($parts, 0, count($parts)-1));
    $sql = "SELECT DISTINCT cluster_id FROM diced_network WHERE parent_id = :id AND ascore = '$ascore'";
    $row_fn = function($row) {
        return $row["cluster_id"];
    };
    $ids = get_generic_fetch($db, $parent_id, $sql, $row_fn);
    $sib_ids = array();
    for ($i = 0; $i < count($ids); $i++) {
        $parts = explode("-", $ids[$i]);
        $id = $parts[count($parts)-1];
        array_push($sib_ids, $id);
    }
    $sibs["ids"] = $sib_ids;
    return $sibs;
}
function get_alt_ssns($db, $cluster_id) {
    $sql = "SELECT DISTINCT ascore FROM diced_network WHERE parent_id = :id AND ascore != '' ORDER BY ascore";
    $row_fn = function($row) {
        return array($row["ascore"]);
    };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}
function get_parent_ascore($db, $cluster_id) {
    //$sql = "SELECT DISTINCT ascore FROM diced_network WHERE parent_id = :id AND ascore != '' ORDER BY ascore";
    $sql = "SELECT DISTINCT parent_ascore, cluster_id FROM diced_network WHERE parent_id = :id AND ascore != '' ORDER BY ascore ASC LIMIT 1";
    $row_fn = function($row) {
        return array($row["parent_ascore"], $row["cluster_id"]);
    };
    return get_generic_fetch($db, $cluster_id, $sql, $row_fn);
}

function get_sizes($db, $id, $ascore = "", $is_child = false) {
    $table = $is_child ? "diced_size" : "size";
    $sql = "SELECT * FROM $table WHERE cluster_id = :id";
    if ($ascore && $is_child)
        $sql .= " AND ascore = '$ascore'";
    $row_fn = function($row) {
        return array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]);
    };
    $result = get_generic_fetch($db, $id, $sql, $row_fn);
    return (count($result) > 0 ? $result[0] : array());
    /*
    $sql = "SELECT * FROM size WHERE cluster_id = :id";
    $sth = $db->prepare($sql);
    $sth->bindValue("id", $id);
    $sth->execute();
    $row = $sth->fetch();
    if (!$row)
        return array();
    else
        return array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]);
     */
}

function get_conv_ratio($db, $id, $ascore = "", $is_child = false) {
    $table = $is_child ? "diced_conv_ratio" : "conv_ratio";
    $sql = "SELECT * FROM $table WHERE cluster_id = :id";
    if ($ascore && $is_child)
        $sql .= " AND ascore = '$ascore'";
    $row_fn = function($row) {
        return array("conv_ratio" => $row["conv_ratio"], "ssn_conv_ratio" => $row["node_conv_ratio"]);
    };
    $result = get_generic_fetch($db, $id, $sql, $row_fn);
    return (count($result) > 0 ? $result[0] : 0);
}

function validate_action($action) {
    return ($action == "cluster" || $action == "kegg" || $action == "netinfo" || $action == "tax" || $action == "dnav");
}


