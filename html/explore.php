﻿<?php
require_once(__DIR__ . "/../init.php");

$data_version = functions::validate_version();

if (!$data_version) {
    die("Invalid inputs requested");
}

$gnd_key = functions::get_gnd_key($data_version);
$subgroup_title = settings::get_subgroup_title_prefix();

$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$twig_variables = array(
    "gnd_key" => $gnd_key,
    "subgroup_title" => $subgroup_title,
    "js_ver" => settings::get_js_version(),
    "data_version" => $data_version,
    "page_title", "Exploring the " . settings::get_superfamily_name() . " Superfamily",
);

$html = $twig->render("explore.html.twig", $twig_variables);

echo $html;

