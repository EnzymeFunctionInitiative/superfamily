<?php

require(__DIR__ . "/../libs/settings.class.inc.php");
require(__DIR__ . "/../libs/functions.class.inc.php");

const MAX_RESULTS = 3;

// Design output structure to handle errors, etc

$type = filter_input(INPUT_GET, "t", FILTER_SANITIZE_STRING);
$id = filter_input(INPUT_GET, "id", FILTER_SANITIZE_STRING);
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
}
if (!$query && !$id && $type != "tax-prefetch") {
    print json_encode(array("status" => false, "message" => "Invalid input"));
    exit(0);
}
$version = functions::validate_version(isset($_POST["v"]) ? $_POST["v"] : "");



if ($type == "seq") {
    $oquery = $query;
    $seq = preg_replace("/>.*?[\r\n]+/", "", $query);

    $cache_file = "results.json";
    if ($id && preg_match("/^[A-Za-z0-9]+$/", $id)) {
        $out_dir = settings::get_tmpdir_path() . "/" . $id;
        $cache_file = "$out_dir/$cache_file";
        $json = file_get_contents($cache_file);
    } else {
        $job_id = functions::get_id();
        
        $file = settings::get_cluster_db_path($version);
        $db = new SQLite3($file);
    
        $out_dir = settings::get_tmpdir_path() . "/" . $job_id;
        $cache_file = "$out_dir/$cache_file";
        mkdir($out_dir);
    
        $seq = ">SEQUENCE\n$seq";
        $seq_file = "$out_dir/sequence.txt";
        file_put_contents($seq_file, $seq);

        $hmmdb = functions::get_hmmdb_path($version, "all");
        $matches_raw = hmmscan($out_dir, $hmmdb[0], $seq_file);

        $make_sql = function($cluster, $use_diced = false) {
            $table_prefix = "";
            $name_col = "NET.name AS name";
            $name_join = "";
            if ($use_diced) {
                $table_prefix = "diced_";
                $name_join = "LEFT JOIN network ON network.cluster_id = NET.parent_id";
                $name_col = "network.name AS name";
            }

            $sql = 
                  " SELECT SZ.uniprot AS uniprot, SZ.uniref90 AS uniref90,"
                  . " CR.conv_ratio AS conv_ratio,"
                  . " $name_col"
                  . " FROM ${table_prefix}size AS SZ"
                  . " LEFT JOIN ${table_prefix}conv_ratio AS CR ON SZ.cluster_id = CR.cluster_id"
                  . " LEFT JOIN ${table_prefix}network AS NET ON SZ.cluster_id = NET.cluster_id"
                  . " $name_join"
                  . " WHERE SZ.cluster_id = '$cluster'";
            return $sql;
        };

        $process_cluster = function($matches_raw, $use_diced = false) use ($make_sql, $db) {
            $data = array();
            foreach ($matches_raw as $match) {
                $sql = $make_sql($match[0], $use_diced);
//                print "$sql\n\n\n";
                $results = $db->query($sql);
                $row = $results->fetchArray();
                $the_name = $row["name"];
                if ($use_diced) {
                    $parts = explode("-", $match[0]);
                    $the_name = $the_name . "-" . $parts[count($parts)-1];
                }
                $out_row = array("cluster" => $match[0], "evalue" => $match[1], "num_up" => $row["uniprot"], "num_ur" => $row["uniref90"], "cr" => $row["conv_ratio"], "name" => $the_name);
                array_push($data, $out_row);
            }
            return $data;
        };

        $data = $process_cluster($matches_raw);
        $matches = array(array("ascore" => "", "parent" => "", "clusters" => $data));
    
        $dmatches = array();
        $diced_db = functions::get_hmmdb_path($version, "diced");
//        $ascore_sql = "SELECT DID.cluster_id AS cluster_id, DID.ascore AS ascore,"
//            . " DS.uniprot AS uniprot, DS.uniref90 AS uniref90,"
//            . " CR.conv_ratio AS conv_ratio"
//            . " FROM diced_id_mapping AS DID"
//            . " LEFT JOIN diced_size AS DS ON (DID.cluster_id = DS.cluster_id AND DID.ascore = DS.ascore)"
//            . " LEFT JOIN diced_conv_ratio AS CR ON (DID.cluster_id = CR.cluster_id AND DID.ascore = CR.ascore)"
//            . " WHERE DID.uniprot_id = '$id'";
//
        // Check if matches are the parent diced cluster.  If so, then we search the diced clusters.
        if (count($matches_raw) > 0) {
            $dicings = get_parent($diced_db, $matches_raw[0][0]);
            if ($dicings !== false) {
                $dm = search_diced($out_dir, $dicings, $seq_file);
                if ($dm !== false) {
                    foreach ($dm as $cluster => $cluster_raw) {
                        $cluster_data = array();
                        $sql = "SELECT network.name FROM diced_network LEFT JOIN network ON diced_network.parent_id = network.cluster_id WHERE diced_network.parent_id = '$cluster'";
                        $results = $db->query($sql);
                        $row = $results->fetchArray();
                        $parent = $row["name"];
                        foreach ($cluster_raw as $ascore => $dmatches_raw) {
                            $data = $process_cluster($dmatches_raw, true);
                            array_push($dmatches, array("ascore" => $ascore, "parent" => $parent, "clusters" => $data));
                            //array_push($cluster_data, array("ascore" => $ascore, "parent" => "TODO", "clusters" => $data));
                        }
                        //array_push($dmatches, $cluster_data);
                    }
                }
            }
        }
    
        $json = json_encode(array("status" => true, "matches" => $matches, "diced_matches" => $dmatches, "id" => $job_id, "query" => str_replace("\n", "^", $query)));
        file_put_contents($cache_file, $json);
    }
    print $json;
} else if ($type == "id") {

    $cache_file = "results.json";
    if ($id && preg_match("/^[A-Za-z0-9]+$/", $id)) {
        $out_dir = settings::get_tmpdir_path() . "/" . $id;
        $cache_file = "$out_dir/$cache_file";
        $json = file_get_contents($cache_file);
    } else {
        $file = settings::get_cluster_db_path($version);
        $db = new SQLite3($file);
        $query = preg_replace("/[^A-Z0-9]/i", "", $query);
        $id = $db->escapeString($query);
    
        // First check if this is in the diced clusters.
        //$ascore_sql = "SELECT DID.cluster_id AS cluster_id, DID.ascore AS ascore, DS.uniprot AS uniprot, DS.uniref90 AS uniref90 " .
        //    "FROM diced_id_mapping AS DID LEFT JOIN diced_size AS DS ON (DID.cluster_id = DS.cluster_id AND DID.ascore = DS.ascore) " .
        //    "WHERE DID.uniprot_id = '$id'";
        $ascore_sql = "SELECT DID.cluster_id AS cluster_id, DID.ascore AS ascore,"
            . " DS.uniprot AS uniprot, DS.uniref90 AS uniref90,"
            . " CR.conv_ratio AS conv_ratio,"
            . " NET.name AS name"
            . " FROM diced_id_mapping AS DID"
            . " LEFT JOIN diced_size AS DS ON (DID.cluster_id = DS.cluster_id AND DID.ascore = DS.ascore)"
            . " LEFT JOIN diced_conv_ratio AS CR ON (DID.cluster_id = CR.cluster_id AND DID.ascore = CR.ascore)"
            . " LEFT JOIN diced_network AS DN ON (DID.cluster_id = DN.cluster_id AND DID.ascore = DN.ascore)"
            . " LEFT JOIN network AS NET ON (NET.cluster_id = DN.parent_id)"
            . " WHERE DID.uniprot_id = '$id'";
        $results = $db->query($ascore_sql);
        $cluster_id = array();
        $data = array();
        while ($row = $results->fetchArray()) {
            $parts = explode("-", $row["cluster_id"]);
            array_splice($parts, count($parts)-1);
            $parent = implode("-", $parts);
            $out_row = array("cluster" => $row["cluster_id"], "num_up" => $row["uniprot"], "num_ur" => $row["uniref90"], "cr" => $row["conv_ratio"]);
            array_push($data, array("clusters" => array($out_row), "ascore" => $row["ascore"], "parent" => $row["name"]));
            $cluster_id[$row["ascore"]] = $row["cluster_id"];
        }
    
        if (count($cluster_id) == 0) {
            $cluster_id = "";
            $sql = "SELECT cluster_id FROM id_mapping WHERE uniprot_id = '$id'";
            $results = $db->query($sql);
            while ($row = $results->fetchArray()) {
                // Want bottom-level cluster
                if (strlen($row["cluster_id"]) > $cluster_id)
                    $cluster_id = $row["cluster_id"];
            }
        }
        $db->close();
        
        $job_id = functions::get_id();
        if ((is_array($cluster_id) && count($cluster_id) > 0) || (!is_array($cluster_id) && $cluster_id))
            $json = json_encode(array("status" => true, "cluster_data" => $data, "id" => $job_id, "query" => $id));
        else
            $json = json_encode(array("status" => false, "message" => "ID not found"));
    
        $out_dir = settings::get_tmpdir_path() . "/" . $job_id;
        $cache_file = "$out_dir/$cache_file";
        mkdir($out_dir);
        file_put_contents($cache_file, $json);
    }

    print $json;
} else if ($type == "tax") {
    
    $cache_file = "results.json";
    if ($id && preg_match("/^[A-Za-z0-9]+$/", $id)) {
        $out_dir = settings::get_tmpdir_path() . "/" . $id;
        $cache_file = "$out_dir/$cache_file";
        $json = file_get_contents($cache_file);
    } else {
        $type = filter_input(INPUT_POST, "type", FILTER_SANITIZE_STRING);
        $field = $type == "genus" ? "genus" : ($type == "family" ? "family" : "species");
        $file = settings::get_cluster_db_path($version);
        $db = new SQLite3($file);

        $search_fn = function($results, $has_ascore, $excludes = array()) {
            $count = array();
            $clusters = array();
            $diced_parents = array();
            while ($row = $results->fetchArray()) {
                $cid = $row["cluster_id"] . ($has_ascore ? "-AS" . $row["ascore"] : "");
                if ($has_ascore) {
                    $parent = implode("-", array_slice(explode("-", $row["cluster_id"]), 0, 3));
                    $diced_parents[$parent] = 1;
                }
                if (isset($excludes[$cid]))
                    continue;
                if (!isset($count[$cid])) {
                    $count[$cid] = 0;
                    array_push($clusters, $cid);
                }
                $count[$cid]++;
            }
        
            usort($clusters, function($a, $b) {
                $ap = explode("-", $a);
                $bp = explode("-", $b);
                $maxidx = count($ap) < count($bp) ? count($ap) : count($bp);
                for ($i = 1; $i < $maxidx; $i++) {
                    $ai = preg_replace("/[^0-9]/", "", $ap[$i]);
                    $bi = preg_replace("/[^0-9]/", "", $bp[$i]);
                    if ($ai != $bi)
                        return $ai - $bi;
                }
                return 0;
        
            });

            return array($count, $clusters, $diced_parents);
        };


        $sql = "SELECT cluster_id, ascore, species FROM taxonomy INNER JOIN diced_id_mapping ON taxonomy.uniprot_id = diced_id_mapping.uniprot_id WHERE $field LIKE '%$query%' ORDER BY cluster_id, ascore";
        $results = $db->query($sql);
        list($diced_count, $diced_clusters, $diced_parents) = $search_fn($results, true);

        $query = $db->escapeString($query);
        $sql = "SELECT cluster_id, species FROM taxonomy INNER JOIN id_mapping ON taxonomy.uniprot_id = id_mapping.uniprot_id WHERE $field LIKE '%$query%' ORDER BY cluster_id";
        $results = $db->query($sql);

        list($count, $clusters) = $search_fn($results, false, $diced_parents);

        $matches = array();
        for ($i = 0; $i < count($clusters); $i++) {
            array_push($matches, array($clusters[$i], $count[$clusters[$i]]));
        }

        $diced_matches = array();
        for ($i = 0; $i < count($diced_clusters); $i++) {
            $ascore_match = array();
            $ascore = "";
            $cluster = $diced_clusters[$i];
            if (preg_match("/^(.+)-AS(\d+)$/", $cluster, $ascore_match)) {
                $cluster = $ascore_match[1];
                $ascore = $ascore_match[2];
            }
            array_push($diced_matches, array($cluster, $ascore, $diced_count[$diced_clusters[$i]]));
        }

        usort($diced_matches, function($a, $b) {
            $ap = explode("-", $a[0]);
            $bp = explode("-", $b[0]);
            $aa = implode("-", array_slice($ap, 0, 2));
            $bb = implode("-", array_slice($bp, 0, 2));
            $cmp = strcmp($aa, $bb);
            if (!$cmp) { // same
                $cmp = $a[1] - $b[1];
                if (!$cmp) // same
                    return $ap[3] - $bp[3];
                else
                    return $cmp;
            } else {
                return $cmp;
            }
        });

        $job_id = functions::get_id();
        $json = json_encode(array("status" => true, "matches" => $matches, "diced_matches" => $diced_matches, "id" => $job_id));
        $out_dir = settings::get_tmpdir_path() . "/" . $job_id;
        $cache_file = "$out_dir/$cache_file";
        mkdir($out_dir);
        file_put_contents($cache_file, $json);
    }

    print $json;
} else if ($type == "tax-prefetch") {
    //$field = $type == "genus" ? "genus" : ($type == "family" ? "family" : "species");
    $field = "species";
    $file = settings::get_cluster_db_path($version);
    $db = new SQLite3($file);

    $sql = "SELECT $field FROM taxonomy LIMIT 1000";
    $results = $db->query($sql);

    $data = array();
    while ($row = $results->fetchArray()) {
        array_push($data, $row[$field]);
    }

    print json_encode($data);
} else if ($type == "tax-auto") {
    //$field = $type == "genus" ? "genus" : ($type == "family" ? "family" : "species");
    $field = "species";
    $file = settings::get_cluster_db_path($version);
    $db = new SQLite3($file);

    $query = $db->escapeString($query);
    $sql = "SELECT DISTINCT $field FROM taxonomy WHERE $field LIKE '$query%' LIMIT 100";
    $results = $db->query($sql);

    $data = array();
    while ($row = $results->fetchArray()) {
        array_push($data, $row[$field]);
    }

    print json_encode($data);
}




function hmmscan($out_dir, $hmmdb, $seq_file) {
    $hmmscan = settings::get_hmmscan_path();
    $out_path = "$out_dir/output.txt";
    $table_path = "$out_dir/results.txt";

    $cmd = "$hmmscan -o $out_path --tblout $table_path $hmmdb $seq_file";
    $cmd_output = "";
    $cmd_results = 0;
    exec($cmd, $cmd_output, $cmd_result);

    if ($cmd_result !== 0) {
        print json_encode(array("status" => false, "message" => "An error occurred"));
        exit(0);
    }

    $lines = file($table_path);

    $matches = array();

    for ($i = 0; $i < min(count($lines), 10); $i++) {
        if (!strlen($lines[$i]) || $lines[$i][0] == "#")
            continue;
        $parts = preg_split("/\s+/", $lines[$i]);
        if (count($parts) >= 5) {
            $evalue = floatval($parts[4]);
            if ($evalue < 1e-10)
                array_push($matches, array($parts[0], $parts[4]));
            if (count($matches) == MAX_RESULTS)
                break;
        }
    }
    return $matches;
}


function hmmscan2($out_dir, $hmmdb, $seq_file, $out_file_name = "summary.txt") {
    $hmmscan = settings::get_hmmscan2_path();

    $temp_dir = "$out_dir/temp";
    mkdir($temp_dir);

    $out_file = "$out_dir/$out_file_name";

    $cmd = "source /etc/profile\n";
    $cmd .= "$hmmscan --seq-file $seq_file --db-list-file $hmmdb --temp-dir $temp_dir --output-file $out_file --num-tasks 10";
    $cmd_output = "";
    $cmd_results = 0;
    file_put_contents("$temp_dir/test.txt", "Hi");
    exec($cmd, $cmd_output, $cmd_result);

    if ($cmd_result !== 0) {
        print json_encode(array("status" => false, "message" => "An error in dicing occurred"));
        exit(0);
    }

    $lines = file($out_file);
    $matches = array();
    $cluster_counts = array();

    for ($i = 0; $i < count($lines); $i++) {
        $parts = preg_split("/\s+/", $lines[$i]);
        $parent_cluster = $parts[0];
        $sub_cluster = $parts[2];
        $evalue = floatval($parts[3]);
        if ($parts[1]) {
            $ascore = $parts[1];
            if (!isset($matches[$parent_cluster][$ascore])) {
                $matches[$parent_cluster][$ascore] = array();
                $cluster_counts[$parent_cluster][$ascore] = 0;
            }
            $cluster_counts[$parent_cluster][$ascore]++;
            if ($cluster_counts[$parent_cluster][$ascore] <= MAX_RESULTS)
                array_push($matches[$parent_cluster][$ascore], array($sub_cluster, $evalue));
        } else {
            if (!isset($matches[$parent_cluster])) {
                $matches[$parent_cluster] = array();
                $cluster_counts[$parent_cluster] = 0;
            }
            $cluster_counts[$parent_cluster]++;
            if ($cluster_counts[$parent_cluster] <= MAX_RESULTS)
                array_push($matches[$parent_cluster], array($sub_cluster, $evalue));
        }
    }
    return $matches;
}


function get_parent($diced_db, $first_match) {
    $diced_parent = "";
    $dicing = false;
    foreach ($diced_db as $parent_cluster => $dicings_iter) {
        $cluster = $matches[0][0];
        if ($first_match == $parent_cluster) {
            $dicing_parent = $parent_cluster;
            $dicing = $dicings_iter;
            break;
        }
    }

    return $dicing;
}


function search_diced($out_dir, $dicing_db, $seq_file) {
    $diced_matches = hmmscan2($out_dir, $dicing_db, $seq_file);
    return $diced_matches;
}


