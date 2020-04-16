<?php

$twig_footer_variables = array(
	'title'=>settings::get_title()
	);

$footer_loader = new \Twig\Loader\FilesystemLoader(settings::get_twig_dir());
$footer_twig = new \Twig\Environment($footer_loader);

$footer_html = "";
if (file_exists(settings::get_twig_dir() . "/custom/footer.html.twig")) {
        $footer_html = $footer_twig->render("custom/footer.html.twig",$twig_footer_variables);
}
else {
        $footer_html = $footer_twig->render("default/footer.html.twig",$twig_footer_variables);
}


echo $footer_html;
?>

</body>
</html>
