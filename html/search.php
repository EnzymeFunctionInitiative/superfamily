<?php
require_once(__DIR__ . "/../init.php");

$version = functions::validate_version();

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);
$twig->addGlobal("version", $version);

$html = $twig->render("search.html.twig", $twig_variables);

echo $html;

