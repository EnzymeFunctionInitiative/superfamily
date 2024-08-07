<?php

require_once(__DIR__ . "/settings.class.inc.php");


class functions {
    public static function get_id() {
        $key = uniqid (rand (),true);
        $hash = sha1($key);
        return $hash;
    }
    //public static function get_database($version = "") {
    //    $file = settings::get_cluster_db_path($version);
    //    try {
    //        $db = new PDO("sqlite:$file");
    //    } catch (PDOException $e) {
    //        return null;
    //    }
    //    return $db;
    //}
    public static function get_cache_file($out_dir) {
        return "$out_dir/results.json";
    }
    public static function get_output_dir($job_id) {
        $dir = settings::get_tmpdir_path() . "/" . $job_id;
        return $dir;
    }
    public static function get_data_dir_path($cluster = "", $version = "", $ascore = "", $child_id = "") {
        $rel_dir = functions::get_rel_data_dir_path($cluster, $version, $ascore, $child_id);
        $path = dirname(__FILE__) . "/../html";
        $path = "$path/$rel_dir";
        return $path;
    }
    public static function get_rel_data_dir_path($cluster = "", $version = "", $ascore = "", $child_id = "") {
        $dir = settings::get_data_dir_name($version);
        if (preg_match("/^[a-z0-9\-]+$/", $cluster)) {
            $dir = "$dir/$cluster";
            if (is_numeric($ascore)) {
                $dir = "$dir/dicing-$ascore";
                if ($child_id)
                    $dir = "$dir/$child_id";
            }
        }
        return $dir;
    }

    public static function validate_version($version = "") {
        return self::filter_version2($version);
    }
    public static function filter_version($version = "") {
        if (!$version)
            $version = $_GET["v"];
        if (!$version)
            $version = settings::get_default_version();
        return $version;
    }
    public static function filter_version2($version = "") {
        if (!$version && isset($_GET["v"]))
            $version = $_GET["v"];
        if (!$version)
            $version = settings::get_default_version();

        if (!preg_match("/^[\d\.]+$/", $version))
            return false;
        
        $fpath = settings::get_version_db_file();
        $lines = file($fpath);
        if ($lines === false)
            return false;

        for ($i = 0; $i < count($lines); $i++) {
            if (trim($lines[$i]) == $version)
                return $version;
        }
        return false;
    }

    public static function validate_cluster_id($db, $id) {
        $check_fn = function($db, $id, $table_name, $col_name) {
            $sql = "SELECT $col_name FROM $table_name WHERE cluster_id = :id";
            $results = $db->query($sql, array(":id" => $id));
            //$sth = $db->prepare($sql);
            //if (!$sth)
            //    return false;
            //$sth->bindValue("id", $id);
            //if (!$sth->execute())
            //    return false;
            //$results = $sth->fetch();
            if ($results)
                return true;
            else
                return false;
        };

        if ($check_fn($db, $id, "network", "cluster_name"))
            return true;
        else if ($check_fn($db, $id, "diced_network", "cluster_id"))
            return true;
        else
            return false;
    }

    public static function get_ssn_path($db, $cluster) {
        $sql = "SELECT ssn FROM ssn WHERE cluster_id = :id";
        $results = $db->query($sql, array(":id" => $cluster));
        if (!$results)
            return false;
        $data = $results[0];
        //$sth->bindValue("id", $cluster);
        //$data = false;
        //if ($sth->execute()) {
        //    $data = $sth->fetch();
        //}
        return $data;
    }

    public static function get_generic_sql($table, $parm, $extra_where = "", $check_only = false) {
        if ($check_only)
            $sql = "SELECT COUNT(*) AS $parm FROM $table WHERE cluster_id = :id $extra_where";
        else
            $sql = "SELECT $parm FROM $table WHERE cluster_id = :id $extra_where";
        return $sql;
    }
    public static function get_generic_fetch($db, $cluster_id, $sql, $handle_row_fn, $check_only = false) {
        $params = array(":id" => $cluster_id);
        $results = $db->query($sql, $params);
        if (!$results) {
            return $check_only ? 0 : array();
        }
        $data = array();
        foreach ($results as $row) {
            if ($check_only)
                return $handle_row_fn($row);
            $data_row = $handle_row_fn($row);
            array_push($data, $data_row);
        }
        return $check_only ? 0 : $data;
    }
    public static function get_dicing_parent($db, $cluster_id, $ascore = "") {
        //        $sql = "SELECT parent_id FROM dicing WHERE cluster_id = :id";
        $sql = "SELECT parent_id FROM diced_network WHERE cluster_id = :id";
        $params = array(":id" => $cluster_id);
        if ($ascore) {
            $sql .= " AND ascore = :ascore";
            $params[":ascore"] = $ascore;
        }
        $results = $db->query($sql, $params);
        if (!$results)
            return "";
        $row = $results[0];
        return $row["parent_id"];
    }
    // Same as get_data_dir_path but checks for dicing
    public static function get_data_dir_path2($db, $version, $ascore, $cluster_id) {
        $parent_cluster_id = functions::get_dicing_parent($db, $cluster_id, $ascore);
        $child_cluster_id = "";
        if ($parent_cluster_id) {
            $child_cluster_id = $cluster_id;
        } else {
            $parent_cluster_id = $cluster_id;
        }
        $basepath = functions::get_data_dir_path($parent_cluster_id, $version, $ascore, $child_cluster_id);
        return $basepath;
    }

    public static function send_headers($filename, $filesize, $type = "application/octet-stream") {
        header('Pragma: public');
        header('Expires: 0');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        header('Cache-Control: private', false);
        header('Content-Transfer-Encoding: binary');
        header('Content-Disposition: attachment; filename="' . $filename . '";');
        header('Content-Type: ' . $type);
        header('Content-Length: ' . $filesize);
    }
    public static function send_file($file) {
        $handle = fopen($file, 'rb');
        self::send_file_handle($handle);
        fclose($handle);
    }
    public static function send_file_handle($handle) {
        $chunkSize = 1024 * 1024;
        while (!feof($handle)) {
            $buffer = fread($handle, $chunkSize);
            echo $buffer;
            ob_flush();
            flush();
        }
    }
    public static function send_text($text_string, $file_name) {
        $file_size = strlen($text_string);
        self::send_headers($file_name, $file_size, "application/octet-stream");
        ob_clean();
        echo $text_string;
    }

    public static function get_gnd_key ($version) {
        $key_path = settings::get_gnd_key_path($version);
        if (!file_exists($key_path))
            return "";
        $key = file_get_contents($key_path);
        $key = trim($key); // somehow a new line is getting put in here somewhere
        return $key;
    }
    
    public static function get_hmmdb_path($version, $group) {
        $dir = settings::get_hmm_db_dir($version);
        //if (!$group || $group == "all" || !preg_match("/^[a-z]+$/", $group) || !file_exists("$dir/$group.txt")) {
        if (!$group || $group == "all" || !preg_match("/^[a-z]+$/", $group) || !preg_match("/^dic(ed|ing)/", $group)) {
            $file = "$dir/" . settings::get_default_hmm_db_name();
            if (file_exists($file))
                return array($file);
            else
                return false;
        }

        $db_files = glob("$dir/$group-*");
        $db_list = array();
        foreach ($db_files as $filename) {
            preg_match("/dic(ed|ing)-(cluster-[\-0-9]+)\.txt$/", $filename, $matches);
            $cluster = $matches[2];
            $db_list[$cluster] = $filename;
        }
        return $db_list;
//        $lines = file("$dir/$group.txt");
//        $db_list = array();
//        for ($i = 0; $i < count($lines); $i++) {
//            $line = trim($lines[$i]);
//            $parts = explode("\t", $line);
//            if (count($parts) >= 3) {
//                $file = "$dir/" . $parts[2]; // added in a later step . ".hmm";
//                if (!isset($db_list[$parts[0]]))
//                    $db_list[$parts[0]] = array();
//                array_push($db_list[$parts[0]], array($parts[1], $file));
//            }
//        }
//        return $db_list;
    }

    public static function get_generic_join_sql($qversion, $table, $parm, $extra_where = "", $ascore = "", $check_only = false, $extra_join = "") {
        $use_uniprot_id_join = $qversion ? false : true;
        return self::get_generic_join_sql_shared($use_uniprot_id_join, $qversion, $table, $parm, $extra_where, $ascore, $check_only, $extra_join);
    }
    public static function get_generic_join_sql_shared($use_uniprot_id_join, $qversion, $table, $parm, $extra_where = "", $ascore = "", $check_only = false, $extra_join = "") {
        if (!$qversion || $use_uniprot_id_join) {
            $join_table = $ascore ? "diced_id_mapping" : "id_mapping";
            $sql = "SELECT $parm FROM $table INNER JOIN $join_table ON $table.uniprot_id = $join_table.uniprot_id $extra_join WHERE $join_table.cluster_id = :id";
            if ($ascore)
                $sql .= " AND $join_table.ascore = '$ascore'";
            if ($extra_where)
                $sql .= " $extra_where";
            if ($check_only)
                $sql .= " LIMIT 1";
            return $sql;
        } else {
            if ($qversion && $ascore)
                $extra_where .= " AND ascore = '$ascore'";
            return functions::get_generic_sql($table, $parm, $extra_where, $check_only);
        }
    }
    
    public static function table_exists($db, $table_name, $column_name = "") {
        $sql = "PRAGMA table_info(:table_name)";
        $results = $db->query($sql, array(":table_name" => $table_name));
        $table_exists = 0;
        $column_exists = 0;
        foreach ($results as $row) {
            $table_exists = 1;
            if (!$column_name || (isset($row[1]) && $row[1] == $column_name)) {
                $column_exists = 1;
                break;
            }
        }
        if ($column_name) {
            return $column_exists;
        } else {
            return $table_exists;
        }
    }
}

