<?php

require_once(__DIR__ . "/includes/main.inc.php");

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$html = $twig->render("index.html.twig", $twig_variables);

echo $html;

