<?php

require_once(__DIR__ . "/includes/main.inc.php");

$version = functions::validate_version();
$v3 = $version === "3.0" ? "3" : "";

if ($version)
    $gnd_key = functions::get_gnd_key($version);

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("gnd_key", $gnd_key);

$html = $twig->render("explore$v3.html.twig", $twig_variables);

echo $html;

