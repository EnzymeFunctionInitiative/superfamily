<?php
require_once(__DIR__ . "/../init.php");

$version = functions::validate_version();
$version_name = settings::get_version_name();

if ($version)
    $gnd_key = functions::get_gnd_key($version);

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("gnd_key", $gnd_key);
$twig->addGlobal("version_name", $version_name);
$twig->addGlobal("version", $version);
$twig->addGlobal("page_title", "Exploring the " . settings::get_superfamily_name() . " Superfamily");

$html = $twig->render("explore.html.twig", $twig_variables);

echo $html;

