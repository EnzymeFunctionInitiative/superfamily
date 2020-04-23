<?php require_once 'includes/header.inc.php'; 

$twig_search_variables = array();

$twig_search_loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$twig_search = new \Twig\Environment($twig_search_loader);

$search_html = "";
if (file_exists(settings::get_twig_dir() . "/custom/search.html.twig")) {
        $search_html = $twig_search->render("custom/search.html.twig",$twig_search_variables);
}
else {
        $search_html = $twig_search->render("default/search.html.twig",$twig_search_variables);
}

echo $search_html;


require_once 'includes/footer.inc.php'; 

?>

