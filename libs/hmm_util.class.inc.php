<?php

class hmm_util {

    private $num_results = 0;

    public function __construct($num_results = 0) {
        $this->num_results = $num_results > 0 ? $num_results : settings::get_default_max_hmm_results();
    }

    public function hmmscan($out_dir, $hmmdb, $seq_file) {
        $hmmscan = settings::get_hmmscan_path();
        $out_path = "$out_dir/output.txt";
        $table_path = "$out_dir/results.txt";
    
        $cmd = "$hmmscan -o $out_path --tblout $table_path $hmmdb $seq_file";
        $cmd_output = "";
        $cmd_results = 0;
        exec($cmd, $cmd_output, $cmd_result);

        if ($cmd_result !== 0) {
            return false;
        }
    
        $lines = file($table_path);
    
        $matches = array();
    
        for ($i = 0; $i < min(count($lines), 10); $i++) {
            if (!strlen($lines[$i]) || $lines[$i][0] == "#")
                continue;
            $parts = preg_split("/\s+/", $lines[$i]);
            if (count($parts) >= 5) {
                $evalue = floatval($parts[4]);
                if ($evalue < 1e-1)
                    array_push($matches, array($parts[0], $parts[4]));
                if (count($matches) == $this->num_results)
                    break;
            }
        }
        return $matches;
    }
    
    
    public function hmmscan2($out_dir, $hmmdb, $seq_file, $out_file_name = "summary.txt") {
        $hmmscan = settings::get_hmmscan2_path();
    
        $temp_dir = "$out_dir/temp";
        mkdir($temp_dir);
    
        $out_file = "$out_dir/$out_file_name";

        $hmmscan_bin = settings::get_hmmscan_path();
        $cmd = settings::get_hmmscan_env();
        if ($cmd)
            $cmd .= "\n";
        $cmd .= "$hmmscan --seq-file $seq_file --db-list-file $hmmdb --temp-dir $temp_dir --output-file $out_file --num-tasks 10 --hmmscan $hmmscan_bin";
        $cmd_output = "";
        $cmd_results = 0;
        exec($cmd, $cmd_output, $cmd_result);
    
        if ($cmd_result !== 0) {
            return false;
            //print json_encode(array("status" => false, "message" => "An error in dicing occurred"));
            //exit(0);
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
                if ($cluster_counts[$parent_cluster][$ascore] <= $this->num_results)
                    array_push($matches[$parent_cluster][$ascore], array($sub_cluster, $evalue));
            } else {
                if (!isset($matches[$parent_cluster])) {
                    $matches[$parent_cluster] = array();
                    $cluster_counts[$parent_cluster] = 0;
                }
                $cluster_counts[$parent_cluster]++;
                if ($cluster_counts[$parent_cluster] <= $this->num_results)
                    array_push($matches[$parent_cluster], array($sub_cluster, $evalue));
            }
        }
        return $matches;
    }
}


