<?php

require_once(__DIR__ . "/includes/main.inc.php");

$v3 = (isset($_GET["v"]) && $_GET["v"] == "3.0") ? "3" : "";

$gnd_key = settings::get_gnd_key();

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("gnd_key", $gnd_key);

$html = $twig->render("explore$v3.html.twig", $twig_variables);

echo $html;

