<?php
require_once(__DIR__ . "/../init.php");

$data_version = functions::validate_version();

if (!$data_version) {
    die("Invalid inputs requested");
}

$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("version", $version);

$twig_variables = array("data_version" => $data_version);
$html = $twig->render("search.html.twig", $twig_variables);

echo $html;

