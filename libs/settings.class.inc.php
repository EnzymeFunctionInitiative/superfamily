<?php

require_once(__DIR__ . "/../conf/settings.inc.php");

class settings {
    public static function get_title() {
        return defined("__TITLE__") ? __TITLE__ : "Superfamily";
    }
    public static function get_hmmscan_path() {
        return defined("__HMMSCAN_LEGACY__") ? __HMMSCAN_LEGACY__ : "";
    }
    public static function get_hmmscan2_path() {
        return defined("__HMMSCAN__") ? __HMMSCAN__ : "";
    }
    public static function get_hmmscan_env() {
        return defined("__HMMSCAN_ENV__") ? __HMMSCAN_ENV__ : "";
    }
    public static function get_hmm_db_dir($version) {
        $dir = self::get_base_dir_path($version);
        $dir = "$dir/".__HMM_DB_DIR_NAME__;
        return $dir;
    }
    public static function get_default_hmm_db_name() {
        return __DEFAULT_HMM_DB__;
    }
    public static function get_tmpdir_path() {
        return __TEMP_DIR__;
    }
    # Version must be validated before calling!!!!
    public static function get_base_dir_path($version = "") {
        $dir = __DATA_BASE_DIR__;
        if ($version)
            $dir = "$dir/" . self::get_data_dir_name($version);
        return $dir;
    }
    public static function get_data_dir_name ($version) {
        return self::get_version_prefix() . "-$version";
    }
    public static function get_cluster_db_path($version) {
        $dir = self::get_base_dir_path($version);
        return "$dir/" . self::get_db_file_name();
    }
    public static function get_db_file_name() {
        return __DATA_DB_FILE_NAME__;
    }

    public static function get_submit_email() {
        return defined("__SUBMIT_EMAIL__") ? __SUBMIT_EMAIL__ : "";
    }
    public static function get_version() {
        return defined("VERSION") ? VERSION : "";
    }
    public static function get_twig_dir() {
        $twig_dir = __DIR__ . "/../" . TWIG_DIR;
        return realpath($twig_dir);
    }

    public static function get_gnd_key_path($version) {
        $key_path = self::get_base_dir_path($version) . "/" . __GND_KEY_FILE_NAME__;
        return $key_path;
    }

    public static function get_version_prefix() {
        return __DATA_VERSION_PREFIX__;
    }
    public static function get_version_db_file() {
        return self::get_base_dir_path() . "/" . __DATA_VERSION_FILE__;
    }
    public static function get_default_version() {
        return __DEFAULT_VERSION__;
    }

    public static function get_database_type() {
        return defined("__DATABASE_TYPE__") ? __DATABASE_TYPE__ : "sqlite3";
    }

    public static function get_smtp_host() {
        return defined("__SMTP_HOST__") ? __SMTP_HOST__ : "";
    }
    public static function get_smtp_port() {
        return defined("__SMTP_PORT__") ? __SMTP_PORT__ : "";
    }
    public static function get_smtp_user() {
        return defined("__SMTP_USER__") ? __SMTP_USER__ : "";
    }
    public static function get_smtp_password() {
        return defined("__SMTP_PASSWORD__") ? __SMTP_PASSWORD__ : "";
    }
    public static function get_from_email() {
        return defined("__FROM_EMAIL__") ? __FROM_EMAIL__ : "";
    }
    public static function get_to_email() {
        return defined("__TO_EMAIL__") ? __TO_EMAIL__ : "";
    }

    public static function get_default_max_hmm_results() {
        return defined("__DEFAULT_MAX_RESULTS__") ? __DEFAULT_MAX_RESULTS__ : 3;
    }

    public static function get_subgroup_title_prefix() {
        return defined("__SUBGROUP_TITLE_PREFIX__") ? __SUBGROUP_TITLE_PREFIX__ : "";
    }
    public static function get_js_version() {
        return defined("__JS_VERSION__") ? __JS_VERSION__ : "1";
    }
    public static function get_superfamily_name() {
        return defined("__SUPERFAMILY_NAME__") ? __SUPERFAMILY_NAME__ : "";
    }
}

