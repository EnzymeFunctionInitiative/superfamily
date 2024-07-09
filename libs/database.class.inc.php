<?php
require_once(__DIR__ . "/../init.php");
require_once(__LIB_DIR__ . "/functions.class.inc.php");
require_once(__LIB_DIR__ . "/settings.class.inc.php");

class database {

    private $version = 0;
    private $db;
    private $hmm_util;
    private $query;

    public function __construct($version) {
        $this->version = $version;
        $db_type = settings::get_database_type($version);
        if ($db_type == "mysql") {
            $this->db = self::connect_db();
            $this->status_db = $this->db;
        } else {
            $file = settings::get_cluster_db_path($version);
            //$this->db = new SQLite3($file);
            $this->db = new PDO("sqlite:$file");
            $this->status_db = self::connect_db();
        }
    }
    private static function connect_db() {
        try {
            $db = new \IGBIllinois\db(__MYSQL_HOST__,__MYSQL_DATABASE__,__MYSQL_USER__,__MYSQL_PASSWORD__);
            return $db;
        } catch (Exception $e) {
            return null;
        }
    }

    public function query($sql, $params = null) {
        if (is_array($params))
            return $this->db->query($sql, $params);
        else
            return $this->db->query($sql);
    }

    public function update_status($sql, $params) {
        return $this->status_db->non_select_query($sql, $params);
    }
    public function insert_status($params) {
        return $this->status_db->build_insert($params);
    }
    public function build_insert_status($table, $params) {
        $this->status_db->build_insert($table, $params);
    }

}

