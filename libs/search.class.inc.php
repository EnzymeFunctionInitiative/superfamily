<?php
require_once(__DIR__ . "/functions.class.inc.php");
require_once(__DIR__ . "/settings.class.inc.php");
require_once(__DIR__ . "/hmm_util.class.inc.php");

class search {

    private $version = 0;
    private $db;
    private $hmm_util;
    private $query;

    public function __construct($query, $version, $num_hmm_results) {
        $this->version = $version;
        $file = settings::get_cluster_db_path($version);
        $this->db = new SQLite3($file);
        $this->hmm_util = new hmm_util($num_hmm_results);
        $this->query = $query;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // BLAST SEARCHING
    //
    public function hmm_search($out_dir) {
        $query = $this->query;

        $seq_id = "";
        if (preg_match_all('/^\s*>([^\r\n]+)[\r\n]/m', $query, $matches)) {
            $seq_id = $matches[0][0];
            $seq_id = preg_replace('/^>((tr|sp)\|)?([A-Z0-9]{6,10}).*$/i', '$3', $seq_id);
            $seq = preg_replace('/^\s*>.*?[\r\n]+/', "", $query);
        } else {
            $seq = $query;
        }

        $seq = ">SEQUENCE\n$seq";
        $seq_file = "$out_dir/sequence.txt";
        file_put_contents($seq_file, $seq);

        $hmmdb = functions::get_hmmdb_path($this->version, "all");
        $matches_raw = $this->hmm_util->hmmscan($out_dir, $hmmdb[0], $seq_file);
        if ($matches_raw === false) {
            return false;
        }

        $data = $this->process_blast_search_cluster($matches_raw);
        $matches = array(array("ascore" => "", "parent" => "", "clusters" => $data));

        $dmatches = array();
        $diced_db = functions::get_hmmdb_path($this->version, "diced");

        // Check if matches are the parent diced cluster.  If so, then we search the diced clusters.
        if (count($matches_raw) > 0) {
            $dicings = $this->get_parent($diced_db, $matches_raw[0][0]);
            if ($dicings !== false) {
                $dm = $this->search_diced($out_dir, $dicings, $seq_file);
                if ($dm !== false) {
                    foreach ($dm as $cluster => $cluster_raw) {
                        $cluster_data = array();
                        $sql = "SELECT network.name FROM diced_network LEFT JOIN network ON diced_network.parent_id = network.cluster_id WHERE diced_network.parent_id = '$cluster'";
                        $results = $this->db->query($sql);
                        $row = $results->fetchArray();
                        $parent = $row["name"];
                        foreach ($cluster_raw as $ascore => $dmatches_raw) {
                            $data = $this->process_blast_search_cluster($dmatches_raw, true, $ascore);
                            array_push($dmatches, array("ascore" => $ascore, "parent" => $parent, "clusters" => $data));
                        }
                    }
                }
            }
        }

        $data = array("matches" => $matches, "diced_matches" => $dmatches, "query" => str_replace("\n", "^", $query), "queryId" => $seq_id);
        #$json = json_encode(array("status" => true, "matches" => $matches, "diced_matches" => $dmatches, "id" => $job_id, "query" => str_replace("\n", "^", $query), "queryId" => $seq_id));
        return $data;
    }

    private function get_parent($diced_db, $first_match) {
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


    private function search_diced($out_dir, $dicing_db, $seq_file) {
        $diced_matches = $this->hmm_util->hmmscan2($out_dir, $dicing_db, $seq_file);
        return $diced_matches;
    }


    private function create_blast_search_sql($cluster, $use_diced = false, $ascore = "") {
        $table_prefix = $use_diced ? "diced_" : "";

        $join_sql = "";
        $name_table = "";
        $ascore_sql = "";
        if ($use_diced) {
            $name_table = "network";
            $join_sql =
                " LEFT JOIN network ON network.cluster_id = NET.parent_id"
              . " LEFT JOIN ${table_prefix}conv_ratio AS CR ON (SZ.cluster_id = CR.cluster_id AND SZ.ascore = CR.ascore)"
              . " LEFT JOIN ${table_prefix}network AS NET ON (SZ.cluster_id = NET.cluster_id AND SZ.ascore = NET.ascore)"
              ;
            $ascore_sql = " AND SZ.ascore = '$ascore'";
        } else {
            $name_table = "NET";
            $join_sql =
                " LEFT JOIN ${table_prefix}conv_ratio AS CR ON SZ.cluster_id = CR.cluster_id"
                . " LEFT JOIN ${table_prefix}network AS NET ON SZ.cluster_id = NET.cluster_id"
                ;
        }
        $sql = 
              " SELECT SZ.uniprot AS uniprot, SZ.uniref90 AS uniref90,"
              . " CR.conv_ratio AS conv_ratio,"
              . " $name_table.name AS name"
              . " FROM ${table_prefix}size AS SZ"
              . $join_sql
              . " WHERE SZ.cluster_id = '$cluster'"
              . $ascore_sql
            ;
        return $sql;
    }

    private function process_blast_search_cluster($matches_raw, $use_diced = false, $ascore = "") {
        $data = array();
        foreach ($matches_raw as $match) {
            $sql = $this->create_blast_search_sql($match[0], $use_diced, $ascore);
            $results = $this->db->query($sql);
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
    }

    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // ID SEARCHING
    //
    
    public function id_search() {
    
        $query = preg_replace("/[^A-Z0-9]/i", "", $this->query);
        $uniprot_id = $this->db->escapeString($query);
    
        $ascore_sql = "SELECT DID.cluster_id AS cluster_id, DID.ascore AS ascore,"
            . " DS.uniprot AS uniprot, DS.uniref90 AS uniref90,"
            . " CR.conv_ratio AS conv_ratio,"
            . " NET.name AS name"
            . " FROM diced_id_mapping AS DID"
            . " LEFT JOIN diced_size AS DS ON (DID.cluster_id = DS.cluster_id AND DID.ascore = DS.ascore)"
            . " LEFT JOIN diced_conv_ratio AS CR ON (DID.cluster_id = CR.cluster_id AND DID.ascore = CR.ascore)"
            . " LEFT JOIN diced_network AS DN ON (DID.cluster_id = DN.cluster_id AND DID.ascore = DN.ascore)"
            . " LEFT JOIN network AS NET ON (NET.cluster_id = DN.parent_id)"
            . " WHERE DID.uniprot_id = '$uniprot_id'";
        $results = $this->db->query($ascore_sql);
        $cluster_id = array();
        $data = array();
        while ($row = $results->fetchArray()) {
            $parts = explode("-", $row["cluster_id"]);
            $num = $parts[count($parts)-1];
            array_splice($parts, count($parts)-1);
            $parent = implode("-", $parts);
            $name = $row["name"] . "-$num";
            $out_row = array("cluster" => $row["cluster_id"], "num_up" => $row["uniprot"], "num_ur" => $row["uniref90"], "cr" => $row["conv_ratio"], "name" => $name);
            array_push($data, array("clusters" => array($out_row), "ascore" => $row["ascore"], "parent" => $row["name"]));
            $cluster_id[$row["ascore"]] = $row["cluster_id"];
        }
    
        if (count($cluster_id) == 0) {
            $cluster_id = "";
            $sql = "SELECT cluster_id FROM id_mapping WHERE uniprot_id = '$uniprot_id'";
            $results = $this->db->query($sql);
            while ($row = $results->fetchArray()) {
                // Want bottom-level cluster
                if (strlen($row["cluster_id"]) > $cluster_id)
                    $cluster_id = $row["cluster_id"];
            }
        }
        
        $output_data = array("query" => $uniprot_id);
        if (is_array($cluster_id) && count($cluster_id) > 0) {
            #"cluster_data" => $data, 
            $output_data["cluster_data"] = $data;
        } else if (!is_array($cluster_id) && $cluster_id) {
            $output_data["cluster_id"] = $cluster_id;
        } else {
            return false;
        }
        return $output_data;
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // TAXONOMY SEARCHING
    //

    public function taxonomy_species_query() {    
        $query = $this->db->escapeString($this->query);
        $field = "species";
        $sql = "SELECT DISTINCT $field FROM taxonomy WHERE $field LIKE '$query%' LIMIT 100";
        $results = $this->db->query($sql);

        $data = array();
        while ($row = $results->fetchArray()) {
            array_push($data, $row[$field]);
        }
        return $data;
    }


    public function taxonomy_species_prefetch() {
        //$field = $type == "genus" ? "genus" : ($type == "family" ? "family" : "species");
        $field = "species";

        $sql = "SELECT $field FROM taxonomy LIMIT 1000";
        $results = $this->db->query($sql);

        $data = array();
        while ($row = $results->fetchArray()) {
            array_push($data, $row[$field]);
        }
    }


    public function taxonomy_search($tax_type) {
        $field = $tax_type == "genus" ? "genus" : ($tax_type == "family" ? "family" : "species");
        $query = trim($this->query);

        $sql = "SELECT T.species AS species, T.uniprot_id AS uniprot_id"
            . " FROM taxonomy AS T"
            . " WHERE T.$field LIKE '%$query%'";
        $results = $this->db->query($sql);
        $tax_data = array();
        while ($row = $results->fetchArray()) {
            $tax_data[$row["uniprot_id"]] = $row["species"];
        }
        $data = array();
        foreach ($tax_data as $id => $species) {
            $out_row = $this->process_tax_row($id, $species);
            array_push($data, $out_row);
        }

        usort($data, function ($a, $b) {
            $aa = $a["cluster"];
            $bb = $b["cluster"];
            
            $ao = $a["organism"];
            $bo = $b["organism"];
            //if (strlen($ao) < strlen($bo))
            //    return -1;
            //else if (strlen($ao) > strlen($bo))
            //    return 1;
            $cmp = strcmp($ao, $bo);
            if ($cmp !== 0)
                return $cmp;

            $ap = explode("-", $aa);
            $bp = explode("-", $bb);
            $maxidx = count($ap) < count($bp) ? count($ap) : count($bp);
            for ($i = 1; $i < $maxidx; $i++) {
                $ai = preg_replace("/[^0-9]/", "", $ap[$i]);
                $bi = preg_replace("/[^0-9]/", "", $bp[$i]);
                if ($ai != $bi)
                    return $ai - $bi;
            }
            return 0;
        });

        $cluster_data = array("matches" => $data, "query" => $query);
        return $cluster_data;
    }


    private function process_tax_row($id, $species) {
        $sql = "SELECT function FROM swissprot WHERE uniprot_id = '$id'";
        $results = $this->db->query($sql);
        $row = $results->fetchArray();
        if ($results && isset($row["function"]))
            $status = "sp";
        else
            $status = "tr";

        $sql = "SELECT cluster_id FROM id_mapping WHERE uniprot_id = '$id' ORDER BY LENGTH(cluster_id) DESC";
        $results = $this->db->query($sql);
        $row = $results->fetchArray();
        $cluster_id = $row["cluster_id"];
        $out_row = array("cluster" => $cluster_id, "organism" => $species, "uniprot_id" => $id, "status" => $status, "name" => "", "parent" => "");

        $sql = "SELECT name AS name FROM network WHERE cluster_id = '$cluster_id'";
        $results = $this->db->query($sql);
        $row = $results->fetchArray();
        if ($row)
            $out_row["name"] = $row["name"];
        return $out_row;
    }
    
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // UTILITY
    //
}


