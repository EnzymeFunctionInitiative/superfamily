<?php

set_include_path(get_include_path() . ':' . __DIR__ . '/libs');

require_once(__DIR__ . '/conf/app.inc.php');
require_once(__DIR__ . '/conf/settings.inc.php');
require_once(__DIR__ . '/vendor/autoload.php');

function my_autoloader($class_name) {
    if (file_exists(__DIR__ . "/libs/" . $class_name . ".class.inc.php")) {
        require_once($class_name . '.class.inc.php');
    }
}

spl_autoload_register('my_autoloader');


