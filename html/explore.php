<?php
require_once(__DIR__ . "/../init.php");

$version = functions::validate_version();

if ($version)
    $gnd_key = functions::get_gnd_key($version);

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("gnd_key", $gnd_key);

$html = $twig->render("explore.html.twig", $twig_variables);

echo $html;

