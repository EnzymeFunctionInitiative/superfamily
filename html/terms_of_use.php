<?php
require_once(__DIR__ . "/../init.php");

$twig_variables = array();
$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$html = $twig->render("terms_of_use.html.twig", $twig_variables);

echo $html;

