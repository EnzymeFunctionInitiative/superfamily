<?php
require_once(__DIR__ . "/functions.class.inc.php");

class tax_data {

    public static function get_tax_data($db, $cluster_id, $ascore, $qversion) {
        $uniref_join = "LEFT JOIN uniref_map ON taxonomy.uniprot_id = uniref_map.uniprot_id";
        $uniref_parm = ", uniref_map.uniref50_id, uniref_map.uniref90_id";
        $sql = functions::get_generic_join_sql($qversion, "taxonomy", "taxonomy.* $uniref_parm", "", $ascore, false, $uniref_join);
        $results = $db->query($sql, array(":id" => $cluster_id));
        if (!$results)
            return array();
    
        $tree = array();
        #$mk_struct_fn = function($name) { return array("ns" => 0, "node" => $name, "children" => array()); };
        $add_data_fn = function($domain, $kingdom, $phylum, $class, $taxorder, $family, $genus, $species, $uniprot, $uniref50, $uniref90) use (&$tree) {
            if (!isset($tree[$domain]))
                $tree[$domain] = array();
            if (!isset($tree[$domain][$kingdom]))
                $tree[$domain][$kingdom] = array();
            if (!isset($tree[$domain][$kingdom][$phylum]))
                $tree[$domain][$kingdom][$phylum] = array();
            if (!isset($tree[$domain][$kingdom][$phylum][$class]))
                $tree[$domain][$kingdom][$phylum][$class] = array();
            if (!isset($tree[$domain][$kingdom][$phylum][$class][$taxorder]))
                $tree[$domain][$kingdom][$phylum][$class][$taxorder] = array();
            if (!isset($tree[$domain][$kingdom][$phylum][$class][$taxorder][$family]))
                $tree[$domain][$kingdom][$phylum][$class][$taxorder][$family] = array();
            if (!isset($tree[$domain][$kingdom][$phylum][$class][$taxorder][$family][$genus]))
                $tree[$domain][$kingdom][$phylum][$class][$taxorder][$family][$genus] = array();
            if (!isset($tree[$domain][$kingdom][$phylum][$class][$taxorder][$family][$genus][$species]))
                $tree[$domain][$kingdom][$phylum][$class][$taxorder][$family][$genus][$species] = array("sequences" => array());
            $leaf_data = array("numDomains" => 0, "seedSeq" => 0, "sa" => $uniprot, "sa50" => $uniref50, "sa90" => $uniref90);
            //$leaf_data = array("numDomains" => 0, "seedSeq" => 0, "sa" => $uniprot);
            array_push($tree[$domain][$kingdom][$phylum][$class][$taxorder][$family][$genus][$species]["sequences"], $leaf_data);
        };
    
        foreach ($results as $row) {
            $add_data_fn($row["domain"], $row["kingdom"], $row["phylum"], $row["class"], $row["taxorder"], $row["family"], $row["genus"], $row["species"], $row["uniprot_id"], $row["uniref50_id"], $row["uniref90_id"]);
            //$add_data_fn($row["domain"], $row["kingdom"], $row["phylum"], $row["class"], $row["taxorder"], $row["family"], $row["genus"], $row["species"], $row["uniprot_id"]);
        }
    
        # Convert tree into something that the sunburst libraries like
        $data = array("nq" => 0, "ns" => 0, "node" => "Root", "children" => array());
        $species_map = array();

        $id_ref = 1;
        list($kids, $num_seq, $num_species) = self::traverse_tree($tree, "root", $species_map, 1, $id_ref);
        $data["children"] = $kids;
        $data["nq"] = $num_seq;
        $data["ns"] = $num_species;
        $data["node"] = "Root";
        $data["d"] = 0;
        $data["id"] = 0;
    
        return $data;
    }
    public static function traverse_tree($tree, $parent_name, $species_map, $level, &$id_ref) {
        $num_species = 0;
        $num_seq = 0;
        $data = array();
        foreach ($tree as $name => $group) {
            if ($name == "sequences") {
                if (!isset($species_map[$parent_name])) {
                    $num_species += 1; //TODO: figure out why the pfam website sometimes returns numSpecies = 0???a
                    $species_map[$parent_name] = 1;
                }
                $num_seq += count($group);
            } else {
                $struct = array("node" => $name, "id" => $id_ref);
                $id_ref++;
                list($kids, $num_seq_next, $num_species_next) = self::traverse_tree($group, strtolower($name), $species_map, $level + 1, $id_ref);
                $struct["nq"] = $num_seq_next;
                $struct["ns"] = $num_species_next;
                $struct["d"] = $level;
    
                if (isset($group["sequences"]))
                    $struct["seq"] = $group["sequences"];
    
                $num_seq += $num_seq_next;
                $num_species += $num_species_next;
                $kids = array_map(function($x) use ($name) { $x["parent"] = $name; return $x; }, $kids);
                if (count($kids))
                    $struct["children"] = $kids;
                #var_dump($struct);
                #print "<br>";
                array_push($data, $struct);
            }
        }
        return array($data, $num_seq, $num_species);
    }
}


