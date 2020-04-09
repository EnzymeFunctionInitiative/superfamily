<?php

class superfamily {


	public static function get_cluster($db, $cluster_id) {
		$data = array(
			"size" => array(
			"uniprot" => 0,
			"uniref90" => 0,
			"uniref50" => 0,
		),
		"name" => "",
		"desc" => "",
		"image" => "",
		"title" => "",
		"display" => array(),
		"download" => array(),
		"regions" => array(),
		"subgroups" => array(),
		"public" => array(
		"kegg_count" => 0,
		"swissprot" => array(),
		"pdb" => array(),
		),
		"anno" => array(),
		"pubs" => array(),
		"families" => array(
			"tigr" => array(),
		),
		);

		$info = self::get_network_info($db, $cluster_id);
		$data["name"] = $info["name"];
		$data["title"] = $info["title"];
		$data["desc"] = $info["desc"];
		$data["image"] = $cluster_id;
		$data["public"]["kegg_count"] = self::get_kegg($db, $cluster_id, true);
		$data["size"] = self::get_sizes($db, $cluster_id);
		$data["public"]["swissprot"] = self::get_swissprot($db, $cluster_id);
		$data["public"]["pdb"] = self::get_pdb($db, $cluster_id);
		$data["families"]["tigr"] = self::get_tigr($db, $cluster_id);
		$data["display"] = self::get_display($db, $cluster_id);
		$data["download"] = self::get_download($db, $cluster_id);
		$data["regions"] = self::get_regions($db, $cluster_id);

		return $data;
	}

	public static function get_network_info($db, $cluster_id) {
		$sql = "SELECT * FROM network WHERE cluster_id = :id";
		$sth = $db->prepare($sql);
		$sth->bindValue("id", $cluster_id);
		$sth->execute();
		$row = $sth->fetch();
		if ($row)
			return $row;
		else
		return array("cluster_id" => $cluster_id, "name" => "", "title" => "", "desc" => "");
	}

	public static function get_all_network_names($db) {
		$sql = "SELECT network.cluster_id, name, uniprot, uniref50, uniref90 FROM network LEFT JOIN size on network.cluster_id = size.cluster_id";
		$sth = $db->prepare($sql);
		$sth->execute();
		$data = array();
		while ($row = $sth->fetch()) {
			$data[$row["cluster_id"]] = array("name" => $row["name"], "size" => array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]));
		}
		return $data;
	}

	public static function get_sfld_map($db) {
		$sql = "SELECT * FROM sfld_map";
		$sth = $db->prepare($sql);
		$sth->execute();
		$data = array();
		while ($row = $sth->fetch()) {
			$cid = $row["cluster_id"];
			if (!is_array($data[$cid]))
				$data[$cid] = array();
				array_push($data[$cid], $row["sfld_id"]);
		}
		return $data;
	}

	public static function get_sfld_desc($db) {
		$sql = "SELECT * FROM sfld_desc";
		$sth = $db->prepare($sql);
		$sth->execute();
		$data = array();
		while ($row = $sth->fetch()) {
			$data[$row["sfld_id"]] = array("desc" => $row["sfld_desc"], "color" => $row["sfld_color"]);
		}
		return $data;
	}

	public static function get_display($db, $cluster_id) {
		return array("weblogo", "length_histogram");
	}

	public static function get_download($db, $cluster_id) {
		return array("weblogo", "msa", "hmm", "id_fasta", "misc");
	}


	public static function get_generic_fetch($db, $cluster_id, $sql, $handle_row_fn, $check_only = false) {
		$sth = $db->prepare($sql);
		if (!$sth)
			return $check_only ? 0 : array();
		$sth->bindValue("id", $cluster_id);
		$sth->execute();
		$data = array();
		while ($row = $sth->fetch()) {
			if ($check_only)
				return $handle_row_fn($row);
			array_push($data, $handle_row_fn($row));
		}
		return $check_only ? 0 : $data;
	}

	public static function get_generic_sql($table, $parm, $extra_where = "", $check_only = false) {
		if ($check_only)
			$sql = "SELECT COUNT(*) AS $parm FROM $table WHERE cluster_id = :id $extra_where";
		else
			$sql = "SELECT $parm FROM $table WHERE cluster_id = :id $extra_where";
		return $sql;
	}

	public static function get_kegg($db, $cluster_id, $check_only = false) {
		$sql = self::get_generic_sql("kegg", "kegg", "", $check_only);
		$row_fn = function($row) { return $row["kegg"]; };
		return self::get_generic_fetch($db, $cluster_id, $sql, $row_fn, $check_only);
	}

	public static function get_swissprot($db, $cluster_id, $check_only = false) {
		$sql = self::get_generic_sql("swissprot", "function, GROUP_CONCAT(uniprot_id) AS ids", "GROUP BY function ORDER BY function", $check_only);
    		$row_fn = function($row) { return array($row["function"], $row["ids"]); };
		return self::get_generic_fetch($db, $cluster_id, $sql, $row_fn);
	}

	public static function get_pdb($db, $cluster_id, $check_only = false) {
		$sql = self::get_generic_sql("pdb", "pdb, uniprot_id", "", $check_only);
		$row_fn = function($row) { return array($row["pdb"], $row["uniprot_id"]); };
		return self::get_generic_fetch($db, $cluster_id, $sql, $row_fn);
	}

	public static function get_tigr($db, $cluster_id, $check_only = false) {
		$sql = self::get_generic_sql("families", "family", "AND family_type = 'TIGR'", $check_only);
		$row_fn = function($row) { return $row["family"]; };
		return self::get_generic_fetch($db, $cluster_id, $sql, $row_fn);
	}

	public static function get_enzyme_codes($db) {
		$sql = "SELECT * FROM enzymecode";
		$sth = $db->prepare($sql);
		$sth->execute();
		$data = array();
		while ($row = $sth->fetch()) {
			$data[$row["code_id"]] = $row["desc"];
		}
		return $data;
	}

	public static function get_regions($db, $cluster_id) {
		$sql = self::get_generic_sql("region", "*", "ORDER BY region_index", $check_only);
    		$row_fn = function($row) {
			$data = array();
			$data["id"] = $row["region_id"];
			$data["name"] = $row["name"];
			$data["number"] = $row["number"];
			$data["coords"] = array_map(function($c) { return floatval($c); }, explode(",", $row["coords"]));
			return $data;
		};
		return self::get_generic_fetch($db, $cluster_id, $sql, $row_fn);
	}

	public static function get_sizes($db, $id) {
		$sql = "SELECT * FROM size WHERE cluster_id = :id";
		$row_fn = function($row) {
			return array("uniprot" => $row["uniprot"], "uniref90" => $row["uniref90"], "uniref50" => $row["uniref50"]);
		};
		$result = self::get_generic_fetch($db, $id, $sql, $row_fn);
		return (count($result) > 0 ? $result[0] : array());
	}


	public static function validate_action($action) {
		return ($action == "cluster" || $action == "kegg" || $action == "netinfo" || $action == "tax");
	}

	public static function validate_cluster_id($db, $id) {
		$sql = "SELECT name FROM network WHERE cluster_id = :id";
		$sth = $db->prepare($sql);
		$sth->bindValue("id", $id);
		if (!$sth->execute())
			return false;
		if ($sth->fetch())
			return true;
		else
			return false;
	}

}

?>
