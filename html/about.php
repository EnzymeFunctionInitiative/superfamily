<?php 

require_once 'includes/header.inc.php';

$twig_variables = array();

$loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig = new \Twig\Environment($loader);

$about_html = "";
if (file_exists(settings::get_twig_dir() . "/custom/about.html.twig")) {
	$about_html = $twig->render("custom/about.html.twig",$twig_variables);
}
else {
	$about_html = $twig->render("default/about.html.twig",$twig_variables);
}

echo $about_html;
require_once 'includes/footer.inc.php'; i

?>

