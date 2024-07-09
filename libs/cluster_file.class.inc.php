<?php


class cluster_file {
    private $dir_path = "";
    private $file_name = "";
    private $handle = null;

    function __construct($dir_path, $file_name) {
        $this->dir_path = $dir_path;
        $this->file_name = $file_name;
        $this->handle = $this->open_file();
    }
    function __destruct() {
        if ($this->handle)
            fclose($this->handle);
    }

    public static function get_files($dir_path) {
        $files = array("cons_res" => array());
        if (!is_dir($dir_path)) {
            return $files;
        }

        $tar_file = $dir_path . "/packed_files.tar";
        if (file_exists($tar_file)) {
            $tar = new PharData($tar_file);
            foreach ($tar as $file) {
                $fname = $file->getFilename();
                $files[$fname] = 1;
            }
        } else {
            $dir_files = scandir($dir_path);
            foreach ($dir_files as $file) {
                $info = pathinfo($file);
                if (!isset($info["extension"])) {
                    continue;
                }
                if ($info["extension"] != "zip") {
                    $files[$info["basename"]] = 1;
                }
            }
        }
        $cons_res_files = array();
        $file_names = array_keys($files);
        foreach ($file_names as $file) {
            if (substr($file, 0, 17) == "consensus_residue")
                array_push($cons_res_files, $file);
        }
        $files["cons_res"] = $cons_res_files;
        return $files;
    }

    // Not entirely accurate since it doesn't check if the file is in the packed tar
    public static function exists($dir_path, $file_name) {
        if (file_exists("$dir_path/$file_name"))
            return true;
        else if (file_exists("$dir_path/packed_files.tar"))
            return true;
        else
            return false;
    }
    public function get_size() {
        $stats = fstat($this->handle);
        return $stats["size"];
    }
    public function get_handle() {
        return $this->handle;
    }
    private function open_file() {
        $tar_file = $this->dir_path . "/packed_files.tar";
        $raw_file = $this->dir_path . "/" . $this->file_name;
        if (file_exists($raw_file)) {
            $fh = fopen($raw_file, "r");
            if (!$fh) {
                die("Unable to read $raw_file");
            }
            return $fh;
        } else if (file_exists($tar_file)) {
            $tar = new PharData($tar_file);
            $temp_fh = null;
            foreach ($tar as $file) {
                $fname = $file->getFilename();
                if ($fname == $this->file_name) {
                    $data = file_get_contents($file->getPathname());
                    $temp_fh = tmpfile();
                    $path = stream_get_meta_data($temp_fh)['uri'];
                    fwrite($temp_fh, $data);
                    fseek($temp_fh, 0);
                    break;
                }
            }
            
            if (!$temp_fh) {
                die("Invalid file requested [1] $tar_file");
            }
            return $temp_fh;
        } else {
            die("Invalid file requested [2]");
        }
    }
}


