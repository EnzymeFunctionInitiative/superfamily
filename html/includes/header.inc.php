<?php

require_once __DIR__ . "/main.inc.php";

$twig_header_variables = array();

$twig_header_loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig_header = new \Twig\Environment($twig_header_loader);

$header_html = "";
if (file_exists(settings::get_twig_dir() . "/custom/header.html.twig")) {
        $header_html = $twig_header->render("custom/header.html.twig",$twig_header_variables);
}
else {
        $header_html = $twig_header->render("default/header.html.twig",$twig_header_variables);
}

echo $header_html;

?>
